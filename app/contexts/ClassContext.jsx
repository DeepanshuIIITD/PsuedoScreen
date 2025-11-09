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
    const [attendanceData, setAttendanceData] = useState({}); // YYYY-MM-DD -> STATUS

    const selectClass = (classData) => {
    console.log("Setting selected class:", classData);
    setSelectedClass({
        id: classData.ID || classData.id,
        name: classData.Name || classData.name || classData.title,
        code: classData.ClassCode || classData.class_code || classData.code,
        email: classData.Email || classData.email,
        phone: classData.Phone || classData.phone,
    });
    setAttendanceData({}); // reset when class changes
    };

    const clearClass = () => {
    setSelectedClass(null);
    setAttendanceData({});
    };

    const value = {
    selectedClass,
    selectClass,
    clearClass,
    attendanceData,
    setAttendanceData,
    };

    console.log("Value from ClassContext - ",value);

    return (
    <ClassContext.Provider value={value}>
        {children}
    </ClassContext.Provider>
    );
};