
import React, { useState } from 'react';
import axios from 'axios';


const ConversationBody = ({ chatmessages, selectedSenderName,user1, user2 }) => {

  const [sendmessage, setsendMessage] = useState('');

  if (!selectedSenderName) {
    return null;
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevents a newline character in the input field
        handleSubmit();
      }
  };

  const scrollToBottom = () => {};

  const submitData = async () => {};

  console.log("inside body" + chatmessages.from);

  const reversedMessages = [...chatmessages].reverse();


  const handleChange = (event) => {
    setsendMessage(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('https://6013-103-159-67-242.ngrok-free.app/send-message', {
        senderId: user2,
        recipientId: user1, 
        message: {
          text: sendmessage,
        },
        messageText: sendmessage,
      });

      console.log('Message sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  };

  
  return (
    <React.Fragment>
      <div className="relative h-[92%] overflow-y-auto">
        <div className=" border-b-2 border-b-gray-300 py-5 px-8 fixed bg-white w-[46.8%] z-10">
          <h1 className="text-3xl font-bold ">{selectedSenderName}</h1>
        </div>
        <div className="w-full h-full  -100 py-24">
          {reversedMessages.map((messageData, index) => {
            // Convert 'created_time' to custom time format
            const customTimeFormat = new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });

            const formattedCreatedTime = customTimeFormat.format(
              new Date(messageData.created_time)
            );
            const marginLeftClass = messageData.from.id === user2 ? 'text-right max-w-xs ml-auto mb-4 m-4' : 'max-w-xs mb-4 m-4';
            return (
              
              <div className={`${marginLeftClass}`} key={index}>
                <div >
                <p className={messageData.from.id === user2 ? "bg-white w-fit pt-2 pb-2 pr-4 pl-4 p-1 px-4 border-2 text-xl flex items-center justify-center font-semibold rounded-lg ml-auto" : "bg-white w-fit pt-2 pb-2 pr-4 pl-4 p-1 px-4 border-2 text-xl flex items-center justify-center font-semibold rounded-lg"}> {messageData.message}</p>
                </div>
                <p className='text-sm font-bold text-slate-600 mt-2'>{messageData.from.name} - {formattedCreatedTime}</p>
                {/* <p>ID: {messageData.from.id}</p> */}
          
                {/* Add more details from the 'from' object if needed */}
              </div>
            );
            
          })}
        </div>

        <div className={"px-4 absolute bottom-2 w-full "}>
                  <div className="fixed bottom-2 w-[46%]">
                      <input
                          type="text"
                          className="appearance-none p-4 w-full border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-2 focus:border-blue-300 text-lg"
                          placeholder={`Reply`}
                          value={sendmessage} onChange={handleChange}
                          onKeyDown={handleKeyDown}
                      />
                      {/* <button onClick={handleSubmit}>Send Message</button> */}

                  </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ConversationBody;
