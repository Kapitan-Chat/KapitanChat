
import { useState,useRef,useEffect } from "react"
import { useAuth } from "../Provider/AuthProvider"



// вресенно 

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import emptyFile from '../assets/empty-file.webp'

/**
 * Компонент для ввода сообщения
 * 
 * @param {Function} setlist - функция для обновления списка сообщений
 * @param {number} chatid - идентификатор чата
 * 
 * @returns {React.Component} - компонент для ввода сообщения
 */
export default function MessageInputArea({setlist,chatid}) {
    const {JWTaccessToken,BASE_WS_URL,userid,uploadAttachments} = useAuth();
    const [msg, setmsg] = useState("");
    const wsRef = useRef(null);
    const fileInputRef = useRef(null);

    const [showEmoji, setShowEmoji] = useState(false);

    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
      console.log('All selected files:', selectedFiles);
    }, [selectedFiles]);
    /** соединение с вебсокетом */
    useEffect(() => {
    const ws = new WebSocket(`${BASE_WS_URL}ws/chat?token=${JWTaccessToken}`);
    wsRef.current = ws;

    ws.addEventListener("open", () => {
      console.log("WS open");
      if (!userid) console.warn("user not found");
    });

    ws.addEventListener("message", (ev) => {

        
      try {
        const payload = JSON.parse(ev.data);
        if (payload.type === "message") {
            console.log("WS message", payload.data);
            if(payload.data.chat.id===chatid){
              setlist((list) => [...list, payload.data]);
            }
            else{
              alert("у вас сообщение в чате " + payload.data.chat.id);
            }
        }
      } catch (e) {
        console.warn("bad WS message", e);
      }
    });


    ws.addEventListener("error", (e) => {
      console.error("WS error", e);
      const h1 = document.getElementById("status");
      if (h1) h1.textContent = "Error WS";
    });

    ws.addEventListener("close", () => console.log("WS close"));
    return () => ws.close();
  }, [BASE_WS_URL, JWTaccessToken]); 

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



/**
 * Обработчик события отправки сообщения
 * 
 * @param {Event} e - событие отправки формы
 * 
 * @returns {void}
 * 
 * @throws {Error} - если возникла ошибка при отправке сообщения
 */
    async function MessageHandler(e){
        e.preventDefault();
        if(msg.length > 0 || selectedFiles.length > 0){
          const response = await uploadAttachments(selectedFiles);
          try{
            send({
              type: 'message',
              data: {
                  user_id: userid,
                  chat_id: chatid,
                  content: msg,
                  attachments: response
              }
            })
            setShowEmoji(false);
            setmsg('');
            setSelectedFiles([]);
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

    function isFileInArray(file, filesArray) {
      return filesArray.some(
        (f) =>
          f.name === file.name &&
          f.size === file.size &&
          f.lastModified === file.lastModified
      );
    }

    async function handleFileSelect(e) {
      const file = e.target.files[0];
      if (!file) return;

      console.log("Selected:", file);
      if(!isFileInArray(file, selectedFiles))
        setSelectedFiles([...selectedFiles, file]);
    }

    return(
        <>
        <div>
            <h1 id="status"></h1>
        </div>
        <div className="message-input-container">
          {
            (selectedFiles.length > 0) && <div className="attachments-container">
              {
                selectedFiles.map((file) => {
                  return <div className="selected-file" style={{backgroundImage: `url(${emptyFile})`}}>
                    {file.name.substring(file.name.lastIndexOf(".") + 1)}
                    <button 
                      className="delete-attachment"
                      onClick={() => {
                        setSelectedFiles(
                          selectedFiles.filter(
                            (deleteFile) => (
                              (deleteFile.name != file.name) && 
                              (deleteFile.size != file.size) && 
                              (deleteFile.lastModified != file.lastModified)
                            )
                          )
                        )
                      }}
                    >❌</button>
                  </div>
                })
              }
            </div>
          }
          <div className="message-input-wrapper">
              
            <button 
              className="icon-btn"
              onClick={() => {
                console.log("btn click", fileInputRef.current)
                fileInputRef.current.click();
              }}
            ><i className="fas fa-paperclip"></i></button>
            <label htmlFor="msg"></label>
            <input 
              type="text" 
              className="message-input" 
              name="message" 
              id="msg" 
              placeholder="Write message..." 
              value={msg} 
              onChange={(e) => setmsg(e.target.value)} 
              onKeyDown={(e) => handleKeyDown(e)}
            />
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
                  >
                  <i 
                    className="far fa-smile"
                    onClick={() => {         
                      setShowEmoji((v) => !v);
                    }}
                  ></i>
                  </button>

                  <input 
                    style={{ display: "none" }} 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                  />
                </div>

                <button 
                  className="send-button" 
                  onClick={(e) => (MessageHandler(e))}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
          </div>
            </div>

        </>
    )
}