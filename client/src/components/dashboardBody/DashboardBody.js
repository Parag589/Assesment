import React from "react";
import Conversations from "../Conversations/ConversationsList";
import ConversationBody from "../Conversations/ConversationsBody";
import UserDetails from "../UserDetails/UserDetails";
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [conversationData, setConversationData] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatmessages, setmessages] = useState([]);
  const [selectedSenderName, setSelectedSenderName] = useState(null);
  const [user1, setuser1] = useState(null);
  const [user2, setuser2] = useState(null);

  const hi = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    const fetchConversationDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/fetchConversationDetails`
        );
        const conversations = response.data.data;

        const formattedConversations = conversations
          .map((conversation) => {
            const participants = conversation.participants.data;
            const messages = conversation.messages.data;
            const senders = conversation.senders.data;
            const conversationId = conversation.id;

            const sender = participants.find(
              (participant) => participant.id === senders[0].id
            );
            const receiver = participants.find(
              (participant) => participant.id === senders[1].id
            );

            if (sender && receiver) {
              const senderName = sender.name;
              const senderId = sender.id;
              const receiverId = receiver.id;
              const lastMessage =
                messages.length > 0 ? messages[0].message : "No messages";
              setuser1(senderId);
              setuser2(receiverId);

              return {
                senderName,
                senderId,
                receiverId,
                lastMessage,
                conversationId,
              };
            }

            return null;
          })
          .filter(Boolean);

        setConversationData(formattedConversations);
      } catch (error) {
        console.error("Error fetching conversation details:", error.message);
      }
    };

    fetchConversationDetails();
  }, []);

  const handleChatClick = async (conversationId) => {
    setSelectedChat(conversationId);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/fetchMessages/${conversationId}`
      );
      const messages = response.data.messages;
      setmessages(messages);

      const selectedConversation = conversationData.find(
        (conversation) => conversation.conversationId === conversationId
      );
      if (selectedConversation) {
        const { senderName } = selectedConversation;
        setSelectedSenderName(senderName);
      }

      console.log("Messages for conversationId:", conversationId);
      console.log(messages);
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
  };

  return (
    <section className="flex w-full h-full text-gray-800">
      <div className="flex flex-col w-1/4">
        <Conversations
          conversationData={conversationData}
          selectedChat={selectedChat}
          handleChatClick={handleChatClick}
        />
      </div>

      <div className="flex flex-col w-1/2 border-x-2 border-gray-300">
        <ConversationBody
          conversationData={conversationData}
          chatmessages={chatmessages}
          selectedSenderName={selectedSenderName}
          user1={user1}
          user2={user2}
        />
      </div>

      <div className="flex flex-col w-1/4">
        <UserDetails selectedSenderName={selectedSenderName} />
      </div>
    </section>
  );
};

export default Dashboard;
