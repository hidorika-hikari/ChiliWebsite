import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Rating from "@mui/material/Rating";
import ProductZoom from '../ProductZoom';
import QuantityBox from '../QuantityDrop';
import { IoIosHeartEmpty } from "react-icons/io";
import { useContext, useEffect, useState } from 'react';
import { MdClose } from "react-icons/md";
import { MyContext } from '../../App';
import { IoCartSharp } from 'react-icons/io5';
import { FaHeart } from "react-icons/fa6";
import { postData } from '../../utils/api';

const ProductModel = (props) => {

    const context = useContext(MyContext);
    const [isAddedtoMyList, setAddedToMyList] = useState(false);
    const addToMyList = (id) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user !== undefined && user !== null && user !== '') {
            const data = {
                productTitle: props?.item?.name,
                images: props.item?.images[0],
                rating: props?.item?.rating,
                price: props?.item?.price,
                productId: id,
                userId: user?.userId
            }
            postData(`/api/my-list/add/`, data).then((res) => {
                if (res.status !== false) {
                    setAddedToMyList(true);
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "The product added in my list"
                    })
                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: res.msg
                    })
                }
            })
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Please Login to Continue"
            })
        }
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && props.data?.id) {
            postData('/api/my-list/check', {
                productId: props.data?.id,
                userId: user.userId
            }).then(res => {
                if (res.status && res.isAdded) {
                    setAddedToMyList(true);
                }
            });
        }
    }, [props.data?.id]);
    
    return (
        <>
            <Dialog open={true} className="productModel" onClose={() => context.setIsOpenProductModel(false)}>
                <Button className='close_' onClick={() => context.setIsOpenProductModel(false)}><MdClose /></Button>
                <h4 className='mb-1 fw-bold'>{props?.data?.name}</h4>
                <div className='d-flex align-items-center'>
                    <div className='d-flex align-items-center me-4'>
                        <span>Brands</span>
                        <span className='ms-2'><b>{props?.data?.brand}</b></span>
                    </div>
                    <Rating name="read-only" value={parseInt(props?.data?.rating)} readOnly size="small" precision={0.5} />
                </div>
                <br />
                <div className='row mt-2 produceDetailsModel'>
                    <div className='col-md-5'>
                        <ProductZoom images={props?.data?.images} discount={props?.data?.discount} />
                    </div>

                    <div className='col-md-7'>
                        <div className='d-flex info align-items-center mb-3'>
                            <span className='oldPrice lg me-2'>{props?.data?.oldPrice}฿</span>
                            <span className='newPrice text-danger lg'>{props?.data?.price}฿</span>
                        </div>

                        <span className={`badge ${props?.data?.countInStock > 0 ? 'bg-success' : 'bg-danger'}`}>
                        {props?.data?.countInStock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                        </span>
                        <p className='mt-2'>{props?.data?.description}</p>
                        <div className='d-flex align-items-center'>
                            <QuantityBox />
                            <Button className='btn-blue btn-lg btn-big bth-round me-3'>
                                <IoCartSharp />Add to Cart</Button>
                        </div>
                        <div className='d-flex align-items-center mt-5 actions'>
                            <Button
                                className='btn-round btn-sml'
                                variant='outlined'
                                onClick={() => addToMyList(props?.data?.id)}
                            >
                                {
                                    isAddedtoMyList === true
                                        ? <>
                                            <FaHeart className='text-danger'/>
                                            &nbsp; ADDED TO WISHLIST
                                        </>
                                        : <>
                                            <IoIosHeartEmpty />
                                            &nbsp; ADD TO WISHLIST
                                        </>
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default ProductModel;