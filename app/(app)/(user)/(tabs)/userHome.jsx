
      /**
 * User Home Screen - Improved Version
 * Date: 12/12/2025
 * 
 * Changes made:
 * 1. Added proper data fetching with useEffect
 * 2. Improved calendar rendering with better month markers
 * 3. Added loading states and error handling
 * 4. Optimized performance with useMemo and useCallback
 * 5. Fixed attendance data sync with context
 */

// Quick summary API endpoint: /user/myClasses/:id, token header=bearer
// Response example: {"quick_summary": {"current_week_absent": 0, "current_week_not_marked": 0, "current_week_present": 0, "today_status": "Not marked", "total_absent": 0, "total_not_marked": 0, "total_present": 2}}

// Calendar API endpoint: /user/calendar/${classid}
// Response example: {"calendar": [{"date": "2025-09-21", "status": "present"}, ...], "class_id": 1, "user_id": 1}

// Report API response example:
// {"report":{"current_month":{"absent":1,"not_marked":0,"present":0},"current_year":{"absent":1,"not_marked":0,"present":0}}}

import { useAuth } from '@/app/contexts/AuthContext';
import { useClass } from '@/app/contexts/ClassContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Status codes for attendance
const STATUS = {
  ABSENT: 0,
  PRESENT: 1,
  OTHER: 2,
};

// Helper: Map status to color
const getStatusColor = (status) => {
  switch (status) {
    case STATUS.PRESENT: return "#22c55e"; // green
    case STATUS.ABSENT: return "#ef4444";  // red
    case STATUS.OTHER: return "#3b82f6";   // blue
    default: return "#d1d5db";             // gray (no data)
  }
};

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const UserHome = () => {
  const { user, logout, apiCall } = useAuth();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { selectedClass, attendanceData = {}, setAttendanceData } = useClass();
  
  // UI State
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Attendance Data
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [todayStatus, setTodayStatus] = useState("Not marked");
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [totalUnMarked, setTotalUnMarked] = useState(0);
  const [currentWeekPresent, setCurrentWeekPresent] = useState(0);
  const [currentWeekAbsent, setCurrentWeekAbsent] = useState(0);
  const [currentWeekUnMarked, setCurrentWeekUnMarked] = useState(0);
  
  const API = Constants.expoConfig.extra.API_URL;
  const currentYear = new Date().getFullYear();
  
  // Memoized color palette based on theme
  const palette = useMemo(() => ({
    dark: {
      bg: '#0b0f14',
      card: '#0f172a',
      text: '#e5e7eb',
      subtext: '#94a3b8',
      border: '#1f2937',
      menuBg: '#0f172a',
    },
    light: {
      bg: '#f9fafb',
      card: '#ffffff',
      text: '#111827',
      subtext: '#374151',
      border: '#e5e7eb',
      menuBg: '#ffffff',
    }
  })[colorScheme], [colorScheme]);
  
  const firstName = user?.firstName || user?.userName || "User";
  
  // Fetch attendance summary data
  const fetchAttendanceSummary = useCallback(async () => {
    if (!selectedClass?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch quick summary
      const [summaryResp, calendarResp, streakResp] = await Promise.all([
        apiCall(`${API}/user/quickSummary/${selectedClass.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }),
        apiCall(`${API}/user/calendar/${selectedClass.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }),
        apiCall(`${API}/user/streak/${selectedClass.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
      ]);
      
      // Update summary data
      if (summaryResp?.quick_summary) {
        const { 
          total_present, total_absent, total_not_marked,
          current_week_present, current_week_absent, current_week_not_marked,
          today_status 
        } = summaryResp.quick_summary;
        
        setTotalPresent(total_present);
        setTotalAbsent(total_absent);
        setTotalUnMarked(total_not_marked);
        setCurrentWeekPresent(current_week_present);
        setCurrentWeekAbsent(current_week_absent);
        setCurrentWeekUnMarked(current_week_not_marked);
        setTodayStatus(today_status);
      }
      
      // Update calendar data in context
      if (calendarResp?.calendar) {
        const attendanceMap = {};
        calendarResp.calendar.forEach(({ date, status }) => {
          attendanceMap[date] = status === 'present' ? 1 : status === 'absent' ? 0 : 2;
        });
        setAttendanceData(prev => ({ ...prev, ...attendanceMap }));
      }
      
      // Update streak data
      if (streakResp) {
        setStreak(streakResp.currentStreak || 0);
        setBestStreak(streakResp.bestStreak || 0);
      }
      
    } catch (err) {
      console.error("Error fetching attendance data:", err);
      setError("Failed to load attendance data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [selectedClass?.id, API, apiCall, setAttendanceData]);
  
  // Generate calendar data for the current year
  const { weeks, monthMarkers } = useMemo(() => {
    const days = [];
    const year = currentYear;
    
    // Generate all days of the year
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    
    // Split into weeks (Mon-Sun)
    const weeks = [];
    let week = [];
    
    days.forEach((date) => {
      // Add empty slots for days before the first Monday
      if (weeks.length === 0 && date.getDay() !== 1) {
        const emptyDays = (date.getDay() + 6) % 7; // Number of days to pad before Monday
        week = Array(emptyDays).fill(null);
      }
      
      week.push(date);
      
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    });
    
    // Add remaining days to the last week if needed
    if (week.length > 0) {
      weeks.push([...week, ...Array(7 - week.length).fill(null)]);
    }
    
    // Generate month markers for the first week of each month
    const monthMarkers = [];
    weeks.forEach((week, weekIndex) => {
      const firstDay = week.find(day => day && day.getDate() === 1);
      if (firstDay) {
        monthMarkers.push({
          month: months[firstDay.getMonth()],
          weekIndex,
        });
      }
    });
    
    return { weeks, monthMarkers };
  }, [currentYear]);
  
  // Handle day press in calendar
  const handleDayPress = useCallback((date) => {
    if (!date) return;
    
    const key = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    const status = attendanceData[key];
    
    let message;
    if (status === STATUS.PRESENT) message = "✅ Present";
    else if (status === STATUS.ABSENT) message = "❌ Absent";
    else if (status === STATUS.OTHER) message = "ℹ️ Other (Genuine Reason)";
    else message = "No attendance data available for this date";
    
    Alert.alert(`Date: ${key}`, message);
  }, [attendanceData]);
  
  // Fetch data on component mount and when selected class changes
  useEffect(() => {
    fetchAttendanceSummary();
    
    // Set up refresh interval (e.g., every 5 minutes)
    const refreshInterval = setInterval(fetchAttendanceSummary, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [fetchAttendanceSummary]);
  
  // Pull to refresh handler
  const handleRefresh = useCallback(() => {
    fetchAttendanceSummary();
  }, [fetchAttendanceSummary]);
  
  // Profile menu handlers
  const handleLogout = useCallback(() => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: logout }
      ]
    );
  }, [logout]);
  
  const handleEditProfile = useCallback(() => {
    setMenuVisible(false);
    router.push("/(app)/(user)/editProfile");
  }, []);
  
  const handleAboutPage = useCallback(() => {
    setMenuVisible(false);
    router.push("/(app)/(user)/about");
  }, []);
  
  // Calculate attendance percentages
  const percentagess = useMemo(() => {
    const total = totalPresent + totalAbsent + totalUnMarked;
    if (total === 0) return { present: 0, absent: 0, other: 0 };
    
    return {
      present: ((totalPresent / total) * 100).toFixed(1),
      absent: ((totalAbsent / total) * 100).toFixed(1),
      other: ((totalUnMarked / total) * 100).toFixed(1),
    };
  }, [totalPresent, totalAbsent, totalUnMarked]);
  
  // Show loading state
  if (loading && !Object.keys(attendanceData).length) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: palette.bg }]}>
        <ActivityIndicator size="large" color="#ff6b6b" />
        <Text style={[styles.loadingText, { color: palette.text }]}>
          Loading attendance data...
        </Text>
      </View>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: palette.bg }]}>
        <Text style={[styles.errorText, { color: palette.text }]}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchAttendanceSummary}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate percentages for the UI
  const percentages = useMemo(() => {
    const total = totalPresent + totalAbsent + totalUnMarked;
    if (total === 0) return { present: 0, absent: 0, other: 0 };
    
    return {
      present: ((totalPresent / total) * 100).toFixed(1),
      absent: ((totalAbsent / total) * 100).toFixed(1),
      other: ((totalUnMarked / total) * 100).toFixed(1),
    };
  }, [totalPresent, totalAbsent, totalUnMarked]);
    present: ((totalPresent / total) * 100).toFixed(1),
    absent: ((totalAbsent / total) * 100).toFixed(1),
    other: ((totalUnMarked / total) * 100).toFixed(1),
    };

  };


  // Main render continues...

  // Render the main content


  return (
    <View style={[styles.safeContainer, { paddingTop: insets.top, backgroundColor: palette.bg }]}>
      {/* Header with user info and menu */}
      <View style={[styles.headerContainer, { backgroundColor: palette.card, borderBottomColor: palette.border }]}>
        <Text style={[styles.title, { color: palette.text }]}>👋 Hi, {firstName}!</Text>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <MaterialCommunityIcons name="account-circle" size={32} color="#ff6b6b" />
        </TouchableOpacity>

        {/* Profile Menu */}
        {menuVisible && (
          <>
            <TouchableOpacity
              style={styles.menuOverlay}
              onPress={() => setMenuVisible(false)}
              activeOpacity={1}
            />
            <View style={[styles.menuContainer, { backgroundColor: palette.menuBg, borderColor: palette.border }]}>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={handleEditProfile}
              >
                <MaterialCommunityIcons name="account-edit" size={20} color="#374151" style={styles.menuIcon} />
                <Text style={[styles.menuItemText, { color: palette.text }]}>Edit Profile</Text>
              </TouchableOpacity>
              <View style={styles.menuDivider} />
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={handleAboutPage}
              >
                <MaterialCommunityIcons name="information" size={20} color="#374151" style={styles.menuIcon} />
                <Text style={[styles.menuItemText, { color: palette.text }]}>About Application</Text>
              </TouchableOpacity>
              <View style={styles.menuDivider} />
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

      {/* Main Content */}
      <ScrollView 
        style={styles.screen} 
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={['#ff6b6b']}
            tintColor="#ff6b6b"
          />
        }
      >
        {/* Welcome Card */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <Text style={[styles.cardTitle, { color: palette.text }]}>Welcome to {selectedClass?.name || '—'}</Text>
          <Text style={[styles.subtitle, { color: palette.subtext }]}>
            Today's Status: {todayStatus}
          </Text>
        </View>

        {/* Quick Summary Card */}
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <Text style={[styles.cardTitle, { color: palette.text }]}>Quick Summary</Text>
          <View style={[styles.innerBox, { backgroundColor: colorScheme === 'dark' ? '#1e293b' : '#f3f4f6' }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: palette.subtext }]}>🔥 Best Streak</Text>
              <Text style={[styles.summaryValue, { color: palette.text }]}>{bestStreak} days</Text>
            </View>
            
            <View style={styles.summaryDivider} />
            
            <Text style={[styles.summarySubTitle, { color: palette.text }]}>📅 Current Week</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#22c55e' }]}>{currentWeekPresent}</Text>
                <Text style={[styles.statLabel, { color: palette.subtext }]}>Present</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#ef4444' }]}>{currentWeekAbsent}</Text>
                <Text style={[styles.statLabel, { color: palette.subtext }]}>Absent</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#3b82f6' }]}>{currentWeekUnMarked}</Text>
                <Text style={[styles.statLabel, { color: palette.subtext }]}>Other</Text>
              </View>
            </View>
            
            <View style={styles.summaryDivider} />
            
            <Text style={[styles.summarySubTitle, { color: palette.text }]}>� Overall</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#22c55e' }]}>{totalPresent}</Text>
                <Text style={[styles.statLabel, { color: palette.subtext }]}>Present</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#ef4444' }]}>{totalAbsent}</Text>
                <Text style={[styles.statLabel, { color: palette.subtext }]}>Absent</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#3b82f6' }]}>{totalUnMarked}</Text>
                <Text style={[styles.statLabel, { color: palette.subtext }]}>Other</Text>
              </View>
            </View>
            
            {Object.keys(percentages).some(p => percentages[p] > 0) && (
              <>
                <View style={styles.summaryDivider} />
                <Text style={[styles.summarySubTitle, { color: palette.text }]}>� Percentages</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarContainer}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { 
                          width: `${percentages.present}%`,
                          backgroundColor: '#22c55e'
                        }
                      ]} 
                    />
                    <Text style={[styles.progressText, { color: palette.text }]}>
                      Present: {percentages.present}%
                    </Text>
                  </View>
                  
                  <View style={styles.progressBarContainer}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { 
                          width: `${percentages.absent}%`,
                          backgroundColor: '#ef4444'
                        }
                      ]} 
                    />
                    <Text style={[styles.progressText, { color: palette.text }]}>
                      Absent: {percentages.absent}%
                    </Text>
                  </View>
                  
                  <View style={styles.progressBarContainer}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { 
                          width: `${percentages.other}%`,
                          backgroundColor: '#3b82f6'
                        }
                      ]} 
                    />
                    <Text style={[styles.progressText, { color: palette.text }]}>
                      Other: {percentages.other}%
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Streak & Calendar Section */}
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
          
          <Text style={[styles.streakCounter, { color: palette.text }]}>
            🔥 {streak} Day{streak !== 1 ? 's' : ''} Streak
          </Text>
          
          <Text style={[styles.calendarTitle, { color: palette.text }]}>{currentYear} Attendance</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.calendarContainer}
          >
            <View style={styles.calendarGrid}>
              {/* Month indicators */}
              <View style={styles.monthRow}>
                <View style={styles.weekdayLabel} />
                {monthMarkers.map(({ month, weekIndex }) => (
                  <View key={`${month}-${weekIndex}`} style={styles.monthCell}>
                    <Text style={[styles.monthText, { color: palette.text }]}>{month}</Text>
                  </View>
                ))}
              </View>
              
              {/* Weekday labels */}
              <View style={styles.weekdayRow}>
                <View style={styles.weekdayLabel} />
                {weekdays.map(day => (
                  <View key={day} style={styles.weekdayCell}>
                    <Text style={[styles.weekdayText, { color: palette.subtext }]}>{day[0]}</Text>
                  </View>
                ))}
              </View>
              
              {/* Calendar grid */}
              <View style={styles.calendarGridInner}>
                {weeks.map((week, weekIndex) => (
                  <View key={`week-${weekIndex}`} style={styles.weekColumn}>
                    {week.map((date, dayIndex) => {
                      if (!date) {
                        return <View key={`empty-${weekIndex}-${dayIndex}`} style={styles.dayCell} />;
                      }
                      
                      const key = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                        .toISOString()
                        .slice(0, 10);
                      
                      const status = attendanceData[key];
                      const isToday = new Date().toDateString() === date.toDateString();
                      
                      return (
                        <Pressable
                          key={key}
                          onPress={() => handleDayPress(date)}
                          style={({ pressed }) => [
                            styles.dayCell,
                            isToday && styles.todayCell,
                            pressed && styles.dayCellPressed
                          ]}
                        >
                          <View
                            style={[
                              styles.dayBox,
                              { 
                                backgroundColor: getStatusColor(status),
                                borderColor: isToday ? '#ff6b6b' : 'transparent'
                              }
                            ]}
                          >
                            <Text 
                              style={[
                                styles.dayText, 
                                { 
                                  color: status !== null ? 'white' : palette.text,
                                  opacity: status === null ? 0.5 : 1
                                }
                              ]}
                            >
                              {date.getDate()}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#22c55e' }]} />
              <Text style={[styles.legendText, { color: palette.text }]}>Present</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#ef4444' }]} />
              <Text style={[styles.legendText, { color: palette.text }]}>Absent</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#3b82f6' }]} />
              <Text style={[styles.legendText, { color: palette.text }]}>Other</Text>
            </View>
          </View>
        </View>
        
        {/* Empty space at the bottom */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

export default UserHome;

// ==============================================
// Original code is preserved below for reference
// ==============================================

/*
// quick summary /user/myClasses/:id, token header=bearer walah
//   LOG  Quick Summary  {"quick_summary": {"current_week_absent": 0, "current_week_not_marked": 0, "current_week_present": 0, "today_status": "Not marked", "total_absent": 0, "total_not_marked": 0, "total_present": 2}}

// /user/calendar/${classid}
// Calendar looks like this  {"calendar": [{"date": "2025-09-21", "status": "present"}, {"date": "2025-11-07", "status": "present"}], "class_id": 1, "user_id": 1}

// report response
// {"report":{"current_month":{"absent":1,"not_marked":0,"present":0},"current_year":{"absent":1,"not_marked":0,"present":0}}}

// ... (rest of the original code remains commented below)
*/
    
  );
};

export default UserHome;

const styles = StyleSheet.create({
  safeContainer:{
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
    margin: 1,
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




// // userHome.jsx
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import Constants from "expo-constants";
// import React, { useEffect, useMemo, useState } from "react";
// import { Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

// function CalendarHeatmap({ year, attendanceData, onDayPress }) {
//   // Generate days aligned to Monday
//   const { weeks, monthMarkers } = useMemo(() => {
//     const days = [];

//     const start = new Date(year, 0, 1);
//     // getDay(): 0=Sun,1=Mon,...6=Sat. Convert Sun -> 7 for mon-first alignment
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
//   }, [year, attendanceData]);

//   const keyFor = (date) => {
//     // convert to local YYYY-MM-DD (avoid UTC shift)
//     return new Date(date.getTime() - date.getTimezoneOffset()*60000).toISOString().slice(0,10);
//   };

//   return (
//     <View style={{ marginTop: 10 }}>
//       {/* Month labels row — positioned above weeks */}
//       <View style={styles.monthRow}>
//         <View style={{ width: 46 }} />
//         {weeks.map((_, wIdx) => {
//           const marker = monthMarkers.find(m => m.weekIndex === wIdx);
//           return (
//             <View key={wIdx} style={{ width: 36, alignItems: "center" }}>
//               {marker ? <Text style={styles.monthText}>{marker.month}</Text> : null}
//             </View>
//           );
//         })}
//       </View>

//       {/* Weekday labels + grid */}
//       <View style={{ flexDirection: "row" }}>
//         {/* Weekday labels column */}
//         <View style={{ marginRight: 6, width: 46 }}>
//           {WEEKDAYS.map(day => (
//             <View key={day} style={{ height: 36, justifyContent: "center" }}>
//               <Text style={styles.weekdayText}>{day}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Grid: week columns */}
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
//           <View style={{ flexDirection: "row" }}>
//             {weeks.map((week, weekIndex) => (
//               <View key={weekIndex} style={styles.weekColumn}>
//                 {week.map((date, dIdx) => {
//                   if (!date) {
//                     // empty box for alignment
//                     return <View key={dIdx} style={[styles.dayBox, { backgroundColor: COLORS.none }]} />;
//                   }
//                   const key = keyFor(date);
//                   const status = attendanceData?.[key] ?? "none";
//                   const bg = COLORS[status] ?? COLORS.none;
//                   return (
//                     <Pressable key={dIdx} onPress={() => onDayPress && onDayPress(date)}>
//                       <View style={[styles.dayBox, { backgroundColor: bg }]}>
//                         <Text style={styles.dayText}>{date.getDate()}</Text>
//                       </View>
//                     </Pressable>
//                   );
//                 })}
//               </View>
//             ))}
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
//   const { selectedClass, attendanceData: ctxAttendanceData, setAttendanceData: setCtxAttendanceData } = useClass();
//   const colorScheme = useColorScheme();
//   const insets = useSafeAreaInsets();

//   const palette = colorScheme === 'dark'
//     ? { bg: '#0b0f14', card: '#0f172a', text: '#e5e7eb', subtext:'#94a3b8', border:'#1f2937' }
//     : { bg: '#f9fafb', card: '#ffffff', text: '#111827', subtext:'#374151', border:'#e5e7eb' };

//   const [loading, setLoading] = useState(true);
//   const [streak, setStreak] = useState(0);
//   const [bestStreak, setBestStreak] = useState(0);

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
//   const YEAR = new Date().getFullYear(); // use current year by default

//   // Convert backend calendar array into map { "YYYY-MM-DD": "present" | "absent" | "other" }
//   const mapCalendarToAttendance = (calendarArray=[]) => {
//     const mapped = {};
//     (calendarArray || []).forEach(({ date, status }) => {
//       // assume API returns 'present', 'absent', or other
//       if (!date) return;
//       const normalized = status === 'present' ? 'present' :
//                          status === 'absent' ? 'absent' : 'other';
//       mapped[date] = normalized;
//     });
//     return mapped;
//   };

//   // Fetch quick summary, calendar and streak
//   useEffect(() => {
//     if (!selectedClass) {
//       setLoading(false);
//       return;
//     }

//     let mounted = true;

//     const loadAll = async () => {
//       try {
//         // quick summary (includes totals)
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

//         // calendar
//         const calResp = await apiCall(`${API}/user/calendar/${selectedClass.id}`, {
//           method: 'GET',
//           headers: { 'Content-Type': 'application/json' }
//         });

//         const mapped = mapCalendarToAttendance(calResp?.calendar || []);
//         if (mounted) {
//           setAttendanceData(mapped);
//           // also set context attendanceData if you want global updates reflected
//           if (setCtxAttendanceData) setCtxAttendanceData(mapped);
//         }

//         // streak
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
//   }, [selectedClass]);

//   // Open day alert handler
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

//   return (
//     <View style={[styles.safeContainer, { paddingTop: insets.top, backgroundColor: palette.bg }]}>
//       {/* Header */}
//       <View style={[styles.headerContainer, { backgroundColor: palette.card, borderBottomColor: palette.border }]}>
//         <Text style={[styles.title, { color: palette.text }]}>👋 Hi, {firstName}!</Text>
//         <TouchableOpacity onPress={async () => {
//           Alert.alert(
//             "Logout",
//             "Are you sure you want to logout?",
//             [
//               { text: "Cancel", style: "cancel" },
//               { text: "Logout", style: "destructive", onPress: async () => { await logout(); } }
//             ]
//           );
//         }}>
//           <MaterialCommunityIcons name="account-circle" size={32} color="#ff6b6b" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}>
//         <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
//           <Text style={[styles.cardTitle, { color: palette.text }]}>Welcome to {selectedClass?.name || '—'}</Text>
//         </View>

//         <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
//           <Text style={[styles.cardTitle, { color: palette.text }]}>Quick Summary</Text>
//           <View style={styles.innerBox}>
//             <Text style={styles.summaryText}>🔥 Best Streak: {bestStreak} days</Text>

//             <Text style={styles.summarySubTitle}>📅 Current Week</Text>
//             <Text style={styles.summaryText}>Present: {currentWeekPresent} | Absent: {currentWeekAbsent} | Other: {currentWeekUnMarked}</Text>

//             <Text style={styles.summarySubTitle}>📊 Total</Text>
//             <Text style={styles.summaryText}>Present: {totalPresent} | Absent: {totalAbsent} | Other: {totalUnMarked}</Text>
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

//   /* Heatmap specific styles */
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
// });
