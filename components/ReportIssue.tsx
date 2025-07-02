import { t } from "i18next";
import { ReactNode } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import { ReportIcon } from "./ReportIcon";

type ReportIssueProps = {
    isVisible: boolean,
    fromElement: ReactNode,
    setVisible: (visible: boolean) => void,
    onReport: () => void
}

const ReportIssue = ({ isVisible, fromElement, setVisible, onReport}: ReportIssueProps) => {
    return (
        <Popover
            isVisible={isVisible}
            from={fromElement}
            onRequestClose={() => setVisible(false)}
            placement={PopoverPlacement.BOTTOM}
            popoverStyle={style.popoverStyle}
        >

            <TouchableOpacity
                style={style.popoverContainer}
                onPress={() =>{
                    onReport()
                    setVisible(false)
                }}
            >
                <View>
                    <ReportIcon />
                </View>
                <Text style={style.popoverText}>{t('blockScreen.reportAProblem')}</Text>
            </TouchableOpacity>

        </Popover>
    );
};

const style = StyleSheet.create({
    popoverStyle: {
        backgroundColor: 'white',
        zIndex: 10,
        borderRadius: 10,
        right: 20,
        // iOS Shadow
        shadowColor: 'rgba(10, 13, 18, 0.3)',
        shadowOffset: { width: 0, height: 5.26 },
        shadowOpacity: 0.03,
        shadowRadius: 7.9,
        // Android Shadow
        elevation: 4,
    },
    popoverContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 30,
        paddingVertical: 15,
    },
    popoverText: {
        fontFamily: 'Inter',
        fontWeight: '500',
        fontSize: 15.79,
        lineHeight: 26.32,
        letterSpacing: 0,
        marginLeft: 10
    }
})

export default ReportIssue;
