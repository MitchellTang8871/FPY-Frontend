import {useState, useEffect} from 'react'
import Navbar from "../components/Navbar";
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import qs from 'qs';
import { Button, Modal, Input } from 'reactstrap';
import { IoIosSearch } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import WebcamCapture from "../components/WebcamCapture";

const EMSCardPage = () => {
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [userCredit, setUserCredit] = useState(0.00);
    const [receiver, setReceiver] = useState(null);
    const [amount, setAmount] = useState(null);
    const [description, setDescription] = useState("");
    const [payModal, setPayModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [usersList, setUsersList] = useState([]);
    const [amountError, setAmountError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [webcamCaptureModal, setWebcamCaptureModal] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);
    const [message, setMessage] = useState("");

    const getUserCredit = async () => {
        try{
            const response = await axios.get("getusercredit");
            setUserCredit(response.data.credit);
        } catch (error) {
            console.log(error);
            console.log(error.response.data.message);
            if (error.response.data.message) {
                alert(error.response.data.message);
            }
        }
    }

    const getTransactions = async () => {
        try{
            const response = await axios.get("gettransactions");
            setTransactions(response.data);
        } catch (error) {
            console.log(error);
            console.log(error.response.data.message);
            if (error.response.data.message) {
                alert(error.response.data.message);
            }
        }
    }

    useEffect(() => {
        if (!reactLocalStorage.get("token")) {
            window.location.href = "/";
        }
        axios.defaults.headers.common.Authorization = `Token ${reactLocalStorage.get("token")}`;

        getUserCredit();
        getTransactions();
    }, []);

    useEffect(() => {
        // Check if imageFile is not null and call handleSubmit
        if (imageFile) {
          handlePayment();
        }
      }, [imageFile]);

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

    const searchUsers = async () => {
        try{
            setLoading(true);
            console.log(searchTerm)
            const payload = {searchTerm: searchTerm};
            const response = await axios.post("searchusers", qs.stringify(payload));
            setUsersList(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            if (error.response.data.message) {
                alert(error.response.data.message);
            }
            setLoading(false);
        }
    }

    const handleAmountChange = (e) => {
        const { value } = e.target;
        setAmount(value);

        // Amount validation
        if (!value) {
            setAmountError('Amount is required');
        } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
            setAmountError('Amount must be a number with up to two decimal places');
        } else {
            setAmountError('');
        }
    };

    const handleDescriptionChange = (e) => {
        const { value } = e.target;
        setDescription(value);

        // Description validation
        if (!value) {
            setDescriptionError('Description is required');
        } else {
            setDescriptionError('');
        }
    };

    const handlePayment = async () => {
        try{
            if (!amount || !description) {
                alert("Please fill in all fields");
                return;
            }
            if (amountError || descriptionError) {
                alert("Please enter valid amount and description");
                return;
            }
            if (imageFile === null) {
                alert("Please scan your face");
                return;
            }

            setLoading(true);
            const formData = new FormData();
            formData.append("receiver", receiver);
            formData.append("amount", amount);
            formData.append("description", description);
            formData.append("image", imageFile);

            const response = await axios.post("pay", formData);
            alert(response.data.message);
            setPayModal(false);
            setAmount(null);
            setReceiver(null);
            setDescription("");
            setSearchTerm("");
            setWebcamCaptureModal(false);
            setImageFile(null);
            getUserCredit();
            getTransactions();
            setLoading(false);
        } catch (error) {
            console.log(error);
            if (error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                alert("Something went wrong, please try again");
            }
            if (error.response.status === 409) {
                //face does not match
                setWebcamCaptureModal(false);
                setImageFile(null);
            } else {
                setImageFile(null);
            }
            setLoading(false);
        }
    }

    return (
        <div className="EMSCard">
            {loading && (
                <div className="overlay">
                <div className="spinner"></div>
                </div>
            )}
            <Modal isOpen={payModal}
                toggle={()=>{
                    setPayModal(false);
                    setAmount(null);
                    setReceiver(null);
                    setDescription("");
                    setSearchTerm("");
                    setImageFile(null);
                }}
                style={{display:"flex",  alignItems:"center", color:"black"}}>
                {
                    receiver === null ? (
                        <div style={{display:"flex", flexDirection:"column", margin:10, gap:10  }}>
                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap:5, height:"5%"}}>
                                <Input
                                    value={searchTerm}
                                    onChange={(e) => {setSearchTerm(e.target.value)}}
                                    onKeyDown={(e) => {if (e.key === "Enter") {searchUsers()}}}
                                    disabled={loading}
                                />
                                <IoIosSearch style={{height:50, width:100, cursor:"pointer"}} onClick={()=>searchUsers()}/>
                            </div>
                            {
                                usersList.length > 0 ? (
                                    <div style={{overflowY:'auto', height:'95%'}}>
                                        {usersList.map((user, index) => (
                                            <div key={index} style={{ display: 'flex', flexDirection: 'row', marginTop:10, alignItems:'center', gap:20,  cursor:"pointer", border:"1px solid black", borderRadius:10, padding:10 }}
                                                onClick={() => {setReceiver(user.username)}}>
                                                <FaUser style={{height:50, width:50}} />
                                                <div style={{display:'flex', flexDirection:"column" }}>
                                                    <div>Name: {user.name}</div>
                                                    <div>Student ID: {user.username}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{display:"flex", justifyContent:"center" }}>No users found</div>
                                )
                            }
                        </div>
                    ) : (
                        <div style={{display:"flex", flexDirection:"column", margin:10, gap:10, justifyContent:"center" }}>
                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap:20}}>
                                <div style={{whiteSpace:"nowrap"}}>Amount: RM</div>
                                <Input
                                    value={amount}
                                    onChange={(e) => {handleAmountChange(e)}}
                                    disabled={loading}
                                />
                            </div>
                            {amountError && <div style={{ color: 'red' }}>{amountError}</div>}
                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap:20}}>
                                <div>Description:</div>
                                <Input
                                    value={description}
                                    onChange={(e) => {handleDescriptionChange(e)}}
                                    disabled={loading}
                                />
                            </div>
                            {descriptionError && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', color: 'red' }}>{descriptionError}</div>}
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <Button style={{backgroundColor:'#3b8dff', color:"white", fontWeight:'bold', height:'100%', width:'100px' }}
                                    onClick={() => {
                                        if (!amount || !description) {
                                            alert("Please fill in all fields");
                                            return;
                                        }
                                        if (amountError || descriptionError) {
                                            alert("Please enter valid amount and description");
                                            return;
                                        }
                                        setWebcamCaptureModal(true)
                                    }}>
                                    Confirm
                                </Button>
                            </div>
                        </div>
                    )
                }
            </Modal>
            <Modal isOpen={webcamCaptureModal}
                toggle={()=>{
                    setWebcamCaptureModal(false);
                    setImageFile(null);
                }}
                style={{display:"flex",  alignItems:"center", color:"black"}}>
                    {message && <p style={{ color: "red" }}>{message}</p>}
                    <WebcamCapture
                        width={600}
                        key={reloadKey}
                        live={true}
                        dev={false} //development purpose
                        onCapture={(file)=>{setImageFile(file)}}
                        onCancel={()=>setImageFile(null)}
                        onReload={()=>setReloadKey(reloadKey+1)}
                    />
            </Modal>

            <Navbar />
            <div className='content-container'>
                <div style={{ display: 'flex', flexDirection: 'row', height:'10%', alignItems:'center', justifyContent:'center', gap:20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div>Balance</div>
                        <div style={{fontSize:'1.5rem', color:"#06c288"}}>RM {userCredit}</div>
                    </div>
                    <Button style={{backgroundColor:'#3b8dff', color:"white", fontWeight:'bold', height:'100%', width:'100px'}} onClick={() => setPayModal(true)}>Pay</Button>
                </div>
                <div style={{height:"5%"}}></div>
                <div style={{display:'flex', flexDirection:"column", height:"10%", paddingTop:10, width:"70vw"}}>
                    <div style={{textAlign:"left", fontWeight:"bold", borderBottom:"2px solid white", paddingBottom:10}}>Transaction History</div>
                    <div style={{display:"flex", flexDirection:"row"}}>
                        <div style={{width:"35%", textDecoration:"underline"}}>Transaction</div>
                        <div style={{width:"35%", textDecoration:"underline"}}>Description</div>
                        <div style={{width:"30%", textDecoration:"underline"}}>Amount</div>
                    </div>
                </div>
                <div style={{overflowY:'auto', height:'75%'}}>
                    {transactions.map((transaction, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'row', paddingTop:20, alignItems:'center', gap:20, whiteSpace:"nowrap" }}>
                            <div style={{ width: '35%', textAlign: 'left' }}>
                                <div style={{display:'flex', flexDirection:'row', gap:20}}>
                                    <div style={{display:'flex', flexDirection:'column', gap:5}}>
                                        <div>{transaction.receiver.name}</div>
                                        <div style={{fontSize:'60%'}}>{transaction.receiver.username}</div>
                                        <div style={{fontSize:'80%'}}>{formatDateTime(transaction.timestamp)}</div>
                                    </div>
                                </div>
                            </div>
                            <div style={{width:'35%', display:'flex', alignItems:'center', justifyContent:'center'}}>{transaction.description}</div>
                            <div style={{ width: '30%', display:'flex', flexDirection:'row', gap:5, justifyContent:'center'}}>
                                <div>RM </div>
                                <div style={{color: transaction.amount >= 0 ? 'green' : 'red'}}>{transaction.amount}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EMSCardPage;