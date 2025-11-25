
import { create } from "zustand";
import messageService from "../services/messageService";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
    chats: [],
    messages: [],
    messagesAux: null,
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    setSelectedUser: (selectedUser) => set({ selectedUser }),

    getMyChatPartners: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await messageService.getChatPartners();
            set({ chats: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await messageService.getMessagesByUserId(userId);
            set({ messages: res.data });
            set({ isMessagesLoading: false });
            console.log(get().messages);
            return res.data
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        const userId = localStorage.getItem('userId');

        const tempId = `temp-${Date.now()}`;

        const optimisticMessage = {
            _id: tempId,
            senderId: userId,
            receiverId: selectedUser._id,
            text: messageData.text,
            createdAt: new Date().toISOString(),
            isOptimistic: true, // flag to identify optimistic messages (optional)
        };
        // immidetaly update the ui by adding the message
        set({ messages: [...messages, optimisticMessage] });

        try {
            const res = await messageService.sendMessage(selectedUser._id, messageData);
            set({ messages: messages.concat(res.data) });
        } catch (error) {
            // remove optimistic message on failure
            set({ messages: messages });
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },
}))