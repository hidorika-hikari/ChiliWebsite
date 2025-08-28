import { useContext, useEffect, useState } from 'react';
import { MyContext } from '../../App';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { postData } from '../../utils/api';
import Logo from '../../assets/images/logo.png';

const SignIn = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [inputIndex, setInputIndex] = useState(null);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const context = useContext(MyContext);
    //const history = useNavigate();
    const [formFields, setFormFields] = useState({
        email: '',
        password: '',
        isAdmin: true
    })

    useEffect(() => {
        context.setIsHideSidebarAndHeader(true);
    }, [context]);

    const focusInput = (index) => {
        setInputIndex(index);
    };

    const onChangeInput = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value
        }))
    }

    const signIn = (e) => {
        e.preventDefault();
        if (formFields.email === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Email can not be blank!"
            })
            return false;
        }
        if (formFields.password === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Password can not be blank!"
            })
            return false;
        }
        setIsLoading(true);
        postData("/api/user/admin/signin", formFields).then((res) => {
            try {
                if (res.status === true) {
                    let role = res.user?.role;
                    if (!role && res.user?._doc) role = res.user._doc.role;
                    const user = {
                        name: res.user?.name || res.user?._doc?.name,
                        email: res.user?.email || res.user?._doc?.email,
                        userId: res.user?.id || res.user?._doc?.id || res.user?._id || res.user?._doc?._id,
                        role: role
                    }
                    localStorage.setItem("token", res.token);
                    localStorage.setItem("user", JSON.stringify(user));
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "Login successfully!"
                    });
                    setTimeout(() => {
                        setIsLoading(false);
                        window.location.href = '/';
                    }, 1000);
                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: res.msg
                    });
                    setIsLoading(false);
                }
            } catch (error) {
                setIsLoading(false);
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "Something went wrong. Please try again."
                });
            }
        })
    }

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
                        <form onSubmit={signIn}>
                            <div
                                className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}
                            >
                                <span className="icon">
                                    <MdEmail />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    onFocus={() => focusInput(0)}
                                    onBlur={() => setInputIndex(null)}
                                    name='email'
                                    onChange={onChangeInput}
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
                                    placeholder="Enter your password"
                                    onFocus={() => focusInput(1)}
                                    onBlur={() => setInputIndex(null)}
                                    name='password'
                                    onChange={onChangeInput}
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
                                <Button type='submit' className="btn-blue btn-lg w-100 btn-big">
                                    {
                                        isLoading === true ? <CircularProgress style={{ width: 30, height: 27 }}/> : 'Login'
                                    }
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
                    </div>

                    <div className="wrapper mt-3 card border footer p-3">
                        <span className="auth-note text-center">
                            Don't have an account?
                            <Link to={'/signUp'} className="link color">
                                {''} Sign Up
                            </Link>
                        </span>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SignIn;