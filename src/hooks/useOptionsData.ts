import {useCallback, useEffect, useState} from "react";
import {RawOptionsData, MessageOption} from "../models/ChatModels";

export const useOptionsData = () => {
    const [optionsData, setOptionsData] = useState<MessageOption[]>([]);

    useEffect(() => {
        fetchOptionsData().then();
    }, []);

    const fetchOptionsData = async () => {
        try {
            const response = await fetch("/data/stock-data.json");
            const rawData: RawOptionsData[] = await response.json();

            setOptionsData(convertOptionsData(rawData));
        } catch (error) {
            console.error("Error fetching options data:", error);
        }
    };

    // Convert raw data to message options data
    const convertOptionsData = useCallback((rawData: RawOptionsData[]): MessageOption[] => {
        return [
            {
                code: "MainMenu",
                name: "Main Menu",
                type: "mainMenu",
                value: rawData.map((stock) => ({
                    code: stock.code,
                    name: stock.stockExchange,
                    type: "stockExchange",
                    value: stock.topStocks.map((topStock) => ({
                        code: topStock.code,
                        name: topStock.stockName,
                        type: "stock",
                        value: topStock.price,
                    })),
                })),
            },
        ];
    }, []);

    return optionsData;
};