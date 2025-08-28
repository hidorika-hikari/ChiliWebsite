import React, { useEffect, useState, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Button, MenuItem, Pagination, CircularProgress, FormControl, Select, InputLabel } from '@mui/material';
import { IoIosMenu } from 'react-icons/io';
import { CgMenuGridR } from 'react-icons/cg';
import { HiViewGrid } from 'react-icons/hi';
import { TfiLayoutGrid4Alt } from 'react-icons/tfi';
import { fetchDataFromApi } from '../../utils/api';
import { MyContext } from '../../App';
import Sidebar from '../../Components/Sidebar';
import ProductItem from '../../Components/ProductItem';

const SearchPage = () => {
    const { id } = useParams();
    const { search } = useLocation();
    const query = new URLSearchParams(search).get("q");
    const context = useContext(MyContext);

    const [productView, setProductView] = useState("four");
    const [productData, setProductData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handlePerPageChange = (num) => {
        setPerPage(num);
        setPage(1);
    };

    const fetchProducts = (url) => {
        setIsLoading(true);
        fetchDataFromApi(url).then((res) => {
            setProductData(res.products || []);
            setTotalPages(res.totalPages || 1);
            setIsLoading(false);
        });
    };

    const filterData = (subCatId) => {
        fetchProducts(`/api/products?subCat=${subCatId}&limit=${perPage}&page=${page}`);
    };

    const filterByPrice = (price, subCatId) => {
        let url = `/api/products?minPrice=${price[0]}&maxPrice=${price[1]}&limit=${perPage}&page=${page}`;
        if (subCatId) url += `&subCat=${subCatId}`;
        if (id) url += `&category=${id}`;
        fetchProducts(url);
    };

    const filterByRating = (rating) => {
        fetchProducts(`/api/products?rating=${rating}${id ? `&category=${id}` : ""}&limit=${perPage}&page=${page}`);
    };

    useEffect(() => {
        if (id) {
            fetchProducts(`/api/products?category=${id}&limit=${perPage}&page=${page}`);
        }
    }, [id, perPage, page]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query) {
                fetchProducts(`/api/search?q=${query}&limit=${perPage}&page=${page}`);
            } else if (!id && context.searchData?.length > 0) {
                setProductData(context.searchData.slice(0, perPage));
                setTotalPages(1);
                setIsLoading(false);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [query, context.searchData, id, perPage, page]);

    return (
        <section className="product_Listing_Page">
            <div className="container">
                <div className="productListing d-flex">
                    <Sidebar filterByPrice={filterByPrice} filterData={filterData} filterByRating={filterByRating} />

                    <div className="content_right">
                        <div className="showBy mt-3 mb-3 d-flex align-items-center">
                            <div className="d-flex align-items-center btnWrapper">
                                <Button onClick={() => setProductView("one")} className={`view-toggle ${productView === "one" && "act"}`}>
                                    <IoIosMenu />
                                </Button>
                                <Button onClick={() => setProductView("two")} className={`view-toggle ${productView === "two" && "act"}`}>
                                    <HiViewGrid />
                                </Button>
                                <Button onClick={() => setProductView("three")} className={`view-toggle ${productView === "three" && "act"}`}>
                                    <CgMenuGridR />
                                </Button>
                                <Button onClick={() => setProductView("four")} className={`view-toggle ${productView === "four" && "act"}`}>
                                    <TfiLayoutGrid4Alt />
                                </Button>
                            </div>

                            <div className="ms-auto showByFilter" style={{ minWidth: 120 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="per-page-label">Show</InputLabel>
                                    <Select
                                        labelId="per-page-label"
                                        value={perPage}
                                        label="Show"
                                        onChange={(e) => handlePerPageChange(e.target.value)}
                                    >
                                        {[5, 10, 15, 20, 25].map((num) => (
                                            <MenuItem key={num} value={num}>
                                                {num}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                        {isLoading ? (
                            <div
                                className="loading-indicator text-center py-5 d-flex justify-content-center align-items-center"
                                style={{ minHeight: "300px" }}
                            >
                                <CircularProgress size={100} />
                            </div>
                        ) : (
                            <div className="productListing">
                                {productData?.map((item, index) => (
                                    <ProductItem key={index} itemView={productView} item={item} />
                                ))}
                            </div>
                        )}

                        <div className="d-flex align-items-center justify-content-center mt-5">
                            <Pagination count={totalPages} page={page} onChange={(e, value) => setPage(value)} color="primary" size="large" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SearchPage;