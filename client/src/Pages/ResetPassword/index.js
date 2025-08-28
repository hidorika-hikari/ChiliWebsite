import { useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, CircularProgress, TextField } from '@mui/material';
import { MyContext } from '../../App';
import { postData } from '../../utils/api';
import Logo from '../../assets/logo.png';

const ResetPassword = () => {
    const context = useContext(MyContext);
    const { token } = useParams();
    const [formFields, setFormFields] = useState({
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const onChangeInput = (e) => {
        setFormFields({
            ...formFields,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formFields.password || !formFields.confirmPassword) {
            context.setAlertBox({ open: true, error: true, msg: 'All fields are required!', });
            return;
        }

        if (formFields.password !== formFields.confirmPassword) {
            context.setAlertBox({ open: true, error: true, msg: 'Passwords do not match!', });
            return;
        }

        setIsLoading(true);
        try {
            const res = await postData(`/api/user/reset-password/${token}`, {
                password: formFields.password,
            });

            if (res.status === true) {
                context.setAlertBox({ open: true, error: false, msg: 'Password has been reset successfully!' });
                setTimeout(() => {
                    window.location.href = '/signin';
                }, 1500);
            } else {
                context.setAlertBox({ open: true, error: true, msg: 'Invalid or expired token.' });
            }
        } catch (err) {
            context.setAlertBox({ open: true, error: true, msg: 'Server error. Please try again later.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="section signInPage">
            <div className="container">
                <div className="box card p-3 shadow border-0">
                    <div className="text-center">
                        <img src={Logo} width={100} alt="logo" />
                    </div>

                    <form className="mt-3" onSubmit={handleSubmit}>
                        <h2 className="mb-4">Set New Password</h2>
                        <div className="form-group mb-3">
                            <TextField
                                label="New Password"
                                type="password"
                                name="password"
                                value={formFields.password}
                                onChange={onChangeInput}
                                required
                                variant="standard"
                                className="w-100"
                            />
                        </div>

                        <div className="form-group mb-3">
                            <TextField
                                label="Confirm Password"
                                type="password"
                                name="confirmPassword"
                                value={formFields.confirmPassword}
                                onChange={onChangeInput}
                                required
                                variant="standard"
                                className="w-100"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="btn-red btn-lg btn-big w-100"
                        >
                            {isLoading ? (
                                <CircularProgress
                                    style={{ width: 30, height: 27 }}
                                />
                            ) : (
                                'Reset Password'
                            )}
                        </Button>

                        <p className="txt mt-3 text-center">
                            <Link to="/signin" className="border-effect">
                                Back to Sign In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ResetPassword;