import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';


const userPersonal = () => {
  const [isjoined, setJoined] = React.useState(null); 
  const [attendanceSubmitted, setAttendanceSubmitted] = React.useState(false); // new
  const [todayNote, setTodayNote] = React.useState("");
  const [excuse, setExcuse] = React.useState("");
  const [isReportView, setIsReportView] = React.useState(null); 
  const [selectedTime, setSelectedTime] = React.useState(new Date());
  const [showTimePicker, setShowTimePicker] = React.useState(false);

  const todayDate = new Date().toLocaleDateString();
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // for safeareview testing purpose only
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const palette = colorScheme === 'dark'
    ? { bg:'#0b0f14', card:'#0f172a', text:'#e5e7eb', sub:'#94a3b8', border:'#1f2937' }
    : { bg:'#f9fafb', card:'#ffffff', text:'#111827', sub:'#374151', border:'#e5e7eb' };


  const pickerStyle = {
  inputIOS: {
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
  },
  inputAndroid: {
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
  },
};

  // 👉 Joined summary with validation
const renderJoinedSummary = () => (
  <>
    <Text style={styles.cardTitle}>Attendance Summary</Text>
    <Text style={styles.summaryText}>You have joined today's class. Great job!</Text>

    {/* Note input */}
    <TextInput
      style={styles.inputBox}
      placeholder="Any notes for today?"
      value={todayNote}
      onChangeText={setTodayNote}
      multiline
    />

    {/* Time spent selector */}
    <TouchableOpacity
      style={styles.inputBox}
      onPress={() => setShowTimePicker(true)}
    >
      <Text>
        {selectedTime
          ? `Time spent: ${formatTime(selectedTime)}`
          : "Select time spent"}
      </Text>
    </TouchableOpacity>

    {showTimePicker && (
      <DateTimePicker
      
        value={selectedTime}
        mode="time"
        is24Hour={true}
        display="default"
        onChange={(event, date) => {
          setShowTimePicker(false);
          if (date) setSelectedTime(date);
        }}
      />
    )}

    {/* Submit with validation */}
    <TouchableOpacity
      style={styles.submitButton}
      onPress={() => {
        if (!todayNote.trim()) {
          alert("⚠️ Please enter a note before submitting!");
          return;
        }
        if (!selectedTime) {
          alert("⚠️ Please select the time spent before submitting!");
          return;
        }
        setAttendanceSubmitted(true);
      }}
    >
      <Text style={styles.submitText}>Submit</Text>
    </TouchableOpacity>
  </>
);

    const excuseOptions = [
  { label: 'Out of station', value: 'Out of station' },
  { label: 'Health issue', value: 'Health issue' },
  { label: 'Very genuine', value: 'Very genuine' },
  { label: 'Excuses', value: 'Excuses' },
];

// 👉 Excuse form with validation
const renderExcuseForm = () => (
  <>
    <Text style={styles.cardTitle}>Reason for not joining ?</Text>
    <RNPickerSelect
      onValueChange={setExcuse}
      value={excuse}
      placeholder={{ label: "Select a reason...", value: null }}
      items={excuseOptions}
      style={pickerStyle}
      useNativeAndroidPickerStyle={false}
    />
    <TouchableOpacity
      style={styles.submitButton}
      onPress={() => {
        if (!excuse) {
          alert("⚠️ Please select a reason before submitting!");
          return;
        }
        setAttendanceSubmitted(true);
      }}
    >
      <Text style={styles.submitText}>Submit</Text>
    </TouchableOpacity>
  </>
);


  // 👉 After attendance submitted, show confirmation card
  const renderAttendanceConfirmation = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Attendance Marked</Text>
      <Text style={styles.summaryText}>
        You have marked your attendance for {todayDate} as{" "}
        {isjoined ? "✅ Present" : "❌ Absent"}
      </Text>
    </View>
  );

  // 👉 Monthly Report
  const renderMonthlyReport = () => (
  <>
    <Text style={styles.cardTitle}>Monthly Report</Text>
    <Text style={styles.summaryText}>Total Classes Joined: 20</Text>
    <Text style={styles.summaryText}>Total Classes Missed: 5</Text>
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
    <Text style={styles.summaryText}>Total Classes Joined: 200</Text>
    <Text style={styles.summaryText}>Total Classes Missed: 50</Text>
    <Text style={styles.summaryText}>Best Yearly Streak: 156</Text>
    <View style={styles.streakHeader}>
      <Text style={styles.streakCounter}>Longest Streak: 30 days</Text>
      <View style={styles.streakIconWrapper}>
        <Text style={{ fontSize: 24 }}>🔥</Text>
      </View>
    </View>
  </>
);


  return (
    <View style={[styles.safeContainer, {paddingTop:insets.top, backgroundColor: palette.bg}]}>
    <ScrollView style={[styles.screen,{backgroundColor: palette.bg}]} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
      <Text style={styles.title}> Today's Attendance </Text>

      {/* Class Entry */}
      {!attendanceSubmitted && (
      <View style={[styles.card,{backgroundColor: palette.card, borderWidth:1, borderColor: palette.border}] }>
        <Text style={[styles.cardTitle,{color: palette.text}]}>Class Entry</Text>
        <View style={styles.innerBox}>
          <Text style={styles.cardText}>Joined Today's Class ?</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            
            {/* Yes Button */}
            <TouchableOpacity
              style={[
                styles.yesButton,
                isjoined === true && { backgroundColor: "#4ade80" } // highlight active
              ]}
              onPress={() => setJoined(isjoined === true ? null : true)} // toggle
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Yes, I did!</Text>
            </TouchableOpacity>

            {/* No Button */}
            <TouchableOpacity
              style={[
                styles.noButton,
                isjoined === false && { backgroundColor: "#f43f5e" } // highlight active
              ]}
              onPress={() => setJoined(isjoined === false ? null : false)} // toggle
            >
              <Text style={{ color: "white", fontWeight: "600" }}>No, Missed it</Text>
            </TouchableOpacity>

              </View>
            </View>
          </View>
        )}

      {/* Show form or confirmation */}
      {!attendanceSubmitted && isjoined !== null && (
        <View style={[styles.card,{backgroundColor: palette.card, borderWidth:1, borderColor: palette.border}] }>
          {isjoined ? renderJoinedSummary() : renderExcuseForm()}
        </View>
      )}
      {attendanceSubmitted && renderAttendanceConfirmation()}

      {/* Report Section */}
      <View style={[styles.card,{backgroundColor: palette.card, borderWidth:1, borderColor: palette.border}] }>
          <Text style={[styles.cardTitle,{color: palette.text}]}>Report</Text>
          <View style={styles.innerBox}>
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
    </ScrollView>
    </View>
  );
};

export default userPersonal;


const styles = StyleSheet.create({
  safeContainer:{
    flex: 1,
    backgroundColor: "green",
  },
  screen: {
    flex: 1,
    backgroundColor: "#f9fafb",
    // padding: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
  },
  yesButton:{
    marginTop: 12,
    marginBottom: 14,
    backgroundColor: "#b8ea69ff",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    width: 120,
  },
  inputBox: {
  borderColor: "#d1d5db",
  borderWidth: 1,
  borderRadius: 8,
  padding: 8,
  marginTop: 10,
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
  noButton:{
    marginTop: 12,
    marginBottom: 14,
    backgroundColor: "#b42953ff",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    width: 120,
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
  submitButton: {
    backgroundColor: "#17e95d",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
})


