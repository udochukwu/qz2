import React from "react";
import { Text, View } from "react-native";
import Header1 from "./components/Header1";
import TextMarkDown from "./components/TextMarkDown";
import { useTranslation } from "react-i18next";
import { blockstyles } from "./styles";
import AskedBy from "./components/AskedBy";
import ImagesCarousel from "./components/ImagesCarousel";
import WarningBox from "./components/WarningBox";

interface ShortQuestionContainerProps {
    question_type_text?: string;
    question_text: string;
    on_resources?: () => void;
    is_markdown?: boolean;
    header_text: string;
    header_image?: string;
    view_count?: number;
    diagram_urls?: string[];
    warning_text?: string;
}

function ShortQuestionContainer({ question_type_text, question_text, on_resources, is_markdown = true, header_text, header_image, view_count, diagram_urls, warning_text }: ShortQuestionContainerProps) {
    const { t } = useTranslation();
    return (
        <View style={blockstyles.container}>
            <View style={blockstyles.card}>
                {warning_text && <WarningBox warning_text={warning_text} />}
                <Header1 header_text={header_text} font_size={13} header_image={header_image} color={"#000"} font_weight="500" style={{ marginBottom: 16 }} />
                {question_type_text && <Header1 header_text={question_type_text} font_weight="500" />}
                {diagram_urls &&
                    <View style={{ width: "100%", height: 180, marginTop: 10, marginBottom: 10 }}>
                        <ImagesCarousel image_urls={diagram_urls} />
                    </View>}
                <TextMarkDown text={question_text} is_markdown={is_markdown} />
                {view_count && <AskedBy view_count={view_count} />}
            </View>
        </View>
    )
}



export default ShortQuestionContainer;
export type { ShortQuestionContainerProps };