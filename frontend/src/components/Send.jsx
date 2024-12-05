import { Fragment, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router";
import { InputBox } from "./InputBox";
import { WarnButton } from "./WarnButton";
import axios from "axios";

export const Send = ()=> {
    const [receiverID, setReceiverID] = useState('');
    const [amount, setAmount] = useState('')
    const location = useLocation();
    const user = location.state;
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    if(!token) {
        navigate('/signup');
    }

    if(!user) {
        return (
            <div className="flex h-screen w-full justify-center items-center bg-slate-200">
            <WarnButton label={'May Be You are lost Click Here to go to'} to={'/signup'} refer={'Sign Up Page'}/>
        </div>
        )
    }

    useEffect(()=> {
        if(user.userId) {
            setReceiverID(user.userId);
        }
    }, [user])

    const SendMoney = async () => {
        if(amount, receiverID) {
            try {
                const response = await axios.post('http://localhost:3000/api/v1/account/transfer', {
                    amount,
                    receiverID,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if(response.status === 200) {
                    alert(response.data.response);
                }
                if(response.status === 201) {
                    alert("Your Balance is low");
                }
            } catch (error) {
                alert("Network Error")
            }   finally {
                navigate('/dashboard')
            }
        }
    }

    return (
        <Fragment>
           <div className="flex h-screen items-center justify-center bg-slate-300">
                <div className="bg-white  p-6 rounded-2xl">
                    <div className="flex items-center">
                        <div className="mx-2 h-fit  w-fit px-3 py-1 font-semibold text-center items-center text-2xl rounded-full bg-slate-300"> {user.firstName.charAt(0).toUpperCase()} </div>
                        <div className="font-extrabold p-2 overflow-hidden">{user.firstName}</div>
                    </div>
                    <InputBox type={'number'} placeholder={'Enter Amount'} onChange={(e) => setAmount(e.target.value)} label={'Enter Amount'}/>
                    <button onClick={() => SendMoney()} className="mt-2 bg-green-500 w-full text-xl font-semibold p-2 rounded-2xl hover:bg-green-600 hover:text-white" type="submit">Send</button>
                </div>
            </div>
       </Fragment>
    )
}