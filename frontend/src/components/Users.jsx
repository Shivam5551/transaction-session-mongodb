import { useEffect, useState } from "react"
import axios from "axios";
import { InputBox } from "./InputBox";
import { useNavigate } from "react-router";
import { TypeAnimation } from 'react-type-animation';


const Mainurl = import.meta.env.VITE_API_URL;
const endpoint = new URL('user/bulk', Mainurl).toString();

export const Users = ({ userID })=> {
    const [filter, setFilter] = useState('');
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const clickHandler = (user) => {
        console.log("clicked");
        navigate('/send', { state: user})
    };

    useEffect(()=> {

        const getUser = async () => {
            try {
                let url = endpoint
                if(filter) {
                    url += `?filter=${filter.trim()}`;
                }
                const response = await axios.get(url);
                if(!response) {
                    setUsers({
                        firstName: "Backend Not responding"
                    });
                }
                else {
                    setUsers(response.data.user);
                }
            }catch(e) {
                console.log(e);
            }
        }

        const interval = setTimeout(() => {
            getUser();
        }, 500);

        return () => clearTimeout(interval)
    }, [filter]);

    if(!users) {
        return (
            <div className="flex h-screen w-full justify-center items-center bg-slate-200">
                <div className="h-5 w-5 m-2 animate-spin rounded-full border-t-2 border-b-2  border-red-400">
                </div>
                <TypeAnimation
                    sequence={[
                        '',
                        5,
                        'Loading...',
                        1000,
                    ]}
                    wrapper="span"
                    speed={30}
                    repeat={Infinity}
                    preRenderFirstString={false}
                    className="font-extrabold text-2xl"
                />
            </div>
        )    
    }
    
    return (
        <div>
            <InputBox placeholder={"Search User"} id={"searchUser"} label={"Users"} onChange={(e) => setFilter(e.target.value)}/>
            <div>
                {users.map((user, index) => {
                    if(user.userId === userID) {
                        return;
                    }
                    return (
                        <div key={index} className="flex justify-between py-2 my-2">
                            <div className="flex items-center">
                                <div className="mx-2 h-fit  w-fit px-3 py-1 font-semibold text-center items-center text-2xl rounded-full bg-slate-300"> {user.firstName.charAt(0).toUpperCase()} </div>
                                <div className="font-semibold text-2xl">{user.firstName}</div>
                            </div>
                            <div className="w-2/12">
                                <button className="p-2 rounded-xl font-medium text-center text-white bg-black hover:text-black hover:bg-slate-300" onClick={() => clickHandler(user)}>Send Money</button> 
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}