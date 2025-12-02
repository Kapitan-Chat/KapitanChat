
import { useState,useRef,useEffect } from "react"
import { useAuth } from "../Provider/AuthProvider"

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

/**
 * Компонент для ввода сообщения
 * 
 * @param {Function} setlist - функция для обновления списка сообщений
 * @param {number} chatid - идентификатор чата
 * 
 * @returns {React.Component} - компонент для ввода сообщения
 */
export default function MessageInputArea({setlist,chatid,}) {
  const {userid,wsRef,wsError,isEdit,setIsEdit,editMessage,setEditMessage,MessageApi} = useAuth();
  const [msg, setmsg] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
    

  // отправка сообщения
  const send = (obj) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn("WS not ready");
      return; 
    }
    ws.send(JSON.stringify(obj));
    console.log("send", obj);
  };

  wsRef.current.onmessage = (event) => {
    const payload = JSON.parse(event.data);
    console.log("onmessage", payload);
    
    if(payload.type === "message" && payload.data.chat.id === chatid){
      console.log("onmessage", payload.data);
    setlist((list) => [...list, payload.data]);
    }
    else if(payload.type == "message_edit" && payload.data.chat.id == chatid){
      console.log("onmessage edit data", payload.data);
    setlist((list) => {
      const updatedList = list.map((item) => {
        if (item.id === payload.data.id) {
          return { ...item, content: payload.data.content,is_edited: true };
        }
        return item;
      });
      return updatedList;
    });
    }
  }
 

  useEffect(() => {
    if(isEdit){
      setmsg(editMessage.content);
    }

  },[isEdit,editMessage]);

  

/**
 * Обработчик события отправки сообщения
 * 
 * @param {Event} e - событие отправки формы
 * 
 * @returns {void}
 * 
 * @throws {Error} - если возникла ошибка при отправке сообщения
 */
    function MessageHandler(e){
      if(!isEdit){
        e.preventDefault();
        try{
          send({
            type: 'message',
            data: {
                user_id: userid,
                chat_id: chatid,
                content: msg,
                attachments: []
            }
          })
          setShowEmoji(false);
          setmsg('');
        }
        catch(e){
            console.log(e);
        }
      }
      else if(isEdit){
        e.preventDefault();
        try{
          send({
            type: 'message_edit',
            data: {
                id: editMessage.id,
                userid: userid,
                chatid: chatid,
                content: msg,
                attachments: []
            }
          })
          setShowEmoji(false);
          setmsg('');
          setIsEdit(false);
          setEditMessage({});
        }
        catch(e){
            console.log(e);
        }
      }
        
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
          MessageHandler(e);
        }
    }

    function EmojiHandler(data){
      console.log(data);
      setmsg(msg + data.native);
    }

    // очистка полей
    useEffect(() => {
    return () => {
      setmsg('');
      setShowEmoji(false);
      setIsEdit(false);
      setEditMessage({});
    }
  },[chatid])
    return(
        <>
        <div>
            <h1 id="status"></h1>
        </div>
        <div className="message-input-container">
                <div className="message-input-wrapper">
                   
                    <button className="icon-btn"><i className="fas fa-paperclip"></i></button>
                    <label htmlFor="msg"></label>
                    <input type="text" className="message-input" name="message" id="msg" placeholder="Write message..." 
                    value={msg} onChange={(e) => setmsg(e.target.value)} onKeyDown={(e) => handleKeyDown(e)}/>
                    <div className="input-actions">
                       
                      <div className="emoji-wrapper">
        {showEmoji && (
          <div className="emoji-picker">
            <Picker
              data={data}
              onEmojiSelect={(emoji) => EmojiHandler(emoji)}
            />
          </div>
        )}

        <button
          className="icon-btn"
          onClick={() => setShowEmoji((v) => !v)}
        >
          <i className="far fa-smile"></i>
        </button>
      </div>

                        <button className="send-button" onClick={(e) => (MessageHandler(e))}><i className="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>

        </>
    )
}