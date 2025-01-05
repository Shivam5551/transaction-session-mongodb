import { default as axios } from 'axios';
import { useEffect, useState } from "react"
import { useNavigate } from "react-router";
import { Heading } from "./Heading";
import { SubHeading } from "./SubHeading";
import { InputBox } from "./InputBox";
import { Button } from "./Button";
import { WarnButton } from "./WarnButton";

export const Signin = ()=> {
    const [emailID, setEmailID] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setisSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(()=> {
        if(token) {
            console.log("reading token");
            
            navigate('/dashboard');
        }
    }, []);

    const handleSubmit = ()=> {
        if (!emailID.trim() || !password.trim()) {
            setErrorMessage("Email and password are required.");
            return;
        }
        setErrorMessage('');
        setisSubmitting(true);
    }

    useEffect(()=> {
        const submit = async () => {
            if(isSubmitting) {
                try {
                    const response = await axios.post('http://localhost:3000/api/v1/user/signin', {
                        username: emailID,
                        password: password,
                    });
                    if(response.data.token) {
                        localStorage.setItem("token", response.data.token)
                        navigate('/dashboard')
                    }

                } catch (error) {
                    console.error("Sign-in error:", error);
                    setErrorMessage(error?.response?.data?.response || "An error occurred during sign-in.");
                }
                finally {
                    setisSubmitting(false);
                }
            }
        }

        submit();

    }, [isSubmitting]);


    return (
        <div className="flex h-screen  bg-slate-400 justify-center items-center">
            <div className="p-5 bg-white rounded-3xl">
                <Heading label={ "Sign In" }/>
                <SubHeading label={ "Enter your credentials to access your account" }/>
                {errorMessage && (
                    <div className="text-red-500 bg-white font-semibold p-2 rounded-xl text-center absolute top-2 right-2 ">
                        {errorMessage}
                        <button onClick={()=> setErrorMessage('')} className="text-black rounded-full mx-2 py-2 px-3.5 bg-green-500 hover:bg-green-700 text-xl font-bold">X</button>
                    </div>
                )}
                <InputBox 
                        type={'email'}
                        onChange={(e) => setEmailID(e.target.value)} 
                        label={ "Email ID" } 
                        placeholder={ "youremail@gmail.com" } 
                        id={"emailID"}
                />
                <InputBox 
                        type={ 'password' }
                        onChange={(e) => setPassword(e.target.value)} 
                        label={ "Password" } 
                        placeholder={ "Password" } 
                        id={ "password" }
                />
                <Button  
                    onClick={handleSubmit}
                    label={"Sign In"}
                    isSubmitting={isSubmitting}
                />
                <WarnButton label={ `Don&apos;t Have account Signup?`} refer={ 'Signup'} to={ '/signup'}/>       
            </div>
        </div>
    )
}