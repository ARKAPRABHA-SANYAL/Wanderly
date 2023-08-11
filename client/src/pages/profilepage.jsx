import { useContext, useState } from "react"
import { UserContext } from "../usercontext"
import { useParams } from "react-router-dom"
import { Navigate,Link } from "react-router-dom"
import axios from "axios";
import PlacesPage from "./placespage";
import AccountNav from "../accountnav";

export default function ProfilePage(){
    const {ready,user,setUser} = useContext(UserContext)
    const[redirect,setRedirect] = useState(false)

    let {subpage} = useParams();
    if(subpage===undefined){
        subpage = 'profile';
    }
    
    async function logout()
    {
        await axios.post('/logout');
        setUser(null);
        setRedirect('/');
    }
    if (!ready){
        return 'Loading...'
    }
    if (ready&&!user &&!redirect) {
        return <Navigate to={'/login'}/>
    }
    

    
    
    if (redirect){
        return <Navigate to={redirect} />
    }
    return (
        <div>
            <AccountNav/>
            {subpage === 'profile' && (
                <div className="text-center  mt-4 font-semibold  mx-auto max-w-lg">
                    Logged in as {user.name} ({user.email})<br/>
                    <button onClick = {logout} className="button.login mt-4 w-full rounded-2xl p-2">Logout</button>
                </div>
            )}
            {subpage==='places' && (
                <PlacesPage />
            )}
        </div>
    )
}