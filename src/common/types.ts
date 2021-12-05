export type alertType = "above" | "below";

export interface alertInterface {
    numericalId: number,
    id: string,
    currency: string,
    price: number,
    type: alertType,
    met: boolean,
    symbol: string,
}

export interface priceDataInterface {
    [key: string]: {
        id: string,
        price: number,
        symbol: string,
        name: string,
        isDisplayed: boolean,
    }
}

export interface currencyDataInterface {
    [key: string]: number
}