import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const adminHome = () => {

  const [firstName] = useState("Deepanshu")
  const [attendanceData, setAttendanceData] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [className,setClassName] = useState(" ");
  const [classCode, setClassCode] = useState(" ");




  const getClassCode = (className,firstName) => {

  };

  const getTodayStrength = (attendanceData) => {
    let present = 0, absent =0, other = 0;
    let today = new Date();
    // if(attendanceData[today] == STATUS.PRESENT) {
    //   present ++;
    // }
    // else if(attendanceData[today] == STATUS.ABSENT){
    //   absent++;
    // }
    // else{
    //   other++;
    // }
    return {present,absent,other};
  };

  const getTodayPercentage = (attendanceData) => {
    // let today = new Date();
    // let total = (present + absent + other);

    // return {
    //   Present: ( attendanceData.present / total  * 100).toFixed(1),
    //   Absent: ( attendanceData.absent / total  * 100).toFixed(1),
    //   Other : ( attendanceData.other / total  * 100).toFixed(1),
    // };
  };

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

  // todays summary
  useEffect(() => {
    // Optional: If you want to update the date every second, for example
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  // Format the date for display
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>👋 Hi, {firstName}!</Text>
      {/* Welcome Box */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Welcome "Class Name"</Text>
      </View>
      {/*Summary Box */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Summary</Text>
        {/*copy from userHome */}
        <View >
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
      </View>
      {/* Today's summary */}
      <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Summary</Text>
          <View style={styles.innerBox}>
            <Text style={styles.cardText}>{formattedDate}</Text>
            {(() => {
              const todaysTotal = getTodayStrength(attendanceData);
              const todaySummary = getTodayPercentage(attendanceData);
              
              return (
                <>
                  <Text style={styles.summarySubTitle}>📊 Total</Text>
                  <Text style={styles.summaryText}>
                    Present: {todaysTotal.present} | Absent: {todaysTotal.absent} | Other: {todaysTotal.other}
                  </Text>
                  
                  <Text style={styles.summarySubTitle}>📈 Percentage </Text>
                  <Text style={styles.summaryText}>
                    {/* Present: {todaySummary.present}% | Absent: {todaySummary.absent}% | Other: {todaySummary.other}% */}
                    Present: {"0"}% | Absent: {"0"}% | Other: {"0"}%
                  </Text>

                </>
              )

            })()}
          </View>
      </View>
    </ScrollView>
  )
}

export default adminHome

const styles = StyleSheet.create({
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
});
