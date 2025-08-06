import Button from '@mui/material/Button'
import { useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { fetchDataFromApi } from '../../../utils/api';

const SearchBox =() => {

    const [searchBox,setSearchBox] = useState("");
    const onChangeValue = (e) => {
        setSearchBox(e.target.value);
    }
    const searchProduct = () => {
        fetchDataFromApi(`/api/search?q=${searchBox}`).then((res) => {
            console.log(res)
        })
    }
    return(
        <div className='headerSearch ms-3 me-3'>
            <input type='text' placeholder='Search for products...' onChange={onChangeValue}/>
            <Button onClick={searchProduct}><IoIosSearch/></Button>
        </div>
    )
}

export default SearchBox;