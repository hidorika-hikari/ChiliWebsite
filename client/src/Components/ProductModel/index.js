import ProductZoom from '../ProductZoom';
import { Button, Rating, Dialog } from '@mui/material';
//import QuantityBox from '../QuantityDrop';
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
    const [loading] = useState(false);

    const addToMyList = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            context.setAlertBox({ open: true, error: true, msg: "Please login to continue" });
            return;
        }

        if (isAddedtoMyList) {
            context.setAlertBox({ open: true, error: false, msg: "Already in wishlist" });
            return;
        }
        setAddedToMyList(true);

        try {
            const res = await postData("/api/my-list/add/", {
                productTitle: props?.data?.name,
                images: props?.data?.images?.[0],
                rating: props?.data?.rating,
                price: props?.data?.price,
                productId: props?.data?.id,
                userId: user?.userId
            });

            if (res.status) {
                context.setAlertBox({ open: true, error: false, msg: "The product was added to your wishlist"});
            } else {
                setAddedToMyList(false);
                context.setAlertBox({ open: true, error: true, msg: res.msg || "Something went wrong"});
            }
        } catch (err) {
            setAddedToMyList(false);
            context.setAlertBox({ open: true, error: true, msg: "Network error, please try again" });
        }
    };

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
                            {/* <QuantityBox /> */}
                        </div>
                        <div className='d-flex align-items-center mt-3 actions'>
                            <Button
                                className='btn-round btn-sml'
                                variant='outlined'
                                onClick={addToMyList}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>⏳ Adding...</>
                                ) : isAddedtoMyList ? (
                                    <>
                                        <FaHeart className='text-danger' />
                                        &nbsp; ADDED TO WISHLIST
                                    </>
                                ) : (
                                    <>
                                        <IoIosHeartEmpty />
                                        &nbsp; ADD TO WISHLIST
                                    </>
                                )}
                            </Button>

                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default ProductModel;