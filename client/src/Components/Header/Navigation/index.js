import Button from '@mui/material/Button'
import { IoIosMenu } from 'react-icons/io';
import { FaAngleDown } from 'react-icons/fa';
import { useContext, useState } from 'react';
import { FaAngleRight } from "react-icons/fa";
import { MyContext } from '../../../App';
import { Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navigation = (props) => {

    const context = useContext(MyContext)
    const navigate = useNavigate();

    const [value, setValue] = useState(0);
    const [isOpenSidebarVal, setIsOpenSidebarVal] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    
        setTimeout(() => {
            if (newValue === 0) {
                navigate('/');
            } else {
                const category = context.categoryData[newValue - 1];
                if (category) {
                    navigate(`/products/category/${category._id}`);
                }
            }
        }, 500);
    };
    
    return (
        <nav>
            <div className='container'>
                <div className='row'>
                    <div className='col-sm-2 navPart1'>
                        <div className='catWrapper'>
                            <Button className='btn-blue allCartTab align-items-center' onClick={() => setIsOpenSidebarVal(!isOpenSidebarVal)}>
                                <span className='icon1 me-2'><IoIosMenu /></span>
                                <span className='text'>ALL CATEGORIES</span>
                                <span className='icon2 ms-2'><FaAngleDown /></span>
                            </Button>
                            <div className={`sidebarNav ${isOpenSidebarVal ? 'open' : ''}`}>
                                <ul>
                                    {props.navData.filter((item, idx) => idx < 6).map((item) => {
                                        const subs = context.subCategoryData?.filter(
                                            sub => sub.category === item._id || sub.category?._id === item._id
                                        );
                                        return (
                                            <li key={item._id}>
                                                <Button
                                                    onClick={() => {
                                                        setTimeout(() => {
                                                            navigate(`/products/category/${item._id}`);
                                                        }, 500);
                                                    }}
                                                >
                                                    {item?.name}
                                                    {subs?.length > 0 && <FaAngleRight className='ms-auto' />}
                                                </Button>

                                                {item?.children?.length !== 0 && subs?.length > 0 && (
                                                    <div className='submenu shadow'>
                                                        {subs.map(sub => (
                                                            <Button
                                                                key={sub._id}
                                                                onClick={() => {
                                                                    setTimeout(() => {
                                                                        navigate(`/products/subCat/${sub._id}`);
                                                                    }, 500);
                                                                }}
                                                            >
                                                                {sub.subCat}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className='col-sm-10 navPart2 d-flex justify-content-center'>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="scrollable tabs"
                            sx={{ color: 'black' }}
                            className='w-100'
                        >
                            <Tab key="home" label="Home" />
                            {context.categoryData?.map((item, index) => (
                                <Tab
                                    key={item._id || index}
                                    className="item"
                                    label={item.name}
                                />
                            ))}
                        </Tabs>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navigation;