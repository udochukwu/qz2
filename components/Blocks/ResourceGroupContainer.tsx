import { Animated, Dimensions, StyleSheet, View } from "react-native";
import React from "react";
import { FlatList } from "react-native-gesture-handler";
import ResourceContainer from "./components/ResourceContainer";
import { ScalingDot } from "react-native-animated-pagination-dots";

const padding = 12;
const marginRight = 10;

function ResourceGroupContainer({ resource_blocks, request_id }: { resource_blocks: any , request_id: string}) {
    const scrollX = React.useRef(new Animated.Value(0)).current;

    const screenWidth = Dimensions.get('window').width - padding * 3;
    const renderItem = ({ item }: { item: any }) => (
        <View style={{ width: screenWidth, marginRight: marginRight, marginVertical: 3 }}>
            <ResourceContainer {...item.block_data} request_id={request_id} />
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.listContainer}>
                <FlatList
                    data={resource_blocks}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        {
                            useNativeDriver: false,
                        }
                    )}
                    contentContainerStyle={{ paddingLeft: padding }}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={<View style={{ width: padding - marginRight }} />}
                />
            </View>
            <View style={styles.dotContainer}>
                <ScalingDot
                    data={resource_blocks}
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

export default ResourceGroupContainer;
