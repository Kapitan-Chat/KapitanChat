
import ChatList from '../ComponentPage/ChatList';
import Search from '../ComponentPage/Search';
import ChatArea from '../ComponentPage/ChatArea';
import SettingsList from '../ComponentPage/SettingsComp/SettingsList';
import  {useAuth}  from '../Provider/AuthProvider';
import { useState,useEffect,useMemo } from 'react';
import {useNavigate} from 'react-router-dom';

import {Panel,PanelGroup,PanelResizeHandle} from 'react-resizable-panels';
export default function Main() {
  // const isAuthenticated = localStorage.getItem("isAuthenticated");

  let {chatList,setChatList,isAuthenticated} = useAuth();
  const navigate = useNavigate();
  if(!isAuthenticated) navigate("/authorization");
  
  
  const [show, setShow] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [cntrchatId, setCntrchatId] = useState(null);
  const [chat, setChat] = useState(null);
  const [secondchat, setSecondChat] = useState(null);

  
  
  useEffect(() => {
    console.log('chatId',chatId);
    setChatList((chatList) => chatList.map((chat) => ({ ...chat, active: chat.id === chatId })));
    setChat(chatList.find((chat) => chat.id === chatId));
    console.log('chat',chatList);
  }, [chatId]);

  useEffect(() => {
    console.log('cntrchatId',cntrchatId);
    setChatList((chatList) => chatList.map((chat) => ({ ...chat, active: chat.id === cntrchatId })));
    setSecondChat(chatList.find((chat) => chat.id === cntrchatId));
    console.log('chat',chatList);
  }, [cntrchatId]);



  function handlerChatOpen(){
    if(!chatId && !cntrchatId){
      return ;
    }
    else if(!chatId || !cntrchatId){

      const cId = chatId ? chatId : cntrchatId;
      const c = chatId ? chat : secondchat;
      return(
        <>
        <ChatArea chatId={cId} chat={c} />
        </>
      );
    }
    else if(chatId && cntrchatId){
      return(
        <>
        <PanelGroup direction='horizontal'>
          <Panel defaultSize={30} minSize={35}>
            <ChatArea chatId={chatId} chat={chat}/>
          </Panel>
          <PanelResizeHandle   className="resize-handle"/>
          <Panel defaultSize={30} minSize={35}>
            <ChatArea chatId={cntrchatId} chat={secondchat}/>
          </Panel>
        </PanelGroup>
        </>
      );
    }
  }
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
          <button onClick={()=>(setChatId(null))}>chat1</button>
          <button onClick={()=>(setCntrchatId(null))}>chat2</button>
          
          <Search chatList={chatList} />
        </div>
        <ChatList  chatList={chatList} setChatId={setChatId} setSecondChatId={setCntrchatId} />
      </section>
      {/* содержимое чата click */}
      <section className='current-chat'>
        
        {handlerChatOpen()}
        
      </section>
      
    </div>

    
  );
}
