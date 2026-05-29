import { GiSkirt } from "react-icons/gi";
import { TbTruckDelivery } from "react-icons/tb";
import { BiSolidDiscount } from "react-icons/bi";
import { CiBadgeDollar } from "react-icons/ci";
import { FaFacebookF, FaGithub , FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoLocationOutline, IoTimeOutline, IoCallOutline, IoMailOutline } from "react-icons/io5";
import { fetchDataFromApi } from "../../utils/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const services = [
    {
        icon: <GiSkirt size={36}/>,
        title: "Everyday fresh products",
        description: "Quality you can trust every day.",
    },
    {
        icon: <TbTruckDelivery size={36}/>,
        title: "Free delivery",
        description: "On orders over $70, fast & reliable.",
    },
    {
        icon: <BiSolidDiscount size={36}/>,
        title: "Daily Mega Discount",
        description: "Unbeatable prices on your favorites.",
    },
    {
        icon: <CiBadgeDollar size={36}/>,
        title: "Best market price",
        description: "Value without compromise.",
    },
];

const Footer = () => {

    const navigate = useNavigate();
    const [categoryData, setCategoryData] = useState([]);

    useEffect(() => {
        fetchDataFromApi("/api/category").then((res) => {
            setCategoryData(res.categoryList[0]);
        })
    }, []);

    const handleClickProduct = () => {
        navigate(`/products/category/${categoryData._id}`);
        window.location.reload();
    };

    const handleClick = () => {
        navigate('/contact-us');
        window.location.reload();
    };

    return (
        <footer>
            <div className="bg-light mt-3 py-3">
                <div className="container">
                    <div className="row g-4 justify-content-center">
                        {services.map(({ icon, title, description }, idx) => (
                            <div key={idx} className="col-12 col-md-6 col-lg-3">
                                <div className="cardService h-100 shadow-sm border-0 text-center p-4">
                                    <div className="mb-3">{icon}</div>
                                    <h5 className="card-title">{title}</h5>
                                    <p className="card-text text-muted">{description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="footerSection text-white">
                <div className="container">
                    <div className="row mt-3 pt-4 align-items-start">
                        <div className="col-lg-3 col-md-6 mb-4 mb-lg-0 d-flex justify-content-center align-items-center">
                            <iframe
                                title="company location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.693880012338!2d100.51696831529284!3d13.73671739035362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ed63e0a6e27%3A0xfdb8f432eaf3c6c6!2sBangkok%2C%20Thailand!5e0!3m2!1sen!2sus!4v1691698526225!5m2!1sen!2sus"
                                width="100%"
                                height="320px"
                                style={{ border: 0, borderRadius: '12px', boxShadow: '0 8px 16px rgba(0,0,0,0.25)' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>

                        <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
                            <div className="infoCard h-100">
                                <h5 className="hd mb-3">Location & Hours</h5>
                                <div className="d-flex align-items-start mb-3">
                                    <IoLocationOutline size={24} className="me-3 flex-shrink-0 mt-1" />
                                    <div>
                                        <strong>Our Office</strong>
                                        <p className="mb-0 text-white">
                                            123 Business Avenue
                                            <br />
                                            Suite 100, Metro City, 54321
                                        </p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-start">
                                    <IoTimeOutline size={24} className="me-3 flex-shrink-0 mt-1" />
                                    <div>
                                        <strong>Business Hours</strong>
                                        <p className="mb-0 text-white">
                                            Open Daily: 10:00 AM - 10:00 PM
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
                            <div className="infoCard h-100">
                                <h5 className="hd mb-3">Contact Information</h5>
                                <ul className="list-unstyled">
                                    <li className="d-flex align-items-center mb-3">
                                        <IoCallOutline size={20} className="me-3" />
                                        <a className="text-decoration-none text-white">
                                            0801459970
                                        </a>
                                    </li>
                                    <li className="d-flex align-items-center mb-3">
                                        <IoMailOutline size={20} className="me-3" />
                                        <a href="mailto:meen_otwo@hotmail.com" className="text-decoration-none text-white">
                                            meen_otwo@hotmail.com
                                        </a>
                                    </li>
                                    <li>
                                        For support, please visit our <Link to="/help" className="text-white">Help Center</Link>.
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
                            <div className="infoCard h-100">
                                <h5 className="hd mb-3">Information</h5>
                                <nav className="d-flex flex-column gap-2">
                                    <Link to="/" >Home</Link>
                                    <Link to="#" >About Us</Link>
                                    <Link onClick={handleClickProduct}>Our Products</Link>
                                    <Link onClick={handleClick}>Contact Us</Link>
                                </nav>
                            </div>
                        </div>
                    </div>

                    <div className="copyright mt-3 pt-3 pb-3 d-flex flex-column flex-md-row align-items-center border-top text-center text-md-start">
                        <p className="mb-2 mb-md-0 text-white">
                            © 2025 Promvet Khiawsa. All rights reserved.
                        </p>

                        <ul className="list list-inline ms-md-auto mb-0 d-flex justify-content-center">
                            <li className="list-inline-item">
                                <Link
                                    to="https://www.facebook.com/taohu.thawrence"
                                    className="social-icon"
                                >
                                    <FaFacebookF />
                                </Link>
                            </li>

                            <li className="list-inline-item">
                                <Link
                                    to="https://github.com/hidorika-hikari"
                                    className="social-icon"
                                >
                                    <FaGithub />
                                </Link>
                            </li>

                            <li className="list-inline-item">
                                <Link
                                    to="https://www.linkedin.com/in/ayazaka-shine/"
                                    className="social-icon"
                                >
                                    <FaLinkedinIn />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;