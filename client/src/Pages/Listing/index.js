import React, { useEffect, useState } from 'react';
import Sidebar from '../../Components/Sidebar';
import ProductItem from '../../Components/ProductItem';
import { Button, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { IoIosMenu } from 'react-icons/io';
import { CgMenuGridR } from 'react-icons/cg';
import { HiViewGrid } from 'react-icons/hi';
import { TfiLayoutGrid4Alt } from 'react-icons/tfi';
import { fetchDataFromApi } from '../../utils/api';
import { useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const Listing = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [productView, setProductView] = useState('four');
    const [productData, setProductData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [perPage, setPerPage] = useState(10);
    const openDropdown = Boolean(anchorEl);
    const { id } = useParams();

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const fetchAndSetData = async (url) => {
        setIsLoading(true);
        try {
            const fullUrl = `${url}${url.includes('?') ? '&' : '?'}perPage=${perPage}`;
            const res = await fetchDataFromApi(fullUrl);
            setProductData(res.products);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterData = (subCatId) => {
        fetchAndSetData(`/api/products?subCat=${subCatId}`);
    };

    const filterByPrice = (price, subCatId) => {
        fetchAndSetData(`/api/products?minPrice=${price[0]}&maxPrice=${price[1]}&subCat=${subCatId}`);
        if (id) fetchAndSetData(`/api/products?minPrice=${price[0]}&maxPrice=${price[1]}&category=${id}`);
    };

    const filterByRating = (rating) => {
        const url = `/api/products?rating=${rating}${id ? `&category=${id}` : ''}`;
        fetchAndSetData(url);
    };

    useEffect(() => {
        if (id) fetchAndSetData(`/api/products?category=${id}`);
        else fetchAndSetData(`/api/products`);
    }, [id, perPage]);

    const handlePerPageChange = (num) => {
        setPerPage(num);
        handleClose();
    };

    return (
        <section className='product_Listing_Page'>
            <div className='container'>
                <div className='productListing d-flex'>
                    <Sidebar
                        filterByPrice={filterByPrice}
                        filterData={filterData}
                        filterByRating={filterByRating}
                    />

                    <div className='content_right'>
                        <div className='showBy mt-3 mb-3 d-flex align-items-center'>
                            <div className='d-flex align-items-center btnWrapper'>
                                <Button onClick={() => setProductView('one')} className={`view-toggle ${productView === 'one' && 'act'}`}><IoIosMenu /></Button>
                                <Button onClick={() => setProductView('two')} className={`view-toggle ${productView === 'two' && 'act'}`}><HiViewGrid /></Button>
                                <Button onClick={() => setProductView('three')} className={`view-toggle ${productView === 'three' && 'act'}`}><CgMenuGridR /></Button>
                                <Button onClick={() => setProductView('four')} className={`view-toggle ${productView === 'four' && 'act'}`}><TfiLayoutGrid4Alt /></Button>
                            </div>

                            <div className='ms-auto showByFilter' style={{ minWidth: 120 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="per-page-label">Show</InputLabel>
                                    <Select
                                        labelId="per-page-label"
                                        value={perPage}
                                        label="Show"
                                        onChange={(e) => handlePerPageChange(e.target.value)}
                                    >
                                        {[5, 10, 15, 20, 25].map(num => (
                                            <MenuItem key={num} value={num}>{num}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                                <CircularProgress />
                            </div>
                        ) : (
                            <>
                                <div className='productListing'>
                                    {productData?.map((item, index) => (
                                        <ProductItem
                                            key={index}
                                            itemView={productView}
                                            className={productView}
                                            item={item}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Listing;