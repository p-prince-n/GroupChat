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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "../../../../../../lib/apiClient";
import {
  CREATE_CHANNEL_ROUTE,
  GET_ALL_CONTACTS_ROUTE,
} from "../../../../../../utils/constants";
import { useAppStore } from "../../../../../../Store";
import { useEffect } from "react";
import MultipleSelector from "../../../../../../components/ui/multipleselect";

const CreateChannel = () => {
  const {  addChannel } = useAppStore();
  const [newChannelModel, setNewChannelModel] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {
          withCredentials: true,
        });
        if (res.status === 200) {
          setAllContacts(res.data.contacts);
        }
      } catch (e) {
        const errorMessage =
          e?.response?.data?.message ||
          "Something went wrong. Please try again.";
        toast.error(errorMessage);
      }
    };
    getData();
  }, []);

  const createChannel = async () => {
    try {
      if(channelName.length >0  && selectedContacts.length>0 ){

        const res=await apiClient.post(CREATE_CHANNEL_ROUTE, {name: channelName, members: selectedContacts.map((contact)=> contact.value)},{withCredentials: true})
        if(res.status === 201){
          setChannelName('')
          setSelectedContacts([])
          setNewChannelModel(false);
          addChannel(res.data.channel)
        }
      }

    } catch (e) {
      const errorMessage =
        e?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300 "
              onClick={() => setNewChannelModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={newChannelModel} onOpenChange={setNewChannelModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[500px] lg:h-[60vh] lg:w-[40vw] flex flex-col  ">
          <DialogHeader>
            <DialogTitle>
              Please fill up the details for new channel
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Channel name"
              className="rounded-full p-5 bg-[#2c2e3b] border-none "
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <MultipleSelector className='rounded-lg bg-[#2c2e3b] py-2 text-white '
          defaultOptions={allContacts}
          placeholder={'Search contacts '}
          value={selectedContacts}
          onChange={setSelectedContacts}
          emptyIndicator={
            <p className="text-center text-lg leading-10 text-gray-600">No result found.</p>
          }
          />
          <div>
            <Button
              onClick={createChannel}
              className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 "
            >
              Create Channel
            </Button>
          </div>
          {/* //icaon */}
          {/* <div className="flex-1 mt-5 md:mt-0 md:bg-[#1c1d25] md:flex flex-col justify-center items-center  duration-1000 transition-all">
            <Lottie
              isClickToPauseDisabled={true}
              height={100}
              width={100}
              options={animationDefaultOptions}
            />
            <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
              <h1 className="poppins-medium  ">
                Hi<span className="text-purple-500">! </span>Search new{" "}
                <span className="text-purple-500 ">Channels.</span>
              </h1>
            </div>
          </div> */}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
