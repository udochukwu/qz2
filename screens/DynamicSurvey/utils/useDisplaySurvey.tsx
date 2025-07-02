import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useEffect } from "react";
import { canDisplaySurvey } from "../../../services/storage";
import { getDynamicSurvey } from "../../../services/api/dynamicSurvey";


export const useDisplaySurvey = (navigation: NavigationProp<ParamListBase>) =>
  useEffect(() => {
    (async () => {
      if (!canDisplaySurvey()) {
          return;
      }
      const response = await getDynamicSurvey();
      if (response.data.survey !== null) {
          navigation.navigate("DynamicSurvey", response.data.survey);
      }
    })();
  }, []);
