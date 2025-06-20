import { FaEye, FaPencilAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Pagination from '@mui/material/Pagination';
import Rating from '@mui/material/Rating';
import { MyContext } from '../../App';
import { Breadcrumbs, Chip, emphasize, styled } from '@mui/material';
import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { fetchDataFromApi } from '../../ultils/api';

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


const ProductDetails = () => {
    const [showBy, setShowBy] = useState('');
    const [showBySetCateBy, setCateBy] = useState('');
    const [productList, setProductList] = useState([]);
    const context = useContext(MyContext);

    useEffect(() => {
        context.setIsHideSidebarAndHeader(false);
        fetchDataFromApi("/api/products").then((res) => {
            setProductList(res)
        })
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 res-col">
                    <h5 className="mb-0">Product List</h5>
                    <Breadcrumbs
                        aria-label="breadcrumb"
                        className="ms-auto breadcrumb_"
                    >
                        <StyleBreadcrumb
                            component="a"
                            href="#"
                            label="Dashboard"
                            icon={<FaHome fontSize="small" />}
                        />
                        <StyleBreadcrumb
                            label="Products"
                            component="a"
                            href="#"
                        />
                        <StyleBreadcrumb label="Product List" />
                    </Breadcrumbs>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Best Selling Products</h3>
                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">
                            <h4>SHOW BY</h4>
                            <FormControl size="small" className="w-100">
                                <Select
                                    value={showBy}
                                    onChange={(e) => setShowBy(e.target.value)}
                                    displayEmpty
                                    labelId="demo-select-small-label"
                                    className="w-100"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className="col-md-3">
                            <h4>CATEGORY BY</h4>
                            <FormControl size="small" className="w-100">
                                <Select
                                    value={showBySetCateBy}
                                    onChange={(e) => setCateBy(e.target.value)}
                                    displayEmpty
                                    labelId="demo-select-small-label"
                                    className="w-100"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered table-striped v-align">
                            <thead className="table-dark">
                                <tr>
                                    <th>PRODUCT</th>
                                    <th>CATEGORY</th>
                                    <th>BRAND</th>
                                    <th style={{ width: '70px' }}>PRICE</th>
                                    <th>STOCK</th>
                                    <th>RATING</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    productList?.length !== 0 && productList?.map((item, index) => {
                                        return (
                                            <tr>
                                                <td>
                                                    <div className="d-flex align-items-center productBox">
                                                        <div className="imgWrapper">
                                                            <div className="img card shadow m-0">
                                                                <img
                                                                    src={item.images[0]}
                                                                    alt=""
                                                                    className="w-100"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="info ps-3">
                                                            <h6>{item.name}</h6>
                                                            <p>{item.description}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{item.category.name}</td>
                                                <td>{item.brand}</td>
                                                <td>
                                                    <del className="old">{item.oldPrice}</del>
                                                    <span className="new text-danger">{item.price}</span>
                                                </td>
                                                <td>{item.countInStock}</td>
                                                <td>
                                                    <Rating
                                                        name="size-small"
                                                        defaultValue={item.rating}
                                                        size="small"
                                                    />
                                                </td>
                                                <td>
                                                    <div className="actions d-flex align-items-center">
                                                        <Link to="/product/details">
                                                            <Button className="secondary" color="secondary">
                                                                <FaEye />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            className="success"
                                                            color="success"
                                                        >
                                                            <FaPencilAlt />
                                                        </Button>
                                                        <Button
                                                            className="error"
                                                            color="error"
                                                        >
                                                            <MdDelete />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>

                        <div className="d-flex tableFooter">
                            <p>
                                Showing <b>12</b> of <b>60</b> results
                            </p>
                            <Pagination
                                count={10}
                                color="primary"
                                className="pagination"
                                showFirstButton
                                showLastButton
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetails;
