import { useContext, useEffect, useState } from 'react';
import { MyContext } from '../../App';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { IoMdEye, IoMdEyeOff, IoMdHome } from 'react-icons/io';
import { Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { IoShieldCheckmarkSharp } from 'react-icons/io5';
import { postData } from '../../utils/api';
import { FaPhoneAlt } from "react-icons/fa";
import Logo from '../../assets/images/logo.png';

const SignUp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [inputIndex, setInputIndex] = useState(null);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const context = useContext(MyContext);

    const [formFields, setFormFields] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'admin'
    });

    useEffect(() => {
        context.setIsHideSidebarAndHeader(true);
    }, [context]);

    const focusInput = (index) => setInputIndex(index);

    const onChangeInput = (e) => {
        setFormFields((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const signUp = (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (formFields.name === "") {
            context.setAlertBox({ open: true, error: true, msg: "Name can not be blank!" });
            return false;
        }
        if (formFields.email === "") {
            context.setAlertBox({ open: true, error: true, msg: "Email can not be blank!" });
            return false;
        }
        if (formFields.phone === "") {
            context.setAlertBox({ open: true, error: true, msg: "Phone can not be blank!" });
            return false;
        }
        if (formFields.password === "") {
            context.setAlertBox({ open: true, error: true, msg: "Password can not be blank!" });
            return false;
        }
        if (formFields.confirmPassword !== formFields.password) {
            context.setAlertBox({ open: true, error: true, msg: "Password not match" });
            return false;
        }

        postData('/api/user/signup', formFields)
            .then((res) => {
                if (res.status === true) {
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "Register successfully!"
                    });
                    setTimeout(() => {
                        setIsLoading(true);
                        window.location.href = '/signIn';
                    }, 2000);
                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: res.msg
                    });
                }
            })
            .catch((error) => {
                console.error('Signup error:', error);
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "Something went wrong. Please try again."
                });
            });
    };

    return (
        <>
            <img
                src="https://dashboard-ecommerce-react.netlify.app/static/media/pattern.df9a7a28fc13484d1013.webp"
                alt=""
                className="loginPattern"
            />
            <section className="loginSection signUpSection">
                <div className="row">
                    <div className="col-md-8 d-flex align-items-center flex-column part1 justify-content-center">
                        <h1>BEST UX/UI FASHION <span className="text-sky">ECOMMERCE DASHBOARD</span> & ADMIN PANEL</h1>
                        <p>Lorem Ipsum is simply dummy text...</p>
                        <div className='w-100 mt-4'>
                            <Link to={'/'}><Button className='btn-blue btn-lg btn-big'><IoMdHome />Go To Home</Button></Link>
                        </div>
                    </div>

                    <div className="col-md-4 pe-0">
                        <div className="loginBox">
                            <div className="logo text-center">
                                <img src={Logo} width="70px" alt="" />
                                <h5 className="fw-bold">Login to Home</h5>
                            </div>

                            <div className="wrapper mt-3 card border">
                                <form onSubmit={signUp}>
                                    <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                                        <span className="icon"><FaUserCircle /></span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="enter your name"
                                            onFocus={() => focusInput(0)}
                                            onBlur={() => setInputIndex(null)}
                                            name='name'
                                            onChange={onChangeInput}
                                        />
                                    </div>

                                    <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                                        <span className="icon"><MdEmail /></span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="enter your email"
                                            onFocus={() => focusInput(1)}
                                            onBlur={() => setInputIndex(null)}
                                            name='email'
                                            onChange={onChangeInput}
                                        />
                                    </div>

                                    <div className={`form-group position-relative ${inputIndex === 2 && 'focus'}`}>
                                        <span className="icon"><FaPhoneAlt /></span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="enter your phone"
                                            onFocus={() => focusInput(2)}
                                            onBlur={() => setInputIndex(null)}
                                            name='phone'
                                            onChange={onChangeInput}
                                        />
                                    </div>

                                    <div className={`form-group position-relative ${inputIndex === 3 && 'focus'}`}>
                                        <span className="icon"><RiLockPasswordFill /></span>
                                        <input
                                            type={isShowPassword ? 'text' : 'password'}
                                            className="form-control"
                                            placeholder="enter your password"
                                            onFocus={() => focusInput(3)}
                                            onBlur={() => setInputIndex(null)}
                                            name='password'
                                            onChange={onChangeInput}
                                        />
                                        <span
                                            className="toggleShowPassword"
                                            onClick={() => setIsShowPassword(!isShowPassword)}
                                        >
                                            {isShowPassword ? <IoMdEyeOff /> : <IoMdEye />}
                                        </span>
                                    </div>

                                    <div className={`form-group position-relative ${inputIndex === 4 && 'focus'}`}>
                                        <span className="icon"><IoShieldCheckmarkSharp /></span>
                                        <input
                                            type={isShowConfirmPassword ? 'text' : 'password'}
                                            className="form-control"
                                            placeholder="confirm your password"
                                            onFocus={() => focusInput(4)}
                                            onBlur={() => setInputIndex(null)}
                                            name='confirmPassword'
                                            onChange={onChangeInput}
                                        />
                                        <span
                                            className="toggleShowPassword"
                                            onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                                        >
                                            {isShowConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
                                        </span>
                                    </div>

                                    <div className="form-group">
                                        <Button type="submit" className="btn-blue btn-lg w-100 btn-big">
                                            {isLoading ? <CircularProgress style={{ width: 30, height: 27 }} /> : 'Sign Up'}
                                        </Button>
                                    </div>

                                    <div className="form-group text-center mb-0">
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

                                <span className="auth-note text-center d-block mt-3">
                                    Don't have an account?
                                    <Link to={'/signIn'} className="link color"> Sign In </Link>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SignUp;