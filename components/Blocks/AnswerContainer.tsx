import React, { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
import Header1 from "./components/Header1";
import TextMarkDown from "./components/TextMarkDown";
import { FeedbackProps } from "./components/FeedbackButtons";
import Label from "../Label";
import { useTranslation } from "react-i18next";
import { blockstyles } from "./styles";
import { FollowupResponse, useSocketContext } from "../../services/socket";
import { offFollowupResponse, onFollowupResponse } from "../../services/socket/followup";
import { offAnswerStreamResponse, onAnswerStreamResponse } from "../../services/socket/answer";
import ShareFeedback from "./components/ShareFeedback";
import Svg, { Circle } from "react-native-svg";
import ReportIssue from "../ReportIssue";

interface AnswerContainerProps {
  answer_text: string;
  header_text: string;
  is_markdown?: boolean;
  feedback_props?: FeedbackProps;
  header_image?: string;
  answer_url?: string;
  is_verified?: boolean;
  answer_id?: string;
  onReportProblem: () => void
}

function AnswerContainer({ answer_text, header_text, is_markdown = true, feedback_props, header_image, answer_url, is_verified, answer_id, onReportProblem }: AnswerContainerProps) {
  const { t } = useTranslation();
  const { socket } = useSocketContext();
  const [text, setText] = useState(answer_text);
  const [streaming, setStreaming] = useState(false);
  const [visible, setVisible] = useState(false);

  const setAnswerResponse = (token: string) => {
    setStreaming(true);
    setText(prevAnswer => prevAnswer + token);
  }

  const followupResponse = useCallback((data: FollowupResponse) => {
    if (data.followup_id !== answer_id) {
      offFollowupResponse(socket, followupResponse);
      return;
    }

    if (data.token) {
      setStreaming(true);
      setText(prevText => prevText + data.token);
    }

    if (data.close === true) {
      offFollowupResponse(socket, followupResponse);
    }
  }, []);

  useEffect(() => {
    if (answer_id) {
      onFollowupResponse(socket, followupResponse)
    } else {
      onAnswerStreamResponse(socket, setAnswerResponse);
    }
    return () => {
      offFollowupResponse(socket, followupResponse);
      offAnswerStreamResponse(socket, setAnswerResponse);
    }
  }, [answer_id]);

  return (
    <View style={blockstyles.container}>

      <View style={{ ...blockstyles.card, paddingBottom: 16, position: 'relative' }}>
        <View style={{ flexDirection: 'row', alignContent: "center", marginBottom: 10, justifyContent: "space-between" }}>
          <Header1 header_text={header_text} font_size={13} header_image={header_image} color={"#000"} font_weight="500" />
          {is_verified && <Label text={t('Confident')} color={"#379259"} />}
        </View>
        <TextMarkDown text={text} is_markdown={is_markdown} loaderDisabled={streaming} />
        {(feedback_props || answer_url) && <ShareFeedback feedback_props={feedback_props} answer_url={answer_url} />}
        <ReportIssue onReport={onReportProblem} isVisible={visible} setVisible={(e) => setVisible(e)} fromElement={(
            <TouchableOpacity style={[{position: 'absolute', right: '2%', padding: 15 }, !(feedback_props || answer_url) && {top: 10}, (feedback_props || answer_url) && {bottom: 10} ]} onPress={() => setVisible(true)}>
              <Svg width="20" height="6" viewBox="0 0 20 6" fill="none">
                <Circle cx="4" cy="3" r="2.5" fill="#6D6D6D"/>
                <Circle cx="10" cy="3" r="2.5" fill="#6D6D6D"/>
                <Circle cx="16" cy="3" r="2.5" fill="#6D6D6D"/>
              </Svg>
            </TouchableOpacity>
        )} />
      </View>
    </View >
  )
}


export default AnswerContainer;
export type { AnswerContainerProps }; 
