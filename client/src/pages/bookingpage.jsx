import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import AddressLink from "../addresslink";
import PlaceGallery from "../placegallery";
import BookingDates from "../bookingdates";

export default function BookingPage() {
    const {booking_id} = useParams();
    const[booking,setBooking] = useState(null);
    useEffect(()=>{
        console.log("Booking ID from URL:", booking_id); 
        if(booking_id){
            axios.get(`/bookings/${booking_id}`).then((response) => {
                const foundBooking = response.data;
                if (foundBooking) {
                  setBooking(foundBooking);
                }
            });
        }
    },[booking_id]);

    if (!booking) {
        return <div>Loading...</div>; // Display a loading message while waiting for the data
      }
    return (
        <div className="my-6">
            <h1 className="text-xl">{booking.title}</h1>
            <AddressLink className=" flex my-2 block">{booking.address}</AddressLink>
            <div className="bg-gray-200 p-4 mb-4 rounded-2xl">
                <h2 className="text-xl mb-2">Your Booking Information:</h2>
               <BookingDates booking={booking}/>
            </div>
            <PlaceGallery place={{ photos: booking.photos }}/>
        </div>
    )
}