import {useState, useEffect} from 'react'
import Navbar from "../components/Navbar";
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import qs from 'qs';

const ActivityLogsPage = () => {
    const [logData, setLogData] = useState([]);
    const [loading, setLoading] = useState(false);

    const getActivityLogs = async () => {
        try{
            setLoading(true);
            const response = await axios.get("getactivitylogs", {timeout:30000});
            setLogData(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            console.log(error.response.data.message);
            if (error.response.data.message) {
                alert(error.response.data.message);
            }
            setLoading(false);
        }

    }

    useEffect(() => {
        if (!reactLocalStorage.get("token")) {
            window.location.href = "/";
        }
        axios.defaults.headers.common.Authorization = `Token ${reactLocalStorage.get("token")}`;

        getActivityLogs();
    }, []);

    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month starts from 0
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // '0' should be '12' for 12 AM/PM
        return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
    };




    return (
        <div className="ActivityLogs">
            {loading && (
                <div className="overlay">
                <div className="spinner"></div>
                </div>
            )}
            <Navbar />
            <div className='content-container'>
                <div style={{ display: 'flex', flexDirection: 'row', height:'5%', alignItems:'center', gap:20 }}>
                    <div style={{ width: '70%' }}>Action</div>
                    <div style={{ width: '30%' }}>Date & Time</div>
                </div>
                <div style={{overflowY:'auto', height:'95%'}}>
                    {logData.map((activity, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'row', paddingTop:10, alignItems:'center', gap:20 }}>
                            <div style={{ width: '70%', textAlign: 'left' }}>
                                <div style={{fontWeight:'bold'}}>{activity.action}</div>
                                <div style={{fontSize:'80%'}}>{activity.description}</div>
                            </div>
                            <div style={{ width: '30%' }}>{formatDateTime(activity.timestamp)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActivityLogsPage;