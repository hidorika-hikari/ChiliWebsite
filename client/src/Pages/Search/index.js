import React, { useEffect, useState, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Button, Menu, MenuItem, Pagination, CircularProgress } from '@mui/material';
import { IoIosMenu } from 'react-icons/io';
import { CgMenuGridR } from 'react-icons/cg';
import { HiViewGrid } from 'react-icons/hi';
import { TfiLayoutGrid4Alt } from 'react-icons/tfi';
import { FaAngleDown } from 'react-icons/fa';
import { fetchDataFromApi } from '../../utils/api';
import { MyContext } from '../../App';
import Sidebar from '../../Components/Sidebar';
import ProductItem from '../../Components/ProductItem';

const SearchPage = () => {
    const { id } = useParams();
    const { search } = useLocation();
    const query = new URLSearchParams(search).get('q');
    const context = useContext(MyContext);

    const [anchorEl, setAnchorEl] = useState(null);
    const [productView, setProductView] = useState('four');
    const [productData, setProductData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const openDropdown = Boolean(anchorEl);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const filterData = (id) => {
        setIsLoading(true);
        fetchDataFromApi(`/api/products?subCat=${id}`).then((res) => {
            setProductData(res.products);
            setIsLoading(false);
        });
    };

    const filterByPrice = (price, subCatId) => {
        let url = `/api/products?minPrice=${price[0]}&maxPrice=${price[1]}`;
        if (subCatId) url += `&subCat=${subCatId}`;
        if (id) url += `&category=${id}`;
        setIsLoading(true);
        fetchDataFromApi(url).then((res) => {
            setProductData(res.products);
            setIsLoading(false);
        });
    };

    const filterByRating = (rating) => {
        setIsLoading(true);
        fetchDataFromApi(`/api/products?rating=${rating}${id ? `&category=${id}` : ''}`).then((res) => {
            setProductData(res.products);
            setIsLoading(false);
        });
    };

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            fetchDataFromApi(`/api/products?category=${id}`).then((res) => {
                setProductData(res.products);
                setIsLoading(false);
            });
        }
    }, [id]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(true);
            if (query) {
                fetchDataFromApi(`/api/search?q=${query}`).then((res) => {
                    setProductData(res);
                    setIsLoading(false);
                });
            } else if (!id && context.searchData?.length > 0) {
                setProductData(context.searchData);
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [query, context.searchData, id]);

    return (
        <>
            <section className='product_Listing_Page'>
                <div className='container'>
                    <div className='productListing d-flex'>
                        <Sidebar filterByPrice={filterByPrice} filterData={filterData} filterByRating={filterByRating} />
                        <div className='content_right'>
                            <div className='showBy mt-3 mb-3 d-flex align-items-center'>
                                <div className='d-flex align-items-center btnWrapper'>
                                    <Button onClick={() => setProductView('one')} className={`view-toggle ${productView === 'one' && 'act'}`}>
                                        <IoIosMenu />
                                    </Button>
                                    <Button onClick={() => setProductView('two')} className={`view-toggle ${productView === 'two' && 'act'}`}>
                                        <HiViewGrid />
                                    </Button>
                                    <Button onClick={() => setProductView('three')} className={`view-toggle ${productView === 'three' && 'act'}`}>
                                        <CgMenuGridR />
                                    </Button>
                                    <Button onClick={() => setProductView('four')} className={`view-toggle ${productView === 'four' && 'act'}`}>
                                        <TfiLayoutGrid4Alt />
                                    </Button>
                                </div>

                                <div className='ms-auto showByFilter'>
                                    <Button onClick={handleClick}>Show 9 <FaAngleDown /></Button>
                                    <Menu
                                        className='w-100 showPerPageDropdown'
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={openDropdown}
                                        onClose={handleClose}
                                    >
                                        <MenuItem onClick={handleClose}>10</MenuItem>
                                        <MenuItem onClick={handleClose}>20</MenuItem>
                                        <MenuItem onClick={handleClose}>30</MenuItem>
                                        <MenuItem onClick={handleClose}>40</MenuItem>
                                        <MenuItem onClick={handleClose}>50</MenuItem>
                                    </Menu>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="loading-indicator text-center py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                                    <CircularProgress size={100} />
                                </div>
                            ) : (
                                <div className='productListing'>
                                    {productData?.map((item, index) => (
                                        <ProductItem key={index} itemView={productView} item={item} />
                                    ))}
                                </div>
                            )}

                            <div className='d-flex align-items-center justify-content-center mt-5'>
                                <Pagination count={5} color="primary" size='large' />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SearchPage;