import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { deleteData, fetchDataFromApi } from "../../utils/api";
import { FaListCheck } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const MyList = () => {
    const [myListData, setMyListData] = useState([]);
    const context = useContext(MyContext);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromApi(`/api/my-list?userId=${user?.userId}`).then((res) => {
            setMyListData(res);
        });
    }, []);

    const removeItem = (id) => {
        deleteData(`/api/my-list/${id}`)
            .then(() => {
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: "Product removed from my list",
                });

                const user = JSON.parse(localStorage.getItem("user"));
                return fetchDataFromApi(`/api/my-list?userId=${user?.userId}`);
            })
            .then((res) => {
                setMyListData(res);
            })
            .catch((err) => {
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "Failed to remove product in my list. Please try again.",
                });
                console.error("Remove product error:", err);
            });
    };

    return (
        <section className="section cartPage">
            <div className="container">
                <h2 className="hd mb-3">My List</h2>
                {myListData?.length > 0 ? (
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={16}
                        navigation={true}
                        pagination={{ clickable: true }}
                        modules={[Navigation, Pagination]}
                        breakpoints={{
                            576: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1200: { slidesPerView: 4 },
                        }}
                        className="mySwiper"
                    >
                        {myListData.map((item) => (
                            <SwiperSlide key={item.id}>
                                <div className="productItem position-relative">
                                    <div className="imgWrapper position-relative">
                                        <img
                                            src={item.images}
                                            alt={item.productTitle}
                                            className="w-100"
                                            style={{ objectFit: "cover", height: 250 }}
                                        />
                                        <span
                                            className="position-absolute top-0 end-0 m-2 text-danger cursor-pointer d-flex align-items-center justify-content-center"
                                            style={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: '50%',
                                                border: '1px solid #fff',
                                                backgroundColor: 'white',
                                                zIndex: 10,
                                            }}
                                            onClick={() => removeItem(item?._id)}
                                        >
                                            <IoIosClose size={20} />
                                        </span>
                                    </div>
                                    <div className="info mt-2">
                                        <h4 className="mb-1">{item.name || item.productTitle}</h4>
                                        <Rating
                                            className="mt-2 mb-2"
                                            name="read-only"
                                            value={item.rating}
                                            readOnly
                                            size="small"
                                            precision={0.5}
                                        />
                                        <div className="d-flex align-items-center">
                                            <span className="newPrice text-danger ms-2">{item.price}฿</span>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="empty d-flex flex-column align-items-center justify-content-center text-center py-5">
                        <FaListCheck size={120} className="mb-3 text-muted" />
                        <h3 className="mb-3">Your list is currently empty</h3>
                        <Link to="/">
                            <Button className="btn-blue bg-red btn-lg btn-big btn-round">
                                <FaHome /> &nbsp; Continue Shopping
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default MyList;