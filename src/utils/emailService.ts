import emailjs from '@emailjs/browser';

export const EMAILJS_CONFIG = {
    SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_9ebawez',
    TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_rpx39ir',
    CONTACT_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID || 'template_6603v78',
    PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'bryq6na8G8BW-lxXu',
};

export const initEmailJS = () => {
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

export const sendAssessmentEmail = async (emailData: EmailData): Promise<boolean> => {
    try {
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
        return false;
    }
};

export const sendContactEmail = async (contactData: ContactData): Promise<boolean> => {
    try {
        const templateParams = {
            contact_name: contactData.name,
            contact_email: contactData.email,
            contact_phone: contactData.phone,
            contact_message: contactData.message,
            submission_time: contactData.time,
        };
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
        return false;
    }
};