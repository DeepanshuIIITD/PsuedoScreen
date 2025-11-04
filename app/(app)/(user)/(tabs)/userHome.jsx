
      // quick summary /user/myClasses/:id, token header=bearer walah
      //  


import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// for importing class respective details
import { useAuth } from '@/app/contexts/AuthContext';
import { useClass } from '@/app/contexts/ClassContext';

// Status codes for clarity
// 0 = Absent, 1 = Present, 2 = Other
const STATUS = {
  ABSENT: 0,
  PRESENT: 1,
  OTHER: 2,
};

// Helper: Map status → color
const getStatusColor = (status) => {
  switch (status) {
    case STATUS.PRESENT: return "#22c55e"; // green
    case STATUS.ABSENT: return "#ef4444";  // red
    case STATUS.OTHER: return "#3b82f6";   // blue
    default: return "#d1d5db";             // gray (no data)
  }
};

const weekdays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const months = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const UserHome = () => {
  const { user, logout } = useAuth();
  const firstName = user?.firstName || user?.userName || "User";
  // Mock attendance data for UI demonstration
  const [attendanceData, setAttendanceData] = useState({
    "2025-01-01": STATUS.PRESENT,
    "2025-01-02": STATUS.PRESENT,
    "2025-01-03": STATUS.ABSENT,
    "2025-01-04": STATUS.PRESENT,
    "2025-01-05": STATUS.OTHER,
    "2025-01-06": STATUS.PRESENT,
    "2025-01-07": STATUS.PRESENT,
    "2025-01-08": STATUS.PRESENT,
    "2025-01-09": STATUS.PRESENT,
    "2025-01-10": STATUS.ABSENT,
  }); 
  // for safeareview testing purpose only
  const insets = useSafeAreaInsets();

  // for adding profile icon logic 
  const [menuVisible, setMenuVisible] = useState(false);
  // for class specific information
  const {selectedClass} = useClass();
  const [loading, setIsLoading] = useState(true);
  console.log("USER HOME --- selected class is ", selectedClass);

  const year = 2025;
  const startDate = new Date(year, 0, 1);
  const days = [];

  // Build full year of date objects
  for (let i = 0; i < 365; i++) {
    const d = new Date(year, 0, 1 + i);
    days.push(d);
  }

  // Split into weeks (Mon–Sun)
  const weeks = [];
  let week = [];
  days.forEach((date) => {
    week.push(date);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });

  // summary part 
  // Helper to calculate best streak
const getBestStreak = (attendanceData) => {
  let best = 0, current = 0;
  const dates = Object.keys(attendanceData).sort(); // sorted YYYY-MM-DD
  dates.forEach((date) => {
    if (attendanceData[date] === STATUS.PRESENT) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  });
  return best;
};

// Helper to calculate total summary
const getTotalSummary = (attendanceData) => {
  let present = 0, absent = 0, other = 0;
  Object.values(attendanceData).forEach((status) => {
    if (status === STATUS.PRESENT) present++;
    else if (status === STATUS.ABSENT) absent++;
    else if (status === STATUS.OTHER) other++;
  });
  return { present, absent, other };
};

// Helper to calculate current week summary
const getCurrentWeekSummary = (attendanceData) => {
  let present = 0, absent = 0, other = 0;
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday

  Object.entries(attendanceData).forEach(([date, status]) => {
    const d = new Date(date);
    if (d >= startOfWeek && d <= today) {
      if (status === STATUS.PRESENT) present++;
      else if (status === STATUS.ABSENT) absent++;
      else if (status === STATUS.OTHER) other++;
    }
  });

    return { present, absent, other };
  };

// Helper for percentages
const getPercentages = (summary) => {
  const total = summary.present + summary.absent + summary.other;
  if (total === 0) return { present: 0, absent: 0, other: 0 };

  return {
    present: ((summary.present / total) * 100).toFixed(1),
    absent: ((summary.absent / total) * 100).toFixed(1),
    other: ((summary.other / total) * 100).toFixed(1),
    };
  };


  // Month markers
  const monthMarkers = [];
  weeks.forEach((week, weekIndex) => {
    const firstDay = week[0];
    if (firstDay.getDate() <= 7) {
      monthMarkers.push({ month: months[firstDay.getMonth()], weekIndex });
    }
  });

  // 🔹 Simulated backend fetch
  useEffect(() => {
    // Example: Later replace this with API call
    // const fetchData = async () => {
    //   // Simulated data: key = YYYY-MM-DD, value = status
    //   const data = {
    //     "2025-01-01": STATUS.PRESENT,
    //     "2025-01-02": STATUS.ABSENT,
    //     "2025-01-03": STATUS.OTHER,
    //     "2025-01-04": STATUS.PRESENT,
    //   };
    //   setAttendanceData(data);
    // };
    // fetchData();
    if (selectedClass) {
    setIsLoading(false); // Just mark ready once class is set
  }
  }, [selectedClass]);

  // Helper to format date keys in local time to avoid UTC shift
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`; // YYYY-MM-DD
  };

  // Handle tap on a cell
  const handleDayPress = (date) => {
    const key = formatDate(date);
    const status = attendanceData[key] ?? null;

    let message;
    if (status === STATUS.PRESENT) message = "✅ Present";
    else if (status === STATUS.ABSENT) message = "❌ Absent";
    else if (status === STATUS.OTHER) message = "ℹ️ Other (Genuine Reason)";
    else message = "No data available";

    Alert.alert(`Date: ${key}`, message);
  };


  // profile button logical functions
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
          }
        }
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
  
  

  return (
    <View style={[styles.safeContainer,{paddingTop:insets.top} ]}>
      {/* header sepearate from scroll view */}
      <View style={styles.headerContainer}>
      <Text style={styles.title}>👋 Hi, {firstName}!</Text>
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
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => handleEditProfile()}
            >
              <MaterialCommunityIcons name="account-edit" size={20} color="#374151" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => handleAboutPage()}
            >
              <MaterialCommunityIcons name="information" size={20} color="#374151" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>About Application</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity 
              style={[styles.menuItem, styles.menuItemDanger]} 
              onPress={() => handleLogout()}
            >
              <MaterialCommunityIcons name="logout" size={20} color="#ef4444" style={styles.menuIcon} />
              <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
    <ScrollView style={[styles.screen]}>
      
      {/* <View style={flexDirection = 'row' }  >
        <MaterialCommunityIcons name='profile' size={32} color="#ff6b6b"/>
        <Text style={styles.title}>👋 Hi, {firstName}!</Text>
      </View> */}
      

      {/* Welcome Box */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Welcome to {selectedClass.name}</Text>
      </View>

      {/* Quick Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Summary</Text>
        <View style={styles.innerBox}>
          {(() => {
            const bestStreak = getBestStreak(attendanceData);
            const totalSummary = getTotalSummary(attendanceData);
            const weekSummary = getCurrentWeekSummary(attendanceData);
            const percentages = getPercentages(totalSummary);

            return (
              <>
                <Text style={styles.summaryText}>🔥 Best Streak: {bestStreak} days</Text>

                <Text style={styles.summarySubTitle}>📅 Current Week</Text>
                <Text style={styles.summaryText}>
                  Present: {weekSummary.present} | Absent: {weekSummary.absent} | Other: {weekSummary.other}
                </Text>

                <Text style={styles.summarySubTitle}>📊 Total</Text>
                <Text style={styles.summaryText}>
                  Present: {totalSummary.present} | Absent: {totalSummary.absent} | Other: {totalSummary.other}
                </Text>

                <Text style={styles.summarySubTitle}>📈 Percentages</Text>
                <Text style={styles.summaryText}>
                  Present: {percentages.present}% | Absent: {percentages.absent}% | Other: {percentages.other}%
                </Text>
              </>
            );
          })()}
        </View>
      </View>


      {/* Streak Section */}
      <View style={styles.card}>
        <View style={styles.streakHeader}>
          <Text style={styles.cardTitle}>Streak</Text>
          <Animatable.View 
            animation="pulse" 
            easing="ease-out" 
            iterationCount="infinite" 
            style={styles.streakIconWrapper}
          >
            <MaterialCommunityIcons name="fire" size={32} color="#ff6b6b" />
          </Animatable.View>
        </View>
        <Text style={styles.streakCounter}>🔥 20 Days</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "column" }}>
            
            {/* Month Row */}
            <View style={styles.monthRow}>
              <View style={{ width: 36 }} /> 
              {weeks.map((_, weekIndex) => {
                const marker = monthMarkers.find(m => m.weekIndex === weekIndex);
                return (
                  <View key={weekIndex} style={{ width: 36, alignItems: "center" }}>
                    {marker ? (
                      <Text style={styles.monthText}>{marker.month}</Text>
                    ) : null}
                  </View>
                );
              })}
            </View>

            <View style={{ flexDirection: "row" }}>
              {/* Weekday labels */}
              <View style={{ marginRight: 6 }}>
                {weekdays.map((day) => (
                  <View key={day} style={{ height: 36, justifyContent: "center" }}>
                    <Text style={styles.weekdayText}>{day}</Text>
                  </View>
                ))}
              </View>

              {/* Contribution Grid */}
              <View style={{ flexDirection: "row" }}>
                {weeks.map((week, weekIndex) => (
                  <View key={weekIndex} style={styles.weekColumn}>
                    {week.map((date, dayIndex) => {
                      const key = formatDate(date);
                      const status = attendanceData[key] ?? null;
                      return (
                        <Pressable
                          key={dayIndex}
                          onPress={() => handleDayPress(date)}
                        >
                          <View
                            style={[
                              styles.dayBox,
                              { backgroundColor: getStatusColor(status) }
                            ]}
                          >
                            <Text style={styles.dayText}>{date.getDate()}</Text>
                          </View>
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
    </ScrollView>
    </View>
    
  );
};

export default UserHome;

const styles = StyleSheet.create({
  safeContainer:{
    flex: 1,
    backgroundColor: "green",
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
