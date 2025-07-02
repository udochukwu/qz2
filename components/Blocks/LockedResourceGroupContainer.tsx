import { Animated, Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { FlatList } from "react-native-gesture-handler";
import ResourceContainer from "./components/ResourceContainer";
import { ScalingDot } from "react-native-animated-pagination-dots";
import { BlurView } from "@react-native-community/blur";
import Button from "../Button";
import { BlocksContext } from '../../screens/BlocksScreen';
import { useTranslation } from "react-i18next";
import { Circle, Path, Rect, Svg } from "react-native-svg";
import { blockstyles } from "./styles";
import ProfileContext from "../../contexts/ProfileContext";

const fake_data = [
    {
        resource_question: 'This information is restricted to subscribers only.',
        resource_answer: 'Please subscribe to access this information.',
        resource_url: 'https://quizlet.com/123456789/flashcards',
        resource_image_url: 'https://assets.quizlet.com/a/j/dist/app/i/brandmark/1024.0e9431247202b7b.png',
        resource_header: 'Quizlet',
        resource_similarity: 99,
    },
    {
        resource_question: 'This information is restricted to subscribers only.',
        resource_answer: 'Please subscribe to access this information.',
        resource_url: 'https://google.com',
        resource_image_url: 'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/image8-2.jpg?width=1190&height=800&name=image8-2.jpg',
        resource_header: 'Google',
        resource_similarity: 99,
    },
    {
        resource_question: 'This information is restricted to subscribers only.',
        resource_answer: 'Please subscribe to access this information.',
        resource_url: 'https://wikipedia.com',
        resource_image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/1200px-Wikipedia-logo-v2.svg.png',
        resource_header: 'Wikipedia',
        resource_similarity: 99,
    },
    {
        resource_question: 'Unlock this information by subscribing to our pro plan.',
        resource_answer: 'Please subscribe to access this information. These resources will be used to generate a more comprehensive answer to your question.',
        resource_url: 'https://chegg.com',
        resource_image_url: 'https://cdn.lovesavingsgroup.com/logos/chegg.jpg',
        resource_header: 'Chegg',
        resource_similarity: 99,
    },
    {
        resource_question: 'Unlock this information by subscribing to our pro plan.',
        resource_answer: 'Please subscribe to access this information. These resources will be used to generate a more comprehensive answer to your question.',
        resource_url: 'https://brainly.com',
        resource_image_url: 'https://i.pinimg.com/474x/41/83/57/4183571028f79f334a212b135ea5a5a4.jpg',
        resource_header: 'Brainly',
        resource_similarity: 99,
    },
]

const padding = 12;
const marginRight = 10;

function LockedResourceGroupContainer() {
    const { t } = useTranslation();
    const scrollX = React.useRef(new Animated.Value(0)).current;
    const { pressUnlock } = useContext(BlocksContext);

    const context = useContext(ProfileContext);
    const isSuperAIExperiment = context.revenueCatMetadata.rc_experiment_group == "exp_SuperAI_false"

    const screenWidth = Dimensions.get('window').width - padding * 3;
    const renderItem = ({ item }: { item: any }) => {
        return (
            <View style={{ width: screenWidth, marginRight: marginRight, marginVertical: 3 }}>
                <View style={styles.resourcesContainer}>
                    <View style={blockstyles.resourceCard}>
                        <ResourceContainer {...item} />
                    </View>
                    <BlurView
                        blurType="light"
                        blurAmount={8}
                        style={styles.BlurView} >
                        <View style={styles.resourcesBlurredInside}>
                            <Button style={styles.button} onPress={() => {
                                if (isSuperAIExperiment) {
                                    context.mixpanel?.track('Unlock Resources Clicked');
                                }
                                pressUnlock("resources")
                            }}>
                                <Lock />
                                <Text style={styles.buttonText}>{t('UnlockResources')}</Text>
                            </Button>
                        </View>
                    </BlurView>
                </View>
            </View >
        );
    };
    const randomized_data = fake_data.sort(() => Math.random() - 0.5);

    return (
        <View style={styles.container}>
            <View style={styles.listContainer}>
                <FlatList
                    data={fake_data}
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
                    data={randomized_data}
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

function Lock() {
    return (
        <Svg width="20" height="20" viewBox="0 0 104 104" fill="none">
            <Rect width="103.5" height="103.5" rx="51.75" fill="white" />
            <Path d="M36.8397 45.0955V30.6372C36.8397 22.4022 43.5154 15.7264 51.7504 15.7264V15.7264C59.9854 15.7264 66.6612 22.4022 66.6612 30.6372V31.6252" stroke="#633CEF" strokeWidth="6.7275" strokeLinecap="round" />
            <Rect x="27.3226" y="46.345" width="48.855" height="37.5808" rx="7.51615" stroke="#633CEF" strokeWidth="6.7275" />
            <Circle cx="51.7509" cy="61.5589" r="5.90556" fill="#633CEF" />
            <Path d="M51.9125 65.3969V71.4327" stroke="#633CEF" strokeWidth="6.7275" strokeLinecap="round" />
        </Svg>

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
    },
    buttonImage: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    title: {
        fontSize: 14,
        color: '#606060',
        fontFamily: 'Inter',
        fontStyle: 'normal',
        lineHeight: 17,
        fontWeight: '700',
        marginTop: 20,
        marginBottom: 20,
    },
    resourcesContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    BlurView: {
        width: '98%',
        height: '98%',
        position: 'absolute',
        borderRadius: 16,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    resourcesBlurredInside: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
        width: '100%',
        height: '100%',
    },
    button: {
        height: 40,
        backgroundColor: '#633CEF',
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    buttonText: {
        fontFamily: 'Nunito',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
        color: '#FFFFFF',
        marginLeft: 10,
    },
})

export default LockedResourceGroupContainer;
