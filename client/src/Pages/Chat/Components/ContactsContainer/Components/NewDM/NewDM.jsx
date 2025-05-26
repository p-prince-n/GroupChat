import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions } from "../../../../../../lib/utils";
import { toast } from "sonner";
import { apiClient } from "../../../../../../lib/apiClient";
import { SEARCH_CONTACTS, HOST } from "../../../../../../utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "../../../../../../Store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColors } from "../../../../../../lib/utils";

const NewDM = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [openNewContactsModal, setOpenNewContactsModal] = useState(false);
  const [searchContacts, setSearchContacts] = useState([]);
  
  const getSearchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const res = await apiClient.post(
          SEARCH_CONTACTS,
          { searchTerm },
          { withCredentials: true }
        );
        if (res.status === 200 && res.data) {
          console.log(res.data);

          setSearchContacts(res.data);
        }
      } else {
        setSearchContacts([]);
      }
    } catch (e) {
      const errorMessage =
        e?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };
  const selectNewContact=(contact)=>{
    setOpenNewContactsModal(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact)
    setSearchContacts([])

  }
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300 "
              onClick={() => setOpenNewContactsModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contacts
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog
        open={openNewContactsModal}
        onOpenChange={setOpenNewContactsModal}
      >
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[500px] lg:h-[60vh] lg:w-[40vw] flex flex-col  ">
          <DialogHeader>
            <DialogTitle>Contacts</DialogTitle>
            <DialogDescription>Please Select a contacts</DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="search contacts"
              className="rounded-full p-5 bg-[#2c2e3b] border-none "
              onChange={(e) => getSearchContacts(e.target.value)}
            />
          </div>
          { searchContacts.length > 0 && <ScrollArea className="h-[250px]">
            <div className="flex flex-col gap-5">
              {searchContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="flex gap-3 px-4 py-2 hover:bg-[#2e303d] items-center cursor-pointer " onClick={()=>selectNewContact(contact)}
                >
                  <div className="size-12 relative ">
                    <Avatar className="size-12 rounded-full overflow-hidden">
                      {contact.image ? (
                        <AvatarImage
                          src={`${HOST}/${contact.image}`}
                          alt="profile"
                          className="object-cover size-full bg-black"
                        />
                      ) : (
                        <div
                          className={`uppercase size-12 text-lg border flex items-center justify-center rounded-full ${getColors(
                            contact.color
                          )}`}
                        >
                          {contact.firstName
                            ? contact.firstName.charAt(0)
                            : contact.contact?.email?.charAt(0) || "?"}
                        </div>
                      )}
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <span>
                      {contact.firstName && contact.lastName
                        ? `${contact.firstName} ${contact.lastName}`
                        : contact.email}
                    </span>
                    <span className="text-xs ">
                        {contact.email}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>}
          {searchContacts.length <= 0 && (
            <div className="flex-1 mt-5 md:mt-0 md:bg-[#1c1d25] md:flex flex-col justify-center items-center  duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                <h1 className="poppins-medium  ">
                  Hi<span className="text-purple-500">! </span>Search new{" "}
                  <span className="text-purple-500 ">Contacts.</span>
                </h1>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
