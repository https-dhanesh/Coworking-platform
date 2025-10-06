import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = () =>{
    const authContext = useContext(AuthContext);
    if(!authContext) throw new Error('AuthContext is missing');
    const {user,isLoading} = authContext;
    if(isLoading) return <div>Loading ....</div>
    return user ? <Outlet/> : <Navigate to='/login' replace/>;
};
export default ProtectedRoute;