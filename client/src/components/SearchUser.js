import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import Loading from "./Loading";
import SearchUserCard from "./SearchUserCard";
import toast from "react-hot-toast";
import axios from "axios";
import { IoCloseCircle } from "react-icons/io5";



const SearchUser = ({ onClose }) => {
    const [searchUser, setSearchUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const handleSearchUser = async () => {
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`;
        try {
            setLoading(true);
            const response = await axios.post(URL,{
                search : search
            });
            setLoading(false);
            setSearchUser(response.data.data);
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }

    useEffect(() => {
        handleSearchUser();
    },[search]);


    console.log("searchUser", searchUser);
    


    return (
        <div className="fixed top-0 bottom-0 right-0 left-0 bg-slate-700 bg-opacity-40 p-2 z-10">
            <div className="w-full max-w-lg mx-auto mt-10">
                {/* input search user */}
                <div className="bg-white rounded h-14 overflow-hidden flex">
                    <input
                        type="text"
                        placeholder="search user by name, email, ...."
                        className="w-full h-full outline-none py-1 px-4"
                        onChange={ (e) => setSearch(e.target.value) }
                        value={ search }
                    />
                    <div className="h-14 w-14 flex justify-center items-center">
                        <IoSearch size={ 25 }/>
                    </div>
                </div>

                {/* display search user */}
                <div className="bg-white w-full mt-2 p-4 rounded">
                    {
                        searchUser.length === 0 && !loading && (
                            <p className="text-center text-slate-500">no user found !</p>
                        )
                    }

                    {
                        loading && (
                            <Loading/>
                        )
                    }

                    {
                        searchUser.length !== 0 && !loading && (
                            searchUser?.map((user,index) => {
                                return (
                                    <SearchUserCard key={ user._id } user={ user } onClose={ onClose }/>
                                )
                            })
                        )
                    }
                </div>
            </div>
            <div className="absolute top-0 right-0 text-2xl p-2 lg:text-4xl text-white hover:text-primary" onClick={ onClose }>
                <button>
                    <IoCloseCircle/>
                </button>
            </div>
        </div>
    )
}

export default SearchUser;