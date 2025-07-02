import { StyleSheet, Text, View } from "react-native";
import { Path, Svg } from "react-native-svg";



export default function WarningBox({ warning_text }: { warning_text: string }) {


    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <WarninIcon />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{warning_text}</Text>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF0F0',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20
    },
    iconContainer: {
        width: '8%',
        height: '100%',
        alignContent: 'flex-start',
        marginTop: 3
    },
    textContainer: {
        flex: 1
    },
    text: {
        color: '#F00',
        fontSize: 12,
        fontWeight: '500',
        fontFamily: 'Inter'
    }
});

const WarninIcon = () => {
    return (
        <Svg width="17" height="17" viewBox="0 0 16 16" fill="none">
            <Path d="M7.9989 5.998V8.498M1.7969 10.7487C1.21957 11.7487 1.94157 12.998 3.09557 12.998H12.9022C14.0556 12.998 14.7776 11.7487 14.2009 10.7487L9.29824 2.25C8.7209 1.25 7.2769 1.25 6.69957 2.25L1.7969 10.7487ZM7.9989 10.498H8.00357V10.5033H7.9989V10.498Z" stroke="#FF0000" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>

    )
}