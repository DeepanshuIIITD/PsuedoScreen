// import React, { useState } from 'react';
// import { ScrollView, StyleSheet, Text, View } from 'react-native';

// const adminStudents = () => {

//   // list of totalStudents
//   const studentNameList = [{firstName:"hello", lastName: "Bye"},{firstName:"Chaman", lastName: "tel"}]
//   const [studentCount, setStudentCount] = useState(20);
//   // after getting database 



//   const getStudentCountTotal = (studentNameList) => {
//     let length = studentNameList.length() ;
//     // console.log(length);
//     setStudentCount = length;
//     return length;
//   }

//   return (
//     <ScrollView style = {styles.screen}>
//       <View style={styles.card}>
//         <Text style={styles.cardTitle} flexDirection = "row" justifyContent="space-between">Total Students Enrolled
//           <View style={styles.studentCountBox}>
//             <Text style={styles.cardText}>{studentCount}</Text>
//           </View>
//         </Text>
//         <ScrollView style={styles.innerBox}>
//           <View style={styles.innerCard}>
//             <Text style={styles.cardTitle}>Student Name</Text>
//           </View>
//         </ScrollView>
//       </View>

//     </ScrollView>
//   )
// }

// export default adminStudents


// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: "#f9fafb",
//     padding: 16,
//   },
//   innerCard: {
//     backgroundColor: "white",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 6,
//     elevation: 4,
//   },
//   studentCountBox : {
//     backgroundColor: "#e0a2a2ff",
//     borderRadius: 10,
//     padding: 5,
//     marginLeft: 30,

//   },
//   title: {
//     fontSize: 34,
//     fontWeight: "bold",
//     color: "#111827",
//     marginBottom: 20,
//   },
//   card: {
//     backgroundColor: "white",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 6,
//     elevation: 4,
//   },
//   cardTitle: {
//     fontSize: 20,
//     fontWeight: "600",
//     marginBottom: 10,
//     color: "#1f2937",
//   },
//     summaryText: {
//     fontSize: 14,
//     color: "#111827",
//     marginVertical: 2,
//   },
//   summarySubTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginTop: 10,
//     color: "#2563eb",
//   },
//   cardText: {
//     fontSize: 16,
//     color: "#374151",
//     textAlign: "center",
//   },
//   innerBox: {
//     backgroundColor: "#f3f4f6",
//     borderRadius: 12,
//     padding: 12,
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
//     borderRadius: 50,
//   },
//   streakCounter: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: "#ef4444",
//     marginVertical: 12,
//     textAlign: "center",
//   },
//   monthRow: {
//     flexDirection: "row",
//     marginBottom: 6,
//     alignItems: "center",
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
//     margin: 1,
//     borderRadius: 6,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   dayText: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#111827",
//   },
// });









// import React, { useEffect, useState } from "react";
// import { FlatList, StyleSheet, Text, View } from "react-native";


// const adminStudents = () => {
//     const [studentNameList, setStudentNameList] = useState([
//     { id: "1", firstName: "Hello", lastName: "Bye" },
//     { id: "2", firstName: "Chaman", lastName: "Tel" },
//     { id: "3", firstName: "Chaman", lastName: "Bond" },
//     { id: "4", firstName: "Daman", lastName: "Diu" },
//     { id: "5", firstName: "Manan", lastName: "Chugg" },
//     { id: "6", firstName: "Sanam", lastName: "Lust" },
//     { id: "7", firstName: "Janam", lastName: "Bond" },
//     { id: "8", firstName: "Kasam", lastName: "Jhones" },
//     { id: "9", firstName: "Dosti", lastName: "Clarkk" },
//   ]);

//   const[topPerformerList] = useState([
//     {id: "1", firstName: "Chaman", lastName: "Tel"},
//     {id: "5", firstName: "Manan", lastName: "Chugg"},
//     {id: "9", firstName: "Dosti", lastName: "Clark"},
//   ])
//   const [studentCount, setStudentCount] = useState(0);

//   useEffect(() => {
//     setStudentCount(studentNameList.length);
//   }, [studentNameList]);

//   const renderStudentItem = ({ item }) => {
//     const initials =
//       (item.firstName?.[0] || "").toUpperCase() +
//       (item.lastName?.[0] || "").toUpperCase();

//     return (
//       <View style={styles.studentCard}>
//         <View style={styles.avatar}>
//           <Text style={styles.avatarText}>{initials}</Text>
//         </View>
//         <Text style={styles.studentName}>
//           {item.firstName} {item.lastName}
//         </Text>
//       </View>
//     );
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <Text style={styles.title}>👩‍🎓 Students</Text>
//       <View style={styles.card}>
//             <View style={styles.countRow}>
//               <Text style={styles.cardTitle}>Total Students Enrolled</Text>
//               <View style={styles.studentCountBox}>
//                 <Text style={styles.countText}>{studentCount}</Text>
//               </View>
//             </View>
//           </View>
        
//         <View style={styles.card}>
//             <Text style={styles.cardTitle}>Student List</Text>
//             <FlatList
//               style={{ maxHeight: 300,}}    //{/*flexGrow: 0*/}
//               data={studentNameList}
//               keyExtractor={(item) => item.id}
//               renderItem={renderStudentItem}
//               ListEmptyComponent={
//                 <Text style={styles.emptyText}>No students enrolled yet.</Text>
//               }
//             />
//             {/* <View style={styles.card}>
//               <Text style={styles.cardTitle}>Top Performers</Text>
//               <View
//                 data ={topPerformerList}
//                 renderItem={renderStudentItem}
//                 ListEmptyComponent={
//                 <Text style={styles.emptyText}>No students enrolled yet.</Text>
//               }
//                 >
//               </View>
//             </View> */}
//         </View>
//         {/* Top Performers */}
//           <View style={styles.card}>
//             <Text style={styles.cardTitle}>Top Performers</Text>
//             <FlatList
//               data={topPerformerList}
//               keyExtractor={(item) => item.id}
//               renderItem={renderStudentItem}
//               ListEmptyComponent={
//                 <Text style={styles.emptyText}>No top performers yet.</Text>
//               }
//               style={{ maxHeight: 200 }}
//             />
//           </View>
      
//     </View>
//   );
// };

// export default adminStudents;

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: "#f9fafb",
//     padding: 16,
//   },
//   title: {
//     fontSize: 30,
//     fontWeight: "bold",
//     color: "#111827",
//     marginBottom: 16,
//     textAlign: "center",
//   },
//   card: {
//     backgroundColor: "white",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   cardTitle: {
//     fontSize: 24,
//     fontWeight: "600",
//     marginBottom: 10,
//     color: "#1f2937",
//   },
//   countRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   studentCountBox: {
//     backgroundColor: "#dbeafe",
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//   },
//   countText: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#1e3a8a",
//   },
//   studentCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f3f4f6",
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   avatar: {
//     backgroundColor: "#2563eb",
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   avatarText: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   studentName: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: "#111827",
//   },
//   emptyText: {
//     fontSize: 14,
//     color: "#6b7280",
//     textAlign: "center",
//     marginVertical: 20,
//   },
// });


import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const adminStudents = () => {
  const [studentNameList, setStudentNameList] = useState([
    { id: "1", firstName: "Hello", lastName: "Bye" },
    { id: "2", firstName: "Chaman", lastName: "Tel" },
    { id: "3", firstName: "Chaman", lastName: "Bond" },
    { id: "4", firstName: "Daman", lastName: "Diu" },
    { id: "5", firstName: "Manan", lastName: "Chugg" },
    { id: "6", firstName: "Sanam", lastName: "Lust" },
    { id: "7", firstName: "Janam", lastName: "Bond" },
    { id: "8", firstName: "Kasam", lastName: "Jhones" },
    { id: "9", firstName: "Dosti", lastName: "Clarkk" },
    { id: "10", firstName: "Jango", lastName: "Darek" },
  ]);

  const [topPerformerList] = useState([
    { id: "2", rank: 1 }, // 🥇
    { id: "5", rank: 2 }, // 🥈
    { id: "9", rank: 3 }, // 🥉
  ]);

  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    setStudentCount(studentNameList.length);
  }, [studentNameList]);

  // Merge top performers into student list with rank info
  const mergedList = studentNameList
    .map((student) => {
      const performer = topPerformerList.find((p) => p.id === student.id);
      return performer ? { ...student, rank: performer.rank } : { ...student };
    })
    .sort((a, b) => {
      if (a.rank && b.rank) return a.rank - b.rank; // order 1,2,3
      if (a.rank) return -1; // performer first
      if (b.rank) return 1;
      return a.firstName.localeCompare(b.firstName); // rest alphabetically
    });

  const getTrophy = (rank) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return null;
    }
  };

  const renderStudentItem = ({ item }) => {
    const initials =
      (item.firstName?.[0] || "").toUpperCase() +
      (item.lastName?.[0] || "").toUpperCase();

    return (
      <View style={styles.studentCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.studentName}>
          {getTrophy(item.rank)} {item.firstName} {item.lastName}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb", padding: 16 }}>
      <Text style={styles.title}>👩‍🎓 Students</Text>

      {/* Count Card */}
      <View style={styles.card}>
        <View style={styles.countRow}>
          <Text style={styles.cardTitle}>Total Students Enrolled</Text>
          <View style={styles.studentCountBox}>
            <Text style={styles.countText}>{studentCount}</Text>
          </View>
        </View>
      </View>

      {/* Student List */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Student List</Text>
        <FlatList
          data={mergedList}
          keyExtractor={(item) => item.id}
          renderItem={renderStudentItem}
          style={{ maxHeight: 400 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No students enrolled yet.</Text>
          }
        />
      </View>
    </View>
  );
};

export default adminStudents;

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
    color: "#1f2937",
  },
  countRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  studentCountBox: {
    backgroundColor: "#dbeafe",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  countText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e3a8a",
  },
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  avatar: {
    backgroundColor: "#2563eb",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginVertical: 20,
  },
});
