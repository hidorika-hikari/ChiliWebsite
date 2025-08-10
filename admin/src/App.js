import React, { useState, createContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { fetchDataFromApi } from './utils/api';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import LoadingBar from "react-top-loading-bar";
import ProductDetails from './pages/ProductDetails';
import Product from './pages/Product'
import AddCategory from './pages/addCategory'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import EditProduct from './pages/editProduct';
import AddSubCat from './pages/addSubCategory';
import CategoryList from './pages/CategoryList';
import AddProductWeight from './pages/addProductWeight';
import AddProductSpicy from './pages/addProductSize';
import AddProductContent from './pages/addProductContent';
import AddProduct from './pages/addProduct';
import Orders from './pages/Orders';
import SubCategoryList from './pages/subCategoryList';
import AddHomeBanner from './pages/addHomeBanner';
import HomeBannerList from './pages/homeBannerList';
import ProtectedRoute from './components/ProtectedRoute';


const MyContext = createContext();

function App() {
    const [isToggleSidebar, setIsToggleSidebar] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [isHideSidebarAndHeader, setIsHideSidebarAndHeader] = useState(false);
    const [themeMode, setThemeMode] = useState(true);
    const [catData, setCatData] = useState([]);
    const [subCatData, setSubCatData] = useState([]);
    const [progress, setProgress] = useState(0);
    const [user,setUser] = useState({
        name: '',
        email: '',
        userId: ''
    })
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

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        console.log("[DEBUG] token:", token);
        console.log("[DEBUG] user (raw):", userStr);
        let userData = null;
        try {
            userData = JSON.parse(userStr);
        } catch (e) {
            console.log("[DEBUG] Failed to parse user from localStorage");
        }
        console.log("[DEBUG] user (parsed):", userData);
        if (token !== "" && token !== undefined && token !== null){
            // Check if user has admin role
            if (userData && userData.role === 'admin') {
                setIsLogin(true);
                setUser(userData);
                console.log("[DEBUG] User is admin, login success");
            } else {
                // If user is not admin, clear storage and redirect to login
                console.log("[DEBUG] User is not admin or missing role, redirecting to /login");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setIsLogin(false);
                setUser({
                    name: '',
                    email: '',
                    userId: '',
                    role: ''
                });
                window.location.href = '/login';
            }
        } else {
            setIsLogin(false);
            console.log("[DEBUG] No token found, not logged in");
        }
    }, []);

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
        fetchSubCategory();
    },[])

    const fetchCategory = () => {
        fetchDataFromApi('/api/category').then((res) => {
            setCatData(res);
            setProgress(100);
        })
    }

    const fetchSubCategory = () => {
        fetchDataFromApi('/api/subCat').then((res) => {
            setSubCatData(res);
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
        fetchCategory,
        subCatData,
        fetchSubCategory,
        setUser,
        user
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
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard"
                                exact={true}
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
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
                                element={
                                    <ProtectedRoute>
                                        <Product />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/product/details/:id"
                                exact={true}
                                element={
                                    <ProtectedRoute>
                                        <ProductDetails />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/product/add"
                                exact={true}
                                element={
                                    <ProtectedRoute>
                                        <AddProduct />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/category/add"
                                exact={true}
                                element={
                                    <ProtectedRoute>
                                        <AddCategory />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/category"
                                exact={true}
                                element={
                                    <ProtectedRoute>
                                        <CategoryList />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/subCategory"
                                exact={true}
                                element={
                                    <ProtectedRoute>
                                        <SubCategoryList />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/product/edit/:id"
                                exact={true}
                                element={
                                    <ProtectedRoute>
                                        <EditProduct />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/subCategory/add"
                                exact={true}
                                element={
                                    <ProtectedRoute>
                                        <AddSubCat />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/productContent/add"
                                exact={true}
                                element={
                                    <ProtectedRoute>
                                        <AddProductContent />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/productWeight/add"
                                exact={true}
                                element={
                                    <ProtectedRoute>
                                        <AddProductWeight />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/productSpicy/add"
                                exact={true}
                                element={
                                    <ProtectedRoute>
                                        <AddProductSpicy />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/orders"
                                exact={true}
                                element={
                                    <ProtectedRoute>
                                        <Orders />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/homeBanner/add"
                                exact={true}
                                element={
                                    <ProtectedRoute>
                                        <AddHomeBanner/>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/homeBannerList"
                                exact={true}
                                element={
                                    <ProtectedRoute>
                                        <HomeBannerList/>
                                    </ProtectedRoute>
                                }
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