import { create } from "zustand";
import { createauthSlice } from "./Slices/authSlice";
import { createChatSlice } from "./Slices/chatSlice";

export const useAppStore=create()((...a)=>({
    ...createauthSlice(...a),
    ...createChatSlice(...a)
    
}))