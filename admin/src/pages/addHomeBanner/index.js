import { Breadcrumbs, Chip, CircularProgress, emphasize, styled } from '@mui/material';
import { FaCloudUploadAlt, FaHome } from 'react-icons/fa';
import { postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import { MyContext } from '../../App';

const StyleBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

const AddHomeBanner = () => {

    const context = useContext(MyContext);
    const history = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formFields, setFromFields] = useState({
        images: []
    });

    const addImgUrl = (e) => {
        const arr = [];
        arr.push(e.target.value);
        setFromFields(() => (
            {
                ...formFields,
                [e.target.name]: arr
            }
        ))
    }

    const addHomeBanner = (e) => {
        e.preventDefault();
        if (formFields.images.length !== 0) {
            setIsLoading(true);
            postData('api/homeBanner/create', formFields)
                .then(res => {
                    setIsLoading(false);
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: 'Home banner added successfully!'
                    });
                    history('/homeBannerList');
                })
                .catch(err => {
                    setIsLoading(false);
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: 'Failed to add home banner. Please try again.'
                    });
                });
        }
        else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Please fill all a details'
            });
            return false;
        }
    }

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 res-col">
                    <h5 className="mb-0">Add Home Banner</h5>
                    <Breadcrumbs
                        aria-label="breadcrumb"
                        className="ms-auto breadcrumb_"
                    >
                        <StyleBreadcrumb
                            component="a"
                            href={'/'}
                            label="Dashboard"
                            icon={<FaHome fontSize="small" />}
                        />
                        <StyleBreadcrumb
                            label="Home Banner List"
                            component="a"
                            href={'/homeBannerList'}
                        />
                        <StyleBreadcrumb label="Add Home Banner" />
                    </Breadcrumbs>
                </div>
                <form className="form">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card p-4 mt-0">
                                <div className="form-group">
                                    <h6>Image URL</h6>
                                    <input type="text" name='images' onChange={addImgUrl} />
                                    {formFields.images.length > 0 && formFields.images[0] && (
                                        <div style={{ marginTop: '10px' }}>
                                            <img
                                                src={formFields.images[0]}
                                                alt="Preview"
                                                style={{ maxHeight: '150px', borderRadius: '8px', border: '1px solid #ccc', marginTop: '10px' }}
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </div>
                                    )}
                                </div>
                                <br />
                                <Button
                                    type="submit"
                                    onClick={addHomeBanner}
                                    className='btn-blue btn-lg btn-big w-100'
                                    disabled={isLoading}
                                >
                                    <FaCloudUploadAlt /> &nbsp; {isLoading === true ?
                                        <CircularProgress color='inherit' className='ms-3 loader' /> : 'PUBLISH AND VIEW'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddHomeBanner;