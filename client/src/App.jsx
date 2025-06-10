import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Profile from "./Pages/Profile/Profile"
import Auth from "./Pages/Auth/Auth"
import Chat from "./Pages/Chat/Chat"
import { useAppStore } from "./Store"
import { useEffect, useState } from "react"
import { apiClient } from "./lib/apiClient"
import { GET_USER_INFO } from "./utils/constants"
import { toast } from "sonner";
import { Spinner } from "flowbite-react";

const PrivateRoute=({children})=>{
const {userInfo}=useAppStore();
const isAuthenticated=!!userInfo;
return isAuthenticated ? children : <Navigate to={"/auth"}/>;
}

const AuthRoute=({children})=>{
const {userInfo}=useAppStore();
const isAuthenticated=!!userInfo;
return isAuthenticated ?  <Navigate to={"/chat"} />: children;
}

function App() {
  const {userInfo, setUserInfo}=useAppStore();
  const [loading, setLoading]=useState(true)
  useEffect(()=>{
    const getuserData=async()=>{
      try{
        const res= await apiClient.get(GET_USER_INFO,{withCredentials: true} )
        if(res.status === 200 && res.data._id ){
          setUserInfo(res.data)

        }else{
          setUserInfo(undefined)
        }
        

      }catch(e){
        setUserInfo(undefined)
        const errorMessage =
        e?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
      }finally{
        setLoading(false)
      }


    }
    if(!userInfo){
      getuserData();
    }else{
      setLoading(false)
    }
  }, []);
  if(loading){
    return <div className="min-h-screen min-w-screen flex items-center justify-center">
      <Spinner aria-label="Extra large spinner example" size="xl" />
    </div>
  }

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthRoute><Auth/></AuthRoute>}/>
        <Route path="/chat" element={<PrivateRoute><Chat/></PrivateRoute>}/>
        <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>}/>
        <Route path="*" element={<Navigate to={'/auth'}/>} />
      </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
