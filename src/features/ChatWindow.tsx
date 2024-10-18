import {useEffect, useRef, useState} from "react";
import BotMessage from "./components/BotMessage";
import UserMessage from "./components/UserMessage";
import ChatInput from "./components/ChatInput";
import SendIcon from "../components/ui/Icons/SendIcon";
import {useOptionsData} from "../hooks/useOptionsData";
import {Message, MessageOption} from "../models/ChatModels";
import "./ChatWindow.scss";

export default function ChatWindow() {
    const optionsData = useOptionsData();
    const [messageHistory, setMessageHistory] = useState<Message[]>([]);
    const [prevSelected, setPrevSelected] = useState<MessageOption | undefined>({} as MessageOption);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Render default messages after fetching options data
    useEffect(() => {
        if (optionsData.length > 0) {
            renderDefaultMessages(optionsData);
        }
    }, [optionsData]);

    // Add message to history
    const addMessageToHistory = (messageObj: Message) => {
        setMessageHistory((prevMessages) => [...prevMessages, messageObj]);
    }

    // Render default messages
    const renderDefaultMessages = (data: MessageOption[]) => {

        addMessageToHistory({
            message: "Hello! Welcome to LSEG. I`m here to help you.",
            sender: "bot"
        });
        addMessageToHistory({
            message: "Please select a Stock Exchange.",
            sender: "bot",
            options: data.find((option) => option.code === "MainMenu")?.value as MessageOption[]
        });
        setPrevSelected(findOptionByCode("MainMenu", data));
    }

    // Function to handle when an option is selected
    const handleSelectedOption = (optionCode: string) => {
        const selectedOption: MessageOption | undefined = findOptionByCode(optionCode, optionsData);

        // Render the user message (The selected option)
        addMessageToHistory({
            message: selectedOption?.name ? selectedOption.name : optionCode,
            sender: "user"
        });

        renderBotMessages(selectedOption);
    }

    // Function to handle when chat input is submitted
    const handleSentMessage = (optionName: string) => {
        const selectedOption: MessageOption | undefined = findOptionByName(optionName, optionsData);

        // Render the user message (The selected option)
        addMessageToHistory({
            message: optionName,
            sender: "user"
        });

        renderBotMessages(selectedOption);
    }

    const renderBotMessages = (selectedOption: MessageOption | undefined) => {

        if (!selectedOption) {
            renderExpectedErrorMessage();
            return;
        }

        if (selectedOption.value) {

            // Render the bot message and options if options are available
            if (Array.isArray(selectedOption.value)) {
                const messageData: Message = {
                    message: "Please select an option.",
                    sender: "bot",
                    options: selectedOption.value as MessageOption[]
                }

                if (selectedOption.type === "mainMenu") {
                    messageData.message = "Please select a Stock Exchange.";
                } else if (selectedOption.type === "stockExchange") {
                    messageData.message = "Please select a stock.";
                }

                addMessageToHistory(messageData);

                // Set previous selected option
                setPrevSelected(selectedOption);
            }
            // Render the messages with number option value
            else {
                const messageData: Message = {
                    message: `Value of ${selectedOption.name} is ${selectedOption.value}. Please select an option.`,
                    sender: "bot",
                    options:  [
                        {name: "Main menu", code: "MainMenu"},
                        {name: "Go back", code: prevSelected?.code}
                    ] as MessageOption[]
                }

                if (selectedOption.type === "stock") {
                    messageData.message = `Stock price of ${selectedOption.name} is ${selectedOption.value}. Please select an option.`;
                }

                addMessageToHistory(messageData);
            }
        }
        // If no value available, show the main menu and go back to the previous menu
        else {
            addMessageToHistory({
                message: "Please select an option.",
                sender: "bot",
                options:  [
                    {name: "Main menu", code: "MainMenu"},
                    {name: "Go back", code: prevSelected?.code}
                ] as MessageOption[]
            });
        }
    }

    const renderExpectedErrorMessage = () => {
        // Invalid option selected
        addMessageToHistory({
            message: "Invalid option selected. Please try again.",
            sender: "bot",
            type: "error"
        });

        // If previous selected option is available, show the options
        if (prevSelected && prevSelected.value) {
            addMessageToHistory({
                message: "Please select a valid option.",
                sender: "bot",
                options: prevSelected.value as MessageOption[]
            });
        }
    }

    // Recursive function to find option by code in options data
    const findOptionByCode = (optionCode: string, optionsData: MessageOption[]): MessageOption | undefined => {

        if (!optionsData || optionsData.length === 0) {
            return;
        }

        const option = optionsData.find((option: MessageOption) => option.code && option.code === optionCode);

        if (option) {
            return option;
        }

        let newOptionsData: MessageOption[] = [];

        optionsData.forEach((option: MessageOption) => {
            if (option.value) {
                newOptionsData = newOptionsData.concat(option.value as MessageOption[]);
            }
        });

        return findOptionByCode(optionCode, newOptionsData);
    }

    // Recursive function to find option by name in options data
    const findOptionByName = (optionName: string, optionsData: MessageOption[]): MessageOption | undefined => {

        // If in array of "go back", return the previous selected option
        if (["go back", "goback", "back"].includes(optionName.toLowerCase()) && prevSelected) {
            return prevSelected;
        }

        if (!optionsData || optionsData.length === 0) {
            return;
        }

        const option = optionsData.find((option: MessageOption) => option.name && option.name.toLowerCase() === optionName.toLowerCase());

        if (option) {
            return option;
        }

        let newOptionsData: MessageOption[] = [];

        optionsData.forEach((option: MessageOption) => {
            if (option.value) {
                newOptionsData = newOptionsData.concat(option.value as MessageOption[]);
            }
        });

        return findOptionByName(optionName, newOptionsData);
    }

    // For only last bot message the options are selectable
    const isSelectable = (message: Message, index: number) => {
        return message.sender === "bot" && index === messageHistory.length - 1;
    }

    // Scroll to the last message
    useEffect(() => {
        scrollToBottom();
    }, [messageHistory]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current!.scrollIntoView({ behavior: "smooth" });
        }
    }

    return (
        <>
            <div className="messages-container">
                {messageHistory.length === 0 ? (
                    <div className="loading">
                        Loading...
                    </div>
                ) : (
                    <div className="messages-wrapper">
                        {messageHistory.map((messageObj: Message, index) => {
                            if (messageObj.sender === "bot") {
                                return <BotMessage key={index} message={messageObj} isSelectable={isSelectable(messageObj, index)} handleSelectedOption={handleSelectedOption} />;
                            } else {
                                return <UserMessage key={index} message={messageObj} />;
                            }
                        })}
                        <div ref={messagesEndRef} /> {/*Element for scrolling to the last message*/}
                    </div>
                )}
            </div>

            {/*Chat Input*/}
            <ChatInput
                icon={<SendIcon color="blue" />}
                position="left"
                type="text"
                placeholder="Please pick an option."
                isDisabled={false}
                handleSentMessage={handleSentMessage}
            />
        </>
    );
}