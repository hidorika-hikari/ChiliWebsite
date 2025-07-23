import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';

const QuantityBox = ({ quantity, onQuantityChange }) => {
    const [inputVal, setInputVal] = useState(quantity || 1);

    useEffect(() => {
        setInputVal(quantity)
    }, [quantity]);

    const minus = () => {
        if (inputVal > 1) {
            onQuantityChange(inputVal - 1);
        }
    };

    const plus = () => {
        onQuantityChange(inputVal + 1);
    };

    return (
        <div className='quantityDrop d-flex align-items-center'>
            <Button onClick={minus}><FaMinus /></Button>
            <input type='text' value={inputVal} readOnly />
            <Button onClick={plus}><FaPlus /></Button>
        </div>
    );
};

export default QuantityBox;