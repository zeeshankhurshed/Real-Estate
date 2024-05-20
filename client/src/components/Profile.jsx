import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserstart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signInFailure, signOutStart, signOutFailure, signOutSuccess } from '../redux/user/userSlice';
import { Link } from 'react-router-dom'

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  // console.log(filePerc);
  // console.log(fileUploadError);
  // console.log(fileUploadError);
  const [formData, setFormData] = useState({});
  // console.log(formData);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showListings, setShowListings] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.log('File available at', downloadURL);
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handlechange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserstart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { // Change 'header' to 'headers'
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    dispatch(signOutStart())
    try {
      setShowListingsError(false);
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
    } catch (error) {
      dispatch(signInFailure(data.message));
    }
  }
  const handleShowListings=async()=>{
    try {
      const res=await fetch(`/api/user/listings/${currentUser._id}`);
      console.log(res);
      const data=await res.json();
      if(data.success===false){
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
      setShowListings(true); // Add this line
    } catch (error) {
      setShowListingsError(true);
    }
  }
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h2 className='text-3xl font-semibold text-center my-7 '>Profile</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept='image/*'
        />
        {currentUser && (
          <>
            <img
              onClick={() => fileRef.current.click()}
              src={formData.avatar || currentUser.avatar}
              alt="profile"
              className='self-center mt-2 rounded-full h-24 w-24 object-cover cursor-pointer'
            />
            <p className='text-sm self-center'>
              {fileUploadError ? (
                <span className='text-red-700'>Error Image upload</span>
              ) : (
                filePerc > 0 && filePerc < 100 ? (
                  <span className='text-slate-700'>
                    {`uploading ${filePerc}%`}
                  </span>
                ) : filePerc === 100 ? (
                  <span className='text-green-700'>
                    Image successfully uploaded!
                  </span>
                ) : (
                  ''
                )
              )}
            </p>
            <input
              type="text"
              placeholder='username'
              defaultValue={currentUser.username}
              id='username'
              // value={formData.username }
              className='border p-3 rounded-lg'
              onChange={handlechange}
            />
            <input
              type="email"
              placeholder='email'
              id='email'
              // value={formData.email}
              className='border p-3 rounded-lg'
              defaultValue={currentUser.email}
              onChange={handlechange}
            />
            <input
              type="password"
              placeholder='password'
              id='password'
              className='border p-3 rounded-lg'
              onChange={handlechange}
            />
            <button disabled={loading}
              className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
            >
              {loading ? 'Loading...' : 'Update'}
            </button>
          </>
        )}
        <Link to='/createListing' className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 font-bold'>Create listing</Link>
      </form>
      <div className='mt-5 flex justify-between'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer '>
          Delete Account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer '>
          Sign Out
        </span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ""}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? "User is updated successfully!" : ""}</p>

      <button className='text-green-700 w-full font-bold' onClick={handleShowListings}>Show Listing</button>
      <p className='text-red-700 mt-5 '>{showListingsError ? 'Error showing listings' : ''}</p>

      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col items-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                   >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default Profile;