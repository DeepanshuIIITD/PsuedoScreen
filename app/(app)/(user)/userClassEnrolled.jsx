// import { apiCall } from '@/app/utils/apiHelper';
import { useClass } from '@/app/contexts/ClassContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import Constants from "expo-constants";
import { Link, router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path as needed

const UserClassEnrolled = () => {
    const [classes, setClasses] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [refreshing, setRefreshing] = React.useState(false);
    const insets = useSafeAreaInsets();
    const {selectClass} = useClass();
    // const authContext = useAuth();
    const { user, access_token } = useAuth(); // Get user and accessToken from auth context\
    const {apiCall} = useAuth();
    // const API_URL = 'https://streak-app-production.up.railway.app';
    const API_URL = Constants.expoConfig.extra.API_URL;

    const colorScheme = useColorScheme();

    const fetchClasses = async () => {
        try {

            const data = await apiCall(`${API_URL}/user/classList`,{
                method: 'GET' ,
                headers: { "Content-Type": "application/json" },
        });

            
            // console.log('API response data:', data);

            // Handle different response structures
            let classesData = [];
            
            if (Array.isArray(data)) {
                classesData = data;
            } else if (data.classes && Array.isArray(data.classes)) {
                classesData = data.classes;
            } else if (data.data && Array.isArray(data.data)) {
                classesData = data.data;
            } else if (data.courses && Array.isArray(data.courses)) {
                classesData = data.courses;
            } else {
                console.log("Unexpected data structure:", data);
                // If data structure is unexpected, set empty array
                classesData = [];
            }
            
            // console.log('Processed classes data:', classesData);
            
            // Transform the API response to match your expected format
            const transformedClasses = classesData.map(classItem => ({
                id: classItem.class_id || classItem.id,
                title: classItem.class_name || classItem.name || classItem.title || 'Untitled Class',
                class_code: classItem.class_code || classItem.code,
                phone: classItem.phone,
                email: classItem.email,
                created_at: classItem.created_at,
                joined_at: classItem.joined_at,
                created_by_admin_id: classItem.created_by_admin_id
            }));
            
            // console.log('Transformed classes:', transformedClasses);
            setClasses(transformedClasses);
            
        } catch (err) {
            console.error('Error fetching classes:', err);
            setError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // useEffect(() => {
    //     console.log("useEffect triggered");
    //     console.log("User:", user);
    //     console.log("Access Token exists:", !!access_token);
        
    //     // Always call fetchClasses, even if user or token is missing (to show proper error)
    //     fetchClasses();
    // }, [user, access_token]);

    

    useEffect(() => {
        // console.log("User info from user Class Enrolled ",user);
        if (user && access_token) {
            fetchClasses();
        } else {
            setLoading(false);
            setError("Please login to view classes");
        }
    }, [user, access_token]);


    const onRefresh = () => {
        setRefreshing(true);
        fetchClasses();
    };

    const redirectToClass = (classItem) => {
        // console.log("Redirecting to Class:", classId);
        // router.push(`/(user)/(tabs)/userHome/${classId}`);
        selectClass(classItem);
        console.log("From CLASS ENROLLED You pressed this CLASS ");
        // console.log("Class details ", classItem);
        router.push("/(user)/(tabs)/userHome");
    };

    if (loading) {
        return (
            <View style={[styles.safeContainer, { paddingTop: insets.top }]}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#17e95d" />
                    <Text style={styles.loadingText}>Loading your classes...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.safeContainer, { paddingTop: insets.top }]}>
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>Error: {error}</Text>
                    <Pressable style={styles.retryButton} onPress={fetchClasses}>
                        <Text style={styles.retryText}>Try Again</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.safeContainer, { paddingTop: insets.top, backgroundColor: colorScheme==='dark' ? '#0b0f14' : '#f5f5f5' }]}>
            <View style={styles.container}>
                <Text style={[styles.title,{color: colorScheme==='dark' ? '#e5e7eb' : '#111827'}]}>My Classes</Text>
                
                {classes.length === 0 ? (
                    <View style={styles.centerContainer}>
                        <Text style={styles.noClassesText}>No classes enrolled yet</Text>
                        <Text style={styles.subText}>Enroll in your first class to get started!</Text>
                    </View>
                ) : (
                    <ScrollView 
                        contentContainerStyle={[styles.scrollContainer, { paddingBottom: insets.bottom + 24 }]}
                        refreshControl={
                            <RefreshControl 
                                refreshing={refreshing} 
                                onRefresh={onRefresh}
                                colors={['#17e95d']}
                            />
                        }
                    >
                        {classes.map((item) => (
                            <Pressable
                                key={item.id?.toString()}
                                style={[styles.classCard,{ backgroundColor: colorScheme==='dark' ? '#0f172a' : 'white', borderColor: colorScheme==='dark' ? '#1f2937' : '#e5e7eb', borderWidth: 1 }]}
                                onPress={() => redirectToClass(item)}
                            >
                                {/* <Text style={styles.classText}>{item.title}</Text>
                                {item.class_code && (
                                    <Text style={styles.classCode}>Code: {item.class_code}</Text>
                                )}
                                {item.joined_at && (
                                    <Text style={styles.joinedDate}>Joined: {new Date(item.joined_at).toLocaleDateString()}</Text>
                                )} */}
                                <Text style={[styles.classText,{color: colorScheme==='dark' ? '#e5e7eb' : '#111827'}]}>
                                    {item.title || item.name || 'Untitled Class'}
                                </Text>
                                <Text style={[styles.classCode,{color: colorScheme==='dark' ? '#93c5fd' : '#666'}]}>
                                Code: {item.class_code || item.ClassCode || item.code || 'N/A'}
                                </Text>
                                {item.joined_at && (
                                  <Text style={[styles.joinedDate,{color: colorScheme==='dark' ? '#94a3b8' : '#999'}]}>
                                    Joined: {new Date(item.joined_at).toLocaleDateString()}
                                  </Text>
                                )}
                            </Pressable>
                        ))}
                    </ScrollView>
                )}

                {/* Enroll new class button */}
                <Link href={"/userClassRegistration"} style={styles.createClassButton}>
                    <Text style={styles.createClassText}>Enroll New Class</Text>
                </Link>
            </View>
        </View>
    );
};

// Add the missing styles
const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: '#e74c3c',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#17e95d',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    retryText: {
        color: 'white',
        fontWeight: 'bold',
    },
    noClassesText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
    },
    subText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    classCard: {
        backgroundColor: 'white',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    classText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    classCode: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    joinedDate: {
        fontSize: 12,
        color: '#999',
    },
    createClassButton: {
        backgroundColor: '#17e95d',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    createClassText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default UserClassEnrolled;