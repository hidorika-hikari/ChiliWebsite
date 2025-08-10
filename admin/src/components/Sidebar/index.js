import Button from "@mui/material/Button";
import { FaProductHunt } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";
import { IoMdListBox, IoMdLogOut } from "react-icons/io";
import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { TbCategoryFilled } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AiFillPicture } from "react-icons/ai";
import { MyContext } from "../../App";

const Sidebar = () => {

    const context = useContext(MyContext);
    const history = useNavigate();

    const [activeTab, setActiveTab] = useState(0);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);
    
    const isOpenSubmenu = (index) => {
        setActiveTab(index);
        setIsToggleSubmenu(!isToggleSubmenu);
    }

    const logout = () => {
        localStorage.clear();
        context.setAlertBox({
            open: true,
            error: false,
            msg: "Logout Successfully"
        })
        setTimeout(() => {
            //history('/login');
            window.location.href = '/login';
        },1500);
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token !== "" && token !== undefined && token !== null){
        } else {
            history('/login')
        }
    }, [history]);

    return (
        <>
            <div className="sidebar">
                <ul>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 0 ? 'active' : ''}`} onClick={() => isOpenSubmenu(0)}>
                                <span className="icon"><MdDashboard /></span>
                                    Dashboard
                                <span className="arrow"><FaAngleRight/></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Button className={`w-100 ${activeTab === 1 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(1)}>
                            <span className="icon"><FaProductHunt/></span>
                                Products
                            <span className="arrow"><FaAngleRight/></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 1 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className="submenu">
                                <li><Link to={'/products'}>Product List</Link></li>
                                <li><Link to={'/product/add'}>Product Add</Link></li>
                                <li><Link to={'/productContent/add'}>Product Content</Link></li>
                                <li><Link to={'/productWeight/add'}>Product Weight</Link></li>
                                <li><Link to={'/productSpicy/add'}>Product Spicy Level</Link></li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Button className={`w-100 ${activeTab === 2 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
                            <span className="icon"><TbCategoryFilled/></span>
                                Category
                            <span className="arrow"><FaAngleRight/></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 2 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className="submenu">
                                <li><Link to={'/category'}>Category List</Link></li>
                                <li><Link to={'/category/add'}>Add Category</Link></li>
                                <li><Link to={'/subCategory'}>Subcategory List</Link></li>
                                <li><Link to={'/subCategory/add'}>Add Subcategory</Link></li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Link to="/orders">
                        <Button className={`w-100 ${activeTab === 3 ? 'active' : ''}`} onClick={() => isOpenSubmenu(3)}>
                                <span className="icon"><IoMdListBox /></span>
                                    Orders
                                <span className="arrow"><FaAngleRight/></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Button className={`w-100 ${activeTab === 4 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(4)}>
                            <span className="icon"><AiFillPicture /></span>
                                Banner
                            <span className="arrow"><FaAngleRight/></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 4 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className="submenu">
                                <li><Link to={'/homeBanner/add'}>HomeBanner</Link></li>
                                <li><Link to={'/homeBannerList'}>HomeBanner List</Link></li>
                            </ul>
                        </div>
                    </li>
                </ul>
                <br/>
                <div className="logoutWrapper">
                    <div className="logoutBox">
                        <Button variant="contained" onClick={logout}><IoMdLogOut/>Logout</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar;