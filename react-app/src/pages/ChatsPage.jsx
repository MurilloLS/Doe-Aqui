import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useNavigate } from "react-router-dom";
import ChatsList from "../components/messageComponents/ChatList";
import ChatContainer from "../components/messageComponents/ChatContainer";
import NoConversationPlaceholder from "../components/messageComponents/NoConversationPlaceholder";
            
import Header from "../components/Header";

function ChatPage(){
    const navigate = useNavigate();
    const { activeTab, selectedUser } = useChatStore();

    /*useEffect(() => {
            if (!localStorage.getItem('token')) {
                navigate('/login');
                return;
            }
        }, [navigate]);*/
    
    return(
        <div>
            <Header />

            {/*Lado esquerdo*/}
            <div className="relative w-full max-w-6xl h-[800px]">
                <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        <ChatsList />
                    </div>
                </div>
            </div>

            {/*Lado direito*/}
            <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
                {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
            </div>
        </div>
    );
}

export default ChatPage;