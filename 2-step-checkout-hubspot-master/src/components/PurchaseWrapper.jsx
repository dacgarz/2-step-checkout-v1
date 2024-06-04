import {Purchase} from "@cleeng/mediastore-sdk";

import "@adyen/adyen-web/dist/adyen.css";
import "react-loading-skeleton/dist/skeleton.css";
import {useEffect} from "react";
import {adyenConfiguration} from "../adyenConfiguration.js";
import {useAppSelector} from "@cleeng/mediastore-sdk/dist/redux/store.js";
import {hashSHA256} from "../utilities/hashSHA256.js";

function PurchaseWrapper(props) {
    const order = useAppSelector(state => state.order);

    const getEventData = async () => {
        const hasCoupon = order.couponDetails.messageType === 'success';

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'actionBuy',
            // Accedo compatibility
            eventModel: {
                priceCurrency: order.order.currency,
                price: order.order.priceBreakdown.discountedPrice,
                transactionId: order.order.id,
            },
            couponCode: hasCoupon ? order.couponDetails.couponCode : null,
            wholeOrderDiscount: hasCoupon ? order.order.priceBreakdown.discountAmount : 0,
            customerId: order.order.customerId,
            emailHash: await hashSHA256(order.order.customer.email.trim().toLowerCase()),
            orderSubtotal: order.order.priceBreakdown.discountedPrice,
            currency: order.order.currency,
            marketingChannel: props.marketingChannel,
        });
    }

    const onPurchaseComplete = async () => {
        await getEventData();
        window.location.href = 'https://pages.dogtv.com/subscriptionthankyou';
    }

    const conditionallyDisplayDisclaimer = () => {
        const input = document.querySelector('.msd__coupon-input__wrapper input');
        const offerTitle = document.querySelector('.msd__checkout-card-text__title');
        if (!offerTitle) return;
        if (input && input.value) {
            offerTitle.innerHTML = offerTitle.innerHTML.replace('+ 7-day free trial', '(Using a coupon code starts your subscription immediately)');
        } else {
            offerTitle.innerHTML = offerTitle.innerHTML.replace('<br> Using a coupon code starts your subscription immediately.', '+ 7-day free trial');
        }
    }

    useEffect(() => {
        let interval = setInterval(() => {
            conditionallyDisplayDisclaimer();
        }, 333);
        return () => {
            clearInterval(interval);
        }
    }, []);

    return (
        <div className={'checkout-wrapper'}>
            <Purchase offerId={props.cleengOfferId} couponCode={props.promoCode} onSuccess={async () => {await onPurchaseComplete()}} adyenConfiguration={adyenConfiguration}/>
        </div>
    );
}

export default PurchaseWrapper;
