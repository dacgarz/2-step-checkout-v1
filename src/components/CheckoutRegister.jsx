import Input from "@cleeng/mediastore-sdk/dist/components/Input";
import Consent from "@cleeng/mediastore-sdk/dist/components/Consents";
import Button from "@cleeng/mediastore-sdk/dist/components/Button";
import Select from "@cleeng/mediastore-sdk/dist/components/Select/Select.js";
import Loader from "@cleeng/mediastore-sdk/dist/components/Loader";
import Header from '@cleeng/mediastore-sdk/dist/components/Header';
import Footer from '@cleeng/mediastore-sdk/dist/components/Footer';
import PasswordInput from "@cleeng/mediastore-sdk/dist/components/PasswordInput";
import EmailInput from "@cleeng/mediastore-sdk/dist/components/EmailInput";
import {
    validateConsentsField,
    validateEmailField,
    validatePasswordField,
} from "@cleeng/mediastore-sdk/dist/util/validators.js";
import {
    ContentWrapperStyled,
    LoginWrapperStyled as RegisterWrapperStyled
} from '@cleeng/mediastore-sdk/dist/components/LoginPage/LoginStyled';
import {
    FromStyled,
    FormErrorStyled,
} from "@cleeng/mediastore-sdk/dist/components/LoginPage/LoginStyled";
import { CaptureBoxStyled } from "@cleeng/mediastore-sdk/dist/components/Capture/CaptureForm/CaptureFormStyled.js";
import { useState } from "react";
import getCustomerLocales from "@cleeng/mediastore-sdk/dist/api/Customer/getCustomerLocales";
import updateCustomer from "@cleeng/mediastore-sdk/dist/api/Customer/updateCustomer.js";
import {
    registerCustomer,
    submitConsents,
    updateCaptureAnswers,
} from "@cleeng/mediastore-sdk/dist/api/index.js";
import { Auth } from "@cleeng/mediastore-sdk";


const captureSettings = [
    {
        key: "custom_1",
        enabled: true,
        required: false,
        value:
            "Want to reduce stress or anxiety in my dog; Don't like leaving my dog home alone; Want to give my bored dog some mental stimulation; Looking for expert advice to give my dog a better life; Want to do something fun for my dog",
        question: "Why did you decide to try DOGTV today?",
        answer: null,
    },
    {
        key: "custom_2",
        enabled: true,
        required: false,
        value:
            "Aggression; Barking; Destructive chewing; Food guarding; Howling; Separation anxiety; Whining; Digging; Marking territory; Scratching; None",
        question: "Is there a dog behavior that is a problem?",
        answer: null,
    },
    {
        key: "custom_3",
        enabled: true,
        required: false,
        value:
            "Allergies; Arthritis; Dental health; Ear infections; Excessive shedding; Skin infections and hot spots; Nutrition; Obesity; None",
        question: "Is there a specific pet health concern?",
        answer: null,
    },
]; 

function CheckoutRegister(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [consents, setConsents] = useState([]);
    const [captureAnswers, setCaptureAnswers] = useState({});
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        repeatPassword: "",
        firstName: "",
        lastName: "",
        consents: "",
    });
    const [generalError, setGeneralError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [consentDefinitions, setConsentDefinitions] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [disableActionButton, setDisableActionButton] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword((currentShowPassword) => !currentShowPassword);
    };

    const handleClickShowRepeatPassword = () => {
        setShowRepeatPassword(
            (currentShowRepeatPassword) => !currentShowRepeatPassword,
        );
    };

    const validateEmail = () => {
        const emailError = validateEmailField(email);
        setErrors((currentErrors) => {
            return { ...currentErrors, email: emailError };
        });
    };

    const validatePassword = () => {
        const passwordError = validatePasswordField(password);
        setErrors((currentErrors) => {
            return { ...currentErrors, password: passwordError };
        });
    };

    const validateRepeatPasswordField = () => {
        return repeatPassword === password ? "" : "Passwords do not match.";
    };

    const validateRepeatPassword = () => {
        const repeatPasswordError = validateRepeatPasswordField();
        setErrors((currentErrors) => {
            return { ...currentErrors, repeatPassword: repeatPasswordError };
        });
    };

    const validateFirstNameField = () => {
        if (firstName.length === 0) {
            return "First name is required.";
        }
        return firstName.length > 50 ? "50 character maximum." : "";
    };

    const validateLastNameField = () => {
        if (lastName.length === 0) {
            return "Last name is required.";
        }
        return lastName.length > 50 ? "50 character maximum." : "";
    };

    const validateFirstName = () => {
        const firstNameError = validateFirstNameField();
        setErrors((currentErrors) => {
            return { ...currentErrors, firstName: firstNameError };
        });
    };

    const validateLastName = () => {
        const lastNameError = validateLastNameField();
        setErrors((currentErrors) => {
            return { ...currentErrors, lastName: lastNameError };
        });
    };

    const validateFields = () => {
        const emailError = validateEmailField(email);
        const passwordError = validatePasswordField(password);
        const passwordRepeatError = validateRepeatPasswordField();
        const firstNameError = validateFirstNameField();
        const lastNameError = validateLastNameField();
        const consentsError = validateConsentsField(consents, consentDefinitions);
        setErrors({
            email: emailError,
            password: passwordError,
            repeatPassword: passwordRepeatError,
            firstName: firstNameError,
            lastName: lastNameError,
            consents: consentsError,
        });
        return (
            !emailError &&
            !passwordError &&
            !consentsError &&
            !passwordRepeatError &&
            !firstNameError &&
            !lastNameError
        );
    };

    const handleConsentsChange = (consents, consentDefinitions) => {
        setConsents(consents);
        setConsentDefinitions(consentDefinitions);
        setErrors((currentErrors) => {
            return { ...currentErrors, consents: "" };
        });
    };

    const updateCaptureQuestions = async () => {
        if (captureSettings.length === 0 || !props.showCleengCapture) return true;

        const customAnswers = captureSettings.map((captureQuestion) => {
            const value = captureAnswers[captureQuestion.key]
                ? captureAnswers[captureQuestion.key].value
                : "";
            return {
                questionId: captureQuestion.key,
                question: captureQuestion.question,
                value,
            };
        });

        return await updateCaptureAnswers({
            customAnswers,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateFields()) {
            const registerResult = await register();
            if (registerResult) {
                const [updateCustomerResult, updateCaptureResult] = await Promise.all([
                    updateCustomerData(),
                    updateCaptureQuestions(),
                ]);
                if (updateCustomerResult && updateCaptureResult) {
                    props.onSuccess();
                }
            }
        }
    };

    const register = async () => {
        setProcessing(true);

        const localesResponse = await getCustomerLocales();
        if (!localesResponse.responseData) {
            setProcessing(false);
            setGeneralError("An error occurred.");
            return false;
        }
        const locales = localesResponse.responseData;
        const response = await registerCustomer(
            email,
            password,
            props.publisherId,
            locales.locale,
            locales.country,
            locales.currency,
        );
        if (response.status === 200) {
            Auth.login(
                false,
                true,
                email,
                response.responseData.jwt,
                response.responseData.refreshToken,
                submitConsents,
                [consents, consentDefinitions],
                props.onSuccess,
            );
        } else if (response.status === 422) {
            if (response.errors[0].includes("Enterprise account is required")) {
                renderError(
                    'You would need our product <a href="https://cleeng.com/core-ott-subscriber-management" target="_blank">Core</a> to call this API',
                );
            } else {
                renderError("Customer already exists.");
            }
        } else if (response.status === 429) {
            setDisableActionButton(true);
            renderError("Server overloaded. Please try again later.");
            setTimeout(() => {
                setDisableActionButton(false);
                setGeneralError("");
            }, 10 * 1000);
        } else {
            setProcessing(false);
            setGeneralError("An error occurred.");
        }
        return true;
    };

    const updateCustomerData = async () => {
        const response = await updateCustomer({ firstName, lastName });
        if (response.status !== 200) {
            setProcessing(false);
            setGeneralError("An error occurred.");
            return false;
        }
        return true;
    };

    const renderError = (message = "An error occurred.") => {
        setProcessing(false);
        setGeneralError(message);
    };

    const handleEmailChange = (value) => {
        setEmail(value);
        if (errors.email) {
            validateEmail();
        }
    };

    const handlePasswordChange = (value) => {
        setPassword(value);
        validatePassword();
    };

    const handleRepeatPasswordChange = (value) => {
        setRepeatPassword(value);
    };

    const handleFirstNameChange = (value) => {
        setFirstName(value);
        if (errors.firstName) {
            validateFirstName();
        }
    };

    const handleLastNameChange = (value) => {
        setLastName(value);
        if (errors.lastName) {
            validateLastName();
        }
    };

    const disabledRegisterButton = () => {
        setDisableActionButton(true);
    };

    const handleCaptureQuestionChange = (key, option) => {
        setCaptureAnswers((currentCaptureAnswers) => {
            return { ...currentCaptureAnswers, [key]: option };
        });
    };

    return (
        <RegisterWrapperStyled>
            <Header />
            <ContentWrapperStyled>
                <FromStyled onSubmit={handleSubmit} noValidate>
                    <FormErrorStyled dangerouslySetInnerHTML={{ __html: generalError }} />
                    <EmailInput
                        label={"Email"}
                        floatingLabels={false}
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={validateEmail}
                        error={errors.email}
                    />
                    <PasswordInput
                        label={"Password"}
                        floatingLabels={false}
                        value={password}
                        onChange={handlePasswordChange}
                        onBlur={validatePassword}
                        error={errors.password}
                        showVisibilityIcon
                        showPassword={showPassword}
                        handleClickShowPassword={handleClickShowPassword}
                        showPasswordStrength
                    />
                    <PasswordInput
                        label={"Repeat Password"}
                        floatingLabels={false}
                        value={repeatPassword}
                        onChange={handleRepeatPasswordChange}
                        onBlur={validateRepeatPassword}
                        error={errors.repeatPassword}
                        showVisibilityIcon
                        showPassword={showRepeatPassword}
                        handleClickShowPassword={handleClickShowRepeatPassword}
                    />
                    <Input
                        placeholder={"First Name"}
                        floatingLabels={false}
                        value={firstName}
                        onChange={handleFirstNameChange}
                        onBlur={validateFirstName}
                        error={errors.firstName}
                    />
                    <Input
                        placeholder={"Last Name"}
                        floatingLabels={false}
                        value={lastName}
                        onChange={handleLastNameChange}
                        onBlur={validateLastName}
                        error={errors.lastName}
                    />
                     {/* props.showCleengCapture && (
                        captureSettings.map((setting, index) => {
                            return (
                                <CaptureBoxStyled>
                                    <Select
                                        label={setting.question}
                                        placeholder={setting.question}
                                        name={setting.key}
                                        value={captureAnswers[setting.key] || ""}
                                        values={setting.value.split(";").map((i) => {
                                            const value = i.trim();
                                            const label = value;
                                            return {
                                                value,
                                                label,
                                            };
                                        })}
                                        required={setting.required}
                                        onChange={handleCaptureQuestionChange}
                                    ></Select>
                                </CaptureBoxStyled>
                            );
                        })
                    )*/} 
                    <Consent error={errors.consents} onChangeFn={handleConsentsChange} />
                    <Button
                        type="submit"
                        size="big"
                        theme="confirm"
                        margin="10px 0"
                        disabled={processing || disableActionButton || errors.consents}
                    >
                        {processing ? <Loader buttonLoader color="#ffffff" /> : "Next"}
                    </Button>
                </FromStyled>
            </ContentWrapperStyled>
            <Footer />
        </RegisterWrapperStyled>
    );
}

export default CheckoutRegister;
