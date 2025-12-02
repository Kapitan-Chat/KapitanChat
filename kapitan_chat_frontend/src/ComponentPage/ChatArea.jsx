import MessageInputArea from "./MessageInputArea";
import MessageMenu from "./MessageMenu";
import { useAuth } from "../Provider/AuthProvider";
import { useEffect, useState } from "react";
import Search from "./Search";



/**
 * Компонент для отображения чата
 * 
 * @param {number} chatId - идентификатор чата
 * @param {object} chat - объект с информацией о чате
 * @param {boolean} showBackButton - true если нужно отображать кнопку назад
 * @param {function} setBackButtonReaction - функция для обновления состояния кнопки назад
 * 
 * @returns {React.Component} - компонент для отображения чата
 */
export default function ChatArea({chatId,chat,showBackButton,setBackButtonReaction}) {

    const [messagelist, setMessagelist] = useState([]);
    const{me,MessageApi} = useAuth();
    const [loading, setLoading] = useState(true);
    const [isSerch, setIsSerch] = useState(false);


    const [showMessageMenu, setShowMessageMenu] = useState(false);
    const [messageMenuId, setMessageMenuId] = useState(null);
    useEffect(() => {
        if(!chat){
            setLoading(true)
        }

        else 
            setLoading(false);
        
    }, [chat,loading]);


    useEffect(() => {
        setMessagelist([]);
        MessageApi().getList(chatId).then((res) => setMessagelist(res));
    },[chatId])


    
    function GetListForSearch(){
        let list = [];

        messagelist.map(item => list.push({name:item.content,user:item.user.username}));

        return list;
    }

    
/**
 * функция аватра чата
 * если есть изображение, то отображает ее
 * если нет, то отображает имя чата
 * @return {ReactNode} отображение чата
 */
    function Avatar(){
        if (chat.img){
            return <img src={chat.img} />
        }
        else{
            return <div><h2>{chat.name.charAt(0).toUpperCase()+chat.name.charAt(chat.name.length-1).toLowerCase()}</h2></div>
        }
    }
    

/**
 * функция отображения аватара пользователя
 * если есть изображение, то отображает ее
 * если нет, то отображает имя пользователя
 * @param {object} user - объект с информацией о пользователе
 * @return {ReactNode} отображение аватара пользователя
 */ 
    function UserAvatar(user){
        if (user.img){
            return <img src={user.img} />
        }
        else{
            return <div><p>{user.username.charAt(0).toUpperCase()+user.username.charAt(user.username.length-1).toLowerCase()}</p></div>
        }
    }

    return (
        
        <div className="current-chat-wrapper">
            <div className="sidebar-overlay" id="sidebarOverlay"></div>
            <div className="chat-area">

                {loading ? (
                    <h1>LOAD</h1>
                ):
                <>
                
                 <div class="chat-header-area" style={{gap:'10px'}}>
                    
                <div class="chat-user-info">
                    {showBackButton && <div class="back-button" onClick={() =>(setBackButtonReaction(true))}><i class="fas fa-arrow-left"></i></div>}
                    <div className="chat-user-avatar">{Avatar()}</div>
                    <div>
                        <div className="chat-user-name">{chat.name}</div>
                        {/* <div class="chat-user-status">online</div> */}
                    </div>
                </div>
                {isSerch && <Search chatlist={GetListForSearch()}/>}
                <div className="chat-actions">
                    <button onClick={()=>setIsSerch(!isSerch)} className="icon-btn"> {isSerch ? <i className="fa-solid fa-xmark"></i>:<i className="fas fa-search"></i>} </button>
                    
                    <button className="icon-btn btn btn-danger"><i className="fas fa-ellipsis-v"></i></button>
                </div>
                
            </div>

            
            <div className="messages-container">
                
                {messagelist.map((item)=>{

                    return(
                         
                        <div key={item.id} className={'message'+(item.user.id === me.id ? " sent" : " received")}
                        style={{position:'relative'}}
                        onContextMenu={(e) =>{e.preventDefault();if(e.button == 2) {setShowMessageMenu(true); setMessageMenuId(item.id)}}}
                        >
                            {item.user.id === me.id && messageMenuId === item.id
                            &&
                            <MessageMenu  message={item} showMenu={showMessageMenu} setShowMenu={setShowMessageMenu} OnDelete={()=>{setMessagelist(messagelist.filter((item) => item.id !== messageMenuId))}} />
                            }
                            <div className="message-avatar">{UserAvatar(item.user)}</div>
                            <div className="message-content">
                                <div className="message-text">{item.content}</div>
                                <div className="message-time">{item.created_at.slice(11,16)} <span style={{color:'red'}}>{item.is_edited ? "ed":""}</span></div>
                                
                            </div>
                            
                        </div>
                        
                    )

                })}
                
                
            </div>
                </>}
            
            {/* <!-- Поле ввода сообщения --> */}
            <MessageInputArea setlist={setMessagelist} chatid={chatId} />
            </div>
        </div>
    );
}
