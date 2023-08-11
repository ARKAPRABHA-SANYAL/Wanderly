import { useState,useEffect } from "react";
import { Navigate } from "react-router-dom";
import {differenceInCalendarDays} from "date-fns";
import axios from "axios";

export default function BookingWidget({place}){
    const[checkIn ,setCheckIn] = useState('');
    const[checkOut, setCheckOut] = useState('');
    const [numberOfGuests,setNumberOfGuests] = useState(1);
    const [name,setName]=useState('');
    const [mobile ,setMobile] = useState('');
    const [numberOfNights, setNumberOfNights] = useState(0);
    const [redirect,setRedirect] = useState('');
   
    useEffect(() => {
        if (checkIn && checkOut) {
          const nights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
          setNumberOfNights(nights);
        }
      }, [checkIn, checkOut]);
    
      async function bookThisPlace() {
        try {
          const response = await axios.post('/bookings', {
            checkIn,
            checkOut,
            numberOfGuests,
            name,
            mobile,
            place_id: place.place_id,
            price: numberOfNights * place.price,
          });
          const bookingId = response.data.booking_id;
          
          setRedirect(`/account/bookings/${bookingId}`);
        } catch (error) {
          console.error('Error while creating booking:', error);
          // Handle any error that occurs during booking creation
        }
      }
    
        if (redirect) {
        return <Navigate to={redirect} />
    }

    
    const handleNumberOfGuestsChange = (ev) => {
        const maxGuests = parseInt(place.maxGuests, 10); // Parse maxGuests to an integer
        const inputValue = parseInt(ev.target.value, 10); // Parse input value to an integer
    
        // Cap the number of guests between 1 and maxGuests
        const cappedGuests = Math.min(Math.max(inputValue, 1), maxGuests);
        setNumberOfGuests(cappedGuests);
      };

    
    
    return(
        <div className="bg-white p-4 rounded-2xl shadow">
                        <div className="text-2xl text-center"> 
                            Price:  ₹ {place.price} / per night
                        </div>
                        <div className="border p-2 mt-4 rounded-2xl">
                            <div className="flex">
                                <div className="px-5 py-3" >
                                    <label>Check-In: </label>
                                    <input type="date" value={checkIn} onChange={ev=>setCheckIn(ev.target.value)}/>
                                 </div>
                                <div className="px-5 py-3 border-l border-black" >
                                    <label>Check-Out: </label>
                                    <input type="date" value={checkOut} onChange={ev=>setCheckOut(ev.target.value)}/>
                                </div>
                            </div>
                                <div className=" border-t border-black px-4 py-2" >
                                    <label>No. of Guests: </label>
                                    <input type="number" value={numberOfGuests} onChange={handleNumberOfGuestsChange} min={1} max={place.maxGuests}/>
                                </div>
                                {numberOfNights >0 && (
                                    <div className=" border-t border-black px-4 py-2" >
                                    <label>Name: </label>
                                    <input type="text"
                                        value={name}
                                        onChange={ev=>setName(ev.target.value)}
                                        placeholder="your full name"/>
                                    
                                    <label>Phone Number: </label>
                                    <input type="tel"
                                        value={mobile}
                                        onChange={ev=>setMobile(ev.target.value)}
                                        placeholder="your phone number"/>
                                </div>
                                )}
                        </div>
                        <button onClick={bookThisPlace} className="p-2 rounded-2xl w-full mt-4">
                            Book This Place
                            {numberOfNights>0 && ( 
                                <span>{" "} For  ₹ {numberOfNights * place.price} </span>
                            )}
                        </button>
                    </div>
    );
}