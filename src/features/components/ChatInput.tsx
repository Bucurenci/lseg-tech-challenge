import {FormEvent, InputHTMLAttributes, ReactNode, useRef} from 'react';
import './ChatInput.scss';

interface InputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
    icon: ReactNode;
    position?: 'left' | 'right';
    isDisabled?: boolean;
    handleSentMessage: (text: string) => void;
}

export default function ChatInput({ icon, position, isDisabled = false, handleSentMessage, ...props } : InputGroupProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const onSendMessage = (e: FormEvent) => {
        e.preventDefault();

        if (inputRef && inputRef.current) {
            const inputValue: string = inputRef.current.value ? inputRef.current.value : '';

            if (inputValue) {
                handleSentMessage(inputValue);
                inputRef.current.value = '';
            }
        }
    }

    return (
        <form className={`input-group ${isDisabled ? 'is-disabled' : ''}`} onSubmit={onSendMessage}>
            {position === 'left' && (
                <input {...props} disabled={isDisabled} ref={inputRef} />
            )}
            <button type="submit" className="input-button" disabled={isDisabled} onClick={onSendMessage}>
                {icon}
            </button>
            {position === 'right' && (
                <input {...props} disabled={isDisabled} ref={inputRef} />
            )}
        </form>
    );
}
