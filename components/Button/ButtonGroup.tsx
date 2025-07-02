import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, {  useState } from 'react';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface ButtonGroupProps {
  labels: string[];
  onPress: (index: number) => void;
  selectedIndex: number;
}

export default function ButtonGroup({ labels, selectedIndex, onPress }: ButtonGroupProps) {
  const [itemWidths, setItemWidths] = useState<number[]>([]);
  const [_, setContainerWidth] = useState(0);

  const handleLayout = (event: any, index: number) => {
    const { width } = event.nativeEvent.layout;
    setItemWidths((prev) => {
      const next = [...prev];
      next[index] = width;
      return next;
    });
  };

  const rStyle = useAnimatedStyle(() => {
    if (itemWidths.length === 0) return {};

    const horizontalPadding = 6; // optional extra padding
    const left = itemWidths.slice(0, selectedIndex).reduce((sum, w) => sum + w, 0);

    return {
      left: withTiming(left + horizontalPadding),
      width: withTiming(itemWidths[selectedIndex] - horizontalPadding ),
    };
  }, [itemWidths, selectedIndex]);

  return (
    <View
      style={[styles.containerView]}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {labels.map((label, index) => (
        <Pressable
          onPress={() => onPress(index)}
          style={[styles.center, { paddingHorizontal: 12, paddingVertical: 4 }]}
          key={index}
          onLayout={(e) => handleLayout(e, index)}
        >
          <Text
            style={{
              color: selectedIndex === index ? "#000000" : "#64646499",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {label}
          </Text>
        </Pressable>
      ))}
      {itemWidths.length === labels.length && (
        <Animated.View
          style={[styles.sliderView, rStyle]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerView: {
    flexDirection: 'row',
    backgroundColor: "#EDEDED",
    borderRadius: 8,
    padding: 3,
    alignItems: "center",
    justifyContent: 'flex-start', // important
    overflow: 'hidden',
  },
  sliderView: {
    position: 'absolute',
    zIndex: -2,
    backgroundColor: "#FFF",
    height: "100%",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  center: {
    justifyContent: "center",
    alignItems: 'center',
  },
});