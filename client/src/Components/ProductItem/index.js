import { TfiFullscreen } from "react-icons/tfi";
import { CiHeart } from "react-icons/ci";
import Rating from "@mui/material/Rating";
import Button from '@mui/material/Button'
import { useContext } from "react";
import { MyContext } from "../../App";

const ProductItem = (props) => {

    const context = useContext(MyContext);

    const viewProductDetails = (id) => {
        context.setIsOpenProductModel(true);
    }

    return (
        <>
            <div className={`productItem ${props.itemView}`}>
                <div className="imgWrapper">
                    <img src={props.item?.images[0]} alt=""
                    className="w-100" style={{ objectFit: "cover" }}/>

                    <span className="badge badge-primary">28%</span>
                    
                    <div className="actions">
                        <Button onClick={ () => viewProductDetails()}><TfiFullscreen/></Button>
                        <Button><CiHeart style={{ fontSize:'20px'}}/></Button>
                    </div>
                </div>
                    
                    <div className="info">
                        <h4>{props?.item?.name}</h4>
                        <span className="text-success d-block">In Stock</span>
                        <Rating className="mt-2 mb-2" name="read-only" value={props?.item?.rating} readOnly size="small" precision={0.5}/>

                        <div className="d-flex">
                            <span className="oldPrice">{props?.item?.oldPrice}฿</span>
                            <span className="newPrice text-danger ms-2">{props?.item?.price}฿</span>
                        </div>
                    </div>
            </div>
        </>
    )
}

export default ProductItem;