// ClaimBox.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CoinBox } from './CoinBox';
import { useTranslation } from 'react-i18next';

export function ClaimBox({ title, coinCount, onPress, claimed, countdown, loading = false, disabled = false }) {
    const { t } = useTranslation();
    const renderClaimButton = () => {
        if (claimed) {
            return (
                <TouchableOpacity style={styles.claimed} disabled={true}>
                    <Text style={styles.claimedBoxText}>
                        {countdown || t('claimTokens.claimed')}
                    </Text>
                </TouchableOpacity>
            )
            
        } else if (loading) {
            return (
                <TouchableOpacity style={styles.claim} disabled={true}>
                    <Text style={styles.valueBoxText}>
                        {t('Loading')}
                    </Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity style={styles.claim} onPress={onPress} disabled={disabled}>
                    <Text style={styles.valueBoxText}>
                        {t('claimTokens.claim')}
                    </Text>
                </TouchableOpacity>
            )
        }
    }

    return (
        <View style={styles.claimBoxContainer}>
            <View style={{ alignItems: 'flex-start' }}>
                <Text style={styles.valueText}>
                    {title}
                </Text>
                <CoinBox coinCount={coinCount} />
            </View>
            {renderClaimButton()}
        </View>
    )
}

const styles = StyleSheet.create({
    claimBoxContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white",
        //0px 8px 20px 0px rgba(0, 0, 0, 0.02);
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.02,
        shadowRadius: 20,
        elevation: 1,
        borderRadius: 25,
        paddingHorizontal: 20,
        minHeight: 80,
        paddingVertical: 10,
        marginBottom: 12,
    },
    valueText: {
        color: "#000",
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "500",
        fontSize: 16,

    },
    claim: {
        backgroundColor: "#6D56FA",
        borderRadius: 20,
        padding: 3,
        borderColor: "#6D56FA",
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 7,
    },
    claimed: {
        backgroundColor: "rgba(60, 218, 138, 0.25)",
        borderRadius: 20,
        padding: 3,
        borderColor: "rgba(60, 218, 138, 0.25)",
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 5,
        opacity: 0.5,
    },
    claimedBoxText: {
        color: "#00B700",
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "600",
        fontSize: 14,
    },
    valueBoxText: {
        color: "white",
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "500",
        fontSize: 14,
    },
});
