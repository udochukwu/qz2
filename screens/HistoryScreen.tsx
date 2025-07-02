import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler";
import React, { useEffect } from "react";
import { useIsFocused } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { FetchGetHistory } from "../services/backendCalls";
import Mathpix from "../components/MathpixMarkDown";
import ContentLoader from "react-native-easy-content-loader";
import BlocksScreen from "./BlocksScreen";
import BarWithGesture from "../components/BarWithGesture";
import ProfileContext from "../contexts/ProfileContext";
import { useTranslation } from "react-i18next";
import { blockstyles } from "../components/Blocks/styles";
import QSpinner from "../components/QSpinner";
function QuestionContainer({ data, navigation }) {
    const question_block = data.blocks[0].block_data;
    const question_type = question_block.question_type_text
    const question = question_block.question_text
    const is_latex = question_block.is_markdown
    const suggestedFollowUps = data.suggested_follow_ups ?? [];

    //when we press on the question container, we want to navigate to the question screen
    //and pass the question data as a parameter
    return (
        <View style={{ width: "100%", alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, marginBottom: 16 }}>
            <Pressable
              style={blockstyles.card}
              onPress={() => navigation.navigate("Blocks", { blocks: data.blocks, request_id: data.request_id, templates: data.templates, max_chars_per_follow_up: data.max_chars_per_follow_up, suggestedFollowUps })}>
                <View style={styles.labelType}>
                    <Image style={styles.menuImage} source={require('../assets/menu.png')} />
                    <Text style={styles.questionType}> {question_type} </Text>
                </View>
                <View style={{ flex: 1, width: "90%" }}>
                    <Mathpix text={question} textStyle={styles.question} loader={<ContentLoader active avatar={false} title={false} pRows={2} pHeight={10} pWidth="100%" />} has_latex={is_latex} />
                </View>
            </Pressable>
        </View>
    );
}


function HistoryPage({ navigation }) {
    const { t } = useTranslation();
    const context = React.useContext(ProfileContext);
    const [data, setData] = React.useState([]);
    const isFocused = useIsFocused();

    let fetchData = async () => {
        let response = await FetchGetHistory(context.pro);
        setData(response);
    }

    useEffect(() => {
        context.mixpanel?.track("Page View", 
        { 
          'Page Title': 'History',
          'Device Type': Platform.OS
        });
        
    }, [])

    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused])

    if (!data || !data.history) {

        return (
            <View style={styles.container}>
                <BarWithGesture onSwipeDown={() => navigation.navigate("Home")} />
                <Text style={styles.title}>{t('history')}</Text>

                <ScrollView style={{ width: "100%", marginBottom: 100 }}
                    contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
                    <QSpinner />
                </ScrollView>
            </View>
        )
    }
    return (
        <View style={styles.container}>

            <BarWithGesture onSwipeDown={() => navigation.navigate("Home")} />
            <Text style={styles.title}>{t('history')}</Text>
            <ScrollView style={{ width: "100%" }}
                contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: 50 }}>
                {data.history.map((item, index) => {
                    return <QuestionContainer navigation={navigation} data={item} key={index} />
                })}
            </ScrollView>


        </View >
    )
}




function HistoryScreen({ navigation }) {

    //create a tap screen
    // 1: that displays all the questions that the user has answered
    // 2: when the user taps on a question, it navigates to the question screen

    const Tab = createStackNavigator();
    //remove the header and the bottom tab bar
    return (
        <Tab.Navigator>
            <Tab.Screen name="HistoryTab" component={HistoryPage} options={{ headerShown: false }} />
            <Tab.Screen name="Blocks" component={BlocksScreen} options={{ headerShown: false, cardStyle: { backgroundColor: '#fff' } }} />
        </Tab.Navigator>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F8F8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bar: {
        width: '15%',
        height: 6,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#D9D9D9',

    },

    title: {
        width: "85%",
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 20,
        lineHeight: 24,
        textAlign: 'center',
        color: '#4B4B4B',
        marginTop: 10,
        marginBottom: 10,

    },
    labelType: {

        flexDirection: 'row',
        marginBottom: 10,
    },
    menuImage: {
        width: 15,
        height: 15,
        marginRight: 10,
        tintColor: '#828282',
    },
    question: {
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 22,
        color: '#000',
    },
    questionType: {
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 13,
        lineHeight: 17,
        color: '#6D6D6D',


    },
});

export default HistoryScreen;
export { HistoryPage };
