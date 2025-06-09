
import { useAppStore } from "../Store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HOST } from "../utils/constants";
import { getColors } from "../lib/utils";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    selectedChatType,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();
  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5 w-full ">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`px-5 py-3  transition-all duration-300 cursor-pointer w-full ${
            selectedChatData && (selectedChatData._id === contact._id)
              ? "bg-[#8417ff] hover:bg-[#8417ff]"
              : "hover:bg-[#f1f1f111] "
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-5 items-center pl-4 text-neutral-300 ">
            {!isChannel && (
              <Avatar className="size-10 rounded-full overflow-hidden">
                {contact.image ? (
                  <AvatarImage
                    src={`${HOST}/${contact.image}`}
                    alt="profile"
                    className="object-cover size-full bg-black"
                  />
                ) : (
                  <div
                    className={`${selectedChatData && selectedChatData._id=== contact._id ?"bg-[#ffffff22] border-2 border-white/70 " :getColors(contact.color) }uppercase size-10 text-lg border flex items-center justify-center rounded-full ${getColors(
                      contact.color
                    )}`}
                  >
                    {contact.firstName
                      ? contact.firstName.charAt(0)
                      : contact.email?.charAt(0) ||
                        "?"}
                  </div>
                )}
              </Avatar>
            )}
            {
                isChannel && <div className="bg-[#ffffff22] size-10 flex items-center justify-center rounded-full">{contact.name.charAt(0)}</div>
            }
            {
                isChannel ? <span>{contact.name}</span> : <span>{contact.firstName ? `${contact.firstName} ${contact.lastName}` : contact.email}</span>
            }
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
