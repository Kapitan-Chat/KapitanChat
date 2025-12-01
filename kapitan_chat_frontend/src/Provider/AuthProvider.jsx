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

  const [chatId, setChatId] = useState(null);

  const [userSearchActive, setUserSearchActive] = useState(false); 
  const [messageSearchActive, setMessageSearchActive] = useState(false); 
  const [groupchatUserSearchActive, setGroupchatUserSearchActive] = useState(false); 

  const [profileSettingsShow, setProfileSettingsShow] = useState(false);

  const [addGroupUsers, setAddGroupUsers] = useState([]);

  const [langChoiceList, setLangChoiceList] = useState([]);
  
  const [local, setLocal] = useState({});

  //theme true is dark false is light
  const [settingparams, setSettingparams] = useState({user:null,language:"en",theme:false});

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
  
  
  const BASEAPI ="http://127.0.0.1:8000/api/"
  const BASE_WS_URL = `ws://127.0.0.1:8000/` 
  const BASE_FMS_URL = 'http://localhost:8001/api/file/'

  // Кінець оголошення змінних/хуків



  // Функції

  function SettingsApi(URL =`${BASEAPI}settings/`){
    const api = axios.create({
      baseURL: URL,
      headers: {
        Authorization: `Bearer ${JWTaccessToken}`,
      }
    })
    return{
    get: async (id) => api.get(`${id}/`).then((res) => res.data),
    put: async (id, data) => api.put(`${id}/`, data).then((res) => res.data),
    post: async (data) => api.post('', data).then((res) => res.data),
  }
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
      profilePUT: async (data) => api.put(`profile/${me.id}`, data).then((res) => res.data),
      profilePATCH: async (data) => api.patch(`profile/${me.id}`, data).then((res) => res.data),
      token: async ({username, password}) => (await api.post('token/', {username, password})).data,
      tokenRefresh: async () => api.post('token/refresh/', {refresh: JWTrefreshToken}).then((res) => res.data),
      tokenVerify: async () => api.post('token/verify/', {token: JWTaccessToken}).then((res) => res.data),
      search: async (name) => api.get(`search/?query=${encodeURIComponent(name)}`).then((res) => res.data)
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
      getList: async () => api.get('?reverse=true').then((res) => res.data),
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

  function FileApi(URL =`api/file`){
    const api = axios.create({
      baseURL: BASE_FMS_URL,
      headers: {
        Authorization: `Bearer ${JWTaccessToken}`,
      }

    })

    return{
      post: async (formData) =>
        api.post('', formData, {
          headers: {
              "Content-Type": "multipart/form-data"
          }
      }).then((res) => res.data),

      get: async (params) => api.get(`/?id=${params.id}`, {
        responseType: 'blob'
      }).then((res) => res.data),
    }
  }

  async function GetChatList() {
    console.log('GetChatList');
    const mee = await UserApi().getMe();
    console.log('mee',mee);
        setMe(mee);
        setUserid(mee.id);
        console.log('me',mee);
        
        SettingsApi().get(mee.id).then((res) => {
          console.log('Settings fetched successfully:', res);
          setSettingparams({user:mee.id, theme:res.theme, language:res.language});
          console.log('res.language_choices',res.language_choices);
          setLangChoiceList([...res.language_choices]);
        })
        .catch((error) => {
          SettingsApi().post({user:mee.id, theme:false, language:'en-US'}).then((res) => {
             setSettingparams({user:mee.id, theme:res.theme, language:res.language});
            setLangChoiceList(...res.language_choices);
          })
          .catch((error) => {
            console.error('Error creating settings:', error);
          });
        });
        const chat = await ChatApi().getList();

        const finalchat = await Promise.all(
          chat.map(async (item) =>
          {
            return {...item, active:false}
          })
        );
        setChatList(finalchat)

        console.log('finalchat',finalchat);
  }

  useEffect(() => {
    console.log('langChoiceList',langChoiceList);
  },[langChoiceList])

  //первоначальная загрузка
  useEffect(() => {
    try {
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
          // navigate('/authorization');

          // временно 
          const t = await UserApi().token({ username: "maskerrr", password: "Admin_123" });

          access = t.access; refresh = t.refresh;
          localStorage.setItem("access", access);
          localStorage.setItem("refresh", refresh);
          setToken({JWTaccessToken: access,JWTrefreshToken: refresh,});
        }
        else{
          try{
            await  UserApi().tokenVerify()
          }
          catch{
            const newtoken = await UserApi().tokenRefresh();
            
            setToken({JWTrefreshToken,JWTaccessToken:newtoken});
            localStorage.setItem("access", newtoken.access);
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
    setLocal(settingparams.local);
    if (first.current) { first.current = false; return; }
    SettingsApi().put(settingparams.id, settingparams);
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
    (async () => {
      mee = await UserApi().getMe();
      let settingParams = {
        user: mee.id,
        language: 'en-US',
        theme: false
      }
      setSettingparams(postSettings(settingParams));
    })
   
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  async function getImageHash(file) {
    const buffer = await file.arrayBuffer();
    const hash = await crypto.subtle.digest("SHA-256", buffer);

    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  }

  async function getImage(image_id) {
    try {
        const blob = await FileApi().get({ id: image_id });

        console.log("Blob:", blob);

        const url = URL.createObjectURL(blob);
        return(url);
    } catch (error) {
        console.error("Image fetch error:", error);
    }
  }

  // Закінчення функцій



  // Готування даних для передачі у контекст

  const value = {
    isAuthenticated,
    setIsAuthenticated, 
    login,
    logout,

    userid,
    me,
    setMe,

    chatId,
    setChatId,

    GetChatList,
    
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
    FileApi,

    JWTaccessToken,
    JWTrefreshToken,

    userSearchActive,
    setUserSearchActive,
    messageSearchActive,
    setMessageSearchActive,
    groupchatUserSearchActive,
    setGroupchatUserSearchActive,

    addGroupUsers,
    setAddGroupUsers,

    getImageHash,
    getImage,

    profileSettingsShow,
    setProfileSettingsShow,

    login,
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