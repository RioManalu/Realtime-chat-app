import React, { useState } from "react";
import uploadFile from "../utils/uploadFile";
import Avatar from "./Avatar";
import Divider from "./Divider";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const EditUserDetails = ({ onClose, user}) => {
    const dispatch = useDispatch();

    const [data, setData] = useState({
        name : user?.name,
        profile_pic : user?.profile_pic
    })

    console.log("user edit", user);

    const handleEditUser = (e) => {
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

        setData((prev) => {
            return {
                ...prev,
                profile_pic : uploadPhoto.url
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`

        try {
            const response = await axios({
                method : "POST",
                url : URL,
                data : data,
                withCredentials : true
            });
            console.log("response", response)
            toast.success(response?.data?.message);
            if(response.data.success){
                dispatch(setUser(response.data.data));
                onClose();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }

    return (
        <div className="fixed top-0 bottom-0 right-0 left-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10">
            <div className="bg-white px-4 py-6 m-1 rounded w-full max-w-sm">
                <h2 className="font-semibold">Profile</h2>
                <p className="text-sm">Edit User Detail</p>

                <form className="grid gap-3 mt-3" onSubmit={ handleSubmit }>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="name">Name : </label>
                        <input 
                            type="text"
                            name="name"
                            id="name"
                            value={ data.name }
                            onChange={ handleEditUser }
                            className="w-full py-1 px-2 focus:outline-primary border"
                        />
                    </div>
                    <div>
                        <div>Photo : </div>
                        <div className="my-1 flex items-center gap-4">
                            <Avatar
                                width={ 40 }
                                height={ 40 }
                                name={ data?.name }
                                imageUrl={ data?.profile_pic }
                            />
                            <label htmlFor="profile_pic">
                                <p className="font-semibold cursor-pointer">Change Photo</p>
                                <input
                                    type="file"
                                    id="profile_pic"
                                    className="hidden"
                                    onChange={handleUploadPhoto}
                                />
                            </label>
                        </div>
                    </div>
                    <Divider/>
                    <div className="flex gap-2 w-fit ml-auto">
                        <button onClick={ onClose } className="border-primary border text-primary px-4 py-1 rounded hover:text-white hover:bg-secondary">Cancel</button>
                        <button onSubmit={ handleSubmit } className="border-primary text-white bg-primary px-4 py-1 rounded hover:bg-secondary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditUserDetails;