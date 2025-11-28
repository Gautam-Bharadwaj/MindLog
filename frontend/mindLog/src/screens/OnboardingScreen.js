import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Animated,
    Image,
} from 'react-native';


const { width, height } = Dimensions.get('window');

// Concept: Data Array
// 4 slides ka data with image URL, title, aur description
const slides = [
    {
        id: '1',
        image: require('../assets/Thirdimg.jpg'),
        title: 'Track Your Mood',
        description: 'Monitor your daily emotions and mental well-being with ease',
    },
    {
        id: '2',
        image: require('../assets/imageTwo.jpg'),
        title: 'Journal Entries',
        description: 'Write your thoughts, feelings, and experiences every day',
    },
    {
        id: '3',
        image: require('../assets/imageFour.jpg'),
        title: 'Insights & Analytics',
        description: 'View patterns and trends in your mental health journey',
    },
    {
        id: '4',
        image:require('../assets/imageOne.jpg'),
        title: 'Stay Consistent',
        description: 'Build healthy habits and maintain your mental wellness',
    },
];

// Concept: Memoized Slide Component
// Individual slide component with animation
const SlideItem = ({ item }) => {
    // Concept: useRef for animation
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        // Slide fade in, slide up, and scale animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.slide,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            
            <Animated.Image
               
                source={
                    typeof item.image === 'string' 
                        ? { uri: item.image } 
                        : item.image
                }
                style={[
                    styles.illustration,
                    {
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
                resizeMode="contain"
            />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
        </Animated.View>
    );
};

const OnboardingScreen = ({ onFinish }) => {
    // Concept: useState
    // Current slide index track karne ke liye
    const [currentIndex, setCurrentIndex] = useState(0);

    // Concept: useRef
    // FlatList reference store karne ke liye (scrolling control ke liye)
    const flatListRef = useRef(null);

    // Concept: useEffect for Auto-Slide
    // Har 3 seconds mein automatically next slide par jaye
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = prevIndex + 1;

                // Agar last slide hai to onboarding finish karo
                if (nextIndex >= slides.length) {
                    clearInterval(interval);
                    onFinish();
                    return prevIndex;
                }

                // FlatList ko next slide par scroll karo
                flatListRef.current?.scrollToIndex({
                    index: nextIndex,
                    animated: true,
                });

                return nextIndex;
            });
        }, 3000); // 3 seconds

        // Cleanup function
        return () => clearInterval(interval);
    }, [onFinish]);

    // Skip button handler
    const handleSkip = () => {
        onFinish();
    };

    // Get Started button handler (last slide par)
    const handleGetStarted = () => {
        onFinish();
    };

    // Concept: onViewableItemsChanged
    // Jab slide change ho to current index update karo
    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index || 0);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    return (
        <View style={styles.container}>
            {/* Skip Button */}
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            {/* Concept: FlatList for Horizontal Scrolling */}
            {/* Slides ko horizontal scroll karne ke liye */}
            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={({ item }) => <SlideItem item={item} />}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                scrollEnabled={true} // Manual swipe enabled - left/right swipe kar sakte ho
            />

            {/* Concept: Pagination Dots */}
            {/* Current slide indicator */}
            <View style={styles.pagination}>
                {slides.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentIndex === index && styles.activeDot,
                        ]}
                    />
                ))}
            </View>

            {/* Get Started Button (last slide par dikhega) */}
            {currentIndex === slides.length - 1 && (
                <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
                    <Text style={styles.getStartedText}>Get Started</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

// Concept: Styling
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    skipButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        padding: 10,
    },
    skipText: {
        color: '#888',
        fontSize: 16,
    },
    slide: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    illustration: {
        width: 280,
        height: 280,
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        color: '#CCCCCC',
        textAlign: 'center',
        lineHeight: 24,
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 100,
        alignSelf: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#555',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#FFFFFF',
        width: 24,
    },
    getStartedButton: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        backgroundColor: '#6C5CE7',
        paddingVertical: 15,
        paddingHorizontal: 60,
        borderRadius: 25,
    },
    getStartedText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default OnboardingScreen;
