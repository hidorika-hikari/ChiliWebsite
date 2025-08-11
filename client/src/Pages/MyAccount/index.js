import React, { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Box, Button, TextField, Grid } from "@mui/material";
import { MyContext } from "../../App";
import { RiImageAddLine } from "react-icons/ri";
import { editData, fetchDataFromApi } from "../../utils/api";

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

const MyAccount = () => {

    const context = useContext(MyContext);

    const [value, setValue] = useState(0);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        profileImage: "",
    });

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.userId || null;

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            context.setAlertBox({ open: true, error: true, msg: "User not logged in" });
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            context.setAlertBox({ open: true, error: true, msg: "New passwords do not match" });
            return;
        }

        try {
            const res = await editData(`/api/user/${userId}/change-password`, passwordData);
            if (res.status === true) {
                context.setAlertBox({ open: true, error: false, msg: res.msg });
                setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                context.setAlertBox({ open: true, error: true, msg: res.msg || "Failed to update password" });
            }
        } catch (error) {
            console.error(error);
            context.setAlertBox({ open: true, error: true, msg: "Something went wrong" });
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.userId) return;

        async function getUserData() {
            try {
                const data = await fetchDataFromApi(`/api/user/${user.userId}`);
                if (!data) return;
                setUserData({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    profileImage: data.images?.[0] || "",
                });
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        }
        getUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "User not logged in",
            });
            return;
        }
        try {
            const res = await editData(`/api/user/${userId}`, userData);
            context.setAlertBox({
                open: true,
                error: false,
                msg: "Profile updated successfully!",
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className="section">
            <div className="container">
                <h2 className="hd">My Account</h2>
                <Box className="myAccBox card border-0">
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs value={value} onChange={handleChange} aria-label="My account tabs">
                            <Tab label="Edit Profile" {...a11yProps(0)} />
                            <Tab label="Change Password" {...a11yProps(1)} />
                        </Tabs>
                    </Box>

                    <CustomTabPanel value={value} index={0}>
                        <form onSubmit={handleSubmit}>
                            <div className="row align-items-center">
                                <div className="col-md-4 d-flex justify-content-center">
                                    <div className="userImage position-relative">
                                        {userData.profileImage ? (
                                            <img
                                                src={userData.profileImage}
                                                alt="profile"
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: 200,
                                                    height: 200,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: '50%',
                                                    backgroundColor: '#fff',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <RiImageAddLine size={48} color="#888" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-8">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <TextField
                                                required
                                                name="name"
                                                label="Name"
                                                value={userData.name}
                                                onChange={handleInputChange}
                                                fullWidth
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <TextField
                                                required
                                                name="email"
                                                label="Email"
                                                value={userData.email}
                                                onChange={handleInputChange}
                                                fullWidth
                                                disabled
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <TextField
                                                required
                                                name="phone"
                                                label="Phone"
                                                value={userData.phone}
                                                onChange={handleInputChange}
                                                fullWidth
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <TextField
                                                name="profileImage"
                                                label="Image URL"
                                                value={userData.profileImage}
                                                onChange={handleInputChange}
                                                fullWidth
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group mt-4">
                                        <Button type="submit" className="btn-red btn-lg btn-big">
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CustomTabPanel>

                    <CustomTabPanel value={value} index={1}>
                        <form onSubmit={handlePasswordSubmit} style={{ width: "100%" }}>
                            <div className="row" >
                                <div className="col-md-3">
                                    <TextField
                                        label="Old Password"
                                        name="oldPassword"
                                        type="password"
                                        value={passwordData.oldPassword}
                                        onChange={handlePasswordChange}
                                        fullWidth
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <TextField
                                        label="New Password"
                                        name="newPassword"
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        fullWidth
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <TextField
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        fullWidth
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="btn-red btn-lg btn-big mt-3">
                                Change Password
                            </Button>
                        </form>
                    </CustomTabPanel>
                </Box>
            </div>
        </section>
    );
};

export default MyAccount;