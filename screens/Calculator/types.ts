import { ReactElement } from "react";
import { ImageProps } from "react-native";

export enum CALCULATOR_MODE {
    SCIENTIFIC = 0,
    CONVERTER = 1
}

export type CalculatorBTN = {
    value: string;
    display?: string;
    label: string  | ReactElement;
    isNumeric?: boolean;
    isBasicOperation?: boolean;
    isHistoryKey?: boolean;
    icon?: ImageProps;
}

export interface MeasurementUnit {
    name: string;
    short_name: string;
    category: EUnitCategory
}

export enum EUnitCategory {
    LENGTH = "Length",
    AREA = "Area",
    VOLUME = "Volume",
    SPEED = "Speed",
    WEIGHT = "Weight",
    TIME = "Time",
    TEMPERATURE = "Temperature",
    ANGLE = "Angle",
    ACCELERATION = "Acceleration"
}

export interface MeasurementUnitObject {
    name: EUnitCategory;
    displayName: string;
    icon: ImageProps;
    units: MeasurementUnit[]
}
