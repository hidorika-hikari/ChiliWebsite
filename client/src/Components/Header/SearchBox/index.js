import { useContext, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { fetchDataFromApi } from '../../../utils/api';
import { MyContext } from '../../../App';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const SearchBox = () => {
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [searchBox, setSearchBox] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onChangeValue = (e) => {
        setSearchBox(e.target.value);
    };

    const searchProduct = () => {
        if (!searchBox.trim()) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Please enter a search term!",
            });
            return;
        }

        setIsLoading(true);
        fetchDataFromApi(`/api/search?q=${searchBox.trim()}`)
            .then((res) => {
                context.setSearchData(res);
                setIsLoading(false);
                navigate("/search");
            })
            .catch(() => {
                setIsLoading(false);
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: "Cannot search products, please try again later",
                });
            });
    };

    return (
        <div
            className="position-relative w-100"
            style={{ maxWidth: 800, margin: "0 auto" }}
        >
            <input
                type="text"
                placeholder="Search for products..."
                onChange={onChangeValue}
                onKeyDown={(e) => e.key === "Enter" && searchProduct()}
                disabled={isLoading}
                className="form-control rounded-pill ps-5"
                style={{ height: 50, fontSize: 16 }}
            />
            <span
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                style={{ cursor: "pointer" }}
                onClick={searchProduct}
            >
                {isLoading ? <CircularProgress size={20} /> : <IoIosSearch size={20} />}
            </span>
        </div>
    );
};

export default SearchBox;