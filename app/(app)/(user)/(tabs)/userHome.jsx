import { useAuth } from '@/app/contexts/AuthContext';
import { useClass } from '@/app/contexts/ClassContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, LayoutAnimation, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Enable LayoutAnimation on Android
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
   Enhanced CalendarHeatmap Component
   ------------------------- */
function CalendarHeatmap({ year, attendanceData, onDayPress, colorScheme }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentYear, setCurrentYear] = useState(year);
  
  const isDark = colorScheme === 'dark'
  
  const formatDateKey = (date) => {
    if (!date) return '';
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  };;
  
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

  // Calculate stats
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
      {/* Year Navigation */}
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

      {/* Legend */}
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

      {/* Stats Bar */}
      <View style={[styles.statsBar, { backgroundColor: palette.cardBg, borderColor: palette.border }]}>
        <Text style={[styles.statsText, { color: palette.weekdayText }]}>
          🟢 {stats.present}  🔴 {stats.absent}  🔵 {stats.other}  ⚪ {stats.total ? (365 - stats.total) : 365}
        </Text>
      </View>

      {/* Calendar Grid */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.calendarGrid}>
          {/* Month labels row */}
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

          {/* Weekday labels + grid */}
          <View style={{ flexDirection: "row" }}>
            <View style={styles.weekdayLabels}>
              {WEEKDAYS.map(day => (
                <View key={day} style={styles.weekdayCell}>
                  <Text style={[styles.weekdayText, { color: palette.weekdayText }]}>{day}</Text>
                </View>
              ))}
            </View>

            {/* Week columns */}
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

      {/* Selected Day Detail */}
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

  const API = Constants.expoConfig?.extra?.API_URL;
  const YEAR = new Date().getFullYear();

  // console.log("USER HOME --- selected class is ", selectedClass);

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
    else if (status === 'other') message = "ℹ️ Not Marked";
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
            {/* <Text style={[styles.summaryText, { color: palette.text }]}>🔥 Best Streak: {bestStreak} days</Text> */}
            {/* Streak Display */}
              <View style={[styles.streakContainer, { backgroundColor: colorScheme === 'dark' ? '#1e293b' : '#fef2f2' }]}>
                <View style={styles.streakItem}>
                  {/* <MaterialCommunityIcons name="fire" size={28} color="#ef4444" /> */}
                  <Animatable.View 
                    animation="pulse" 
                    easing="ease-out" 
                    iterationCount="infinite" 
                    style={styles.streakIconWrapper}
                  >
                    <MaterialCommunityIcons name="fire" size={32} color="#ff6b6b" />
                  </Animatable.View>
                  <View style={styles.streakTextContainer}>
                    <Text style={[styles.streakValue, { color: '#ef4444' }]}>{streak}</Text>
                    <Text style={[styles.streakLabel, { color: palette.subtext }]}>
                      Current Streak
                    </Text>
                  </View>
                </View>

                <View style={[styles.streakDivider, { backgroundColor: palette.border }]} />

                <View style={styles.streakItem}>
                  <MaterialCommunityIcons name="trophy" size={28} color="#f59e0b" />    
                  <View style={styles.streakTextContainer}>
                    <Text style={[styles.streakValue, { color: '#f59e0b' }]}>{bestStreak}</Text>
                    <Text style={[styles.streakLabel, { color: palette.subtext }]}>
                      Best Streak
                    </Text>
                  </View>
                </View>

              </View> 

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
          <Animatable.View 
            animation="fadeInUp" 
            duration={600} 
            delay={200}
            style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}
          >
            <View style={styles.calendarHeader}>
              <Text style={[styles.cardTitle, { color: palette.text }]}>Activity Calendar</Text>
              <MaterialCommunityIcons name="calendar-month" size={24} color={palette.subtext} />
            </View>
            
            <CalendarHeatmap
              year={YEAR}
              attendanceData={attendanceData}
              onDayPress={handleDayPress}
              colorScheme={colorScheme}
            />
          </Animatable.View>
        {/* </View> */}
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
  streakContainer: {
  flexDirection: 'row',
  borderRadius: 16,
  padding: 16,
  marginBottom: 16,
  gap: 16,
},
  streakItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakTextContainer: {
    flex: 1,
  },
  streakValue: {
    fontSize: 24,
    fontWeight: "800",
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  streakDivider: {
    width: 1,
    height: '100%',
  },
  // Calendar Styles
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

