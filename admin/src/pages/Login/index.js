import { useContext, useEffect, useState } from 'react';
import { MyContext } from '../../App';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/logo.png';

const Login = () => {
    const [inputIndex, setInputIndex] = useState(null);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const context = useContext(MyContext);

    useEffect(() => {
        context.setIsHideSidebarAndHeader(true);
    }, []);

    const focusInput = (index) => {
        setInputIndex(index);
    };

    return (
        <>
            <img
                src="https://dashboard-ecommerce-react.netlify.app/static/media/pattern.df9a7a28fc13484d1013.webp"
                alt=""
                className="loginPattern"
            />
            <section className="loginSection">
                <div className="loginBox">
                    <div className="logo text-center">
                        <img src={Logo} width="70px" alt="" />
                        <h5 className="fw-bold">Login to Home</h5>
                    </div>

                    <div className="wrapper mt-3 card border">
                        <form>
                            <div
                                className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}
                            >
                                <span className="icon">
                                    <MdEmail />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="enter your email"
                                    onFocus={() => focusInput(0)}
                                    onBlur={() => setInputIndex(null)}
                                />
                            </div>

                            <div
                                className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}
                            >
                                <span className="icon">
                                    <RiLockPasswordFill />
                                </span>
                                <input
                                    type={`${isShowPassword === true ? 'text' : 'password'}`}
                                    className="form-control"
                                    placeholder="enter your password"
                                    onFocus={() => focusInput(1)}
                                    onBlur={() => setInputIndex(null)}
                                />

                                <span
                                    className="toggleShowPassword"
                                    onClick={() =>
                                        setIsShowPassword(!isShowPassword)
                                    }
                                >
                                    {isShowPassword === true ? (
                                        <IoMdEyeOff />
                                    ) : (
                                        <IoMdEye />
                                    )}
                                </span>
                            </div>

                            <div className="form-group">
                                <Button className="btn-blue btn-lg w-100 btn-big">
                                    Sign In
                                </Button>
                            </div>

                            <div className="form-group text-center mb-0">
                                <Link to={'/forgot-password'} className="link text-decoration-none">
                                    FORGOT PASSWORD
                                </Link>
                                <div className="d-flex align-items-center justify-content-center or mt-3 mb-3">
                                    <span className="line"></span>
                                    <span className="txt">or</span>
                                    <span className="line"></span>
                                </div>
                                <Button
                                    variant="outlined"
                                    className="w-100 btn-lg loginWithGoogle"
                                >
                                    <img
                                        alt=""
                                        src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-1024.png"
                                        width="25px"
                                    />{' '}
                                    Sign In with Google
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="wrapper mt-3 card border footer p-3">
                        <span className="auth-note text-center">
                            Don't have an account?
                            <Link to={'/signUp'} className="link color">
                                {''} Register
                            </Link>
                        </span>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Login;
