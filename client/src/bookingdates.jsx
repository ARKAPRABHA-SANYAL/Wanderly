import { differenceInCalendarDays, format } from "date-fns";
export default function BookingDates({booking}){
    return(
            <div>
                <div className="flex gap-2 border-t border-gray-400 mt-1 py-2">
                                {format(new Date(booking.checkIn), 'dd-MM-yyyy')} 
                                {" "} &rarr;{" "}
                                {format(new Date(booking.checkOut),'dd-MM-yyyy')}
                </div>
                <div className="text-lg">
                    {differenceInCalendarDays(new Date(booking.checkOut),new Date(booking.checkIn))} Nights 
                    | total price:  ₹ {booking.price}
                </div>
            </div>
    )
}