import { Breadcrumbs, Chip, CircularProgress, emphasize, styled, MenuItem, Select, Button } from '@mui/material';
import { FaCloudUploadAlt, FaHome } from 'react-icons/fa';
import { MyContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { postData } from '../../utils/api';
import React, { useContext, useState } from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const menuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 6.5 + ITEM_PADDING_TOP, // Shows ~6 items
            width: 250,
        },
    },
};

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

const AddSubCat = () => {

    const history = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [categoryVal, setCategoryVal] = useState('');
    const [formFields, setFormFields] = useState({
        category: '',
        subCat: ''
    });

    const context = useContext(MyContext);

    const handleChangeCategory = (event) => {
        setCategoryVal(event.target.value);
        setFormFields(() => ({
            ...formFields,
            category: event.target.value
        }))
    };

    const inputChange = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value
        }))
    }

    const addSubCat = (e) => {
        e.preventDefault();

        if (formFields.category === "") {
            context.setAlertBox({ open: true, msg: 'Please select a category', error: true });
            return;
        }

        if (formFields.subCat.trim() === "") {
            context.setAlertBox({ open: true, msg: 'Please enter a subcategory name', error: true });
            return;
        }

        setIsLoading(true);
        context.setProgress(40);

        postData(`/api/subCat/create`, formFields)
            .then((res) => {
                setIsLoading(false);
                context.setProgress(100);
                context.setAlertBox({ open: true, msg: 'Subcategory added successfully!', error: false });
                history('/subCategory');
            })
            .catch((err) => {
                setIsLoading(false);
                context.setProgress(100);
                context.setAlertBox({ open: true, msg: 'Failed to add subcategory. Please try again later.', error: true });
                console.error("Add Subcategory error:", err);
            });
    };

    return (
        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4 res-col">
                <h5 className="mb-0">Add Subcategory</h5>
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
                        label="Subcategory List"
                        component="a"
                        href={'/subCategory'}
                    />
                    <StyleBreadcrumb label="Add Subcategory" />
                </Breadcrumbs>
            </div>
            <form className='form'>
                <div className='row'>
                    <div className='col-sm-9'>
                        <div className='card p-4 mt-0'>
                            <div className="col">
                                <div className="form-group">
                                    <h6>Category</h6>
                                    <Select
                                        className="w-100"
                                        value={categoryVal}
                                        displayEmpty
                                        MenuProps={menuProps}
                                        onChange={handleChangeCategory}
                                        name='category'
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {
                                            context.catData?.categoryList?.length > 0 && context.catData.categoryList.map((cat, index) => {
                                                return (
                                                    <MenuItem className="text-capitalize" value={cat.id} key={index}>
                                                        {cat.name}
                                                    </MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <h6>Subcategory</h6>
                                    <input
                                        type="text"
                                        name="subCat"
                                        value={formFields.subCat}
                                        onChange={inputChange}
                                    />
                                </div>
                            </div>
                            <Button type='submit' onClick={addSubCat} className='btn-blue btn-lg btn-big w-100'>
                                <FaCloudUploadAlt /> &nbsp; {isLoading === true ?
                                    <CircularProgress color='inherit'
                                        className='ms-3 loader' /> : 'PUBLISH AND VIEW'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddSubCat;