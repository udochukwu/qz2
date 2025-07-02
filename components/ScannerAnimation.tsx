import React, { useEffect, useState, useRef } from 'react';
import { Animated, View } from 'react-native';
import { DotCoordinates } from './CropLayer';

type Dot = {
    top: number;
    left: number;
    size: number;
    opacity: Animated.Value;
};

const useInterval = (callback: () => void, delay: number | null) => {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};

const ScannerAnnimation = ({ dotsCordinates }: { dotsCordinates: DotCoordinates }) => {
    const scanAnim = useRef(new Animated.Value(0)).current;
    const [dots, setDots] = useState<Dot[]>([]);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(scanAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    useInterval(() => {
        const padding = 10;  // Adjust this value for more or less padding
        const newDot: Dot = {
            top: Math.random() * (dotsCordinates.bottomLeftDot.y - dotsCordinates.topLeftDot.y - 2 * padding) + padding,
            left: Math.random() * (dotsCordinates.topRightDot.x - dotsCordinates.topLeftDot.x - 2 * padding) + padding,
            size: Math.random() * (10 - 5) + 5,
            opacity: new Animated.Value(1),
        };

        setDots((dots: Dot[]) => [...dots, newDot]);

        Animated.timing(newDot.opacity, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
        }).start(() => {
            setDots((dots: Dot[]) => dots.filter(dot => dot !== newDot));
        });
    }, 200);

    const scanStyle = {
        position: "absolute" as "absolute",
        top: dotsCordinates.topRightDot.y,
        left: dotsCordinates.topRightDot.x,
        height: dotsCordinates.bottomLeftDot.y - dotsCordinates.topLeftDot.y,
        width: 2,
        backgroundColor: 'white',
        zIndex: 1,
        transform: [{
            translateX: scanAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-5, dotsCordinates.topLeftDot.x - dotsCordinates.topRightDot.x + 5],
            }),
        }]
    };

    return (
        <>
            <Animated.View style={scanStyle} />
            {dots.map((dot: Dot, i: number) => (
                <Animated.View key={i} style={{
                    position: 'absolute',
                    top: dot.top + dotsCordinates.topLeftDot.y,
                    left: dot.left + dotsCordinates.topLeftDot.x,
                    width: dot.size, height: dot.size,
                    backgroundColor: 'white',
                    borderRadius: dot.size / 2,
                    opacity: dot.opacity,
                }} />
            ))}
        </>
    );
};

export default ScannerAnnimation;
