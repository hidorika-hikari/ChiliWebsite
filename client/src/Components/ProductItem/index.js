import Rating from "@mui/material/Rating";
import Button from '@mui/material/Button'
import { TfiFullscreen } from "react-icons/tfi";
import { CiHeart } from "react-icons/ci";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";

const ProductItem = (props) => {

    const context = useContext(MyContext);
    const [isAddedToMyList, setAddedToMyList] = useState(false);
    const viewProductDetails = (id) => {
        context.setIsOpenProductModel({
            id: id,
            open: true
        });
    }

    const addToMyList = (id) => {
    const user = JSON.parse(localStorage.getItem("user"));
        if (user !== undefined && user !== null && user !== '') {
            const item = props.item;
            const data = {
                productTitle: item?.name,
                images: item?.images?.[0],
                rating: item?.rating,
                price: item?.price,
                productId: id,
                userId: user?.userId
            }
            postData(`/api/my-list/add/`, data).then((res) => {
                setAddedToMyList(true);
                if (res.status !== false) {
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
        const productId = props.itemView === 'recentlyView'
            ? props.item?.prodId || props.item?.proId
            : props.item?.id;

        if (user && productId) {
            postData('/api/my-list/check', {
                productId,
                userId: user.userId
            }).then(res => {
                if (res.status && res.isAdded) {
                    setAddedToMyList(true);
                }
            });
        }
    }, [props.itemView, props.item]);

    return (
        <>
            <div className={`productItem ${props.itemView}`}>
                <Link to={`/product/${props?.itemView === 'recentlyView' ? props.item?.prodId : props.item?.id}`}>
                    <div className="imgWrapper">
                        <img src={props.item?.images[0]} alt=""
                            className="w-100" style={{ objectFit: "cover" }} />
                        <span className="badge badge-primary">{props.item?.discount} 🌶️</span>
                        <div className="actions">
                            <Button onClick={() => viewProductDetails(props.item?.id)}><TfiFullscreen /></Button>
                            <Button className={isAddedToMyList ? 'active' : ''}
                                onClick={() => addToMyList(props?.itemView === 'recentlyView' ? props.item?.proId : props.item?.id)}>
                                {
                                    isAddedToMyList === true ? <FaHeart className="wishlist-icon" style={{ fontSize: '20px' }} /> : <CiHeart style={{ fontSize: '20px' }} />
                                }
                            </Button>
                        </div>
                    </div>

                    <div className="info">
                        <h4>{props?.item?.name}</h4>
                        <span className={`d-block ${props.item?.countInStock ? 'text-success' : 'text-danger'}`}>
                            {props.item?.countInStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        <Rating className="mt-2 mb-2" name="read-only" value={props?.item?.rating} readOnly size="small" precision={0.5} />

                        <div className="d-flex">
                            <span className="oldPrice">{props?.item?.oldPrice}฿</span>
                            <span className="newPrice text-danger ms-2">{props?.item?.price}฿</span>
                        </div>
                    </div>
                </Link>
            </div>
        </>
    )
}

export default ProductItem;