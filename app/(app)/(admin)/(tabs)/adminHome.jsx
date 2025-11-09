import { useAuth } from '@/app/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useClass } from '../../../contexts/ClassContext';

const USE_MOCK = true; // Toggle mocked admin APIs



const STATUS = {
  PRESENT: 1, // Match userHome.jsx status format
  ABSENT: 0,
  OTHER: 2,
};

const AdminHome = () => {
  const { user, apiCall, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const palette = colorScheme === 'dark'
    ? { bg:'#0b0f14', card:'#0f172a', text:'#e5e7eb', sub:'#94a3b8', border:'#1f2937' }
    : { bg:'#f9fafb', card:'#ffffff', text:'#111827', sub:'#374151', border:'#e5e7eb' };
  const {selectedClass } = useClass();
  // const { classId, className, classCode, email, phone } = useLocalSearchParams();
  const API = "https://streak-app-uxyv.onrender.com";

  const [classData, setClassData] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  

  // Fetch class data when component mounts
  useEffect(() => {
    if (selectedClass) {
      setIsLoading(false);
      // Fetch mock attendance data for UI demonstration
      fetchAttendanceData();
    }
  }, [selectedClass]);
  console.log("Selected class :", selectedClass);

  // Mock attendance data for UI demonstration
  // TODO: Replace with actual API call when backend is ready
  const fetchAttendanceData = async () => {
    try {
      setIsLoading(true);
      
      // Expected backend APIs (commented)
      // GET `${API}/admin/class/${selectedClass.id}/attendance?range=today|week|month`
      // Response:
      // { "attendance": { "YYYY-MM-DD": 0|1|2, ... } }
      // GET `${API}/admin/class/${selectedClass.id}/analytics`
      // Response:
      // { "bestStreak": number, "totals": { "present": number, "absent": number, "other": number } }

      // Mock data for frontend demonstration
      const mockAttendanceData = {
        "2025-01-01": STATUS.PRESENT,
        "2025-01-02": STATUS.PRESENT,
        "2025-01-03": STATUS.ABSENT,
        "2025-01-04": STATUS.PRESENT,
      };
      
      setAttendanceData(mockAttendanceData);

      // TODO: Uncomment when backend is ready
      // if (selectedClass?.id) {
      //   const attendanceResponse = await apiCall(`${API}/admin/class/${selectedClass.id}/attendance`, {
      //     method: "GET",
      //     headers: { "Content-Type": "application/json" },
      //   });
      //   setAttendanceData(attendanceResponse || {});
      // }

    } catch (err) {
      console.error("Error fetching attendance data:", err);
      setAttendanceData({});
    } finally {
      setIsLoading(false);
    }
  };

  const getBestStreak = (attendanceData) => {
    let best = 0, current = 0;
    const dates = Object.keys(attendanceData).sort();
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

  const getTotalSummary = (attendanceData) => {
    let present = 0, absent = 0, other = 0;
    Object.values(attendanceData).forEach((status) => {
      if (status === STATUS.PRESENT) present++;
      else if (status === STATUS.ABSENT) absent++;
      else if (status === STATUS.OTHER) other++;
    });
    return { present, absent, other };
  };

  const getCurrentWeekSummary = (attendanceData) => {
    let present = 0, absent = 0, other = 0;
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);

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

  const getTodayStrength = (attendanceData) => {
    let present = 0, absent = 0, other = 0;
    const today = new Date().toISOString().split('T')[0];
    
    if (attendanceData[today]) {
      if (attendanceData[today] === STATUS.PRESENT) present++;
      else if (attendanceData[today] === STATUS.ABSENT) absent++;
      else other++;
    }
    
    return { present, absent, other };
  };

  const getPercentages = (summary) => {
    const total = summary.present + summary.absent + summary.other;
    if (total === 0) return { present: 0, absent: 0, other: 0 };

    return {
      present: ((summary.present / total) * 100).toFixed(1),
      absent: ((summary.absent / total) * 100).toFixed(1),
      other: ((summary.other / total) * 100).toFixed(1),
    };
  };

  // Update current date every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute instead of every second

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading class data...</Text>
      </View>
    );
  }

  if (!selectedClass) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No class selected</Text>
        <Pressable 
          style={styles.backButton} 
          onPress={() => router.push("/(admin)/adminClassSelector")}
        >
          <Text style={styles.backButtonText}>Go to Class Selector</Text>
        </Pressable>
      </View>
    );
  }

  const bestStreak = getBestStreak(attendanceData);
  const totalSummary = getTotalSummary(attendanceData);
  const weekSummary = getCurrentWeekSummary(attendanceData);
  const todayStrength = getTodayStrength(attendanceData);
  const totalPercentages = getPercentages(totalSummary);
  const todayPercentages = getPercentages(todayStrength);


  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top, backgroundColor: palette.bg }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
    >
      <View style={styles.headerContainer}>
        <Text style={[styles.title,{color: palette.text}]}>Hi, {user?.userName || 'Admin'}!</Text>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <MaterialCommunityIcons name="account-circle" size={32} color="#2563eb" />
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
                style={[styles.menuItem, styles.menuItemDanger]}
                onPress={() => {
                  Alert.alert(
                    'Logout',
                    'Are you sure you want to logout?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Logout', style: 'destructive', onPress: async () => { await logout(); } },
                    ]
                  );
                }}
              >
                <MaterialCommunityIcons name="logout" size={20} color="#ef4444" style={styles.menuIcon} />
                <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      
      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statChip, { backgroundColor: colorScheme==='dark' ? '#0b2a3a' : '#e0f2fe' }]}>
          <Text style={[styles.statLabel,{color: palette.sub}]}>Class</Text>
          <Text style={[styles.statValue,{color: palette.text}]}>{selectedClass.name?.slice(0, 14) || '—'}</Text>
        </View>
        <View style={[styles.statChip, { backgroundColor: colorScheme==='dark' ? '#0c2d1f' : '#dcfce7' }]}>
          <Text style={[styles.statLabel,{color: palette.sub}]}>Best Streak</Text>
          <Text style={[styles.statValue,{color: palette.text}]}>{bestStreak}</Text>
        </View>
        <View style={[styles.statChip, { backgroundColor: colorScheme==='dark' ? '#3b0b0b' : '#fee2e2' }]}>
          <Text style={[styles.statLabel,{color: palette.sub}]}>Today Present</Text>
          <Text style={[styles.statValue,{color: palette.text}]}>{todayStrength.present}</Text>
        </View>
      </View>

      {/* Welcome Box */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{selectedClass.name}</Text>
        <View style={styles.classInfoRow}>
          <Text style={styles.classInfoText}>Code: {selectedClass.code}</Text>
        </View>
        <View style={styles.classInfoRow}>
          <Text style={styles.classInfoText}>Email: {selectedClass.email}</Text>
        </View>
        <View style={styles.classInfoRow}>
          <Text style={styles.classInfoText}>Phone: {selectedClass.phone}</Text>
        </View>
      </View>

      {/* Quick Summary Box */}
      <View style={[styles.card,{backgroundColor: palette.card, borderColor: palette.border, borderWidth: 1}] }>
        <Text style={[styles.cardTitle,{color: palette.text}]}>Quick Summary</Text>
        <View style={[styles.innerBox,{backgroundColor: colorScheme==='dark' ? '#111827' : '#f3f4f6'}]}>
          <Text style={[styles.summaryText,{color: palette.text}]}>Best Streak: {bestStreak} days</Text>

          <Text style={[styles.summarySubTitle,{color: colorScheme==='dark' ? '#93c5fd' : '#2563eb'}]}>Current Week</Text>
          <Text style={[styles.summaryText,{color: palette.text}] }>
            Present: {weekSummary.present} | Absent: {weekSummary.absent} | Other: {weekSummary.other}
          </Text>

          <Text style={[styles.summarySubTitle,{color: colorScheme==='dark' ? '#93c5fd' : '#2563eb'}]}>Total</Text>
          <Text style={[styles.summaryText,{color: palette.text}] }>
            Present: {totalSummary.present} | Absent: {totalSummary.absent} | Other: {totalSummary.other}
          </Text>

          <Text style={[styles.summarySubTitle,{color: colorScheme==='dark' ? '#93c5fd' : '#2563eb'}]}>Percentages</Text>
          <Text style={[styles.summaryText,{color: palette.text}] }>
            Present: {totalPercentages.present}% | Absent: {totalPercentages.absent}% | Other: {totalPercentages.other}%
          </Text>
        </View>
      </View>

      {/* Today's Summary */}
      <View style={[styles.card,{backgroundColor: palette.card, borderColor: palette.border, borderWidth: 1}] }>
        <Text style={[styles.cardTitle,{color: palette.text}]}>Today's Summary</Text>
        <View style={[styles.innerBox,{backgroundColor: colorScheme==='dark' ? '#111827' : '#f3f4f6'}]}>
          <Text style={[styles.dateText,{color: palette.text}]}>{formattedDate}</Text>
          
          <Text style={styles.summarySubTitle}>Total</Text>
          <Text style={styles.summaryText}>
            Present: {todayStrength.present} | Absent: {todayStrength.absent} | Other: {todayStrength.other}
          </Text>
          
          <Text style={styles.summarySubTitle}>Percentage</Text>
          <Text style={styles.summaryText}>
            Present: {todayPercentages.present}% | Absent: {todayPercentages.absent}% | Other: {todayPercentages.other}%
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default AdminHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6b7280",
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  statChip: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 998,
  },
  menuContainer: {
    position: 'absolute',
    top: 46,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    elevation: 10,
    zIndex: 9999,
    minWidth: 180,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  menuItemDanger: {},
  menuIcon: { marginRight: 12 },
  menuItemText: { fontSize: 16, color: '#374151', fontWeight: '500' },
  menuItemTextDanger: { color: '#ef4444' },
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
  classInfoRow: {
    marginVertical: 4,
  },
  classInfoText: {
    fontSize: 14,
    color: "#374151",
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
  dateText: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "500",
  },
  innerBox: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  backButton: {
  backgroundColor: "#2563eb",
  paddingHorizontal: 20,
  paddingVertical: 12,
  borderRadius: 8,
  },
  backButtonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
  },
});