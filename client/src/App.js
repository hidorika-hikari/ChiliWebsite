import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import { fetchDataFromApi, postData } from "./utils/api";
import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Listing from "./Pages/Listing";
import ProductDetails from "./Pages/ProductDetails";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import axios from 'axios';
import ProductModel from "./Components/ProductModel";
import Cart from "./Pages/Cart";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import MyList from "./Pages/MyList";
import Checkout from "./Pages/Checkout";
import Orders from "./Pages/Orders";
import ResetPassword from "./Pages/ResetPassword";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import SearchPage from "./Pages/Search";
import MyAccount from "./Pages/MyAccount";
import ContactUs from "./Pages/ContactUs";
import ProtectedRoute from "./Components/ProtectedRoute";
import OrderStatusPage from "./Pages/OrderStatus";

const MyContext = createContext();

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
  {
    locale: 'en'
  }
);

function App() {

  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isOpenProductModel, setIsOpenProductModel] = useState({
    id: '',
    open: false
  });

  const [user, setUser] = useState({
    name: '',
    email: '',
    userId: ''
  });

  const [isHeaderFooterShow, setIsHeaderFooterShow] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  const [productData, setProductData] = useState();
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [activeCat, setActiveCat] = useState('');
  const [addingInCart, setAddingInCart] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [searchData, setSearchData] = useState([]);

  const [alertBox, setAlertBox] = useState({
    msg: '',
    error: false,
    open: false
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertBox({ open: false, msg: '' });
  };

  useEffect(() => {
    getCountry("https://countriesnow.space/api/v0.1/countries/");

    fetchDataFromApi("/api/category").then((res) => {
      setCategoryData(res.categoryList);
      setActiveCat(res.categoryList[0]?.name)
    })
    fetchDataFromApi("/api/subCat").then((res) => {
      setSubCategoryData(res.subCategoryList);
    })

    const localUser = JSON.parse(localStorage.getItem("user"));
    if (localUser?.userId) {
      setUser(localUser); // ✅ set user state
      fetchDataFromApi(`/api/cart?userId=${localUser.userId}`).then((res) => {
        setCartData(res);
      });
    } else {
      setCartData([]);
    }
  }, []);

  const getCartData = () => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    if (localUser?.userId) {
      fetchDataFromApi(`/api/cart?userId=${localUser.userId}`).then((res) => {
        setCartData(res);
      });
    } else {
      setCartData([]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData) {
        setIsLogin(true);
        setUser(userData);
      } else {
        setIsLogin(false);
      }
    } else {
      setIsLogin(false);
    }
  }, [setUser]);

  useEffect(() => {
    if (isOpenProductModel.open === true) {
      fetchDataFromApi(`/api/products/${isOpenProductModel.id}`).then((res) => {
        setProductData(res);
      })
    }
  }, [isOpenProductModel]);

  const getCountry = async (url) => {
    const res = await axios.get(url);
    setCountryList(res.data.data);
  };

  const addToCart = (data) => {
    setAddingInCart(true);
    postData(`/api/cart/add`, data).then((res) => {
      if (res.status !== false) {
        setAlertBox({ open: true, error: false, msg: 'Item is added to cart' })
        getCartData();
        setTimeout(() => {
          setAddingInCart(false);
        }, 1000);
      } else {
        setAlertBox({ open: true, error: true, msg: res.msg })
        setAddingInCart(false);
      }
    })
  }

  const values = {
    countryList,
    setSelectedCountry,
    selectedCountry,
    isOpenProductModel,
    setIsOpenProductModel,
    setIsHeaderFooterShow,
    isHeaderFooterShow,
    isLogin,
    setIsLogin,
    categoryData,
    setCategoryData,
    subCategoryData,
    setSubCategoryData,
    activeCat,
    alertBox,
    setAlertBox,
    addToCart,
    addingInCart,
    setAddingInCart,
    cartData,
    setCartData,
    getCartData,
    searchData,
    setSearchData,
    user,       // ✅ added user in context
    setUser     // ✅ added setUser in context
  }

  return (
    <Elements stripe={stripePromise}>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          {
            isHeaderFooterShow === true && <Header />
          }
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
          <Routes>
            <Route path="/" exact={true} element={<Home />} />
            <Route path="/contact-us" exact={true} element={<ContactUs />} />
            <Route path="/products/category/:id" exact={true} element={<Listing />} />
            <Route path="/products/subCat/:id" exact={true} element={<Listing />} />
            <Route path="/search" exact={true} element={<SearchPage />} />
            <Route path="/product/:id" exact={true} element={<ProductDetails />} />
            <Route path="/signin" exact={true} element={<SignIn />} />
            <Route path="/signUp" exact={true} element={<SignUp />} />
            <Route path="/cart" exact={true} element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } />
            <Route path="/my-list" exact={true}
              element={
                <ProtectedRoute>
                  <MyList />
                </ProtectedRoute>
              }
            />
            <Route path="/checkout" exact={true}
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route path="/orders" exact={true}
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route path="/my-account" exact={true}
              element={
                <ProtectedRoute>
                  <MyAccount />
                </ProtectedRoute>
              }
            />
            <Route path="/order-status/:orderId" exact={true}
              element={
                <ProtectedRoute>
                  <OrderStatusPage />
                </ProtectedRoute>
              }
            />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
          {
            isHeaderFooterShow === true && <Footer />
          }
          {
            isOpenProductModel.open === true && <ProductModel data={productData} />
          }
        </MyContext.Provider>
      </BrowserRouter>
    </Elements >
  );
}

export default App;
export { MyContext }