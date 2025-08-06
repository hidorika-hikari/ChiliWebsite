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
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import SearchPage from "./Pages/Search";
const MyContext = createContext();
const stripePromise = loadStripe('pk_test_51RqrM6E8TB46iepBZDHJ5lDzW863H6xzVR2FCfYojdiN2GYVy4YLCTqalEfr3iYMxXHiADzlRYYqIEypDEM6LHoo002nAJGi2I', {
  locale: 'en'
});

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
  //const [cartFields, setCartFields] = useState({});
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
    setAlertBox({
      open: false,
      msg: ''
    });
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
    fetchDataFromApi("/api/cart").then((res) => {
      setCartData(res);
    })
  }, []);

  const getCartData = () => {
    fetchDataFromApi("/api/cart").then((res) => {
      setCartData(res);
    })
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== "" && token !== undefined && token !== null) {
      setIsLogin(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    } else {
      setIsLogin(false);
    }
  }, [isLogin])

  useEffect(() => {
    isOpenProductModel.open === true &&
      fetchDataFromApi(`/api/products/${isOpenProductModel.id}`).then((res) => {
        setProductData(res);
      })
  }, [isOpenProductModel]);

  const getCountry = async (url) => {
    const res = await axios.get(url);
    setCountryList(res.data.data);
  };

  const addToCart = (data) => {
    setAddingInCart(true);
    postData(`/api/cart/add`, data).then((res) => {
      if (res.status !== false) {
        setAlertBox({
          open: true,
          error: false,
          msg: 'Item is add to cart'
        })
        getCartData();
        setTimeout(() => {
          setAddingInCart(false);
        }, 1000);
      } else {
        setAlertBox({
          open: true,
          error: true,
          msg: res.msg
        })
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
    setSearchData
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
            <Route path="/products/category/:id" exact={true} element={<Listing />} />
            <Route path="/products/subCat/:id" exact={true} element={<Listing />} />
            <Route path="/search" exact={true} element={<SearchPage />} />
            <Route path="/product/:id" exact={true} element={<ProductDetails />} />
            <Route path="/cart" exact={true} element={<Cart />} />
            <Route path="/signin" exact={true} element={<SignIn />} />
            <Route path="/signUp" exact={true} element={<SignUp />} />
            <Route path="/my-list" exact={true} element={<MyList />} />
            <Route path="/checkout" exact={true} element={<Checkout />} />
            <Route path="/orders" exact={true} element={<Orders />} />
          </Routes>
          {
            isHeaderFooterShow === true && <Footer />
          }
          {
            isOpenProductModel.open === true && <ProductModel data={productData} />
          }
        </MyContext.Provider>
      </BrowserRouter>
    </Elements>
  );
}

export default App;
export { MyContext }