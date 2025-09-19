// import React from 'react'
// import { Image, StyleSheet, Text, View } from 'react-native'

// const userSupport = () => {
//   return (
//     <View style={styles.screen}>
//       <Text style={styles.title}> Hello Dear! </Text>
//       <View style = {styles.card}>
//         {/* <Text style = {styles.cardTitle}>About this application</Text>
//         <Text padding= "20" >This application is made with an intend to serve as a intermidary between 
//           local classes and users. That means now it is not mandatory to learn from famous 
//           so called "Brands/-" only it gives empovernment for local teachers and classes 
//           to showcase their talent to the audience which are seeking it.
//         </Text>

//         <Text style = {styles.cardTitle}>About Me</Text>
//         <Text padding = "20">
//             My name is Deepanshu Aluria, I am an recent undergraduate from IIITD.
//             I live in New Delhi, India. I love making things that gives social impact
//             particularly to sectors where it is a must, since I have done my major in 
//             computer science I try to bring technology as a tool to accomplish these task.
//         </Text> */}
//         <Text style={styles.cardTitle}>Why Support ?</Text>
//         <Text>As you know this is an software which is hosted on server, which are 
//           running and costing me money, I appreciate if you can help me in paying those bills. 
//           A little contribution from each user can help me maintain and running this application free from advertisement and bugs.
//         </Text>
//       </View>

//       <Image
//           style={styles.image}
//           source={require("@/assets/images/LinkedIn_Qr.png")}

//         />
//       <Text style={{paddingTop:15,marginLeft: 40, fontSize:15 }}>
//         My Upi Id : 8888888888@paytm
//       </Text>

//     </View>
//   )
// }

// export default userSupport

// const styles = StyleSheet.create({
//     screen: {
//     flex: 1,
//     backgroundColor: "#f9fafb",
//     padding: 16,
//   },
//   image:{
//     marginLeft: 40,
//     justifyContent:'center',
//     alignItems:'center',
//     width : 250,
//     height: 150,

//   },
//   title: {
//     fontSize: 34,
//     fontWeight: "bold",
//     color: "#111827",
//     marginBottom: 20,
//   },
//   yesButton:{
//     marginTop: 12,
//     marginBottom: 14,
//     backgroundColor: "#b8ea69ff",
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: "center",
//     width: 120,
//   },
//   reportButton:{
//     marginTop: 12,
//     marginBottom: 14,
//     backgroundColor: "#b567e5ff",
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: "center",
//     width: 120,
//   },
//   noButton:{
//     marginTop: 12,
//     marginBottom: 14,
//     backgroundColor: "#b42953ff",
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: "center",
//     width: 120,
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
//   submitButton: {
//     backgroundColor: "#17e95d",
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   submitText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
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

// })



import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const userSupport = () => {
  const handleUPIClick = () => {
    // Later you can add deep-linking for UPI apps
    Linking.openURL("upi://pay?pa=9999999999@paytm&pn=Deepanshu&mc=1234");
  };
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.safeContainer, {paddingTop: insets.top}]}>
      <ScrollView style={styles.screen}
        contentContainerStyle={{paddingBottom: 40}}
      >
        {/* Header */}
        <Text style={styles.title}>💙 Support This App</Text>
        <Text style={styles.subTitle}>
          Thank you for using this application. Your support helps keep it free,
          ad-free, and bug-free.
        </Text>

        {/* Why Support Card */}
        <View style={styles.card}>
          <MaterialCommunityIcons name="hand-heart" size={32} color="#2563eb" />
          <Text style={styles.cardTitle}>Why Support?</Text>
          <Text style={styles.cardText}>
            This app is hosted on servers that cost money. A small contribution
            from each user helps me keep it running smoothly for everyone.
          </Text>
        </View>

        {/* QR + UPI Section */}
        <View style={styles.cardCenter}>
          <Text style={styles.cardTitle}>Contribute via UPI</Text>
          <Image
            style={styles.image}
            source={require("@/assets/images/LinkedIn_Qr.png")}
          />
          <TouchableOpacity style={styles.upiBox} onPress={handleUPIClick}>
            <MaterialCommunityIcons name="qrcode-scan" size={20} color="#111827" />
            <Text style={styles.upiText}>8888888888@paytm</Text>
          </TouchableOpacity>
        </View>

        {/* Thank You */}
        
          <Text style={styles.footerText}>
            🙏 Every little contribution means a lot. Thank you!
          </Text>
        
      </ScrollView>
    </View>
  );
};

export default userSupport;

const styles = StyleSheet.create({
  safeContainer:{
    flex: 1,
    backgroundColor: "green",
  },
  screen: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
    alignItems: "center",
  },
  cardCenter: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 10,
    color: "#1f2937",
    textAlign: "center",
  },
  cardText: {
    fontSize: 15,
    color: "#374151",
    textAlign: "center",
    marginTop: 5,
    lineHeight: 22,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginVertical: 16,
  },
  upiBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f2fe",
    padding: 10,
    borderRadius: 12,
    marginTop: 8,
  },
  upiText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  footerText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    // marginBottom: 50,
  },
});
