import { Link } from "react-router-dom";

import AccountNav from "../accountnav";
import { useEffect,useState } from "react";
import axios from "axios";
import PlaceImg from "../placeimg";

export default function PlacesPage() {
    const [places,setPlaces] = useState([]);
   useEffect(()=>{
    axios.get('/user-places').then(({data}) => {
        setPlaces(data);
    });
   },[]);
    
   
    
    return(
        <div>
            <AccountNav/>
            
            <div className="text-center ">
               
                <Link className=" inline-flex bg-red-500 text-white px-4 py-3 rounded-full " to={'/account/places/new'}>Add New Place</Link>
            </div>
            <div className="mt-4 ">
                {places.length >0 && places.map(place => (
                    <Link to={'/account/places/'+place.place_id} className="flex mt-4 cursor-pointer gap-4 bg-gray-200 p-4 rounded-2xl " >
                        <div className=" flex w-32 h-32 bg-gray-300 grow shrink-0">
                        <PlaceImg place={place}/>
                        </div>
                        <div className="grow-0 shrink">
                        <h2 className="text-xl">{place.title}</h2>
                        <p className="text-sm mt-2">{place.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
            
        </div>
    );
}