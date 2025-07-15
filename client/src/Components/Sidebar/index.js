import FormControlLabel from "@mui/material/FormControlLabel";
import 'range-slider-input/dist/style.css';
import Slider from '@mui/material/Slider';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MyContext } from "../../App";
import { Rating } from "@mui/material";

const Sidebar = (props) => {
    const [value, setValue] = useState([100, 10000]);
    const context = useContext(MyContext);
    const [filterSubCat, setFilterSubCat] = useState();
    const [subCatId, setSubCatId] = useState('');
    const { id } = useParams();

    useEffect(() => {
        setSubCatId(id)
    }, [id])

    const handleChange = (event) => {
        const selectedId = event.target.value;
        setFilterSubCat(selectedId);
        setSubCatId(selectedId);
        props.filterData(selectedId);
    };

    const filterByRating = (rating) => {
        props.filterByRating(rating);
    }

    useEffect(() => {
        if (subCatId) {
            props.filterByPrice(value, subCatId);
        }
    }, [value, subCatId]);

    return (
        <>
            <div className="sidebar">
                <div className="filterBox">
                    <h6>PRODUCT CATEGORIES</h6>
                    <div className="scroll">
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={filterSubCat}
                            onChange={handleChange}
                        >
                            {
                                context.subCategoryData?.length !== 0 && context.subCategoryData?.map((item, index) => {
                                    return (
                                        <FormControlLabel value={item?.id} control={<Radio />} label={item?.subCat} />
                                    )
                                })
                            }
                        </RadioGroup>
                    </div>
                </div>

                <div className="filterBox">
                    <h6>FILTER BY PRICE</h6>
                    <Slider
                        value={value}
                        onChange={(e, newValue) => setValue(newValue)}
                        valueLabelDisplay="auto"
                        min={100}
                        max={10000}
                        step={5}
                    />

                    <div className="d-flex justify-content-between mt-2">
                        <span>From: <strong className="text-success">{value[0]}฿</strong></span>
                        <span>To: <strong className="text-success">{value[1]}฿</strong></span>
                    </div>
                </div>
                <br />
                <div className="filterBox">
                    <h6>FILTER BY RATING</h6>
                    <div className="scroll ps-0">
                        <ul style={{ paddingLeft: 0 }}>
                            <li onClick={() => filterByRating(5)}><Rating name="read-only" value={5} readOnly size="small"/></li>
                            <li onClick={() => filterByRating(4)}><Rating name="read-only" value={4} readOnly size="small"/></li>
                            <li onClick={() => filterByRating(3)}><Rating name="read-only" value={3} readOnly size="small"/></li>
                            <li onClick={() => filterByRating(2)}><Rating name="read-only" value={2} readOnly size="small"/></li>
                            <li onClick={() => filterByRating(1)}><Rating name="read-only" value={1} readOnly size="small"/></li>
                        </ul>
                    </div>
                </div>
                <Link to="#"><img src="https://muybuenoblog.com/wp-content/uploads/2020/09/chiles-740x920.jpg" className="w-100" alt="" /></Link>

                { /* <div className="filterBox">
                    <h6>PRODUCT STATUS</h6>
                    <div className="scroll">
                        <ul style={{ paddingLeft: 0 }}>
                            <li>
                                <FormControlLabel className="w-100" control={<Checkbox />}
                                    label="In Stock" />
                            </li>
                            <li>
                                <FormControlLabel className="w-100" control={<Checkbox />}
                                    label="On Sales" />
                            </li>
                        </ul>
                    </div>
                </div> */}
            </div>
        </>
    );
};

export default Sidebar;