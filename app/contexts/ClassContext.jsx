// app/contexts/ClassContext.jsx
import { createContext, useContext, useState } from "react";


console.log("Class Context file mounted");
const ClassContext = createContext();

export const useClass = () => {
    console.log("Class Context file gona render");
    const context = useContext(ClassContext);
    if (!context) {
    throw new Error("useClass must be used within ClassProvider");
    }
    return context;
};

export const ClassProvider = ({ children }) => {
    const [selectedClass, setSelectedClass] = useState(null);

    const selectClass = (classData) => {
    console.log("Setting selected class:", classData);
    setSelectedClass({
        id: classData.ID,
        name: classData.Name,
        code: classData.ClassCode,
        email: classData.Email,
        phone: classData.Phone,
    });
    };

    const clearClass = () => {
    setSelectedClass(null);
    };

    const value = {
    selectedClass,
    selectClass,
    clearClass,
    };

    return (
    <ClassContext.Provider value={value}>
        {children}
    </ClassContext.Provider>
    );
};