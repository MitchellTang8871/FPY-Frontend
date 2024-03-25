import { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import qs from 'qs';

const AdminPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const checkAdminStatus = async () => {
        try {
            setLoading(true);

            const payload = { token: reactLocalStorage.get("token") };
            const response = await axios.post("isadmin", qs.stringify(payload), { timeout: 30000 });

            if (response.data.isAdmin) {
                // Continue rendering if user has admin privileges
                setLoading(false);
                return
            }
        } catch (error) {
            setError(error.response.data.message);
            if (error.response.status === 460) {
                // Token is invalid
                reactLocalStorage.clear();
            }
            setLoading(false);
            window.location.href = "/";
        }
    };

    useEffect(() => {
        if (!reactLocalStorage.get("token")) {
            window.location.href = "/";
        }

        axios.defaults.headers.common.Authorization = `Token ${reactLocalStorage.get("token")}`;

        checkAdminStatus();
    }, []);


    return (
        <div className="Admin">
            {loading && (
                <div className="overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <Navbar />
            <div className='content-container'>
                <h1>Admin Page</h1>
                {error ? (
                    <p>{error}</p>
                ) : (
                    <p>
                        Welcome to the Admin Page. Here you can manage courses, students, and faculty with ease. Stay
                        tuned for more features!
                    </p>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
