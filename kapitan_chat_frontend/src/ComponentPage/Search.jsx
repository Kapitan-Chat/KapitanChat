import { useEffect,useState } from "react";
import ChatList from "./ChatList";

import search_icon from "../assets/search_icon.png";

/**
 * Компонент для поиска чатов
 * @param {object} props - Параметры компонента
 * @param {array} props.chatList - Список чатов
 * @returns {jsx} - Компонент для поиска чатов
 */
export default function Search({chatList}) {

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    

    function searching(){
        if (search.length <2) return []

        let result =  chatList.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
        
        return result;
    }

    useEffect(() => {
        setSearchResult(searching());

        console.log('chatList',chatList)
    }, [search]);

    console.log(searchResult);
    return (
        <div className="search-container">
        
        <input  type="text" className="sidebar-top-search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        <img type="button" className="search-icon" src={search_icon} />
        
        {
            searchResult.length > 0 &&
                (
                    <div 
                        style={{
                            position: "absolute",
                            top: "calc(100% + 6px)",
                            left: 0,
                            right: 0,                 // ширина равна поиску
                            background: "#cac8c8ff",
                            border: "1px solid #333",
                            borderRadius: 8,
                            maxHeight: 460,
                            overflow: "auto",
                            zIndex: 1000,
                            padding: 8,
                            alignItems: "center",
                        }}
                    >
                        
                        <ChatList chatList={searchResult}/>
                    </div>
                )
            
        }
        
        </div>
    );
}