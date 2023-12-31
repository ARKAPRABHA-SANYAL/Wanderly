import React, { useContext } from 'react';
import logo from './images/logo.png';
import { Link } from 'react-router-dom';
import { UserContext } from './usercontext';

export default function Header() {
  const { user } = useContext(UserContext);

  return (
    <header className="p-3 flex justify-between">
      <Link to={'/'}>
        <a className="flex items-center gap-2">
          <img src={logo} className="w-16 h-16 borderRadius-16" alt="Logo" />
          <span style={{ color: 'blue' }} className="font-bold text-2xl ">
            Wanderly
          </span>
        </a>
      </Link>
      <Link
        to={user ? '/account' : '/login'}
        className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-blue-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
        {!!user && <div className="font-semibold">{user.name}</div>}
      </Link>
    </header>
  );
}
