import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../../Components/Sidebar';
import ProductItem from '../../Components/ProductItem';
import { Button, FormControl, Select, MenuItem, InputLabel, CircularProgress, Drawer } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { IoIosMenu } from 'react-icons/io';
import { CgMenuGridR } from 'react-icons/cg';
import { HiViewGrid } from 'react-icons/hi';
import { TfiLayoutGrid4Alt } from 'react-icons/tfi';
import { fetchDataFromApi } from '../../utils/api';
import { useParams } from 'react-router-dom';

const Listing = () => {
    const [productView, setProductView] = useState("four");
    const [productData, setProductData] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [perPage, setPerPage] = useState(10);
    const { id } = useParams();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [filtersOpen, setFiltersOpen] = useState(false);

    const fetchAndSetData = useCallback(async (url) => {
        setIsLoading(true);
        try {
            const fullUrl = `${url}${url.includes("?") ? "&" : "?"}perPage=${perPage}`;
            const res = await fetchDataFromApi(fullUrl);
            setProductData(res.products);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    }, [perPage]);

    const filterData = (subCatId) => {
        if (subCatId === null || subCatId === '') {
            if (id) {
                fetchAndSetData(`/api/products?category=${id}`);
            } else {
                fetchAndSetData(`/api/products`);
            }
        } else {
            fetchAndSetData(`/api/products?subCat=${subCatId}`);
        }
    };

    const filterByPrice = (price, subCatId) => {
        let url = `/api/products?minPrice=${price[0]}&maxPrice=${price[1]}`;
        
        if (subCatId && subCatId !== '') {
            url += `&subCat=${subCatId}`;
        } else if (id) {
            url += `&category=${id}`;
        }
        
        fetchAndSetData(url);
    };

    const filterByRating = (rating) => {
        let url = `/api/products?rating=${rating}`;
        if (id) {
            url += `&category=${id}`;
        }
        
        fetchAndSetData(url);
    };

    useEffect(() => {
        if (id) fetchAndSetData(`/api/products?category=${id}`);
        else fetchAndSetData(`/api/products`);
    }, [id, perPage, fetchAndSetData]);

    const handlePerPageChange = (num) => {
        setPerPage(num);
    };

    return (
        <section className="product_Listing_Page">
            <div className="container">
                <div className="productListing d-flex">
                    {isSmallScreen ? (
                        <>
                            <Drawer
                                anchor="left"
                                open={filtersOpen}
                                onClose={() => setFiltersOpen(false)}
                                PaperProps={{ sx: { width: '85vw', maxWidth: 360, padding: 2 } }}
                            >
                                <Sidebar
                                    filterByPrice={filterByPrice}
                                    filterData={filterData}
                                    filterByRating={filterByRating}
                                />
                            </Drawer>
                        </>
                    ) : (
                        <Sidebar
                            filterByPrice={filterByPrice}
                            filterData={filterData}
                            filterByRating={filterByRating}
                        />
                    )}

                    <div className="content_right">
                        <div className="showBy mt-3 mb-3 d-flex align-items-center" style={{ gap: 8, flexWrap: 'wrap' }}>
                            {isSmallScreen && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    sx={{
                                        borderRadius: "24px",
                                        textTransform: "none",
                                        boxShadow: 3,
                                        px: 3,
                                        "&:hover": {
                                            backgroundColor: "#2bbef9",
                                        },
                                    }}
                                    onClick={() => setFiltersOpen(true)}
                                >
                                    Filters
                                </Button>
                            )}
                            <div className="d-flex align-items-center btnWrapper">
                                <Button onClick={() => setProductView("one")} className={`view-toggle ${productView === "one" && "act"}`}><IoIosMenu /></Button>
                                <Button onClick={() => setProductView("two")} className={`view-toggle ${productView === "two" && "act"}`}><HiViewGrid /></Button>
                                <Button onClick={() => setProductView("three")} className={`view-toggle ${productView === "three" && "act"}`}><CgMenuGridR /></Button>
                                <Button onClick={() => setProductView("four")} className={`view-toggle ${productView === "four" && "act"}`}><TfiLayoutGrid4Alt /></Button>
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
                                        {[5, 10, 15, 20, 25].map(num => (
                                            <MenuItem key={num} value={num}>{num}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                                <CircularProgress />
                            </div>
                        ) : (
                            <div className="productListing">
                                {productData?.map((item, index) => (
                                    <ProductItem
                                        key={index}
                                        itemView={productView}
                                        className={productView}
                                        item={item}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Listing;