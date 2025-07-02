import React, { useState, useEffect} from 'react';
import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

const wrapMathpixMarkdown = (content: string, backgroundColor: string, htmlTextStyles: any) => {
    return `

<style>body{background-color:${backgroundColor}; font-family:${htmlTextStyles.fontFamily}; font-size:${htmlTextStyles.fontSize}; color:${htmlTextStyles.color}; font-weight:${htmlTextStyles.fontWeight};margin: 0 !important;padding: 0 !important; line-height: 1.6;}</style>
<meta name="viewport" content="width=device-width">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  </style>
  <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
  <script src="https://cdn.jsdelivr.net/npm/mathpix-markdown-it@1.0.40/es5/bundle.js"></script>
  <div id="formula" style="visibility: hidden; background-color: ${backgroundColor};"></div>
  <script>
    // Add this part into the wrapMathpixMarkdown function
    window.addEventListener('load', function() {
        // get the height of the content
        const height = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
        );

        // Send the height to React Native
        window.ReactNativeWebView.postMessage(JSON.stringify({height: height}));

        // send the width 
        setTimeout(function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({loaded: true}));
        }, 10);
    });
</script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const markdownContent = ${JSON.stringify(content)};
        const html = window.markdownToHTML(markdownContent, {htmlTags: true});

        document.getElementById("formula").innerHTML = html;
        document.getElementById("formula").style.visibility = '';


    });
</script>

`
};
const Mathpix = (props: any) => {
    const [height, setHeight] = useState(1);
    const [loaded, setLoaded] = useState(false);
    const [htmlTextStyles, setHtmlTextStyles] = useState({
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Inter',
        fontWeight: '400',
    });

    // Combine props and states that don't need to trigger re-renders
    const backgroundColor = props.backgroundColor || 'transparent';
    const combinedProps = { ...props, markdownContent: undefined, textStyle: { ...htmlTextStyles, ...props.textStyle } };

    useEffect(() => {
        if (props.textStyle !== undefined && props.textStyle !== htmlTextStyles) {
            setHtmlTextStyles({
                ...htmlTextStyles,
                ...props.textStyle,
            });
        }
    }, [props.textStyle]);


    const onMessage = (event: any) => {
        const { height, loaded } = JSON.parse(event.nativeEvent.data);
        if (height) setHeight(height * 1);
        if (loaded !== undefined) setLoaded(loaded);
    };

    const html = wrapMathpixMarkdown(props.text, backgroundColor, htmlTextStyles);

    if (!props.has_latex) {
        return (
            props.text && props.text.length > 0
                ? <Text style={{ ...props.textStyle }}>{props.text}</Text>
                : props.loader || <View />
        );
    }

    return (
        <View style={{ minHeight: height, ...combinedProps.style, flex: 1, justifyContent: 'flex-start', backgroundColor: backgroundColor }}>
            {
                loaded && props.text && props.text.length > 0
                    ? null
                    : props.loader || <View />
            }
            <WebView
                scrollEnabled={true}
                onMessage={onMessage}
                javaScriptEnabled={true}
                source={{ html }}
                style={{ flex: 1, backgroundColor: backgroundColor, opacity: 0.99, overflow: 'hidden' }}
                {...combinedProps}
                containerStyle={{ flex: 1, backgroundColor: backgroundColor }}
                androidHardwareAccelerationDisabled={true}
            />
        </View>
    );
}

export default Mathpix;
