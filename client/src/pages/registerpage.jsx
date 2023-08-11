import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


export default function RegisterPage(){
        const[name,setName]=useState('');
        const[email,setEmail]=useState('');
        const[password,setPassword]=useState('');

        async function registerUser(ev) {
            ev.preventDefault();
            try{
              await axios.post('/register',{
                name,
                email,
                password
            });
              alert('Registration successful. Now you can log in');
            }catch (e) {
              alert('Registration failed. Please try again later');
            }
          }
        return (
            <div className="mt-4 grow flex items-center justify-around">
                <div className="mb-60">
                <h1 className="text-4xl text-center mb-4 font-semibold">Register</h1>
                <form className="max-w-md mx-auto " onSubmit={registerUser}>
                    <input type="text" 
                           placeholder="your name "
                           value={name}
                           onChange={ev=>setName(ev.target.value)}/>
                    <input type="email"
                           placeholder="your@email.com"
                           value={email}
                           onChange={ev=>setEmail(ev.target.value)}/>
                    <input type="password" 
                           placeholder="password"
                           value={password}
                           onChange={ev=>setPassword(ev.target.value)}/>
                    <button className="login rounded-xl">Register</button>
                    <div className="text-center py-3 text-gray-500"> Already a member?
                        <Link className="underline text-black ml-3" to={'/login'}>Login </Link>
                    </div>
                </form>
                </div>
            </div>
        )
}