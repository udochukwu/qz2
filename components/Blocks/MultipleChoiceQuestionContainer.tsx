import React, { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import Header1 from "./components/Header1";
import TextMarkDown from "./components/TextMarkDown";
import QuestionOptionBox from "./components/QuestionOptionBox";
import { blockstyles } from "./styles";
import AskedBy from "./components/AskedBy";
import Svg, { Path } from "react-native-svg";
import ImagesCarousel from "./components/ImagesCarousel";
import WarningBox from "./components/WarningBox";

interface MultipleChoiceQuestionContainerProps {
    question_type_text: string;
    question_text: string;
    on_resources?: () => void;
    options: [string];
    header_text: string;
    header_image?: string;
    view_count?: number;
    diagram_urls?: string[];
    warning_text?: string;
}

function MultipleChoiceQuestionContainer({ question_type_text, question_text, options, header_text, header_image, view_count, diagram_urls, warning_text }: MultipleChoiceQuestionContainerProps) {
    const renderItem = ({ item, index }: { item: string, index: number }) => (
        <View style={{ width: "100%" }}>
            <QuestionOptionBox option_text={item} id={index} is_markdown={true} selected={false} last_item={index === options.length - 1} />
        </View>
    );
    const [expanded, setExpanded] = useState(false);
    return (
        <View style={blockstyles.container}>
            <View style={blockstyles.card}>
                {warning_text && <WarningBox warning_text={warning_text} />}
                <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <Header1 header_text={header_text} font_size={13} header_image={header_image} color={"#000"} font_weight="500" />
                    <TouchableOpacity onPress={() => setExpanded(!expanded)} style={{ height: 25, width: 25, padding: 2 }}>
                        <ExpandArrow expanded={expanded} />
                    </TouchableOpacity>
                </View>
             
                <Header1 header_text={question_type_text} font_weight="500" color={"#606060"} />
                {diagram_urls &&
                    <View style={{ width: "100%", height: 180, marginTop: 10, marginBottom: 10 }}>
                        <ImagesCarousel image_urls={diagram_urls} />
                    </View>}
                <TextMarkDown text={question_text} is_markdown={true} />

                {expanded && <FlatList data={options} renderItem={renderItem} keyExtractor={(item, index) => index.toString()}
                    style={{ width: "100%", marginTop: 10 }}
                />}
                {view_count && <AskedBy view_count={view_count} />}
            </View>
        </View>
    )
}


const ExpandArrow = ({ expanded }: { expanded: boolean }) => {
    if (!expanded)
        return (
            <Svg viewBox="0 0 20 20" fill="none">
                <Path d="M4.00024 6.99995L10.0002 13L16.0002 6.99995" stroke="#5D5D5D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
        )
    else
        return (
            <Svg viewBox="0 0 20 20" fill="none">
                <Path d="M4.00024 13L10.0002 6.99995L16.0002 13" stroke="#5D5D5D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
        )
}
export default MultipleChoiceQuestionContainer;