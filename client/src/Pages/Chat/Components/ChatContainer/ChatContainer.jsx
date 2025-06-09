import ChatHeader from "./Components/ChatHeader/ChatHeader";
import MessageBar from "./Components/MessageBar/MessageBar";
import MessageContainer from "./Components/MessageContainer/MessageContainer";

const ChatContainer = () => {
  return (
    <div className="fixed top-0  w-screen h-screen bg-[#1c1d25] flex flex-col md:static md:flex-1">
      <ChatHeader />
      <div className="flex-1 overflow-hidden flex flex-col w-full">
        <MessageContainer />
      </div>
      <MessageBar />
    </div>
  );
};

export default ChatContainer;
