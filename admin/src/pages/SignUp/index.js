import { useContext, useEffect, useState } from 'react';
import { MyContext } from '../../App';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { Box, Paper, TextField, Button, CircularProgress, IconButton, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaPhoneAlt } from 'react-icons/fa';
import { IoShieldCheckmarkSharp } from 'react-icons/io5';
import { postData } from '../../utils/api';
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Logo from '../../assets/images/logo.png';

const SignUp = () => {
    
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formFields, setFormFields] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "admin",
    });

    useEffect(() => {
        context.setIsHideSidebarAndHeader(true);
    }, [context]);

    const onChangeInput = (e) => {
        setFormFields((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const signUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        const phoneRegex = /^[0-9]{10,15}$/;

        if (!formFields.name) {
            context.setAlertBox({ open: true, error: true, msg: "Name cannot be blank!" });
            setIsLoading(false);
            return;
        }
        if (!formFields.email || !emailRegex.test(formFields.email)) {
            context.setAlertBox({ open: true, error: true, msg: "Please enter a valid email!" });
            setIsLoading(false);
            return;
        }
        if (!formFields.phone || !phoneRegex.test(formFields.phone)) {
            context.setAlertBox({ open: true, error: true, msg: "Phone must be 10-15 digits." });
            setIsLoading(false);
            return;
        }
        if (!formFields.password || !passwordRegex.test(formFields.password)) {
            context.setAlertBox({ open: true, error: true, msg: "Password must be at least 8 characters with 1 symbol." });
            setIsLoading(false);
            return;
        }
        if (formFields.password !== formFields.confirmPassword) {
            context.setAlertBox({ open: true, error: true, msg: "Passwords do not match!" });
            setIsLoading(false);
            return;
        }

        try {
            const res = await postData("/api/user/signup", formFields);
            if (res.status) {
                context.setAlertBox({ open: true, error: false, msg: "Register successfully!" });
                setTimeout(() => navigate("/signIn"), 2000);
            } else {
                context.setAlertBox({ open: true, error: true, msg: res.msg });
            }
        } catch {
            context.setAlertBox({ open: true, error: true, msg: "Something went wrong." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #f5f5f5, #eaeaea)",
                p: 2,
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    position: "relative",
                    maxWidth: 450,
                    width: "100%",
                    p: 4,
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                {/* Back Button */}
                <IconButton
                    onClick={() => navigate(-1)}
                    sx={{ position: "absolute", top: 16, left: 16 }}
                >
                    <ArrowBackIosNewIcon />
                </IconButton>

                <Box sx={{ textAlign: "center" }}>
                    <img src={Logo} width={70} alt="Logo" />
                    <Typography variant="h6" fontWeight="bold" mt={1}>
                        Sign Up
                    </Typography>
                </Box>

                <Box component="form" onSubmit={signUp} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Name"
                        name="name"
                        value={formFields.name}
                        onChange={onChangeInput}
                        required
                        fullWidth
                        InputProps={{
                            startAdornment: <FaUserCircle style={{ marginRight: 8 }} />,
                        }}
                    />

                    <TextField
                        label="Email"
                        name="email"
                        value={formFields.email}
                        onChange={onChangeInput}
                        type="email"
                        required
                        fullWidth
                        InputProps={{
                            startAdornment: <MdEmail style={{ marginRight: 8 }} />,
                        }}
                    />

                    <TextField
                        label="Phone"
                        name="phone"
                        value={formFields.phone}
                        onChange={onChangeInput}
                        type="text"
                        required
                        fullWidth
                        InputProps={{
                            startAdornment: <FaPhoneAlt style={{ marginRight: 8 }} />,
                        }}
                    />

                    <TextField
                        label="Password"
                        name="password"
                        value={formFields.password}
                        onChange={onChangeInput}
                        type="password"
                        required
                        fullWidth
                        InputProps={{
                            startAdornment: <RiLockPasswordFill style={{ marginRight: 8 }} />,
                        }}
                    />

                    <TextField
                        label="Confirm Password"
                        name="confirmPassword"
                        value={formFields.confirmPassword}
                        onChange={onChangeInput}
                        type="password"
                        required
                        fullWidth
                        InputProps={{
                            startAdornment: <IoShieldCheckmarkSharp style={{ marginRight: 8 }} />,
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 1,
                            py: 1.2,
                            borderRadius: 2,
                            background: "linear-gradient(135deg, #d23f57, #b91c1c)",
                            fontWeight: "bold",
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={22} color="inherit" /> : "Sign Up"}
                    </Button>
                </Box>

                <Typography variant="body2" textAlign="center" mt={2}>
                    Already have an account?{" "}
                    <Link to="/signIn" style={{ color: "#007bff", fontWeight: "bold", textDecoration: "none" }}>
                        Sign In
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
};

export default SignUp;