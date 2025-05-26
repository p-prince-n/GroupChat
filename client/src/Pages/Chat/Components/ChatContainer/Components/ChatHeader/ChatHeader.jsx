import { RiCloseFill } from "react-icons/ri";
import { useAppStore } from "../../../../../../Store";
import { getColors } from "../../../../../../lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HOST } from "../../../../../../utils/constants";
const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();
  
  return (
    <div className="h-20  border-b-2 border-[#2f303b] flex items-center justify-between px-10 ">
      <div className="flex gap-5 items-center w-full justify-between  ">
        <div className="flex gap-3 items-center justify-center   ">
          <div className="size-12 relative  ">
            <Avatar className="size-12 rounded-full overflow-hidden">
              {selectedChatData.image ? (
                <AvatarImage
                  src={`${HOST}/${selectedChatData.image}`}
                  alt="profile"
                  className="object-cover size-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase size-12 text-lg border flex items-center justify-center rounded-full ${getColors(
                    selectedChatData.color
                  )}`}
                >
                  {selectedChatData.firstName
                    ? selectedChatData.firstName.charAt(0)
                    : selectedChatData.selectedChatData?.email?.charAt(0) || "?"}
                </div>
              )}
            </Avatar>
          </div>
          <div>
            {selectedChatType === 'contact' && selectedChatData.firstName ? `${selectedChatData.firstName} ${selectedChatData.lastName}` : selectedChatData.email}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5 ">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => closeChat()}
          >
            <RiCloseFill className="text-2xl md:text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
