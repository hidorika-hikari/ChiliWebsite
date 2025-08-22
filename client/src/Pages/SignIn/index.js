import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { Button, CircularProgress } from '@mui/material';
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
//import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Logo from '../../assets/logo.png';
import TextField from "@mui/material/TextField";

const SignIn = () => {

    const [forgotOpen, setForgotOpen] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);

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
                    localStorage.setItem("token", res.token);
                    const user = {
                        name: res.user?.name,
                        email: res.user?.email,
                        userId: res.user?.id,
                        role: res.user?.role
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
                setIsLoading(false);
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "Something went wrong. Please try again."
                });
            }
        })
    }

    const handleForgotPassword = (e) => {
        e.preventDefault();
        setForgotLoading(true);
        postData("/api/user/forgot-password", { email: forgotEmail }).then((res) => {
            setForgotLoading(false);
            setForgotOpen(false);
            context.setAlertBox({
                open: true,
                error: !res.status,
                msg: res.msg || (res.status ? "Reset link sent to your email." : "Failed to send reset link.")
            });
        }).catch(() => {
            setForgotLoading(false);
            setForgotOpen(false);
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Something went wrong. Please try again."
            });
        });
    };

    return (
        <section className="section signInPage">
            <div className="shape-bottom"><svg fill="#fff" id="Layer_1" x="0px" y="0px" viewBox="0 0 1921 819.8">
                <path class="st0" d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4
                c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"></path> </svg>
            </div>
            <div className="container">
                <div className="box card p-3 shadow border-0">
                    <div className="text-center">
                        <img src={Logo} width={100} alt="" />
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
                                className="w-100" />
                        </div>
                        <div className="form-group">
                            <TextField id="standard-basic"
                                label="Password"
                                type="password"
                                name="password"
                                onChange={onChangeInput}
                                required variant="standard"
                                className="w-100" />
                        </div>
                        <button
                            type="button"
                            className="border-effect cursor"
                            style={{ background: "none", border: "none", padding: 0, color: "#007bff" }}
                            onClick={() => setForgotOpen(true)}
                        >
                            Forgot Password?
                        </button>
                        <div className="d-flex align-items-center mt-3 mb-3 gap-4">
                            <Button type="submit" className="btn-blue col btn-lg btn-big">
                                {
                                    isLoading === true ? <CircularProgress style={{ width: 30, height: 27 }} /> : 'Sign In'
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
                    <Dialog
                        open={forgotOpen}
                        onClose={() => setForgotOpen(false)}
                        PaperProps={{
                            style: {
                                borderRadius: "16px",
                                padding: "20px",
                                minWidth: "400px",
                            },
                        }}
                    >
                        <DialogTitle className="text-center font-bold text-xl text-gray-800">
                            Forgot Password
                        </DialogTitle>

                        <form onSubmit={handleForgotPassword}>
                            <DialogContent className="flex flex-col gap-4">
                                <p className="text-sm text-gray-500 text-center">
                                    Enter your registered email address and we’ll send you a link to reset your password.
                                </p>

                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Email Address"
                                    type="email"
                                    fullWidth
                                    variant="outlined"
                                    value={forgotEmail}
                                    onChange={e => setForgotEmail(e.target.value)}
                                    required
                                    className="rounded-md"
                                />
                            </DialogContent>

                            <DialogActions className="flex justify-between px-6 pb-4">
                                <Button
                                    onClick={() => setForgotOpen(false)}
                                    className="!text-gray-600 hover:!bg-gray-100"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={forgotLoading}
                                    className="btn-red !text-white rounded-lg px-4"
                                >
                                    {forgotLoading ? <CircularProgress size={20} color="inherit" /> : "Send Link"}
                                </Button>
                            </DialogActions>
                        </form>
                    </Dialog>
                </div>
            </div>
        </section>
    )
}

export default SignIn;