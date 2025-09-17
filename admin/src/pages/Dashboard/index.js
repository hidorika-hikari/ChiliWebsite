import { FaEye, FaPencilAlt, FaUserCircle } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdDelete, MdShoppingBag } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import { useContext, useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { MyContext } from "../../App";
import { deleteData, fetchDataFromApi } from '../../utils/api';
import DashboardBox from "./components/dashboardBox";
import { DialogActions, DialogContent, CircularProgress, DialogTitle, Dialog, Button, Rating, Pagination } from '@mui/material';

const Dashboard = () => {
  const context = useContext(MyContext);

  const [productList, setProductList] = useState({
    products: [],
    totalPages: 1,
    page: 1
  });

  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [subCategoryCount, setSubCategoryCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [stripeBalance, setStripeBalance] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    context.setIsHideSidebarAndHeader(false);

    fetchDataFromApi("/api/products?page=1").then((res) => {
      setProductList(res);
    }).catch((err) => {
      context.setAlertBox({ open: true, error: true, msg: "Failed to fetch products." });
      console.error("Fetch products error:", err);
    });

    fetchDataFromApi("/api/products/count").then((res) => {
      setProductCount(res?.count || 0);
    }).catch(() => setProductCount(0));

    fetchDataFromApi("/api/category").then((res) => {
      setCategoryCount(res?.categoryList?.length || 0);
    }).catch(() => setCategoryCount(0));

    fetchDataFromApi("/api/subCat").then((res) => {
      setSubCategoryCount(res?.subCategoryList?.length || 0);
    }).catch(() => setSubCategoryCount(0));

    fetchDataFromApi("/api/user/get/count").then((res) => {
      setUserCount(res?.userCount || 0);
    }).catch(() => setUserCount(0));

    fetchDataFromApi("/api/payment/balance")
      .then((res) => {
        setStripeBalance(res);
      })
      .catch((err) => {
        setStripeBalance(null);
        context.setAlertBox({ open: true, error: true, msg: "Failed to fetch Stripe balance." });
        console.error("Stripe fetch error:", err);
      });

    window.scrollTo(0, 0);
  }, [context]);

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!productToDelete) return;
    context.setProgress(40);
    deleteData(`/api/products/${productToDelete.id}`)
      .then(() => {
        context.setAlertBox({ open: true, error: false, msg: 'Product deleted!' });
        setProductList(prev => ({
          ...prev,
          products: prev.products.filter(p => p.id !== productToDelete.id)
        }));
        setDeleteDialogOpen(false);
        setProductToDelete(null);
        context.setProgress(100);
      })
      .catch(err => {
        context.setAlertBox({ open: true, error: true, msg: "Failed to delete product." });
        console.error(err);
        setDeleteDialogOpen(false);
      });
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const deleteProduct = (id) => {
    const product = productList.products.find(p => p.id === id);
    confirmDelete(product);
  };

  const handleChange = (event, value) => {
    fetchDataFromApi(`/api/products?page=${value}`).then((res) => {
      setProductList({ ...res });
    });
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="row dashboardBoxWrapperRow">
          <div className="col-md-8">
            <div className="dashboardBoxWrapper d-flex">
              <DashboardBox color={["#1da256", "#48d483"]} icon={<FaUserCircle />} grow={true} title="Users" count={userCount} />
              <DashboardBox color={["#c012e2", "#eb64fe"]} icon={<IoMdCart />} title="Products" count={productCount} />
              <DashboardBox color={["#2c78e5", "#60aff5"]} icon={<MdShoppingBag />} title="Categories" count={categoryCount} />
              <DashboardBox color={["#e1950e", "#f3cd29"]} icon={<GiStarsStack />} title="Subcategories" count={subCategoryCount} />
            </div>
          </div>

          <div className="col-md-4 ps-0">
            {stripeBalance && stripeBalance.available && stripeBalance.available.length > 0 && (
              <div className="box graphBox">
                <div className="d-flex align-items-center w-100 bottomEle">
                  <h5 className="text-white mb-0 mt-0">Stripe Balance</h5>
                </div>

                <div className="d-flex align-items-center gap-2 mt-2 mb-1">
                  <MdShoppingBag size={24} color="#fff" />
                  <h3 className="text-white fw-bold mb-0">
                    {(stripeBalance.available[0].amount / 100).toLocaleString('en-US')} {stripeBalance.available[0].currency.toUpperCase()}
                  </h3>
                </div>
                <p className="text-white mb-2">Available Stripe Balance</p>

                <div className="d-flex align-items-center gap-2 mt-2 mb-1">
                  <MdShoppingBag size={24} color="#fff" />
                  <h3 className="text-white fw-bold mb-0">
                    {(stripeBalance.pending[0].amount / 100).toLocaleString('en-US')} {stripeBalance.pending[0].currency.toUpperCase()}
                  </h3>
                </div>
                <p className="text-white">Pending Stripe Balance</p>
              </div>
            )}
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <h3 className="hd">All Products</h3>
          <div className="table-responsive mt-3">
            <table className="table table-bordered table-striped v-align">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '100px' }}>PRODUCT</th>
                  <th>CATEGORY</th>
                  <th>SUB CATEGORY</th>
                  <th>BRAND</th>
                  <th style={{ width: '70px' }}>PRICE</th>
                  <th>STOCK</th>
                  <th>RATING</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {productList?.products?.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center productBox">
                        <div className="imgWrapper">
                          <div className="img card shadow m-0">
                            <img src={item.images[0]} alt="" className="w-100" />
                          </div>
                        </div>
                        <div className="info ps-3">
                          <h6>{item.name}</h6>
                          <p>{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td>{item.category?.name}</td>
                    <td>{item.subCat?.subCat}</td>
                    <td>{item.brand}</td>
                    <td>
                      <del className="old">{item.oldPrice} ฿</del>
                      <span className="new text-danger">{item.price} ฿</span>
                    </td>
                    <td>{item.countInStock}</td>
                    <td>
                      <Rating name="size-small" defaultValue={item.rating} size="small" />
                    </td>
                    <td>
                      <div className="actions d-flex align-items-center">
                        <Link to={`/product/details/${item._id}`}>
                          <Button className="secondary" color="secondary"><FaEye /></Button>
                        </Link>
                        <Link to={`/product/edit/${item.id}`}>
                          <Button className="success" color="success"><FaPencilAlt /></Button>
                        </Link>
                        <Button className="error" color="error" onClick={() => deleteProduct(item.id)}>
                          <MdDelete />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="d-flex justify-content-end mt-3">
              <Pagination
                count={productList?.totalPages || 1}
                page={productList?.page || 1}
                color="primary"
                className="pagination"
                showFirstButton
                showLastButton
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this product?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} variant="outlined">Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            {context.isLoading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
};

export default Dashboard;