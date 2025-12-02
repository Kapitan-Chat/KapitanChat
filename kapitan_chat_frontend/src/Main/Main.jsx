
import ChatList from '../ComponentPage/ChatList';
import Search from '../ComponentPage/Search';
import ChatArea from '../ComponentPage/ChatArea';
import SettingsList from '../ComponentPage/SettingsComp/SettingsList';
import  {useAuth}  from '../Provider/AuthProvider';
import { useState,useEffect,useMemo,useRef } from 'react';
import ProfileSettingsWindow from '../ComponentPage/SettingsComp/profileSettingsWindow';
import Create from './Create';

import { useNavigate } from 'react-router-dom';
import {Panel,PanelGroup,PanelResizeHandle} from 'react-resizable-panels';

export default function Main() {
  // const isAuthenticated = localStorage.getItem("isAuthenticated");

  
  let { 
    chatList, 
    setChatList, 
    isAuthenticated, 
    chatId, 
    setChatId,
    secondchatId, 
    setSecondChatId,
    
    userSearchActive 
  } = useAuth();

  const navigate = useNavigate();
  if(!isAuthenticated) navigate("/authorization");
  
  const [showMenu, setShowMenu] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);

  const [show, setShow] = useState(false);
  const [chat, setChat] = useState(null);

  const [secondchat, setSecondChat] = useState(null);

  const widthref = useRef(null);
  
  useEffect(() => {
    function handleResize() {
      if (widthref.current.offsetWidth <= 768) {
      setShowBackButton(true);
    }
    else{
      setShowBackButton(false);
    }
    }
    handleResize();
    window.addEventListener('resize',handleResize)
    return () => window.removeEventListener('resize',handleResize)
    
  },[])

  const [isGroupActive, setIsGroupActive] = useState();
  const [isChannelActive, setIsChannelActive] = useState();

  //Хуки для анімацій
  const [sidebarTopTranslate, setSidebarTopTranslate] = useState('-40px');
  const [sidebarTopOpacity, setSidebarTopOpacity] = useState(0);
  
  useEffect(() => {
    setTimeout(() => {
      setSidebarTopOpacity(1);
      setSidebarTopTranslate('0');
    }, 1250)
  }, []);

  useEffect(() => {
    console.log('chatId',chatId);
    setChatList((chatList) => chatList.map((chat) => ({ ...chat, active: chat.id === chatId })));
    setShowMenu(false);
    setChat(chatList.find((chat) => chat.id === chatId));
    
    console.log('chatList', chatList);
    console.log('chat',chat);
  }, [chatId]);

  useEffect(() => {
    console.log('cntrchatId',secondchatId);
    setShowMenu(false);
    setChatList((chatList) => chatList.map((chat) => ({ ...chat, active: chat.id === secondchatId })));
    setSecondChat(chatList.find((chat) => chat.id === secondchatId));
    console.log('chat',chatList);
  }, [secondchatId]);

  useEffect(() => {
    if(!chatId && secondchatId){
      setChatId(secondchatId);
      setSecondChatId(null);
    }
  }, [chatId,secondchatId]);

  useEffect( () =>{
    console.log("showmenu",showMenu)
  },[showMenu])



  function handlerChatOpen(){
    if(!chatId && !secondchatId){
      return ;
    }
    else if(!chatId || !secondchatId){

      const cId = chatId ? chatId : secondchatId;
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
        {widthref.current.offsetWidth <= 768 
        ? <ChatArea chatId={chatId} chat={chat} showBackButton={showBackButton} setBackButtonReaction={setShowMenu} /> : 
        <PanelGroup direction='horizontal'>
          <Panel defaultSize={30} minSize={35}>
            <ChatArea chatId={chatId} chat={chat}/>
          </Panel>
          <PanelResizeHandle   className="resize-handle"/>
          <Panel defaultSize={30} minSize={35}>
            <ChatArea chatId={secondchatId} chat={secondchat}/>
          </Panel>
        </PanelGroup>
        }
        </>
      );
    }
  }


  const chatSectionStyle = useMemo(() => ({
    display:'flex',gap:"10px",flexDirection:'column'
  }),[])

  const appcontstyle = useMemo(() => ({ padding: "20px", display: "flex",gap:"30px" }),[])
 
  return (
    <div className="app-container" style={appcontstyle} ref={widthref}>

      {/* боковое меню с переченью чатов и кнопка настроек и поиск  */}
      <section  className={"chat-list-sidebar" +  (showMenu ? "active" : "") } style={chatSectionStyle} >
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

          
          <Search isUserSearch={true} />
        </div>
        { (!userSearchActive && !show) && <ChatList  chatList={chatList} setChatId={setChatId} setSecondChatId={setSecondChatId} setShowMenu={setShowMenu}  /> }

        <div className='group-channel-buttons'>
          <button
            onClick={() => setIsGroupActive(true)}
          >Create Group</button>
          <button
            onClick={() => setIsChannelActive(true)}
          >Create Channel</button>#

          {/*кнопки выключения чата */}
          {/* <button onClick={()=>(setChatId(null))}>chat1 is {chatId}</button>
          <button onClick={()=>(setCntrchatId(null))}>chat2 is {cntrchatId}</button> */}
          
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
      </>}
      
      
    

      <ProfileSettingsWindow />

      {
        (isGroupActive) && <Create groupType={"GROUP"} setActive={setIsGroupActive}/>
      }
      {
        (isChannelActive) && <Create groupType={"CHANNEL"} setActive={setIsChannelActive}/>
      }
    </div>
  );
}
