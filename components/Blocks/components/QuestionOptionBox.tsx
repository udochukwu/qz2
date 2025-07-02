import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Mathpix from '../../MathpixMarkDown';
import ContentLoader from 'react-native-easy-content-loader';

type OptionProps = {
    id: number,
    option_text: string,
    is_markdown: boolean,
    selected: boolean,
    last_item?: boolean,
};

function QuestionOptionBox({ id, option_text, is_markdown, selected, last_item }: OptionProps) {
    const getLetter = (index: number) => {
        //use ascii code to get the letter
        return String.fromCharCode(65 + index);
    }

    return (
        <View
            style={[styles.choice, { backgroundColor: selected ? '#F0FCF3' : '#F9FAFB', borderWidth: 1, borderColor: selected ? '#8ACB9D' : '#F2F4F7', paddingHorizontal: 20, marginBottom: last_item ? 0 : 10 }]}
        >
            {id >= 0 && <View style={styles.answerLetter}>
                {option_text?.length > 0 ?
                    <Text style={{ ...styles.answerLetterText, color: selected ? "#379259" : "#000" }}>{getLetter(id)}</Text> :
                    <ContentLoader active avatar={false} title={false} pRows={1} pHeight={18} pWidth="100%" />
                }
            </View>}
            <View style={[
                styles.answerText,
                {
                    borderColor: '#D0D0D0',
                    flex: 1,
                    borderLeftWidth: id >= 0 ? 1 : 0,
                    paddingLeft: id >= 0 ? 10 : 0,
                }
            ]}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Mathpix
                        text={option_text}
                        textStyle={{ color: '#000', fontWeight: '400', fontSize: 14, fontFamily: 'Inter' }}
                        loader={<ContentLoader active avatar={false} title={false} pRows={1} pHeight={10} pWidth="80%" />}
                        has_latex={is_markdown}
                    />
                </View>
            </View>


        </View >
    );
}

const styles = StyleSheet.create({
    choice: {
        borderRadius: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
        paddingVertical: 15,
        flexDirection: 'row',
        minHeight: 60,
    },
    answerLetter: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerLetterText: {
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 17,
        lineHeight: 22,
        paddingRight: 10,
    },
    answerText: {
        justifyContent: 'center',
        borderLeftWidth: 1,
        borderColor: "#E7E7E7",
        paddingLeft: 10,
    }
});

export default QuestionOptionBox;
