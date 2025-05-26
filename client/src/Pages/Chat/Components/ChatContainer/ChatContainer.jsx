import ChatHeader from "./Components/ChatHeader/ChatHeader"
import MessageBar from "./Components/MessageBar/MessageBar"
import MessageContainer from "./Components/MessageContainer/MessageContainer"

const ChatContainer = () => {
  return (
    <div className="fixed top-0 min-h-screen w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1 ">
        <ChatHeader/>
        <MessageContainer/>
        <MessageBar/>
        
    </div>
  )
}

export default ChatContainer