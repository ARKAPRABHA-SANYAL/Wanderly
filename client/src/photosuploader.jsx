import { useState } from "react";
import axios from "axios";

export default function PhotosUploader({addedphotos,onChange}){
  
  const [photolink,setPhotoLink] =useState('');
  async function addPhotoByLink(ev){
    ev.preventDefault();
    const {data:filename} = await axios.post('/upload-by-link',{link: photolink})
    onChange(prev=>{
        return[...prev,filename];
    });
    setPhotoLink('');
}
function uploadPhoto(ev){
    const files = ev.target.files;
    const data = new FormData();
    for(let i=0;i<files.length;i++){
        data.append('photos',files[i]);
    }
    
    axios.post('/upload',data,{
        headers: {'Content-Type' : 'multipart/form-data'}
    }).then(response=>{
        const {data:filenames} = response;
        onChange(prev=>{
            return[...prev,...filenames];
        });
        
    })
}

function removePhoto(ev,filename){
    ev.preventDefault();
    onChange([...addedphotos.filter(photo => photo !==filename)]);
}
function selectAsMainPhoto(ev,filename){
    ev.preventDefault();
    onChange( [filename,...addedphotos.filter(photo => photo !==filename)]);
}

  return (
    <>
    <div className="flex gap-3">
                            <input type="text" value={photolink} onChange={ev=>setPhotoLink(ev.target.value)} placeholder="add using link .... jpg" />
                           <button onClick={addPhotoByLink} className="rounded-2xl w-auto px-3 ">Add&nbsp;Photo</button> 
                        </div>
                        
                        <div className="mt-4 grid grid-cols-3 lg:grid-cols-6 md:grid-cols-4 gap-2">
                            {addedphotos.length>0 && addedphotos.map(link =>(
                                <div className="h-32 flex relative" key={link} >
                                    <img className="rounded-2xl w-full object-cover" src={'http://localhost:4000/uploads/'+link} />
                                <button onClick={ev => removePhoto(ev,link)} className="cursor-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-60 p-1 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
  <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
</svg>

                                </button>
                                <button onClick={ev=>selectAsMainPhoto(ev,link)} className="cursor-pointer absolute bottom-1 left-1 text-white bg-black bg-opacity-60 p-1 rounded-full">
                                {link===addedphotos[0]&&(
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
  <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clip-rule="evenodd" />
</svg>
                                )}
                                {link!==addedphotos[0]&&(
                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                   <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                 </svg>
                                  
                                )}
                                </button>
                                </div>
                            ))}
                            <label className="border h-32 flex item-center bg-red-500 rounded-2xl p-8 text-black font-semibold text-2xl">
                                <input type="file" multiple className="hidden" onChange={uploadPhoto}/>
                                Upload
                                </label>
                        </div>
    </>
  )
}

