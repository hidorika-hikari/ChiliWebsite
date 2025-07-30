import { MdMenuOpen, MdOutlineLightMode, MdOutlineMailOutline, MdOutlineMenu } from "react-icons/md";
import { Link } from "react-router-dom";
import { IoCartOutline, IoShieldHalfSharp } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa";
import { useContext, useState } from "react";
import logo from "../../assets/images/logo.png";
import Button from '@mui/material/Button';
import SearchBox from "../SearchBox";
import React from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Logout from '@mui/icons-material/Logout';
import Divider from "@mui/material/Divider";
import { MyContext } from "../../App";
import UserAvatarImgComponent from "../userAvatarImg";

const Header = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const [isOpenNotifications, setIsOpenNotificationsDrop] = useState(false);
    const openNotifications = Boolean(isOpenNotifications);
    const openMyAcc = Boolean(anchorEl);
    //const history = useNavigate();
    const context = useContext(MyContext);

    const handleOpenMyAccDrop = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMyAccDrop = () => {
        setAnchorEl(null);
    };

    const handleOpenNotificationsDrop = () => {
        setIsOpenNotificationsDrop(true);
    }

    const handleCloseNotificationsDrop = () => {
        setIsOpenNotificationsDrop(false);
    }

    const logout = () => {
        localStorage.clear();
        setAnchorEl(null);
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

    return (
    <>
        <header className="d-flex align-items-center">
            <div className="container-fluid w-100">
                <div className="row d-flex align-items-center">
                    <div className="col-sm-2 part1">
                        <Link to={"/"} className="d-flex align-items-center logo">
                            <img src={logo} alt="logo"></img>
                            <span className="ms-2">CHILI WEBSITE</span>
                        </Link>
                    </div>

                    <div className="col-sm-3 d-flex align-items-center part2 res-hide">
                        <Button className="rounded-circle me-3" onClick={()=>context.setIsToggleSidebar(!context.isToggleSidebar)}>
                            {
                                context.isToggleSidebar === false ? <MdMenuOpen/> : <MdOutlineMenu/>
                            }
                        </Button>
                        <SearchBox/>
                    </div>
                    
                    <div className="col-sm-7 d-flex align-items-center justify-content-end part3">
                        <Button className="rounded-circle me-3" onClick={()=>context.setThemeMode(!context.themeMode)}>
                            <MdOutlineLightMode/></Button>
                        <Button className="rounded-circle me-3"><IoCartOutline/></Button>
                        <Button className="rounded-circle me-3"><MdOutlineMailOutline/></Button>
                        
                        <div className="dropDownWrapper">
                            <Button className="rounded-circle me-3"><FaRegBell
                            onClick={handleOpenNotificationsDrop}/></Button>

                            <Menu
                                    anchorEl={isOpenNotifications}
                                    className="notifications dropdown_list"
                                    id="notifications"
                                    open={openNotifications}
                                    onClose={handleCloseNotificationsDrop}
                                    onClick={handleCloseNotificationsDrop}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <div className="head ps-3 pb-0">
                                        <h4>Orders (12)</h4>
                                    </div>

                                    <Divider className="mb-1"/>

                                    <div className="scroll">
                                        <MenuItem onClick={handleCloseNotificationsDrop}>
                                            <div className="d-flex">
                                                <div>
                                                    <UserAvatarImgComponent img={'https://i.scdn.co/image/ab67616d00001e026f157409ae8578b9695be2b3'}/>
                                                </div>

                                                <div className="dropdownInfo">
                                                    <h4>
                                                        <span>
                                                            <b>Mahmudal</b>
                                                            added to his favorite list
                                                            <b>Leather belt steve madden</b>
                                                        </span>
                                                    </h4>
                                                    <p className="text-sky">few seconds ago</p>
                                                </div>
                                            </div>
                                        </MenuItem>

                                        <MenuItem onClick={handleCloseNotificationsDrop}>
                                            <div className="d-flex">
                                                <div>
                                                    <div className="userImg">
                                                        <span className="rounded-circle">
                                                            <img src="https://i.scdn.co/image/ab67616d00001e026f157409ae8578b9695be2b3" alt="user_avatar"/>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="dropdownInfo">
                                                    <h4>
                                                        <span>
                                                            <b>Mahmudal</b>
                                                            added to his favorite list
                                                            <b>Leather belt steve madden</b>
                                                        </span>
                                                    </h4>
                                                    <p className="text-sky">few seconds ago</p>
                                                </div>
                                            </div>
                                        </MenuItem>

                                        <MenuItem onClick={handleCloseNotificationsDrop}>
                                            <div className="d-flex">
                                                <div>
                                                    <div className="userImg">
                                                        <span className="rounded-circle">
                                                            <img src="https://i.scdn.co/image/ab67616d00001e026f157409ae8578b9695be2b3" alt="user_avatar"/>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="dropdownInfo">
                                                    <h4>
                                                        <span>
                                                            <b>Mahmudal</b>
                                                            added to his favorite list
                                                            <b>Leather belt steve madden</b>
                                                        </span>
                                                    </h4>
                                                    <p className="text-sky">few seconds ago</p>
                                                </div>
                                            </div>
                                        </MenuItem>
                                        
                                        <MenuItem onClick={handleCloseNotificationsDrop}>
                                            <div className="d-flex">
                                                <div>
                                                    <div className="userImg">
                                                        <span className="rounded-circle">
                                                            <img src="https://i.scdn.co/image/ab67616d00001e026f157409ae8578b9695be2b3" alt="user_avatar"/>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="dropdownInfo">
                                                    <h4>
                                                        <span>
                                                            <b>Mahmudal</b>
                                                            added to his favorite list
                                                            <b>Leather belt steve madden</b>
                                                        </span>
                                                    </h4>
                                                    <p className="text-sky">few seconds ago</p>
                                                </div>
                                            </div>
                                        </MenuItem>

                                        <MenuItem onClick={handleCloseNotificationsDrop}>
                                            <div className="d-flex">
                                                <div>
                                                    <div className="userImg">
                                                        <span className="rounded-circle">
                                                            <img src="https://i.scdn.co/image/ab67616d00001e026f157409ae8578b9695be2b3" alt="user_avatar"/>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="dropdownInfo">
                                                    <h4>
                                                        <span>
                                                            <b>Mahmudal</b>
                                                            added to his favorite list
                                                            <b>Leather belt steve madden</b>
                                                        </span>
                                                    </h4>
                                                    <p className="text-sky">few seconds ago</p>
                                                </div>
                                            </div>
                                        </MenuItem>
                                    </div>

                                    <div className="ps-3 pe-3 pt-2 pb-1 w-100">
                                        <Button className="btn-blue w-100">View All Notification</Button>
                                    </div>
                            </Menu>
                            
                        </div>
                        {
                            context.isLogin !== true ?
                            <Link to={'/login'}>
                            <Button className="btn-blue btn-lg">Sign In</Button></Link>
                            :
                            <div className="myAccWrapper">
                                <Button className="myAcc d-flex align-items-center" onClick={handleOpenMyAccDrop}>
                                    <div className="myAcc d-flex align-items-center">
                                        <div className="userImg">
                                            <span className="rounded-circle">
                                                {context.user?.name?.charAt(0)}
                                            </span>
                                        </div>

                                        <div className="userInfo">
                                            <h4>{context.user?.name}</h4>
                                            <p className="mb-0">{context.user?.email}</p>
                                        </div>
                                    </div>
                                </Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    id="account-menu"
                                    open={openMyAcc}
                                    onClose={handleCloseMyAccDrop}
                                    onClick={handleCloseMyAccDrop}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <MenuItem onClick={handleCloseMyAccDrop}>
                                    <ListItemIcon>
                                        <PersonAdd fontSize="small" />
                                    </ListItemIcon>
                                    Add another account
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseMyAccDrop}>
                                    <ListItemIcon>
                                        <IoShieldHalfSharp/>
                                    </ListItemIcon>
                                    Reset Password
                                    </MenuItem>
                                    <MenuItem onClick={logout}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    Logout
                                    </MenuItem>
                                </Menu>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </header>
    </>
  )
};

export default Header;