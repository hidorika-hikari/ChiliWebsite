import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Rating from "@mui/material/Rating";
import { IoIosHeartEmpty } from "react-icons/io";
import { useContext } from 'react';
import { MdClose } from "react-icons/md";
import { MdCompareArrows } from "react-icons/md";
import { MyContext } from '../../App';
import { IoCartSharp } from 'react-icons/io5';
import ProductZoom from '../ProductZoom';
import QuantityBox from '../QuantityDrop';

const ProductModel = (props) => {

    const context = useContext(MyContext);

    return (
        <>
            
            <Dialog open={true} className="productModel" onClose={()=> context.setIsOpenProductModel(false)}>
                <Button className='close_' onClick={()=> context.setIsOpenProductModel(false)}><MdClose/></Button>
                <h4 className='mb-1 fw-bold'>Carolina Reaper Chile Peppers</h4>
                <div className='d-flex align-items-center'>
                    <div className='d-flex align-items-center me-4'>
                        <span>Brands</span>
                        <span className='ms-2'><b>Welch's</b></span>
                    </div>
                    <Rating name="read-only" value={5} readOnly size="small" precision={0.5}/>
                </div>

                <hr/>
                
                <div className='row mt-2 produceDetailsModel'>
                    <div className='col-md-5'>
                        <ProductZoom/>
                    </div>

                    <div className='col-md-7'>
                        <div className='d-flex info align-items-center mb-3'>
                            <span className='oldPrice lg me-2'>9.35</span>
                            <span className='newPrice text-danger lg'>7.35</span>
                        </div>
                        
                        <span className='badge bg-success'>IN STOCK</span>

                        <p className='mt-2'>The Carolina Reaper chile pepper is typically oblong with a signature pointed "scorpion’s tail." 
                            It measures 2–5 cm in diameter and 5–7 cm in length, featuring deeply wrinkled, twisted red skin. 
                            Its flesh is crisp and juicy, with a few flat, cream-colored seeds. The flavor is sweet and fruity, 
                            with notes of cinnamon and chocolate, followed by an extremely intense, lingering heat. 
                            Appearance and heat can vary based on soil and climate.

                        </p>
                        <div className='d-flex align-items-center'>
                            <QuantityBox/>
                            <Button className='btn-blue btn-lg btn-big bth-round me-3'>
                            <IoCartSharp/>Add to Cart</Button>
                        </div>

                        <div className='d-flex align-items-center mt-5 actions'>
                        <Button className='btn-round btn-sml' variant='outlined'>
                            <IoIosHeartEmpty/> &nbsp; ADD TO WISHLIST</Button>
                        <Button className='btn-round btn-sml' variant='outlined'>
                            <MdCompareArrows/> &nbsp; COMPARE</Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default ProductModel;