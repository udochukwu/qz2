import React, { useEffect, useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next'

function TextInputAnimated({ typedQuestion, setTypedQuestion }) {
    const { t } = useTranslation();

    const exampleQuestions = [
        t('textInputAnimated.exampleQuestions1'),
        t('textInputAnimated.exampleQuestions2'),
        t('textInputAnimated.exampleQuestions3')
    ];

    const [placeholderIndex, setPlaceholderIndex] = useState(-1);
    const [placeholderText, setPlaceholderText] = useState(t('textInputAnimated.placeholder'));

    useEffect(() => {
        if (placeholderIndex === -1) {
            setPlaceholderIndex(0);
            return;
        }

        let currentQuestion = exampleQuestions[placeholderIndex];
        let i = 0;

        let intervalId = setInterval(() => {
            i++;
            setPlaceholderText(currentQuestion.slice(0, i));
            if (i === currentQuestion.length) {
                clearInterval(intervalId);
            }
        }, 100);

        setTimeout(() => {
            setPlaceholderIndex((placeholderIndex + 1) % exampleQuestions.length);
            if (placeholderIndex === exampleQuestions.length - 1) {
                setPlaceholderText(t('textInputAnimated.placeholder'));
            }
        }, currentQuestion.length * 100 + 3000);

        return () => {
            clearInterval(intervalId);
        };
    }, [placeholderIndex]);

    return (
        <TextInput
            autoFocus
            style={styles.input}
            placeholderTextColor={"grey"}
            placeholder={placeholderText}
            value={typedQuestion}
            onChangeText={text => setTypedQuestion(text)}
            multiline={true}
            editable={true}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        minHeight: 40,
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 14,
        lineHeight: 17,
        textAlign: 'center',
        color: '#828282',
        width: "90%",
        //botton height + botton's margin + some margin 
        marginBottom: 20 + 40 + 5,
        marginTop: 5,
    }
});

export default TextInputAnimated;