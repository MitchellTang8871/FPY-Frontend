import { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import qs from 'qs';
import { Button, Modal, Input } from 'reactstrap';

const AdminPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState("")

    const checkAdminStatus = async () => {
        try {
            setLoading(true);

            const payload = { token: reactLocalStorage.get("token") };
            const response = await axios.post("isadmin", qs.stringify(payload), { timeout: 30000 });

            if (response.data.isAdmin) {
                // Continue rendering if user has admin privileges
                setLoading(false);
                return
            } else {
                window.location.href = "/";
            }
        } catch (error) {
            setError(error.response.data.message);
            if (error.response.status === 460) {
                // Token is invalid
                reactLocalStorage.clear();
                window.location.href = "/";
            } else if (error.response.status === 500) {
                window.location.href = "/";
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!reactLocalStorage.get("token")) {
            window.location.href = "/";
        }

        axios.defaults.headers.common.Authorization = `Token ${reactLocalStorage.get("token")}`;
        checkAdminStatus();
    }, []);

    const delUser = async (username) => {
        try {
            setLoading(true);
            const payload = { username: username };
            const response = await axios.post("deluser", qs.stringify(payload), { timeout: 30000 });
            alert(response.data.message);
            setLoading(false);
        } catch (error) {
            if (error.response.data.message) {
                alert(error.response.data.message);
            }
            if (error.response.status === 460) {
                // Token is invalid
                reactLocalStorage.clear();
                window.location.href = "/";
            }
            setLoading(false);
        }
    }


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

                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginTop:50 }}>
                    <div style={{whiteSpace: "nowrap"}}>Delete User:</div>
                    <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => {if (e.key === "Enter") {delUser(username)}}}
                        disabled={loading}
                    />
                    <Button style={{backgroundColor: "red", color: "white"}} onClick={() => delUser(username)}>
                        Delete
                    </Button>
                </div>
                <div style={{color: "red", textAlign: "left"}}>*Enter the username of the user you want to delete</div>
            </div>
        </div>
    );
};

export default AdminPage;
