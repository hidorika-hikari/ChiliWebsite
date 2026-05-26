import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
//import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png';

const SignIn = () => {

    const [forgotOpen, setForgotOpen] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(MyContext);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    //const history = useNavigate();
    const [formFields, setFormFields] = useState({
        email: '',
        password: ''
    })

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        context.setIsHeaderFooterShow(false);
    }, [context]);

    const login = (e) => {
        e.preventDefault();
        if (formFields.email === "") {
            context.setAlertBox({ open: true, error: true, msg: "email can not be blank!" })
            return false;
        }
        if (formFields.password === "") {
            context.setAlertBox({ open: true, error: true, msg: "password can not be blank!" })
            return false;
        }
        setIsLoading(true);
        const payload = {
            email: formFields.email.trim().toLowerCase(),
            password: formFields.password,
        };

        postData("/api/user/signin", payload).then((res) => {
            if (!res) {
                setIsLoading(false);
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "Unable to reach the server. Try again later.",
                });
                return;
            }

            if (res.status === true && res.token) {
                const userId = res.user?.id || res.user?._id;
                const user = {
                    name: res.user?.name,
                    email: res.user?.email,
                    userId,
                    role: res.user?.role || "customer",
                };

                localStorage.setItem("token", res.token);
                localStorage.setItem("user", JSON.stringify(user));
                context.setUser(user);
                context.setIsLogin(true);
                context.setAlertBox({ open: true, error: false, msg: "Login Successfully!" });
                setTimeout(() => {
                    setIsLoading(false);
                    window.location.href = "/";
                }, 1000);
                return;
            }

            setIsLoading(false);
            context.setAlertBox({
                open: true,
                error: true,
                msg: res.msg || "Sign in failed. Check your email and password.",
            });
        });
    }

    const handleForgotPassword = (e) => {
        e.preventDefault();
        setForgotLoading(true);
        postData("/api/user/forgot-password", { email: forgotEmail }).then((res) => {
            setForgotLoading(false);
            setForgotOpen(false);
            context.setAlertBox({
                open: true, error: !res.status,
                msg: res.msg || (res.status ? "Reset link sent to your email." : "Failed to send reset link.")
            });
        }).catch(() => {
            setForgotLoading(false);
            setForgotOpen(false);
            context.setAlertBox({ open: true, error: true, msg: "Something went wrong. Please try again." });
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
                    <Link to="/" className="absolute top-3 left-3">
                        <IconButton size="large" >
                            <ArrowBackIosNewIcon fontSize="medium" sx={{ color: "#007bff" }} />
                        </IconButton>
                    </Link>

                    <div className="text-center mt-6">
                        <img src={Logo} width={100} alt="" />
                    </div>

                    <form className="mt-3" onSubmit={login}>
                        <h2 className="mb-3 text-center">Sign In</h2>
                        <div className="form-group">
                            <TextField id="standard-basic"
                                label="Email Address"
                                type="email"
                                name="email"
                                value={formFields.email}
                                onChange={onChangeInput}
                                required variant="standard"
                                className="w-100" />
                        </div>
                        <div className="form-group mb-3">
                            <TextField
                                label="Password"
                                type="password"
                                name="password"
                                value={formFields.password}
                                onChange={onChangeInput}
                                required
                                variant="standard"
                                className="w-100"
                            />
                        </div>

                        <button
                            type="button"
                            className="cursor"
                            style={{ background: "none", border: "none", padding: 0, color: "#007bff", fontWeight: "bold", textDecoration: "none" }}
                            onClick={() => setForgotOpen(true)}
                        >
                            Forgot Password?
                        </button>
                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                flexDirection: { xs: "column", sm: "row" },
                                mt: 3,
                                mb: 3,
                            }}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{
                                    borderRadius: 3,
                                    py: 1.5,
                                    fontWeight: "bold",
                                    textTransform: "none",
                                    background: 'linear-gradient(135deg, #d23f57, #b91c1c)',
                                    color: '#fff',
                                }}
                            >
                                {isLoading ? <CircularProgress size={27} color="inherit" /> : "Sign In"}
                            </Button>
                        </Box>
                        <p className="txt text-center">Not Registered?
                            <Link to="/signUp" style={{ color: "#007bff", fontWeight: "bold", textDecoration: "none" }}> Sign Up</Link></p>
                    </form>
                    <Dialog
                        open={forgotOpen}
                        onClose={() => setForgotOpen(false)}
                        PaperProps={{
                            style: {
                                borderRadius: "16px",
                                padding: "20px",
                                minWidth: isSmallScreen ? "90vw" : "400px",
                                maxWidth: isSmallScreen ? "90vw" : "480px",
                                position: "relative",
                            },
                        }}
                    >

                        <IconButton
                            size="large"
                            onClick={() => setForgotOpen(false)}
                            sx={{
                                position: "absolute",
                                top: 12,
                                left: 12,
                            }}
                        >
                            <ArrowBackIosNewIcon fontSize="medium" sx={{ color: "#007bff" }} />
                        </IconButton>

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
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    required
                                    className="rounded-md"
                                />
                            </DialogContent>

                            <DialogActions className="flex justify-between px-6 pb-4">
                                <Button
                                    type="submit"
                                    disabled={forgotLoading}
                                    className="!text-white"
                                    sx={{
                                        borderRadius: 2,
                                        py: 0.5,
                                        px: 2,
                                        fontWeight: "bold",
                                        textTransform: "none",
                                        background: 'linear-gradient(135deg, #d23f57, #b91c1c)',
                                        color: '#fff',
                                    }}
                                >
                                    {forgotLoading ? (
                                        <CircularProgress size={20} color="inherit" />
                                    ) : (
                                        "Send Link"
                                    )}
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