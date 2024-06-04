const inputStyles = {
    base: {
        color: '#ffffff',
        background: '#000000',
    },
    error: {
        color: '#f87171',
        background: '#000000',
    },
    placeholder: {
        color: '#ffffff',
        background: '#000000',
    },
    validated: {
        color: '#ffffff',
        background: '#000000',
    },
}

export const adyenConfiguration = {
    paymentMethodsConfiguration: {
        card: {
            styles: inputStyles
        },
    },
    locale: "en-US",
    translations: {
        "en-US": {
            "confirmPreauthorization": "Start Watching",
        }
    }
};