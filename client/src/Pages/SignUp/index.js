import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import { Button, CircularProgress, TextField, Box, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { postData } from "../../utils/api";
import Logo from '../../assets/logo.png'

const SignUp = () => {
    const context = useContext(MyContext);
    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'customer'
    });
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        context.setIsHeaderFooterShow(false);
    }, [context]);

    const onChangeInput = (e) => {
        setFormFields({
            ...formFields,
            [e.target.name]: e.target.value
        });
    };

    const signUp = (e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^(0\d{9}|\+66\d{9})$/;
        const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

        if (!formFields.name) return context.setAlertBox({ open: true, error: true, msg: "Name cannot be blank!" });
        if (!formFields.email) return context.setAlertBox({ open: true, error: true, msg: "Email cannot be blank!" });
        if (!emailRegex.test(formFields.email)) return context.setAlertBox({ open: true, error: true, msg: "Please enter a valid email address." });
        if (!formFields.phone) return context.setAlertBox({ open: true, error: true, msg: "Phone cannot be blank!" });
        if (!phoneRegex.test(formFields.phone)) return context.setAlertBox({ open: true, error: true, msg: "Please enter a valid phone number (0XXXXXXXXX or +66XXXXXXXXX)" });
        if (!formFields.password) return context.setAlertBox({ open: true, error: true, msg: "Password cannot be blank!" });
        if (!passwordRegex.test(formFields.password)) return context.setAlertBox({ open: true, error: true, msg: "Password must be at least 8 characters and include at least 1 symbol" });
        if (formFields.password !== confirmPassword) return context.setAlertBox({ open: true, error: true, msg: "Passwords do not match!" });

        setIsLoading(true);
        postData('/api/user/signup', {
            ...formFields,
            email: formFields.email.trim().toLowerCase(),
            name: formFields.name.trim(),
            phone: formFields.phone.trim(),
        })
            .then(res => {
                if (res.status) {
                    context.setAlertBox({ open: true, error: false, msg: "Sign Up Successfully!" });
                    setTimeout(() => window.location.href = '/signin', 2000);
                } else {
                    context.setAlertBox({ open: true, error: true, msg: res.msg });
                }
            })
            .catch(() => context.setAlertBox({ open: true, error: true, msg: "Something went wrong. Please try again" }))
            .finally(() => setIsLoading(false));
    };

    return (
        <section className="section signInPage signUpPage">
            <div className="shape-bottom">
                <svg fill="#fff" viewBox="0 0 1921 819.8">
                    <path className="st0" d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4 
                        c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"></path>
                </svg>
            </div>
            <div className="container">
                <div className="box card p-3 shadow border-0">
                    <Link to="/signin" className="absolute top-3 left-3">
                        <IconButton size="large" >
                            <ArrowBackIosNewIcon fontSize="medium" sx={{ color: "#007bff" }} />
                        </IconButton>
                    </Link>

                    <div className="text-center mt-6">
                        <img src={Logo} width={100} alt="logo" />
                    </div>

                    <form className="mt-2" onSubmit={signUp}>
                        <h2 className="mb-3 text-center">Sign Up</h2>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <TextField
                                    label="Name"
                                    name="name"
                                    value={formFields.name}
                                    onChange={onChangeInput}
                                    type="text"
                                    required
                                    variant="standard"
                                    className="w-100"
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <TextField
                                    label="Phone Number"
                                    name="phone"
                                    value={formFields.phone}
                                    onChange={onChangeInput}
                                    type="text"
                                    required
                                    variant="standard"
                                    className="w-100"
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <TextField
                                label="Email Address"
                                name="email"
                                value={formFields.email}
                                onChange={onChangeInput}
                                type="email"
                                required
                                variant="standard"
                                className="w-100"
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
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
                            <div className="col-md-6 mb-3">
                                <TextField
                                    label="Confirm Password"
                                    type="password"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    variant="standard"
                                    className="w-100"
                                />
                            </div>
                        </div>

                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                flexDirection: { xs: "column", md: "row" },
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
                                {isLoading ? <CircularProgress size={27} color="inherit" /> : "Sign Up"}
                            </Button>
                        </Box>

                        <p className="txt text-center">
                            Have an account?{" "}
                            <Link to="/signin" style={{ color: "#007bff", fontWeight: "bold", textDecoration: "none" }}>
                                Sign In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default SignUp;