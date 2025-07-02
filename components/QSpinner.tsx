import React from "react"
import { ActivityIndicator, Platform } from "react-native"
import Spinner from "react-native-spinkit"


function QSpinner() {

    if (Platform.OS === "ios") {

        return (
            <Spinner type={"Arc"} color="#6D56FA" style={{ alignSelf: "center" }} size={40} />

        )
    } else {
        return (
            <ActivityIndicator size="large" color="#6D56FA" style={{ alignSelf: "center" }} />

        )
    }
}

export default QSpinner