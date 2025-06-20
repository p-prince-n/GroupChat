import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "../../../../../../Store";
import { useSocket } from "../../../../../../context/SocketContext";
import { apiClient } from "../../../../../../lib/apiClient";
import { UPLOAD_FILE_ROUTE } from "../../../../../../utils/constants";
const MessageBar = () => {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef();
  const socket = useSocket();
  const emojiRef = useRef();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };
  useEffect(() => {
    function handleClickOutSide(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [emojiRef]);
  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo._id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
      
    } else if (selectedChatType === "channel") {
      socket.emit("send-channel-message", {
        sender: userInfo._id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      });
    }
    setMessage("");
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };
  const handleAttachmentChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setFileUploadProgress(0);
        setIsUploading(true);

        const res = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
          },
        });

        setIsUploading(false);
        setFileUploadProgress(0);
        if (res.status === 200 && res.data) {
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo._id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: res.data.filePath,
            });
          } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
              sender: userInfo._id,
              content: undefined,
              messageType: "file",
              fileUrl: res.data.filePath,
              channelId: selectedChatData._id,
            });
          }
        }
      }
    } catch (e) {
      setIsUploading(false);
      setFileUploadProgress(0);
      console.error("File upload error:", e);
      const errorMessage =
        e?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="h-[6vh] px-2 sm:h-[10vh]  bg-[#1c1d25] flex justify-center items-center sm:px-8 mb-6 gap-2 md:gap-6 ">
      <div className="flex-1  flex h-14 md:h-auto bg-[#2a2b33] rounded-md gap-3 md:gap-5 pr-5 w-3/4 ">
        <input
          placeholder="Enter Message"
          type="text"
          className="flex-1 w-3/5 p-5 bg-transparent rounded-md focus:border-none focus:outline-none "
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          name=""
          id=""
        />
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className=" text-[18px]  sm:text-2xl" />
        </button>
        <div className="relative top-4 md:top-5 ">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setEmojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className="text-[22px]  sm:text-2xl" />
          </button>
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleAttachmentChange}
          />
          
        </div>
        <div>
          <div className=" absolute bottom-30 right-5 md:right-20" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        className="bg-[#8417ff] rounded-md size-10 sm:size-auto  flex items-center justify-center p-0 sm:p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        onClick={handleSendMessage}
      >
        <IoSend className="text-[16px]  sm:text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
