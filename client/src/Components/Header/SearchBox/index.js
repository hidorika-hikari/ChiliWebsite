import Button from '@mui/material/Button'
import { IoIosSearch } from 'react-icons/io';

const SearchBox =() => {
    return(
        <div className='headerSearch ms-3 me-3'>
            <input type='text' placeholder='Search for products...'/>
            <Button><IoIosSearch/></Button>
        </div>
    )
}

export default SearchBox;