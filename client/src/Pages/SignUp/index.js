import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import { Button, CircularProgress, TextField  } from '@mui/material';
import { postData } from "../../utils/api";
import Logo from '../../assets/logo.png'

const SignUp = () => {
    //const history = useNavigate();
    const context = useContext(MyContext);
    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'customer'
    })

    useEffect(() => {
        context.setIsHeaderFooterShow(false);
    }, [context]);

    const onChangeInput = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value
        }))
    }

    const signUp = (e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10,15}$/;
        const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    
        if (formFields.name === "") {
            context.setAlertBox({ open: true, error: true, msg: "Name cannot be blank!" });
            return false;
        }
        if (formFields.email === "") {
            context.setAlertBox({ open: true, error: true, msg: "Email cannot be blank!" });
            return false;
        }
        if (!emailRegex.test(formFields.email)) {
            context.setAlertBox({ open: true, error: true, msg: "Please enter a valid email address." });
            return false;
        }
        
        if (formFields.phone === "") {
            context.setAlertBox({ open: true, error: true, msg: "Phone cannot be blank!" });
            return false;
        }
        if (!phoneRegex.test(formFields.phone)) {
            context.setAlertBox({ open: true, error: true, msg: "Phone number must be 10–15 digits"});
            return false;
        }
        if (formFields.password === "") {
            context.setAlertBox({ open: true, error: true, msg: "Password cannot be blank!" });
            return false;
        }
        if (!passwordRegex.test(formFields.password)) {
            context.setAlertBox({ open: true, error: true, msg: "Password must be at least 8 characters and include at least 1 symbol" });
            return false;
        }
    
        setIsLoading(true);
        postData('/api/user/signup', formFields)
            .then((res) => {
                if (res.status === true) {
                    context.setAlertBox({ open: true, error: false, msg: "Sign Up Successfully!" });
                    setTimeout(() => {
                        setIsLoading(true);
                        window.location.href = '/signin';
                    }, 2000);
                } else {
                    context.setAlertBox({ open: true, error: true, msg: res.msg });
                }
            })
            .catch((error) => {
                console.error('Signup error:', error);
                context.setAlertBox({ open: true, error: true, msg: "Something went wrong. Please try again" });
            });
    };

    return (
        <section className="section signInPage signUpPage">
            <div className="shape-bottom"><svg fill="#fff" id="Layer_1" x="0px" y="0px" viewBox="0 0 1921 819.8">
                <path class="st0" d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4 
            c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"></path> </svg>
            </div>
            <div className="container">
                <div className="box card p-3 shadow border-0">
                    <div className="text-center">
                        <img src={Logo} width={100} alt="" />
                    </div>

                    <form className="mt-2" onSubmit={signUp}>
                        <h2 className="mb-3">Sign Up</h2>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <TextField label="Name"
                                        name='name'
                                        onChange={onChangeInput}
                                        type="text"
                                        required variant="standard" className="w-100" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <TextField label="Phone No."
                                        name='phone'
                                        onChange={onChangeInput}
                                        type="text"
                                        required variant="standard" className="w-100" />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <TextField id="standard-basic"
                                label="Email"
                                name='email'
                                onChange={onChangeInput}
                                type="email"
                                required variant="standard" className="w-100" />
                        </div>
                        <div className="form-group">
                            <TextField id="standard-basic"
                                label="Password"
                                name='password'
                                onChange={onChangeInput}
                                type="password"
                                required variant="standard" className="w-100" />
                        </div>
                        <div className="d-flex align-items-center mt-3 mb-3">
                            <div className="row w-100">
                                <div className="col-md-6">
                                    <Button type='submit'
                                        className="btn-blue w-100 btn-lg btn-big">
                                            {
                                                isLoading === true ? <CircularProgress style={{ width: 30, height: 27 }} />
                                                : 'Sign Up'
                                            }
                                        </Button>
                                </div>
                                <div className="col-md-6 pe-0">
                                    <Link to="/signin" className="d-block w-100">
                                        <Button className="btn-lg btn-big me-3" variant="outlined"
                                            onClick={() => context.setIsHeaderFooterShow(true)}>Cancel</Button></Link>
                                </div>
                            </div>
                        </div>
                        <p className="txt">have account? <Link to="/signin" className="border-effect"> Sign In</Link></p>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default SignUp;