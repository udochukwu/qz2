import AnimatedLottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View, Animated } from "react-native";
import Button from "./Button";

const ANIMATION_DURATION = 7000; // 5 seconds in milliseconds

export default function CustomModel({ onComplete }: { onComplete: () => void }) {
    const { t } = useTranslation();
    const [allAnimationsComplete, setAllAnimationsComplete] = useState(false);

    const [completedAnimations] = useState(new Set<number>());  // Add this line

    const checkAnimationsComplete = (index: number) => {
        completedAnimations.add(index);
        if (completedAnimations.size === 3) {  // All three animations are complete
            setAllAnimationsComplete(true);
        }
    };

    return (
        <View style={{ flex: 1, paddingTop: 20, alignItems: "center", width:"100%", justifyContent:"space-between" }}>
            <Text style={{ fontSize: 25, fontWeight: "bold", marginBottom: 20,
                textAlign: "center"

             }}>{t("customModel.title")}</Text>
            <AnimatedLottieView 
                source={require("../assets/lottie/custom-model.json")} 
                autoPlay 
                loop={true} 
                style={{ width: "80%"  }} 
            />
            {/* Progress Bar Items */}
            <View style={{ width: "100%", gap:20}}>
                <ProgressItem 
                    label={t("customModel.progress1")}
                    progress={100}
                    delay={0}
                    onComplete={() => checkAnimationsComplete(0)}
                />
                <ProgressItem 
                    label={t("customModel.progress2")}
                    progress={100}
                    delay={ANIMATION_DURATION}
                    onComplete={() => checkAnimationsComplete(1)}
                />
                <ProgressItem 
                    label={t("customModel.progress3")}
                    progress={100}
                    delay={ANIMATION_DURATION * 2}
                    onComplete={() => checkAnimationsComplete(2)}
                />
            </View>

            <Button style={styles.button} onPress={onComplete} disabled={!allAnimationsComplete}>
                <Text style={styles.buttonText}>{ allAnimationsComplete ? t("StartSolving") : t("customModel.unlocking") }</Text>
            </Button>
            
        
        </View>
    );
}

// Progress Bar Component
function ProgressItem({ label, progress, delay = 0, onComplete }: { 
    label: string, 
    progress: number, 
    delay?: number,
    onComplete?: () => void 
}) {
    const progressAnim = useRef(new Animated.Value(0)).current;
    const [displayedProgress, setDisplayedProgress] = useState(0);

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: ANIMATION_DURATION,
            delay,
            useNativeDriver: false
        }).start(({ finished }) => {
            if (finished && onComplete) {
                onComplete();
            }
        });

        progressAnim.addListener(({ value }) => {
            setDisplayedProgress(Math.floor(value));
        });

        return () => progressAnim.removeAllListeners();
    }, []);

    return (
        <View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ fontSize: 18, fontWeight: "500" }}>{label}</Text>
                <Text style={{ fontSize: 18, fontWeight: "500" }}>{displayedProgress}%</Text>
            </View>
            <View style={{ height: 8, backgroundColor: "#E5E7EB", borderRadius: 4, width: "100%" }}>
                <Animated.View 
                    style={{
                        width: progressAnim.interpolate({
                            inputRange: [0, 100],
                            outputRange: ['0%', '100%']
                        }),
                        height: "100%",
                        backgroundColor: "#6D56FA",
                        borderRadius: 4,
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        width: "90%",
        height: 55,
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    buttonText: {
        fontFamily: 'Nunito',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
        color: '#FFFFFF',
    }
})