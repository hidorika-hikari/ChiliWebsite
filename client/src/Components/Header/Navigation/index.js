import { IoIosMenu } from 'react-icons/io';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import { useContext, useState } from 'react';
import { MyContext } from '../../../App';
import { Tabs, Tab, Button } from '@mui/material';
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
        <nav className="py-2">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-12 col-sm-3 col-md-2 navPart1 mb-2 mb-sm-0">
                        <div className="catWrapper">
                        <Button
                            className="btn-red allCartTab d-flex align-items-center justify-content-between w-100 mt-3"
                            onClick={() => setIsOpenSidebarVal(!isOpenSidebarVal)}
                        >
                            <span className="d-flex align-items-center">
                                <IoIosMenu className="hamburgerIcon me-2" />

                                <span className="categoryText d-none d-md-inline">
                                    PRODUCTS
                                </span>
                            </span>

                            <FaAngleDown className="angleIcon" />
                        </Button>

                            <div className={`sidebarNav position-absolute bg-white shadow ${isOpenSidebarVal ? 'open' : ''}`}
                                style={{ zIndex: 1000, minWidth: '200px' }}
                            >
                                <ul className="list-unstyled mb-0 p-2">
                                    {props.navData.filter((item, idx) => idx < 10).map((item) => {
                                        const subs = context.subCategoryData?.filter(
                                            sub => sub.category === item._id || sub.category?._id === item._id
                                        );
                                        return (
                                            <li key={item._id} className="mb-1">
                                                <Button
                                                    className="w-100 d-flex justify-content-between align-items-center"
                                                    onClick={() => {
                                                        setTimeout(() => {
                                                            navigate(`/products/category/${item._id}`);
                                                        }, 500);
                                                    }}
                                                >
                                                    {item?.name}
                                                    {subs?.length > 0 && <FaAngleRight />}
                                                </Button>

                                                {subs?.length > 0 && (
                                                    <div className="submenu ps-3 mt-1">
                                                        {subs.map(sub => (
                                                            <Button
                                                                key={sub._id}
                                                                className="w-100 text-start mb-1"
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

                    <div className="col-12 col-sm-9 col-md-10 navPart2" style={{ overflow: 'hidden' }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                            aria-label="scrollable tabs"

                        >
                            <Tab key="home" label="Home" />
                            {context.categoryData?.map((item, index) => (
                                <Tab
                                    key={item._id || index}
                                    className="item text-truncate"
                                    label={item.name}
                                />
                            ))}
                        </Tabs>
                    </div>
                </div>
            </div>

            {isOpenSidebarVal && <div
                onClick={() => setIsOpenSidebarVal(false)}
            />}
        </nav>
    )
}

export default Navigation;