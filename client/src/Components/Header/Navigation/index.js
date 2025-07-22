import Button from '@mui/material/Button'
import { IoIosMenu } from 'react-icons/io';
import { FaAngleDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { FaAngleRight } from "react-icons/fa";
import { MyContext } from '../../../App';
import { Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navigation = (props) => {
    const navigate = useNavigate();
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 0) {
            navigate('/');
        } else {
            const category = context.categoryData[newValue - 1];
            if (category) {
                navigate(`/category/${category._id}`);
            }
        }
    };
    const [isOpenSidebarVal, setIsOpenSidebarVal] = useState(false);
    const context = useContext(MyContext)
    return (
        <nav>
            <div className='container'>
                <div className='row'>
                    <div className='col-sm-2 navPart1'>
                        <div className='catWrapper'>
                            <Button className='allCartTab align-items-center' onClick={() => setIsOpenSidebarVal(!isOpenSidebarVal)}>
                                <span className='icon1 me-2'><IoIosMenu /></span>
                                <span className='text'>ALL CATEGORIES</span>
                                <span className='icon2 ms-2'><FaAngleDown /></span>
                            </Button>
                            <div className={`sidebarNav ${isOpenSidebarVal === true ? 'open' : ''}`}>
                                <ul>
                                    <li><Link to="/"><Button>Men<FaAngleRight className='ms-auto' /></Button></Link>
                                        <div className='submenu shadow'>
                                            <Link to="/"><Button>Clothing</Button></Link>
                                            <Link to="/"><Button>Footwear</Button></Link>
                                            <Link to="/"><Button>Watches</Button></Link>
                                        </div>
                                    </li>
                                    <li><Link to="/"><Button>Women<FaAngleRight className='ms-auto' /></Button></Link>
                                        <div className='submenu shadow'>
                                            <Link to="/"><Button>Clothing</Button></Link>
                                            <Link to="/"><Button>Footwear</Button></Link>
                                            <Link to="/"><Button>Watches</Button></Link>
                                        </div>
                                    </li>
                                    <li><Link to="/"><Button>Beauty</Button></Link></li>
                                    <li><Link to="/"><Button>Watches</Button></Link></li>
                                    <li><Link to="/"><Button>Kids</Button></Link></li>
                                    <li><Link to="/"><Button>Gift</Button></Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className='col-sm-10 navPart2 d-flex align-items-center'>
                        <ul className='list-inline ms-auto'>
                            <li className='list-inline-item'>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="scrollable tabs"
                                    className='w-75'
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
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navigation;