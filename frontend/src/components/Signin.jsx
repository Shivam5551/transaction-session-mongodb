import axios from "axios";
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
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(()=> {
        if(token) {
            console.log("reading token");
            
            navigate('/dashboard');
        }
    }, [token]);

    const handleSubmit = ()=> {
        console.log(isSubmitting);
        setisSubmitting(true);
        console.log(isSubmitting);
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
                    console.log(error);
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