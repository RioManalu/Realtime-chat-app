import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import uploadFile from "../utils/uploadFile";
import { IoCloseCircle } from "react-icons/io5";
import Loading from "./Loading";
import { IoIosSend } from "react-icons/io";
import moment from "moment"




const MessagePage = () => {
    const params = useParams();
    const socketConnection = useSelector(state => state?.user?.socketConnection);
    const user = useSelector(state => state?.user);
    const [dataUser, setDataUser] = useState({
        _id : "",
        name : "",
        email : "",
        profile_pic : "",
        online : false
    });
    const [openFileUpload, setOpenFileUpload] = useState(false);
    const [message, setMessage] = useState({
        text : "",
        imageUrl : "",
        videoUrl : ""
    });
    const [loading, setLoading] = useState(false);
    const [allMessage, setAllMessage] = useState([]);
    const currentMessage = useRef(null);

    const handleOpenFileUpload = () => {
        setOpenFileUpload(prev => !prev);
    }

    const handleUploadImage = async (e) => {
        const file = e.target.files[0];
        setLoading(true);
        const uploadPhoto = await uploadFile(file);
        setLoading(false);
        setOpenFileUpload(false);

        setMessage(prev => {
            return {
                ...prev,
                imageUrl : uploadPhoto.url 
            }
        });        
    }

    const handleClearImage = () => {
        setMessage(prev => {
            return {
                ...prev,
                imageUrl : ""
            }
        });   
    }

    const handleUploadVideo = async (e) => {
        const file = e.target.files[0];
        setLoading(true);
        const uploadVideo = await uploadFile(file);
        setLoading(false);
        setOpenFileUpload(false);

        setMessage(prev => {
            return {
                ...prev,
                videoUrl : uploadVideo.url
            }
        });
    }

    const handleClearVideo = () => {
        setMessage(prev => {
            return {
                ...prev,
                videoUrl : ""
            }
        });   
    }

    const handleOnChage = (e) => {
        const { name, value } = e.target;

        setMessage(prev => {
            return {
                text : value
            }
        });
    }

    const handleSubmitMessage = (e) => {
        e.preventDefault();

        if(message.text || message.imageUrl || message.videoUrl){
            if(socketConnection){
                socketConnection.emit("new message", {
                    sender : user?._id,
                    receiver : params.userID,
                    text : message.text,
                    imageUrl : message.imageUrl,
                    videoUrl : message.videoUrl,
                    msgByUserId : user?._id
                });
            }
            setMessage({
                text : "",
                imageUrl : "",
                videoUrl : ""
            });
        }
    }

    console.log("params", params);
    console.log("userId params", params.userID);
    console.log("user-messagePage", user);

    useEffect(() => {
        if(socketConnection) {
            socketConnection.emit("message-page", params.userID);

            socketConnection.emit("seen", params?.userID);

            socketConnection.on("message-user", (data) => {
                console.log("user-details (on- message-user)", data);
                setDataUser(data);
            })

            socketConnection.on("message", (data) => {
                console.log("message data", data);
                setAllMessage(data);
            })
        }
    },[socketConnection, params?.userID, user]);

    useEffect(() => {
        if(currentMessage.current){
            currentMessage.current.scrollIntoView({
                behavior : "smooth",
                block : "end"
            })
        }
    },[allMessage]);

    return (
        <div className="bg-no-repeat bg-cover bg-small lg:bg-large">
            <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
                <div className="flex items-center gap-4">
                    <Link to={ "/" } className="lg:hidden">
                        <FaAngleLeft size={ 25 }/>
                    </Link>
                    <div>
                        <Avatar
                            width={ 40 }
                            height={ 40 }
                            imageUrl={ dataUser?.profile_pic }
                            name={ dataUser?.name }
                            userId={ dataUser?._id }
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">{ dataUser?.name }</h3>
                        <p className="-my-1 text-sm">
                            {
                                dataUser.online ? <span className="text-primary">online</span> : <span className="text-slate-400">offline</span>
                            }
                        </p>
                    </div>
                </div>
                <div>
                    <button className="cursor-pointer hover:text-primary">
                        <BsThreeDotsVertical/>
                    </button>
                </div>
            </header>

            {/* show all messages */}
            <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar bg-slate-200 bg-opacity-50">
                {/* show all uploaded message */}
                <div className="flex flex-col gap-2 py-2 mx-2" ref={ currentMessage }>
                    {
                        allMessage.map((msg, index) => {
                            return(
                                <div className={`p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg.msgByUserId ? "ml-auto bg-teal-100" : "bg-white"}`}>
                                    <div className="w-full">
                                        {
                                            msg?.imageUrl && (
                                                <img
                                                    src={ msg.imageUrl }
                                                    className="w-full h-full object-scale-down"
                                                />
                                            )
                                        }

                                        {
                                            msg?.videoUrl && (
                                                <video
                                                    src={ msg.videoUrl }
                                                    controls
                                                    className="w-full h-full object-scale-down"
                                                />
                                            )
                                        }
                                    </div>
                                    <p className="px-2">{ msg.text }</p>
                                    <p className="text-xs ml-auto w-fit">{ moment(msg.createdAt).format("hh:mm") }</p>
                                </div>
                            )
                        })
                    }
                </div>

                {/* display image message before upload*/}
                { message.imageUrl && (
                    <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
                        <div onClick={ handleClearImage } className="absolute w-fit p-2 top-0 right-0 cursor-pointer hover:text-primary text-slate-600">
                            <IoCloseCircle size={ 35 }/>
                        </div>
                        <div className="bg-white p-3">
                            <img
                                src={ message.imageUrl }
                                alt="uploadImage"
                                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                            />
                        </div>
                    </div>
                )}

                {/* display video message before upload*/}
                { message.videoUrl && (
                    <div className="w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden sticky bottom-0">
                        <div onClick={ handleClearVideo } className="absolute w-fit p-2 top-0 right-0 cursor-pointer hover:text-primary text-slate-600">
                            <IoCloseCircle size={ 35 }/>
                        </div>
                        <div className="bg-white p-3">
                            <video
                                src={ message.videoUrl }
                                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                                controls
                                muted
                                autoPlay
                            />
                        </div>
                    </div>
                )}

                {
                    loading && (
                        <div className="w-full h-full flex justify-center items-center sticky bottom-0">
                            <Loading/>                            
                        </div>
                    )
                }
            </section>

            {/* send message */}
            <section className="h-16 bg-white flex items-center px-4">
                <div className="relative">
                    <button onClick={ handleOpenFileUpload } className="flex justify-center items-center w-10 h-10 rounded-full hover:bg-primary hover:text-white cursor-pointer">
                        <FaPlus size={ 20 }/>
                    </button>


                    {/* video and image */}
                    {
                        openFileUpload && (
                            <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
                                <form>
                                    <label htmlFor="uploadImage" className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer">
                                        <div>
                                            <FaImage size={ 18 }/>
                                        </div>
                                        <p>Image</p>
                                    </label>
                                    <label htmlFor="uploadVideo" className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer">
                                        <div>
                                            <FaVideo size={ 18 }/>
                                        </div>
                                        <p>Video</p>
                                    </label>
                                    <input
                                        type="file"
                                        name="uploadImage"
                                        id="uploadImage"
                                        onChange={ handleUploadImage }
                                        className="hidden"
                                    />
                                    <input
                                        type="file"
                                        name="uploadVideo"
                                        id="uploadVideo"
                                        onChange={ handleUploadVideo }
                                        className="hidden"
                                    />
                                </form>
                            </div>
                        )
                    }
                </div>

                {/* input message */}                
                <form className="w-full h-full flex gap-3" onSubmit={ handleSubmitMessage }>
                    <input
                        type="text"
                        placeholder="Type a message"
                        value={ message.text }
                        onChange={ handleOnChage }
                        className="w-full h-full py-1 px-4 outline-none"
                    />
                    <button>
                        <IoIosSend size={ 25 }/>
                    </button>
                </form>

            </section>
        </div>
    )
}

export default MessagePage;