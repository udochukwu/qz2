import React from 'react'
import { View } from 'react-native'
import FeedBackButton from './FeedbackButtons'
import ShareAnswer from './ShareAnswer'

function ShareFeedback({ feedback_props, answer_url }: { feedback_props: any, answer_url: any }) {

    return (
        <View style={{ flex: 1, marginTop: 12, flexDirection: 'row', borderTopWidth: 1, borderColor: "#EFEFEF", paddingTop: 12 }} >
            {feedback_props && <FeedBackButton {...feedback_props} />}
            {answer_url && <ShareAnswer answer_url={answer_url} />}
        </View>
    )

}


export default ShareFeedback