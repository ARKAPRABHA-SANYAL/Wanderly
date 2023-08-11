export default function Perks({selected,onChange}){
    function handleCbClick(ev){
        const{checked,name}=ev.target;
        if(checked){
            onChange([...selected,name]);
        }else{
            onChange([...selected.filter(selectedName=>selectedName !==name)]);
        }
        
    }
    return (
        <>
        <label className="border rounded-2xl p-4  font-semibold gap-2 items-center cursor-pointer">
                            <input type="checkbox" checked={selected.includes('wifi')} name="wifi" onChange={handleCbClick} />
                            <span>Free Wifi</span>
                        </label>
                        <label className="border rounded-2xl p-4  font-semibold gap-2 items-center cursor-pointer">
                            <input type="checkbox" checked={selected.includes('parking')} name="parking" onChange={handleCbClick} />
                            <span>Free Parking</span>
                        </label>
                        <label className="border rounded-2xl p-4  font-semibold gap-2 items-center cursor-pointer">
                            <input type="checkbox" checked={selected.includes('gym')} name="gym" onChange={handleCbClick} />
                            <span>Gym</span>
                        </label>
                        <label className="border rounded-2xl p-4  font-semibold gap-2 items-center cursor-pointer">
                            <input type="checkbox" checked={selected.includes('spa')} name="spa" onChange={handleCbClick} />
                            <span>Spa</span>
                        </label>
                        <label className="border rounded-2xl p-4  font-semibold gap-2 items-center cursor-pointer">
                            <input type="checkbox" checked={selected.includes('pool')} name="pool" onChange={handleCbClick} />
                            <span>Swimming Pool</span>
                        </label>
                        <label className="border rounded-2xl p-4  font-semibold gap-2 items-center cursor-pointer">
                            <input type="checkbox"checked={selected.includes('pet')} name="pet" onChange={handleCbClick} />
                            <span>Pet friendly</span>
                        </label>
                        <label className="border rounded-2xl p-4  font-semibold gap-2 items-center cursor-pointer">
                            <input type="checkbox" checked={selected.includes('pwd')} name="pwd" onChange={handleCbClick} />
                            <span>Facilities for person with disabilities</span>
                        </label>
                        <label className="border rounded-2xl p-4  font-semibold gap-2 items-center cursor-pointer">
                            <input type="checkbox" checked={selected.includes('movie')} name="movie" onChange={handleCbClick} />
                            <span>Movie theatre</span>
                        </label>
                        <label className="border rounded-2xl p-4  font-semibold gap-2 items-center cursor-pointer">
                            <input type="checkbox" checked={selected.includes('cafe')} name="cafe" onChange={handleCbClick} />
                            <span>Cafe</span>
                        </label>
                        <label className="border rounded-2xl p-4  font-semibold gap-2 items-center cursor-pointer">
                            <input type="checkbox" checked={selected.includes('room')} name="room" onChange={handleCbClick} />
                            <span>Room Service</span>
                        </label>
                        </>
    )
}