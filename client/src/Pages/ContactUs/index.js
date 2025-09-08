import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

const ContactUs = () => {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [infoMessage, setInfoMessage] = useState("");
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    };

    const validate = () => {
        let tempErrors = {};
        if (!form.name.trim()) tempErrors.name = "Name is required";
        if (!form.email.trim()) {
            tempErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            tempErrors.email = "Email is not valid";
        }
        if (!form.message.trim()) tempErrors.message = "Message is required";
        return tempErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setInfoMessage(
            <>
                Thanks for contacting us, {form.name}!<br />
                We will get back to you soon.
            </>
        );

        setForm({ name: "", email: "", message: "" });
        setErrors({});
    };

    return (
        <section className="mb-5">
            <Box
                sx={{
                    maxWidth: 960,
                    mx: "auto",
                    mt: 6,
                    display: "flex",
                    gap: 5,
                    flexWrap: "wrap",
                    px: 2,
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        flex: "1 1 320px",
                        p: 4,
                        borderRadius: 3,
                        background: "linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)",
                        boxShadow:
                            "0 8px 16px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                >
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                        Contact Information
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <LocationOnIcon color="primary" />
                        <Typography variant="body1">
                            123 Main St, Cityville, Country
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <PhoneIcon color="primary" />
                        <Typography variant="body1">+1 234 567 890</Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <EmailIcon color="primary" />
                        <Typography variant="body1">info@example.com</Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        We're available Monday to Friday, 9 AM to 5 PM.
                    </Typography>
                </Paper>

                <Paper
                    elevation={6}
                    sx={{
                        flex: "1 1 480px",
                        p: 5,
                        borderRadius: 3,
                        background: "linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)",
                    }}
                >
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{ fontWeight: 700, mb: 4, color: "#0a3d62" }}
                    >
                        Contact Us
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                    >
                        <TextField
                            label="Your Name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            fullWidth
                            error={Boolean(errors.name)}
                            helperText={errors.name}
                        />
                        <TextField
                            label="Your Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            fullWidth
                            error={Boolean(errors.email)}
                            helperText={errors.email}
                        />
                        <TextField
                            label="Your Message"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            multiline
                            rows={6}
                            fullWidth
                            error={Boolean(errors.message)}
                            helperText={errors.message}
                        />

                        <Button
                            className="btn-blue btn-big"
                            type="submit"
                            sx={{
                                transition:
                                    "background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease",
                                "&:hover": {
                                    backgroundColor: "#1565c0",
                                    transform: "scale(1.05)",
                                    boxShadow: "0 6px 12px rgba(21, 101, 192, 0.3)",
                                },
                            }}
                        >
                            Send Message
                        </Button>
                    </Box>

                    {infoMessage && (
                        <Paper
                            elevation={2}
                            sx={{
                                p: 2,
                                bgcolor: "#e3f2fd",
                                border: "1px solid #90caf9",
                                borderRadius: 2,
                                mt: 4,
                            }}
                        >
                            <Typography
                                variant="body1"
                                color="primary"
                                align="center"
                                sx={{ fontWeight: "600" }}
                            >
                                {infoMessage}
                            </Typography>
                        </Paper>
                    )}
                </Paper>
            </Box>
        </section>
    );
};

export default ContactUs;