import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type CheckMarkCircleProps = {
  isChecked: boolean;
};

const CheckMarkCircle = ({ isChecked }: CheckMarkCircleProps) => {
  return (
    <View style={styles.circle}>
      {isChecked && <Text style={styles.checkMark}>✓</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: 'rgba(113, 113, 113, 0.1)',
    shadowColor: 'rgba(113, 113, 113, 0.1)',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    color: 'rgba(99, 60, 239, 1)',
    fontSize: 20,
    fontWeight: "bold"
  },
});

export default CheckMarkCircle;
