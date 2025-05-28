import { GiSkirt } from "react-icons/gi";
import { TbTruckDelivery } from "react-icons/tb";
import { BiSolidDiscount } from "react-icons/bi";
import { CiBadgeDollar } from "react-icons/ci";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="topInfo row">
                    <div className="col d-flex align-items-center">
                        <span><GiSkirt/></span>
                        <span>Everyday fresh products</span>
                    </div>
                    <div className="col d-flex align-items-center">
                        <span><TbTruckDelivery/></span>
                        <span>Free delivery for order over $70</span>
                    </div>
                    <div className="col d-flex align-items-center">
                        <span><BiSolidDiscount/></span>
                        <span>Daily Mega Discount</span>
                    </div>
                    <div className="col d-flex align-items-center">
                        <span><CiBadgeDollar/></span>
                        <span>Best price on the market</span>
                    </div>
                </div>

                <div className="row mt-5 linkWrap">
                    <div className="col">
                    <h5>FRUIT & VEGETABLES</h5>
                    <ul style={{ paddingLeft: 0 }}>
                        <li><Link to="#">Fresh Vegetable</Link></li>
                        <li><Link to="#">Herbs & Seasonings</Link></li>
                        <li><Link to="#">Cuts & Sprouts</Link></li>
                        <li><Link to="#">Exotic Fruit & Veggies</Link></li>
                        <li><Link to="#">Packaged Produce</Link></li>
                        <li><Link to="#">Party Trays</Link></li>
                    </ul>
                    </div>

                    <div className="col">
                    <h5>BREAKFAST & DAIRY</h5>
                    <ul style={{ paddingLeft: 0 }}>
                        <li><Link to="#">Fresh Vegetable</Link></li>
                        <li><Link to="#">Herbs & Seasonings</Link></li>
                        <li><Link to="#">Cuts & Sprouts</Link></li>
                        <li><Link to="#">Exotic Fruit & Veggies</Link></li>
                        <li><Link to="#">Packaged Produce</Link></li>
                        <li><Link to="#">Party Trays</Link></li>
                    </ul>
                    </div>

                    <div className="col">
                    <h5>MEAT & SEAFOOD</h5>
                    <ul style={{ paddingLeft: 0 }}>
                        <li><Link to="#">Fresh Vegetable</Link></li>
                        <li><Link to="#">Herbs & Seasonings</Link></li>
                        <li><Link to="#">Cuts & Sprouts</Link></li>
                        <li><Link to="#">Exotic Fruit & Veggies</Link></li>
                        <li><Link to="#">Packaged Produce</Link></li>
                        <li><Link to="#">Party Trays</Link></li>
                    </ul>
                    </div>

                    <div className="col">
                    <h5>BEVERAGES</h5>
                    <ul style={{ paddingLeft: 0 }}>
                        <li><Link to="#">Fresh Vegetable</Link></li>
                        <li><Link to="#">Herbs & Seasonings</Link></li>
                        <li><Link to="#">Cuts & Sprouts</Link></li>
                        <li><Link to="#">Exotic Fruit & Veggies</Link></li>
                        <li><Link to="#">Packaged Produce</Link></li>
                        <li><Link to="#">Party Trays</Link></li>
                    </ul>
                    </div>

                    <div className="col">
                    <h5>BREADS & BAKERY</h5>
                    <ul style={{ paddingLeft: 0 }}>
                        <li><Link to="#">Fresh Vegetable</Link></li>
                        <li><Link to="#">Herbs & Seasonings</Link></li>
                        <li><Link to="#">Cuts & Sprouts</Link></li>
                        <li><Link to="#">Exotic Fruit & Veggies</Link></li>
                        <li><Link to="#">Packaged Produce</Link></li>
                        <li><Link to="#">Party Trays</Link></li>
                    </ul>
                    </div>
                </div>

                <div className="copyright mt-3 pt-3 pb-3 d-flex">
                    <p className="mb-0">copyright 2025. All rights reserved</p>
                    <ul className="list list-inline ms-auto mb-0">
                        <li className="list-inline-item">
                            <Link to ="#"><FaFacebookF /></Link>
                        </li>
                        <li className="list-inline-item">
                            <Link to ="#"><FaTwitter /></Link>
                        </li>
                        <li className="list-inline-item">
                            <Link to ="#"><FaInstagram /></Link>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}

export default Footer;