
import { 
  createContext, useState, useEffect, useContext, useRef
} from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";
const context = createContext({});

export default function AuthContext({ children }) {



  // Оголошення змінних/хуків

  const [{JWTaccessToken,JWTrefreshToken}, setToken] = useState({
    JWTaccessToken:localStorage.getItem('access'),
    JWTrefreshToken:localStorage.getItem('refresh')
  });

  const navigate = useNavigate();

  const [userid, setUserid] = useState(1);
  const [me, setMe] = useState({});

  const [langChoiceList, setLangChoiceList] = useState([]);
  
  const [local, setLocal] = useState({});

  //theme true is dark false is light
  const [settingparams, setSettingparams] = useState({user:1,language:"en",theme:false});

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [chatList, setChatList] = useState([
  //             {img:"https://randomuser.me/api/portraits/men/41.jpg",
  //             lastMessage:"Hello",
  //             name:"John",
  //             userId:1},
  //             {img:"https://randomuser.me/api/portraits/men/6.jpg",
  //             lastMessage:"eshkere",
  //             name:"Jecky",
  //             userId:2},
  //     ]);
  const [chatList, setChatList] = useState([]);
  
  
  const SETTINGSURL = `http://127.0.0.1:8000/api/settings/${userid}/`;
  const BASEAPI ="http://127.0.0.1:8000/api/"
  const BASE_WS_URL = `ws://127.0.0.1:8000/` 

  // Кінець оголошення змінних/хуків



  // Функції

  async function getSettings (url = SETTINGSURL) {
    const res = await axios.get(url);
    return res.data;
  }

  async function putSettings (url = SETTINGSURL) {
    const res = await axios.put(url, settingparams);
    console.log(res.data);
    return res.data;
  }

  function UserApi(URL =`${BASEAPI}users/`){
    const api = axios.create({
      baseURL: URL,
      headers: {
        Authorization: `Bearer ${JWTaccessToken}`,
      }
    })

    return{
      getList: async () => api.get('').then((res) => res.data),
      get: async (id) => api.get(`${id}`).then((res) => res.data),
      getMe: async () => api.get('me/').then((res) => res.data),
      register: async (data) => api.post('register/', data).then((res) => res.data),
      token: async ({username, password}) => (await api.post('token/', {username, password})).data,
      tokenRefresh: async () => api.post('token/refresh/', {refresh: JWTrefreshToken}).then((res) => res.data),
      tokenVerify: async () => api.post('token/verify/', {token: JWTaccessToken}).then((res) => res.data),

    }
  }

  function ChatApi(URL =`${BASEAPI}chat/`){
    const api = axios.create({
      baseURL: URL,
      headers: {
        Authorization: `Bearer ${JWTaccessToken}`,
      }

    })

    return{
      getList: async () => api.get('').then((res) => res.data),
      get: async (id) => api.get(`${id}/`).then((res) => res.data),
      post: async (data) => api.post('', data).then((res) => res.data),

      //сейчас пута нету, так как другая система создания
      // put: async (id, data) => api.put(`${id}/`, data).then((res) => res.data),
      delete: async (id) => api.delete(`${id}/`).then((res) => res.data),
    }
  }

  function MessageApi(URL =`${BASEAPI}chat/message/`){
    const api = axios.create({
      baseURL: URL,
      headers: {
        Authorization: `Bearer ${JWTaccessToken}`,
      }

    })

    return{
      getList: async (chatid) => api.get('?chat='+chatid+'').then((res) => res.data),
      get: async (id) => api.get(`${id}/`).then((res) => res.data),
      // put: async (id, data) => api.put(`${id}/`, data).then((res) => res.data),
      // delete: async (id) => api.delete(`${id}/`).then((res) => res.data),
    }
  }

  async function GetChatList() {
    console.log('GetChatList');
    const me = await UserApi().getMe();
        setMe(me);
        setUserid(me.id);
        console.log('me',me);
        
        
        const chat = await ChatApi().getList();

        const finalchat = await Promise.all(
          chat.map(async (item) =>
          {
            const users = item.users;
            const anotherUserid = users.find((u) => u != me.id)
            const anotherUser = await UserApi().get(anotherUserid)
            console.log('anotherUser',anotherUser)
            return {...item, active:false,name: anotherUser.username}
          })
        );
        setChatList(finalchat)

        console.log('finalchat',finalchat);
  }


  //первоначальная загрузка
  useEffect(() => {
    console.log('AuthProvider useEffect START');
    try {
      getSettings().then((res) => {
        setLangChoiceList(res.language_choices);
        setLocal(res.locale);
        setSettingparams({user:res.user,language:res.language,theme:res.theme});
      });
      (async()=>
      {
        let access  = localStorage.getItem('access');
        let refresh = localStorage.getItem('refresh');
        
        // Перевірка на дійсність та наявність JWT
        if (
          (!access || access === 'null' || access === 'undefined') || 
          (!refresh || refresh === 'null' || refresh === 'undefined')
        ){
          console.log("JWT Token inalid or abscent!");
          // Перенаправлення на авторизацію
          navigate('/authorization');
          setIsAuthenticated(false);

          // // временно 
          // const t = await UserApi().token({ username: "maskerrr", password: "Admin_123" });

          // access = t.access; refresh = t.refresh;
          // localStorage.setItem("access", access);
          // localStorage.setItem("refresh", refresh);
          // setToken({JWTaccessToken: access,JWTrefreshToken: refresh,});
        }
        else{
          try{
            await  UserApi().tokenVerify()
          }
          // проверка на действительность токена, если нет то выдает 401 и срабатывает catch
          catch{
            try{
              const newtoken = await UserApi().tokenRefresh();
            
              setToken({JWTrefreshToken,JWTaccessToken:newtoken});
              localStorage.setItem("access", newtoken.access);
            }
            // проверка на действительность токена, если нет то выдает 401 и срабатывает catch
            catch{
              isAuthenticated(false);
              navigate('/authorization');
            }
            
          }
          await GetChatList();
        }
        console.log('token',access);
      })();
      
    }
    catch (error) {
      console.warn("возможно не активен сервер", error);
    }
  
  }, []);

//первоначальная загрузка, загрузка чатов, когда был проверен токен
  useEffect(() => {
    (async () => {
      GetChatList();
    })();
    
  },[JWTaccessToken]);


  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    putSettings();
  }, [settingparams]);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', settingparams.theme ? "dark" : "light");
  }, [settingparams.theme]);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(auth);
  }, []);

  const login = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
   
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  // Закінчення функцій



  // Готування даних для передачі у контекст

  const value = {
    isAuthenticated,
    setIsAuthenticated, 
    login,
    logout,

    userid,
    me,
    
    chatList,
    setChatList,
    langChoiceList,
    setLangChoiceList,
    
    local,
    settingparams,
    setSettingparams,
    BASEAPI,
    BASE_WS_URL,
    JWTaccessToken,
    setToken,

    UserApi,
    ChatApi,
    MessageApi,

    JWTaccessToken,
    JWTrefreshToken,
    setToken
  }

  // Кінець готування об'єкту



  // Повернення готового провайдера

  return (
    <context.Provider value={value}>
      {children}
    </context.Provider>
  );
}


export const useAuth = () => useContext(context);