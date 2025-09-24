import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs, Chip, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, TextField, emphasize, styled } from '@mui/material';
import { FaHome, FaPencilAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { fetchDataFromApi, deleteData, editData } from '../../utils/api';
import { MyContext } from '../../App';

const StyleBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor = theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800];
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

    const context = useContext(MyContext);
    const [isLoading, setIsLoading] = useState(false);
    const [bannerData, setBannerData] = useState([]);

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [formFields, setFormFields] = useState({ images: [''] });

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDataFromApi('/api/homeBanner').then((res) => setBannerData(res));
    }, []);

    const handleEditOpen = (id) => {
        setEditOpen(true);
        setEditId(id);
        fetchDataFromApi(`/api/homeBanner/${id}`).then((res) => {
            setFormFields({ images: Array.isArray(res.images) ? res.images : [''] });
        });
    };
    const handleEditClose = () => setEditOpen(false);

    const handleUpdateBanner = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await editData(`/api/homeBanner/${editId}`, formFields);
            const updatedData = await fetchDataFromApi('/api/homeBanner');
            setBannerData(updatedData);
            setEditOpen(false);
            setIsLoading(false);
            context.setAlertBox({ open: true, error: false, msg: 'Banner updated successfully!' });
        } catch {
            setIsLoading(false);
            context.setAlertBox({ open: true, error: true, msg: 'Failed to update banner.' });
        }
    };

    const handleImgChange = (e) => {
        setFormFields({ ...formFields, [e.target.name]: [e.target.value] });
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setDeleteOpen(true);
    };
    const handleDeleteCancel = () => setDeleteOpen(false);
    const handleDeleteConfirm = async () => {
        try {
            await deleteData(`/api/homeBanner/${deleteId}`);
            const updatedData = await fetchDataFromApi('/api/homeBanner');
            setBannerData(updatedData);
            setDeleteOpen(false);
            context.setAlertBox({ open: true, error: false, msg: 'Banner deleted successfully!' });
        } catch {
            setDeleteOpen(false);
            context.setAlertBox({ open: true, error: true, msg: 'Failed to delete banner.' });
        }
    };

    return (
        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4 align-items-center">
                <h5 className="mb-0">Home Banner List</h5>
                <div className='ms-auto d-flex align-items-center'>
                    <Breadcrumbs aria-label="breadcrumb" className="ms-auto breadcrumb_">
                        <StyleBreadcrumb component="a" href="/" label="Dashboard" icon={<FaHome fontSize="small" />} />
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
                            {bannerData?.length > 0 ? bannerData.map((item) => (
                                <tr key={item._id}>
                                    <td>
                                        <div className="img card shadow" style={{ width: '500px', height: 'auto' }}>
                                            <img
                                                src={item.images[0]}
                                                alt=""
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="actions d-flex align-items-center">
                                            <Button className="success" color="success" onClick={() => handleEditOpen(item._id)}><FaPencilAlt /></Button>
                                            <Button className="error" color="error" onClick={() => handleDeleteClick(item._id)}><MdDelete /></Button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={2} className="text-center">No banners found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={editOpen} onClose={handleEditClose} className='editModel'>
                <DialogTitle>Edit Banner</DialogTitle>
                <form>
                    <DialogContent>
                        <TextField
                            required
                            autoFocus
                            name="images"
                            label="Image URL"
                            type="text"
                            fullWidth
                            value={formFields.images[0] || ''}
                            onChange={handleImgChange}
                        />
                        {formFields.images[0] && (
                            <img
                                src={formFields.images[0]}
                                alt="Preview"
                                style={{ maxHeight: '300px', marginTop: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                                onError={(e) => (e.target.style.display = 'none')}
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditClose} className='btn-red btn-lg'>Cancel</Button>
                        <Button type="button" onClick={handleUpdateBanner} className='btn-blue btn-lg'>
                            {isLoading ? <CircularProgress color='inherit' className='ms-3 loader' /> : '๊Update'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog open={deleteOpen} onClose={handleDeleteCancel}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this banner?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary" variant="outlined" >Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained" >Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default HomeBannerList;