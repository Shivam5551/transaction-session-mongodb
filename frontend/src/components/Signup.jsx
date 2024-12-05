import { Fragment, useEffect, useState } from "react";
import { default as axios } from 'axios';
import { useNavigate } from 'react-router'
import { Heading } from "./Heading";
import { SubHeading } from "./SubHeading";
import { InputBox } from "./InputBox";
import { Button } from "./Button";
import { WarnButton } from "./WarnButton";

export const Signup = ()=> {

    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setisSubmitting] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(()=> {
        if(token) {
            console.log("reading token");
            
            navigate('/dashboard');
        }
    }, [token]);
    
    const handleSubmit = ()=>{
        console.log("button clicked")
        setisSubmitting(true);
    }
    
    useEffect(()=> {
        const sendData = async ()=> {
            if(isSubmitting) {
                try {
                    console.log("Submitting")
                    const response = await axios.post('http://localhost:3000/api/v1/user/signup', {
                        firstName: firstName,
                        lastName: lastName,
                        username: email,
                        password: password,
                    });
                    if(response.data.token) {
                        localStorage.setItem("token", response.data.token)
                        navigate('/dashboard');
                    }                    
                } catch (error) {
                    console.log(error);
                } finally {
                    setisSubmitting(false);
                }
            }
        }

        sendData();
    }, [isSubmitting]);


    return(
        <Fragment>
            <main className="m-0 flex justify-center bg-slate-400 items-center overflow-hidden w-full h-screen">
                <div className="rounded-2xl shadow-xl bg-white">
                    <div className="h-full w-full text-center justify-center p-5">
                        <Heading label={ "Sign Up" }/>
                        <SubHeading label={ "Enter your information to create an account"}/>
                        <InputBox 
                            type={'text'}
                            onChange={(e) => setfirstName(e.target.value)} 
                            label={ "First Name" } 
                            placeholder={ "First Name" } 
                            id={ "firstname" }
                        />
                        <InputBox 
                            type={'text'}
                            onChange={(e) => setlastName(e.target.value)} 
                            label={ "Last Name" } 
                            placeholder={ "Last Name" } 
                            id={ "lastname" }
                        />
                        <InputBox 
                            type={'email'}
                            onChange={(e) => setEmail(e.target.value)} 
                            label={ "Email ID" } 
                            placeholder={ "yourmail@example.com" } 
                            id={ "emailid" }
                        />
                        <InputBox
                            type={ 'password' }
                            onChange={(e) => setPassword(e.target.value)}
                            label={ "Password" }
                            placeholder={ "Password" }
                            id={ "password" }
                        />
                        <Button onClick={()=> handleSubmit()} label={ "Sign Up" } isSubmitting={isSubmitting}/>
                        <WarnButton label={ "Already have an accout?" } refer={'Login'} to={ '/signin' }/>
                    </div>
                </div>
            </main>
        </Fragment>
    )
}