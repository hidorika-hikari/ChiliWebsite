import Logo from '../../assets/logo.png'
import CountryDropdown from '../CountryDropdown';
import SearchBox from './SearchBox';
import Navigation from './Navigation';
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';
import Menu from '@mui/material/Menu';
import { TbChecklist } from "react-icons/tb";
import { MdAccountCircle } from "react-icons/md";
import { FiUser } from 'react-icons/fi';
import { IoBagOutline } from 'react-icons/io5';
import { LiaClipboardListSolid } from "react-icons/lia";
import { useContext, useState } from "react";
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';

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
        context.setAlertBox({
            open: true,
            error: false,
            msg: "Logout Successfully"
        })
        setTimeout(() => {
            //history('/login');
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

                <header className="header">
                    <div className="container">
                        <div className="row">
                            <div className="logoWrapper d-flex align-items-center col-sm-2">
                                <img src={Logo} alt="Logo" />
                            </div>

                            <div className='col-sm-10 d-flex align-items-center part2'>
                                {
                                    context.countryList.length !== 0 && <CountryDropdown />
                                }
                                <SearchBox />
                                <div className='part3 d-flex align-items-center ms-auto'>
                                    {
                                        context.isLogin !== true ?
                                            <Link to="/signIn"><Button className='btn-blue btn-round'>Sign In</Button></Link> :
                                            <>
                                                <Button className='circle' onClick={handleClick}><FiUser /></Button>
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    id="accDrop"
                                                    open={open}
                                                    onClose={handleClose}
                                                    onClick={handleClose}
                                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                                >
                                                    <MenuItem onClick={handleClose}>
                                                        <ListItemIcon>
                                                            <MdAccountCircle fontSize="small" />
                                                        </ListItemIcon>
                                                        My Account
                                                    </MenuItem>
                                                    <MenuItem onClick={handleClose}>
                                                        <ListItemIcon>
                                                            <TbChecklist fontSize="small" />
                                                        </ListItemIcon>
                                                        My Orders
                                                    </MenuItem>
                                                    <MenuItem onClick={handleClose}>
                                                        <ListItemIcon>
                                                            <LiaClipboardListSolid />
                                                        </ListItemIcon>
                                                        My Lists
                                                    </MenuItem>
                                                    <MenuItem onClick={logout}>
                                                        <ListItemIcon>
                                                            <Logout fontSize="small" />
                                                        </ListItemIcon>
                                                        Logout
                                                    </MenuItem>
                                                </Menu>
                                            </>
                                    }
                                    <div className='ms-2 cartTab d-flex align-items-center'>
                                        <span className='price'>{context.cartData.reduce((sum, item) => sum + item.subTotal, 0).toFixed(2)} ฿</span>
                                        <div className='position-relative ms-2 res-hide'>
                                            <Link to="/cart">
                                                <Button className="circle">
                                                    <IoBagOutline />
                                                </Button>
                                            </Link>
                                            <span className='count d-flex align-items-center justify-content-center'>{context.cartData.length}</span>
                                        </div>
                                    </div>
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