import * as React from 'react';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
 import * as locales from 'date-fns/locale';
import fr from 'date-fns/locale/fr';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'react-date-range';
import {useEffect, useState} from "react";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';

//  Date Picker
registerLocale('fr', fr);
setDefaultLocale('fr');

interface  prop {
    setSelectDate: (formattedDate: string) => void;
}

export default function DateRangeCalendarComponent(props : prop) {
const {setSelectDate} = props
    const currentDate = new Date();
    const [date, setDate] = useState<Date >(currentDate);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const year = date?.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 to the month because it's zero-based
    const day = String(date?.getDate()).padStart(2, '0');

    // Format the date as YYYY-MM-DD
    const formattedDate = `${year}-${month}-${day}`;
    useEffect(() => {
        // Update state or perform side effects based on props here
        // This code will run after the component has rendered
        setSelectDate(formattedDate)

    }, [date]); // Include relevant dependencies here

     const primaryColor = '#495DE5';
    return (
        <div className="align-items-center justify-content-center shadow-sm " style={{borderRadius:'15px'}}>
        <div className="relative  ">
            <div className="w-16 overflow-hidden flex justify-center items-center  absolute left-1/2 -top-5 -translate-x-1/2 ">
                <div className=" h-5 w-5 bg-white rotate-45 origin-bottom-left rounded-sm border-2"></div>
            </div>
        <Calendar
            className={'p-3 w-100'}
              locale={locales.fr}
            date={date}
            onChange={(newDate: Date) => {
                setDate(newDate);
                setIsPopoverOpen(false);
            }}
            color={primaryColor}
            maxDate={new Date()}

        />
        </div>
        </div>
            );
}
