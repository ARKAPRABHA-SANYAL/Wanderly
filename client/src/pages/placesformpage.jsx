import PhotosUploader from "../photosuploader";
import Perks from "../perks";
import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../accountnav";
import { Navigate, useParams } from "react-router-dom";
export default function PlacesformPage (){
    const {place_id} =useParams();
    const [title,setTitle] =useState('');
    const [address,setAddress] =useState('');
    const [addedphotos,setAddedPhotos]=useState([]);
    const [description,setDescription] =useState('');
    const [perks,setPerks] =useState([]);
    const [extraInfo,setExtraInfo] =useState('');
    const [checkin,setCheckIn] =useState('');
    const [checkout,setCheckOut] =useState('');
    const [maxguests,setMaxGuests] =useState(1);
    const [price,setPrice] =useState(1000);
    const [redirect,setRedirect]=useState(false);
    useEffect(()=>{
        if(!place_id){
            return;
        }
        axios.get('/places/'+place_id).then(response => {
            const {data} = response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(JSON.parse(data.photos));
            setDescription(data.description);
            setPerks(JSON.parse(data.perks));
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setPrice(data.price);
        });
    },[place_id]);
    async function savePlace(ev){
        ev.preventDefault();
        const PlaceData = {title,
        address,
        addedphotos,
        description,
        perks,
        extraInfo,
        checkin,
        checkout,
        maxguests,
        price}
         if(place_id){
            await axios.put('/places',{
                place_id,
                ...PlaceData                
            });
            setRedirect(true);
         }else{

         
        await axios.post('/places',PlaceData);
        setRedirect(true);
    }
    }
    if (redirect){
        return <Navigate to={'/account/places'}/>
    }

    return(
        <div>
            <AccountNav/>
                    <form onSubmit={savePlace}>
                        <h2 className="text-xl mt-4 mx-4">Title</h2>
                        <input value={title} onChange={ev=>setTitle(ev.target.value)} type = "text" placeholder="title for your place" />
                        <h2 className="text-xl mt-4 mx-4">Address</h2 >
                        <input value={address} onChange={ev=>setAddress(ev.target.value)} type = "text" placeholder="address of your place" />
                        <h2 className="text-xl mt-4 mx-4">Photos</h2 >
                        <PhotosUploader addedphotos={addedphotos} onChange={setAddedPhotos}/>
                        <h2 className="text-xl mt-4 mx-4">Description</h2 >
                        <textarea value={description} onChange={ev=>setDescription(ev.target.value)} className="border mt-2 py-2 w-full rounded-2xl px-3 text-xl" placeholder="describe your place"/>
                        <h2 className="text-xl mt-4 mx-4">Perks</h2 >
                        <div className="mt-4 gap-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        <Perks selected={perks} onChange={setPerks}/>
                        </div>
                        <h2 className="text-xl mt-4 mx-4">Extra Info</h2>
                        <textarea value={extraInfo} onChange={ev=>setExtraInfo(ev.target.value)} className="border mt-2 py-2 w-full rounded-2xl px-3 text-xl" placeholder="extra infos for your place" />
                        <h2 className="text-xl mt-4 mx-4">Check In & Out</h2>
                        <div className="grid mx-4 gap-2 sm:grid-cols-2 ">
                            <div>
                                <h3 className="mt-2 mx-4 -mb-1">Check-in Time</h3>
                                <input value={checkin} onChange={ev=>setCheckIn(ev.target.value)} type="number" placeholder="00:00"/>
                            </div>
                            <div>
                            < h3 className="mt-2 mx-4 -mb-1">Check-out Time</h3>
                                <input value={checkout} onChange={ev=>setCheckOut(ev.target.value)} type="number" placeholder="00:00"/>
                            </div>
                            
                            <h2 className="text-xl mt-4 text-center">Guests</h2>
                            <input value={maxguests} onChange={ev=>setMaxGuests(ev.target.value)} type="number" placeholder="1"/>
                            <h2 className="text-xl mt-4 text-center">Price per night</h2>
                            <input value={price} onChange={ev=>setPrice(ev.target.value)} type="number" placeholder="1000"/>
                        </div>
                        <div>
                            <button className="mt-4 mb-4 w-full rounded-2xl p-2 ">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
    )
}
