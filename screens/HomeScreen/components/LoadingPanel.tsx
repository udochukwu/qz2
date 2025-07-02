import { StyleSheet } from "react-native";
import LoadingBlock from "../../../components/Blocks/LoadingBlock";
import { SwipeablePanel } from "../../../components/SwipeablePanel/Panel"
import { VisionContinue } from "./VisionContinue";

type visionFlowProps = {
  isVisionFlow: boolean;
  images_uri: string[];
  onContinue: () => void;
  onUpgrade: () => void;
  showWarningModal: boolean;
}
type Props = {
  onClose: () => void;
  isActive: boolean;
  visionFlow: visionFlowProps,
}

export const LoadingPanel = ({ onClose, isActive, visionFlow }: Props) => {
 
  return (
 
      <SwipeablePanel
          fullWidth={true}
          openLarge={true}
          onlyLarge={true}
          showCloseButton={false}
          noScroll={true}
          closeOnTouchOutside={true}
          onClose={onClose}
          isActive={isActive}
          style={{ ...styles.SwipeablePanel, opacity: visionFlow.showWarningModal ? 0 : 1 }}
      >
        {visionFlow.isVisionFlow ? <VisionContinue images_uri={visionFlow.images_uri} onContinue={visionFlow.onContinue} onUpgrade={visionFlow.onUpgrade} /> : <LoadingBlock step={1} />}
      </SwipeablePanel>
   
  )
}

const styles = StyleSheet.create({
  SwipeablePanel: {
    flex: 1,
    padding: 10,
    height: '70%',
    paddingTop: 10,
    zIndex: 5,
    backgroundColor: '#F9F8F8'
  },
});
