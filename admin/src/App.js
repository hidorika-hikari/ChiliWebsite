import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import React, { useState, createContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingBar from "react-top-loading-bar";
import ProductDetails from './pages/ProductDetails';
import Product from './pages/Product'
import ProductUpload from './pages/ProductAdd';
import CategoryAdd from './pages/CategoryAdd'
import Category from './pages/CategoryList';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import EditProduct from './pages/EditProduct';
import { fetchDataFromApi } from './utils/api';
import AddSubCat from './pages/SubCategoryAdd';
import CategoryList from './pages/CategoryList';
import SubCategory from './pages/subCategoryList';

const MyContext = createContext();

function App() {
    const [isToggleSidebar, setIsToggleSidebar] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [isHideSidebarAndHeader, setIsHideSidebarAndHeader] = useState(false);
    const [themeMode, setThemeMode] = useState(true);
    // const [open, setOpen] = useState(true);
    // const [msg, setMsg] = useState(true);
    const [catData, setCatData] = useState([]);
    const [progress, setProgress] = useState(0);
    const [alertBox, setAlertBox] = useState({
        msg: '',
        error: false,
        open: false
    });

    useEffect(() => {
        if (themeMode === true) {
            document.body.classList.remove('dark');
            document.body.classList.add('light');
            localStorage.setItem('themeMode', 'light');
        }
        else {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
            localStorage.setItem('themeMode', 'dark');
        }
    }, [themeMode]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertBox({
            open: false,
            msg: ''
        });
    };

    useEffect(() => {
        setProgress(20)
        fetchCategory();
    },[])

    const fetchCategory = () => {
        fetchDataFromApi('/api/category').then((res) => {
            setCatData(res);
            setProgress(100);
        })
    }

    const values = {
        isToggleSidebar,
        setIsToggleSidebar,
        isLogin,
        setIsLogin,
        isHideSidebarAndHeader,
        setIsHideSidebarAndHeader,
        themeMode,
        setThemeMode,
        alertBox,
        setAlertBox,
        setProgress,
        catData,
        fetchCategory
    };

    return (
        <BrowserRouter>
            <MyContext.Provider value={values}>
                <LoadingBar
                    color="#f11946"
                    progress={progress}
                    onLoaderFinished={() => setProgress(0)}
                    className='topLoadingBar'
                />
                <Snackbar open={alertBox.open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert
                        onClose={handleClose}
                        severity={alertBox.error === false ? "success" : "error"}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {alertBox.msg}
                    </Alert>
                </Snackbar>
                {isHideSidebarAndHeader !== true && <Header />}
                <div className="main d-flex">
                    {isHideSidebarAndHeader !== true && (
                        <div
                            className={`sidebarWrapper ${isToggleSidebar === true ? 'toggle' : ''}`}
                        >
                            <Sidebar />
                        </div>
                    )}
                    <div
                        className={`content ${isHideSidebarAndHeader === true && 'full'} ${isToggleSidebar === true ? 'toggle' : ''}`}
                    >
                        <Routes>
                            <Route
                                path="/"
                                exact={true}
                                element={<Dashboard />}
                            />
                            <Route
                                path="/dashboard"
                                exact={true}
                                element={<Dashboard />}
                            />
                            <Route
                                path="/login"
                                exact={true}
                                element={<Login />}
                            />
                            <Route
                                path="/signUp"
                                exact={true}
                                element={<SignUp />}
                            />
                            <Route
                                path="/products"
                                exact={true}
                                element={<Product />}
                            />
                            <Route
                                path="/product/details"
                                exact={true}
                                element={<ProductDetails />}
                            />
                            <Route
                                path="/product/upload"
                                exact={true}
                                element={<ProductUpload />}
                            />
                            <Route
                                path="/category/add"
                                exact={true}
                                element={<CategoryAdd />}
                            />
                            <Route
                                path="/category"
                                exact={true}
                                element={<CategoryList />}
                            />
                            <Route
                                path="/subCategory"
                                exact={true}
                                element={<SubCategory />}
                            />
                            <Route
                                path="/product/edit/:id"
                                exact={true}
                                element={<EditProduct />}
                            />
                            <Route
                                path="/subCategory/add"
                                exact={true}
                                element={<AddSubCat />}
                            />
                        </Routes>
                    </div>
                </div>
            </MyContext.Provider>
        </BrowserRouter>
    );
}

export default App;
export { MyContext };