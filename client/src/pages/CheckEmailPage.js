import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LiaUserCircle } from "react-icons/lia";
import axios from "axios";
import toast from "react-hot-toast";



const CheckEmailPage = () => {
    const navigate = useNavigate();

    const [data, setData]  = useState({
        email : ""
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

        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/check-email`

        try {
            const response = await axios.post(URL,data);
            toast.success(response.data.message);

            if(response.data.success){
                setData({
                    email : ""
                })
                navigate('/password',{
                    state : response.data.data
                });
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }

    return (
        <div className="mt-5">
            <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto shadow-lg">
                <div className="w-fit mx-auto mb-2">
                    <LiaUserCircle size={80}/>
                </div>
                <h3>wellcome to chat</h3>

                <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email">Email : </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="enter your email"
                            className="bg-slate-100 px-2 py-1"
                            value={data.email}
                            onChange={handleOnChange}
                            required
                        />
                    </div>
                    <button className="text-white bg-primary hover:bg-secondary font-bold text-lg px-4 py-1 mt-2 rounded leading-relaxed tracking-wide">
                        Next
                    </button>        
                </form>
                <p className="my-3 text-center">New User ? <Link to={"/register"} className="font-semibold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default CheckEmailPage;