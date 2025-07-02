import React from 'react';
import { Modal, View, Text } from 'react-native';
import QSpinner from './QSpinner';

type LoadingModalProps = {
    text: string;
    loading: boolean;
};
export default function LoadingModal({ text, loading }: LoadingModalProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={loading}
            onRequestClose={() => {
                // You can add some action here if needed when the modal attempts to close
            }}
        >
            <View style={styles.modalView}>
                <View style={styles.smallerBox}>
                    <QSpinner />
                    <Text style={styles.text}>{text}</Text>
                </View>
            </View>
        </Modal>
    )
}


const styles = {
    modalView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00000180"
    },
    smallerBox: {
        flex: 1,
        backgroundColor: "#00000190",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        maxHeight: '20%',
    },
    text: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 16
    }
};