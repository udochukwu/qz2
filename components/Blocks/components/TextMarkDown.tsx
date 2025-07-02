import React from 'react';
import Mathpix from '../../MathpixMarkDown';
import ContentLoader from 'react-native-easy-content-loader';

import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

// Approximate characters that can fit into one line given the font size
// This is just a rough estimation, as the actual number depends on the font itself and the characters used
const approximateCharsPerLine = Math.floor(screenWidth / (15 * 0.70)); //  fontSize is 14 * 0.9 is some factor to account for the font

function TextMarkDown({ text, is_markdown, loaderDisabled = false }: { text: string, is_markdown: boolean, loaderDisabled?: boolean, }) {
    let numberOfLines = 1; // Default number of lines
    if (text && text.length > 0) {
        numberOfLines = Math.ceil(text.length / approximateCharsPerLine);
    }
    return (
        <Mathpix text={text} textStyle={{ color: '#000', fontWeight: '400', fontSize: 14, fontFamily: 'Inter', lineHeight: 22, }}
            loader={!loaderDisabled && <ContentLoader active avatar={false} title={false} pRows={numberOfLines} pHeight={10} pWidth="100%" />}
            has_latex={true}
        />
    )

}

export default TextMarkDown;
