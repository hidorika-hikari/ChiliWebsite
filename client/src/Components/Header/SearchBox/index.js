import { useContext, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { fetchDataFromApi } from '../../../utils/api';
import { MyContext } from '../../../App';
import { useNavigate } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material';

const SearchBox = () => {
    const context = useContext(MyContext);
    const history = useNavigate();
    const [searchBox, setSearchBox] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onChangeValue = (e) => {
        setSearchBox(e.target.value);
    };

    const searchProduct = () => {
        if (!searchBox.trim()) return;
        setIsLoading(true);
        fetchDataFromApi(`/api/search?q=${searchBox.trim()}`).then((res) => {
            context.setSearchData(res);
            setIsLoading(false);
            history('/search');
        }).catch(() => {
            setIsLoading(false);
        });
    };

    return (
        <div className='headerSearch ms-3 me-3'>
            <input
                type='text'
                placeholder='Search for products...'
                onChange={onChangeValue}
                onKeyDown={(e) => e.key === 'Enter' && searchProduct()}
                disabled={isLoading}
            />
            <Button onClick={searchProduct} disabled={isLoading}>
                {isLoading ? <CircularProgress /> : <IoIosSearch />}
            </Button>
        </div>
    );
};

export default SearchBox;