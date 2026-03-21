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
    backgroundColor: "#f9fafb", // changed from green
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
