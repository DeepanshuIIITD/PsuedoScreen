import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const About = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.safeContainer, { paddingTop: insets.top }]}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>📱 About This App</Text>

        {/* About App Card */}
        <View style={styles.card}>
          <MaterialCommunityIcons name="information" size={32} color="#2563eb" style={styles.icon} />
          <Text style={styles.cardTitle}>About This Application</Text>
          <Text style={styles.cardText}>
            This application is designed to serve as an intermediary between local classes and users. 
            It empowers local teachers and classes to showcase their talent to the audience seeking quality education.
            {'\n\n'}
            Now it's not mandatory to learn only from famous "Brands" - this app gives a platform for 
            local educators to connect with students who are looking for quality learning experiences.
          </Text>
        </View>

        {/* About Developer Card */}
        <View style={styles.card}>
          <MaterialCommunityIcons name="account-circle" size={32} color="#2563eb" style={styles.icon} />
          <Text style={styles.cardTitle}>About The Developer</Text>
          <Text style={styles.cardText}>
            My name is Deepanshu Aluria, a recent undergraduate from IIITD.
            {'\n\n'}
            I live in New Delhi, India. I love making things that create social impact, particularly 
            in sectors where it is most needed. Since I have done my major in Computer Science, 
            I try to bring technology as a tool to accomplish these tasks.
          </Text>
        </View>

        {/* Features Card */}
        <View style={styles.card}>
          <MaterialCommunityIcons name="star-circle" size={32} color="#2563eb" style={styles.icon} />
          <Text style={styles.cardTitle}>Key Features</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureBullet}>🔥</Text>
              <Text style={styles.featureText}>Track your attendance streak</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureBullet}>📊</Text>
              <Text style={styles.featureText}>View detailed attendance reports</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureBullet}>👥</Text>
              <Text style={styles.featureText}>Manage classes and students</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureBullet}>📈</Text>
              <Text style={styles.featureText}>Monitor performance and progress</Text>
            </View>
          </View>
        </View>

        {/* Version Info */}
        <View style={styles.versionCard}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.versionSubtext}>Made with ❤️ for education</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "green",
  },
  screen: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
    textAlign: "center",
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
  },
  icon: {
    alignSelf: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1f2937",
    textAlign: "center",
  },
  cardText: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 24,
    textAlign: "justify",
  },
  featureList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureBullet: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    color: "#374151",
    flex: 1,
  },
  versionCard: {
    backgroundColor: "#e0f2fe",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  versionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e3a8a",
  },
  versionSubtext: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
});

