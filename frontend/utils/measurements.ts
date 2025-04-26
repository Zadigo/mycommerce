export type Measurement = 'cm' | 'in' | 'ft';

export interface MeasurementTranslation {
    short: string;
    long: string;
    longPlural: string;
}

export type MeasurementTranslations = Record<Measurement, MeasurementTranslation>

export const measurementTranslations: MeasurementTranslations = {
    cm: {
        short: 'cm',
        long: 'centimeter',
        longPlural: 'centimeters'
    },
    in: {
        short: 'in',
        long: 'inch',
        longPlural: 'inches'
    },
    ft: {
        short: 'ft',
        long: 'foot',
        longPlural: 'feet'
    }
}

export function formatMeasurement(value: number, unit: keyof typeof measurementTranslations, format: 'short' | 'long' | 'longPlural' = 'short') {
    return `${value} ${measurementTranslations[unit][format]}`
}

export function useFormatMeasurement() {
    return {
        formatMeasurement
    }
}
