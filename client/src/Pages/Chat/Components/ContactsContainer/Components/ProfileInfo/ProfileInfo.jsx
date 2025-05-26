import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "../../../../../../Store";
import { getColors } from "../../../../../../lib/utils";
import { HOST, SIGNOUT_ROUTE } from "../../../../../../utils/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import {IoPowerSharp} from 'react-icons/io5'
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../../../../lib/apiClient";
import {toast} from 'sonner'

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore();
  
  const navigate=useNavigate();
  const logOut=async()=>{
    try{
      const res=await apiClient.post(SIGNOUT_ROUTE, {}, {withCredentials: true})
      if(res.status===200){
        setUserInfo(null);
        navigate('/auth')
        toast.success('Log out successfullt.')
      }
      

    }catch (e) {
        
      const errorMessage =
        e?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  }
  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center ">
        <div className="size-12 relative ">
          <Avatar className="size-12 rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="profile"
                className="object-cover size-full bg-black"
              />
            ) : (
              <div
                className={`uppercase size-12 text-lg border flex items-center justify-center rounded-full ${getColors(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.charAt(0)
                  : userInfo.userInfo?.email?.charAt(0) || "?"}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5 ">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2 onClick={()=>navigate('/profile')} className="text-purple-500 text-xl font-medium" />
            </TooltipTrigger>
            <TooltipContent className='bg-[#1c1b1e] border-none text-white'>
              Edit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp onClick={logOut} className="text-red-500 text-xl font-medium" />
            </TooltipTrigger>
            <TooltipContent className='bg-[#1c1b1e] border-none text-white'>
              LogOut
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
