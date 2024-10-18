import "./UserMessage.scss";
import {Message} from "../../models/ChatModels";

interface UserMessageProps {
    message: Message;
}

export default function UserMessage({ message }: UserMessageProps) {
    return (
        <div className="user-message-container">
            <div className="user-message">
                {message.message ? message.message : ''}
            </div>
        </div>
    );
}