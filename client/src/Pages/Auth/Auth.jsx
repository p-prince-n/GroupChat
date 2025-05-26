import Victory from "@/assets/victory.svg";
import { Tabs, TabsContent, TabsTrigger } from "../../components/ui/tabs";
import { TabsList } from "../../components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import BackGround from "@/assets/login2.png";
import { toast } from "sonner";
import { apiClient } from "../../lib/apiClient.js";
import { SIGNUP_ROUTE, SIGNIN_ROUTE } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../Store/index.js";

const Auth = () => {
  const navigate = useNavigate();
  const {setUserInfo}=useAppStore();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const validateSignUp = () => {
    if (!email) {
      toast.error("email is required");
      return false;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter email.");
      return false;
    }
    if (!password || !confirmPassword) {
      toast.error("password and confirm password  is required");
      return false;
    }
    if (password.length < 6) {
      toast.error("password must be atleast 6 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("password and confirm password should be same.");
      return false;
    }
    return true;
  };
  const validatelogIn = () => {
    if (!email) {
      toast.error("email is required");
      return false;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter email.");
      return false;
    }
    if (!password) {
      toast.error("password and confirm password  is required");
      return false;
    }
    if (password.length < 6) {
      toast.error("password must be atleast 6 characters long.");
      return false;
    }
    return true;
  };
  const handleLogin = async () => {
    try {
      if (validatelogIn()) {
        const res = await apiClient.post(
          SIGNIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );

        if (res.data._id) {
            setUserInfo(res.data);
          if (res.data.profileSetup){ navigate("/chat");}
          else {navigate("/profile");}
        }
      }
    } catch (e) {
        
      const errorMessage =
        e?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };
  const handleSignup = async () => {
    try {
      if (validateSignUp()) {
        const res = await apiClient.post(
          SIGNUP_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (res.status === 201) {
            setUserInfo(res.data);
          navigate("/profile");
        }
      }
    } catch (e) {
      const errorMessage =
        e?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };
  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 ">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Victory} alt="victory emogi" className="h-[100px] " />
            </div>
            <p className="font-medium text-center">
              fill in the details to get started with the best chat app{" "}
            </p>
          </div>
          <div className="flex items-center justify-center w-full ">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="flex flex-col gap-5 mt-10">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
                <Button
                  variant="outline"
                  className=" font-semibold text-blue-100 rounded-full p-6 bg-purple-600"
                  onClick={handleLogin}
                >
                  Log In
                </Button>
              </TabsContent>
              <TabsContent value="signup" className="flex flex-col gap-5 ">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setconfirmPassword(e.target.value)}
                />
                <Button
                  variant="outline"
                  className="font-semibold text-blue-100 rounded-full p-6 bg-purple-600"
                  onClick={handleSignup}
                >
                  Sign Up
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={BackGround} alt="background img" className="h-[700px]" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
