import { FaEye, FaPencilAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import { Breadcrumbs, Chip, emphasize, ListItem, styled } from '@mui/material';
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

const Category = () => {
    const [catData, setCatData] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDataFromApi('/api/category').then((res) => {
            setCatData(res);
            console.log(res);
        })
    }, []);

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 res-col">
                    <h5 className="mb-0">Category List</h5>
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
                            label="Category"
                            component="a"
                            href="#"
                        />
                        <StyleBreadcrumb label="Category List" />
                    </Breadcrumbs>
                </div>

                <div className="card shadow border-0 p-3 mt-4">

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered table-striped v-align">
                            <thead className="table-dark">
                                <tr>
                                    <th>UID</th>
                                    <th>IMAGE</th>
                                    <th>CATEGORY</th>
                                    <th>COLOR</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    catData.length !== 0 && catData?.map((item, index) => {
                                        return (
                                            <tr>
                                            <td><span>#{index+1}</span></td>
                                            <td>
                                                <div className="d-flex align-items-center productBox">
                                                    <div className="imgWrapper">
                                                        <div className="img card shadow m-0" style={{ width: '50px' }}>
                                                            <img
                                                                src={item.images[0]}
                                                                alt=""
                                                                className="w-100"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{item.name}</td>
                                            <td>{item.color}n</td>
                                            <td>
                                                <div className="actions d-flex align-items-center">
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

export default Category;
