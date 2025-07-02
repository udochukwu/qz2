import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import FeatureContainer from "./FeatureContainer";
import { ScalingDot } from "react-native-animated-pagination-dots";
import { useTranslation } from "react-i18next";
import { storage } from "../../services/storage";

const padding = 9;
const marginRight = 3;
function FeaturesGroup({ }) {
    const scrollX = React.useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);
    const timer = useRef<number | null>(null);
    const currentIndex = useRef<number>(0); // Index of the current item
    const { t } = useTranslation();
    var features_list = [
        {
            resource: require("../../assets/paywall/orb.json"),
            title: t('purchaseScreen.feature1.title'),
            discription: t('purchaseScreen.feature1.description'),
        },
        {
            resource: require("../../assets/paywall/target.json"),
            title: t('purchaseScreen.feature2.title'),
            discription: t('purchaseScreen.feature2.description'),
        },
        {
            resource: require("../../assets/paywall/resources.json"),
            title: t('purchaseScreen.feature3.title'),
            discription: t('purchaseScreen.feature3.description'),
        },
        {
            resource: require("../../assets/paywall/vision.json"),
            title: t('purchaseScreen.feature5.title'),
            discription: t('purchaseScreen.feature5.description'),
        },
        {
            resource: require("../../assets/paywall/explanation.json"),
            title: t('purchaseScreen.feature4.title'),
            discription: t('purchaseScreen.feature4.description'),
        }
    ]

    const screenWidth = Dimensions.get('window').width - padding * 2;

    const startTimer = () => {
        timer.current = setInterval(() => {
            currentIndex.current = currentIndex.current + 1;

            if (currentIndex.current >= features_list.length) {
                currentIndex.current = 0;
            }

            flatListRef.current?.scrollToOffset({
                offset: currentIndex.current * (screenWidth),
                animated: true,
            });
        }, 6000);
    }

    useEffect(() => {
        startTimer();

        return () => {
            if (timer.current) {
                clearInterval(timer.current);
            }
        };
    }, []);

    const renderItem = ({ item }: { item: any }) => (
        <View style={{ width: screenWidth }}>
            <FeatureContainer {...item} />
        </View>
    );

    const handleScrollEnd = (e: any) => {
        // Calculate the index of the current item
        currentIndex.current = Math.round(e.nativeEvent.contentOffset.x / (screenWidth));

        if (timer.current) {
            clearInterval(timer.current);
        }
        startTimer();
    }

    return (
        <View style={styles.container}>
            <View style={styles.listContainer}>
                <FlatList
                    ref={flatListRef}
                    data={features_list}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        {
                            useNativeDriver: false,
                        }
                    )}
                    onMomentumScrollEnd={handleScrollEnd}
                    snapToInterval={screenWidth} // Add this line for snapping
                    decelerationRate="fast" // Add this line for a more pronounced snap effect
                    contentContainerStyle={{ paddingLeft: padding }}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={<View style={{ width: padding - marginRight }} />}
                />
            </View>
            <View style={styles.dotContainer}>
                <ScalingDot
                    data={features_list}
                    scrollX={scrollX}
                    inActiveDotColor={'#D8D8D8'}
                    activeDotColor="#6D56FA"
                    inActiveDotOpacity={0.6}
                    dotStyle={{
                        width: 6,
                        height: 6,
                        borderRadius: 5,
                    }}
                    containerStyle={{
                        position: 'relative',
                        marginTop: 30,
                        marginBottom: -13,
                    }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        flex: 1,
    },
    dotContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default FeaturesGroup;
