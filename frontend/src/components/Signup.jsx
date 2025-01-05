import { Fragment, useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router'
import { Heading } from "./Heading";
import { SubHeading } from "./SubHeading";
import { InputBox } from "./InputBox";
import { Button } from "./Button";
import { WarnButton } from "./WarnButton";
import { z as zod } from "zod";

const schema = zod.object({
    firstName: zod.string().nonempty({ message: "First name is required" }),
    lastName: zod.string().optional(),
    email: zod.string().email({ message: "Email provided is incorrect" }),
    password: zod.string().min(8, { message: "Password must be at least 8 characters long" }),
});

export const Signup = ()=> {

    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setisSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(()=> {
        if(token) {
            navigate('/dashboard');
        }
    }, []);
    
    const handleSubmit = ()=>{
        // if (!email.trim() || !password.trim() || !firstName.trim()){
        //     setErrorMessage("Email and password are required.");
        //     return;
        // }
        const { success, error } = schema.safeParse({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
        });
    
        if (!success) {
            const errorMessages = error.errors.map((err) => `${err.message}`).join("\n");
            setErrorMessage(errorMessages);
            return;
        }
        setErrorMessage('');
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
                    console.error("Sign-up error:", error);
                    setErrorMessage(error?.response?.data?.response || "An error occurred during sign-up.");
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
                        {errorMessage && (
                            <div className="absolute top-2 right-2 flex bg-white items-center rounded-xl  p-2 ">
                                <div className="text-red-500 text-left p-1 whitespace-pre-line font-semibold ">
                                {errorMessage}
                                </div>
                                <button onClick={()=> setErrorMessage('')} className="text-black rounded-full mx-2 py-2 px-3.5 bg-green-500 hover:bg-green-700 text-xl font-bold">X</button>
                            </div>
                        )}
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