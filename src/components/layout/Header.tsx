import ChatBotIcon from "../ui/Icons/ChatBotIcon";
import './Header.scss';

export default function Header() {
    return (
        <header>
            <a href="/" title="ChatBot Homepage">
                <ChatBotIcon className="logo" />
            </a>
            <a href="/" title="ChatBot Homepage">
                <h1>LSEG ChatBot</h1>
            </a>
        </header>
    );
}