import { Config } from "@cleeng/mediastore-sdk";

export const initializeCleengConfig = (logoUrl) => {
  Config.setEnvironment("production");
  Config.setPublisher("686320448");
  Config.setMyAccountUrl("https://watch.dogtv.com/settings/account");
  Config.setVisibleAdyenPaymentMethods(["card"]); // array of presented payment methods
  Config.setHidePayPal();
  // Config.setTheme({
  //   backgroundColor: "black",
  //   fontColor: "white",
  //   loaderColor: "white",
  //   errorColor: "white", // 'red' or '#ff8016'
  //   primaryColor: "#ff8016",
  //   successColor: "#ff8016",
  //   secondaryColor: "#3d67a8",
  //   logoUrl,
  // });
};
