import { Fragment, useEffect, useState } from "react"
import { Users } from "./Users"
import axios from "axios";
import { useNavigate } from "react-router";
import { TypeAnimation } from 'react-type-animation';


const url = import.meta.env.VITE_API_URL;
const endpoint = new URL('account/balance', url).toString();

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
                const response = await axios.get(endpoint, {
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
                localStorage.removeItem('token');
                navigate('/signup')
            }  
        }
        getResponse();

    }, [])

    if(!balance) {
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
        <Fragment>
                <div className="h-screen overflow-x-hidden overflow-y-auto">
                    <nav className="flex w-full items-center border-slate-400 bg-white justify-between p-1 sm:p-4 ">
                        <TypeAnimation
                            sequence={[
                                '',
                                5,
                                'Transaction App',
                                1000,
                            ]}
                            wrapper="span"
                            speed={30}
                            repeat={Infinity}
                            preRenderFirstString={false}
                            className="font-semibold truncate sm:font-extrabold text-sm sm:text-2xl"
                        />
                        <div className="flex items-center justify-center">
                        <div className="mx-2 h-fit  w-fit px-1 sm:px-3 py-[0.5] sm:py-1 font-semibold text-center items-center text-base sm:text-xl rounded-full bg-slate-300"> {user.charAt(0).toUpperCase()} </div>
                        <span className="font-medium truncate text-xs sm:text-base">
                                Hello, {user}
                        </span>
                        <button onClick={() => ClearToken()} className="font-semibold hover:cursor-pointer px-1 sm:px-2 items-center">
                            <div className="p-1 sm:p-2 hover:bg-blue-700 rounded-full hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="font-extrabold size-4 sm:size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                                </svg>
                            </div>
                        </button>
                        </div>
                        
                    </nav>
                    <div className="bg-white h-fit w-full justify-start">
                        <div className="font-bold text-base pb-1 pt-2 p-1 sm:p-4 sm:text-xl">
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