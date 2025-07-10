import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route , Routes} from "react-router-dom";
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
import { fetchDataFromApi } from "./utils/api";

const MyContext = createContext();

function App() {

  const [countryList,setCountryList] = useState([]);
  const [selectedCountry,setSelectedCountry] = useState('');
  const [isOpenProductModel,setIsOpenProductModel] = useState({
    id:'',
    open:false
  });
  const [isHeaderFooterShow, setIsHeaderFooterShow] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [productData, setProductData] = useState();

  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);

  useEffect(() => {
    getCountry("https://countriesnow.space/api/v0.1/countries/");
    
    fetchDataFromApi("/api/category").then((res) => {
      setCategoryData(res.categoryList);
    })
    fetchDataFromApi("/api/subCat").then((res) => {
      setSubCategoryData(res.subCategoryList);
    })
  },[]);

  useEffect(() => {
    isOpenProductModel.open === true &&
    fetchDataFromApi(`/api/products/${isOpenProductModel.id}`).then((res) => {
      setProductData(res);
    })
  },[isOpenProductModel]);
  
  const getCountry = async (url) => {
    const responsive = await axios.get(url).then((res)=>{
      setCountryList(res.data.data)
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
    setSubCategoryData
  }
  return (
    <BrowserRouter>
    <MyContext.Provider value={values}>
      {
        isHeaderFooterShow === true && <Header/>
      }
      <Routes>
        <Route path="/" exact={true} element={<Home/>}/>
        <Route path="/cat/:id" exact={true} element={<Listing/>}/>
        <Route path="/product/:id" exact={true} element={<ProductDetails/>}/>
        <Route path="/cart" exact={true} element={<Cart/>}/>
        <Route path="/signIn" exact={true} element={<SignIn/>}/>
        <Route path="/signUp" exact={true} element={<SignUp/>}/>
      </Routes>
      {
        isHeaderFooterShow === true && <Footer/>
      }
      
      {
        isOpenProductModel.open === true && <ProductModel data={productData}/>
      }
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
export {MyContext}