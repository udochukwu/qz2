import { StyleSheet } from "react-native";

export const textStyles = StyleSheet.create({
  primaryText: {
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 30,
    lineHeight: 37,
  },
  descriptionText: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 17,
    lineHeight: 23,
    textAlign: 'center',
  },
  questionText: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 26,
  },
  errorText: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 14,
    color: "#F04A00",
    lineHeight: 23,
  },
  nunitoFont: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
  },
  input: {
    minHeight: 60,
    borderWidth: 1,
    borderColor: '#CECECE',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 10,
    color: '#606060',
    fontWeight: '400',
    fontFamily: 'Inter',
  }
})

export const inputStyles = StyleSheet.create({
  numberInput: {
    fontFamily: 'Nunito',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 19,
    color: "#3D3D3D"
  },
});

export const commonStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  maxContent: {
    flex: 1,
    backgroundColor: '#fff',
  }
});
