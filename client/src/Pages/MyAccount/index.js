import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import { IoCloudUpload } from "react-icons/io5";
import { TextField } from "@mui/material";

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
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const MyAccount = () => {

    const [isLogin, setIsLogin] = useState([]);
    const history = useNavigate();

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const token = localStorage.getItem("token");
        if (token !== "" && token !== undefined && token !== null) {
            setIsLogin(true);
        }
        else {
            history('/signIn')
        }
    }, [])

    return (
        <section className="section">
            <div className="container">
                <h2 className="hd">My Account</h2>
                <Box sx={{ width: '100%' }} className='myAccBox card border-0'>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange}>
                            <Tab label="Edit Profile" {...a11yProps(0)} />
                            <Tab label="Change Password" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <form>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="userImage d-flex align-items-center justify-content-center">
                                        <img src="https://cdn.shopify.com/s/files/1/0747/5317/9944/files/furina_901c3b85-7c17-44c9-bcea-a7e434d864b5_600x600.jpg?v=1718073582" alt=""></img>
                                        <div className="overlay d-flex align-items-center justify-content-center">
                                            <IoCloudUpload />
                                            <input type="file" name="images" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <TextField
                                                    required
                                                    id="outlined-required"
                                                    label="Name"
                                                    fullWidth
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <TextField
                                                    required
                                                    id="outlined-required"
                                                    label="Email"
                                                    fullWidth
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <TextField
                                                    required
                                                    id="outlined-required"
                                                    label="Phone"
                                                    fullWidth
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <Button type='submit' className='btn-red btn-lg btn-big'>Save</Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <form>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <TextField
                                                    required
                                                    id="outlined-required"
                                                    label="Old Password"
                                                    fullWidth
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <TextField
                                                    required
                                                    id="outlined-required"
                                                    label="New Password"
                                                    fullWidth
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <TextField
                                                    required
                                                    id="outlined-required"
                                                    label="Confirm Password"
                                                    fullWidth
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <Button type='submit' className='btn-red btn-lg btn-big'>Save</Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CustomTabPanel>
                </Box>
            </div>
        </section>
    )
}

export default MyAccount;