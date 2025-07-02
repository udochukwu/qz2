import { PrimaryButton } from "../components/Button"
import { storage } from "../services/storage"
import { Text, SafeAreaView, StyleSheet } from "react-native"
import { textStyles } from "../components/styles"
import React, { useEffect, useState } from "react"
import { TextInput } from "react-native-gesture-handler"


export default function SelectApi({ navigation }: { navigation: any }) {
    // From a list of apis select one
    const apis = [
        "https://staging.quizard.ai",
        "https://api.quizard.ai"]
    const [selectedAPI, setSelectedAPI] = useState(null)
    useEffect(() => {
        if (selectedAPI)
            setApi(selectedAPI)
    }, [selectedAPI])
    function setApi(api: string) {
        // Set the api in the storage
        console.log("set api", api)
        storage.set("api", api)

    }



    return (
        <SafeAreaView style={styles.container}>
            <Text style={textStyles.primaryText}>
                Select API
            </Text>
            <Text style={{ ...textStyles.primaryText, fontSize: 10 }}>
                (Make sure you close the app after you loggout)
            </Text>
            <PrimaryButton
                style={{ ...styles.startButton, backgroundColor: selectedAPI == apis[0] ? "green" : "black" }}
                text={apis[0]}
                onPress={() => {
                    setSelectedAPI(apis[0])
                }}
            />
            <PrimaryButton
                style={{ ...styles.startButton, backgroundColor: selectedAPI == apis[1] ? "green" : "black" }}
                text={apis[1]}
                onPress={() => {
                    setSelectedAPI(apis[1])
                }}

            />
            <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1, minWidth: 30 }} onChangeText={text => setSelectedAPI(text)} value={selectedAPI} />
            <Text style={{ ...textStyles.primaryText, fontSize: 10 }}>
                Selected API: {selectedAPI}
            </Text>
            <PrimaryButton
                style={styles.startButton}
                text={"Continue"}
                onPress={() => {
                    navigation.navigate("Intro")
                }}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // TODO: change the layout in general and not apply the style on button
    startButton: {
        width: "90%",
        marginBottom: 20,
    },

});
