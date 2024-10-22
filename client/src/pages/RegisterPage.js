import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../utils/uploadFile";
import axios from "axios";
import toast from "react-hot-toast";


const RegisterPage = () => {
    const [data, setData]  = useState({
        name : "",
        email : "",
        password : "",
        profile_pic : ""
    })

    const [uploadPhoto, setUploadPhoto] = useState("");
    const navigate = useNavigate();

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setData((prev) => {
            return {
                ...prev,
                [name] : value
            }
        })
    }

    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0];
        const uploadPhoto = await uploadFile(file);
        setUploadPhoto(file);

        setData((prev) => {
            return {
                ...prev,
                profile_pic : uploadPhoto.url
            }
        })
    }

    const handleClearUploadPhoto = (e) => {
        // hapus uploadPhoto
        e.preventDefault()
        e.stopPropagation();        
        setUploadPhoto(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`

        try {
            const response = await axios.post(URL,data);
            toast.success(response.data.message);

            if(response.data.success){
                setData({
                    name : "",
                    email : "",
                    password : "",
                    profile_pic : ""
                })
            }
            navigate('/email');
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }

        console.log("data", data);
    }

    return (
        <div className="mt-5">
            <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto shadow-lg">
                <h3>wellcome to chat</h3>

                <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="name">Name : </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="enter your name"
                            className="bg-slate-100 px-2 py-1"
                            value={ data.name }
                            onChange={ handleOnChange }
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="email">Email : </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="enter your email"
                            className="bg-slate-100 px-2 py-1"
                            value={ data.email }
                            onChange={ handleOnChange }
                            required
                        />
                    </div>

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
                    <div className="flex flex-col gap-1">
                        <label htmlFor="profile_pic">Photo : 
                            <div className="h-14 bg-slate-200 flex justify-center items-center border hover:border-black cursor-pointer">
                                <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
                                    {
                                        uploadPhoto?.name ? uploadPhoto.name : "Upload Your Profile Photo"
                                    }
                                </p>
                                {
                                    // if uploadPhoto.name exist render close icon, if it doesn't exist render nothing.
                                    uploadPhoto?.name && (
                                        <button className="text-lg ml-2 hover:text-red-600">
                                            <IoClose onClick={handleClearUploadPhoto}/>
                                        </button>
                                    )
                                }
                            </div>
                        </label>
                        <input
                            type="file"
                            id="profile_pic"
                            name="profile_pic"
                            className="bg-slate-100 px-2 py-1 hidden"
                            onChange={handleUploadPhoto}
                        />
                    </div>
                    <button className="text-white bg-primary hover:bg-secondary font-bold text-lg px-4 py-1 mt-2 rounded leading-relaxed tracking-wide">
                        Register
                    </button>        
                </form>
                <p className="my-3 text-center">
                    Already have account ? 
                    <Link to={"/email"} className="font-semibold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default RegisterPage;