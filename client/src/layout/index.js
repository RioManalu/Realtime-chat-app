import React from "react";
import logo from "../assets/images/logo1.png"

const AuthLayout = ({ children }) => {
    return (
        <>
            <header className="flex justify-center items-center py-2 shadow-md bg-white">
                <img 
                    src={logo}
                    alt="logo"
                    width={120}
                />
            </header>

            { children }
        </>

    )
}

export default AuthLayout;