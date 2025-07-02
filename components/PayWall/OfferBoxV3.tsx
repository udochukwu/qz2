import React from "react";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import FastImage from "react-native-fast-image";

type OfferBoxProps = {
    subscriptionPeriod: "week" | "year" | string;
    priceString: string;
    selected: boolean;
    priceDigit: number;
    basePrice: number;
    trialPeriod: number;
    onSelect: () => void;
};

const getCurrencySymbol = (priceString: string) => {
    // Currency code to symbol mapping
    const currencyMap: Record<string, string> = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'JPY': '¥',
        'CAD': 'C$',
        'AUD': 'A$',
        'CNY': '¥',
        'INR': '₹',
        'RUB': '₽',
        'BRL': 'R$',
        'MXN': 'Mex$',
        'CHF': 'CHF',
        'KRW': '₩',
        'SEK': 'kr'
    };

    const patterns = [
        /^\D+/, // Match any non-digit characters at the start
        /\s?\b[A-Z]{3}\b$/, // Match three uppercase letters at the end with a possible space
        /[^\d\s]\D*$/ // Match non-digit, non-space characters at the end
    ];

    for (const pattern of patterns) {
        const match = priceString.match(pattern);
        if (match) {
            const extracted = match[0].trim();
            
            // Check if the extracted value is a currency code we can map
            if (extracted.length === 3 && currencyMap[extracted.toUpperCase()]) {
                return currencyMap[extracted.toUpperCase()];
            }
            
            return extracted;
        }
    }

    console.log("No currency symbol or code found");
    return "";
};

// New helper function to format price strings with symbols
const formatPriceWithSymbol = (priceString: string) => {
    // Currency code to symbol mapping
    const currencyMap: Record<string, string> = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'JPY': '¥',
        'CAD': 'C$',
        'AUD': 'A$',
        'CNY': '¥',
        'INR': '₹',
        'RUB': '₽',
        'BRL': 'R$',
        'MXN': 'Mex$',
        'CHF': 'CHF',
        'KRW': '₩',
        'SEK': 'kr'
    };
    
    // Check for currency codes like "123.45 USD" or "USD 123.45" - case insensitive
    const currencyCodePatterns = [
        /(\d+(?:\.\d+)?)\s+([A-Za-z]{3})\b/i,  // "123.45 USD" or "123.45 usd"
        /\b([A-Za-z]{3})\s+(\d+(?:\.\d+)?)/i   // "USD 123.45" or "usd 123.45"
    ];
    
    for (const pattern of currencyCodePatterns) {
        const match = priceString.match(pattern);
        if (match) {
            const [_, amount, code] = match[1] === undefined ? [null, match[2], match[1]] : match;
            const symbol = currencyMap[code.toUpperCase()];
            if (symbol) {
                return `${symbol}${amount}`;
            }
        }
    }
    
    // If no transformations occurred, return the original string
    return priceString;
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

export function OfferBoxV3({trialPeriod, subscriptionPeriod, priceString, selected, priceDigit, basePrice, onSelect }: OfferBoxProps) {
    const { t } = useTranslation();
    const autoRenewText = Platform.OS === "android" ? ", " + t("offerbox.autoRenew") : "";
    const formattedPriceString = formatPriceWithSymbol(priceString);
    
    const periodMap = {
         "week": {
            period: 1,
            unit: t("offerbox.week"),
            title: t("offerbox.weeklyPlanTitle"),
            subtitle: trialPeriod ? t("offerbox.weeklyPlanSubtitle",{trialPeriod:trialPeriod})+autoRenewText : t("offerbox.weeklyPlanSubtitleNoTrial") +autoRenewText
         },
        "year": {
            period: 52,
            unit: t("offerbox.months"),
            title: t("offerbox.yearlyPlanTitle"),
            subtitle: t("offerbox.yearlyPlanSubtitle",{price:formattedPriceString}) +autoRenewText  + ", "+t("offerbox.weeklyPlanSubtitleNoTrial").toLocaleLowerCase()
        },
    };
    console.log("subscriptionPeriod: ", subscriptionPeriod);
    const { period, unit, title, subtitle } = periodMap[subscriptionPeriod as keyof typeof periodMap];
    console.log("period: ", period);
    const weekly_price = `${getCurrencySymbol(priceString)}${(priceDigit / (period)).toFixed(2)}`;

    return (
        <Pressable style={{ ...styles.outerContainer }} onPress={onSelect}>
            {/* <View style={{ ...styles.discountContainer, backgroundColor: selected ? '#6D56FA' : '#d6d6d6', opacity: discountPercentage > 10 ? 1 : 0 }}>
                <Text style={styles.discountText}>{t("offerbox.discount", { discountPercentage })}</Text>
            </View> */}
            <View style={{...styles.check, opacity: selected ? 1 : 0}}>
                <FastImage source={require("../../assets/paywall/check.png")} style={{ width: 25, height: 25 }} />
            </View>
            <View style={{ ...styles.container, borderColor: selected ? '#6D56FA' : '#EAEAEA' }}>

                <View style={styles.leftContainer }>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                    {/* <Text style={styles.price}s>{priceString}</Text> */}
                </View>
                <View style={styles.rightContainer}>
                    <Text style={styles.weekly_price}>{`${weekly_price}${t("offerbox.perweek")}`}</Text>
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    outerContainer: {
        width: "100%",
    },
    check:{
        position: 'absolute',
        right: -10,
        top: -10,
        zIndex: 1
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
    container: {
        borderRadius: 19,
        backgroundColor: '#fff',
        borderWidth: 2,
        overflow: 'hidden',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'space-between',
        flexWrap: 'wrap',

    },
    leftContainer: {
        flex: 1,
        gap: 5,
    },
    rightContainer: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 17,
        borderBottomRightRadius: 17,
        backgroundColor: '#fff',
    },
    period: {
        fontSize: 20,
        fontWeight: '700',
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
        fontSize: 16,
        fontWeight: '600',
        color: 'black',
        fontFamily: 'Montserrat',
        marginTop: 5,
    },
    weekly_price: {
        fontSize: 13,
        fontWeight: '600',
        fontFamily: 'Montserrat',
        color: "#633CEF"

    },
    bottomText: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'Montserrat',
        color: "#868686"

    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Montserrat',
        color: "#000"
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '500',
        fontFamily: 'Montserrat',
        color: "#868686"
    }
})

