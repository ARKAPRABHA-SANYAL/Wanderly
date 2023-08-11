import { useEffect, useState } from "react";
import AccountNav from "../accountnav";
import axios from "axios";
import PlaceImg from "../placeimg";

import { Link } from "react-router-dom";
import BookingDates from "../bookingdates";

export default function BookingsPage(){
    const [bookings,setBookings] =useState([])
    useEffect(()=>{
        axios.get('/bookings').then(response=>{
            setBookings(response.data);
        });
    },[]);
    
    return(
        <div>
            <AccountNav/>
            <div>
                {bookings?.length >0 && bookings.map(booking => (
                    
                    <Link to={`/account/bookings/${booking.booking_id}`} className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden  mb-4">
                        <div className="w-48">
                            <PlaceImg place={{ photos: booking.photos }}/>
                        </div>
                        <div className=" py-3 grow pr-3">
                            <h2 className="text-xl">{booking.title}</h2>
                            <BookingDates booking={booking}/>
                            
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}