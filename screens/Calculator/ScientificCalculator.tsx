import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import CalculatorKeypads from "./components/CalculatorKeypads";
import WebView from "react-native-webview";
import { MathJaxSvg } from 'react-native-mathjax-html-to-svg';
import { History, useCalculatorHistoryStore } from "./store/calculatorHistory";
interface IProps {
    showHistory: () => void
    historyValue?: History
}

const screenHeight = Dimensions.get('window').height;

export default function ScientificCalculator({showHistory, historyValue}: IProps) {
    const { addToHistory} = useCalculatorHistoryStore()
    const webViewRef = useRef<WebView>(null);
    const [mathValue, setMathValue] = useState("")
    const [hasResult, setHasResult] = useState(false)
    const [loadingWebView, setLoadingWebView] = useState(true)
    const [isDegreeFormat, setIsDegreeFormat] = useState(true)

    const htmlContent = `
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <script src="https://unpkg.com/mathlive@0.104.2/dist/mathlive.min.js"></script>
       <script src="https://unpkg.com/@cortex-js/compute-engine"></script>
        <style>
        html { margin: 0px; padding: 0px;}
          body { margin: 0px; padding: 0px; width: 100%;}
          math-field {
            font-size: 130px;
            font-weight: 500;
            font-family: 'Inter', sans-serif !important;
            letter-spacing: -1px;
            padding: 10px;
            width: 100% !important;
            min-height: 20px;
            overflow-x: auto;
            border: none;
            caret-color: transparent !important;
            //  --selection-background-color: white;
            --selection-color: grey;
            --contains-highlight-background-color: white;
            --caret-color: black;
            --highlight-text: black;
            --latex-color: black;
          }
            /* Hide the virtual keyboard toggle */
            math-field::part(virtual-keyboard-toggle) {
            display: none;
            }
            math-field:focus-within {
                outline: none;
            }
            math-field::part(container) {
                height: 100%;
                font-family: "Inter", sans-serif !important;
            }
            math-field::part(selection) {
                background-color: transparent !important;
            }
            math-field::part(content) {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                direction: rtl; /* Right-to-left text direction */
                text-align: right;
                align-items: flex-end;
                min-height: 100%;
                padding-bottom: 16px;
                width: 100%;
                overflow: auto;
                font-family: "Inter", sans-serif !important;
            }
            math-field::part(menu-toggle) {
                display: none;
            }
        </style>
      </head>
      <body>

        <math-field id="mathfield" style="display: block" math-virtual-keyboard-policy="manual"></math-field>
        <script>
            const mathField = document.getElementById("mathfield");
             const ce = new ComputeEngine.ComputeEngine(); // Create Compute Engine instance
            document.body.style.setProperty("--text-font-family", "Inter");
           // Ensure ComputeEngine is loaded properly

                window.addEventListener("load", () => {
                window.isDegreeFormat = true;
                window.fractionMode = false;
                window.previousFn = ""
            });

            function decimalToFraction(decimal, tolerance = 1.0e-8) {
    if (decimal === parseInt(decimal)) return decimal.toString(); // If it's an integer, return as is.

    let numerator = 1;
    let denominator = 1;
    let error = Math.abs(numerator / denominator - decimal);

    while (error > tolerance) {
        if (numerator / denominator < decimal) {
            numerator++;
        } else {
            denominator++;
            numerator = Math.round(decimal * denominator);
        }
        error = Math.abs(numerator / denominator - decimal);
    }

    return \`\\\\frac{\${numerator}}{\${denominator}}\`; // Return LaTeX fraction
}

            // Receive input from React Native and insert into MathLive
            window.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);
            const mainData = data?.data
            if (mainData) {
                if(data?.event === "keypress"){
                    if(mainData === "Backspace"){
                        mathField.executeCommand("deleteBackward");
                        return
                    }

                    if(mainData === "pm"){
                        let val = mathField.getValue("latex")
                        let newValue = -Number(val)
                        mathField.value = newValue
                        return
                    }

                    if(mainData === "sd"){
                        let val = mathField.getValue("latex")
                        if(!val){
                            window.fractionMode = !window.fractionMode
                        }else {
                            let expr = ce.parse(val);
                            if(!window.fractionMode){
                                const frac = decimalToFraction(val)
                                const message = {result: frac, equation: val }
                                mathField.value = frac
                            }else {
                                const result = expr.N().valueOf()
                                const roundedResult = parseFloat(result.toFixed(8))
                                mathField.value = toScientificNotationLatex(roundedResult)
                                window.fractionMode = false
                            }
                        }
                        return
                    }

                    if(mainData === "pwr"){
                        let val = mathField.getValue("latex")
                        if(!val.length){
                            mathField.value = "\{0}^2"
                            mathField.executeCommand("moveToNextChar");
                        }else {
                            if(window.previousFn == "pwr"){
                                mathField.executeCommand("moveToPreviousChar");
                                mathField.insert("2")
                                mathField.executeCommand("moveToNextChar");
                                return
                            }else {
                                mathField.insert("^2")
                            }
                        }
                          window.previousFn = "pwr"
                        return
                    }

                    if(mainData === "deg"){
                        let val = mathField.getValue("latex")
                        if(!val.length){
                            mathField.value = "0^\\\\circ"
                            mathField.executeCommand("moveToNextChar");
                        }else {
                            if(window.previousFn == "deg"){
                                mathField.executeCommand("moveToPreviousChar");
                                mathField.insert("\\\\circ")
                                mathField.executeCommand("moveToNextChar");
                                return
                            }else {
                                mathField.insert("^\\\\circ")
                            }
                        }
                          window.previousFn = "deg"
                        return
                    }

                     if(mainData === "mth_pwr"){
                        let val = mathField.getValue("latex")
                        if(!val.length){
                            mathField.value = "0^{\\\\placeholder{}}"
                            mathField.executeCommand("moveToNextChar");
                        }else {
                            if(window.previousFn == "mth_pwr"){
                                mathField.executeCommand("moveToPreviousChar");
                                mathField.insert("{\\\\placeholder{}}")
                                mathField.executeCommand("moveToNextChar");
                                return
                            }else {
                                mathField.insert("^{\\\\placeholder{}}")
                            }
                        }
                          window.previousFn = "mth_pwr"
                        return
                    }

                    if(mainData === "AC"){
                        mathField.value = "";
                        return
                    }
                    if(mainData === 'left'){
                        mathField.focus();
                        mathField.executeCommand("moveToPreviousChar");
                        return;
                    }
                    if(mainData === 'right'){
                        mathField.focus();
                        mathField.executeCommand("moveToNextChar");
                        return;
                    }
                    mathField.insert(mainData);
                    window.previousFn = ""
                }
                if(data?.event === "historyValue"){
                    mathField.value = mainData;
                    return
                }
            }
          });
             function toScientificNotationLatex(value) {
        if (value === 0) return "0";

        const absValueStr = value.toString().replace(/[^0-9]/g, "").length;
        const exponent = Math.floor(Math.log10(Math.abs(value)));

        // Convert only if the number of digits exceeds 8 and the exponent is not 0
        if (absValueStr > 8 && exponent !== 0) {
          const coefficient = value / Math.pow(10, exponent);
          const formattedCoefficient = parseFloat(coefficient.toPrecision(9)); // 9 significant figures
          return \`\\\\(\${formattedCoefficient} \\\\times 10^{\${exponent}}\\\\)\`;
        }

        // Keep numbers with 8 or fewer digits in normal form
        return value.toString();
      }
          // Function to evaluate MathLive expression
          function evaluateExpression() {
            let latexInput = mathField.getValue(); // Get LaTeX expression
            let equation = mathField.getValue()
            const comb = latexInput.match(/C\\\\frac(?:{(\\d+)}|(\\d+))(?:{(\\d+)}|(\\d+))/);
            if(comb){
                let n = comb[1] || comb[2];
                let r = comb[3] || comb[4]
                if(n < r){
                    [n, r] = [r, n]
                }
                latexInput = \`\\\\frac{\${n}!}{(\${n}-\${r})! \${r}!}\`;
            }
            const perm = latexInput.match(/P\\\\frac(?:{(\\d+)}|(\\d+))(?:{(\\d+)}|(\\d+))/);
            if(perm){
                let n = perm[1] || perm[2];
                let r = perm[3] || perm[4]
                if(n < r){
                    [n, r] = [r, n]
                }
                latexInput = \`\\\\frac{\${n}!}{(\${n} - \${r})!}\`
            }
            // 🔹 Convert Trigonometric Functions to Radians (if degree mode is enabled)
            const RadianToDegree = (deg) => (\`(\${deg} * \${3.141592653589793 / 180})\`);
            if (window.isDegreeFormat) {
                latexInput = latexInput
                .replace(/\\\\sin\\\\left\\((\\d+)\\\\right\\)/g, (_, d) => \`\\\\sin(\${RadianToDegree(d)})\`)
                .replace(/\\\\cos\\\\left\\((\\d+)\\\\right\\)/g, (_, d) => \`\\\\cos(\${RadianToDegree(d)})\`)
                .replace(/\\\\tan\\\\left\\((\\d+)\\\\right\\)/g, (_, d) => \`\\\\tan(\${RadianToDegree(d)})\`);
            }
            const expr = ce.parse(latexInput); // Parse the LaTeX expression
            if(!expr.isValid){
                mathField.value = "Error"
                return;
            }
            const result = expr.N().valueOf(); // Evaluate expression
            if(isNaN(result)){
                mathField.value = "Error"
                return;
            }
            const roundedResult = parseFloat(result.toFixed(8))
            // mathField.value = toScientificNotationLatex(roundedResult)
            const lat = ce.box(toScientificNotationLatex(roundedResult)).toJSON()

            if(window.fractionMode){
                mathField.value = expr.simplify().toJSON()
            }else {
                mathField.value = toScientificNotationLatex(roundedResult)
            }
            // mathField.value = expr.simplify().toJSON()
            const message = {result: toScientificNotationLatex(roundedResult), equation: equation }
            window.ReactNativeWebView.postMessage(JSON.stringify(message));
          }
        </script>
      </body>
    </html>
  `;

    const toggleFormat = () => {
        webViewRef.current?.injectJavaScript(`window.isDegreeFormat = ${JSON.stringify(!isDegreeFormat)}`)
        setIsDegreeFormat(!isDegreeFormat)
    }

    const sendInputToWebView = (input: string) => {
        if(input === "history"){
            showHistory()
            return
        }

        if (input === "=") {
            webViewRef.current?.injectJavaScript("evaluateExpression(); true")
            setHasResult(true)
            return
        }

        if (input === "rad") {
            toggleFormat()
            return
        }
        const message = {
            event: "keypress",
            data: input === "%" ? "\\%" : input
        }
        webViewRef.current?.postMessage(JSON.stringify(message));
        setMathValue("")
        setHasResult(false)
    };

    const onDeleteLongPress = () => {
        const message = {
            event: "keypress",
            data: "AC"
        }
        setMathValue("")
        webViewRef.current?.postMessage(JSON.stringify(message));
    }

    useEffect(() => {
            if(historyValue?.type === "calc"){
                const message = {
                    event: "historyValue",
                    data: historyValue.result
                }
                setMathValue(historyValue.equation)
                webViewRef.current?.postMessage(JSON.stringify(message));
            }
        }, [historyValue])

    return (
        <View style={styles.container} >
            <View style={{ flex: 1 }} >

                <View style={styles.resultView} >
                    <MathJaxSvg
                        fontSize={16}
                        color="grey"
                        fontCache={true}
                    >
                        {`$$${mathValue}$$`}
                    </MathJaxSvg>
                </View>
                <WebView
                    ref={webViewRef}
                    source={{ html: htmlContent }}
                    scrollEnabled={false}
                    javaScriptEnabled
                    onLoadEnd={() => setLoadingWebView(false)}
                    bounces={false}
                    sharedCookiesEnabled
                    cacheEnabled
                    onError={(err) => {
                        console.log("Error loading webview", err)
                    }}
                    onMessage={(event) => {
                        const message = event.nativeEvent.data
                        try {
                            const data = JSON.parse(message);
                            setMathValue(data?.equation)
                            addToHistory({ equation: data.equation, result: data?.result, type: "calc" })
                        } catch (error) {
                            console.log(error, "Error passing event data")
                        }
                    }}
                    style={styles.webView}
                />

            </View>
            {loadingWebView ? <View style={styles.loadingContainer} >
                <ActivityIndicator size="large" />
            </View> : <CalculatorKeypads
                            isDegreeFormat = {isDegreeFormat}
                            onPress={sendInputToWebView}
                            hasResult={hasResult}
                            onDeleteLongPress={onDeleteLongPress}
                        />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: screenHeight > 700 ? '20%' : '40%',
        paddingHorizontal: 20,
        width: "100%",
        justifyContent: "flex-end",
    },
    resultView: {
        justifyContent: 'flex-end',
        alignItems: "flex-end",
        height: '30%',
    },
    webView: {
        width: "100%",
        marginBottom: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        minHeight: 500
    }
})
