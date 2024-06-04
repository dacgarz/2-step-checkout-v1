import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.scss'
import "./libs/lity.min.css";
import {Config} from "@cleeng/mediastore-sdk";
import {initializeCleengConfig} from "./utilities/initializeCleengConfig.js";
import logoUrl from "./assets/DOGTV-Logo-White-Cropped.png";
import welcomeBannerUrl from "./assets/WelcomePackBanner.jpg";

const targetModulesData = document.querySelectorAll(
    '.cleeng-checkout > script[type="application/json"]',
);

initializeCleengConfig();

const createLogoStyle = (logoUrl) => {
    const style = document.createElement('style');
    style.innerHTML = `
    .msd__header .msd__header__logo {
      background-image: url(${logoUrl});
    }
  `;
    document.head.appendChild(style);
};

const createNavStyle = () => {
    const style = document.createElement('style');
    style.innerHTML = `
    header.header {
      display: none;
    }
  `;
    document.head.appendChild(style);
}

const createBackgroundStyle = () => {
    const style = document.createElement('style');
    style.innerHTML = `
    body {
        background-color: black;
        color: white;
    }
  `;
    document.head.appendChild(style);
}

targetModulesData.forEach(({dataset, textContent}) => {
    const moduleSettings = JSON.parse(textContent);
    Config.setOffer(moduleSettings['cleeng_offer_id']);

    const urls = {
        logoUrl: dataset['logoUrl'] ? dataset['logoUrl'] : logoUrl,
        welcomeBannerUrl: dataset['welcomeBannerUrl'] ? dataset['welcomeBannerUrl'] : welcomeBannerUrl,
    };
    initializeCleengConfig(urls.logoUrl);

    createLogoStyle(urls.logoUrl);

    if (moduleSettings['hide_nav']) {
        createNavStyle();
    }

    if (moduleSettings['page_black']) {
        createBackgroundStyle();
    }


    const root = document.getElementById(`App--${dataset.moduleInstance}`);
    return ReactDOM.createRoot(root).render(
        <React.StrictMode>
            <App
                moduleInstance={dataset.moduleInstance}
                moduleType={dataset.moduleType}
                moduleSettings={JSON.parse(textContent)}
                urls={urls}
            />
        </React.StrictMode>,
    );
});