import { useEffect, useRef } from "react";
import { useChatStore } from "../../store/useChatStore";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
  const {
    selectedUser,
    messages,
    getMessagesByUserId,
    isMessagesLoading,
  } = useChatStore();

  const userId = localStorage.getItem('userId');
  const messageEndRef = useRef(null);
  //var messages = [];

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    // clean up
  }, [selectedUser, getMessagesByUserId]);
  


  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${msg.senderId === userId ? "chat-end" : "chat-start"}`}
              >
                {msg.text}
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === userId
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.text && <p className="mt-2">{msg.text}</p>}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {/* 👇 scroll target */}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;