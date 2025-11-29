import emailjs from '@emailjs/browser';

export const EMAILJS_CONFIG = {
    SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    CONTACT_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID,
    PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};

/**
 * Initializes EmailJS with public key
 */
export const initEmailJS = () => {
    if (!EMAILJS_CONFIG.PUBLIC_KEY) {
        console.error('EmailJS PUBLIC_KEY is missing! Check your .env file.');
        return;
    }
    console.log('Initializing EmailJS with public key:', EMAILJS_CONFIG.PUBLIC_KEY);
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
};

interface EmailData {
    assessmentType: string;
    score: string;
    maxScore: string;
    level: string;
    description: string;
    userName: string;
    date: string;
    userEmail?: string;
}

interface ContactData {
    name: string;
    email: string;
    time: string;
    phone: string;
    message: string;
}

/**
 * Sends assessment results to hospital via email
 */
export const sendAssessmentEmail = async (emailData: EmailData): Promise<boolean> => {
    try {
        if (!EMAILJS_CONFIG.SERVICE_ID || !EMAILJS_CONFIG.TEMPLATE_ID || !EMAILJS_CONFIG.PUBLIC_KEY) {
            console.error('EmailJS configuration is incomplete:', {
                hasServiceId: !!EMAILJS_CONFIG.SERVICE_ID,
                hasTemplateId: !!EMAILJS_CONFIG.TEMPLATE_ID,
                hasPublicKey: !!EMAILJS_CONFIG.PUBLIC_KEY
            });
            alert('Email service is not configured properly. Please check your .env file.');
            return false;
        }

        const templateParams = {
            patient_name: emailData.userName,
            assessment_type: emailData.assessmentType,
            assessment_date: emailData.date,
            score: emailData.score,
            max_score: emailData.maxScore,
            result_level: emailData.level,
            interpretation: emailData.description,
            submission_time: new Date().toLocaleTimeString('id-ID'),
        };

        console.log('Sending assessment email with params:', templateParams);

        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams,
            EMAILJS_CONFIG.PUBLIC_KEY
        );

        console.log('Report sent successfully:', response);
        return true;
    } catch (error) {
        console.error('Failed to send report:', error);
        if (error instanceof Error) {
            alert(`Failed to send email: ${error.message}`);
        }
        return false;
    }
};

/**
 * Sends contact form message via email
 */
export const sendContactEmail = async (contactData: ContactData): Promise<boolean> => {
    try {
        if (!EMAILJS_CONFIG.SERVICE_ID || !EMAILJS_CONFIG.CONTACT_TEMPLATE_ID || !EMAILJS_CONFIG.PUBLIC_KEY) {
            console.error('EmailJS configuration is incomplete for contact form');
            alert('Email service is not configured properly. Please check your .env file.');
            return false;
        }

        const templateParams = {
            contact_name: contactData.name,
            contact_email: contactData.email,
            contact_phone: contactData.phone,
            contact_message: contactData.message,
            submission_time: contactData.time,
        };

        console.log('Sending contact email with params:', templateParams);

        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.CONTACT_TEMPLATE_ID,
            templateParams,
            EMAILJS_CONFIG.PUBLIC_KEY
        );
        console.log('Contact message sent successfully:', response);
        return true;
    } catch (error) {
        console.error('Failed to send contact message:', error);
        if (error instanceof Error) {
            alert(`Failed to send contact message: ${error.message}`);
        }
        return false;
    }
};