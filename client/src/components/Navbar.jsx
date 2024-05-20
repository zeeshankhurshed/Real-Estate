import React, { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const { currentUser } = useSelector(state => state.user);
  const [searchTerm,setSetTerm]=useState('');
  const navigate=useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(()=>{
    const urlParams=new URLSearchParams(window.location.search);
    const searchTermFromUrl=urlParams.entries('searchTerm');
    if(searchTermFromUrl){
      setSetTerm(searchTermFromUrl);
    }
  },[location.search]);
  return (
    <div className='bg-slate-200 shadow-md'>
      <div className='w-4/5 m-auto py-5 flex flex-wrap justify-between items-center'>
        <Link to='/'  className='text-slate-500 text-2xl font-bold'>Real<span className='text-slate-700'>Estate</span></Link>
        <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex justify-between items-center'>
          <input type="text" placeholder='Search...' className='focus:outline-none bg-transparent w-24 sm:w-64' onChange={(e)=> setSetTerm(e.target.value)} />
          <button>
          <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className='flex gap-4 font-bold'>
          <li className='hidden sm:inline text-slate-700 hover:underline'>
            <Link to='/'>Home</Link>
          </li>
          <li className='hidden sm:inline text-slate-700 hover:underline'>
            <Link to='/about'>About</Link>
          </li>
          {
            currentUser ? (
              <Link to='/profile'>
                <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt="profile" />
              </Link>
            ) : (
              <Link to='/signin'>
                <li className='text-slate-700 hover:underline'>Signin</li>
              </Link>
            )
          }
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
