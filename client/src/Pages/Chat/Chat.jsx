import React, { useEffect } from 'react'
import { useAppStore } from '../../Store'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ContactsContainer from './Components/ContactsContainer/ContactsContainer';
import ChatContainer from './Components/ChatContainer/ChatContainer';
import EmptyChatContainer from './Components/EmptyChatContainer/EmptyChatContainer';

const Chat = () => {
  const {userInfo, selectedChatData, selectedChatType}=useAppStore();
  const navigate=useNavigate();

  useEffect(()=>{
    if(!userInfo.profileSetup){
      toast('Please setup Profile to continue.');
      navigate('/profile')

    }

  }, [userInfo, navigate])
  return (
    <div className='flex h-[100vh] min-h-screen text-white overflow-hidden '>
      <ContactsContainer/>
      {selectedChatType === undefined ? <EmptyChatContainer/> : <ChatContainer/> }
     
    </div>
  )
}

export default Chat