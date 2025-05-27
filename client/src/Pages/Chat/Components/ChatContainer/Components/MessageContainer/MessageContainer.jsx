import { useRef, useEffect } from "react";
import { useAppStore } from "../../../../../../Store";
import moment from "moment";
import { toast } from "sonner";
import { apiClient } from "../../../../../../lib/apiClient";
import { GET_ALL_MESSAGES, HOST } from "../../../../../../utils/constants";
import { MdFolderZip } from "react-icons/md";
import {IoMdArrowDown} from 'react-icons/io'

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();

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
    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages();
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
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      //today
      const isToday = moment(message.timestamp).isSame(moment(), "day");
      //yesterday
      const isYesterday = moment(message.timestamp).isSame(
        moment().subtract(1, "day"),
        "day"
      );
      //checking toady and yesterday based on isToday and isYesterDay
      const displayDate = isToday
        ? "Today"
        : isYesterday
        ? "Yesterday"
        : moment(message.timestamp).format("LL");

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2 ">{displayDate}</div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };
  const downloadFile=async(fileUrl)=>{
    const res=await apiClient.get(`${HOST}/${fileUrl}`, {responseType: 'blob'});
    const urlBlob=window.URL.createObjectURL(new Blob([res.data]))
    const link=document.createElement("a");
    link.href=urlBlob;
    link.setAttribute("download", fileUrl.split('/').pop())
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob)

  }

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
              <div className="cursor-pointer">
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
                <span className="line-clamp-2 text-sm">{message.fileUrl.split('/').pop()}</span>
                <span className="p-1 bg-black/20 md:p-3 sm:text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300" onClick={()=>downloadFile(message.fileUrl)}><IoMdArrowDown/></span>
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
  return (
    <div className="flex-1 overscroll-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;
