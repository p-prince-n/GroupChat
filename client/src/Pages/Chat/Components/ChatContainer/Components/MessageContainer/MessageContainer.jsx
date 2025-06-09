import { useRef, useEffect, useState } from "react";
import { useAppStore } from "../../../../../../Store";
import moment from "moment";
import { toast } from "sonner";
import { apiClient } from "../../../../../../lib/apiClient";
import { GET_ALL_MESSAGES, GET_CHANNEL_MESSAGES_ROUTE, HOST } from "../../../../../../utils/constants";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {getColors} from '@/lib/utils'

const MessageContainer = () => {
  const {userInfo}= useAppStore();
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
    setFileDownloadProgress,
    setIsDownloading,
  } = useAppStore();
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await apiClient.post(
          GET_ALL_MESSAGES,
          { id: selectedChatData._id },
          { withCredentials: true }
        );

        if (res.data.messages) {
          setSelectedChatMessages(res.data.messages);
        }
      } catch (e) {
        const errorMessage =
          e?.response?.data?.message ||
          "Something went wrong. Please try again.";
        toast.error(errorMessage);
      }
    };

    const  getChannelMessages = async () => {
      try {
        const res = await apiClient.get(
          `${GET_CHANNEL_MESSAGES_ROUTE}/${selectedChatData._id}`,
          { withCredentials: true }
        );

        if (res.data.messages) {
          setSelectedChatMessages(res.data.messages);
        }
      } catch (e) {
        const errorMessage =
          e?.response?.data?.message ||
          "Something went wrong. Please try again.";
        toast.error(errorMessage);
      }
    };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages();
      }
      if(selectedChatType === 'channel'){
        getChannelMessages();
      }
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkImage = (filePath) => {
    const imageRegEx =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegEx.test(filePath);
  };

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.createdAt).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      //today
      const isToday = moment(message.createdAt).isSame(moment(), "day");
      //yesterday
      const isYesterday = moment(message.createdAt).isSame(
        moment().subtract(1, "day"),
        "day"
      );
      const displayDate = isToday
        ? "Today"
        : isYesterday
        ? "Yesterday"
        : moment(message.createdAt).format("LL");

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2 ">{displayDate}</div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };
  const downloadFile = async (fileUrl) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    const res = await apiClient.get(`${HOST}/${fileUrl}`, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentCompleted = Math.round((100 * loaded) / total);
        setFileDownloadProgress(percentCompleted);
      },
    });
    const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", fileUrl.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0);
  };

  const renderDMMessages = (message) => {
    return (
      <div
        className={`${
          message.sender === selectedChatData._id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words `}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words `}
          >
            {checkImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  height={300}
                  width={300}
                  alt=""
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4 ">
                <span className=" p-2 text-white/8- sm:inline-block sm:text-3xl bg-black/20 rounded-full md:p-3 ">
                  <MdFolderZip />
                </span>
                <span className="line-clamp-2 text-sm">
                  {message.fileUrl.split("/").pop()}
                </span>
                <span
                  className="p-1 bg-black/20 md:p-3 sm:text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowDown />
                </span>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-gray-600 ">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };
  const renderChannelMessages = (message) => {

    return (
      <div
        className={`${
          message.sender._id !== userInfo._id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender._id === userInfo._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9 `}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender._id === userInfo._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words `}
          >
            {checkImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  height={300}
                  width={300}
                  alt=""
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4 ">
                <span className=" p-2 text-white/8- sm:inline-block sm:text-3xl bg-black/20 rounded-full md:p-3 ">
                  <MdFolderZip />
                </span>
                <span className="line-clamp-2 text-sm">
                  {message.fileUrl.split("/").pop()}
                </span>
                <span
                  className="p-1 bg-black/20 md:p-3 sm:text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowDown />
                </span>
              </div>
            )}
          </div>
        )}
        {message.sender._id !== userInfo._id ? (
          <div className="flex items-center justify-start gap-3 ">
            <Avatar className="size-8 rounded-full overflow-hidden">
              {message.sender.image && (
                <AvatarImage
                  src={`${HOST}/${message.sender.image}`}
                  alt="profile"
                  className="object-cover size-full bg-black"
                />
              ) }
                <AvatarFallback
                  className={`uppercase size-8 text-lg flex items-center justify-center rounded-full ${getColors(
                    message.sender.color
                  )}`}
                >
                  {message.sender.firstName
                    ? message.sender.firstName.charAt(0)
                    : message.sender?.email?.charAt(0) ||
                      "?"}
                </AvatarFallback>
              
            </Avatar>
            <span className="text-sm text-white/60  ">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
            <span className="text-xs text-white/60 ">{moment(message.createdAt).format('LT')}</span>
          </div>
        ) : (
          <div className="text-xs text-white/60 mt-1 ">{moment(message.createdAt).format('LT')}</div>
        )}
      </div>
    );
  };
  return (
    <div className="flex-1 overflow-y-auto p-4 px-8 custom-scrollbar">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col ">
          <div className="p-4 sm:px-10">
            <img
              src={`${HOST}/${imageUrl}`}
              alt="image"
              className=" h-[300px] w-[100%] sm:h-[50vh] sm:w-full bg-cover "
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className=" bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageUrl)}
            >
              <IoMdArrowDown />
            </button>
            <button
              className=" bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
