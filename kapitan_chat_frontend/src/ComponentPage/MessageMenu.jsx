import { useState,useRef,useEffect } from "react"
import { useAuth } from "../Provider/AuthProvider"
export default function MessageMenu({message,showMenu,setShowMenu,OnDelete}) {

    const menuRef = useRef(null);
    const {wsRef,setEditMessage,setIsEdit} = useAuth();


   function deleteHandler(e){
    const ws = wsRef.current;
    ws.send(JSON.stringify(
        {type:"message_delete",data:{
            id:message.id
        }}))
    OnDelete();
   }
   function editHandler(e){
    setEditMessage(message);
    setIsEdit(true);
    console.log('edit',message.id);
   }

   useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [showMenu]);
    
    return(
        <div>
            

            {showMenu && (
                <>
                <div ref={menuRef} style={
                    {
                        position:"absolute",
                        right:106,
                        bottom:26,
                        zIndex:10000,
                        width:'140px',
                        display:'flex',
                        gap:'10px',
                        justifyContent:'flex-end'
                    }
                }>
                    <button onClick={deleteHandler} className="deletebutton">Delete</button>
                    <button onClick={editHandler} className="editbutton">Edit</button>
                </div>
                </>
            )}
        </div>
    )
}