export interface RawOptionsData {
    code: string;
    stockExchange: string;
    topStocks: {
        code: string;
        stockName: string;
        price: number
    }[];
}

export interface MessageOption {
    code: string;
    name: string;
    type: "mainMenu" | "stockExchange" | "stock";
    value?: MessageOption[] | number;
}

export interface Message {
    message: string;
    sender: 'bot' | 'user';
    options?: MessageOption[] | null | undefined;
    type?: 'default' | 'error' | 'success' | 'warning';
}