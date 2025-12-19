// // userHome.jsx
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import Constants from "expo-constants";
// import React, { useEffect, useMemo, useState } from "react";
// import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import * as Animatable from "react-native-animatable";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// import { useAuth } from "@/app/contexts/AuthContext";
// import { useClass } from "@/app/contexts/ClassContext";
// import { useColorScheme } from "@/hooks/useColorScheme";

// /* -------------------------
//    CalendarHeatmap Component
//    -------------------------
//    - Generates a Monday-first grid for the entire year
//    - Month labels placed only for weeks where the first real day is the 1st
//    - Uses attendanceData keyed by YYYY-MM-DD (local-adjusted)
// */
// const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
// const COLORS = {
//   present: "#22c55e",
//   absent: "#ef4444",
//   other: "#3b82f6",
//   none: "#d1d5db"
// };

// function CalendarHeatmap({ year, attendanceData, onDayPress, colorScheme }) {
//   const palette = colorScheme === 'dark'
//     ? { monthText: '#94a3b8', weekdayText: '#6b7280', dayText: '#ffffff', noneColor: '#374151' }
//     : { monthText: '#374151', weekdayText: '#6b7280', dayText: '#111827', noneColor: '#d1d5db' };

//   // Generate days aligned to Monday
//   const { weeks, monthMarkers } = useMemo(() => {
//     const days = [];

//     const start = new Date(year, 0, 1);
//     let startWeekday = start.getDay();
//     if (startWeekday === 0) startWeekday = 7;

//     // Add leading nulls so first week starts on Monday
//     for (let i = 1; i < startWeekday; i++) days.push(null);

//     // Add all days of year
//     const last = new Date(year, 11, 31);
//     const totalDays = Math.floor((last - start) / 86400000) + 1;
//     for (let i = 0; i < totalDays; i++) {
//       days.push(new Date(year, 0, i + 1));
//     }

//     // Partition into weeks of 7
//     const weekRows = [];
//     let w = [];
//     days.forEach((d) => {
//       w.push(d);
//       if (w.length === 7) {
//         weekRows.push(w);
//         w = [];
//       }
//     });
//     if (w.length > 0) weekRows.push(w);

//     // month markers: only when the first real date in the week has date === 1
//     const markers = [];
//     weekRows.forEach((week, idx) => {
//       const firstReal = week.find(d => d !== null);
//       if (!firstReal) return;
//       if (firstReal.getDate() === 1) {
//         markers.push({ month: MONTHS[firstReal.getMonth()], weekIndex: idx });
//       }
//     });

//     return { weeks: weekRows, monthMarkers: markers };
//   }, [year]);

//   const keyFor = (date) => {
//     return new Date(date.getTime() - date.getTimezoneOffset()*60000).toISOString().slice(0,10);
//   };

//   return (
//     <View style={{ marginTop: 10 }}>
//       {/* Weekday labels + grid */}
//       <View style={{ flexDirection: "row" }}>
//         {/* Weekday labels column */}
//         <View style={{ marginRight: 6, width: 46 }}>
//           {/* Empty space for month row alignment */}
//           <View style={{ height: 24, marginBottom: 6 }} />
//           {WEEKDAYS.map(day => (
//             <View key={day} style={{ height: 36, justifyContent: "center", marginBottom: 2 }}>
//               <Text style={[styles.weekdayText, { color: palette.weekdayText }]}>{day}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Grid: week columns with month labels on top */}
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
//           <View style={{ flexDirection: "column" }}>
//             {/* Month labels row */}
//             <View style={styles.monthRow}>
//               {weeks.map((_, wIdx) => {
//                 const marker = monthMarkers.find(m => m.weekIndex === wIdx);
//                 return (
//                   <View key={wIdx} style={{ width: 36, alignItems: "center", marginHorizontal: 1 }}>
//                     <Text style={[styles.monthText, { color: marker ? palette.monthText : 'transparent' }]}>
//                       {marker ? marker.month : "   "}
//                     </Text>
//                   </View>
//                 );
//               })}
//             </View>

//             {/* Week columns */}
//             <View style={{ flexDirection: "row" }}>
//               {weeks.map((week, weekIndex) => (
//                 <View key={weekIndex} style={styles.weekColumn}>
//                   {week.map((date, dIdx) => {
//                     if (!date) {
//                       return <View key={dIdx} style={[styles.dayBox, { backgroundColor: palette.noneColor }]} />;
//                     }
//                     const key = keyFor(date);
//                     const status = attendanceData?.[key] ?? "none";
//                     const bg = status === "none" ? palette.noneColor : (COLORS[status] ?? palette.noneColor);
//                     return (
//                       <Pressable 
//                         key={dIdx} 
//                         onPress={() => onDayPress && onDayPress(date)}
//                         style={({ pressed }) => [
//                           styles.dayBox, 
//                           { 
//                             backgroundColor: bg,
//                             opacity: pressed ? 0.7 : 1
//                           }
//                         ]}
//                       >
//                         <Text style={[styles.dayText, { color: palette.dayText }]}>{date.getDate()}</Text>
//                       </Pressable>
//                     );
//                   })}
//                 </View>
//               ))}
//             </View>
//           </View>
//         </ScrollView>
//       </View>
//     </View>
//   );
// }

// /* ------------------------
//    Full UserHome component
//    ------------------------ */
// const UserHome = () => {
//   const { user, logout, apiCall } = useAuth();
//   const { selectedClass, attendanceData: ctxAttendanceData, setAttendanceData: setCtxAttendanceData, refreshTrigger } = useClass();
//   const colorScheme = useColorScheme();
//   const insets = useSafeAreaInsets();

//   const palette = colorScheme === 'dark'
//     ? { bg: '#0b0f14', card: '#0f172a', text: '#e5e7eb', subtext:'#94a3b8', border:'#1f2937' }
//     : { bg: '#f9fafb', card: '#ffffff', text: '#111827', subtext:'#374151', border:'#e5e7eb' };

//   const [loading, setLoading] = useState(true);
//   const [streak, setStreak] = useState(0);
//   const [bestStreak, setBestStreak] = useState(0);
//   const [menuVisible, setMenuVisible] = useState(false);

//   // Local attendance map keyed by YYYY-MM-DD => "present"|"absent"|"other"
//   const [attendanceData, setAttendanceData] = useState({});
//   const [totalPresent, setTotalPresent] = useState(0);
//   const [totalAbsent, setTotalAbsent] = useState(0);
//   const [totalUnMarked, setTotalUnMarked] = useState(0);
//   const [currentWeekPresent, setCurrentWeekPresent] = useState(0);
//   const [currentWeekAbsent, setCurrentWeekAbsent] = useState(0);
//   const [currentWeekUnMarked, setCurrentWeekUnMarked] = useState(0);
//   const [todayStatus, setTodayStatus] = useState("Not marked");

//   const API = Constants.expoConfig?.extra?.API_URL || 'https://streak-app-uxyv.onrender.com';
//   const YEAR = new Date().getFullYear();

//   // Convert backend calendar array into map
//   const mapCalendarToAttendance = (calendarArray=[]) => {
//     const mapped = {};
//     (calendarArray || []).forEach(({ date, status }) => {
//       if (!date) return;
//       const normalized = status === 'present' ? 'present' :
//                          status === 'absent' ? 'absent' : 'other';
//       mapped[date] = normalized;
//     });
//     return mapped;
//   };

//   // Fetch all data - runs on mount and when refreshTrigger changes
//   useEffect(() => {
//     if (!selectedClass) {
//       setLoading(false);
//       return;
//     }

//     let mounted = true;

//     const loadAll = async () => {
//       try {
//         setLoading(true);
        
//         // Quick summary
//         const quick = await apiCall(`${API}/user/quickSummary/${selectedClass.id}`, {
//           method: 'GET',
//           headers: { 'Content-Type': 'application/json' }
//         });

//         if (mounted && quick?.quick_summary) {
//           setTotalPresent(quick.quick_summary.total_present ?? 0);
//           setTotalAbsent(quick.quick_summary.total_absent ?? 0);
//           setTotalUnMarked(quick.quick_summary.total_not_marked ?? 0);
//           setCurrentWeekPresent(quick.quick_summary.current_week_present ?? 0);
//           setCurrentWeekAbsent(quick.quick_summary.current_week_absent ?? 0);
//           setCurrentWeekUnMarked(quick.quick_summary.current_week_not_marked ?? 0);
//           setTodayStatus(quick.quick_summary.today_status ?? "Not marked");
//         }

//         // Calendar
//         const calResp = await apiCall(`${API}/user/calendar/${selectedClass.id}`, {
//           method: 'GET',
//           headers: { 'Content-Type': 'application/json' }
//         });

//         const mapped = mapCalendarToAttendance(calResp?.calendar || []);
//         if (mounted) {
//           setAttendanceData(mapped);
//           if (setCtxAttendanceData) setCtxAttendanceData(mapped);
//         }

//         // Streak
//         const streakResp = await apiCall(`${API}/user/streak/${selectedClass.id}`, {
//           method: 'GET',
//           headers: { 'Content-Type': 'application/json' }
//         });
//         if (mounted) {
//           setStreak(streakResp?.currentStreak ?? 0);
//           setBestStreak(streakResp?.bestStreak ?? 0);
//         }

//       } catch (e) {
//         console.error("Failed to load user home data:", e);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     loadAll();

//     return () => { mounted = false; };
//   }, [selectedClass, refreshTrigger]); // Added refreshTrigger to dependencies

//   // Handle day press
//   const handleDayPress = (date) => {
//     if (!date) return;
//     const key = new Date(date.getTime() - date.getTimezoneOffset()*60000).toISOString().slice(0,10);
//     const status = attendanceData[key] ?? "none";
//     let message;
//     if (status === 'present') message = "✅ Present";
//     else if (status === 'absent') message = "❌ Absent";
//     else if (status === 'other') message = "ℹ️ Other";
//     else message = "No data available";
//     Alert.alert(`Date: ${key}`, message);
//   };

//   const firstName = user?.firstName || user?.userName || "User";

//   if (loading) {
//     return (
//       <View style={[styles.safeContainer, { paddingTop: insets.top, backgroundColor: palette.bg, justifyContent: 'center', alignItems: 'center' }]}>
//         <Text style={{ color: palette.text, fontSize: 16 }}>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.safeContainer, { paddingTop: insets.top, backgroundColor: palette.bg }]}>
//       {/* Header */}
//       <View style={[styles.headerContainer, { backgroundColor: palette.card, borderBottomColor: palette.border }]}>
//         <Text style={[styles.title, { color: palette.text }]}>👋 Hi, {firstName}!</Text>
        
//         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
//           {/* Menu Button */}
//           {/* <TouchableOpacity onPress={() => setMenuVisible(true)}>
//             <MaterialCommunityIcons name="menu" size={32} color={palette.text} />
//           </TouchableOpacity> */}
          
//           {/* Logout Button */}
//           {/* <TouchableOpacity onPress={async () => {
//             Alert.alert(
//               "Logout",
//               "Are you sure you want to logout?",
//               [
//                 { text: "Cancel", style: "cancel" },
//                 { text: "Logout", style: "destructive", onPress: async () => { await logout(); } }
//               ]
//             );
//           }}>
//             <MaterialCommunityIcons name="account-circle" size={32} color="#ff6b6b" />
//           </TouchableOpacity> */}

//             <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
//         <MaterialCommunityIcons name="account-circle" size={32} color="#ff6b6b" />
//       </TouchableOpacity>
//           {menuVisible && (
//         <>
//           <TouchableOpacity
//             style={styles.menuOverlay}
//             onPress={() => setMenuVisible(false)}
//             activeOpacity={1}
//           />
//           <View style={[styles.menuContainer,{backgroundColor: palette.menuBg, borderColor: palette.border}] }>
//             <TouchableOpacity 
//               style={styles.menuItem} 
//               onPress={() => handleEditProfile()}
//             >
//               <MaterialCommunityIcons name="account-edit" size={20} color="#374151" style={styles.menuIcon} />
//               <Text style={[styles.menuItemText,{color: palette.text}]}>Edit Profile</Text>
//             </TouchableOpacity>
//             <View style={styles.menuDivider} />
//             <TouchableOpacity 
//               style={styles.menuItem} 
//               onPress={() => handleAboutPage()}
//             >
//               <MaterialCommunityIcons name="information" size={20} color="#374151" style={styles.menuIcon} />
//               <Text style={[styles.menuItemText,{color: palette.text}]}>About Application</Text>
//             </TouchableOpacity>
//             <View style={styles.menuDivider} />
//             <TouchableOpacity 
//               style={[styles.menuItem, styles.menuItemDanger]} 
//               onPress={() => handleLogout()}
//             >
//               <MaterialCommunityIcons name="logout" size={20} color="#ef4444" style={styles.menuIcon} />
//               <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Logout</Text>
//             </TouchableOpacity>
//           </View>
//         </>
//       )}
//         </View>
//       </View>

//       {/* Menu Modal */}
//       <Modal
//         visible={menuVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setMenuVisible(false)}
//       >
//         <Pressable 
//           style={styles.modalOverlay} 
//           onPress={() => setMenuVisible(false)}
//         >
//           <View style={[styles.menuContainer, { backgroundColor: palette.card, borderColor: palette.border }]}>
//             <TouchableOpacity 
//               style={styles.menuItem}
//               onPress={() => {
//                 setMenuVisible(false);
//                 Alert.alert("Edit Profile", "Edit Profile feature coming soon!");
//               }}
//             >
//               <MaterialCommunityIcons name="account-edit" size={24} color={palette.text} />
//               <Text style={[styles.menuText, { color: palette.text }]}>Edit Profile</Text>
//             </TouchableOpacity>

//             <View style={[styles.menuDivider, { backgroundColor: palette.border }]} />

//             <TouchableOpacity 
//               style={styles.menuItem}
//               onPress={() => {
//                 setMenuVisible(false);
//                 Alert.alert(
//                   "About", 
//                   "Attendance Tracker App\nVersion 1.0.0\n\nTrack your class attendance and maintain your streak!",
//                   [{ text: "OK" }]
//                 );
//               }}
//             >
//               <MaterialCommunityIcons name="information" size={24} color={palette.text} />
//               <Text style={[styles.menuText, { color: palette.text }]}>About</Text>
//             </TouchableOpacity>
//           </View>
//         </Pressable>
//       </Modal>

//       <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}>
//         <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
//           <Text style={[styles.cardTitle, { color: palette.text }]}>Welcome to {selectedClass?.name || '—'}</Text>
//         </View>

//         <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
//           <Text style={[styles.cardTitle, { color: palette.text }]}>Quick Summary</Text>
//           <View style={[styles.innerBox, { backgroundColor: colorScheme === 'dark' ? '#1e293b' : '#f3f4f6' }]}>
//             <Text style={[styles.summaryText, { color: palette.text }]}>🔥 Best Streak: {bestStreak} days</Text>

//             <Text style={[styles.summarySubTitle, { color: palette.text }]}>📅 Current Week</Text>
//             <Text style={[styles.summaryText, { color: palette.text }]}>Present: {currentWeekPresent} | Absent: {currentWeekAbsent} | Other: {currentWeekUnMarked}</Text>

//             <Text style={[styles.summarySubTitle, { color: palette.text }]}>📊 Total</Text>
//             <Text style={[styles.summaryText, { color: palette.text }]}>Present: {totalPresent} | Absent: {totalAbsent} | Other: {totalUnMarked}</Text>
//           </View>
//         </View>

//         <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
//           <View style={styles.streakHeader}>
//             <Text style={[styles.cardTitle, { color: palette.text }]}>Streak</Text>
//             <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite" style={styles.streakIconWrapper}>
//               <MaterialCommunityIcons name="fire" size={32} color="#ff6b6b" />
//             </Animatable.View>
//           </View>
//           <Text style={styles.streakCounter}>🔥 {streak} Days</Text>

//           {/* Calendar Heatmap */}
//           <CalendarHeatmap
//             year={YEAR}
//             attendanceData={attendanceData}
//             onDayPress={handleDayPress}
//             colorScheme={colorScheme}
//           />
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default UserHome;

// /* -------------------------
//    Styles
//    ------------------------- */
// const styles = StyleSheet.create({
//   safeContainer: {
//     flex: 1,
//   },
//   headerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     zIndex: 1000,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "700",
//   },
//   card: {
//     backgroundColor: "white",
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 16,
//     borderWidth: 1,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginBottom: 8,
//   },
//   innerBox: {
//     backgroundColor: "#f3f4f6",
//     borderRadius: 8,
//     padding: 10,
//   },
//   summaryText: {
//     fontSize: 14,
//     marginBottom: 6,
//   },
//   summarySubTitle: {
//     fontSize: 14,
//     fontWeight: "600",
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
//     borderRadius: 40,
//   },
//   streakCounter: {
//     fontSize: 22,
//     fontWeight: "800",
//     color: "#ef4444",
//     marginVertical: 12,
//     textAlign: "center",
//   },
//   monthRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 6,
//     height: 24,
//   },
//   monthText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#374151",
//   },
//   weekdayText: {
//     fontSize: 12,
//     color: "#6b7280",
//   },
//   weekColumn: {
//     flexDirection: "column",
//     marginHorizontal: 1,
//   },
//   dayBox: {
//     width: 36,
//     height: 36,
//     marginBottom: 2,
//     borderRadius: 6,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   dayText: {
//     fontSize: 12,
//     fontWeight: "700",
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'flex-start',
//     alignItems: 'flex-end',
//     paddingTop: 60,
//     paddingRight: 16,
//   },
//   menuContainer: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 8,
//     minWidth: 200,
//     borderWidth: 1,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     gap: 12,
//   },
//   menuText: {
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   menuDivider: {
//     height: 1,
//     backgroundColor: '#e5e7eb',
//     marginVertical: 4,
//   },
// });






      // quick summary /user/myClasses/:id, token header=bearer walah
      //   LOG  Quick Summary  {"quick_summary": {"current_week_absent": 0, "current_week_not_marked": 0, "current_week_present": 0, "today_status": "Not marked", "total_absent": 0, "total_not_marked": 0, "total_present": 2}}

      // /user/calendar/${classid}
      //Calendar looks like this  {"calendar": [{"date": "2025-09-21", "status": "present"}, {"date": "2025-11-07", "status": "present"}], "class_id": 1, "user_id": 1}

// report response
// {"report":{"current_month":{"absent":1,"not_marked":0,"present":0},"current_year":{"absent":1,"not_marked":0,"present":0}}}


// import { useColorScheme } from '@/hooks/useColorScheme';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import { Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import * as Animatable from 'react-native-animatable';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // for importing class respective details
// import { useAuth } from '@/app/contexts/AuthContext';
// import { useClass } from '@/app/contexts/ClassContext';
// import Constants from 'expo-constants';

// const USE_MOCK = false; // Toggle mocked streak APIs

// // Status codes for clarity
// // 0 = Absent, 1 = Present, 2 = Other
// const STATUS = {
//   ABSENT: 0,
//   PRESENT: 1,
//   OTHER: 2,
// };

// // Helper: Map status → color
// const getStatusColor = (status) => {
//   switch (status) {
//     case STATUS.PRESENT: return "#22c55e"; // green
//     case STATUS.ABSENT: return "#ef4444";  // red
//     case STATUS.OTHER: return "#3b82f6";   // blue
//     default: return "#d1d5db";             // gray (no data)
//   }
// };

// const weekdays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
// const months = [
//   "Jan","Feb","Mar","Apr","May","Jun",
//   "Jul","Aug","Sep","Oct","Nov","Dec"
// ];

// const UserHome = () => {
//   const { user, logout, apiCall } = useAuth();
//   const colorScheme = useColorScheme();
//   const palette = colorScheme === 'dark'
//     ? {
//         bg: '#0b0f14',
//         card: '#0f172a',
//         text: '#e5e7eb',
//         subtext: '#94a3b8',
//         border: '#1f2937',
//         menuBg: '#0f172a',
//       }
//     : {
//         bg: '#f9fafb',
//         card: '#ffffff',
//         text: '#111827',
//         subtext: '#374151',
//         border: '#e5e7eb',
//         menuBg: '#ffffff',
//       };
//   const firstName = user?.firstName || user?.userName || "User";
//   // Attendance from context so updates reflect across screens
//   const { selectedClass, attendanceData, setAttendanceData } = useClass();
//   // for safeareview testing purpose only
//   const insets = useSafeAreaInsets();

//   // for adding profile icon logic 
//   const [menuVisible, setMenuVisible] = useState(false);
//   // class comes from context above
//   const [loading, setIsLoading] = useState(true);
//   const [streak, setStreak] = useState(20);
//   const [bestStreak, setBestStreak] = useState(0);
//   const [todayStatus, setTodayStatus ] = useState("Not marked");
//   const [totalPresent, setTotalPresent ] = useState(0);
//   const [totalAbsent, setTotalAbsent] = useState(0);
//   const [totalUnMarked, setTotalUnMarked] = useState(0);
//   const [currentWeekPresent, setCurrentWeekPresent] = useState(0);
//   const [currentWeekAbsent, setCurrentWeekAbsent] = useState(0);
//   const [currentWeekUnMarked, setCurrentWeekUnMarked] = useState(0);
//   // const API = 'https://streak-app-production.up.railway.app';
//   const API = Constants.expoConfig.extra.API_URL;

//   console.log("USER HOME --- selected class is ", selectedClass);

//   const year = 2025;
//   const startDate = new Date(year, 0, 1);
//   const days = [];

//   // Build full year of date objects
//   for (let i = 0; i < 365; i++) {
//     const d = new Date(year, 0, 1 + i);
//     days.push(d);
//   }

//   // Split into weeks (Mon–Sun)
//   const weeks = [];
//   let week = [];
//   days.forEach((date) => {
//     week.push(date);
//     if (week.length === 7) {
//       weeks.push(week);
//       week = [];
//     }
//   });

//   // summary part 

// // Helper to calculate total summary
// const getTotalSummary = async () => {
//   const resp = await apiCall(`${API}/user/quickSummary/${selectedClass.id}`,{
//     method: `GET`,
//     headers: { 'Content-Type': 'application/json' },
//   });
//   console.log("Quick Summary ",resp);

//   const calendar = await apiCall(`${API}/user/calendar/${selectedClass.id}`,{
//     method: `GET`,
//     headers: { 'Content-Type': 'application/json' },
//     });

//     console.log("Calendar looks like this ", calendar);

//   setTotalPresent(resp.quick_summary.total_present);
//   setTotalAbsent(resp.quick_summary.total_absent);
//   setTotalUnMarked(resp.quick_summary.total_not_marked);
//   setCurrentWeekPresent(resp.quick_summary.current_week_present);
//   setCurrentWeekAbsent(resp.quick_summary.current_week_absent);
//   setCurrentWeekUnMarked(resp.quick_summary.current_week_not_marked);
//   setTodayStatus(resp.quick_summary.today_status);
// };


// // Helper for percentages
// const getPercentages = async () => {
//   const total = totalPresent + totalAbsent + totalUnMarked;
//   if (total === 0) return { present: 0, absent: 0, other: 0 };



//   return {
//     present: ((totalPresent / total) * 100).toFixed(1),
//     absent: ((totalAbsent / total) * 100).toFixed(1),
//     other: ((totalUnMarked / total) * 100).toFixed(1),
//     };

//   };


//   // Month markers
//   const monthMarkers = [];
//   weeks.forEach((week, weekIndex) => {
//     const firstDay = week[0];
//     if (firstDay.getDate() <= 7) {
//       monthMarkers.push({ month: months[firstDay.getMonth()], weekIndex });
//     }
//   });

//   // 🔹 Fetch streak numbers without calling APIs during render
//   useEffect(() => {
//     const run = async () => {
//       if (!selectedClass) return;
//       try {
//           // Best streak for selected class
//           const resp = await apiCall(`${API}/user/streak/${selectedClass.id}`, {
//             method: 'GET',
//             headers: { 'Content-Type': 'application/json' },
//           });
//           console.log(resp);
//           const best = resp.bestStreak;
//           const current = resp.currentStreak;
//           setBestStreak(best);
//           setStreak(current);

//       } catch (e) {
//         setBestStreak(0);
//         setStreak(0);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     run();
//     // also recompute when attendance map changes in mock mode
//   }, [selectedClass, attendanceData]);

//   // no helper function for date keys; use ISO local-adjusted inline where needed

//   // Handle tap on a cell
//   const handleDayPress = (date) => {
//     const key = new Date(date.getTime() - date.getTimezoneOffset()*60000).toISOString().slice(0,10);
//     const status = attendanceData[key] ?? null;

//     let message;
//     if (status === STATUS.PRESENT) message = "✅ Present";
//     else if (status === STATUS.ABSENT) message = "❌ Absent";
//     else if (status === STATUS.OTHER) message = "ℹ️ Other (Genuine Reason)";
//     else message = "No data available";

//     Alert.alert(`Date: ${key}`, message);
//   };


//   // profile button logical functions
//   const handleLogout = async () => {
//     Alert.alert(
//       "Logout",
//       "Are you sure you want to logout?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel"
//         },
//         {
//           text: "Logout",
//           style: "destructive",
//           onPress: async () => {
//             await logout();
//           }
//         }
//       ]
//     );
//   };

//   const handleEditProfile = async () => {
//     setMenuVisible(false);
//     router.push("/(app)/(user)/editProfile");
//   };

//   const handleAboutPage = async () => {
//     setMenuVisible(false);
//     router.push("/(app)/(user)/about");
//   };


//   return (
//     <View style={[styles.safeContainer,{paddingTop:insets.top, backgroundColor: palette.bg} ]}>
//       {/* header sepearate from scroll view */}
//       <View style={styles.headerContainer}>
//       <Text style={[styles.title,{color: palette.text}]}>👋 Hi, {firstName}!</Text>
//       <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
//         <MaterialCommunityIcons name="account-circle" size={32} color="#ff6b6b" />
//       </TouchableOpacity>

//       {menuVisible && (
//         <>
//           <TouchableOpacity
//             style={styles.menuOverlay}
//             onPress={() => setMenuVisible(false)}
//             activeOpacity={1}
//           />
//           <View style={[styles.menuContainer,{backgroundColor: palette.menuBg, borderColor: palette.border}] }>
//             <TouchableOpacity 
//               style={styles.menuItem} 
//               onPress={() => handleEditProfile()}
//             >
//               <MaterialCommunityIcons name="account-edit" size={20} color="#374151" style={styles.menuIcon} />
//               <Text style={[styles.menuItemText,{color: palette.text}]}>Edit Profile</Text>
//             </TouchableOpacity>
//             <View style={styles.menuDivider} />
//             <TouchableOpacity 
//               style={styles.menuItem} 
//               onPress={() => handleAboutPage()}
//             >
//               <MaterialCommunityIcons name="information" size={20} color="#374151" style={styles.menuIcon} />
//               <Text style={[styles.menuItemText,{color: palette.text}]}>About Application</Text>
//             </TouchableOpacity>
//             <View style={styles.menuDivider} />
//             <TouchableOpacity 
//               style={[styles.menuItem, styles.menuItemDanger]} 
//               onPress={() => handleLogout()}
//             >
//               <MaterialCommunityIcons name="logout" size={20} color="#ef4444" style={styles.menuIcon} />
//               <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Logout</Text>
//             </TouchableOpacity>
//           </View>
//         </>
//       )}
//     </View>
//     <ScrollView style={[styles.screen]} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>

//       {/* <View style={flexDirection = 'row' }  >
//         <MaterialCommunityIcons name='profile' size={32} color="#ff6b6b"/>
//         <Text style={styles.title}>👋 Hi, {firstName}!</Text>
//       </View> */}


//       {/* Welcome Box */}
//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>Welcome to {selectedClass?.name || '—'}</Text>
//       </View>

//       {/* Quick Summary */}
//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>Quick Summary</Text>
//         <View style={styles.innerBox}>
//           {(() => {
//             const bestStreakValue = bestStreak;
//             const total = totalPresent + totalAbsent + totalUnMarked;
//             const percentages = total === 0 ? {present: 0, absent: 0, other: 0} : {
//               present: ((totalPresent/total)*100).toFixed(1),
//               absent: ((totalAbsent/total)*100).toFixed(1),
//               other: ((totalUnMarked/total)*100).toFixed(1),
//             };

//             return (
//               <>
//                 <Text style={styles.summaryText}>🔥 Best Streak: {bestStreakValue} days</Text>

//                 <Text style={styles.summarySubTitle}>📅 Current Week</Text>
//                 <Text style={styles.summaryText}>
//                   Present: {currentWeekPresent} | Absent: {currentWeekAbsent} | Other: {currentWeekUnMarked}
//                 </Text>

//                 <Text style={styles.summarySubTitle}>📊 Total</Text>
//                 <Text style={styles.summaryText}>
//                   Present: {totalPresent} | Absent: {totalAbsent} | Other: {totalUnMarked}
//                 </Text>

//                 <Text style={styles.summarySubTitle}>📈 Percentages</Text>
//                 <Text style={styles.summaryText}>
//                   Present: {percentages.present}% | Absent: {percentages.absent}% | Other: {percentages.other}%
//                 </Text>
//               </>
//             );
//           })()}
//         </View>
//       </View>


//       {/* Streak Section */}
//       <View style={styles.card}>
//         <View style={styles.streakHeader}>
//           <Text style={styles.cardTitle}>Streak</Text>
//           <Animatable.View 
//             animation="pulse" 
//             easing="ease-out" 
//             iterationCount="infinite" 
//             style={styles.streakIconWrapper}
//           >
//             <MaterialCommunityIcons name="fire" size={32} color="#ff6b6b" />
//           </Animatable.View>
//         </View>
//         <Text style={styles.streakCounter}>🔥 {streak} Days</Text>

//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           <View style={{ flexDirection: "column" }}>

//             {/* Month Row */}
//             <View style={styles.monthRow}>
//               <View style={{ width: 46 }} /> 
//               {weeks.map((_, weekIndex) => {
//                 const marker = monthMarkers.find(m => m.weekIndex === weekIndex);
//                 return (
//                   <View key={weekIndex} style={{ width: 36, alignItems: "center" }}>
//                     {marker ? (
//                       <Text style={styles.monthText}>{marker.month}</Text>
//                     ) : null}
//                   </View>
//                 );
//               })}
//             </View>

//             <View style={{ flexDirection: "row" }}>
//               {/* Weekday labels */}
//               <View style={{ marginRight: 6, width: 46 }}>
//                 {weekdays.map((day) => (
//                   <View key={day} style={{ height: 36, justifyContent: "center" }}>
//                     <Text style={styles.weekdayText}>{day}</Text>
//                   </View>
//                 ))}
//               </View>

//               {/* Contribution Grid */}
//               <View style={{ flexDirection: "row" }}>
//                 {weeks.map((week, weekIndex) => (
//                   <View key={weekIndex} style={styles.weekColumn}>
//                     {week.map((date, dayIndex) => {
//                       const key = new Date(date.getTime() - date.getTimezoneOffset()*60000).toISOString().slice(0,10);
//                       const status = attendanceData[key] ?? null;
//                       return (
//                         <Pressable
//                           key={dayIndex}
//                           onPress={() => handleDayPress(date)}
//                         >
//                           <View
//                             style={[
//                               styles.dayBox,
//                               { backgroundColor: getStatusColor(status) }
//                             ]}
//                           >
//                             <Text style={styles.dayText}>{date.getDate()}</Text>
//                           </View>
//                         </Pressable>
//                       );
//                     })}
//                   </View>
//                 ))}
//               </View>
//             </View>
//           </View>
//         </ScrollView>
//       </View>
//     </ScrollView>
//     </View>

//   );
// };

// export default UserHome;

// const styles = StyleSheet.create({
//   safeContainer:{
//     flex: 1,
//     backgroundColor: "#f9fafb",
//   },
//   screen: {
//     flex: 1,
//     backgroundColor: "#f9fafb",
//   },
//   title: {
//     fontSize: 34,
//     fontWeight: "bold",
//     color: "#111827",
//     marginBottom: 20,
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
//     summaryText: {
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
//   monthRow: {
//     flexDirection: "row",
//     marginBottom: 6,
//     alignItems: "center",
//   },
//   monthText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#374151",
//   },
//   weekdayText: {
//     fontSize: 12,
//     color: "#6b7280",
//   },
//   weekColumn: {
//     flexDirection: "column",
//     marginHorizontal: 1,
//   },
//   dayBox: {
//     width: 36,
//     height: 36,
//     margin: 1,
//     borderRadius: 6,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   dayText: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#111827",
//   },
//   headerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: 16,
//     position: "relative",
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e5e7eb",
//     zIndex: 1000,
//   },
//   menuOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: 998,
//   },
//   menuContainer: {
//     position: "absolute",
//     top: 60,
//     right: 10,
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 8,
//     paddingVertical: 8,
//     paddingHorizontal: 4,
//     elevation: 10,
//     zIndex: 9999,
//     minWidth: 200,
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//   },
//   menuItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//   },
//   menuItemDanger: {
//     // Special styling for logout
//   },
//   menuIcon: {
//     marginRight: 12,
//   },
//   menuItemText: {
//     fontSize: 16,
//     color: "#374151",
//     fontWeight: "500",
//   },
//   menuItemTextDanger: {
//     color: "#ef4444",
//   },
//   menuDivider: {
//     height: 1,
//     backgroundColor: "#e5e7eb",
//     marginVertical: 4,
//   },

// });



// claude refinement over orginal settled font as above with refresh logic on the top

import { useAuth } from '@/app/contexts/AuthContext';
import { useClass } from '@/app/contexts/ClassContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Updated color mapping for string-based status
const COLORS = {
  present: "#22c55e",
  absent: "#ef4444",
  other: "#3b82f6",
  none: "#d1d5db"
};

/* -------------------------
   CalendarHeatmap Component
   -------------------------
   - Generates a Monday-first grid for the entire year
   - Month labels placed above respective week columns
   - Uses attendanceData keyed by YYYY-MM-DD with string status values
*/
function CalendarHeatmap({ year, attendanceData, onDayPress, colorScheme }) {
  const palette = colorScheme === 'dark'
    ? { monthText: '#94a3b8', weekdayText: '#6b7280', dayText: '#ffffff', noneColor: '#374151' }
    : { monthText: '#374151', weekdayText: '#6b7280', dayText: '#111827', noneColor: '#d1d5db' };

  // Generate days aligned to Monday
  const { weeks, monthMarkers } = useMemo(() => {
    const days = [];

    const start = new Date(year, 0, 1);
    let startWeekday = start.getDay();
    if (startWeekday === 0) startWeekday = 7;

    // Add leading nulls so first week starts on Monday
    for (let i = 1; i < startWeekday; i++) days.push(null);

    // Add all days of year
    const last = new Date(year, 11, 31);
    const totalDays = Math.floor((last - start) / 86400000) + 1;
    for (let i = 0; i < totalDays; i++) {
      days.push(new Date(year, 0, i + 1));
    }

    // Partition into weeks of 7
    const weekRows = [];
    let w = [];
    days.forEach((d) => {
      w.push(d);
      if (w.length === 7) {
        weekRows.push(w);
        w = [];
      }
    });
    if (w.length > 0) weekRows.push(w);

    // month markers: only when the first real date in the week has date === 1
    const markers = [];
weekRows.forEach((week, idx) => {
  const firstDayOfMonth = week.find(d => d !== null && d.getDate() === 1);
  if (firstDayOfMonth) {
    markers.push({ month: MONTHS[firstDayOfMonth.getMonth()], weekIndex: idx });
  }
});

    return { weeks: weekRows, monthMarkers: markers };
  }, [year]);

  const keyFor = (date) => {
    return new Date(date.getTime() - date.getTimezoneOffset()*60000).toISOString().slice(0,10);
  };

  return (
    <View style={{ marginTop: 10 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "column" }}>
          {/* Month labels row */}
          <View style={styles.monthRow}>
            <View style={{ width: 46 }} />
            {weeks.map((_, wIdx) => {
              const marker = monthMarkers.find(m => m.weekIndex === wIdx);
              return (
                <View key={wIdx} style={{ width: 36, alignItems: "center", marginHorizontal: 1 }}>
                  <Text style={[styles.monthText, { color: marker ? palette.monthText : 'transparent' }]}>
                    {marker ? marker.month : "   "}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Weekday labels + grid */}
          <View style={{ flexDirection: "row" }}>
            {/* Weekday labels column */}
            <View style={{ marginRight: 6, width: 46 }}>
              {WEEKDAYS.map(day => (
                <View key={day} style={{ height: 36, justifyContent: "center", marginBottom: 2 }}>
                  <Text style={[styles.weekdayText, { color: palette.weekdayText }]}>{day}</Text>
                </View>
              ))}
            </View>

            {/* Week columns */}
            <View style={{ flexDirection: "row" }}>
              {weeks.map((week, weekIndex) => (
                <View key={weekIndex} style={styles.weekColumn}>
                  {week.map((date, dIdx) => {
                    if (!date) {
                      return <View key={dIdx} style={[styles.dayBox, { backgroundColor: palette.noneColor }]} />;
                    }
                    const key = keyFor(date);
                    const status = attendanceData?.[key] ?? "none";
                    const bg = status === "none" ? palette.noneColor : (COLORS[status] ?? palette.noneColor);
                    return (
                      <Pressable 
                        key={dIdx} 
                        onPress={() => onDayPress && onDayPress(date)}
                        style={({ pressed }) => [
                          styles.dayBox, 
                          { 
                            backgroundColor: bg,
                            opacity: pressed ? 0.7 : 1,
                            marginBottom: 2
                          }
                        ]}
                      >
                        <Text style={[styles.dayText, { color: palette.dayText }]}>{date.getDate()}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* ------------------------
   Full UserHome component
   ------------------------ */
const UserHome = () => {
  const { user, logout, apiCall } = useAuth();
  const { selectedClass, attendanceData, setAttendanceData, refreshTrigger } = useClass();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const palette = colorScheme === 'dark'
    ? { bg: '#0b0f14', card: '#0f172a', text: '#e5e7eb', subtext:'#94a3b8', border:'#1f2937', menuBg: '#0f172a' }
    : { bg: '#f9fafb', card: '#ffffff', text: '#111827', subtext:'#374151', border:'#e5e7eb', menuBg: '#ffffff' };

  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);

  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [totalUnMarked, setTotalUnMarked] = useState(0);
  const [currentWeekPresent, setCurrentWeekPresent] = useState(0);
  const [currentWeekAbsent, setCurrentWeekAbsent] = useState(0);
  const [currentWeekUnMarked, setCurrentWeekUnMarked] = useState(0);
  const [todayStatus, setTodayStatus] = useState("Not marked");

  const API = Constants.expoConfig?.extra?.API_URL || 'https://streak-app-uxyv.onrender.com';
  const YEAR = new Date().getFullYear();

  console.log("USER HOME --- selected class is ", selectedClass);

  // Convert backend calendar array into map { "YYYY-MM-DD": "present" | "absent" | "other" }
  const mapCalendarToAttendance = (calendarArray=[]) => {
    const mapped = {};
    (calendarArray || []).forEach(({ date, status }) => {
      if (!date) return;
      const normalized = status === 'present' ? 'present' :
                         status === 'absent' ? 'absent' : 'other';
      mapped[date] = normalized;
    });
    return mapped;
  };

  // Fetch all data - runs on mount and when refreshTrigger changes
  useEffect(() => {
    if (!selectedClass) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const loadAll = async () => {
      try {
        setLoading(true);
        
        // Quick summary
        const quick = await apiCall(`${API}/user/quickSummary/${selectedClass.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        // console.log("Quick Summary ", quick);

        if (mounted && quick?.quick_summary) {
          setTotalPresent(quick.quick_summary.total_present ?? 0);
          setTotalAbsent(quick.quick_summary.total_absent ?? 0);
          setTotalUnMarked(quick.quick_summary.total_not_marked ?? 0);
          setCurrentWeekPresent(quick.quick_summary.current_week_present ?? 0);
          setCurrentWeekAbsent(quick.quick_summary.current_week_absent ?? 0);
          setCurrentWeekUnMarked(quick.quick_summary.current_week_not_marked ?? 0);
          setTodayStatus(quick.quick_summary.today_status ?? "Not marked");
        }

        // Calendar
        const calResp = await apiCall(`${API}/user/calendar/${selectedClass.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        // console.log("Calendar looks like this ", calResp);

        const mapped = mapCalendarToAttendance(calResp?.calendar || []);
        if (mounted) {
          setAttendanceData(mapped);
        }

        // Streak
        const streakResp = await apiCall(`${API}/user/streak/${selectedClass.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        // console.log("Streak response: ", streakResp);
        if (mounted) {
          setStreak(streakResp?.currentStreak ?? 0);
          setBestStreak(streakResp?.bestStreak ?? 0);
        }

      } catch (e) {
        console.error("Failed to load user home data:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadAll();

    return () => { mounted = false; };
  }, [selectedClass, refreshTrigger]); // Added refreshTrigger to dependencies

  // Handle day press
  const handleDayPress = (date) => {
    if (!date) return;
    const key = new Date(date.getTime() - date.getTimezoneOffset()*60000).toISOString().slice(0,10);
    const status = attendanceData[key] ?? "none";
    
    let message;
    if (status === 'present') message = "✅ Present";
    else if (status === 'absent') message = "❌ Absent";
    else if (status === 'other') message = "ℹ️ Other (Genuine Reason)";
    else message = "No data available";

    Alert.alert(`Date: ${key}`, message);
  };

  // Profile button handlers
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: async () => { await logout(); } }
      ]
    );
  };

  const handleEditProfile = async () => {
    setMenuVisible(false);
    router.push("/(app)/(user)/editProfile");
  };

  const handleAboutPage = async () => {
    setMenuVisible(false);
    router.push("/(app)/(user)/about");
  };

  const firstName = user?.firstName || user?.userName || "User";

  // Calculate percentages
  const total = totalPresent + totalAbsent + totalUnMarked;
  const percentages = total === 0 ? {present: 0, absent: 0, other: 0} : {
    present: ((totalPresent/total)*100).toFixed(1),
    absent: ((totalAbsent/total)*100).toFixed(1),
    other: ((totalUnMarked/total)*100).toFixed(1),
  };

  if (loading) {
    return (
      <View style={[styles.safeContainer, { paddingTop: insets.top, backgroundColor: palette.bg, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: palette.text, fontSize: 16 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.safeContainer, {paddingTop:insets.top, backgroundColor: palette.bg}]}>
      {/* Header */}
      <View style={[styles.headerContainer, { backgroundColor: palette.card, borderBottomColor: palette.border }]}>
        <Text style={[styles.title, {color: palette.text}]}>👋 Hi, {firstName}!</Text>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <MaterialCommunityIcons name="account-circle" size={32} color="#ff6b6b" />
        </TouchableOpacity>

        {menuVisible && (
          <>
            <TouchableOpacity
              style={styles.menuOverlay}
              onPress={() => setMenuVisible(false)}
              activeOpacity={1}
            />
            <View style={[styles.menuContainer, {backgroundColor: palette.menuBg, borderColor: palette.border}]}>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={handleEditProfile}
              >
                <MaterialCommunityIcons name="account-edit" size={20} color={palette.text} style={styles.menuIcon} />
                <Text style={[styles.menuItemText, {color: palette.text}]}>Edit Profile</Text>
              </TouchableOpacity>
              <View style={[styles.menuDivider, { backgroundColor: palette.border }]} />
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={handleAboutPage}
              >
                <MaterialCommunityIcons name="information" size={20} color={palette.text} style={styles.menuIcon} />
                <Text style={[styles.menuItemText, {color: palette.text}]}>About Application</Text>
              </TouchableOpacity>
              <View style={[styles.menuDivider, { backgroundColor: palette.border }]} />
              <TouchableOpacity 
                style={[styles.menuItem, styles.menuItemDanger]} 
                onPress={handleLogout}
              >
                <MaterialCommunityIcons name="logout" size={20} color="#ef4444" style={styles.menuIcon} />
                <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        {/* Welcome Box */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <Text style={[styles.cardTitle, { color: palette.text }]}>Welcome to {selectedClass?.name || '—'}</Text>
        </View>

        {/* Quick Summary */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <Text style={[styles.cardTitle, { color: palette.text }]}>Quick Summary</Text>
          <View style={[styles.innerBox, { backgroundColor: colorScheme === 'dark' ? '#1e293b' : '#f3f4f6' }]}>
            <Text style={[styles.summaryText, { color: palette.text }]}>🔥 Best Streak: {bestStreak} days</Text>

            <Text style={[styles.summarySubTitle, { color: palette.text }]}>📅 Current Week</Text>
            <Text style={[styles.summaryText, { color: palette.text }]}>
              Present: {currentWeekPresent} | Absent: {currentWeekAbsent} | Other: {currentWeekUnMarked}
            </Text>

            <Text style={[styles.summarySubTitle, { color: palette.text }]}>📊 Total</Text>
            <Text style={[styles.summaryText, { color: palette.text }]}>
              Present: {totalPresent} | Absent: {totalAbsent} | Other: {totalUnMarked}
            </Text>

            <Text style={[styles.summarySubTitle, { color: palette.text }]}>📈 Percentages</Text>
            <Text style={[styles.summaryText, { color: palette.text }]}>
              Present: {percentages.present}% | Absent: {percentages.absent}% | Other: {percentages.other}%
            </Text>
          </View>
        </View>

        {/* Streak Section with Calendar */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <View style={styles.streakHeader}>
            <Text style={[styles.cardTitle, { color: palette.text }]}>Streak</Text>
            <Animatable.View 
              animation="pulse" 
              easing="ease-out" 
              iterationCount="infinite" 
              style={styles.streakIconWrapper}
            >
              <MaterialCommunityIcons name="fire" size={32} color="#ff6b6b" />
            </Animatable.View>
          </View>
          <Text style={styles.streakCounter}>🔥 {streak} Days</Text>

          {/* Calendar Heatmap */}
          <CalendarHeatmap
            year={YEAR}
            attendanceData={attendanceData}
            onDayPress={handleDayPress}
            colorScheme={colorScheme}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default UserHome;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  screen: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
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
  monthRow: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "center",
  },
  monthText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  weekdayText: {
    fontSize: 12,
    color: "#6b7280",
  },
  weekColumn: {
    flexDirection: "column",
    marginHorizontal: 1,
  },
  dayBox: {
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    position: "relative",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    zIndex: 1000,
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 998,
  },
  menuContainer: {
    position: "absolute",
    top: 60,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    elevation: 10,
    zIndex: 9999,
    minWidth: 200,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  menuItemDanger: {
    // Special styling for logout
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  menuItemTextDanger: {
    color: "#ef4444",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 4,
  },
});