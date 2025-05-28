import { useEffect } from "react";
import { useAppStore } from "../../Store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./Components/ContactsContainer/ContactsContainer";
import ChatContainer from "./Components/ChatContainer/ChatContainer";
import EmptyChatContainer from "./Components/EmptyChatContainer/EmptyChatContainer";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Chat = () => {
  const {
    userInfo,
    selectedChatData,
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please setup Profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return (
    <div className="flex h-[100vh] min-h-screen text-white overflow-hidden ">
      {isUploading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg ">
          <div className="text-5xl animate-pulse ">
            <div style={{ width: 200, height: 200 }}>
              <CircularProgressbar value={fileUploadProgress} minValue={0} maxValue={100} text={`${fileUploadProgress}%`} />
            </div>
          </div>
        </div>
      )}
      {isDownloading && (
        <div className="h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg ">
          <div className="text-5xl animate-pulse ">
            <div style={{ width: 200, height: 200 }}>
              <CircularProgressbar value={fileDownloadProgress} minValue={0} maxValue={100} text={`${fileDownloadProgress}%`} />
            </div>
          </div>
        </div>
      )}
      <ContactsContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default Chat;
