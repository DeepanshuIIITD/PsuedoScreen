// import { useAuth } from '@/app/contexts/AuthContext';
// import { useClass } from '@/app/contexts/ClassContext';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import Constants from 'expo-constants';
// import React, { useEffect, useState } from "react";
// import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // const API = 'https://streak-app-production.up.railway.app';
// const API = Constants.expoConfig.extra.API_URL;
// const USE_MOCK = true; // Toggle mocked students APIs


// const adminStudents = () => {
//   const {selectedClass} = useClass();
//   const { apiCall } = useAuth();
//   const insets = useSafeAreaInsets();
//   const colorScheme = useColorScheme();
//   const palette = colorScheme === 'dark'
//     ? { bg:'#0b0f14', card:'#0f172a', text:'#e5e7eb', sub:'#94a3b8', border:'#1f2937' }
//     : { bg:'#f9fafb', card:'#ffffff', text:'#111827', sub:'#374151', border:'#e5e7eb' };
//   const [studentNameList, setStudentNameList] = useState([]);

//   const [topPerformerList] = useState([
//     { id: "2", rank: 1 }, // 🥇
//     { id: "5", rank: 2 }, // 🥈
//     { id: "9", rank: 3 }, // 🥉
//   ]);

//   const [studentCount, setStudentCount] = useState(0);
//   const [query, setQuery] = useState("");
//   const [filterTopOnly, setFilterTopOnly] = useState(false);

//   useEffect(() => {
//     // setStudentCount(studentNameList.length);
//     fetchStudents();
//     setStudentCount(studentNameList.length);
//   }, [studentNameList]);


//   const fetchStudents = async () => {
//     try {
//         const data = await apiCall(`${API}/admin/studentsList/${selectedClass.id}`, {
//           method: 'GET',
//           headers : {'content-Type': 'application/json'},
//         });
//         // const data = await response.json();
//       // what should be the data structure?
//       //// this is how data lookes like 
//           // {"students":[{"ID":2,"FirstName":"Deepanshu","LastName":"Aluria","Email":"deep@gmail.com","Phone":"9625025503","UserName":"deepanshu","Password":"$2a$10$B0V1tfGsdL4YjtegOa8jl.5oSmm9ys49xUXMElQRffK.zAfxXyd3a","DOB":"2025-09-01T00:00:00Z","RefreshToken":"vZkFl8sOPfeg1K_mz_0EME6BNVS-ssd-9uyMoZObbg0=","RefreshTokenExpiry":"2025-12-19T07:00:34.87Z","CreatedAt":"2025-09-22T05:13:59.604Z","UpdatedAt":"2025-11-19T07:00:34.872Z"}]}
//         if (data && data.students) {
//           setStudentNameList(data.students.map(s => ({
//             id: s.ID.toString(),
//             firstName: s.FirstName,
//             lastName: s.LastName,
//           })));
//         }
//     } catch (e) {
//       console.error("Error fetching students:", e);
//       Alert.alert('Error', e.message || 'Failed to fetch students');
//   }
// };

//   // Merge top performers into student list with rank info
//   const mergedList = studentNameList
//     .map((student) => {
//       const performer = topPerformerList.find((p) => p.id === student.id);
//       return performer ? { ...student, rank: performer.rank } : { ...student };
//     })
//     .sort((a, b) => {
//       if (a.rank && b.rank) return a.rank - b.rank; // order 1,2,3
//       if (a.rank) return -1; // performer first
//       if (b.rank) return 1;
//       return a.firstName.localeCompare(b.firstName); // rest alphabetically
//     })
//     .filter((s) => {
//       const matches = `${s.firstName} ${s.lastName}`.toLowerCase().includes(query.toLowerCase());
//       const topPass = filterTopOnly ? !!s.rank : true;
//       return matches && topPass;
//     });

//   const getTrophy = (rank) => {
//     switch (rank) {
//       case 1:
//         return "🥇";
//       case 2:
//         return "🥈";
//       case 3:
//         return "🥉";
//       default:
//         return null;
//     }
//   };

//   const handleRemoveStudent = (student) => {
//     Alert.alert(
//       "Remove Student",
//       `Are you sure you want to remove ${student.firstName} ${student.lastName} from this class?`,
//       [
//         {
//           text: "Cancel",
//           style: "cancel"
//         },
//         {
//           text: "Remove",
//           style: "destructive",
//           onPress: async () => {
//             try {
//                 console.log(`Student with name ${student.firstName} wiith id ${student.id} removed from class ${selectedClass.id}`);
//                 await apiCall(`${API}/admin/kickStudent/${selectedClass.id}`, { method: 'POST',
//                   body: JSON.stringify({ studentId: student.id }),
//                   headers : {'content-Type': 'application/json'}
//                 });
                
//                 setStudentNameList(prev => prev.filter(s => s.id !== student.id));
//                 Alert.alert("Success", `${student.firstName} ${student.lastName} has been removed from the class.`);
//               }
//             catch (e) {
//               Alert.alert('Error', e.message || 'Failed to remove student');
//             }
//           }
//         }
//       ]
//     );
//   };

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
//           {getTrophy(item.rank)} {item.firstName} {item.lastName}
//         </Text>
//         <TouchableOpacity
//           style={styles.removeButton}
//           onPress={() => handleRemoveStudent(item)}
//         >
//           <MaterialCommunityIcons name="delete-outline" size={20} color="#ef4444" />
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   return (
//     <View style={{ flex: 1, backgroundColor: palette.bg, padding: 16, paddingTop: insets.top, paddingBottom: insets.bottom + 8 }}>
//       <Text style={[styles.title,{color: palette.text}]}>👩‍🎓 Students</Text>

//       {/* Search and Filters */}
//       <View style={styles.filtersRow}>
//         <TextInput
//           placeholder="Search students"
//           placeholderTextColor="#9ca3af"
//           value={query}
//           onChangeText={setQuery}
//           style={[styles.searchInput,{backgroundColor: palette.card, borderColor: palette.border, color: palette.text}]}
//         />
//         <TouchableOpacity
//           style={[styles.filterChip, filterTopOnly && styles.filterChipActive]}
//           onPress={() => setFilterTopOnly((v) => !v)}
//         >
//           <MaterialCommunityIcons name="trophy" size={18} color={filterTopOnly ? '#1e3a8a' : '#374151'} />
//           <Text style={[styles.filterText, filterTopOnly && styles.filterTextActive]}>Top</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Count Card */}
//       <View style={styles.card}>
//         <View style={styles.countRow}>
//           <Text style={styles.cardTitle}>Total Students Enrolled</Text>
//           <View style={styles.studentCountBox}>
//             <Text style={styles.countText}>{studentCount}</Text>
//           </View>
//         </View>
//       </View>

//       {/* Student List */}
//       <View style={[styles.card,{backgroundColor: palette.card, borderWidth:1, borderColor: palette.border}] }>
//         <Text style={[styles.cardTitle,{color: palette.text}]}>Student List</Text>
//         <FlatList
//           data={mergedList}
//           keyExtractor={(item) => item.id}
//           renderItem={renderStudentItem}
//           style={{ maxHeight: 400 }}
//           ListEmptyComponent={
//             <Text style={styles.emptyText}>No students enrolled yet.</Text>
//           }
//         />
//       </View>
//     </View>
//   );
// };

// export default adminStudents;

// const styles = StyleSheet.create({
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
//   filtersRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: 12,
//   },
//   searchInput: {
//     flex: 1,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     color: '#111827',
//   },
//   filterChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     backgroundColor: '#e5e7eb',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 12,
//   },
//   filterChipActive: {
//     backgroundColor: '#dbeafe',
//   },
//   filterText: {
//     color: '#374151',
//     fontWeight: '600',
//   },
//   filterTextActive: {
//     color: '#1e3a8a',
//   },
//   cardTitle: {
//     fontSize: 22,
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
//     justifyContent: "space-between",
//   },
//   removeButton: {
//     padding: 8,
//     borderRadius: 8,
//     backgroundColor: "#fee2e2",
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


// fixed version by claude

import { useAuth } from '@/app/contexts/AuthContext';
import { useClass } from '@/app/contexts/ClassContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AdminStudents = () => {
  const { selectedClass } = useClass();
  const { apiCall } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const palette = colorScheme === 'dark'
    ? { bg:'#0b0f14', card:'#0f172a', text:'#e5e7eb', sub:'#94a3b8', border:'#1f2937' }
    : { bg:'#f9fafb', card:'#ffffff', text:'#111827', sub:'#374151', border:'#e5e7eb' };
  
  const [studentNameList, setStudentNameList] = useState([]);
  const [topPerformerList] = useState([
    { id: "2", rank: 1 },
    { id: "5", rank: 2 },
    { id: "9", rank: 3 },
  ]);
  const [query, setQuery] = useState("");
  const [filterTopOnly, setFilterTopOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const API = Constants.expoConfig.extra.API_URL;
  
  // Fixed: Only fetch once when selectedClass changes
  useEffect(() => {
    if (!selectedClass) return;
    
    fetchStudents();
  }, [selectedClass]); // Only depend on selectedClass
  
  const fetchStudents = async () => {
    if (isLoading) return; // Prevent concurrent calls
    
    try {
      setIsLoading(true);
      const data = await apiCall(`${API}/admin/studentsList/${selectedClass.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (data?.students) {
        setStudentNameList(data.students.map(s => ({
          id: s.ID.toString(),
          firstName: s.FirstName,
          lastName: s.LastName,
        })));
      }
    } catch (e) {
      console.error("Error fetching students:", e);
      Alert.alert('Error', e.message || 'Failed to fetch students');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Merge top performers into student list
  const mergedList = studentNameList
    .map((student) => {
      const performer = topPerformerList.find((p) => p.id === student.id);
      return performer ? { ...student, rank: performer.rank } : { ...student };
    })
    .sort((a, b) => {
      if (a.rank && b.rank) return a.rank - b.rank;
      if (a.rank) return -1;
      if (b.rank) return 1;
      return a.firstName.localeCompare(b.firstName);
    })
    .filter((s) => {
      const matches = `${s.firstName} ${s.lastName}`.toLowerCase().includes(query.toLowerCase());
      const topPass = filterTopOnly ? !!s.rank : true;
      return matches && topPass;
    });
  
  const getTrophy = (rank) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return null;
    }
  };
  
  const handleRemoveStudent = (student) => {
    Alert.alert(
      "Remove Student",
      `Are you sure you want to remove ${student.firstName} ${student.lastName} from this class?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await apiCall(`${API}/admin/kickStudent/${selectedClass.id}`, {
                method: 'POST',
                body: JSON.stringify({ studentId: parseInt(student.id) }),
                headers: { 'Content-Type': 'application/json' }
              });
              
              setStudentNameList(prev => prev.filter(s => s.id !== student.id));
              Alert.alert("Success", `${student.firstName} ${student.lastName} has been removed from the class.`);
            } catch (e) {
              Alert.alert('Error', e.message || 'Failed to remove student');
            }
          }
        }
      ]
    );
  };
  
  const renderStudentItem = ({ item }) => {
    const initials =
      (item.firstName?.[0] || "").toUpperCase() +
      (item.lastName?.[0] || "").toUpperCase();
    
    return (
      <View style={[styles.studentCard, { backgroundColor: colorScheme === 'dark' ? '#111827' : '#f3f4f6' }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={[styles.studentName, { color: palette.text }]}>
          {getTrophy(item.rank)} {item.firstName} {item.lastName}
        </Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveStudent(item)}
        >
          <MaterialCommunityIcons name="delete-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    );
  };
  
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: palette.bg }]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={[styles.loadingText, { color: palette.sub }]}>Loading students...</Text>
      </View>
    );
  }
  
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: palette.bg, 
      padding: 16, 
      paddingTop: insets.top, 
      paddingBottom: insets.bottom + 8 
    }}>
      <Text style={[styles.title, { color: palette.text }]}>👩‍🎓 Students</Text>
      
      {/* Search and Filters */}
      <View style={styles.filtersRow}>
        <TextInput
          placeholder="Search students"
          placeholderTextColor="#9ca3af"
          value={query}
          onChangeText={setQuery}
          style={[
            styles.searchInput,
            { backgroundColor: palette.card, borderColor: palette.border, color: palette.text }
          ]}
        />
        <TouchableOpacity
          style={[styles.filterChip, filterTopOnly && styles.filterChipActive]}
          onPress={() => setFilterTopOnly((v) => !v)}
        >
          <MaterialCommunityIcons 
            name="trophy" 
            size={18} 
            color={filterTopOnly ? '#1e3a8a' : '#374151'} 
          />
          <Text style={[styles.filterText, filterTopOnly && styles.filterTextActive]}>Top</Text>
        </TouchableOpacity>
      </View>
      
      {/* Count Card */}
      <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
        <View style={styles.countRow}>
          <Text style={[styles.cardTitle, { color: palette.text }]}>Total Students Enrolled</Text>
          <View style={styles.studentCountBox}>
            <Text style={styles.countText}>{studentNameList.length}</Text>
          </View>
        </View>
      </View>
      
      {/* Student List */}
      <View style={[styles.card, { backgroundColor: palette.card, borderWidth: 1, borderColor: palette.border }]}>
        <Text style={[styles.cardTitle, { color: palette.text }]}>Student List</Text>
        <FlatList
          data={mergedList}
          keyExtractor={(item) => item.id}
          renderItem={renderStudentItem}
          style={{ maxHeight: 400 }}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: palette.sub }]}>
              {query ? "No students found matching your search." : "No students enrolled yet."}
            </Text>
          }
        />
      </View>
    </View>
  );
};

export default AdminStudents;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  filterChipActive: {
    backgroundColor: '#dbeafe',
  },
  filterText: {
    color: '#374151',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#1e3a8a',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
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
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: "space-between",
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#fee2e2",
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
    flex: 1,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    marginVertical: 20,
  },
});