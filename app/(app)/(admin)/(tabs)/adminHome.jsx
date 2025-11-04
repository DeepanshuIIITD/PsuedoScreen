import { useAuth } from '@/app/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useClass } from '../../../contexts/ClassContext';



const STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  OTHER: 'other',
};

const AdminHome = () => {
  const { user, apiCall } = useAuth();
  const {selectedClass } = useClass();
  // const { classId, className, classCode, email, phone } = useLocalSearchParams();
  const API = "https://streak-app-uxyv.onrender.com";

  const [classData, setClassData] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  

  // Fetch class data when component mounts
  useEffect(() => {
    if (selectedClass) {
    setIsLoading(false); // Just mark ready once class is set
  }
}, [selectedClass]);
console.log("Selected class :", selectedClass);

  const fetchAttendanceData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch attendance data for this class
      const attendanceResponse = await apiCall(`${API}/admin/class/${classId}/attendance`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      console.log("Attendance data:", attendanceResponse);
      setAttendanceData(attendanceResponse || {});

    } catch (err) {
      console.error("Error fetching attendance data:", err);
      // Set empty object if fetch fails, so UI still shows class info
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

  // const bestStreak = getBestStreak(attendanceData);
  // const totalSummary = getTotalSummary(attendanceData);
  // const weekSummary = getCurrentWeekSummary(attendanceData);
  // const todayStrength = getTodayStrength(attendanceData);
  // const totalPercentages = getPercentages(totalSummary);
  // const todayPercentages = getPercentages(todayStrength);


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Hi, {user?.userName || 'Admin'}!</Text>
      
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
      {/* <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Summary</Text>
        <View style={styles.innerBox}>
          <Text style={styles.summaryText}>Best Streak: {bestStreak} days</Text>

          <Text style={styles.summarySubTitle}>Current Week</Text>
          <Text style={styles.summaryText}>
            Present: {weekSummary.present} | Absent: {weekSummary.absent} | Other: {weekSummary.other}
          </Text>

          <Text style={styles.summarySubTitle}>Total</Text>
          <Text style={styles.summaryText}>
            Present: {totalSummary.present} | Absent: {totalSummary.absent} | Other: {totalSummary.other}
          </Text>

          <Text style={styles.summarySubTitle}>Percentages</Text>
          <Text style={styles.summaryText}>
            Present: {totalPercentages.present}% | Absent: {totalPercentages.absent}% | Other: {totalPercentages.other}%
          </Text>
        </View>
      </View>

      {/* Today's Summary */}
      {/* <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Summary</Text>
        <View style={styles.innerBox}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          
          <Text style={styles.summarySubTitle}>Total</Text>
          <Text style={styles.summaryText}>
            Present: {todayStrength.present} | Absent: {todayStrength.absent} | Other: {todayStrength.other}
          </Text>
          
          <Text style={styles.summarySubTitle}>Percentage</Text>
          <Text style={styles.summaryText}>
            Present: {todayPercentages.present}% | Absent: {todayPercentages.absent}% | Other: {todayPercentages.other}%
          </Text>
        </View>
      </View> */}
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