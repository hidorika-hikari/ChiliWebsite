import React, { useEffect, useState, useContext } from 'react';
import { Breadcrumbs, Chip, emphasize, styled, CircularProgress, Button, Select, MenuItem, FormControl, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Pagination } from '@mui/material';
import { FaHome } from 'react-icons/fa';
import { MdDelete } from "react-icons/md";
import { fetchDataFromApi, patchData, deleteData } from '../../utils/api';
import { MyContext } from '../../App';

const StyleBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor = theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': { backgroundColor: emphasize(backgroundColor, 0.06) },
        '&:active': { boxShadow: theme.shadows[1], backgroundColor: emphasize(backgroundColor, 0.12) }
    };
});

const ContactMessages = () => {
    const context = useContext(MyContext);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [data, setData] = useState({ messages: [], total: 0, totalPages: 1 });
    const [updatingId, setUpdatingId] = useState(null);

    const [openView, setOpenView] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Fetch messages
    const fetchMessages = async (pageNum = 1) => {
        setIsLoading(true);
        try {
            const res = await fetchDataFromApi(`/api/contact?page=${pageNum}&perPage=10`);
            if (res.success) {
                setData(res);
                setError(null);
            } else {
                setError(res.message || "Failed to load contact messages.");
            }
        } catch (e) {
            setError("Failed to load contact messages.");
        } finally {
            setIsLoading(false);
        }
    };

    // Update status
    const updateStatus = async (id, status) => {
        setUpdatingId(id);
        try {
            const res = await patchData(`/api/contact/${id}`, { status });
            if (res.success) {
                setData((prev) => ({
                    ...prev,
                    messages: prev.messages.map((m) =>
                        m._id === id ? { ...m, status } : m
                    ),
                }));
                context.setAlertBox({ open: true, error: false, msg: "Status updated" });
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: res.message || "Update failed",
                });
            }
        } catch (e) {
            context.setAlertBox({ open: true, error: true, msg: "Update failed" });
        } finally {
            setUpdatingId(null);
        }
    };

    useEffect(() => {
        fetchMessages(page);
    }, [page]);

    const handleOpenView = (msg) => {
        setSelectedMessage(msg);
        setOpenView(true);
    };

    const handleCloseView = () => {
        setOpenView(false);
        setSelectedMessage(null);
    };

    const handleOpenDelete = (id) => {
        setDeleteId(id);
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
        setDeleteId(null);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setDeletingId(deleteId);
        try {
            const res = await deleteData(`/api/contact/${deleteId}`);
            if (res.success) {
                setData((prev) => ({
                    ...prev,
                    messages: prev.messages.filter((m) => m._id !== deleteId),
                    total: Math.max(0, prev.total - 1),
                }));
                context.setAlertBox({ open: true, error: false, msg: "Message deleted" });
            } else {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: res.message || "Delete failed",
                });
            }
        } catch (e) {
            context.setAlertBox({ open: true, error: true, msg: "Delete failed" });
        } finally {
            setDeletingId(null);
            handleCloseDelete();
        }
    };

    return (
        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4 res-col">
                <h5 className="mb-0">Contact Messages</h5>
                <Breadcrumbs aria-label="breadcrumb" className="ms-auto breadcrumb_">
                    <StyleBreadcrumb
                        component="a"
                        href={"/"}
                        label="Dashboard"
                        icon={<FaHome fontSize="small" />}
                    />
                    <StyleBreadcrumb
                        label="Contact Messages"
                        component="a"
                        href="/contact-messages"
                    />
                </Breadcrumbs>
            </div>

            <div className="card shadow border-0 p-3 mt-4">
                {isLoading ? (
                    <div className="text-center py-5">
                        <CircularProgress />
                    </div>
                ) : error ? (
                    <div className="text-center py-5 text-danger">
                        {error}
                        <Button onClick={() => fetchMessages(page)}>Retry</Button>
                    </div>
                ) : data.messages.length === 0 ? (
                    <div className="text-center py-5">No messages found.</div>
                ) : (
                    <div className="table-responsive mt-3">
                        <table
                            className="table table-bordered table-striped v-align"
                            style={{ whiteSpace: "nowrap" }}
                        >
                            <thead className="table-dark">
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Message</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                    <th>Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.messages.map((m) => (
                                    <tr key={m._id}>
                                        <td>{m.name}</td>
                                        <td>{m.email}</td>
                                        <td style={{ maxWidth: 420, verticalAlign: "middle" }}>
                                            <div className="d-flex align-items-center">
                                                <Typography
                                                    component="div"
                                                    sx={{ whiteSpace: "normal" }}
                                                >
                                                    {m.message && m.message.length > 100
                                                        ? `${m.message.slice(0, 45)}...`
                                                        : m.message}
                                                </Typography>

                                                {m.message && m.message.length > 100 && (
                                                    <Button
                                                        size="small"
                                                        className="ms-3 btn-blue"
                                                        onClick={() => handleOpenView(m)}
                                                    >
                                                        View
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ minWidth: 160 }}>
                                            <FormControl size="small" fullWidth>
                                                <Select
                                                    value={m.status}
                                                    onChange={(e) => updateStatus(m._id, e.target.value)}
                                                    disabled={updatingId === m._id}
                                                >
                                                    <MenuItem value="new">New</MenuItem>
                                                    <MenuItem value="read">Read</MenuItem>
                                                    <MenuItem value="archived">Archived</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </td>
                                        <td>
                                            <div className="actions d-flex align-items-center">
                                                <Button
                                                    className='error'
                                                    color="error"
                                                    onClick={() => handleOpenDelete(m._id)}
                                                    disabled={deletingId === m._id}
                                                >
                                                    {deletingId === m._id ? "..." : <MdDelete />}
                                                </Button>
                                            </div>
                                        </td>
                                        <td>{new Date(m.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="d-flex justify-content-end mt-3">
                            <Pagination
                                count={data.totalPages}
                                page={page}
                                onChange={(e, value) => setPage(value)}
                                color="primary"
                                className="pagination"
                                showFirstButton
                                showLastButton
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* View Dialog */}
            <Dialog open={openView} onClose={handleCloseView} maxWidth="sm" fullWidth>
                <DialogTitle>Contact Message</DialogTitle>
                <DialogContent dividers>
                    {selectedMessage && (
                        <>
                            <Typography>
                                <strong>Name:</strong> {selectedMessage.name}
                            </Typography>
                            <Typography>
                                <strong>Email:</strong> {selectedMessage.email}
                            </Typography>
                            <Typography sx={{ mt: 2 }}>
                                <strong>Message:</strong>
                            </Typography>
                            <Typography sx={{ whiteSpace: "pre-wrap" }}>
                                {selectedMessage.message}
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseView} className="btn-blue">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirm Dialog */}
            <Dialog
                open={openDelete}
                onClose={handleCloseDelete}
                PaperProps={{ className: "rounded-2xl shadow-lg" }}
            >
                <DialogTitle className="text-xl font-semibold text-gray-800">
                    Confirm Delete
                </DialogTitle>
                <DialogContent className="text-gray-600">
                    <Typography>
                        Are you sure you want to delete this message?
                    </Typography>
                </DialogContent>
                <DialogActions className="px-6 pb-4">
                    <Button
                        onClick={handleCloseDelete}
                        variant="outlined"
                        className="rounded-lg px-4"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmDelete}
                        color="error"
                        variant="contained"
                        className="rounded-lg px-6 bg-red-600 hover:bg-red-700 text-white"
                        disabled={deletingId === deleteId}
                    >
                        {deletingId === deleteId ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            "Delete"
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ContactMessages;
