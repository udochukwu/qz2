import { API } from "../API";
import { storage } from "./storage";
import { VERSION } from "../constants";
import * as RNLocalize from "react-native-localize";
import analytics, { firebase } from '@react-native-firebase/analytics';
import * as Sentry from "@sentry/react-native";
import branch, { BranchEvent } from "react-native-branch";
const deviceLanguage = RNLocalize.getLocales()[0].languageCode;
const timezone = RNLocalize.getTimeZone();
//return response as json
export const FetchAddUser = async (user_id: string) => {
    console.log("Fetching Add user")
    const ref_code = storage.getString("referral_code");
    const response = await fetch(API + '/v3/user/new', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Accept-Language': deviceLanguage
        },
        body: JSON.stringify({
            "user_id": user_id,
            "new_onboarding_steps":true,
            "new_onboarding_order":true,
            "timezone": timezone,
            "ref_code": ref_code
        })
    });
    if (response.status != 200) {
        console.log("error adding user");
        const json = await response.json();
        return json;
    }
    const json = await response.json();
    console.log("Fetching Add user ended")

    return json;
}
export const setExperiment = async (rc_experiment_group?: string) => {
    const session = await storage.getString("session_id");
    const fb_app_instance_id = await analytics().getAppInstanceId();
    const object_session = JSON.parse(session!);
    const token = object_session.session_token;
    let requestBody: any = {
        "timezone": timezone,
        'fb_app_instance_id': fb_app_instance_id,
    }
    if (rc_experiment_group) {
        requestBody.rc_experiment_group = rc_experiment_group;
    }
    const response = await fetch(API + '/user/experiment/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-tokens': token,
            'Accept-Language': deviceLanguage
        },
        body: JSON.stringify(requestBody)
    });
    if (response.status != 200) {
        ///console.log("error setting experiment");
        return
    }
    const json = await response.json();
    return json;
}
export const FetchLoginUser = async () => {
    const session = await storage.getString("session_id");
    const object_session = JSON.parse(session!);
    const token = object_session.session_token;

    let requestBody: any = {
        "timezone": timezone,
    };
    // Make the API call
    const response = await fetch(API + '/v3/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-tokens': token,
            'Accept-Language': deviceLanguage,
        },
        body: JSON.stringify(requestBody)
    });
    if (response.status != 200) {
        ///console.log("error login user");
        if (response.status === 403) {
            return "logout";
        }
        return;
    }
    const json = await response.json();
    return json;
}

export const FetchOnboardUser = async (field_name:string, options:string) => {
    try {
        const session = await storage.getString("session_id");
        const object_session = JSON.parse(session!);
        const token = object_session.session_token;
        firebase.analytics().setUserProperty(field_name, options);
        console.log(JSON.stringify({
            [field_name]: options
        }))
        if (field_name ==="school_type" && (options.toLocaleLowerCase().trim() === "college" || options.toLocaleLowerCase().trim() === "online degree" )) {
           const event_name= "school_type_college_or_online_degree"
           let event =  new BranchEvent(event_name)
           event.logEvent()
        }
        const response = await fetch(API + '/user/new/onboard', {
            method: 'POST',
            headers: {
                "x-access-tokens": token,
                "Content-Type": "application/json",
                "Accept-Language": deviceLanguage
            },
            body: JSON.stringify({
                [field_name]: options
            })
        })
        if (response.status != 200) {

            return
        }
        const json = await response.json();

        return json;
    }
    catch (error) {
        return;
    }
}

export const FetchAddReferral = async (ref_code: string) => {
    try {
        const session = await storage.getString("session_id");
        const object_session = JSON.parse(session!);
        const token = object_session.session_token;
        const response = await fetch(API + '/v3/user/referral/add', {
            method: 'POST',
            headers: {
                "x-access-tokens": token,
                "Content-Type": "application/json",
                "Accept-Language": deviceLanguage
            },
            body: JSON.stringify({
                "ref_code": ref_code
            })
        })
        if (response.status != 200) {
            ///console.log("error adding referral");
            return
        }
        const json = await response.json();
        return json;
    }
    catch (error) {
        ///console.log("error adding referral");
        ///console.log(error)
        return;
    }
}


export const FetchGenerateReferral = async () => {
    try {
        const session = await storage.getString("session_id");
        const object_session = JSON.parse(session!);
        const token = object_session.session_token;
        const response = await fetch(API + '/v3/user/referral/generate', {
            method: 'GET',
            headers: {
                "x-access-tokens": token,
                "Content-Type": "application/json",
                "Accept-Language": deviceLanguage
            }
        })
        if (response.status != 200) {
            ///console.log("error generating referral");
            return
        }
        const json = await response.json();
        return json;
    }
    catch (error) {
        ///console.log("error generating referral");
        ///console.log(error)
        return;
    }
}

export const FetchGetBalance = async () => {
    const maxRetries = 3
    const retryDelay = 2000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const session = await storage.getString("session_id");
            const object_session = JSON.parse(session!);
            const token = object_session.session_token;
            const response = await fetch(API + '/v3/user/token/balance', {
                method: 'GET',
                headers: {
                    "x-access-tokens": token,
                    "Content-Type": "application/json"
                }
            });

            if (response.status != 200) {
                if (attempt < maxRetries) {
                    await new Promise<void>(resolve => setTimeout(() => resolve(), retryDelay));
                    continue;
                }
                return;
            }

            const json = await response.json();
            return json; // Return the result if successful
        } catch (error) {
            if (attempt >= maxRetries) {
                return; // Max retries reached, return without result
            }
            await new Promise<void>(resolve => setTimeout(() => resolve(), retryDelay));
        }
    }
};


export const FetchClaimTokens = async (claim_type: string) => {
    try {
        const session = await storage.getString("session_id");
        const object_session = JSON.parse(session!);
        const token = object_session.session_token;
        const response = await fetch(API + '/v3/user/token/claim', {
            method: 'POST',
            headers: {
                "x-access-tokens": token,
                "Content-Type": "application/json",
                "Accept-Language": deviceLanguage
            },
            body: JSON.stringify({
                "claim_type": claim_type
            })
        })
        if (response.status != 200) {
            ///console.log("error claiming balance");
            return
        }
        const json = await response.json();
        return json;
    }
    catch (error) {
        ///console.log("error claiming balance");
        ///console.log(error)
        return;
    }
}

export const FetchAskQuestion = async (question, is_pro, base64) => {
    const session = await storage.getString("session_id");
    const object_session = JSON.parse(session!);
    const token = object_session.session_token;


    try {
        const response = await fetch(API + '/v3/problem/answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-tokens': token,
                'Accept-Language': deviceLanguage
            },
            body: JSON.stringify({
                "problem_data": question,
                "app_version": VERSION,
                "is_pro": is_pro,
                "base64_image": base64
            })
        });
        if (response.status == 500) {
            //TODO: Implement retry
            return
        }

        const json = await response.json();
        return json;
    }
    catch (error) {
        ///console.log("error asking question");
        ///console.log(error)
        return;
    }
}


export const FetchGetQuestion = async (problem_id) => {
    const session = await storage.getString("session_id");
    const object_session = JSON.parse(session!);
    const token = object_session.session_token;
    ///console.log("fetching question")

    //response
    //     When error:
    // {"error": "Problem failed answering"}, 400
    // Still waiting:
    // {"status": 0,"time_remaining":time}), 200
    // Answering:
    // {"status": 1, "time_remaining":time}, 200
    // Done:
    // {"status": 2, "question": response }
    //
    ///console.log(API + '/problem/answer/' + problem_id)
    try {
        const response = await fetch(API + '/v2/problem/answer/' + problem_id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-tokens': token,
                'Accept-Language': deviceLanguage
            }
        });
        if (response.status == 400) {
            ///console.log("error getting question");
            const json = await response.json();
            return json;
        }
        //return
        if (response.status != 200) {
            ///console.log("error getting question");
            return
        }
        const json = await response.json();
        console.log(json)

        return json;
    }
    catch (error) {
        ///console.log("error getting question");
        ///console.log(error)
        return;
    }
}

export const FetchBoostQuestion = async (problem_id) => {
    const session = await storage.getString("session_id");
    const object_session = JSON.parse(session!);
    const token = object_session.session_token;
    ///console.log("boosting question")

    try {
        const response = await fetch(API + '/problem/answer/boost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-tokens': token,
                'Accept-Language': deviceLanguage
            },
            body: JSON.stringify({
                "problem_id": problem_id,
            })
        });
        if (response.status == 400) {
            ///console.log("error boosting question");
            ///console.log(response)

            return
        }
        if (response.status != 200) {
            ///console.log("error boosting question");
            ///console.log(response)
            return
        }
        const json = await response.json();
        return json;
    }
    catch (error) {
        ///console.log("error boosting question");
        ///console.log(error)
        return;
    }
}

// OUTPUT
export const FetchFollowupQuestion = async (request_id, question, is_pro) => {
    const session = await storage.getString("session_id");
    const object_session = JSON.parse(session!);
    const token = object_session.session_token;

    try {
        const response = await fetch(API + '/problem/followup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-tokens': token,
                'Accept-Language': deviceLanguage
            },
            body: JSON.stringify({
                "follow_up_question": question,
                "request_id": request_id,
                "is_pro": is_pro,
                "app_version": VERSION
            })
        });
        if (response.status == 400) {


            return
        }
        if (response.status != 200) {
            // console.log("error following up question");
            // console.log(response)
            return
        }
        const json = await response.json();
        return json;
    }
    catch (error) {
        ///console.log("error following up question");
        ///console.log(error)
        return;
    }

}



export const FetchGetHistory = async (is_pro) => {
    //user/history
    const session = await storage.getString("session_id");
    const object_session = JSON.parse(session!);
    const token = object_session.session_token;
    ///console.log("getting history")

    try {
        const response = await fetch(API + '/v2/user/history', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-tokens': token,
                'is_pro': is_pro,
                'Accept-Language': deviceLanguage
            }
        });
        if (response.status != 200) {
            ///console.log("error getting history");
            return
        }
        const json = await response.json();
        return json;
    }
    catch (error) {
        ///console.log("error getting history");
        ///console.log(error)
        return;
    }
}


///problem/feedback
//feedback : /* 0 for none,1 for success,2 for failure */

export const FetchFeedback = async (problem_id, feedback) => {
    const session = await storage.getString("session_id");
    const object_session = JSON.parse(session!);
    const token = object_session.session_token;

    try {
        const response = await fetch(API + '/problem/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-tokens': token,
            },
            body: JSON.stringify({
                "problem_id": problem_id,
                "feedback": feedback,
            })
        });
        if (response.status != 200) {
            ///console.log("error feedback");
            ///console.log(response)
            return
        }
        const json = await response.json();
        return json;
    }
    catch (error) {
        ///console.log("error feedback");
        ///console.log(error)
        return;
    }
}

//button_clicked : int
export const FetchLogAdResponse = async (num, problem_id) => {
    const session = await storage.getString("session_id");
    const object_session = JSON.parse(session!);
    const token = object_session.session_token;
    try {
        const response = await fetch(API + '/user/ad/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-tokens': token,
            },
            body: JSON.stringify({
                "button_clicked": num,
                "problem_id": problem_id,
            })
        });
        if (response.status != 200) {
            //console.log("error log ad response");
            ///console.log(response)
            return
        }
        const json = await response.json();
        return json;
    }
    catch (error) {
        //console.log("error log ad response");
        ///console.log(error)
        return;
    }
}


export const FetchFillUnsubReason = async (reason) => {
    ///user/unsubscribe/log
    // {"unsubscribe_reason":["Mike is a douchebag","Other"]}
    const session = await storage.getString("session_id");
    const object_session = JSON.parse(session!);
    const token = object_session.session_token;
    try {
        const response = await fetch(API + '/user/unsubscribe/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-tokens': token,
                'Accept-Language': deviceLanguage
            },
            body: JSON.stringify({
                "unsubscribe_reason": reason,
            })
        });
        if (response.status != 200) {
            //console.log("error log ad response");
            ///console.log(response)
            return
        }
        const json = await response.json();
        return json;
    }
    catch (error) {
        //console.log("error log ad response");
        ///console.log(error)
        return;
    }
}

///device-linking/new 
// response: {
//   "code": "<6-chars>",
//   "expires_at": "<iso-format>"
// }
export const FetchDeviceLinkingCode = async (): Promise<{ code: string, expires_at: string } | undefined> => {
    const session = await storage.getString("session_id");
    const object_session = JSON.parse(session!);
    const token = object_session.session_token;
    try {
        const response = await fetch(API + '/device-linking/new', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-tokens': token,
            }
        });
        if (response.status != 200) {
            return
        }
        const json = await response.json();
        return json;
    }
    catch (error) {
        Sentry.captureException(error);
        return
    }
}

// Define interface for the price info response
interface PriceInfo {
    currency: string;
    price_id: string;
    product_name: string;
    recurring_interval: 'day' | 'week' | 'month' | 'year';
    recurring_interval_count: number;
    trial_period_days: number | null;
    type: 'recurring' | 'one_time';
    eligible_for_trial: boolean;
    unit_amount: number;
}

export const FetchGetPrices = async (price_id: string): Promise<PriceInfo | undefined> => {
    try {
        const session = await storage.getString("session_id");
        const object_session = JSON.parse(session!);
        const token = object_session.session_token;
        
        const response = await fetch(`${API}/price-info?price_id=${price_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-tokens': token,
                'Accept-Language': deviceLanguage
            }
        });
        
        if (response.status !== 200) {
            console.log("Error getting price info");
            return;
        }
        
        const json = await response.json();
        return json as PriceInfo;
    } catch (error) {
        console.log("Error getting price info");
        console.log(error);
        Sentry.captureException(error);
        return;
    }
}

// post /user/subscription/manage returns recirect_url
export const FetchManageSubscription = async () => {
    const session = await storage.getString("session_id");
    const object_session = JSON.parse(session!);
    const token = object_session.session_token;
    const response = await fetch(API + '/user/subscription/manage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-tokens': token,
        }
    });
    if (response.status != 200) {
        return
    }
    const json = await response.json();
    return json;
}