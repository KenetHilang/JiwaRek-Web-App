import React, { useEffect } from "react";
import Navbar from "../Navbar/navbar";
import { initEmailJS, sendContactEmail } from "../../utils/emailService";
import { FormField } from "./Form/contactForm";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";

type Status = 'idle' | 'sending' | 'success' | 'error';

interface ContactForm {
    firstName: string;
    email: string;
    phone: string;
    message: string;
}

interface FormErrors {
    firstName?: string;
    email?: string;
    message?: string;
}

const EMPTY_FORM: ContactForm = { firstName: '', email: '', phone: '', message: '' };

const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-400";

function validateForm(data: ContactForm): FormErrors {
    const errors: FormErrors = {};
    if (!data.firstName.trim()) errors.firstName = 'Nama wajib diisi';
    if (!data.email.trim()) errors.email = 'Email wajib diisi';
    if (!data.message.trim()) errors.message = 'Pesan wajib diisi';
    return errors;
}

function ContactPage() {
    const [form, setForm] = React.useState<ContactForm>(EMPTY_FORM);
    const [errors, setErrors] = React.useState<FormErrors>({});
    const [status, setStatus] = React.useState<Status>('idle');

    useEffect(() => { initEmailJS(); }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formErrors = validateForm(form);
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setStatus('sending');
        try {
            const success = await sendContactEmail({
                ...form,
                name: form.firstName,
                time: new Date().toLocaleString('id-ID'),
            });
            setStatus(success ? 'success' : 'error');
            if (success) setForm(EMPTY_FORM);
        } catch {
            setStatus('error');
        }
    };

    return (
        <>
            <Navbar currentPage="Contact" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full pt-16">

                    <div className="flex flex-col justify-center px-6 lg:px-12 py-12">
                        <h1 className="text-5xl spline spline-bold text-gray-800 mb-2">Contact us</h1>
                        <p className="text-gray-500 mb-8">Tim Kami ingin Mendengar Lebih Banyak dari Anda!</p>

                        {status === 'success' && (
                            <StatusBanner icon={<FiCheckCircle />} color="green" message="Pesan berhasil dikirim! Kami akan segera merespons." />
                        )}
                        {status === 'error' && (
                            <StatusBanner icon={<FiXCircle />} color="red" message="Gagal mengirim pesan. Silakan coba lagi." />
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                            <FormField label="Nama Lengkap" required error={errors.firstName}>
                                <input
                                    type="text" name="firstName" value={form.firstName}
                                    onChange={handleChange} placeholder="Nama Anda"
                                    className={`${inputClass} ${errors.firstName ? 'border-red-400' : ''}`}
                                />
                            </FormField>

                            <FormField label="Email" required error={errors.email}>
                                <input
                                    type="email" name="email" value={form.email}
                                    onChange={handleChange} placeholder="you@company.com"
                                    className={`${inputClass} ${errors.email ? 'border-red-400' : ''}`}
                                />
                            </FormField>

                            <FormField label="Phone number">
                                <input
                                    type="tel" name="phone" value={form.phone}
                                    onChange={handleChange} placeholder="+62 812-3456-7890"
                                    className={inputClass}
                                />
                            </FormField>

                            <FormField label="Pesan" required error={errors.message}>
                                <textarea
                                    rows={4} name="message" value={form.message}
                                    onChange={handleChange} placeholder="Tulis Pesan Anda Disini..."
                                    className={`${inputClass} resize-none ${errors.message ? 'border-red-400' : ''}`}
                                />
                            </FormField>

                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 hover:cursor-pointer"
                            >
                                {status === 'sending'
                                    ? <><FiLoader className="animate-spin" /> Mengirim...</>
                                    : 'Kirim Pesan'
                                }
                            </button>
                        </form>
                    </div>

                    {/* Map side */}
                    <div className="hidden lg:block h-[800px] lg:h-full">
                        <iframe
                            title="Rumah Sakit Menur Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.607743117442!2d112.75958717367612!3d-7.285392192721921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fbbc4ed41345%3A0x9a7a8ae762918f4e!2sRumah%20Sakit%20Menur%20Provinsi%20Jawa%20Timur!5e0!3m2!1sen!2ssg!4v1762771985888!5m2!1sen!2ssg"
                            width="100%" height="100%"
                            style={{ border: 0 }}
                            allowFullScreen loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

function StatusBanner({ icon, color, message }: { icon: React.ReactNode; color: 'green' | 'red'; message: string }) {
    const styles = {
        green: 'bg-green-50 border-green-200 text-green-700',
        red: 'bg-red-50 border-red-200 text-red-700',
    };
    return (
        <div className={`mb-6 p-4 border rounded-lg flex items-center gap-3 ${styles[color]}`}>
            <span className="text-lg flex-shrink-0">{icon}</span>
            <span className="font-medium">{message}</span>
        </div>
    );
}

export default ContactPage;