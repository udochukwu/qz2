//feeback buttons like and dislike for the user to give feedback

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

import InAppReview from 'react-native-in-app-review';
import { FetchFeedback } from '../../../services/backendCalls';
import { giveFeedback, storage } from '../../../services/storage';

export const inAppReviewHandler = async () => {
    try {
        if (!InAppReview.isAvailable()) {
            console.log('InAppReview is not available');
            return false;
        }
        //check first in storage if user already give feedback or not
        let feedback = storage.getString('feedback-data')
        let feedbackData;
        if (!feedback) {
            // console.log('no feedback data');
            // first time pressing like 
            feedbackData = { date: new Date().getTime() - 36 * 24 * 60 * 60 * 1000 };
            storage.set('feedback-data', JSON.stringify(feedbackData));
            feedback = JSON.stringify(feedbackData);
        } else {
            feedbackData = JSON.parse(feedback);
        }

        // check the last time user was requested to give feedback and if it was more than 35 days ago
        if (feedbackData && feedbackData.date && new Date().getTime() - feedbackData.date > 35 * 24 * 60 * 60 * 1000) {
            try {
                const hasFlowFinishedSuccessfully = await InAppReview.RequestInAppReview()
                if (hasFlowFinishedSuccessfully) {
                    console.log('request of feedback is done');
                    storage.set('feedback-data', JSON.stringify({ date: new Date().getTime() }));
                    return true;
                }
                return false;
            } catch (error) {
                console.log('error in requesting feedback', error);
                return false;
            }
        }
        return false;
    } catch (error) {
        return false;
    }

}
export type FeedbackProps = {
    request_id: string,
    feedback: number,
    likes: number,
    dislikes: number
}
function FeedBackButton({ request_id, feedback, likes = 0, dislikes = 0 }: FeedbackProps) {
    const [like, setLike] = useState(feedback === 1);
    const [dislike, setDislike] = useState(feedback === 2);
    const [likesCount, setLikesCount] = useState(likes);
    const [dislikesCount, setDislikesCount] = useState(dislikes);


    const handleLike = async () => {
        if (like) {
            setLikesCount(likesCount - 1);

        }
        else {
            setLikesCount(likesCount + 1);
        }
        if (dislike) {
            setDislikesCount(dislikesCount - 1);
        }
        setLike(!like);
        setDislike(false);


        inAppReviewHandler();
        await FetchFeedback(request_id, 1)
    }

    const handleDislike = () => {
        if (dislike) {
            setDislikesCount(dislikesCount - 1);
        }
        else {
            setDislikesCount(dislikesCount + 1);
        }
        if (like) {
            setLikesCount(likesCount - 1);
        }
        setDislike(!dislike);
        setLike(false);
        FetchFeedback(request_id, 2)
    }

    return (

        <View style={styles.buttons} >
            <TouchableOpacity style={styles.leftButtonContainer} onPress={handleLike}>
                <Image style={{ ...styles.like, tintColor: like ? '#379259' : '#6D6D6D' }} source={require('../../../assets/like.png')} />
                <Text style={{ ...styles.counter, color: like ? '#379259' : '#6D6D6D' }}> {likesCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rightButtonContainer} onPress={handleDislike}>
                <Image style={{ ...styles.dislike, tintColor: dislike ? '#FF3B30' : '#6D6D6D' }} source={require('../../../assets/like.png')} />
                <Text style={{ ...styles.counter, color: dislike ? '#FF3B30' : '#6D6D6D' }}> {dislikesCount}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({

    buttons: {
        flexDirection: 'row',
        //i dont want any space between buttons
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    leftButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginRight: 10,
        height: 24,


    },
    rightButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 24,
        marginRight: 10,
    },
    like: {
        width: 18,
        height: 18,
        tintColor: '#A0A0A0',
    },
    dislike: {
        width: 18,
        height: 18,
        tintColor: '#A0A0A0',
        transform: [{ rotate: '180deg' }, { scaleX: -1 }],
    },
    counter: {
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 13,
        lineHeight: 16,

    }
})

export default FeedBackButton;