import React, { useState, useEffect, useContext } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Breadcrumbs, Chip, CircularProgress, emphasize, styled } from '@mui/material';
import { FaHome, FaPencilAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { MyContext } from '../../App';
import { fetchDataFromApi, editData, deleteData } from '../../utils/api';

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

const HomeBannerList = () => {
    const [bannerData, setBannerData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(MyContext);

    const [formFields, setFromFields] = useState({
        images: ['']
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDataFromApi('/api/homeBanner').then((res) => {
            setBannerData(res);
        });
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    const editBanner = (id) => {
        setFromFields({ images: [''] });
        setOpen(true);
        setEditId(id);
        fetchDataFromApi(`/api/homeBanner/${id}`).then((res) => {
            setFromFields({
                images: Array.isArray(res.images) ? res.images : ['']
            });
        });
    };

    const updateBanner = (e) => {
        e.preventDefault();
        setIsLoading(true);
        editData(`/api/homeBanner/${editId}`, formFields).then((res) => {
            fetchDataFromApi('/api/homeBanner').then((res) => {
                setBannerData(res);
                setOpen(false);
                setIsLoading(false);
            });
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'Banner updated!'
            });
        });
    };

    const addImgUrl = (e) => {
        const arr = [e.target.value];
        setFromFields({
            ...formFields,
            [e.target.name]: arr
        });
    };

    const deleteBanner = (id) => {
        deleteData(`/api/homeBanner/${id}`).then(() => {
            fetchDataFromApi('/api/homeBanner').then((res) => {
                setBannerData(res);
            });
        });
    };

    return (
        <>
        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4 align-items-center">
                <h5 className="mb-0">Home Banner List</h5>
                <div className='ms-auto d-flex align-items-center'>
                    <Breadcrumbs aria-label="breadcrumb" className="ms-auto breadcrumb_">
                        <StyleBreadcrumb
                            component="a"
                            href={'/'}
                            label="Dashboard"
                            icon={<FaHome fontSize="small" />}
                        />
                        <StyleBreadcrumb label="HomeBanner" component="a" href="#" />
                    </Breadcrumbs>
                    <Link to="/homeBanner/add">
                        <Button className='btn-blue ms-3 ps-5 pe-5'>Add Banner</Button>
                    </Link>
                </div>
            </div>

            <div className="card shadow border-0 p-3 mt-4">
                <div className="table-responsive mt-3">
                    <table className="table table-bordered table-striped v-align">
                        <thead className="table-dark">
                            <tr>
                                <th style={{ width: '350px' }}>IMAGE</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bannerData?.length > 0 && bannerData.map((item, index) => (
                                <tr key={item._id}>
                                    <td>
                                        <div className="img card shadow" style={{ width: '500px', height: 'auto' }}>
                                            <img
                                                src={item.images[0]}
                                                alt=""
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="actions d-flex align-items-center">
                                            <Button className="success" color="success" onClick={() => editBanner(item._id)}>
                                                <FaPencilAlt />
                                            </Button>
                                            <Button className="error" color="error" onClick={() => deleteBanner(item._id)}>
                                                <MdDelete />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <Dialog open={open} onClose={handleClose} className='editModel'>
            <DialogTitle>Edit Banner</DialogTitle>
            <form>
                <DialogContent>
                    <div className='form-group mb-3'>
                        <TextField
                            required
                            autoFocus
                            id="images"
                            name="images"
                            label="Image URL"
                            type="text"
                            fullWidth
                            value={formFields.images[0] || ''}
                            onChange={addImgUrl}
                        />
                        {formFields.images[0] && (
                            <img
                                src={formFields.images[0]}
                                alt="Preview"
                                style={{
                                    maxHeight: '300px',
                                    marginTop: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc'
                                }}
                                onError={(e) => (e.target.style.display = 'none')}
                            />
                        )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} className='btn-red btn-lg'>Cancel</Button>
                    <Button type="button" onClick={updateBanner} className='btn-blue btn-lg'>
                        {isLoading ? <CircularProgress color='inherit' className='ms-3 loader' /> : 'Submit'}
                    </Button>
                </DialogActions>
            </form>
            <br />
        </Dialog>
    </>
    );
};

export default HomeBannerList;
