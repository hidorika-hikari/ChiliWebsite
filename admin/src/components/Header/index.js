import { MdMenuOpen, MdOutlineLightMode, MdOutlineMenu } from "react-icons/md";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import logo from "../../assets/images/logo.png";
import Button from '@mui/material/Button';
import React from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';
import { MyContext } from "../../App";

const Header = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const openMyAcc = Boolean(anchorEl);
    //const history = useNavigate();
    const context = useContext(MyContext);

    const handleOpenMyAccDrop = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMyAccDrop = () => {
        setAnchorEl(null);
    };

    const logout = () => {
        localStorage.clear();
        setAnchorEl(null);
        context.setAlertBox({
            open: true,
            error: false,
            msg: "Logout Successfully"
        })
        setTimeout(() => {
            window.location.href = '/signIn';
        }, 1500);
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
                            <Button className="rounded-circle me-3" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
                                {
                                    context.isToggleSidebar === false ? <MdMenuOpen /> : <MdOutlineMenu />
                                }
                            </Button>
                        </div>

                        <div className="col-sm-7 d-flex align-items-center justify-content-end part3">
                            <Button className="rounded-circle me-3" onClick={() => context.setThemeMode(!context.themeMode)}>
                                <MdOutlineLightMode /></Button>
                            {
                                context.isLogin !== true ?
                                    <Link to={'/signIn'}>
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