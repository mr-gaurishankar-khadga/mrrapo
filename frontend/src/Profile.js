import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { email } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user profile data from backend using the email parameter
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://rappo.onrender.com/userProfile?email=${email}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [email]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome to your profile, {userData.firstName}</h1>
      {/* Display user profile information here */}
      <p>Email: {userData.email}</p>
      <p>Name: {userData.firstName} {userData.lastName}</p>
      <p>Phone: {userData.phoneNumber}</p>
      <p>Address: {userData.addressLine1}, {userData.city}, {userData.state}</p>
      {/* Add more fields as needed */}
    </div>
  );
};

export default Profile;
