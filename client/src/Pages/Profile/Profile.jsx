import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../Store";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColors } from "../../lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "../../lib/apiClient";
import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from "../../utils/constants";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef=useRef(null);

  const handleFileInputClick=()=>{
    fileInputRef.current.click();
  }

   const handleImageChange=async(e)=>{
    const file=e.target.files[0];
    if(file){
      const formData=new FormData();
      formData.append("profile-image", file);
      const res=await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {withCredentials: true});
      if(res.status === 200 && res.data.image){
        setUserInfo({...userInfo, image:res.data.image});
        toast.success('image updated successfully.')
      }
      const reader= new FileReader();
      reader.onload=()=>{
        setImage(reader.result)
      }
      reader.readAsDataURL(file);

    }


   }
   const handleImagedelete=async()=>{
    try{
      const res=await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {withCredentials: true})
      if(res.status === 200 ){
        setUserInfo({...userInfo, image: null})
        toast.success('image removed successfully.')
        setImage(null);
      }

    }catch (e) {
        const errorMessage =
          e?.response?.data?.message ||
          "Something went wrong. Please try again.";
        toast.error(errorMessage);
      }
   }
  const validatProfile = () => {
    if (!firstName) {
      toast.error("First Name is required.");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required.");
      return false;
    }
    return true;
  };

  useEffect(()=>{
    if(userInfo.profileSetup===true){
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName)
      setSelectedColor(userInfo.color)
    }
    if(userInfo.image){
      setImage(`${HOST}/${userInfo.image}`)
    }
  }, [userInfo]);

  const handleNavigate=()=>{
    if(userInfo.profileSetup){
      navigate('/chat')
    }else{
      toast.error('Please setup Profile first.....')
    }
  }

  const saveChanges = async () => {
    if (validatProfile()) {
      try {
        const res=await apiClient.post(UPDATE_PROFILE_ROUTE, {firstName, lastName, color:selectedColor+1}, {withCredentials: true});
        if(res.status === 200 && res.data){
          console.log(res.data);
          
          setUserInfo({...res.data});
          toast.success('Profile Updated successfully.')
          navigate('/chat')

        }
      } catch (e) {
        const errorMessage =
          e?.response?.data?.message ||
          "Something went wrong. Please try again.";
        toast.error(errorMessage);
      }
    }
    // TODO: Save logic here
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col w-[100vw] md:w-max px-5">
        <div>
          <IoArrowBack
            onClick={() => handleNavigate()}
            className="text-4xl lg:text-6xl text-white/90 cursor-pointer"
          />
        </div>

        <div className="grid sm:grid-cols-2 mt-5 gap-10">
          {/* Profile Avatar with hover icon */}
          <div className="relative group w-32 h-32 md:w-48 md:h-48 mx-auto">
            <Avatar className="size-full rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover size-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase size-full text-5xl border flex items-center justify-center rounded-full ${getColors(
                    selectedColor
                  )}`}
                >
                  {firstName
                    ? firstName.charAt(0)
                    : userInfo?.email?.charAt(0) || "?"}
                </div>
              )}
            </Avatar>

            {/* Hover icon overlay */}
            <div className="absolute inset-0 bg-black/50 rounded-full hidden group-hover:flex items-center justify-center cursor-pointer transition" onClick={image ? handleImagedelete : handleFileInputClick}>
              {image ? (  
                <FaTrash className="text-white text-3xl" />
              ) : (
                <FaPlus className="text-white text-3xl" />
              )}
            </div>
            <input type="file" hidden ref={fileInputRef} accept=".png, .jpeg, .jpg, .svg, .webp" onChange={handleImageChange} name="profile-image" />
            
          </div>

          {/* Form fields */}
          <div className="flex flex-col gap-5 text-white items-center justify-center w-full">
            <Input
              placeholder="Email"
              type="email"
              disabled
              value={userInfo?.email || ""}
              className="rounded-lg p-6 bg-[#2c2e3b] w-full"
            />
            <Input
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              type="text"
              value={firstName}
              className="rounded-lg p-6 bg-[#2c2e3b] w-full"
            />
            <Input
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              type="text"
              value={lastName}
              className="rounded-lg p-6 bg-[#2c2e3b] w-full"
            />

            {/* Color Selection */}
            <div className="w-full flex gap-5 justify-center items-center">
              {colors.map((color, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedColor(index)}
                  className={`${color} size-8 rounded-full cursor-pointer transition-all duration-300 ${
                    selectedColor === index ? "outline-2 outline-white/50" : ""
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="w-full mt-10">
          <Button
            onClick={saveChanges}
            className="h-13 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
