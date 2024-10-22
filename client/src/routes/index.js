import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";
import CheckEmailPage from "../pages/CheckEmailPage";
import CheckPasswordPage from "../pages/CheckPasswordPage";
import MessagePage from "../components/MessagePage";
import HomePage from "../pages/Homepage";
import AuthLayout from "../layout";
import ForgotPassword from "../pages/ForgotPassword";

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "register",
                element : <AuthLayout><RegisterPage/></AuthLayout>
            },
            {
                path : "email",
                element : <AuthLayout><CheckEmailPage/></AuthLayout>
            },
            {
                path : "password",
                element : <AuthLayout><CheckPasswordPage/></AuthLayout>
            },
            {
                path : "forgot-password",
                element : <AuthLayout><ForgotPassword/></AuthLayout>
            },
            {
                path : "",
                element : <HomePage/>,
                children : [
                    {
                        path : ":userID",
                        element : <MessagePage/>
                    }
                ]
            }
        ]
    }
]);

export default router