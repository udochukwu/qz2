import { Animated, Dimensions, StyleSheet, View, FlatList, Pressable } from "react-native";
import React from "react";
import FastImage from "react-native-fast-image";
import { ScalingDot } from "react-native-animated-pagination-dots";

const padding = 12;
const marginRight = 10;

function ImagesCarousel({ image_urls }: { image_urls: string[] }) {
    const screenWidth = Dimensions.get('window').width - padding * 6;
    const scrollX = React.useRef(new Animated.Value(0)).current;

    const renderItem = ({ item }: { item: any }) => (
        <Animated.View style={{ flex: 1, marginRight: marginRight }}>
            <Pressable style={{ flex: 1 }} onPress={() => { }}>
                <FastImage
                    style={{ width: screenWidth, height: "100%", borderRadius: 10 }}
                    source={{
                        uri: item,
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}

                />
            </Pressable>

        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={[...image_urls]}
                showsHorizontalScrollIndicator={false}
                horizontal
                contentContainerStyle={{ paddingLeft: padding }}
                renderItem={renderItem}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    {
                        useNativeDriver: false,
                    }
                )}
                keyExtractor={(item, index) => index.toString()}
            // ListFooterComponent={<View style={{ width: padding - marginRight }} />}
            />
            <View style={{ ...styles.dotContainer, opacity: image_urls.length > 1 ? 1 : 0 }}>
                <ScalingDot
                    data={image_urls}
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
        flex: 1
    },
    listContainer: {
        flex: 1,
    },
    dotContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default ImagesCarousel;
