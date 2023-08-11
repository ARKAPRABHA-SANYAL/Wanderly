import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingWidget from "../bookingwidget";
import PlaceGallery from "../placegallery";
import AddressLink from "../addresslink";
export default function PlacePage(){
    const {place_id} = useParams();
    const [place,setPlace] = useState(null);
    const [showallphotos ,setShowAllPhotos] = useState(false);
    useEffect(() => {
        if (!place_id) {
            return;
        }
        axios.get('/places/'+place_id).then(response => {
            setPlace(response.data)
        });
    }, [place_id]);

    if(!place) return '';

    
    return(
        <div className="mt-4 pt-8 bg-gray-300 -mx-8 px-8">
            <h1 className="text-xl">{place.title}</h1>
            <AddressLink>{place.address}</AddressLink>
            <PlaceGallery place={place}/>
            
            <div className="grid gap-6 mb-6 grid-cols-1 md:grid-cols-[2fr_1fr] mt-4">
                
                <div>
                    <div className="my-3">
                    <h2 className="font-semibold text-2xl">Description</h2>
                    {place.description}
                    </div>
                    Check-in: {place.checkIn}:00 <br/>
                    check-out: {place.checkOut}:00 <br/>
                    Max number of guests: {place.maxGuests} <br/>
                    
                </div>
                <div>
                    <BookingWidget place={place}/>
                </div>
            </div>
            <div className="bg-white -mx-8 p-6 border-t">
                <div>
                <h2 className="font-semibold text-2xl">
                    Extra Information
                </h2>
            </div>
            <div className="text-sm text-gray-700 mt-2 leading-6 mb-4">{place.extraInfo}</div>
            </div>
            
        </div>
    )
}