import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import Auth from './Auth';
import MindStamp from './MindStamp';
import CheckoutRegister from './CheckoutRegister';
import PurchaseWrapper from './PurchaseWrapper';

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

export default App;
