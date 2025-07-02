import { conversionFactors } from "./constants";
import { EUnitCategory } from "./types";

// Temperature conversion requires different formulas
const convertTemperature = (value: number, from: string, to: string): number => {
    if (from === to) return value;
    let celsius: number;
    switch (from) {
      case "°C":
        celsius = value;
        break;
      case "°F":
        celsius = (value - 32) * (5 / 9);
        break;
      case "K":
        celsius = value - 273.15;
        break;
      default:
        throw new Error(`Unsupported temperature unit: ${from}`);
    }

    switch (to) {
      case "°C":
        return celsius;
      case "°F":
        return celsius * (9 / 5) + 32;
      case "K":
        return celsius + 273.15;
      default:
        throw new Error(`Unsupported temperature unit: ${to}`);
    }
  };

export const convertUnit = (value: number, from: string, to: string, category: EUnitCategory): number => {
    if (category === EUnitCategory.TEMPERATURE) {
      return convertTemperature(value, from, to);
    }

    const unitMap = conversionFactors[category];
    if(!unitMap) return value;
    // Convert to base unit, then to target unit
    return (value * unitMap[from]) / unitMap[to];
  };
