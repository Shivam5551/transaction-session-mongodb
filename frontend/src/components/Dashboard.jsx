import { Fragment, useEffect, useState } from "react"
import { Users } from "./Users"
import axios from "axios";
import { useNavigate } from "react-router";
import { TypeAnimation } from 'react-type-animation';

export const Dashboard = ()=> {
    const [userID, setUserID] = useState('');
    const [user, setUser] = useState('');
    const [balance, setBalance] = useState('');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    if(!token) {
        navigate('/signup');
    }
    
    const ClearToken = ()=> {
        localStorage.removeItem('token');
        navigate('/signin')
    }

    useEffect(()=> {
        const getResponse = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/account/balance', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const username = response.data.user;
                const userId = response.data.userID;
                const userBalance = response.data.balance;
                if(username && userBalance && userId) {
                    setUserID(userId);
                    setUser(username);
                    setBalance(userBalance);
                }
            } catch (error) {
                setUser('Error');
                setBalance('Cannot fetch your balance try to relogin');
                navigate('/signup')
            }  
        }
        getResponse();

    }, [])

    return (
        <Fragment>
                <div className="h-screen overflow-x-hiddenoverflow-y-auto">
                    <nav className="flex w-full border-b-2 border-slate-400 bg-white justify-between p-4 ">
                        <TypeAnimation
                            sequence={[
                                '',
                                5,
                                'Welcome to Transaction App',
                                1000,
                            ]}
                            wrapper="span"
                            speed={30}
                            repeat={Infinity}
                            preRenderFirstString={false}
                            className="font-extrabold text-2xl"
                        />
                        <div className="flex items-center justify-center">
                        <div className="mx-2 h-fit  w-fit px-3 py-1 font-semibold text-center items-center text-xl rounded-full bg-slate-300"> {user.charAt(0).toUpperCase()} </div>
                        <span className="font-medium">
                                Hello, {user}
                        </span>
                        <button onClick={() => ClearToken()} className="font-semibold hover:cursor-pointer px-2 items-center">
                            <div className="p-2 hover:bg-blue-700 rounded-full hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="font-extrabold size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                                </svg>
                            </div>
                        </button>
                        </div>
                        
                    </nav>
                    <div className="bg-white h-fit w-full p-4 justify-start">
                        <div className="font-bold text-xl">
                            Your Balance: ${balance}
                        </div>
                        <div>
                            <Users userID={userID}/>
                        </div>
                    </div>
                </div>
        </Fragment>
    )
}