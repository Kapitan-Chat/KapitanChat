import React, { useEffect } from "react";
/**
 * Компонент для отображения списка чатов
 *
 * @param {array} chatList - список чатов
 * @param {function} setChatId - функция для обновления идентификатора чата
 * @param {function} setSecondChatId - функция для обновления идентификатора второго чата
 *
 * @returns {React.Component} - компонент для отображения списка чатов
 */
    export default function ChatList({
        chatList,
        setChatId,
        isUser=false,
        isNewChat=false, 
        forGroupchat=false,
        setSecondChatId,

        setShowMenu,
    }) {
    const { ChatApi, me, setUserSearchActive, GetChatList, addGroupUsers, setAddGroupUsers, getImage } = useAuth();

    console.log('ChatList:', chatList);

    useEffect(() => {}, [chatList]);

/**
 * Обработчик клика на чат
 * 
 * @param {React.MouseEvent<HTMLDivElement>} e - событие клика
 * @param {number} chatId - идентификатор чата
 * 
 * @returns {void} - ничего не возвращает
 */
    function handleChatClick(e,chatId) {
        console.log('ctrlKey =', e.ctrlKey);
        if(e.ctrlKey){
            setSecondChatId(chatId);
        }
        else{
            setChatId(chatId);
        }
    }
    return (
        <>
        {chatList.length === 0?(<h1 className="no-chats">No chats found</h1>):(
            <div className="chats-container" style={{marginTop: (!isNewChat && !forGroupchat && !isUser) ? "15px" : 0}}>
            {
            chatList.map((chat, i) => (
                <div 
                    className={`chat-item${chat.active ? " active" : ""}`} 
                    key={chat.id} 
                    onClick={(e)=>{handleChatClick(e, chat.id, chat); setShowMenu(false)}}
                    style={{ animationDelay: `${i * 0.15 + 1.5}s` }}

                    
                >
                    
                    <div className="chat-header">
                        <div className="chat-avatar" >
                            
                            {chat.img? <img src={chat.img} decoding="async" /> : (
                                <div>
                                    
                                    <h2>{chat.name.charAt(0).toUpperCase()+chat.name.charAt(chat.name.length-1).toLowerCase()}</h2>
                                </div>
                            )}
                            
                        </div>
                        
                        <div className="chat-header">
                            
                            <div className="chat-name">{chat.name}</div>
                            
                        </div>
                        
                        <div className="chat-preview">{chat.lastMessage}</div>
                        
                    </div>
                ))}
            </div>
        )}
        </>
    );
}
