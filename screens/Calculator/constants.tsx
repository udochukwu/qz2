import { CalculatorBTN, EUnitCategory, MeasurementUnitObject } from "./types";
import images from "../../assets/images";
import { t } from "i18next";

// Function to filter out units without conversion factors
export const filterUnitsWithoutFactors = (units: MeasurementUnitObject[], factors: Record<EUnitCategory, Record<string, number>>): MeasurementUnitObject[] => {
  return units.map(category => {
    if (category.name === EUnitCategory.TEMPERATURE) return category;
    
    const categoryFactors = factors[category.name];
    if (!categoryFactors) return category;
    
    return {
      ...category,
      units: category.units.filter(unit => unit.short_name in categoryFactors)
    };
  });
};

export const scientificBtns: CalculatorBTN[] = [
    {
        label: "nCr",
        value: "C\\frac{\\placeholder{n}}{\\placeholder{r}}"
    },
    {
        label: "nPr",
        value: "P\\frac{\\placeholder{n}}{\\placeholder{r}}"
    },
    {
        label: "",
        value: "left",
        icon: images["arrow-left"]
    },
    {
        label: "",
        value: "right",
        icon: images["arrow-right"]
    },
    { label:"", value: "sd", icon: images.sd },
    { label: "Rad", value: "rad" },
    { label: "e", value: "e" },
    { label: "ln", value: "\\ln" },
    { label: "log₁₀", value: "\\log_{10} \\left( \\placeholder{} \\right)" },
    { label: "", value: "\\log_{\\placeholder{}} \\left( {} \\right)", icon: images.log },
    { label: "()", value: "(\\placeholder{})" },
    { label: "| |", value: "\\left| {\\placeholder{}} \\right|" },
    { label: "sin", value: "\\sin \\left( \\placeholder{} \\right)" },
    { label: "cos", value: "\\cos \\left( \\placeholder{} \\right)" },
    { label: "tan", value: "\\tan \\left( \\placeholder{} \\right)" },
    { label: "π", value: "\\pi" },
    { label: "x!", value: "!" },
    {label: "", value: "mth_pwr", icon: images.math_pwr},
    {label: "", value: "deg", icon: images.degree},
    {label: "", value: "\\frac", icon: images.fraction},
    {label: "", value: "pwr", icon: images.pwr2},
    {label: "", value: "\\sqrt{{\\placeholder{}}}", icon: images.sqrt},
    {label: "", value: "\\sqrt[3]{\\placeholder{}}", icon: images.cbrt},
    {label: "", value: "\\sqrt[\\placeholder{}]{\\placeholder{}}", icon: images.root},
]

export const converterBtns: CalculatorBTN[] = [

    {label: "AC",value: "AC", icon: images.delete},
    {label: "±",value: "pm"},
    { label: "%",value: "%"},
    { label: "÷", value: "÷", isBasicOperation: true },
    { label: "7", value: "7", isNumeric: true },
    { label: "8", value: "8", isNumeric: true },
    { label: "9", value: "9", isNumeric: true },
    { label: "×", value: "\\times", isBasicOperation: true },
    { label: "4", value: "4", isNumeric: true },
    { label: "5", value: "5", isNumeric: true },
    { label: "6", value: "6", isNumeric: true },
    { label: "-", value: "-" , isBasicOperation: true},
    { label: "1", value: "1", isNumeric: true },
    { label: "2", value: "2", isNumeric: true },
    { label: "3", value: "3", isNumeric: true },
    { label: "+", value: "+", isBasicOperation: true },
    {label: "", value: "history", isHistoryKey: true, icon: images["history-circle"]},
    { label: "0", value: "0", isNumeric: true },
    { label: ".", value: ".", isNumeric: true },
    { label: "=", value: "=", isBasicOperation: true},
]

export const calculatorBasicBtns: CalculatorBTN[] = [
    {label: "", value: "Backspace", icon: images.delete},
    ...converterBtns.slice(1)
]

export const conversionFactors: Record<EUnitCategory, Record<string, number>> = {
    [EUnitCategory.LENGTH]: {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      µm: 1e-6,
      nm: 1e-9,
      mi: 1609.34,
      yd: 0.9144,
      ft: 0.3048,
      in: 0.0254,
    },
    [EUnitCategory.AREA]: {
      "m²": 1,
      "km²": 1e6,
      "cm²": 0.0001,
      "mm²": 1e-6,
      "mi²": 2.59e6,
      "yd²": 0.836127,
      "ft²": 0.092903,
      "in²": 0.00064516,
      ac: 4046.86,
      ha: 10000,
    },
    [EUnitCategory.VOLUME]: {
      "m³": 1,
      "cm³": 1e-6,
      "mm³": 1e-9,
      L: 0.001,
      mL: 1e-6,
      "in³": 1.63871e-5,
      "ft³": 0.0283168,
      "yd³": 0.764555,
      gal: 0.00378541,
      pt: 0.000473176,
    },
    [EUnitCategory.SPEED]: {
      "m/s": 1,
      "km/h": 0.277778,
      mph: 0.44704,
      "ft/s": 0.3048,
      kn: 0.514444,
      Mach: 340.29,
      c: 299792458,
    },
    [EUnitCategory.WEIGHT]: {
      kg: 1,
      g: 0.001,
      mg: 1e-6,
      µg: 1e-9,
      lb: 0.453592,
      oz: 0.0283495,
      st: 6.35029,
      t: 1000,
      ton: 907.184,
      ct: 0.0002,
    },
    [EUnitCategory.TIME]: {
      s: 1,
      ms: 0.001,
      µs: 1e-6,
      min: 60,
      h: 3600,
      d: 86400,
      wk: 604800,
      mo: 2629746,
      yr: 31556952,
    },
    [EUnitCategory.TEMPERATURE]: {}, // Special handling needed
    [EUnitCategory.ANGLE]: {
      "°": 1,
      rad: 57.2958,
      gon: 0.9,
      arcmin: 1 / 60,
      arcsec: 1 / 3600,
      mrad: 0.0572958,
      tr: 360,
      qd: 90,
      rev: 360,
      oct: 45,
    },
    [EUnitCategory.ACCELERATION]: {
      "m/s²": 1,
      "km/h/s": 0.277778,
      "ft/s²": 0.3048,
      Gal: 0.01,
      g: 9.80665,
      "in/s²": 0.0254,
      "mph/s": 0.44704,
      "mm/s²": 0.001,
      "cm/s²": 0.01,
    },
  };

export const measurementUnits: MeasurementUnitObject[] = filterUnitsWithoutFactors([
    {
      name: EUnitCategory.LENGTH,
      displayName: t('calculator.units.length'),
      icon: images.ruler,
      units: [
        { name: t('calculator.units.meter'), short_name: "m", category: EUnitCategory.LENGTH },
        { name: 'random', short_name: "random", category: EUnitCategory.LENGTH },
        { name: t('calculator.units.kilometer'), short_name: "km", category: EUnitCategory.LENGTH },
        { name: t('calculator.units.centimeter'), short_name: "cm", category: EUnitCategory.LENGTH },
        { name: t('calculator.units.millimeter'), short_name: "mm", category: EUnitCategory.LENGTH },
        { name: t('calculator.units.micrometer'), short_name: "µm", category: EUnitCategory.LENGTH },
        { name: t('calculator.units.nanometer'), short_name: "nm", category: EUnitCategory.LENGTH },
        { name: t('calculator.units.mile'), short_name: "mi", category: EUnitCategory.LENGTH },
        { name: t('calculator.units.yard'), short_name: "yd", category: EUnitCategory.LENGTH },
        { name: t('calculator.units.foot'), short_name: "ft", category: EUnitCategory.LENGTH },
        { name: t('calculator.units.inch'), short_name: "in", category: EUnitCategory.LENGTH }
      ]
    },
    {
      name: EUnitCategory.AREA,
      displayName: t('calculator.units.area'),
      icon: images.area ,
      units: [
        { name: t('calculator.units.squareMeter'), short_name: "m²" , category: EUnitCategory.AREA },
        { name: t('calculator.units.squareKilometer'), short_name: "km²" , category: EUnitCategory.AREA },
        { name: t('calculator.units.squareCentimeter'), short_name: "cm²" , category: EUnitCategory.AREA },
        { name: t('calculator.units.squareMillimeter'), short_name: "mm²" , category: EUnitCategory.AREA },
        { name: t('calculator.units.squareMile'), short_name: "mi²" , category: EUnitCategory.AREA },
        { name: t('calculator.units.squareYard'), short_name: "yd²" , category: EUnitCategory.AREA },
        { name: t('calculator.units.squareFoot'), short_name: "ft²" , category: EUnitCategory.AREA },
        { name: t('calculator.units.squareInch'), short_name: "in²" , category: EUnitCategory.AREA },
        { name: t('calculator.units.acre'), short_name: "ac" , category: EUnitCategory.AREA },
        { name: t('calculator.units.hectare'), short_name: "ha" , category: EUnitCategory.AREA }
      ]
    },
    {
      name: EUnitCategory.VOLUME,
      displayName: t('calculator.units.volume'),
      icon: images.container,
      units: [
        { name: t('calculator.units.cubicMeter'), short_name: "m³", category: EUnitCategory.VOLUME },
        { name: t('calculator.units.cubicCentimeter'), short_name: "cm³", category: EUnitCategory.VOLUME },
        { name: t('calculator.units.cubicMillimeter'), short_name: "mm³", category: EUnitCategory.VOLUME },
        { name: t('calculator.units.liter'), short_name: "L", category: EUnitCategory.VOLUME },
        { name: t('calculator.units.milliliter'), short_name: "mL", category: EUnitCategory.VOLUME },
        { name: t('calculator.units.cubicInch'), short_name: "in³", category: EUnitCategory.VOLUME },
        { name: t('calculator.units.cubicFoot'), short_name: "ft³", category: EUnitCategory.VOLUME },
        { name: t('calculator.units.cubicYard'), short_name: "yd³", category: EUnitCategory.VOLUME },
        { name: t('calculator.units.gallonUs'), short_name: "gal", category: EUnitCategory.VOLUME },
        { name: t('calculator.units.pintUs'), short_name: "pt", category: EUnitCategory.VOLUME }
      ]
    },
    {
      name: EUnitCategory.SPEED,
      displayName: t('calculator.units.speed'),
      icon: images["zap-fast"],
      units: [
        { name: t('calculator.units.metersPerSecond'), short_name: "m/s", category: EUnitCategory.SPEED },
        { name: t('calculator.units.kilometersPerHour'), short_name: "km/h", category: EUnitCategory.SPEED },
        { name: t('calculator.units.milesPerHour'), short_name: "mph", category: EUnitCategory.SPEED },
        { name: t('calculator.units.feetPerSecond'), short_name: "ft/s", category: EUnitCategory.SPEED },
        { name: t('calculator.units.knots'), short_name: "kn", category: EUnitCategory.SPEED },
        { name: t('calculator.units.machSpeedOfSound'), short_name: "Mach", category: EUnitCategory.SPEED },
        { name: t('calculator.units.speedOfLight'), short_name: "c", category: EUnitCategory.SPEED }
      ]
    },
    {
      name: EUnitCategory.WEIGHT,
      displayName: t('calculator.units.weight'),
      icon: images.fitness,
      units: [
        { name: t('calculator.units.kilogram'), short_name: "kg", category: EUnitCategory.WEIGHT },
        { name: t('calculator.units.gram'), short_name: "g", category: EUnitCategory.WEIGHT },
        { name: t('calculator.units.milligram'), short_name: "mg", category: EUnitCategory.WEIGHT },
        { name: t('calculator.units.microgram'), short_name: "µg", category: EUnitCategory.WEIGHT },
        { name: t('calculator.units.pound'), short_name: "lb", category: EUnitCategory.WEIGHT },
        { name: t('calculator.units.ounce'), short_name: "oz", category: EUnitCategory.WEIGHT },
        { name: t('calculator.units.stone'), short_name: "st", category: EUnitCategory.WEIGHT },
        { name: t('calculator.units.tonMetric'), short_name: "t", category: EUnitCategory.WEIGHT },
        { name: t('calculator.units.tonUs'), short_name: "ton", category: EUnitCategory.WEIGHT },
        { name: t('calculator.units.carat'), short_name: "ct", category: EUnitCategory.WEIGHT }
      ]
    },
    {
      name: EUnitCategory.TIME,
      displayName: t('calculator.units.time'),
      icon: images.clock,
      units: [
        { name: t('calculator.units.second'), short_name: "s", category: EUnitCategory.TIME },
        { name: t('calculator.units.millisecond'), short_name: "ms", category: EUnitCategory.TIME },
        { name: t('calculator.units.microsecond'), short_name: "µs", category: EUnitCategory.TIME },
        { name: t('calculator.units.minute'), short_name: "min", category: EUnitCategory.TIME },
        { name: t('calculator.units.hour'), short_name: "h", category: EUnitCategory.TIME },
        { name: t('calculator.units.day'), short_name: "d", category: EUnitCategory.TIME },
        { name: t('calculator.units.week'), short_name: "wk", category: EUnitCategory.TIME },
        { name: t('calculator.units.month'), short_name: "mo", category: EUnitCategory.TIME },
        { name: t('calculator.units.year'), short_name: "yr", category: EUnitCategory.TIME }
      ]
    },
    {
      name: EUnitCategory.TEMPERATURE,
      displayName: t('calculator.units.temperature'),
      icon: images.temp,
      units: [
        { name: t('calculator.units.celsius'), short_name: "°C", category: EUnitCategory.TEMPERATURE },
        { name: t('calculator.units.fahrenheit'), short_name: "°F", category: EUnitCategory.TEMPERATURE },
        { name: t('calculator.units.kelvin'), short_name: "K", category: EUnitCategory.TEMPERATURE }
      ]
    },
    {
      name: EUnitCategory.ANGLE,
      displayName: t('calculator.units.angle'),
      icon:images.acute,
      units: [
        { name: t('calculator.units.degree'), short_name: "°", category: EUnitCategory.ANGLE },
        { name: t('calculator.units.radian'), short_name: "rad", category: EUnitCategory.ANGLE },
        { name: t('calculator.units.gradian'), short_name: "gon", category: EUnitCategory.ANGLE },
        { name: t('calculator.units.minuteOfArc'), short_name: "arcmin", category: EUnitCategory.ANGLE },
        { name: t('calculator.units.secondOfArc'), short_name: "arcsec", category: EUnitCategory.ANGLE },
        { name: t('calculator.units.milliradian'), short_name: "mrad", category: EUnitCategory.ANGLE },
        { name: t('calculator.units.turn'), short_name: "tr", category: EUnitCategory.ANGLE },
        { name: t('calculator.units.quadrant'), short_name: "qd", category: EUnitCategory.ANGLE },
        { name: t('calculator.units.revolution'), short_name: "rev", category: EUnitCategory.ANGLE },
        { name: t('calculator.units.octant'), short_name: "oct", category: EUnitCategory.ANGLE }
      ]
    },
    {
      name: EUnitCategory.ACCELERATION,
      displayName: t('calculator.units.acceleration'),
      icon: images.car,
      units: [
        { name: t('calculator.units.accelerationMetersPerSecondSquared'), short_name: "m/s²", category: EUnitCategory.ACCELERATION },
        { name: t('calculator.units.accelerationKilometersPerHourPerSecond'), short_name: "km/h/s", category: EUnitCategory.ACCELERATION },
        { name: t('calculator.units.accelerationFeetPerSecondSquared'), short_name: "ft/s²", category: EUnitCategory.ACCELERATION },
        { name: t('calculator.units.accelerationGalileo'), short_name: "Gal", category: EUnitCategory.ACCELERATION },
        { name: t('calculator.units.accelerationStandardGravity'), short_name: "g", category: EUnitCategory.ACCELERATION },
        { name: t('calculator.units.accelerationInchesPerSecondSquared'), short_name: "in/s²", category: EUnitCategory.ACCELERATION },
        { name: t('calculator.units.accelerationMilesPerHourPerSecond'), short_name: "mph/s", category: EUnitCategory.ACCELERATION },
        { name: t('calculator.units.accelerationMillimetersPerSecondSquared'), short_name: "mm/s²", category: EUnitCategory.ACCELERATION },
        { name: t('calculator.units.accelerationCentimetersPerSecondSquared'), short_name: "cm/s²", category: EUnitCategory.ACCELERATION }
      ]
    }
  ], conversionFactors);

