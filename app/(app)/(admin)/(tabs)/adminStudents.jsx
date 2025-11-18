import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const API = "https://streak-app-uxyv.onrender.com";
const USE_MOCK = true; // Toggle mocked students APIs

const adminStudents = () => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const palette = colorScheme === 'dark'
    ? { bg:'#0b0f14', card:'#0f172a', text:'#e5e7eb', sub:'#94a3b8', border:'#1f2937' }
    : { bg:'#f9fafb', card:'#ffffff', text:'#111827', sub:'#374151', border:'#e5e7eb' };
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
  const [query, setQuery] = useState("");
  const [filterTopOnly, setFilterTopOnly] = useState(false);

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
    })
    .filter((s) => {
      const matches = `${s.firstName} ${s.lastName}`.toLowerCase().includes(query.toLowerCase());
      const topPass = filterTopOnly ? !!s.rank : true;
      return matches && topPass;
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

  const handleRemoveStudent = (student) => {
    Alert.alert(
      "Remove Student",
      `Are you sure you want to remove ${student.firstName} ${student.lastName} from this class?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            // Expected backend API (commented)
            // DELETE `${API}/admin/class/{classId}/students/{studentId}`
            // Response 200: { "removed": true }
            try {
              if (USE_MOCK) {
                setStudentNameList(prev => prev.filter(s => s.id !== student.id));
                Alert.alert("Success", `${student.firstName} ${student.lastName} has been removed from the class.`);
              } else {
                // await apiCall(`${API}/admin/class/${selectedClass.id}/students/${student.id}`, { method: 'DELETE' });
                setStudentNameList(prev => prev.filter(s => s.id !== student.id));
                Alert.alert("Success", `${student.firstName} ${student.lastName} has been removed from the class.`);
              }
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
      <View style={styles.studentCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.studentName}>
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

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg, padding: 16, paddingTop: insets.top, paddingBottom: insets.bottom + 8 }}>
      <Text style={[styles.title,{color: palette.text}]}>👩‍🎓 Students</Text>

      {/* Search and Filters */}
      <View style={styles.filtersRow}>
        <TextInput
          placeholder="Search students"
          placeholderTextColor="#9ca3af"
          value={query}
          onChangeText={setQuery}
          style={[styles.searchInput,{backgroundColor: palette.card, borderColor: palette.border, color: palette.text}]}
        />
        <TouchableOpacity
          style={[styles.filterChip, filterTopOnly && styles.filterChipActive]}
          onPress={() => setFilterTopOnly((v) => !v)}
        >
          <MaterialCommunityIcons name="trophy" size={18} color={filterTopOnly ? '#1e3a8a' : '#374151'} />
          <Text style={[styles.filterText, filterTopOnly && styles.filterTextActive]}>Top</Text>
        </TouchableOpacity>
      </View>

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
      <View style={[styles.card,{backgroundColor: palette.card, borderWidth:1, borderColor: palette.border}] }>
        <Text style={[styles.cardTitle,{color: palette.text}]}>Student List</Text>
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
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111827',
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
    color: "#111827",
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginVertical: 20,
  },
});
