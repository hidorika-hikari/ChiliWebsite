import { useContext, useEffect, useState } from 'react';
import { MyContext } from '../../App';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from "react-icons/ri";
import { Box, Paper, TextField, Button, CircularProgress, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate, Link } from "react-router-dom";
import { postData } from '../../utils/api';
import Logo from '../../assets/images/logo.png';

const SignIn = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState({
        email: "",
        password: "",
        isAdmin: true,
    });

    const context = useContext(MyContext);
    const navigate = useNavigate();

    useEffect(() => {
        context.setIsHideSidebarAndHeader(true);
    }, [context]);

    const handleChange = (e) => {
        setFormFields({
            ...formFields,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        if (!formFields.email) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Email can not be blank!",
            });
            return;
        }
        if (!formFields.password) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Password can not be blank!",
            });
            return;
        }

        setIsLoading(true);
        try {
            const res = await postData("/api/user/admin/signin", formFields);
            if (res.status) {
                const role = res.user?.role || res.user?._doc?.role;
                const user = {
                    name: res.user?.name || res.user?._doc?.name,
                    email: res.user?.email || res.user?._doc?.email,
                    userId:
                        res.user?.id ||
                        res.user?._doc?.id ||
                        res.user?._id ||
                        res.user?._doc?._id,
                    role,
                };
                localStorage.setItem("token", res.token);
                localStorage.setItem("user", JSON.stringify(user));
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: "Login successfully!",
                });
                setTimeout(() => {
                    setIsLoading(false);
                    navigate("/");
                }, 1000);
            } else {
                context.setAlertBox({ open: true, error: true, msg: res.msg });
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Something went wrong. Please try again.",
            });
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
                    maxWidth: 400,
                    width: "100%",
                    p: 4,
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <IconButton
                    onClick={() => navigate(-1)}
                    sx={{ position: "absolute", top: 16, left: 16 }}
                >
                    <ArrowBackIosNewIcon  />
                </IconButton>

                <Box sx={{ textAlign: "center", mb: 2 }}>
                    <img src={Logo} width={70} alt="Logo" />
                    <Typography variant="h6" fontWeight="bold" mt={1}>
                        Sign In
                    </Typography>
                </Box>

                <Box component="form" onSubmit={handleSignIn} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formFields.email}
                        onChange={handleChange}
                        required
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            startAdornment: <MdEmail style={{ marginRight: 8, color: "#888" }} />,
                        }}
                    />

                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={formFields.password}
                        onChange={handleChange}
                        required
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            startAdornment: <RiLockPasswordFill style={{ marginRight: 8, color: "#888" }} />,
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
                        {isLoading ? <CircularProgress size={22} color="inherit" /> : "Sign In"}
                    </Button>
                </Box>

                <Typography variant="body2" textAlign="center" mt={2}>
                    Don't have an account?{" "}
                    <Link to="/signUp" style={{ color: "#007bff", fontWeight: "bold", textDecoration: "none" }}>
                        Sign Up
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
};

export default SignIn;