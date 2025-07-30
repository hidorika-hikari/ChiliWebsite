import { useContext, useEffect, useState } from "react";
//import { useNavigate } from 'react-router-dom';
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { Button, CircularProgress } from '@mui/material';
import Logo from '../../assets/logo.png'
import TextField from "@mui/material/TextField";
import { postData } from "../../utils/api";

const SignIn = () => {
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(MyContext);
    //const history = useNavigate();
    const [formFields, setFormFields] = useState({
        email: '',
        password: ''
    })

    const onChangeInput = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value
        }))
    }

    useEffect(() => {
        context.setIsHeaderFooterShow(false);
    }, [context]);

    const login = (e) => {
        e.preventDefault();
        if (formFields.email === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "email can not be blank!"
            })
            return false;
        }
        if (formFields.password === "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "password can not be blank!"
            })
            return false;
        }
        setIsLoading(true);
        postData("/api/user/signin", formFields).then((res) => {
            try {
                if (res.status === true) {
                    console.log(res);
                    localStorage.setItem("token", res.token);
                    const user = {
                        name: res.user?.name,
                        email: res.user?.email,
                        userId: res.user?.id
                    }
                    localStorage.setItem("user", JSON.stringify(user));
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "Login Successfully!"
                    });
                    setTimeout(() => {
                        setIsLoading(false);
                        window.location.href = '/';
                        //history('/');
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
                console.log(error);
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
            <section className="section signInPage">
            <div className="shape-bottom"><svg fill="#fff" id="Layer_1" x="0px" y="0px" viewBox="0 0 1921 819.8">
                <path class="st0"d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4
                c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"></path> </svg>
            </div>
                <div className="container">
                    <div className="box card p-3 shadow border-0">
                        <div className="text-center">
                            <img src={Logo} width={100} alt=""/>
                        </div>

                        <form className="mt-3" onSubmit={login}>
                            <h2 className="mb-4">Sign In</h2>
                            <div className="form-group">
                                <TextField id="standard-basic"
                                label="Email"
                                type="email"
                                name="email"
                                onChange={onChangeInput}
                                required variant="standard"
                                className="w-100"/>
                            </div>
                            <div className="form-group">
                                <TextField id="standard-basic"
                                label="Password"
                                type="password"
                                name="password"
                                onChange={onChangeInput}
                                required variant="standard"
                                className="w-100"/>
                            </div>
                            <button className="border-effect cursor">Forgot Password?</button>
                            <div className="d-flex align-items-center mt-3 mb-3 gap-4">
                                <Button type="submit" className="btn-blue col btn-lg btn-big">
                                    {
                                        isLoading === true ?  <CircularProgress style={{ width: 30, height: 27 }}/> : 'Sign In'
                                    }
                                </Button>
                                <Link to="/"><Button className="btn-lg btn-big col me-3" variant="outlined"
                                onClick={() => context.setIsHeaderFooterShow(true)}>Cancel</Button></Link>
                            </div>

                            <p className="txt">Not Registered?<Link to="/signUp" className="border-effect"> Sign Up</Link></p>

                            <h6 className="mt-3 text-center fw-bold">Or continue with social account</h6>
                            
                            <ul className="list list-inline mt-3 mb-1 text-center socials">
                                <li className="list-inline-item">
                                    <Link to="#" className="social-icon"><FaFacebookF /></Link>
                                </li>
                                <li className="list-inline-item">
                                    <Link to="#" className="social-icon"><FaTwitter /></Link>
                                </li>
                                <li className="list-inline-item">
                                    <Link to="#" className="social-icon"><FaInstagram /></Link>
                                </li>
                            </ul>
                        </form>
                    </div>
                </div>
            </section>
    )
}

export default SignIn;