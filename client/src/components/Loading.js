import React from "react";

const Loading = () => {
    return (
        <div className="flex justify-center">
            <div className="border-gray-300 h-6 w-6 animate-spin rounded-full border-8 border-t-primary" />
        </div>
    )
}

export default Loading;