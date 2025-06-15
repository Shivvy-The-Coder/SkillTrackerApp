import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext()
// using cookies here to save the credentials
axios.defaults.withCredentials = true;

export const AppContextProvider = (props)=>{

    // url of our backedn server
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin , setIsLoggedin] = useState(false)
    const [userData , setUserData] = useState(false)

    const getAuthState = async () => {
        try {
                const { data } = await axios.post(backendUrl + '/api/auth/is-auth');
                if (data.success) {
                setIsLoggedin(true);
                getUserData();
                } else {
                toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
            };


    const getUserData = async ()=>{
        try
        {
            const {data} = await axios.get(backendUrl + '/api/user/data');
            data.success?setUserData(data.userData) : toast.error(data.message)
        }
        catch(error)
            {
                toast.error(error.message)
            }
    }

    useEffect(()=>{
        getAuthState()
    },[])

    const value={
        backendUrl,
        isLoggedin,setIsLoggedin,
        userData,setUserData,
        getUserData
    }
    return(
            <AppContext.Provider value={value}>
                    {props.children}
            </AppContext.Provider>
    )
}
