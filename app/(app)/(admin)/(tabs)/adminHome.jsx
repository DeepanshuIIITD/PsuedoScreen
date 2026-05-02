import { useAuth } from '@/app/contexts/AuthContext';
import { useClass } from '@/app/contexts/ClassContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AdminHome = () => {
  const { user, apiCall, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const palette = colorScheme === 'dark'
    ? { bg:'#0b0f14', card:'#0f172a', text:'#e5e7eb', sub:'#94a3b8', border:'#1f2937', menuBg:'#1e293b' }
    : { bg:'#f9fafb', card:'#ffffff', text:'#111827', sub:'#374151', border:'#e5e7eb', menuBg:'#ffffff' };
  const { selectedClass } = useClass();

  const [bestStreak, setBestStreak] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totals, setTotals] = useState({ present: 0, absent: 0, other: 0 });
  const [weekSummary, setWeekSummary] = useState({ present: 0, absent: 0, other: 0 });
  const [todayStrength, setTodayStrength] = useState({ present: 0, absent: 0, other: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isReportView, setIsReportView] = useState(null); 
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState({ present: 0, absent: 0, other: 0 });
  const [currentYear, setCurrentYear] = useState({ present: 0, absent: 0, other: 0 });
  
  const API = Constants.expoConfig.extra.API_URL;

  // Fetch data only when selectedClass changes
  useEffect(() => {
    if (!selectedClass) {
      setIsLoading(false);
      return;
    }
    
    fetchAllData();
  }, [selectedClass]);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);

      // Fetch quick summary
      const quickSummary = await apiCall(`${API}/admin/quickSummary/${selectedClass.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      // Fetch today's attendance
      const todaysAttendance = await apiCall(`${API}/admin/todaySummary/${selectedClass.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      // Fetch performance report
      const performance = await apiCall(`${API}/admin/report/${selectedClass.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      // Fetch streak
      const streak = await apiCall(`${API}/admin/streak/${selectedClass.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      // Update all state at once
      if (quickSummary?.summary) {
        const q = quickSummary.summary;
        setTotals({
          present: q.total_present,
          absent: q.total_absent,
          other: q.total_students - (q.total_present + q.total_absent),
          
        });
        setWeekSummary({
          present: q.current_week_present ?? 0,
          absent: q.current_week_absent ?? 0,
          other: 0,
        });
      }

      if (todaysAttendance?.summary) {
        const t = todaysAttendance.summary;
        setTodayStrength({
          present: t.total_present,
          absent: t.total_absent,
          other: t.total_students - (t.total_absent + t.total_present),
        });
      }

      if (performance?.class_report) {
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
        });
      }

      if (streak) {
        setBestStreak(streak.bestStreak ?? 0);
        setCurrentStreak(streak.currentStreak ?? 0);
      }

    } catch (err) {
      console.error("Error fetching admin data:", err);
      Alert.alert('Error', 'Failed to load class data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    setMenuVisible(false);
    router.push("/(app)/(admin)/editProfile");
  };

  const handleAboutPage = () => {
    setMenuVisible(false);
    router.push("/(app)/(admin)/about");
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
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

  const renderMonthlyReport = () => (
    <>
      <Text style={[styles.cardTitle, { color: palette.text }]}>Monthly Report</Text>
      <Text style={[styles.summaryText, { color: palette.text }]}>Total Classes: {currentMonth.present + currentMonth.absent}</Text>
      <Text style={[styles.summaryText, { color: palette.text }]}>Present: {currentMonth.present}</Text>
      <Text style={[styles.summaryText, { color: palette.text }]}>Absent: {currentMonth.absent}</Text>
      <View style={styles.streakHeader}>
        <Text style={styles.streakCounter}>Current Streak: {currentStreak} days</Text>
        <View style={styles.streakIconWrapper}>
          <Text style={{ fontSize: 24 }}>🔥</Text>
        </View>
      </View>
    </>
  );
  
  const renderYearlyReport = () => (
    <>
      <Text style={[styles.cardTitle, { color: palette.text }]}>Yearly Report</Text>
      <Text style={[styles.summaryText, { color: palette.text }]}>Total Classes: {currentYear.present + currentYear.absent}</Text>
      <Text style={[styles.summaryText, { color: palette.text }]}>Present: {currentYear.present}</Text>
      <Text style={[styles.summaryText, { color: palette.text }]}>Absent: {currentYear.absent}</Text>
      <View style={styles.streakHeader}>
        <Text style={styles.streakCounter}>Best Streak: {bestStreak} days</Text>
        <View style={styles.streakIconWrapper}>
          <Text style={{ fontSize: 24 }}>🔥</Text>
        </View>
      </View>
    </>
  );

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: palette.bg }]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={[styles.loadingText, { color: palette.sub }]}>Loading class data...</Text>
      </View>
    );
  }

  if (!selectedClass) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: palette.bg }]}>
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
        <Text style={[styles.title, { color: palette.text }]}>Hi, {user?.firstName || 'Admin'}!</Text>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <MaterialCommunityIcons name="account-circle" size={32} color="#ff6b6b" />
        {/* changed color of icon */} 
        </TouchableOpacity>
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
              <View style={[styles.menuDivider, { backgroundColor: palette.border }]} />
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={handleAboutPage}
              >
                <MaterialCommunityIcons name="information" size={20} color="#374151" style={styles.menuIcon} />
                <Text style={[styles.menuItemText, { color: palette.text }]}>About Application</Text>
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
      
      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statChip, { backgroundColor: colorScheme === 'dark' ? '#0b2a3a' : '#e0f2fe' }]}>
          <Text style={[styles.statLabel, { color: palette.sub }]}>Class</Text>
          <Text style={[styles.statValue, { color: palette.text }]}>{selectedClass.name?.slice(0, 14) || '—'}</Text>
        </View>
        <View style={[styles.statChip, { backgroundColor: colorScheme === 'dark' ? '#0c2d1f' : '#dcfce7' }]}>
          <Text style={[styles.statLabel, { color: palette.sub }]}>Best Streak</Text>
          <Text style={[styles.statValue, { color: palette.text }]}>{bestStreak}</Text>
        </View>
        <View style={[styles.statChip, { backgroundColor: colorScheme === 'dark' ? '#3b0b0b' : '#fee2e2' }]}>
          <Text style={[styles.statLabel, { color: palette.sub }]}>Today Present</Text>
          <Text style={[styles.statValue, { color: palette.text }]}>{todayStrength.present}</Text>
        </View>
      </View>

      {/* Welcome Box */}
      <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <Text style={[styles.cardTitle, { color: palette.text }]}>{selectedClass.name}</Text>
        <View style={styles.classInfoRow}>
          <Text style={[styles.classInfoText, { color: palette.sub }]}>Code: {selectedClass.code}</Text>
        </View>
        <View style={styles.classInfoRow}>
          <Text style={[styles.classInfoText, { color: palette.sub }]}>Email: {selectedClass.email}</Text>
        </View>
        <View style={styles.classInfoRow}>
          <Text style={[styles.classInfoText, { color: palette.sub }]}>Phone: {selectedClass.phone}</Text>
        </View>
      </View>

      {/* Quick Summary Box */}
      <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border, borderWidth: 1 }]}>
        <Text style={[styles.cardTitle, { color: palette.text }]}>Quick Summary</Text>
        <View style={[styles.innerBox, { backgroundColor: colorScheme === 'dark' ? '#111827' : '#f3f4f6' }]}>
          <Text style={[styles.summaryText, { color: palette.text }]}>🔥 Best Streak: {bestStreak} days</Text>

          <Text style={[styles.summarySubTitle, { color: colorScheme === 'dark' ? '#93c5fd' : '#2563eb' }]}>📅 Current Week</Text>
          <Text style={[styles.summaryText, { color: palette.text }]}>
            Present: {weekSummary.present} | Absent: {weekSummary.absent} | Other: {weekSummary.other}
          </Text>

          <Text style={[styles.summarySubTitle, { color: colorScheme === 'dark' ? '#93c5fd' : '#2563eb' }]}>📊 Total</Text>
          <Text style={[styles.summaryText, { color: palette.text }]}>
            Present: {totals.present} | Absent: {totals.absent} | Other: {totals.other}
          </Text>

          <Text style={[styles.summarySubTitle, { color: colorScheme === 'dark' ? '#93c5fd' : '#2563eb' }]}>Percentages</Text>
          <Text style={[styles.summaryText, { color: palette.text }]}>
            Present: {totalPercentages.present}% | Absent: {totalPercentages.absent}% | Other: {totalPercentages.other}%
          </Text>

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

      {/* Today's Summary */}
      <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border, borderWidth: 1 }]}>
        <Text style={[styles.cardTitle, { color: palette.text }]}>Today's Summary</Text>
        <View style={[styles.innerBox, { backgroundColor: colorScheme === 'dark' ? '#111827' : '#f3f4f6' }]}>
          <Text style={[styles.dateText, { color: palette.text }]}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
          
          <Text style={[styles.summarySubTitle, { color: colorScheme === 'dark' ? '#93c5fd' : '#2563eb' }]}>Total</Text>
          <Text style={[styles.summaryText, { color: palette.text }]}>
            Present: {todayStrength.present} | Absent: {todayStrength.absent} | Other: {todayStrength.other}
          </Text>
          
          <Text style={[styles.summarySubTitle, { color: colorScheme === 'dark' ? '#93c5fd' : '#2563eb' }]}>Percentage</Text>
          <Text style={[styles.summaryText, { color: palette.text }]}>
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
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
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
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
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
  menuItemText: { fontSize: 16, fontWeight: '500' },
  menuItemTextDanger: { color: '#ef4444' },
  menuDivider: {
    height: 1,
    marginVertical: 4,
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
  classInfoRow: {
    marginVertical: 4,
  },
  classInfoText: {
    fontSize: 14,
  },
  summaryText: {
    fontSize: 14,
    marginVertical: 2,
  },
  summarySubTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
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
  dateText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "500",
  },
  innerBox: {
    borderRadius: 8,
    padding: 10,
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
  streakHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  streakIconWrapper: {
    backgroundColor: "#fff1f2",
    padding: 8,
    borderRadius: 40,
  },
  streakCounter: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ef4444",
  },
});





// these are just the comments I am making to reduce 
// why do we not feel the way we feel after it. like crystal clear
