import React, { createContext, useState, useEffect } from "react";
import uuid from "react-native-uuid";
import { getEntries, addEntry as storageAddEntry } from "../services/storage";

export const JournalContext = createContext();

export const JournalProvider = ({ children }) => {
    const [entries, setEntries] = useState([]);

    //load data on mounting
    useEffect(() => {
        const loadInitialData = async () => {
            const storedEntries = await getEntries();
            setEntries(storedEntries);
        };
        loadInitialData();
    }, [])
 

    const addEntry = async (entry) => {
        
        const newEntries = await storageAddEntry(entry);
        setEntries(newEntries.reverse())
       
    }

    const deleteEntry = (id) => {
        
        setEntries((prev)=>prev.filter((item)=>item.id !== id));
    }

    return (

        <JournalContext.Provider value={{ entries, addEntry, deleteEntry }}>
            {children}
        </JournalContext.Provider>
    )
}