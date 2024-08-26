



















import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('No token found. Please login again.');
                navigate('/signup'); // Redirect to signup if token is not found
                return;
            }

            try {
                const response = await axios.get('https://rappo.onrender.com/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserData(response.data.user);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                alert('Failed to fetch user data. Please login again.');
                navigate('/signup');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="profile-container">
            <h1>User Profile</h1>
            {userData ? (
                <div className="profile-info">
                    <p><strong>First Name:</strong> {userData.firstName}</p>
                    <p><strong>Last Name:</strong> {userData.lastName}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Phone Number:</strong> {userData.phoneNumber}</p>
                    <p><strong>Address:</strong> {userData.addressLine}, {userData.city}, {userData.state}</p>
                </div>
            ) : (
                <p>No user data found.</p>
            )}
        </div>
    );
};

export default Profile;
