// // claude imporved code
// // adminStreak.jsx - Complete Fixed Version
// import { useAuth } from '@/app/contexts/AuthContext';
// import { useClass } from '@/app/contexts/ClassContext';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import Constants from 'expo-constants';
// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { Alert, LayoutAnimation, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
// import * as Animatable from 'react-native-animatable';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// // Enable LayoutAnimation on Android
// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// const STATUS_CONFIG = {
//   present: { color: "#22c55e", icon: "check-circle", label: "Present", gradient: ["#22c55e", "#16a34a"] },
//   absent: { color: "#ef4444", icon: "close-circle", label: "Absent", gradient: ["#ef4444", "#dc2626"] },
//   other: { color: "#3b82f6", icon: "information", label: "Other", gradient: ["#3b82f6", "#2563eb"] },
//   none: { color: "#d1d5db", icon: "circle-outline", label: "No Data", gradient: ["#e5e7eb", "#d1d5db"] }
// };


// /* -------------------------
//    Enhanced CalendarHeatmap Component
//    ------------------------- */
// function CalendarHeatmap({ year, attendanceData, onDayPress, colorScheme }) {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [currentYear, setCurrentYear] = useState(year);
  
//   const isDark = colorScheme === 'dark'
  
//   const formatDateKey = (date) => {
//     if (!date) return '';
//     return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
//       .toISOString()
//       .slice(0, 10);
//   };;
  
//   const palette = isDark
//     ? { 
//         monthText: '#94a3b8', 
//         weekdayText: '#6b7280', 
//         dayText: '#ffffff', 
//         noneColor: '#374151',
//         cardBg: '#1e293b',
//         border: '#334155',
//         todayBorder: '#fbbf24'
//       }
//     : { 
//         monthText: '#374151', 
//         weekdayText: '#6b7280', 
//         dayText: '#111827', 
//         noneColor: '#e5e7eb',
//         cardBg: '#ffffff',
//         border: '#e5e7eb',
//         todayBorder: '#f59e0b'
//       };

//   const today = new Date();
//   const todayKey = formatDateKey(today);

//   const { weeks, monthMarkers } = useMemo(() => {
//     const days = [];
//     const start = new Date(currentYear, 0, 1);
//     let startWeekday = start.getDay();
//     if (startWeekday === 0) startWeekday = 7;

//     for (let i = 1; i < startWeekday; i++) days.push(null);

//     const totalDays = (new Date(currentYear, 11, 31) - start) / 86400000 + 1;
//     for (let i = 0; i < totalDays; i++) {
//       days.push(new Date(currentYear, 0, i + 1));
//     }

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

//     const markers = [];
//     weekRows.forEach((week, idx) => {
//       const firstDayOfMonth = week.find(d => d !== null && d.getDate() === 1);
//       if (firstDayOfMonth) {
//         markers.push({ month: MONTHS[firstDayOfMonth.getMonth()], weekIndex: idx });
//       }
//     });

//     return { weeks: weekRows, monthMarkers: markers };
//   }, [currentYear]);

  

//   const formatDateDisplay = (date) => {
//     if (!date) return '';
//     const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//     return date.toLocaleDateString('en-US', options);
//   };

//   const handleDayPress = useCallback((date) => {
//     if (!date) return;
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     setSelectedDate(selectedDate && formatDateKey(selectedDate) === formatDateKey(date) ? null : date);
//     onDayPress && onDayPress(date);
//   }, [selectedDate, onDayPress]);

//   const navigateYear = (direction) => {
//     LayoutAnimation.configureNext({
//       duration: 300,
//       create: { type: 'easeInEaseOut', property: 'opacity' },
//       update: { type: 'easeInEaseOut' },
//       delete: { type: 'easeInEaseOut', property: 'opacity' }
//     });
//     setCurrentYear(prev => prev + direction);
//     setSelectedDate(null);
//   };

//   // Calculate stats
//   const stats = useMemo(() => {
//     let total = 0, present = 0, absent = 0, other = 0;
//     Object.values(attendanceData || {}).forEach(status => {
//       total++;
//       if (status === 'present') present++;
//       else if (status === 'absent') absent++;
//       else other++;
//     });
//     return { total, present, absent, other };
//   }, [attendanceData]);

//   return (
//     <View style={styles.calendarContainer}>
//       {/* Year Navigation */}
//       <View style={styles.yearNavigation}>
//         <TouchableOpacity 
//           onPress={() => navigateYear(-1)}
//           style={[styles.navButton, { backgroundColor: palette.cardBg, borderColor: palette.border }]}
//         >
//           <MaterialCommunityIcons name="chevron-left" size={20} color={palette.monthText} />
//         </TouchableOpacity>
//         <Text style={[styles.yearText, { color: palette.monthText }]}>{currentYear}</Text>
//         <TouchableOpacity 
//           onPress={() => navigateYear(1)}
//           style={[styles.navButton, { backgroundColor: palette.cardBg, borderColor: palette.border }]}
//         >
//           <MaterialCommunityIcons name="chevron-right" size={20} color={palette.monthText} />
//         </TouchableOpacity>
//       </View>

//       {/* Legend */}
//       <View style={styles.legendContainer}>
//         {Object.entries(STATUS_CONFIG).map(([key, config]) => (
//           <View key={key} style={styles.legendItem}>
//             <View style={[styles.legendDot, { backgroundColor: config.color }]} />
//             <Text style={[styles.legendText, { color: palette.weekdayText }]}>
//               {config.label}
//             </Text>
//           </View>
//         ))}
//       </View>

//       {/* Stats Bar */}
//       <View style={[styles.statsBar, { backgroundColor: palette.cardBg, borderColor: palette.border }]}>
//         <Text style={[styles.statsText, { color: palette.weekdayText }]}>
//           🟢 {stats.present}  🔴 {stats.absent}  🔵 {stats.other}  ⚪ {stats.total ? (365 - stats.total) : 365}
//         </Text>
//       </View>

//       {/* Calendar Grid */}
//       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//         <View style={styles.calendarGrid}>
//           {/* Month labels row */}
//           <View style={styles.monthRow}>
//             <View style={{ width: 48 }} />
//             {weeks.map((_, wIdx) => {
//               const marker = monthMarkers.find(m => m.weekIndex === wIdx);
//               return (
//                 <View key={wIdx} style={styles.monthLabelCell}>
//                   <Text style={[
//                     styles.monthText, 
//                     { 
//                       color: marker ? palette.monthText : 'transparent',
//                       fontWeight: marker ? '700' : '400'
//                     }
//                   ]}>
//                     {marker ? marker.month : "   "}
//                   </Text>
//                 </View>
//               );
//             })}
//           </View>

//           {/* Weekday labels + grid */}
//           <View style={{ flexDirection: "row" }}>
//             <View style={styles.weekdayLabels}>
//               {WEEKDAYS.map(day => (
//                 <View key={day} style={styles.weekdayCell}>
//                   <Text style={[styles.weekdayText, { color: palette.weekdayText }]}>{day}</Text>
//                 </View>
//               ))}
//             </View>

//             {/* Week columns */}
//             <View style={styles.weekColumns}>
//               {weeks.map((week, weekIndex) => (
//                 <View key={weekIndex} style={styles.weekColumn}>
//                   {week.map((date, dIdx) => {
//                     if (!date) {
//                       return <View key={dIdx} style={[styles.dayBox, { backgroundColor: 'transparent' }]} />;
//                     }
                    
//                     const key = formatDateKey(date);
//                     const status = attendanceData?.[key] ?? "none";
//                     const isToday = key === todayKey;
//                     const isSelected = selectedDate && formatDateKey(selectedDate) === key;
                    
//                     return (
//                       <Pressable 
//                         key={dIdx} 
//                         onPress={() => handleDayPress(date)}
//                         style={({ pressed }) => [
//                           styles.dayBox,
//                           {
//                             backgroundColor: STATUS_CONFIG[status].color,
//                             borderWidth: isToday ? 2 : isSelected ? 2 : 0,
//                             borderColor: isToday ? palette.todayBorder : isSelected ? palette.monthText : 'transparent',
//                             transform: [{ scale: pressed ? 0.92 : 1 }],
//                             shadowColor: isToday ? '#fbbf24' : 'transparent',
//                             shadowOffset: { width: 0, height: 0 },
//                             shadowOpacity: isToday ? 0.5 : 0,
//                             shadowRadius: isToday ? 4 : 0,
//                             elevation: isToday ? 4 : 0,
//                           }
//                         ]}
//                       >
//                         <Text style={[
//                           styles.dayText, 
//                           { 
//                             color: status === 'none' ? palette.monthText : '#ffffff',
//                             fontWeight: isToday ? '800' : '600'
//                           }
//                         ]}>
//                           {date.getDate()}
//                         </Text>
//                         {isToday && (
//                           <View style={styles.todayDot} />
//                         )}
//                       </Pressable>
//                     );
//                   })}
//                 </View>
//               ))}
//             </View>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Selected Day Detail */}
//       {selectedDate && (
//         <Animatable.View 
//           animation="fadeInUp" 
//           duration={300}
//           style={[styles.dayDetail, { backgroundColor: palette.cardBg, borderColor: palette.border }]}
//         >
//           <MaterialCommunityIcons 
//             name={STATUS_CONFIG[attendanceData?.[formatDateKey(selectedDate)] ?? 'none'].icon}
//             size={24} 
//             color={STATUS_CONFIG[attendanceData?.[formatDateKey(selectedDate)] ?? 'none'].color}
//           />
//           <View style={styles.dayDetailText}>
//             <Text style={[styles.dayDetailDate, { color: palette.monthText }]}>
//               {formatDateDisplay(selectedDate)}
//             </Text>
//             <Text style={[styles.dayDetailStatus, { 
//               color: STATUS_CONFIG[attendanceData?.[formatDateKey(selectedDate)] ?? 'none'].color 
//             }]}>
//               {STATUS_CONFIG[attendanceData?.[formatDateKey(selectedDate)] ?? 'none'].label}
//             </Text>
//           </View>
//         </Animatable.View>
//       )}
//     </View>
//   );
// }

// /* ------------------------
//    Full AdminStreak component
//    ------------------------ */
// const AdminStreak = () => {
//   const insets = useSafeAreaInsets();
//   const colorScheme = useColorScheme();
//   const palette = colorScheme === 'dark'
//     ? { bg:'#0b0f14', card:'#0f172a', text:'#e5e7eb', sub:'#94a3b8', border:'#1f2937' }
//     : { bg:'#f9fafb', card:'#ffffff', text:'#111827', sub:'#374151', border:'#e5e7eb' };
  
//   const [isjoined, setJoined] = useState(null); 
//   const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);
//   const [isReportView, setIsReportView] = useState(null); 
//   const [currentMonth, setCurrentMonth] = useState({ present: 0, absent: 0, other: 0 });
//   const [currentYear, setCurrentYear] = useState({ present: 0, absent: 0, other: 0 });
//   const [attendanceData, setAttendanceData] = useState({});
//   const [streak, setStreak] = useState(0);
//   const [bestStreak, setBestStreak] = useState(0);
  
//   const API = Constants.expoConfig.extra.API_URL;
//   const { apiCall } = useAuth();
//   const { selectedClass } = useClass();
//   const YEAR = new Date().getFullYear();
  
//   // Convert backend calendar array into map { "YYYY-MM-DD": "present" | "absent" | "other" }
//   const mapCalendarToAttendance = (calendarArray = []) => {
//     const mapped = {};
//     (calendarArray || []).forEach(({ date, status }) => {
//       if (!date) return;
//       const normalized = status === 'present' ? 'present' :
//                          status === 'absent' ? 'absent' : 'other';
//       mapped[date] = normalized;
//     });
//     return mapped;
//   };
  
//   // Load all data when component mounts or selectedClass changes
//   useEffect(() => {
//     if (!selectedClass) return;
    
//     let mounted = true;
    
//     const loadAll = async () => {
//       try {
//         // Calendar
//         const cal = await apiCall(`${API}/admin/calendar/${selectedClass.id}`, {
//           method: 'GET',
//           headers: { 'Content-Type': 'application/json' },
//         });
        
//         const mapped = mapCalendarToAttendance(cal?.calendar || []);
//         if (mounted) setAttendanceData(mapped);
        
//         // Check if today is already marked
//         const todayKey = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)
//           .toISOString()
//           .slice(0, 10);
//         const todayRec = (cal?.calendar || []).find((c) => c.date === todayKey);
//         if (todayRec && mounted) {
//           setAttendanceSubmitted(true);
//           setJoined(todayRec.status === 'present');
//         }
        
//         // Personal Report
//         const personalReport = await apiCall(`${API}/admin/personalReport/${selectedClass.id}`, {
//           method: 'GET',
//           headers: { "Content-Type": "application/json" },
//         });
        
//         if (mounted && personalReport?.personal_report) {
//           const cm = personalReport.personal_report.current_month;
//           const cy = personalReport.personal_report.current_year;
//           setCurrentMonth({
//             present: cm.present,
//             absent: cm.absent,
//             other: cm.not_marked,
//           });
//           setCurrentYear({
//             present: cy.present,
//             absent: cy.absent,
//             other: cy.not_marked,
//           });
//         }
        
//         // Streak
//         const streakResp = await apiCall(`${API}/admin/streak/${selectedClass.id}`, {
//           method: 'GET',
//           headers: { 'Content-Type': 'application/json' },
//         });
        
//         if (mounted && streakResp) {
//           setStreak(streakResp.currentStreak ?? 0);
//           setBestStreak(streakResp.bestStreak ?? 0);
//         }
        
//       } catch (e) {
//         console.error("Error loading admin streak data:", e);
//       }
//     };
    
//     loadAll();
    
//     return () => { mounted = false; };
//   }, [selectedClass]);
  
//   const handleDayPress = (date) => {
//     if (!date) return;
//     const key = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
//       .toISOString()
//       .slice(0, 10);
//     const status = attendanceData[key] ?? "none";
//     let message;
//     if (status === 'present') message = "✅ Present";
//     else if (status === 'absent') message = "❌ Absent";
//     else if (status === 'other') message = "ℹ️ Other";
//     else message = "No data available";
//     Alert.alert(`Date: ${key}`, message);
//   };
  
//   const todayDate = new Date().toLocaleDateString();
  
//   // Render functions
//   const renderJoinedSummary = () => (
//     <>
//       <Text style={[styles.cardTitle, { color: palette.text }]}>Attendance Summary</Text>
//       <Text style={[styles.summaryText, { color: palette.text }]}>
//         You have joined today's class. Great job!
//       </Text>
      
//       <TouchableOpacity
//         style={styles.submitButton}
//         disabled={attendanceSubmitted}
//         onPress={async () => {
//           const todayKey = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)
//             .toISOString()
//             .slice(0, 10);
//           try {
//             await apiCall(`${API}/admin/markAttendance/${selectedClass.id}`, {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ status: 'present' }),
//             });
//             setAttendanceData(prev => ({ ...prev, [todayKey]: 'present' }));
//             setAttendanceSubmitted(true);
//           } catch (e) {
//             Alert.alert('Error', e.message || 'Failed to mark attendance');
//           }
//         }}
//       >
//         <Text style={styles.submitText}>Submit</Text>
//       </TouchableOpacity>
//     </>
//   );
  
//   const renderExcuseForm = () => (
//     <>
//       <Text style={[styles.summaryText, { color: palette.text }]}>
//         You didn't join today's class? No worries, it happens sometimes
//       </Text>
//       <TouchableOpacity
//         style={styles.submitButton}
//         onPress={async () => {
//           const todayKey = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)
//             .toISOString()
//             .slice(0, 10);
//           try {
//             await apiCall(`${API}/admin/markAttendance/${selectedClass.id}`, {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ status: 'absent' }),
//             });
//             setAttendanceData(prev => ({ ...prev, [todayKey]: 'absent' }));
//             setAttendanceSubmitted(true);
//           } catch (e) {
//             Alert.alert('Error', e.message || 'Failed to mark attendance');
//           }
//         }}
//       >
//         <Text style={styles.submitText}>Submit</Text>
//       </TouchableOpacity>
//     </>
//   );
  
//   const renderAttendanceConfirmation = () => (
//     <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
//       <Text style={[styles.cardTitle, { color: palette.text }]}>Attendance Marked</Text>
//       <Text style={[styles.summaryText, { color: palette.text }]}>
//         You have marked your attendance for {todayDate} as{" "}
//         {isjoined ? "✅ Present" : "❌ Absent"}
//       </Text>
//     </View>
//   );
  
//   const renderMonthlyReport = () => (
//     <>
//       <Text style={[styles.cardTitle, { color: palette.text }]}>Monthly Report</Text>
//       <Text style={[styles.summaryText, { color: palette.text }]}>
//         Total Classes Joined: {currentMonth.present}
//       </Text>
//       <Text style={[styles.summaryText, { color: palette.text }]}>
//         Total Classes Missed: {currentMonth.absent}
//       </Text>
//       <View style={styles.streakHeader}>
//         <Text style={styles.streakCounter}>Current Streak: {streak} days</Text>
//         <View style={styles.streakIconWrapper}>
//           <Text style={{ fontSize: 24 }}>🔥</Text>
//         </View>
//       </View>
//     </>
//   );
  
//   const renderYearlyReport = () => (
//     <>
//       <Text style={[styles.cardTitle, { color: palette.text }]}>Yearly Report</Text>
//       <Text style={[styles.summaryText, { color: palette.text }]}>
//         Total Classes Joined: {currentYear.present}
//       </Text>
//       <Text style={[styles.summaryText, { color: palette.text }]}>
//         Total Classes Missed: {currentYear.absent}
//       </Text>
//       <View style={styles.streakHeader}>
//         <Text style={styles.streakCounter}>Best Streak: {bestStreak} days</Text>
//         <View style={styles.streakIconWrapper}>
//           <Text style={{ fontSize: 24 }}>🔥</Text>
//         </View>
//       </View>
//     </>
//   );
  
//   return (
//     <View style={[styles.safeContainer, { paddingTop: insets.top, backgroundColor: palette.bg }]}>
//       <ScrollView 
//         style={{ flex: 1 }} 
//         contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
//       >
//         <Text style={[styles.title, { color: palette.text }]}>Today's Attendance</Text>
        
//         {/* Class Entry */}
//         {!attendanceSubmitted && (
//           <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
//             <Text style={[styles.cardTitle, { color: palette.text }]}>Class Entry</Text>
//             <View style={[styles.innerBox, { backgroundColor: colorScheme === 'dark' ? '#111827' : '#f3f4f6' }]}>
//               <Text style={[styles.cardText, { color: palette.text }]}>Joined Today's Class?</Text>
//               <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
//                 <TouchableOpacity
//                   style={[
//                     styles.yesButton,
//                     isjoined === true && { backgroundColor: "#4ade80" }
//                   ]}
//                   onPress={() => setJoined(isjoined === true ? null : true)}
//                 >
//                   <Text style={{ color: "white", fontWeight: "600" }}>Yes, I did!</Text>
//                 </TouchableOpacity>
                
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
//           <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
//             {isjoined ? renderJoinedSummary() : renderExcuseForm()}
//           </View>
//         )}
//         {attendanceSubmitted && renderAttendanceConfirmation()}
        
//         {/* Report Section */}
//         <View style={[styles.card, { backgroundColor: palette.card, borderWidth: 1, borderColor: palette.border }]}>
//           <Text style={[styles.cardTitle, { color: palette.text }]}>Report</Text>
//           <View style={[styles.innerBox, { backgroundColor: colorScheme === 'dark' ? '#111827' : '#f3f4f6' }]}>
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
//           <View style={[styles.card, { backgroundColor: palette.card, borderWidth: 1, borderColor: palette.border }]}>
//             {isReportView ? renderMonthlyReport() : renderYearlyReport()}
//           </View>
//         )}
        
//         {/* Streak Graph */}
//         {/* <View style={[styles.card, { backgroundColor: palette.card, borderWidth: 1, borderColor: palette.border }]}>
//           <View style={styles.streakHeader}>
//             <Text style={[styles.cardTitle, { color: palette.text }]}>Streak</Text>
//             <Animatable.View 
//               animation="pulse" 
//               easing="ease-out" 
//               iterationCount="infinite" 
//               style={styles.streakIconWrapper}
//             >
//               <MaterialCommunityIcons name="fire" size={32} color="#ff6b6b" />
//             </Animatable.View>
//           </View>
//           <Text style={[styles.streakCounter, { color: colorScheme === 'dark' ? '#fca5a5' : '#ef4444' }]}>
//             🔥 {streak} Days
//           </Text> */}
          
//           {/* Calendar Heatmap */}
//           <Animatable.View 
//             animation="fadeInUp" 
//             duration={600} 
//             delay={200}
//             style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}
//           >
//             <View style={styles.calendarHeader}>
//               <Text style={[styles.cardTitle, { color: palette.text }]}>Activity Calendar</Text>
//               <MaterialCommunityIcons name="calendar-month" size={24} color={palette.subtext} />
//             </View>
            
//             <CalendarHeatmap
//               year={YEAR}
//               attendanceData={attendanceData}
//               onDayPress={handleDayPress}
//               colorScheme={colorScheme}
//             />
//           </Animatable.View>
//         {/* </View> */}
//       </ScrollView>
//     </View>
//   );
// };

// export default AdminStreak;

// /* -------------------------
//    Styles
//    ------------------------- */
// const styles = StyleSheet.create({
//   safeContainer: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "700",
//     marginBottom: 20,
//   },
//   yesButton: {
//     marginTop: 12,
//     marginBottom: 14,
//     backgroundColor: "#b8ea69ff",
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: "center",
//     width: 120,
//   },
//   reportButton: {
//     marginTop: 12,
//     marginBottom: 14,
//     backgroundColor: "#b567e5ff",
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: "center",
//     width: 120,
//   },
//   noButton: {
//     marginTop: 12,
//     marginBottom: 14,
//     backgroundColor: "#b42953ff",
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: "center",
//     width: 120,
//   },
//   card: {
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
//     marginVertical: 2,
//   },
//   cardText: {
//     fontSize: 14,
//     color: "#374151",
//     textAlign: "center",
//   },
//   innerBox: {
//     borderRadius: 8,
//     padding: 10,
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
//     marginVertical: 12,
//     textAlign: "center",
//   },
//   monthRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 6,
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
//   // Special styling for logout
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
//   streakContainer: {
//   flexDirection: 'row',
//   borderRadius: 16,
//   padding: 16,
//   marginBottom: 16,
//   gap: 16,
// },
//   streakItem: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   streakTextContainer: {
//     flex: 1,
//   },
//   streakValue: {
//     fontSize: 24,
//     fontWeight: "800",
//   },
//   streakLabel: {
//     fontSize: 12,
//     fontWeight: "500",
//     marginTop: 2,
//   },
//   streakDivider: {
//     width: 1,
//     height: '100%',
//   },
//   // Calendar Styles
//   calendarContainer: {
//     marginTop: 8,
//   },
//   yearNavigation: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//     gap: 12,
//   },
//   navButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//   },
//   yearText: {
//     fontSize: 18,
//     fontWeight: '700',
//   },
//   legendContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 16,
//     marginBottom: 12,
//     flexWrap: 'wrap',
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   legendDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 3,
//   },
//   legendText: {
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   statsBar: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     padding: 8,
//     borderRadius: 8,
//     marginBottom: 12,
//     borderWidth: 1,
//   },
//   statsText: {
//     fontSize: 13,
//     fontWeight: '600',
//     letterSpacing: 2,
//   },
//   calendarGrid: {
//     flexDirection: "column",
//   },
//   monthRow: {
//     flexDirection: "row",
//     marginBottom: 8,
//     alignItems: "center",
//   },
//   monthText: {
//     fontSize: 12,
//     fontWeight: "600",
//     letterSpacing: 0.5,
//   },
//   monthLabelCell: {
//     width: 38,
//     alignItems: "center",
//     marginHorizontal: 1.5,
//   },
//   weekdayLabels: {
//     marginRight: 8,
//     width: 48,
//   },
//   weekdayCell: {
//     height: 38,
//     justifyContent: "center",
//     marginBottom: 3,
//   },
//   weekdayText: {
//     fontSize: 11,
//     fontWeight: "600",
//   },
//   weekColumns: {
//     flexDirection: "row",
//   },
//   weekColumn: {
//     flexDirection: "column",
//     marginHorizontal: 1.5,
//   },
//   dayBox: {
//     width: 38,
//     height: 38,
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 3,
//   },
//   dayText: {
//     fontSize: 12,
//     fontWeight: "700",
//   },
//   todayDot: {
//     position: 'absolute',
//     bottom: 4,
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: '#ffffff',
//   },
//   dayDetail: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     borderRadius: 12,
//     marginTop: 12,
//     borderWidth: 1,
//     gap: 12,
//   },
//   dayDetailText: {
//     flex: 1,
//   },
//   dayDetailDate: {
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   dayDetailStatus: {
//     fontSize: 16,
//     fontWeight: '700',
//     marginTop: 2,
//   },
// });





// adminStreak.jsx - Calendar and personal data refreshes after attendance mark
import { useAuth } from '@/app/contexts/AuthContext';
import { useClass } from '@/app/contexts/ClassContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, LayoutAnimation, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const STATUS_CONFIG = {
  present: { color: "#22c55e", icon: "check-circle", label: "Present", gradient: ["#22c55e", "#16a34a"] },
  absent: { color: "#ef4444", icon: "close-circle", label: "Absent", gradient: ["#ef4444", "#dc2626"] },
  other: { color: "#3b82f6", icon: "information", label: "Other", gradient: ["#3b82f6", "#2563eb"] },
  none: { color: "#d1d5db", icon: "circle-outline", label: "No Data", gradient: ["#e5e7eb", "#d1d5db"] }
};

/* -------------------------
   CalendarHeatmap Component (unchanged)
   ------------------------- */
function CalendarHeatmap({ year, attendanceData, onDayPress, colorScheme }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentYear, setCurrentYear] = useState(year);
  
  const isDark = colorScheme === 'dark';
  
  const formatDateKey = (date) => {
    if (!date) return '';
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  };
  
  const palette = isDark
    ? { 
        monthText: '#94a3b8', 
        weekdayText: '#6b7280', 
        dayText: '#ffffff', 
        noneColor: '#374151',
        cardBg: '#1e293b',
        border: '#334155',
        todayBorder: '#fbbf24'
      }
    : { 
        monthText: '#374151', 
        weekdayText: '#6b7280', 
        dayText: '#111827', 
        noneColor: '#e5e7eb',
        cardBg: '#ffffff',
        border: '#e5e7eb',
        todayBorder: '#f59e0b'
      };

  const today = new Date();
  const todayKey = formatDateKey(today);

  const { weeks, monthMarkers } = useMemo(() => {
    const days = [];
    const start = new Date(currentYear, 0, 1);
    let startWeekday = start.getDay();
    if (startWeekday === 0) startWeekday = 7;

    for (let i = 1; i < startWeekday; i++) days.push(null);

    const totalDays = (new Date(currentYear, 11, 31) - start) / 86400000 + 1;
    for (let i = 0; i < totalDays; i++) {
      days.push(new Date(currentYear, 0, i + 1));
    }

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

    const markers = [];
    weekRows.forEach((week, idx) => {
      const firstDayOfMonth = week.find(d => d !== null && d.getDate() === 1);
      if (firstDayOfMonth) {
        markers.push({ month: MONTHS[firstDayOfMonth.getMonth()], weekIndex: idx });
      }
    });

    return { weeks: weekRows, monthMarkers: markers };
  }, [currentYear]);

  const formatDateDisplay = (date) => {
    if (!date) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleDayPress = useCallback((date) => {
    if (!date) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedDate(selectedDate && formatDateKey(selectedDate) === formatDateKey(date) ? null : date);
    onDayPress && onDayPress(date);
  }, [selectedDate, onDayPress]);

  const navigateYear = (direction) => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'easeInEaseOut' },
      delete: { type: 'easeInEaseOut', property: 'opacity' }
    });
    setCurrentYear(prev => prev + direction);
    setSelectedDate(null);
  };

  const stats = useMemo(() => {
    let total = 0, present = 0, absent = 0, other = 0;
    Object.values(attendanceData || {}).forEach(status => {
      total++;
      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else other++;
    });
    return { total, present, absent, other };
  }, [attendanceData]);

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.yearNavigation}>
        <TouchableOpacity 
          onPress={() => navigateYear(-1)}
          style={[styles.navButton, { backgroundColor: palette.cardBg, borderColor: palette.border }]}
        >
          <MaterialCommunityIcons name="chevron-left" size={20} color={palette.monthText} />
        </TouchableOpacity>
        <Text style={[styles.yearText, { color: palette.monthText }]}>{currentYear}</Text>
        <TouchableOpacity 
          onPress={() => navigateYear(1)}
          style={[styles.navButton, { backgroundColor: palette.cardBg, borderColor: palette.border }]}
        >
          <MaterialCommunityIcons name="chevron-right" size={20} color={palette.monthText} />
        </TouchableOpacity>
      </View>

      <View style={styles.legendContainer}>
        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
          <View key={key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: config.color }]} />
            <Text style={[styles.legendText, { color: palette.weekdayText }]}>
              {config.label}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.statsBar, { backgroundColor: palette.cardBg, borderColor: palette.border }]}>
        <Text style={[styles.statsText, { color: palette.weekdayText }]}>
          🟢 {stats.present}  🔴 {stats.absent}  🔵 {stats.other}  ⚪ {stats.total ? (365 - stats.total) : 365}
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.calendarGrid}>
          <View style={styles.monthRow}>
            <View style={{ width: 48 }} />
            {weeks.map((_, wIdx) => {
              const marker = monthMarkers.find(m => m.weekIndex === wIdx);
              return (
                <View key={wIdx} style={styles.monthLabelCell}>
                  <Text style={[
                    styles.monthText, 
                    { 
                      color: marker ? palette.monthText : 'transparent',
                      fontWeight: marker ? '700' : '400'
                    }
                  ]}>
                    {marker ? marker.month : "   "}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={{ flexDirection: "row" }}>
            <View style={styles.weekdayLabels}>
              {WEEKDAYS.map(day => (
                <View key={day} style={styles.weekdayCell}>
                  <Text style={[styles.weekdayText, { color: palette.weekdayText }]}>{day}</Text>
                </View>
              ))}
            </View>

            <View style={styles.weekColumns}>
              {weeks.map((week, weekIndex) => (
                <View key={weekIndex} style={styles.weekColumn}>
                  {week.map((date, dIdx) => {
                    if (!date) {
                      return <View key={dIdx} style={[styles.dayBox, { backgroundColor: 'transparent' }]} />;
                    }
                    
                    const key = formatDateKey(date);
                    const status = attendanceData?.[key] ?? "none";
                    const isToday = key === todayKey;
                    const isSelected = selectedDate && formatDateKey(selectedDate) === key;
                    
                    return (
                      <Pressable 
                        key={dIdx} 
                        onPress={() => handleDayPress(date)}
                        style={({ pressed }) => [
                          styles.dayBox,
                          {
                            backgroundColor: STATUS_CONFIG[status].color,
                            borderWidth: isToday ? 2 : isSelected ? 2 : 0,
                            borderColor: isToday ? palette.todayBorder : isSelected ? palette.monthText : 'transparent',
                            transform: [{ scale: pressed ? 0.92 : 1 }],
                            shadowColor: isToday ? '#fbbf24' : 'transparent',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: isToday ? 0.5 : 0,
                            shadowRadius: isToday ? 4 : 0,
                            elevation: isToday ? 4 : 0,
                          }
                        ]}
                      >
                        <Text style={[
                          styles.dayText, 
                          { 
                            color: status === 'none' ? palette.monthText : '#ffffff',
                            fontWeight: isToday ? '800' : '600'
                          }
                        ]}>
                          {date.getDate()}
                        </Text>
                        {isToday && (
                          <View style={styles.todayDot} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {selectedDate && (
        <Animatable.View 
          animation="fadeInUp" 
          duration={300}
          style={[styles.dayDetail, { backgroundColor: palette.cardBg, borderColor: palette.border }]}
        >
          <MaterialCommunityIcons 
            name={STATUS_CONFIG[attendanceData?.[formatDateKey(selectedDate)] ?? 'none'].icon}
            size={24} 
            color={STATUS_CONFIG[attendanceData?.[formatDateKey(selectedDate)] ?? 'none'].color}
          />
          <View style={styles.dayDetailText}>
            <Text style={[styles.dayDetailDate, { color: palette.monthText }]}>
              {formatDateDisplay(selectedDate)}
            </Text>
            <Text style={[styles.dayDetailStatus, { 
              color: STATUS_CONFIG[attendanceData?.[formatDateKey(selectedDate)] ?? 'none'].color 
            }]}>
              {STATUS_CONFIG[attendanceData?.[formatDateKey(selectedDate)] ?? 'none'].label}
            </Text>
          </View>
        </Animatable.View>
      )}
    </View>
  );
}

/* ------------------------
   AdminStreak Component
   ------------------------ */
const AdminStreak = () => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const palette = colorScheme === 'dark'
    ? { bg:'#0b0f14', card:'#0f172a', text:'#e5e7eb', sub:'#94a3b8', border:'#1f2937' }
    : { bg:'#f9fafb', card:'#ffffff', text:'#111827', sub:'#374151', border:'#e5e7eb' };
  
  const [isjoined, setJoined] = useState(null); 
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);
  const [isReportView, setIsReportView] = useState(null); 
  const [currentMonth, setCurrentMonth] = useState({ present: 0, absent: 0, other: 0 });
  const [currentYear, setCurrentYear] = useState({ present: 0, absent: 0, other: 0 });
  const [attendanceData, setAttendanceData] = useState({});
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  
  const API = Constants.expoConfig.extra.API_URL;
  const { apiCall } = useAuth();
  const { selectedClass } = useClass();
  const YEAR = new Date().getFullYear();

  // Helper: get today's local date key YYYY-MM-DD
  const getTodayKey = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const mapCalendarToAttendance = (calendarArray = []) => {
    const mapped = {};
    (calendarArray || []).forEach(({ date, status }) => {
      if (!date) return;
      const normalized = status === 'present' ? 'present' :
                         status === 'absent' ? 'absent' : 'other';
      mapped[date] = normalized;
    });
    return mapped;
  };

  // --- EXTRACTED loadAll so attendance handlers can call it to refresh ---
  const loadAll = useCallback(async () => {
    if (!selectedClass) return;

    try {
      // Calendar
      const cal = await apiCall(`${API}/admin/calendar/${selectedClass.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      console.log("Calendar data:", cal);
      const mapped = mapCalendarToAttendance(cal?.calendar || []);
      setAttendanceData(mapped);
      
      // Check today
      const todayKey = getTodayKey();
      const todayRec = (cal?.calendar || []).find((c) => c.date === todayKey);
      if (todayRec) {
        setAttendanceSubmitted(true);
        setJoined(todayRec.status === 'present');
      }
      
      // Personal Report
      const personalReport = await apiCall(`${API}/admin/personalReport/${selectedClass.id}`, {
        method: 'GET',
        headers: { "Content-Type": "application/json" },
      });
      
      if (personalReport?.personal_report) {
        const cm = personalReport.personal_report.current_month;
        const cy = personalReport.personal_report.current_year;
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
      
      // Streak
      const streakResp = await apiCall(`${API}/admin/streak/${selectedClass.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (streakResp) {
        setStreak(streakResp.currentStreak ?? 0);
        setBestStreak(streakResp.bestStreak ?? 0);
      }
      
    } catch (e) {
      console.error("Error loading admin streak data:", e);
    }
  }, [selectedClass]);
  
  useEffect(() => {
    if (!selectedClass) return;
    loadAll();
  }, [selectedClass, loadAll]);
  
  const handleDayPress = (date) => {
    if (!date) return;
    const key = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    const status = attendanceData[key] ?? "none";
    let message;
    if (status === 'present') message = "✅ Present";
    else if (status === 'absent') message = "❌ Absent";
    else if (status === 'other') message = "ℹ️ Other";
    else message = "No data available";
    Alert.alert(`Date: ${key}`, message);
  };
  
  const todayDate = new Date().toLocaleDateString();

  // --- Joined: mark present then refresh ---
  const handleMarkPresent = async () => {
    const todayKey = getTodayKey();
    try {
      await apiCall(`${API}/admin/markAttendance/${selectedClass.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'present' }),
      });
      setAttendanceData(prev => ({ ...prev, [todayKey]: 'present' }));
      setAttendanceSubmitted(true);
      // Refresh calendar + report + streak after marking
      await loadAll();
    } catch (e) {
      Alert.alert('Error', 'Unable to mark attendance. Please try again.');
    }
  };

  // --- Absent: mark absent then refresh ---
  const handleMarkAbsent = async () => {
    const todayKey = getTodayKey();
    try {
      await apiCall(`${API}/admin/markAttendance/${selectedClass.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'absent' }),
      });
      setAttendanceData(prev => ({ ...prev, [todayKey]: 'absent' }));
      setAttendanceSubmitted(true);
      // Refresh calendar + report + streak after marking
      await loadAll();
    } catch (e) {
      Alert.alert('Error', 'Unable to mark attendance. Please try again.');
    }
  };
  
  const renderJoinedSummary = () => (
    <>
      <Text style={[styles.cardTitle, { color: palette.text }]}>Attendance Summary</Text>
      <Text style={[styles.summaryText, { color: palette.text }]}>
        You have joined today's class. Great job!
      </Text>
      <TouchableOpacity
        style={styles.submitButton}
        disabled={attendanceSubmitted}
        onPress={handleMarkPresent}
      >
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </>
  );
  
  const renderExcuseForm = () => (
    <>
      <Text style={[styles.summaryText, { color: palette.text }]}>
        You didn't join today's class? No worries, it happens sometimes
      </Text>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleMarkAbsent}
      >
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </>
  );
  
  const renderAttendanceConfirmation = () => (
    <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
      <Text style={[styles.cardTitle, { color: palette.text }]}>Attendance Marked</Text>
      <Text style={[styles.summaryText, { color: palette.text }]}>
        You have marked your attendance for {todayDate} as{" "}
        {isjoined ? "✅ Present" : "❌ Absent"}
      </Text>
    </View>
  );
  
  const renderMonthlyReport = () => (
    <>
      <Text style={[styles.cardTitle, { color: palette.text }]}>Monthly Report</Text>
      <Text style={[styles.summaryText, { color: palette.text }]}>
        Total Classes Joined: {currentMonth.present}
      </Text>
      <Text style={[styles.summaryText, { color: palette.text }]}>
        Total Classes Missed: {currentMonth.absent}
      </Text>
      <View style={styles.streakHeader}>
        <Text style={styles.streakCounter}>Current Streak: {streak} days</Text>
        <View style={styles.streakIconWrapper}>
          <Text style={{ fontSize: 24 }}>🔥</Text>
        </View>
      </View>
    </>
  );
  
  const renderYearlyReport = () => (
    <>
      <Text style={[styles.cardTitle, { color: palette.text }]}>Yearly Report</Text>
      <Text style={[styles.summaryText, { color: palette.text }]}>
        Total Classes Joined: {currentYear.present}
      </Text>
      <Text style={[styles.summaryText, { color: palette.text }]}>
        Total Classes Missed: {currentYear.absent}
      </Text>
      <View style={styles.streakHeader}>
        <Text style={styles.streakCounter}>Best Streak: {bestStreak} days</Text>
        <View style={styles.streakIconWrapper}>
          <Text style={{ fontSize: 24 }}>🔥</Text>
        </View>
      </View>
    </>
  );
  
  return (
    <View style={[styles.safeContainer, { paddingTop: insets.top, backgroundColor: palette.bg }]}>
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
      >
        <Text style={[styles.title, { color: palette.text }]}>Today's Attendance</Text>
        
        {!attendanceSubmitted && (
          <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
            <Text style={[styles.cardTitle, { color: palette.text }]}>Class Entry</Text>
            <View style={[styles.innerBox, { backgroundColor: colorScheme === 'dark' ? '#111827' : '#f3f4f6' }]}>
              <Text style={[styles.cardText, { color: palette.text }]}>Joined Today's Class?</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <TouchableOpacity
                  style={[
                    styles.yesButton,
                    isjoined === true && { backgroundColor: "#4ade80" }
                  ]}
                  onPress={() => setJoined(isjoined === true ? null : true)}
                >
                  <Text style={{ color: "white", fontWeight: "600" }}>Yes, I did!</Text>
                </TouchableOpacity>
                
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
        
        {!attendanceSubmitted && isjoined !== null && (
          <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
            {isjoined ? renderJoinedSummary() : renderExcuseForm()}
          </View>
        )}
        {attendanceSubmitted && renderAttendanceConfirmation()}
        
        {/* Report Section */}
        <View style={[styles.card, { backgroundColor: palette.card, borderWidth: 1, borderColor: palette.border }]}>
          <Text style={[styles.cardTitle, { color: palette.text }]}>Report</Text>
          <View style={[styles.innerBox, { backgroundColor: colorScheme === 'dark' ? '#111827' : '#f3f4f6' }]}>
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
          <View style={[styles.card, { backgroundColor: palette.card, borderWidth: 1, borderColor: palette.border }]}>
            {isReportView ? renderMonthlyReport() : renderYearlyReport()}
          </View>
        )}
        
        {/* Activity Calendar */}
        <Animatable.View 
          animation="fadeInUp" 
          duration={600} 
          delay={200}
          style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}
        >
          <View style={styles.calendarHeader}>
            <Text style={[styles.cardTitle, { color: palette.text }]}>Activity Calendar</Text>
            <MaterialCommunityIcons name="calendar-month" size={24} color={palette.sub} />
          </View>
          
          <CalendarHeatmap
            year={YEAR}
            attendanceData={attendanceData}
            onDayPress={handleDayPress}
            colorScheme={colorScheme}
          />
        </Animatable.View>
      </ScrollView>
    </View>
  );
};

export default AdminStreak;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
  yesButton: {
    marginTop: 12,
    marginBottom: 14,
    backgroundColor: "#b8ea69ff",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    width: 120,
  },
  reportButton: {
    marginTop: 12,
    marginBottom: 14,
    backgroundColor: "#b567e5ff",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    width: 120,
  },
  noButton: {
    marginTop: 12,
    marginBottom: 14,
    backgroundColor: "#b42953ff",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    width: 120,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
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
    marginVertical: 2,
  },
  cardText: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
  },
  innerBox: {
    borderRadius: 8,
    padding: 10,
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
    borderRadius: 40,
  },
  streakCounter: {
    fontSize: 22,
    fontWeight: "800",
    marginVertical: 12,
    textAlign: "center",
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  calendarContainer: {
    marginTop: 8,
  },
  yearNavigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  yearText: {
    fontSize: 18,
    fontWeight: '700',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  statsText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
  },
  calendarGrid: {
    flexDirection: "column",
  },
  monthRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  monthText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  monthLabelCell: {
    width: 38,
    alignItems: "center",
    marginHorizontal: 1.5,
  },
  weekdayLabels: {
    marginRight: 8,
    width: 48,
  },
  weekdayCell: {
    height: 38,
    justifyContent: "center",
    marginBottom: 3,
  },
  weekdayText: {
    fontSize: 11,
    fontWeight: "600",
  },
  weekColumns: {
    flexDirection: "row",
  },
  weekColumn: {
    flexDirection: "column",
    marginHorizontal: 1.5,
  },
  dayBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 3,
  },
  dayText: {
    fontSize: 12,
    fontWeight: "700",
  },
  todayDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
  dayDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    gap: 12,
  },
  dayDetailText: {
    flex: 1,
  },
  dayDetailDate: {
    fontSize: 14,
    fontWeight: '600',
  },
  dayDetailStatus: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
});