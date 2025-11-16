import { useAuth } from '@/app/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { API } from "@env";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useClass } from '../../../contexts/ClassContext';

const AdminHome = () => {
  const { user, apiCall, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const palette = colorScheme === 'dark'
    ? { bg:'#0b0f14', card:'#0f172a', text:'#e5e7eb', sub:'#94a3b8', border:'#1f2937' }
    : { bg:'#f9fafb', card:'#ffffff', text:'#111827', sub:'#374151', border:'#e5e7eb' };
  const {selectedClass } = useClass();

  const [classData, setClassData] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [bestStreak, setBestStreak] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totals, setTotals] = useState({ present: 0, absent: 0, other: 0 });
  const [weekSummary, setWeekSummary] = useState({ present: 0, absent: 0, other: 0 });
  const [todayStrength, setTodayStrength] = useState({ present: 0, absent: 0, other: 0 });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isReportView, setIsReportView] = useState(null); 
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState({ present: 0, absent: 0, other: 0 });
  const [currentYear, setCurrentYear] = useState({ present: 0, absent: 0, other: 0 });

  // Fetch class data when component mounts
  useEffect(() => {
    if (selectedClass) {
      setIsLoading(false);
      fetchAttendanceData();
    }
  }, [selectedClass]);
  console.log("Selected class :", selectedClass);

  const fetchAttendanceData = async () => {
    try {
      setIsLoading(true);

      const quickSummary = await apiCall(`${API}/admin/quickSummary/${selectedClass.id}`,{
        method: `GET`,
        headers : {'content-Type': 'application/json'},
      });
      console.log("Admin Quick - Summary looks like , ", quickSummary);

      const todaysAttendance = await apiCall(`${API}/admin/todaySummary/${selectedClass.id}`,{
        method: 'GET',
        headers : {'content-Type' : 'application/json'},
      });
      console.log("Admin Todays - Summary looks like , ",todaysAttendance);


      const performance = await apiCall(`${API}/admin/report`,{
        method: 'GET',
        headers: {'content-Type' : 'application/json'},
      });

      const cm = performance.class_report.current_month;
      const cy = performance.class_report.current_year;
      setCurrentMonth({
        present: cm.present,
        absent: cm.absent,
        other: cm.not_marked,
      });

      setCurrentYear({
        present: cy.present,
        absent: cy.absent,
        other: cy.not_marked,
      })

      const q = quickSummary.summary;
      setTotals({
        present: q.total_present,
        absent: q.total_absent,
        other: q.total_students - (q.total_present + q.total_absent),
      });
      setWeekSummary({
        present: q.current_week_present ?? 0,
        absent: q.current_week_absent ?? 0,
        other: 0,  // for now unmarked is set to zero
      });

      const t = todaysAttendance.summary;
      setTodayStrength({
        present: t.total_present,
        absent: t.total_absent,
        other: t.total_students - (t.total_absent+t.total_present),
      });

    getBestStreak();
  
  } catch (err) {
      console.error("Error fetching quickSummary data:", err);
      setAttendanceData({});
    } finally {
      setIsLoading(false);
    }
  };

  const getBestStreak = async () => {
    let best = 0, current = 0;
    const streak = await apiCall(`${API}/admin/streak/${selectedClass.id}`,{
      method: `GET`,
      headers: `application-Type/json`,
    });
    best = streak.bestStreak;
    setBestStreak(best);
    current = streak.currentStreak;
    setCurrentStreak(current);
    // return best;
  };

const handleEditProfile = async () => {
    setMenuVisible(false);
    router.push("/(app)/(admin)/editProfile");
  };

const handleAboutPage = async () => {
    setMenuVisible(false);
    router.push("/(app)/(admin)/about");
  };

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


  const getPercentages = (summary) => {
    const total = summary.present + summary.absent + summary.other;
    if (total === 0) return { present: 0, absent: 0, other: 0 };

    return {
      present: ((summary.present / total) * 100).toFixed(1),
      absent: ((summary.absent / total) * 100).toFixed(1),
      other: ((summary.other / total) * 100).toFixed(1),
    };
  };


  // 👉 Monthly Report
    const renderMonthlyReport = () => (
    <>
      <Text style={styles.cardTitle}>Monthly Report</Text>
      <Text style={styles.summaryText}>Total Classes Joined: {currentMonth.present}</Text>
      <Text style={styles.summaryText}>Total Classes Missed: {currentMonth.absent}</Text>
      <Text style={styles.summaryText}>Best Monthly Streak: 14</Text>
      <View style={styles.streakHeader}>
        <View style={styles.streakIconWrapper}>
          <Text style={{ fontSize: 24 }}>🔥</Text>
        </View>
        <Text style={styles.streakCounter}>Current Streak: 7 days</Text>
      </View>
    </>
  );
  
  const renderYearlyReport = () => (
    <>
      <Text style={styles.cardTitle}>Yearly Report</Text>
      <Text style={styles.summaryText}>Total Classes Joined: {currentYear.present}</Text>
      <Text style={styles.summaryText}>Total Classes Missed: {currentYear.absent}</Text>
      <Text style={styles.summaryText}>Best Yearly Streak: 156</Text>
      <View style={styles.streakHeader}>
        <Text style={styles.streakCounter}>Longest Streak: 30 days</Text>
        <View style={styles.streakIconWrapper}>
          <Text style={{ fontSize: 24 }}>🔥</Text>
        </View>
      </View>
    </>
  );

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

  
  const totalPercentages = getPercentages(totals);
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
            <View style={[styles.menuContainer,{backgroundColor: palette.menuBg, borderColor: palette.border}] }>
              {/* <TouchableOpacity
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
              </TouchableOpacity> */}
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleEditProfile()}
              >
                <MaterialCommunityIcons name="account-edit" size={20} color="#374151" style={styles.menuIcon} />
                <Text style={[styles.menuItemText,{color: palette.text}]}>Edit Profile</Text>
              </TouchableOpacity>
              <View style={styles.menuDivider} />
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => handleAboutPage()}
              >
                <MaterialCommunityIcons name="information" size={20} color="#374151" style={styles.menuIcon} />
                <Text style={[styles.menuItemText,{color: palette.text}]}>About Application</Text>
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
            Present: {totals.present} | Absent: {totals.absent} | Other: {totals.other}
          </Text>

          <Text style={[styles.summarySubTitle,{color: colorScheme==='dark' ? '#93c5fd' : '#2563eb'}]}>Percentages</Text>
          <Text style={[styles.summaryText,{color: palette.text}] }>
            Present: {totalPercentages.present}% | Absent: {totalPercentages.absent}% | Other: {totalPercentages.other}%
          </Text>
        {/* </View> */}
        {/* Here I report button similar to personal report */}
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <TouchableOpacity
              style={[
                styles.reportButton,
                isReportView === true && { backgroundColor: "#7c3aed" }
              ]}
              onPress={() => setIsReportView(isReportView === true ? null : true)} // toggle
            >
              <Text style={styles.cardText}>Monthly Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.reportButton,
                isReportView === false && { backgroundColor: "#7c3aed" }
              ]}
              onPress={() => setIsReportView(isReportView === false ? null : false)} // toggle
            >
              <Text style={styles.cardText}>Yearly Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {isReportView !== null && (
          <View style={[styles.card,{backgroundColor: palette.card, borderWidth:1, borderColor: palette.border}] }>
            {isReportView ? renderMonthlyReport() : renderYearlyReport()}
          </View>
        )}

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
  cardText: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
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