import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { deleteData, fetchDataFromApi } from "../../utils/api";

const MyList = () => {
    const [myListData, setMyListData] = useState([]);
    //let [cartFields, setCartFields] = useState({});
    const context = useContext(MyContext);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromApi(`/api/my-list?userId=${user?.userId}`).then((res) => {
            setMyListData(res);
        });
    }, []);

    const removeItem = (id) => {
        deleteData(`/api/my-list/${id}`).then((res) => {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Item remove form my list"
            })
            const user = JSON.parse(localStorage.getItem("user"));
            fetchDataFromApi(`/api/my-list?userId=${user?.userId}`).then((res) => {
                setMyListData(res);
            })
            //context.getCartData();
        })
    }
    return (
        <>
            <section className="section cartPage">
                <div className="container">
                    <h2 className="hd mb-2">My List</h2>
                    <p>There are <b className="text-red">{myListData?.length}</b> My List</p>
                    <div className="myListTableWrapper">
                        {
                            myListData?.length !== 0 ?
                                <div className="row">
                                    <div className="col-md-12 pe-5">
                                        <div className="table-responsive myListTable">
                                            <table className="table table-striped">
                                                <thead className="table-dark text-white">
                                                    <tr>
                                                        <th width="35%" style={{ paddingLeft: '20px' }}>Product</th>
                                                        <th width="15%">Unit Price</th>
                                                        <th width="10%">Remove</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        myListData.length !== 0 && myListData.map((item) => (
                                                            <tr key={item.id}>
                                                                <td width="35%">
                                                                    <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                                        <div className="d-flex align-items-center cartItemImgWrapper">
                                                                            <div className="imgWrapper">
                                                                                <img
                                                                                    src={item.images}
                                                                                    className="w-100"
                                                                                    alt={item.productTitle}
                                                                                    style={{ objectFit: 'contain' }}
                                                                                />
                                                                            </div>
                                                                            <div className="info pe-3">
                                                                                <h6>{item.productTitle}</h6>
                                                                                <Rating name="read-only" value={item.rating} readOnly precision={0.5} size="small" />
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                </td>
                                                                <td width="15%">{item.price} ฿</td>
                                                                <td width="10%"><span className="remove" onClick={() => removeItem(item?._id)}><IoIosClose /></span></td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="empty d-flex align-items-center justify-content-center flex-column">
                                    <img src="https://www.freeiconspng.com/thumbs/list-icon/to-do-list-icon-buy-this-icon-for--0-48-1.png" width="200" alt="" />
                                    <h3 className="mt-3">My list is currently empty</h3>
                                    <br />
                                    <Link to="/"><Button className="btn-blue bg-red btn-lg btn-big btn-round"><FaHome /> &nbsp; Continue Shopping</Button></Link>
                                </div>
                        }
                    </div>
                </div>
            </section>
        </>
    );
};

export default MyList;