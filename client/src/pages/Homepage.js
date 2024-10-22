import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { setUser, logout, setOnlineUser, setSocketConnection } from "../redux/userSlice";
import Sidebar from "../components/Sidebar";
import logo from "../assets//images/logo1.png";
import io from "socket.io-client";

const HomePage = () => {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    console.log("redux user", user);
    

    const fetchUserDetails = async () => {
        try {
            const response = await axios({
                url : `${process.env.REACT_APP_BACKEND_URL}/api/user-details`,
                withCredentials : true
            });
            
            if(response.data.data.logout) {
                dispatch(logout());
                navigate("/email");
                console.log("end logout");
            }

            dispatch(setUser(response.data.data));

            console.log("response", response);
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        fetchUserDetails();
    },[]);

    // socket connection
    useEffect(() => {
        const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
            auth : {
                token : localStorage.getItem("token")
            }
        });

        socketConnection.on("onlineUser", (data) => {
            console.log(data);
            dispatch(setOnlineUser(data));
        });

        dispatch(setSocketConnection(socketConnection));

        return () => {
            socketConnection.disconnect();
        }
    },[]);

    const basePath = location.pathname === "/";

    return (
        <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
            <section className={`bg-white ${ !basePath && "hidden" } lg:block`}>
                <Sidebar/>
            </section>

            {/* message component */}
            <div className={`${ basePath && 'hidden' }`}>
                <Outlet/>
            </div>

            <div  className={`flex-col justify-center items-center ${ !basePath ? "hidden" : "lg:flex" }`}>
                <div>
                    <img
                        src={`${ logo }`}
                        width={ 220 }
                        alt="logo"
                    />
                </div>
                <p className="text-lg -mt-5 text-slate-500">Select chat to send message.</p>
            </div>
        </div>
    )
}

export default HomePage;