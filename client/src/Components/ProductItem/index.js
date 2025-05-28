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

    const closeProductModel = () => {
        context.setIsOpenProductModel(false);
    }

    return (
        <>
            <div className={`productItem ${props.itemView}`}>
                <div className="imgWrapper">
                    <img src="https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-3-346x310.jpg"
                    className="w-100"/>

                    <span className="badge badge-primary">28%</span>
                    
                    <div className="actions">
                        <Button onClick={ () => viewProductDetails()}><TfiFullscreen/></Button>
                        <Button><CiHeart style={{ fontSize:'20px'}}/></Button>
                    </div>
                </div>
                    
                    <div className="info">
                        <h4> Weather's Original Caramel Hard Candies</h4>
                        <span className="text-success d-block">In Stock</span>
                        <Rating className="mt-2 mb-2" name="read-only" value={5} readOnly size="small" precision={0.5}/>

                        <div className="d-flex">
                            <span className="oldPrice">20.00</span>
                            <span className="newPrice text-danger ms-2">14.00</span>
                        </div>
                    </div>
            </div>
        </>
    )
}

export default ProductItem;