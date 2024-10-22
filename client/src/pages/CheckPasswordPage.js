import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/userSlice";


const CheckPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        if(!location.state){
            navigate("/email");
        }
    })

    const [data, setData]  = useState({
        password : ""
    })

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setData((prev) => {
            return {
                ...prev,
                [name] : value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const response = await axios({
                method : "POST",
                url : `${process.env.REACT_APP_BACKEND_URL}/api/check-password`,
                data : {
                    userId : location?.state?._id,
                    password : data.password
                },
                withCredentials : true
            });
            toast.success(response.data.message);

            if(response.data.success){
                dispatch(setToken(response?.data?.token));
                localStorage.setItem("token", response?.data?.token);
                
                setData({
                    password : ""
                });
                navigate('/');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }

    return (
        <div className="mt-5">
            <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto shadow-lg">
                <div className="w-fit mx-auto mb-2">
                    <Avatar
                        width = { 80 }
                        height = { 80 }
                        name = { location?.state?.name }
                        imageUrl = { location?.state?.profile_pic }
                    />
                </div>
                <h2 className="font-semibold text-lg w-fit mx-auto mb-2">{ location?.state?.name }</h2>
                <h3>wellcome to chat!</h3>
                <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="password">Password : </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="enter your password"
                            className="bg-slate-100 px-2 py-1"
                            value={data.password}
                            onChange={handleOnChange}
                            required
                        />
                    </div>
                    <button className="text-white bg-primary hover:bg-secondary font-bold text-lg px-4 py-1 mt-2 rounded leading-relaxed tracking-wide">
                        Log In
                    </button>        
                </form>
                <p className="my-3 text-center"><Link to={"/forgot-password"} className="font-semibold hover:underline">Forgot Password ?</Link>
                </p>
            </div>
        </div>
    )
}

export default CheckPasswordPage;