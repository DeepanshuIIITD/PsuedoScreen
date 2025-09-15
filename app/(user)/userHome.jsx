// import React from 'react';
// import { ScrollView, StyleSheet, Text, View } from 'react-native';



// const generateYearData = () => {
//   const daysInYear = 365;
//   const data = [];
//   for (let i = 0; i < daysInYear; i++) {
//     // Random streak values (replace with your actual streak data)
//     data.push(Math.floor(Math.random() * 5));
//   }
//   return data;
// };

// const getColor = (value) => {
//   switch (value) {
//     case 0: return "#ebedf0"; // light gray
//     case 1: return "#9be9a8"; // light green
//     case 2: return "#40c463"; // medium green
//     case 3: return "#30a14e"; // dark green
//     case 4: return "#216e39"; // darkest green
//     default: return "#ebedf0";
//   }
// };

// const userHome = () => {

//   const [firstName, setFirstName] = React.useState('')
  
//   const data = generateYearData();
//   const weeks = [];

//   // Split data into weeks (7 days each)
//   for (let i = 0; i < data.length; i += 7) {
//     weeks.push(data.slice(i, i + 7));
//   }

//   return (
//     <View style={{flex: 1}}>
//       {/* <View style={{height:1,backgroundColor: 'black', width:'100%', marginTop: 50 }}/>
//       <View style={styles.container}>
//         <Text style={styles.title}> User Home Screen</Text>
//       </View> */}
//       <Text style= {styles.title}> Hi, {firstName}! </Text>
//       <View style={styles.mainBox}>
//         <View style={styles.welcomeBox}>
//           <Text style={styles.text}>Welcome to Class_Name</Text>
//         </View>
//         <View style={styles.outerSummaryBox}>
//           <Text style={styles.summaryText}>Quick Summary</Text>
//             <View style={styles.summarBox}>
//               <Text style={styles.text}>Week Data</Text>
//             </View>
//         </View>
//         <View style={styles.outerSummaryBox}>
//           <Text style={styles.summaryText}>Streak Chart</Text>
//           <Text style={styles.streakCounter}> 20 </Text>
//             <View style={styles.summarBox}>
//               {/* <Text style={styles.text}>Yearly Graph</Text> */}
//              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               <View style={{ flexDirection: "row" }}>
//                 {weeks.map((week, weekIndex) => (
//                   <View key={weekIndex} style={styles.weekColumn}>
//                     {week.map((day, dayIndex) => (
//                       <View
//                         key={dayIndex}
//                         style={[
//                           styles.dayBox,
//                           { backgroundColor: getColor(day) }
//                         ]}
//                       />
//                     ))}
//                   </View>
//                 ))}
//               </View>
//               </ScrollView> 
//             </View>
//         </View>
      

//       </View>

//     </View>
//   )
// }

// export default userHome

// const styles = StyleSheet.create({
//     container: {
//         flex:1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         // backgroundColor: '#922f2fff',
//     },
//     outerSummaryBox: {
//         backgroundColor: 'blue',
//         padding: 10,
//         borderRadius: 20,
//         marginTop: 10,
//         marginBottom: 30,
//     }
//     ,
//     summarBox: {
//         backgroundColor: 'green',
//         padding: 10,
//         marginTop: 5,
//         borderRadius: 20,
//         width: '70%',
//         alignSelf: 'center',
//     }
//     ,
//     welcomeBox: {
//         // height: 60,
//         // justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#88ddf0ff',
//         marginTop: 10,
//         borderRadius: 20,
//         padding: 10,
//         marginBottom: 90,
//     }
//     ,
//     mainBox: {
//         // flex: 1,
//         justifyContent: 'center',
//         // alignItems: 'center',
//         backgroundColor: '#f28181ff',
//         margin: 20,
//         borderRadius: 20,
//         padding: 10,
//     },
//     title:{
//         fontSize: 42,
//         fontWeight: 'bold',
//         color: '#f5f1f1ff',
//         marginBottom: 20,
//     },
//     text: {
//         color: '#0c0a0aff',
//         textAlign: 'center',
//         fontWeight: 'bold',
//         fontSize: 30,
//     },
//     summaryText: {
//         color: '#0c0a0aff',
//         // textAlign: 'center',
//         fontWeight: 'bold',
//         fontSize: 20,
//     },
//     streakCounter: {
//         fontSize: 30,
//         fontWeight: 'bold',
//         color: '#f5f1f1ff',
//         marginTop: 10,
//         textAlign: 'right',
//     },
//     weekColumn: {
//     flexDirection: "column",
//     margin: 2,
//   },
//   dayBox: {
//     width: 16,
//     height: 16,
//     margin: 1,
//     borderRadius: 2,
//   },

// })

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

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
  const [firstName] = useState("Deepanshu");
  const [attendanceData, setAttendanceData] = useState({}); 

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
    const fetchData = async () => {
      // Simulated data: key = YYYY-MM-DD, value = status
      const data = {
        "2025-01-01": STATUS.PRESENT,
        "2025-01-02": STATUS.ABSENT,
        "2025-01-03": STATUS.OTHER,
        "2025-01-04": STATUS.PRESENT,
      };
      setAttendanceData(data);
    };
    fetchData();
  }, []);

  // Helper to format date keys
  const formatDate = (date) => {
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
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

  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.title}>👋 Hi, {firstName}!</Text>

      {/* Welcome Box */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Welcome to Class_Name</Text>
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
  );
};

export default UserHome;

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
