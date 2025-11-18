import { Outlet, Route, Routes } from "react-router-dom";
import Main from "./Main/Main";
import NotFound from "./ComponentPage/NotFound";

import "./mainstyle.css";
import AuthProvider from "./Provider/AuthProvider";
import AvatarUpload from "./ComponentPage/AvatarUpload";
import Authentication from "./login-register/authentication"

function App() {
  
  return (
    <AuthProvider> 
      <Routes>
   
        <Route index element={<Main></Main>}></Route>
        <Route path="main" element={<><Main /></>}></Route>
        <Route path="login" element={<><Authentication /></>}></Route>
        <Route path="avatar" element={<><AvatarUpload /></>}></Route>
        <Route path="*" element={<><NotFound/></>} />
      
      </Routes>
   
      <Outlet />
    </AuthProvider>
  );
}

export default App;