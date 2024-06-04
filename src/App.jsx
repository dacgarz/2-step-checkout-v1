import {Auth, store} from "@cleeng/mediastore-sdk";
import {Provider} from "react-redux";

import "@adyen/adyen-web/dist/adyen.css";
import "react-loading-skeleton/dist/skeleton.css";
import CheckoutRegister from "./components/CheckoutRegister.jsx";
import {useEffect, useState} from "react";
import {MindStamp} from "./components/MindStamp.jsx";
import PurchaseWrapper from "./components/PurchaseWrapper.jsx";

function App(props) {
    const [checkoutStep, setCheckoutStep] = useState('register');
    const cleengOfferId = props.moduleSettings['cleeng_offer_id'];
    const marketingChannel = props.moduleSettings['marketing_channel'];
    const promoCode = props.moduleSettings.hasOwnProperty('cleeng_promo_code') ? props.moduleSettings['cleeng_promo_code'] : undefined;

    useEffect(() => {
        if (Auth.isLogged()) {
            Auth.logout();
        }
    }, []);

    return (
        <Provider store={store}>
            {checkoutStep === 'mindstamp' && <MindStamp onClose={() => {
                window.scrollTo(0, 0);
                setCheckoutStep('register');
            }}/>}
            {checkoutStep === 'register' && <CheckoutRegister
                showCleengCapture={!!props.moduleSettings.capture}
                publisherId={'686320448'}
                onSuccess={() => {
                    window.scrollTo(0, 0);
                    setCheckoutStep('checkout');
                }}
                welcomeBannerUrl={props.urls.welcomeBannerUrl}
            />}
            {checkoutStep === 'checkout' && <PurchaseWrapper cleengOfferId={cleengOfferId} promoCode={promoCode} marketingChannel={marketingChannel} />}
        </Provider>
    );
}

export default App
