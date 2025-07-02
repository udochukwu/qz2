import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

type OfferBoxProps = {
    subscriptionPeriod: "P1M" | "P6M" | "P1Y" | string;
    priceString: string;
    selected: boolean;
    priceDigit: number;
    basePrice: number;
    onSelect: () => void;
};

export const getCurrencySymbol = (priceString: string) => {
    const patterns = [
        /^\D+/, // Match any non-digit characters at the start
        /\s?\b[A-Z]{3}\b$/, // Match three uppercase letters at the end with a possible space
        /[^\d\s]\D*$/ // Match non-digit, non-space characters at the end
    ];

    for (const pattern of patterns) {
        const match = priceString.match(pattern);
        if (match) {
            return match[0].trim();
        }
    }

    console.log("No currency symbol or code found");
    return "";
};
// //TEST 
// console.log("Running tests...")
// console.log(getCurrencySymbol("$123.45"));
// console.log(getCurrencySymbol("123.45 USD"));
// console.log(getCurrencySymbol("123.45"));
// console.log(getCurrencySymbol("123.45 €EUR"));
// console.log(getCurrencySymbol("123.45 €"));
// console.log(getCurrencySymbol("USD123.45"));
// console.log(getCurrencySymbol("EUR 123.45"));
// console.log(getCurrencySymbol("123.45€"));
// console.log(getCurrencySymbol("€ 123.45"));
// console.log("Tests complete")

function OfferBoxV2({ subscriptionPeriod, priceString, selected, priceDigit, basePrice, onSelect }: OfferBoxProps) {

    const { t } = useTranslation();
    const periodMap = {
        "P1M": {
            period: 1,
            unit: t("offerbox.month")
        },
        "P6M": {
            period: 6,
            unit: t("offerbox.months")
        },
        "P1Y": {
            period: 12,
            unit: t("offerbox.months")
        },
    };
    const { period, unit } = periodMap[subscriptionPeriod];

    const monthly_price = `${getCurrencySymbol(priceString)}${(priceDigit / period).toFixed(2)}`;
    const discountPercentage = Math.round((basePrice - (priceDigit / period)) / basePrice * 100);

    return (
        <Pressable style={{ ...styles.outerContainer, transform: [{ scale: selected ? 1.1 : 1 }] }} onPress={onSelect}>
            <View style={{ ...styles.discountContainer, backgroundColor: selected ? '#6D56FA' : '#d6d6d6', opacity: discountPercentage > 10 ? 1 : 0 }}>
                <Text style={styles.discountText}>{t("offerbox.discount", { discountPercentage })}</Text>
            </View>

            <View style={{ ...styles.container, borderColor: selected ? '#6D56FA' : '#EAEAEA' }}>

                <View style={{ ...styles.topContainer, backgroundColor: selected ? "#E0E4FF" : "#EAEAEA" }}>
                    <Text style={styles.price}>{monthly_price}</Text>
                    <Text style={styles.bottomText}>{t("offerbox.permonth")}</Text>
                    <Text style={styles.period}>{period}</Text>
                    <Text style={styles.unit}>{unit}</Text>
                </View>
                <View style={styles.bottomContainer}>
                    <Text style={styles.monthly_price}>{priceString}</Text>
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        borderRadius: 19,
        backgroundColor: '#fff',
        borderWidth: 2,
        overflow: 'hidden',

    },
    discountContainer: {
        width: "70%",
        top: 12,
        right: -2,
        zIndex: 1,
        backgroundColor: '#6D56FA',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderTopLeftRadius: 10,    // increased border radius
        borderBottomRightRadius: 10,   // increased border radius
        borderTopRightRadius: 10,   // increased border radius

        border: '1px solid #6D56FA', // adding border of same color
    },
    discountText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: "#fff"
    },

    topContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 15,
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 17,
        borderBottomRightRadius: 17,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    period: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Montserrat',
        color: 'black',
    },
    unit: {
        fontSize: 12,
        fontWeight: '500',
        color: 'black',
        fontFamily: 'Montserrat',
    },
    price: {
        fontSize: 19,
        fontWeight: '700',
        fontFamily: 'Montserrat',
        color: 'black',
        marginTop: 5,
    },
    monthly_price: {
        fontSize: 13,
        fontWeight: '600',
        fontFamily: 'Montserrat',
        color: "#868686"

    },
    bottomText: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'Montserrat',
        color: "#868686"

    }
})

export default OfferBoxV2;
