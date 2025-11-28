
import ChatList from '../ComponentPage/ChatList';
import Search from '../ComponentPage/Search';
import ChatArea from '../ComponentPage/ChatArea';
import SettingsList from '../ComponentPage/SettingsComp/SettingsList';
import Create from './Create';

import  {useAuth}  from '../Provider/AuthProvider';
import { useState,useEffect,useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {Panel,PanelGroup,PanelResizeHandle} from 'react-resizable-panels';

export default function Main() {
  // const isAuthenticated = localStorage.getItem("isAuthenticated");

 
  const { 
    chatList, 
    setChatList, 
    isAuthenticated, 
    chatId, 
    setChatId, 
    userSearchActive 
  } = useAuth();

  const navigate = useNavigate();
  if(!isAuthenticated) navigate("/authorization");

  const [show, setShow] = useState(false);
  const [chat, setChat] = useState(null);

  const [cntrchatId, setCntrchatId] = useState(null);
  const [secondchat, setSecondChat] = useState(null);

  const [isGroupActive, setIsGroupActive] = useState();
  const [isChannelActive, setIsChannelActive] = useState();

  const [showMenu, setShowMenu] = useState(false);

  //Хуки для анімацій
  const [sidebarTopTranslate, setSidebarTopTranslate] = useState('-40px');
  const [sidebarTopOpacity, setSidebarTopOpacity] = useState(0);


  const [showBackButton, setShowBackButton] = useState(false);
  
  useEffect(() => {
    setTimeout(() => {
      setSidebarTopOpacity(1);
      setSidebarTopTranslate('0');
    }, 1250)
  }, []);

  useEffect(() => {
    console.log('chatId',chatId);
    setShowMenu(!showMenu);
    setChatList((chatList) => chatList.map((chat) => ({ ...chat, active: chat.id === chatId })));
    setChat(chatList.find((chat) => chat.id === chatId));
    
    console.log('chatList', chatList);
    console.log('chat',chat);
  }, [chatId]);

  useEffect(() => {
    console.log('cntrchatId',cntrchatId);
    setChatList((chatList) => chatList.map((chat) => ({ ...chat, active: chat.id === cntrchatId })));
    setSecondChat(chatList.find((chat) => chat.id === cntrchatId));
    console.log('chat',chatList);
  }, [cntrchatId]);


  useEffect(() => {
    console.log('showMenu',showMenu);
  }, [showMenu]);



  function handlerChatOpen(){
    if(!chatId && !cntrchatId){
      return ;
    }
    else if(!chatId || !cntrchatId){

      const cId = chatId ? chatId : cntrchatId;
      const c = chatId ? chat : secondchat;
      return(
        <>
        <ChatArea chatId={cId} chat={c} showBackButton={showBackButton} setBackButtonReaction={setShowMenu} />
        </>
      );
    }
    else if(chatId && cntrchatId){
      return(
        <>
        <PanelGroup direction='horizontal'>
          <Panel defaultSize={30} minSize={35}>
            <ChatArea chatId={chatId} chat={chat} showBackButton={showBackButton} setBackButtonReaction={setShowMenu}/>
          </Panel>
          <PanelResizeHandle   className="resize-handle"/>
          <Panel defaultSize={30} minSize={35}>
            <ChatArea chatId={cntrchatId} chat={secondchat} showBackButton={showBackButton} setBackButtonReaction={setShowMenu}/>
          </Panel>
        </PanelGroup>
        </>
      );
    }
  }


  function handlerChatOpen(){
    if(!chatId && !cntrchatId){
      return ;
    }
    else if(!chatId || !cntrchatId){

      const cId = chatId ? chatId : cntrchatId;
      const c = chatId ? chat : secondchat;
      return(
        <>
        <ChatArea chatId={cId} chat={c} showBackButton={showBackButton} setBackButtonReaction={setShowMenu} />
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
    <div className="app-container" style={appcontstyle} >

      {/* боковое меню с переченью чатов и кнопка настроек и поиск  */}
      <section  className="chat-list-sidebar" style={chatSectionStyle} >
        <div 
          className='sidebar-top'
          style={{
            transform: `translateY(${sidebarTopTranslate})`,
            opacity: sidebarTopOpacity
          }}
        >
          <SettingsList isShow={show} setShow={setShow} >
              
          </SettingsList>
          
          <button 
            className='sidebar-top-avatar' 
            onClick={() => setShow(!show)}
          >
            <img src={"https://randomuser.me/api/portraits/men/41.jpg"} alt="profile photo" decoding='async' />
          </button>
          {/* <button onClick={()=>(setChatId(null))}>chat1</button>
          <button onClick={()=>(setCntrchatId(null))}>chat2</button> */}
          
          <Search isUserSearch={true} />
        </div>
        { (!userSearchActive) && <ChatList  chatList={chatList} setChatId={setChatId} setSecondChatId={setCntrchatId}/> }

        <div className='group-channel-buttons'>
          <button
            onClick={() => setIsGroupActive(true)}
          >Create Group</button>
          <button
            onClick={() => setIsChannelActive(true)}
          >Create Channel</button>
        </div>
      </section>

      {!showMenu && <>

      {/* содержимое чата click */}
      <section className='current-chat'>
        
        {
          (chatId) ? (
            handlerChatOpen()
          ) : (
            <div className="empty-chat" >Please, select or start a chat</div>
          )
        }
        
      </section>

      {
        (isGroupActive) && <Create groupType={"GROUP"} setActive={setIsGroupActive}/>
      }
      {
        (isChannelActive) && <Create groupType={"CHANNEL"} setActive={setIsChannelActive}/>
      }
      </>
      };
    </div>
    

    
  );
}
