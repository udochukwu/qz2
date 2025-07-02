import { SafeAreaView } from "react-native";
import EarnTokensBlock from "../components/PayWall/EarnTokensBlock";
import { ScrollView } from "react-native-gesture-handler";


export default function EarnTokensScreen({ navigation, route }: { navigation: any; route: any }) {


    return (
        <SafeAreaView style={{ height: "100%", justifyContent: 'center', alignItems: 'center', backgroundColor: "#F7F7F7" }}>
            <ScrollView
                style={{ width: "100%", backgroundColor: "#F7F7F7" }}
            >
                <EarnTokensBlock navigation={navigation} asAscreen={true} />
            </ScrollView>
        </SafeAreaView>
    )

}