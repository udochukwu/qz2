import { Image,  StyleSheet, Text, View, SafeAreaView, Dimensions, BackHandler } from "react-native";
import {  setOnboarded } from "../services/storage";
import { ScrollView } from "react-native-gesture-handler";
import OptionBox from "../components/OptionBox";
import { useContext, useEffect, useState, useMemo } from "react";
import ChatBubble from "../components/ChatBubble";
import OptionCheckBox from "../components/OptionCheckBox";
import ProfileContext from "../contexts/ProfileContext";
import FastImage from 'react-native-fast-image'
import { FetchOnboardUser } from "../services/backendCalls";
import Button from "../components/Button";
import { BackArrow } from "../components/BackArrow";
import { useTranslation } from 'react-i18next';
import CustomModel from "../components/CustomModel";

function LoadingBar({ percentage }) {
    return (
        <View style={styles.loadingBar}>
            <View style={{ width: `${percentage}%`, height: "100%", backgroundColor: "#6D56FA", borderRadius: 27 }} />
        </View>
    )

}

function QuizardChat({ text }) {


    return (

        <View style={{ width: "100%", flexDirection: "row", alignItems: "center", marginTop: 20 }}>
            <View style={{ width: "20%", justifyContent: "center", alignItems: "center" }}>
                {/*Quizard logo*/}
                <Image source={require("../assets/quizard.png")} style={{ width: 60, height: 60 }} resizeMethod="resize" resizeMode="contain" />
                {/*Shadow under quizard logo*/}
                <View style={{ width: 17, height: 10, backgroundColor: "#D9D9D9", borderRadius: 10, opacity: 0.5, zIndex: -1, transform: [{ scaleX: 2 }], marginTop: 5 }} />
            </View>
            <View style={{ width: "80%" }}>
                <ChatBubble message={text} />
            </View>

        </View >
    )

}

function HeaderSection({ percentage, message, showBackButton = true, onGoback = null, isCustomModelExperimentStep = false }) {
    return (
        <View style={{ width: "100%" }}>
            <View style={{ flexDirection: "row", justifyContent: "center", width: "100%", alignItems: 'center', marginTop: 20 }}>
                {showBackButton ? (
                    <BackArrow onClick={onGoback} />
                ) : (
                    <View style={{ width: 17, height: 17 }} />
                )}
                <LoadingBar percentage={percentage} />
            </View>
            { !isCustomModelExperimentStep && <View style={{ width: "100%", alignItems: "center", marginTop: 20 }}>
                <QuizardChat text={message} />
            </View>}
        </View>
    )
}

const interpolateString = (str, values) => {
    return str.replace(/\${(\w+)}/g, (match, key) => values[key] || match);
}

function DynamicSelectionOnboarding({ options, message, isCheckBox = false, percentage, onGoback, onContinue, isLast, field_name, onSelectionUpdate, currentStep, allSelections }) {
    const { t } = useTranslation();
    const [selected, setSelected] = useState([]);
    
    const interpolationValues = {};
    if (currentStep?.condition) {
        const conditionField = Object.keys(currentStep.condition)[0];
        interpolationValues[conditionField] = allSelections?.[conditionField];
    }
    
    const interpolatedOptions = options.map(option => 
        interpolateString(option, interpolationValues)
    );
    
    useEffect(() => {
        setSelected([])
    }, [options])
    
    const buttonText = isLast ? t(`StartSolving`) : t(`Continue`)
    const onPress = () => {
        const selectedOptions = selected.map((item) => interpolatedOptions[item]).filter((item) => item != undefined)
        onSelectionUpdate(field_name, isCheckBox ? selectedOptions : selectedOptions[0])
        onContinue()
        if (isCheckBox) {
            FetchOnboardUser(field_name, selectedOptions)
        } else {
            FetchOnboardUser(field_name, selectedOptions[0])
        }
    }
    
    const handleSelection = (selection, fieldName) => {
        setSelected(selection)
        onSelectionUpdate(fieldName, isCheckBox ? 
            selection.map(idx => interpolatedOptions[idx]) : 
            interpolatedOptions[selection[0]])
    }

    return (
        <>
            <View style={{ justifyContent: "center", alignItems: "center", width: "100%", flex: 1, marginTop: 30 }}>
                <ScrollView style={{ width: "100%" }}
                    showsVerticalScrollIndicator={false}
                >
                    {
                        interpolatedOptions.map((option, index) => (
                            !isCheckBox ?
                                <OptionBox
                                    key={index}
                                    text={option}
                                    selected={selected.includes(index)}
                                    onPress={() => {
                                        handleSelection([index], field_name)
                                    }}
                                />
                                :
                                <OptionCheckBox
                                    key={index}
                                    text={option}
                                    selected={selected.includes(index)}
                                    onPress={() => {
                                        if (selected.includes(index)) {
                                            handleSelection(selected.filter((item) => item != index), field_name)
                                        } else {
                                            handleSelection([...selected, index], field_name)
                                        }
                                    }}
                                />
                        ))
                    }
                </ScrollView>
                <Button style={styles.button} onPress={() => onPress()} disabled={selected.length == 0}>
                    <Text style={styles.buttonText}>{buttonText}</Text>
                </Button>
            </View>
        </>
    )
}


function DemoPage({ message, percentage, onContinue, isLast }: { message: string, percentage: number, onContinue: () => void, isLast: boolean }) {
    const { t } = useTranslation();
    const screenWidth = Dimensions.get("screen").width
    const buttonText = isLast ? t(`StartSolving`) : t(`Continue`)
    const onPress = () => {
        onContinue()
        FetchOnboardUser("demo", true)
    }
    return (
        <>
            <View style={{ justifyContent: "center", alignItems: "center", width: "100%", flex: 1, }}>
                <FastImage source={require("../assets/demo.gif")} resizeMode="contain" style={{
                    width: screenWidth, height: "100%"
                }} />
            </View>
            <Button style={styles.button} onPress={() => onPress()}>
                <Text style={styles.buttonText}>{buttonText}</Text>
            </Button>
        </>
    )

}


function IntroScreen2({ navigation, route }) {
    const context = useContext(ProfileContext)
    const { t } = useTranslation();
    const isCustomModelExperiment = context.revenueCatMetadata.rc_experiment_group == "exp_CustomModel_true" 
    useEffect(() => {
        context.getProfileStatus()
    }, [])
    // Use useMemo to prevent recreating the array on every render
    const ONBOARDING_STEPS = useMemo(() => {
        const steps = route.params?.onboarding_steps || [
            {
                "field_name": "demo",
                "message": t('TakePictureMessage'),
                "type": "demo",
                "options": []
            },
            {
                "field_name": "subjects",
                "message": t('HelpSubjectMessage'),
                "type": "mulit_select",
                "options": [
                    t('Subjects.AllSubjects'),
                    t('Subjects.Mathematics'),
                    t('Subjects.History'),
                    t('Subjects.English'),
                    t('Subjects.Biology'),
                    t('Subjects.Chemistry'),
                    t('Subjects.Physics'),
                    t('Subjects.SAT'),
                    t('Subjects.Geography'),
                    t('Subjects.Arts'),
                    t('Subjects.Business'),
                    t('Subjects.Computers'),
                    t('Subjects.Nursing'),
                    t('Subjects.Law')
                ]
            },
            {
                "field_name": "attribution",
                "message": t('HearAboutUsMessage'),
                "type": "single_select",
                "options": [
                    t('Attribution.Friend'),
                    t('Attribution.Google'),
                    t('Attribution.AppStore'),
                    t('Attribution.Tiktok'),
                    t('Attribution.Instagram'),
                    t('Attribution.Other')
                ]
            },
            {
                "field_name": "attribution_source",
                "message": t('HowDidYouFindUsMessage'),
                "condition": {
                    "attribution": ["Tiktok", "Instagram"]
                },
                "type":"single_select",
                "options": [
                    t('AttributionSource.Ad'),
                    t('AttributionSource.ForYouPage'),
                    t('AttributionSource.Search'),
                    t('AttributionSource.Friend')
                ]
            },
            {
                "field_name": "goal",
                "message": t('GoalUsingQuizardMessage'),
                "type": "single_select",
                "options": [
                    t('Goals.QuickAssignments'),
                    t('Goals.BetterUnderstanding'),
                    t('Goals.DoubleChecking'),
                    t('Goals.Other')
                ]
            },
            {
                "field_name": "school_type",
                "message": t('EducationJourneyMessage'),
                "type": "single_select",
                "options": [
                    t('SchoolType.MiddleSchool'),
                    t('SchoolType.HighSchool'),
                    t('SchoolType.OnlineDegree'),
                    t('SchoolType.College'),
                    t('SchoolType.Other')
                ]
            }
        ];

        if (isCustomModelExperiment && steps[steps.length - 1].field_name != "custom_model") {
            steps.push({
                
                    "field_name": "subjects",
                    "message": t('HelpSubjectMessage'),
                    "type": "mulit_select",
                    "options": [
                        t('Subjects.AllSubjects'),
                        t('Subjects.Mathematics'),
                        t('Subjects.History'),
                        t('Subjects.English'),
                        t('Subjects.Biology'),
                        t('Subjects.Chemistry'),
                        t('Subjects.Physics'),
                        t('Subjects.SAT'),
                        t('Subjects.Geography'),
                        t('Subjects.Arts'),
                        t('Subjects.Business'),
                        t('Subjects.Computers'),
                        t('Subjects.Nursing'),
                        t('Subjects.Law')
                    ]
            })
            steps.push({
                "field_name": "custom_model",
                "message": t('CustomModelMessage'),
                "type": "custom_model",
            });
        }

        return steps;
    }, [route.params]); // Dependencies array

    //remove back button for android
    useEffect(() => {
        // disable back button
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
    }, [])

    const [step, setStep] = useState(0)
    const numberOfSteps = ONBOARDING_STEPS.length
    const [options, setOptions] = useState(ONBOARDING_STEPS[0].options || [])
    const [allSelections, setAllSelections] = useState({})

    const onContinue = async () => {
        console.log("stepsnumb", numberOfSteps)
        if (step < numberOfSteps - 1) {
            let nextStep = step + 1
            // Find the next valid step based on conditions
            while (nextStep < numberOfSteps) {
                const stepData = ONBOARDING_STEPS[nextStep]
                if (!stepData.condition) {
                    break
                }
                
                const conditionField = Object.keys(stepData.condition)[0]
                const conditionValue = stepData.condition[conditionField]
                const currentValue = allSelections[conditionField]                
                // Check if condition is met
                const conditionMet = Array.isArray(conditionValue) 
                    ? conditionValue.includes(currentValue)
                    : currentValue === conditionValue
                    
                if (conditionMet) {
                    break
                }
                nextStep++
            }
            
            // If we've gone past all steps, finish onboarding
            if (nextStep >= numberOfSteps) {
                setOnboarded(true)
                context.checkOnboarded()
                context.getProfileStatus()
                return
            }
            
            setStep(nextStep)
            const nextStepData = ONBOARDING_STEPS[nextStep]
            setOptions(nextStepData?.options || [])
        } else {
            setOnboarded(true)
            context.checkOnboarded()
            context.getProfileStatus()
        }
    }
    const onGoBack = () => {
        if (step > 0) {
            let prevStep = step - 1
            // Keep going back until we find a step that either has no condition
            // or its condition is satisfied by the current selections
            while (prevStep > 0) {
                const currentStep = ONBOARDING_STEPS[prevStep]
                if (!currentStep.condition) {
                    break
                }
                const conditionField = Object.keys(currentStep.condition)[0]
                const conditionValue = currentStep.condition[conditionField]
                if (allSelections[conditionField] === conditionValue) {
                    break
                }
                prevStep--
            }
            setStep(prevStep)
            const currentStep = ONBOARDING_STEPS[prevStep]
            if (currentStep?.options) {
                setOptions(currentStep.options)
            }
        } else {
            navigation.goBack()
        }
    }

    const percentage = ((step + 1) / numberOfSteps) * 100
    const isCheckBox = ONBOARDING_STEPS[step].type == "mulit_select"
    
    const onSelectionUpdate = (fieldName, value) => {
        setAllSelections(prev => ({
            ...prev,
            [fieldName]: value
        }))
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <HeaderSection 
                    percentage={percentage} 
                    message={
                        ONBOARDING_STEPS[step].condition 
                            ? interpolateString(
                                ONBOARDING_STEPS[step].message,
                                { [Object.keys(ONBOARDING_STEPS[step].condition)[0]]: allSelections[Object.keys(ONBOARDING_STEPS[step].condition)[0]] }
                              )
                            : ONBOARDING_STEPS[step].message
                    } 
                    showBackButton={step > 0} 
                    onGoback={onGoBack} 
                    isCustomModelExperimentStep={isCustomModelExperiment && step == numberOfSteps - 1} 
                />

                {
                    step == 0 ?
                        <DemoPage 
                            message={ONBOARDING_STEPS[step].message} 
                            percentage={percentage} 
                            onContinue={onContinue} 
                            isLast={step == numberOfSteps - 1} 
                        />
                        :
                        isCustomModelExperiment && step == numberOfSteps - 1 ?
                        <CustomModel onComplete={onContinue} />
                        :
                        <DynamicSelectionOnboarding 
                            options={options} 
                            message={ONBOARDING_STEPS[step].message} 
                            isCheckBox={isCheckBox} 
                            percentage={percentage} 
                            onGoback={onGoBack} 
                            onContinue={onContinue} 
                            isLast={step == numberOfSteps - 1} 
                            field_name={ONBOARDING_STEPS[step].field_name} 
                            onSelectionUpdate={onSelectionUpdate}
                            currentStep={ONBOARDING_STEPS[step]}
                            allSelections={allSelections}  // Pass allSelections directly
                        />
                }
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerContainer: {
        flex: 1,
        width: "90%",
        justifyContent: "space-between",
        alignItems: "center",
    },
    loadingBar: {
        width: "90%",
        height: 13,
        backgroundColor: "#E5E5E5",
        borderRadius: 27,
        justifyContent: "center",
        marginLeft: 15,
    },
    quizard: {
        width: 400,
        height: 400,
    },
    meetQuizard: {
        fontFamily: 'Montserrat',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 30,
        lineHeight: 37,
        height: "6%",
    },
    quizardDescription: {
        width: "90%",
        height: "12%",
        fontFamily: 'Nunito',
        fontStyle: 'normal',
        fontWeight: '300',
        fontSize: 17,
        lineHeight: 23,
        textAlign: 'center',
    },
    button: {
        width: "90%",
        height: 55,
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    buttonText: {
        fontFamily: 'Nunito',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
        color: '#FFFFFF',
    }
});

export default IntroScreen2;
