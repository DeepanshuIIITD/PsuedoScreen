// app/contexts/ClassContext.jsx
import { createContext, useContext, useMemo, useState } from "react";

// console.log("Class Context file mounted");
const ClassContext = createContext();

export const useClass = () => {
    // console.log("Class Context file gona render");
    const context = useContext(ClassContext);
    if (!context) {
        throw new Error("useClass must be used within ClassProvider");
    }
    return context;
};

export const ClassProvider = ({ children }) => {
    const [selectedClass, setSelectedClass] = useState(null);
    const [attendanceData, setAttendanceData] = useState({}); // YYYY-MM-DD -> STATUS
    const [refreshTrigger, setRefreshTrigger] = useState(0); // NEW: Trigger for refreshing userHome

    const selectClass = (classData) => {
        // console.log("Setting selected class:", classData);
        // console.log("Selected class data // commented out");
        setSelectedClass({
            id: classData.ID || classData.id,
            name: classData.Name || classData.name || classData.title,
            code: classData.ClassCode || classData.class_code || classData.code,
            email: classData.Email || classData.email,
            phone: classData.Phone || classData.phone,
            numberOfWorkingDaysInWeek: classData.NumberOfWorkingDaysInWeek || classData.number_of_working_days_in_week,
        });
        setAttendanceData({}); // reset when class changes
    };

    const clearClass = () => {
        setSelectedClass(null);
        setAttendanceData({});
    };

    // NEW: Function to trigger refresh in components watching refreshTrigger
    const triggerRefresh = () => {
        // console.log("Triggering refresh in userHome");
        setRefreshTrigger(prev => prev + 1);
    };

    const value = useMemo(() => ({
        selectedClass,
        selectClass,
        clearClass,
        attendanceData,
        setAttendanceData,
        refreshTrigger,        // NEW: Added to context
        triggerRefresh,        // NEW: Added to context
    }), [selectedClass, attendanceData, refreshTrigger]);

    // console.log("Value from ClassContext - ", value);

    return (
        <ClassContext.Provider value={value}>
            {children}
        </ClassContext.Provider>
    );
};