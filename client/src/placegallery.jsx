import { useEffect, useState } from "react";
export default function PlaceGallery({place}){
    
    const [showallphotos ,setShowAllPhotos] = useState(false);
    if(showallphotos){
        return(
            <div className="absolute inset-0 bg-black text-white min-h-screen">
                <div className="bg-black p-8 grid gap-4">
                    <div>
                        <h2 className="text-2xl mr-36">Photos of {place.title}</h2>
                        <button onClick={()=>setShowAllPhotos(false)} className="fixed right-12 top-6 shadow shadow-black py-2 px-4 rounded-2xl flex">
                            close Photos
                        </button>
                    </div>
                    {place?.photos?.length>0 && JSON.parse(place.photos).map(photo => (
                        <div>
                            <img src={'http://localhost:4000/uploads/'+photo} />
                        </div>
                    ))}
                </div>
            </div>
        )
    }
    return(
        <div className="relative">
                <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
                    <div>
                        {place.photos?.[0] && (
                            <div>
                                <img  onClick={()=>setShowAllPhotos(true)} className="aspect-square cursor-pointer object-cover " src={'http://localhost:4000/uploads/'+JSON.parse(place.photos)?.[0]}/>
                            </div>
                        
                        )}
                    </div>
                    <div className="grid ">
                        {JSON.parse(place.photos)?.[1] && (
                            <img onClick={()=>setShowAllPhotos(true)} className="aspect-square cursor-pointer object-cover" src={'http://localhost:4000/uploads/'+JSON.parse(place.photos)?.[1]}/>
                        )}
                        <div className=" overflow-hidden">
                            {JSON.parse(place.photos)?.[2] && (
                                <img onClick={()=>setShowAllPhotos(true)} className="aspect-square cursor-pointer object-cover relative top-2" src={'http://localhost:4000/uploads/'+JSON.parse(place.photos)?.[2]}/>
                            )}
                        </div>
                    
                    </div>
                </div>
                <button onClick={()=> setShowAllPhotos(true)}className="absolute bottom-2 right-2 py-2 px-4 rounded-2xl border border-black shadow shadow-black ">
                    Show More Photos
                </button>
            </div>
    )
}