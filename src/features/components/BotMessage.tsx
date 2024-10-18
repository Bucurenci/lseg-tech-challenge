import "./BotMessage.scss";
import {Message} from "../../models/ChatModels";

interface BotMessageProps {
    message: Message;
    isSelectable?: boolean;
    handleSelectedOption: (code: string) => void;
}

export default function BotMessage({ message, isSelectable, handleSelectedOption }: BotMessageProps) {

    const onClickOption = (optionCode: string) => {
        handleSelectedOption(optionCode);
    }

    return (
        <div className="bot-message-container">
            {message && (
                <div className={`bot-message ${message.type === 'error' ? 'error' : ''}`}>
                    <div className="bot-message-text">
                        {message.message}
                    </div>

                    <ul className="bot-message-options">
                        {message.options && message.options.map((option, index) => (
                            <li className={`bot-option${isSelectable && ' is-selectable'}`} key={index}>
                                {isSelectable ? (
                                    <button key={index} onClick={() => onClickOption(option.code)}>
                                        {option.name}
                                    </button>
                                ) :
                                    <div className="text">{option.name}</div>
                                }
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}