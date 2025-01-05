import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { InputBox } from "./InputBox";
import { WarnButton } from "./WarnButton";
import axios from "axios";

export const Send = () => {
    const [receiverID, setReceiverID] = useState("");
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [navigateOnConfirm, setNavigateOnConfirm] = useState(false);
    const location = useLocation();
    const user = location.state;
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/signup");
        }
    }, [token]);

    useEffect(() => {
        if (user?.userId) {
            setReceiverID(user.userId);
        }
    }, [user]);

    if (!user) {
        return (
            <div className="flex h-screen w-full justify-center items-center bg-slate-200">
                <WarnButton
                    label={"You might be lost. Click here to go to"}
                    to={"/signup"}
                    refer={"Sign Up Page or Dashboard"}
                />
            </div>
        );
    }

    const handleOkButtonClick = () => {
        setErrorMessage("");
        if (navigateOnConfirm) {
            navigate("/dashboard"); 
        }
    };

    const SendMoney = async () => {
        if (!amount || isNaN(amount) || amount <= 0) {
            setErrorMessage("Please enter a valid amount.");
            return;
        }

        if (!receiverID) {
            setErrorMessage("Receiver ID is missing.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/account/transfer",
                { amount, receiverID },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setErrorMessage(response.data.response);
                setNavigateOnConfirm(true);
            } else if (response.status === 201) {
                setErrorMessage("Your balance is low.");
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message || "An error occurred.");
            } else {
                setErrorMessage("Network error. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Fragment>
            <div className="flex h-screen items-center justify-center bg-slate-300">
                <div className="bg-white p-6 rounded-2xl ">
                    {errorMessage && (
                        <div className="text-red-500 bg-white font-semibold p-2 rounded-xl text-center absolute top-2 right-2">
                            {errorMessage}
                            <button
                                onClick={handleOkButtonClick}
                                className="text-black rounded-full mx-2 py-2 px-3.5 bg-green-500 hover:bg-green-700 text-xl font-bold"
                            >
                                OK
                            </button>
                        </div>
                    )}

                    <div className="flex items-center">
                        <div className="mx-2 h-fit w-fit px-3 py-1 font-semibold text-center items-center text-2xl rounded-full bg-slate-300">
                            {user.firstName.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-extrabold p-2 overflow-hidden">{user.firstName}</div>
                    </div>
                    <InputBox
                        type={"number"}
                        placeholder={"Enter Amount"}
                        onChange={(e) => setAmount(e.target.value)}
                        label={"Enter Amount"}
                        id={"amount"}
                        aria-label={"Enter transfer amount"}
                    />
                    <button
                        onClick={SendMoney}
                        className={`mt-2 w-full text-xl font-semibold p-2 rounded-2xl 
                            ${isLoading ? "bg-gray-500" : "bg-green-500 hover:bg-green-600 hover:text-white"}`}
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Sending..." : "Send"}
                    </button>
                </div>
            </div>
        </Fragment>
    );
};
