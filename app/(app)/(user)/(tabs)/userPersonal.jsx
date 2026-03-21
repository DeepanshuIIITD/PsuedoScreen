import { useAuth } from '@/app/contexts/AuthContext';
import { useClass } from '@/app/contexts/ClassContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import Constants from 'expo-constants';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const userPersonal = () => {
  const [isjoined, setJoined] = React.useState(null); 
  const [attendanceSubmitted, setAttendanceSubmitted] = React.useState(false);
  const [todayNote, setTodayNote] = React.useState("");
  const [excuse, setExcuse] = React.useState("");
  const [isReportView, setIsReportView] = React.useState(null); 
  const [selectedTime, setSelectedTime] = React.useState(new Date());
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState({present:0,absent:0,other:0});
  const [currentYear, setCurrentYear] = React.useState({present:0,absent:0,other:0});
  
  const API = Constants.expoConfig.extra.API_URL;

  const { user, apiCall } = useAuth();
  const { selectedClass, setAttendanceData, triggerRefresh } = useClass();

  const todayDate = new Date().toLocaleDateString();
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Helper function to get today's date in YYYY-MM-DD format (local timezone)
  const getTodayKey = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Check if already marked today
  React.useEffect(() => {
    const checkToday = async () => {
      if (!selectedClass) return;
      try {
        console.log("🔍 Checking today's attendance...");
        
        const cal = await apiCall(`${API}/user/calendar/${selectedClass.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        console.log("📅 Calendar response:", JSON.stringify(cal, null, 2));
        
        // Get today's date in local timezone
        const todayKey = getTodayKey();
        console.log("📅 Today's key (local):", todayKey);
        console.log("📅 Current time:", new Date().toString());
        console.log("📅 Current IST time:", new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
        
        // Log all dates in calendar
        if (cal?.calendar) {
          console.log("📅 Dates in calendar:");
          cal.calendar.forEach(entry => {
            console.log(`  - ${entry.date}: ${entry.status}`);
          });
        }
        
        const todayRec = (cal?.calendar || []).find((c) => c.date === todayKey);
        
        if (todayRec) {
          console.log("✅ Found today's record:", todayRec);
          setAttendanceSubmitted(true);
          setJoined(todayRec.status === 'present');
          const statusVal = todayRec.status === 'present' ? 'present' : todayRec.status === 'absent' ? 'absent' : 'other';
          setAttendanceData(prev => ({ ...prev, [todayKey]: statusVal }));
        } else {
          console.log("⚠️ No record found for today");
          setAttendanceSubmitted(false);
        }
      } catch (e) {
        console.error("❌ Error checking today's attendance:", e);
      }
    };
    checkToday();
  }, [selectedClass]);

  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const palette = colorScheme === 'dark'
    ? { bg:'#0b0f14', card:'#0f172a', text:'#e5e7eb', sub:'#94a3b8', border:'#1f2937' }
    : { bg:'#f9fafb', card:'#ffffff', text:'#111827', sub:'#374151', border:'#e5e7eb' };

  const pickerStyle = {
    inputIOS: {
      borderColor: "#d1d5db",
      borderWidth: 1,
      borderRadius: 8,
      padding: 8,
      marginTop: 10,
    },
    inputAndroid: {
      borderColor: "#d1d5db",
      borderWidth: 1,
      borderRadius: 8,
      padding: 8,
      marginTop: 10,
    },
  };

  const reportData = async () => {
    const personalReport = await apiCall(`${API}/user/report/${selectedClass.id}`,{
      method: `GET`,
      headers: {"Content-Type": "application/json"},
    });
    let cm,cy ;
    cm = personalReport.report.current_month; cy = personalReport.report.current_year;
    setCurrentMonth({
      present: cm.present,
      absent: cm.absent,
      other: cm.not_marked,
    });
    setCurrentYear({
      present: cy.present,
      absent: cy.absent,
      other: cy.not_marked,
    });
  }

  // Joined summary with validation
  const renderJoinedSummary = () => (
    <>
      <Text style={[styles.cardTitle, {color: palette.text}]}>Attendance Summary</Text>
      <Text style={[styles.summaryText, {color: palette.text}]}>You have joined today's class. Great job!</Text>

      <TouchableOpacity
        style={styles.submitButton}
        disabled={attendanceSubmitted}
        onPress={async () => {
          try {
            console.log("📤 Submitting present attendance...");
            await apiCall(`${API}/user/markAttendance/${selectedClass.id}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({status: 'present'})
            });
            const todayKey = getTodayKey();
            console.log("✅ Attendance marked as present for:", todayKey);
            setAttendanceData(prev => ({ ...prev, [todayKey]: 'present' }));
            setAttendanceSubmitted(true);
            
            // Trigger refresh in userHome
            if (triggerRefresh) {
              triggerRefresh();
            }
          } catch (e) {
            console.error("❌ Failed to submit attendance:", e);
            alert(`Failed to submit: ${e.message}`);
          }
        }}
      >
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </>
  );

  const excuseOptions = [
    { label: 'Out of station', value: 'Out of station' },
    { label: 'Health issue', value: 'Health issue' },
    { label: 'Very genuine', value: 'Very genuine' },
    { label: 'Excuses', value: 'Excuses' },
  ];

  // Excuse form with validation
  const renderExcuseForm = () => (
    <>
      <Text style={[styles.cardTitle, {color: palette.text}]}>Attendance Summary</Text>
      <Text style={[styles.summaryText, { color: palette.text }]}>
        You didn't join today's class? No worries, it happens sometimes
      </Text>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={async () => {
          try {
            console.log("📤 Submitting absent attendance...");
            await apiCall(`${API}/user/markAttendance/${selectedClass.id}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({status: 'absent'})
            });
            const todayKey = getTodayKey();
            console.log("✅ Attendance marked as absent for:", todayKey);
            setAttendanceData(prev => ({ ...prev, [todayKey]: 'absent' }));
            setAttendanceSubmitted(true);
            
            // Trigger refresh in userHome
            if (triggerRefresh) {
              triggerRefresh();
            }
          } catch (e) {
            console.error("❌ Failed to submit attendance:", e);
            alert(`Failed to submit: ${e.message}`);
          }
        }}
      >
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </>
  );

  // After attendance submitted, show confirmation card
  const renderAttendanceConfirmation = () => (
    <View style={[styles.card, {backgroundColor: palette.card, borderWidth:1, borderColor: palette.border}]}>
      <Text style={[styles.cardTitle, {color: palette.text}]}>Attendance Marked</Text>
      <Text style={[styles.summaryText, {color: palette.text}]}>
        You have marked your attendance for {todayDate} as{" "}
        {isjoined ? "✅ Present" : "❌ Absent"}
      </Text>
    </View>
  );

  // Monthly Report
  const renderMonthlyReport = () => (
    <>
      <Text style={[styles.cardTitle, {color: palette.text}]}>Monthly Report</Text>
      <Text style={[styles.summaryText, {color: palette.text}]}>Total Classes Joined: {currentMonth.present}</Text>
      <Text style={[styles.summaryText, {color: palette.text}]}>Total Classes Missed: {currentMonth.absent}</Text>
      <Text style={[styles.summaryText, {color: palette.text}]}>Best Monthly Streak: CM_BS</Text>
      <View style={styles.streakHeader}>
        <Text style={styles.streakCounter}>Current Streak: CS days</Text>
        <View style={styles.streakIconWrapper}>
          <Text style={{ fontSize: 24 }}>🔥</Text>
        </View>
      </View>
    </>
  );

  const renderYearlyReport = () => (
    <>
      <Text style={[styles.cardTitle, {color: palette.text}]}>Yearly Report</Text>
      <Text style={[styles.summaryText, {color: palette.text}]}>Total Classes Joined: {currentYear.present}</Text>
      <Text style={[styles.summaryText, {color: palette.text}]}>Total Classes Missed: {currentYear.absent}</Text>
      <Text style={[styles.summaryText, {color: palette.text}]}>Best Yearly Streak: CY_BS</Text>
      <View style={styles.streakHeader}>
        <Text style={styles.streakCounter}>Longest Streak: CS days</Text>
        <View style={styles.streakIconWrapper}>
          <Text style={{ fontSize: 24 }}>🔥</Text>
        </View>
      </View>
    </>
  );

  return (
    <View style={[styles.safeContainer, {paddingTop:insets.top, backgroundColor: palette.bg}]}>
      <ScrollView style={[styles.screen,{backgroundColor: palette.bg}]} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <Text style={[styles.title, {color: palette.text}]}> Today's Attendance </Text>

        {/* Class Entry */}
        {!attendanceSubmitted && (
          <View style={[styles.card,{backgroundColor: palette.card, borderWidth:1, borderColor: palette.border}]}>
            <Text style={[styles.cardTitle,{color: palette.text}]}>Class Entry</Text>
            <View style={styles.innerBox}>
              <Text style={[styles.cardText, {color: palette.text}]}>Joined Today's Class ?</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                
                {/* Yes Button */}
                <TouchableOpacity
                  style={[
                    styles.yesButton,
                    isjoined === true && { backgroundColor: "#4ade80" }
                  ]}
                  onPress={() => setJoined(isjoined === true ? null : true)}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>Yes, I did!</Text>
                </TouchableOpacity>

                {/* No Button */}
                <TouchableOpacity
                  style={[
                    styles.noButton,
                    isjoined === false && { backgroundColor: "#f43f5e" }
                  ]}
                  onPress={() => setJoined(isjoined === false ? null : false)}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>No, Missed it</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Show form or confirmation */}
        {!attendanceSubmitted && isjoined !== null && (
          <View style={[styles.card,{backgroundColor: palette.card, borderWidth:1, borderColor: palette.border}]}>
            {isjoined ? renderJoinedSummary() : renderExcuseForm()}
          </View>
        )}
        {attendanceSubmitted && renderAttendanceConfirmation()}

        {/* Report Section */}
        <View style={[styles.card,{backgroundColor: palette.card, borderWidth:1, borderColor: palette.border}]}>
          <Text style={[styles.cardTitle,{color: palette.text}]}>Report</Text>
          <View style={styles.innerBox}>
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              <TouchableOpacity
                style={[
                  styles.reportButton,
                  isReportView === true && { backgroundColor: "#7c3aed" }
                ]}
                onPress={() => setIsReportView(isReportView === true ? null : true)}
              >
                <Text style={styles.cardText}>Monthly Report</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.reportButton,
                  isReportView === false && { backgroundColor: "#7c3aed" }
                ]}
                onPress={() => setIsReportView(isReportView === false ? null : false)}
              >
                <Text style={styles.cardText}>Yearly Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {isReportView !== null && (
          <View style={[styles.card,{backgroundColor: palette.card, borderWidth:1, borderColor: palette.border}]}>
            {isReportView ? renderMonthlyReport() : renderYearlyReport()}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default userPersonal;

const styles = StyleSheet.create({
  safeContainer:{
    flex: 1,
    backgroundColor: "f9fafb",
  },
  screen: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
  },
  yesButton:{
    marginTop: 12,
    marginBottom: 14,
    backgroundColor: "#b8ea69ff",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    width: 120,
  },
  inputBox: {
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
  },
  reportButton:{
    marginTop: 12,
    marginBottom: 14,
    backgroundColor: "#b567e5ff",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    width: 120,
  },
  noButton:{
    marginTop: 12,
    marginBottom: 14,
    backgroundColor: "#b42953ff",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    width: 120,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#1f2937",
  },
  submitButton: {
    backgroundColor: "#17e95d",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  summaryText: {
    fontSize: 14,
    color: "#111827",
    marginVertical: 2,
  },
  summarySubTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#2563eb",
  },
  cardText: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
  },
  innerBox: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  streakHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  streakIconWrapper: {
    backgroundColor: "#fff1f2",
    padding: 8,
    borderRadius: 50,
  },
  streakCounter: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ef4444",
    marginVertical: 12,
    textAlign: "center",
  },
});



// import { useAuth } from '@/app/contexts/AuthContext';
// import { useClass } from '@/app/contexts/ClassContext';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import Constants from 'expo-constants';
// import React from 'react';
// import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const userPersonal = () => {
//   const [isjoined, setJoined] = React.useState(null); 
//   const [attendanceSubmitted, setAttendanceSubmitted] = React.useState(false);
//   const [todayNote, setTodayNote] = React.useState("");
//   const [excuse, setExcuse] = React.useState("");
//   const [isReportView, setIsReportView] = React.useState(null); 
//   const [selectedTime, setSelectedTime] = React.useState(new Date());
//   const [showTimePicker, setShowTimePicker] = React.useState(false);
//   const [currentMonth, setCurrentMonth] = React.useState({present:0,absent:0,other:0});
//   const [currentYear, setCurrentYear] = React.useState({present:0,absent:0,other:0});
  
//   const API = Constants.expoConfig.extra.API_URL;

//   const { user, apiCall } = useAuth();
//   const { selectedClass, setAttendanceData, triggerRefresh } = useClass();

//   const todayDate = new Date().toLocaleDateString();
//   const formatTime = (date) => {
//     const hours = date.getHours().toString().padStart(2, '0');
//     const minutes = date.getMinutes().toString().padStart(2, '0');
//     return `${hours}:${minutes}`;
//   };

//   // Check if already marked today
//   React.useEffect(() => {
//     const checkToday = async () => {
//       if (!selectedClass) return;
//       try {
//         const cal = await apiCall(`${API}/user/calendar/${selectedClass.id}`, {
//           method: 'GET',
//           headers: { 'Content-Type': 'application/json' },
//         });
//         const todayKey = new Date(Date.now() - (new Date()).getTimezoneOffset()*60000).toISOString().slice(0,10);
//         const todayRec = (cal?.calendar || []).find((c) => c.date === todayKey);
//         if (todayRec) {
//           setAttendanceSubmitted(true);
//           setJoined(todayRec.status === 'present');
//           const statusVal = todayRec.status === 'present' ? 'present' : todayRec.status === 'absent' ? 'absent' : 'other';
//           setAttendanceData(prev => ({ ...prev, [todayKey]: statusVal }));
//         }
//       } catch (e) {
//         console.error("Error checking today's attendance:", e);
//       }
//     };
//     checkToday();
//   }, [selectedClass]);

//   const insets = useSafeAreaInsets();
//   const colorScheme = useColorScheme();
//   const palette = colorScheme === 'dark'
//     ? { bg:'#0b0f14', card:'#0f172a', text:'#e5e7eb', sub:'#94a3b8', border:'#1f2937' }
//     : { bg:'#f9fafb', card:'#ffffff', text:'#111827', sub:'#374151', border:'#e5e7eb' };

//   const pickerStyle = {
//     inputIOS: {
//       borderColor: "#d1d5db",
//       borderWidth: 1,
//       borderRadius: 8,
//       padding: 8,
//       marginTop: 10,
//     },
//     inputAndroid: {
//       borderColor: "#d1d5db",
//       borderWidth: 1,
//       borderRadius: 8,
//       padding: 8,
//       marginTop: 10,
//     },
//   };

//   const reportData = async () => {
//     const personalReport = await apiCall(`${API}/user/report/${selectedClass.id}`,{
//       method: `GET`,
//       headers: {"Content-Type": "application/json"},
//     });
//     let cm,cy ;
//     cm = personalReport.report.current_month; cy = personalReport.report.current_year;
//     setCurrentMonth({
//       present: cm.present,
//       absent: cm.absent,
//       other: cm.not_marked,
//     });
//     setCurrentYear({
//       present: cy.present,
//       absent: cy.absent,
//       other: cy.not_marked,
//     });
//   }

//   // Joined summary with validation
//   const renderJoinedSummary = () => (
//     <>
//       <Text style={[styles.cardTitle, {color: palette.text}]}>Attendance Summary</Text>
//       <Text style={[styles.summaryText, {color: palette.text}]}>You have joined today's class. Great job!</Text>

//       <TouchableOpacity
//         style={styles.submitButton}
//         disabled={attendanceSubmitted}
//         onPress={async () => {
//           try {
//             await apiCall(`${API}/user/markAttendance/${selectedClass.id}`, {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({status: 'present'})
//             });
//             const todayKey = new Date(Date.now() - (new Date()).getTimezoneOffset()*60000).toISOString().slice(0,10);
//             setAttendanceData(prev => ({ ...prev, [todayKey]: 'present' }));
//             setAttendanceSubmitted(true);
            
//             // Trigger refresh in userHome
//             if (triggerRefresh) {
//               triggerRefresh();
//             }
//           } catch (e) {
//             alert(`Failed to submit: ${e.message}`);
//           }
//         }}
//       >
//         <Text style={styles.submitText}>Submit</Text>
//       </TouchableOpacity>
//     </>
//   );

//   const excuseOptions = [
//     { label: 'Out of station', value: 'Out of station' },
//     { label: 'Health issue', value: 'Health issue' },
//     { label: 'Very genuine', value: 'Very genuine' },
//     { label: 'Excuses', value: 'Excuses' },
//   ];

//   // Excuse form with validation
//   const renderExcuseForm = () => (
//     <>
//       <Text style={[styles.cardTitle, {color: palette.text}]}>Attendance Summary</Text>
//       <Text style={[styles.summaryText, { color: palette.text }]}>
//               You didn't join today's class? No worries, it happens sometimes
//             </Text>
//       <TouchableOpacity
//         style={styles.submitButton}
//         onPress={async () => {
//           try {
//             await apiCall(`${API}/user/markAttendance/${selectedClass.id}`, {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({status: 'absent'})
//             });
//             const todayKey = new Date(Date.now() - (new Date()).getTimezoneOffset()*60000).toISOString().slice(0,10);
//             setAttendanceData(prev => ({ ...prev, [todayKey]: 'absent' }));
//             setAttendanceSubmitted(true);
            
//             // Trigger refresh in userHome
//             if (triggerRefresh) {
//               triggerRefresh();
//             }
//           } catch (e) {
//             alert(`Failed to submit: ${e.message}`);
//           }
//         }}
//       >
//         <Text style={styles.submitText}>Submit</Text>
//       </TouchableOpacity>
//     </>
//   );

//   // After attendance submitted, show confirmation card
//   const renderAttendanceConfirmation = () => (
//     <View style={[styles.card, {backgroundColor: palette.card, borderWidth:1, borderColor: palette.border}]}>
//       <Text style={[styles.cardTitle, {color: palette.text}]}>Attendance Marked</Text>
//       <Text style={[styles.summaryText, {color: palette.text}]}>
//         You have marked your attendance for {todayDate} as{" "}
//         {isjoined ? "✅ Present" : "❌ Absent"}
//       </Text>
//     </View>
//   );

//   // Monthly Report
//   const renderMonthlyReport = () => (
//     <>
//       <Text style={[styles.cardTitle, {color: palette.text}]}>Monthly Report</Text>
//       <Text style={[styles.summaryText, {color: palette.text}]}>Total Classes Joined: {currentMonth.present}</Text>
//       <Text style={[styles.summaryText, {color: palette.text}]}>Total Classes Missed: {currentMonth.absent}</Text>
//       <Text style={[styles.summaryText, {color: palette.text}]}>Best Monthly Streak: CM_BS</Text>
//       <View style={styles.streakHeader}>
//         <Text style={styles.streakCounter}>Current Streak: CS days</Text>
//         <View style={styles.streakIconWrapper}>
//           <Text style={{ fontSize: 24 }}>🔥</Text>
//         </View>
//       </View>
//     </>
//   );

//   const renderYearlyReport = () => (
//     <>
//       <Text style={[styles.cardTitle, {color: palette.text}]}>Yearly Report</Text>
//       <Text style={[styles.summaryText, {color: palette.text}]}>Total Classes Joined: {currentYear.present}</Text>
//       <Text style={[styles.summaryText, {color: palette.text}]}>Total Classes Missed: {currentYear.absent}</Text>
//       <Text style={[styles.summaryText, {color: palette.text}]}>Best Yearly Streak: CY_BS</Text>
//       <View style={styles.streakHeader}>
//         <Text style={styles.streakCounter}>Longest Streak: CS days</Text>
//         <View style={styles.streakIconWrapper}>
//           <Text style={{ fontSize: 24 }}>🔥</Text>
//         </View>
//       </View>
//     </>
//   );

//   return (
//     <View style={[styles.safeContainer, {paddingTop:insets.top, backgroundColor: palette.bg}]}>
//       <ScrollView style={[styles.screen,{backgroundColor: palette.bg}]} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
//         <Text style={[styles.title, {color: palette.text}]}> Today's Attendance </Text>

//         {/* Class Entry */}
//         {!attendanceSubmitted && (
//           <View style={[styles.card,{backgroundColor: palette.card, borderWidth:1, borderColor: palette.border}]}>
//             <Text style={[styles.cardTitle,{color: palette.text}]}>Class Entry</Text>
//             <View style={styles.innerBox}>
//               <Text style={[styles.cardText, {color: palette.text}]}>Joined Today's Class ?</Text>
//               <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                
//                 {/* Yes Button */}
//                 <TouchableOpacity
//                   style={[
//                     styles.yesButton,
//                     isjoined === true && { backgroundColor: "#4ade80" }
//                   ]}
//                   onPress={() => setJoined(isjoined === true ? null : true)}
//                 >
//                   <Text style={{ color: "white", fontWeight: "600" }}>Yes, I did!</Text>
//                 </TouchableOpacity>

//                 {/* No Button */}
//                 <TouchableOpacity
//                   style={[
//                     styles.noButton,
//                     isjoined === false && { backgroundColor: "#f43f5e" }
//                   ]}
//                   onPress={() => setJoined(isjoined === false ? null : false)}
//                 >
//                   <Text style={{ color: "white", fontWeight: "600" }}>No, Missed it</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         )}

//         {/* Show form or confirmation */}
//         {!attendanceSubmitted && isjoined !== null && (
//           <View style={[styles.card,{backgroundColor: palette.card, borderWidth:1, borderColor: palette.border}]}>
//             {isjoined ? renderJoinedSummary() : renderExcuseForm()}
//           </View>
//         )}
//         {attendanceSubmitted && renderAttendanceConfirmation()}

//         {/* Report Section */}
//         <View style={[styles.card,{backgroundColor: palette.card, borderWidth:1, borderColor: palette.border}]}>
//           <Text style={[styles.cardTitle,{color: palette.text}]}>Report</Text>
//           <View style={styles.innerBox}>
//             <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
//               <TouchableOpacity
//                 style={[
//                   styles.reportButton,
//                   isReportView === true && { backgroundColor: "#7c3aed" }
//                 ]}
//                 onPress={() => setIsReportView(isReportView === true ? null : true)}
//               >
//                 <Text style={styles.cardText}>Monthly Report</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   styles.reportButton,
//                   isReportView === false && { backgroundColor: "#7c3aed" }
//                 ]}
//                 onPress={() => setIsReportView(isReportView === false ? null : false)}
//               >
//                 <Text style={styles.cardText}>Yearly Report</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         {isReportView !== null && (
//           <View style={[styles.card,{backgroundColor: palette.card, borderWidth:1, borderColor: palette.border}]}>
//             {isReportView ? renderMonthlyReport() : renderYearlyReport()}
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// export default userPersonal;

// const styles = StyleSheet.create({
//   safeContainer:{
//     flex: 1,
//     backgroundColor: "f9fafb",
//   },
//   screen: {
//     flex: 1,
//     backgroundColor: "#f9fafb",
//     padding: 16,
//   },
//   title: {
//     fontSize: 34,
//     fontWeight: "bold",
//     color: "#111827",
//     marginBottom: 20,
//   },
//   yesButton:{
//     marginTop: 12,
//     marginBottom: 14,
//     backgroundColor: "#b8ea69ff",
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: "center",
//     width: 120,
//   },
//   inputBox: {
//     borderColor: "#d1d5db",
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 8,
//     marginTop: 10,
//   },
//   reportButton:{
//     marginTop: 12,
//     marginBottom: 14,
//     backgroundColor: "#b567e5ff",
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: "center",
//     width: 120,
//   },
//   noButton:{
//     marginTop: 12,
//     marginBottom: 14,
//     backgroundColor: "#b42953ff",
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: "center",
//     width: 120,
//   },
//   card: {
//     backgroundColor: "white",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 6,
//     elevation: 4,
//   },
//   cardTitle: {
//     fontSize: 20,
//     fontWeight: "600",
//     marginBottom: 10,
//     color: "#1f2937",
//   },
//   submitButton: {
//     backgroundColor: "#17e95d",
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   submitText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   summaryText: {
//     fontSize: 14,
//     color: "#111827",
//     marginVertical: 2,
//   },
//   summarySubTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginTop: 10,
//     color: "#2563eb",
//   },
//   cardText: {
//     fontSize: 16,
//     color: "#374151",
//     textAlign: "center",
//   },
//   innerBox: {
//     backgroundColor: "#f3f4f6",
//     borderRadius: 12,
//     padding: 12,
//     marginTop: 8,
//   },
//   streakHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   streakIconWrapper: {
//     backgroundColor: "#fff1f2",
//     padding: 8,
//     borderRadius: 50,
//   },
//   streakCounter: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: "#ef4444",
//     marginVertical: 12,
//     textAlign: "center",
//   },
// });