import Logo from '../../assets/logo.png'
import SearchBox from './SearchBox';
import Navigation from './Navigation';
import { Button, Menu, MenuItem, Box } from '@mui/material';
import { TbChecklist } from "react-icons/tb";
import { MdAccountCircle } from "react-icons/md";
import { FiUser } from 'react-icons/fi';
import { IoBagOutline } from 'react-icons/io5';
import { LiaClipboardListSolid } from "react-icons/lia";
import { useContext, useState } from "react";
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';
import { RiLogoutBoxRLine } from 'react-icons/ri';

const Header = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const context = useContext(MyContext);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = () => {
        localStorage.clear();
        setAnchorEl(null);
        context.setAlertBox({ open: true, error: false, msg: "Logout Successfully" })
        setTimeout(() => {
            window.location.href = '/signIn';
        }, 1500);
    }

    return (
        <>
            <div className="headerWrapper">
                <div className="top-strip bg-blue">
                    <div className="container">
                        <p className="mb-0 mt-0 text-center">Due to the COVID-19 epidemic, orders may be processed with a slight delay</p>
                    </div>
                </div>

                <header className="header py-2">
                    <div className="container">
                        <div className="d-flex flex-wrap align-items-center justify-content-between mt-3">
                            <div className="logoWrapper mb-3 mb-sm-0">
                                <Link to="/"><img src={Logo} alt="Logo" className="img-fluid" style={{ maxHeight: 50 }} /></Link>
                            </div>

                            <div className="searchWrapper mx-2 mb-2 mb-sm-0">
                                <SearchBox />
                            </div>

                            <div className="d-flex align-items-center mt-3 mt-sm-0">
                                {context.isLogin !== true ? (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            mt: 2,
                                            mb: 2,
                                        }}
                                    >
                                        <Link to="/signIn" style={{ textDecoration: "none" }}>
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    borderRadius: 30,
                                                    py: 0.7,
                                                    px: 4,
                                                    fontWeight: "bold",
                                                    textTransform: "none",
                                                    background: 'linear-gradient(135deg, #d23f57, #b91c1c)',
                                                    color: '#fff',
                                                }}
                                            >
                                                Sign In
                                            </Button>
                                        </Link>
                                    </Box>
                                ) : (
                                    <>
                                        <Button className="circle me-2" onClick={handleClick}><FiUser /></Button>
                                        <Menu
                                            anchorEl={anchorEl}
                                            id="accDrop"
                                            open={open}
                                            onClose={handleClose}
                                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                            PaperProps={{
                                                sx: {
                                                    borderRadius: 2,
                                                    minWidth: 180,
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                    p: 1,
                                                },
                                            }}
                                        >
                                            <Link to="/my-account">
                                                <MenuItem onClick={handleClose} sx={{ borderRadius: 1, gap: 1 }}>
                                                    <MdAccountCircle /> My Account
                                                </MenuItem>
                                            </Link>
                                            <Link to="/orders" >
                                                <MenuItem onClick={handleClose} sx={{ borderRadius: 1, gap: 1 }}>
                                                    <TbChecklist /> My Orders
                                                </MenuItem>
                                            </Link>
                                            <Link to="/my-list">
                                                <MenuItem onClick={handleClose} sx={{ borderRadius: 1, gap: 1 }}>
                                                    <LiaClipboardListSolid /> My Lists
                                                </MenuItem>
                                            </Link>
                                            <MenuItem onClick={logout} sx={{ borderRadius: 1, gap: 1, color: 'error.main' }}>
                                                <RiLogoutBoxRLine />Logout
                                            </MenuItem>
                                        </Menu>
                                    </>
                                )}

                                <div className="cartTab d-flex align-items-center ms-2 position-relative">
                                    <span className="price me-2">{context.cartData.reduce((sum, item) => sum + item.subTotal, 0).toFixed(2)} ฿</span>
                                    <Link to="/cart">
                                        <Button className="circle position-relative">
                                            <IoBagOutline />
                                            <span className="count position-absolute top-0 start-100 translate-middle bg-danger text-white rounded-circle">
                                                {context.cartData.length}
                                            </span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                {
                    context.categoryData?.length > 0 &&
                    <Navigation navData={context.categoryData} />
                }
            </div>
        </>
    )
}

export default Header;