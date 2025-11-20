
import ChatList from '../ComponentPage/ChatList';
import Search from '../ComponentPage/Search';
import ChatArea from '../ComponentPage/ChatArea';
import SettingsList from '../ComponentPage/SettingsComp/SettingsList';
import  {useAuth}  from '../Provider/AuthProvider';
import { useState,useEffect,useMemo } from 'react';

export default function Main() {
  // const isAuthenticated = localStorage.getItem("isAuthenticated");

  
  let {chatList,setChatList} = useAuth();
  const [show, setShow] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [chat, setChat] = useState(null);

  
  
  useEffect(() => {
    console.log('chatId',chatId);
    setChatList((chatList) => chatList.map((chat) => ({ ...chat, active: chat.id === chatId })));
    setChat(chatList.find((chat) => chat.id === chatId));
    console.log('chat',chatList);
  }, [chatId]);


  const chatSectionStyle = useMemo(() => ({
    display:'flex',gap:"10px",flexDirection:'column'
  }),[])

  const appcontstyle = useMemo(() => ({ padding: "20px", display: "flex",gap:"30px" }),[])
 
  return (
    <div className="app-container" style={appcontstyle}>

      {/* боковое меню с переченью чатов и кнопка настроек и поиск  */}
      <section  className="chat-list-sidebar" style={chatSectionStyle} >
        <div className='sidebar-top'>
          <SettingsList isShow={show} setShow={setShow} >
              
          </SettingsList>
          
          <button 
            className='sidebar-top-avatar' 
            onClick={() => setShow(!show)}
          >
            <img src={"https://randomuser.me/api/portraits/men/41.jpg"} alt="profile photo" decoding='async' />
          </button>
          
          <Search chatList={chatList} />
        </div>
        <ChatList  chatList={chatList} setChatId={setChatId}/>
      </section>
      {/* содержимое чата */}
      <section className='current-chat'>
        
        {chatId ?
        <ChatArea chatId={chatId} chat={chat}/>:

        <div className="empty-chat" >Please, select or start a chat</div>
        }
        
      </section>
    </div>
  );
}
