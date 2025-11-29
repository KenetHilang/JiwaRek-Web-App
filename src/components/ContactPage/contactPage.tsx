import React from "react";
import Navbar from "../Navbar/navbar";
import { initEmailJS, sendContactEmail } from "../../utils/emailService";

function ContactPage() {
    const [contactData, setContactData] = React.useState({
        firstName: "",
        email: "",
        phone: "",
        message: ""
    });
    
    const [isSending, setIsSending] = React.useState(false);
    const [sendStatus, setSendStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setContactData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!contactData.firstName || !contactData.email || !contactData.message) {
            alert('Mohon isi kolom wajib (Nama, Email, Pesan)');
            return;
        }

        setIsSending(true);
        setSendStatus('idle');
        
        try {
            initEmailJS();
            
            const emailData = {
                name: contactData.firstName,
                email: contactData.email,
                phone: contactData.phone,
                message: contactData.message,
                time: new Date().toLocaleString('id-ID')
            };

            const success = await sendContactEmail(emailData);
            
            if (success) {
                setSendStatus('success');
                setContactData({
                    firstName: "",
                    email: "",
                    phone: "",
                    message: ""
                });
            } else {
                setSendStatus('error');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            setSendStatus('error');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
        <Navbar currentPage="Contact" />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ">
            <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full pt-16">
                    {/* Contact Information */}
                    <div className="flex flex-col justify-center px-6 lg:px-12 py-12">
                        <h1 className="text-5xl font-bold text-gray-800 mb-3">Contact us</h1>
                        <p className="text-gray-600 mb-8">
                            Tim Kami ingin Mendengar Lebih Banyak dari Anda! 
                        </p>
                        
                        {sendStatus === 'success' && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-3">
                                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Pesan berhasil dikirim! Kami akan segera merespons.</span>
                            </div>
                        )}
                        
                        {sendStatus === 'error' && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
                                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Gagal mengirim pesan. Silakan coba lagi.</span>
                            </div>
                        )}
                        
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={contactData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="Nama Anda"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={contactData.email}
                                    onChange={handleInputChange}
                                    placeholder="you@company.com"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={contactData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+62 812-3456-7890"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pesan <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={4}
                                    name="message"
                                    value={contactData.message}
                                    onChange={handleInputChange}
                                    placeholder="Tulis Pesan Anda Disini..."
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none placeholder:text-gray-400"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSending}
                                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                {isSending ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Mengirim...
                                    </>
                                ) : (
                                    'Kirim Pesan'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Map Location */}
                    <div className="hidden lg:block h-[800px] lg:h-full">
                        <iframe
                            title="Rumah Sakit Menur Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.607743117442!2d112.75958717367612!3d-7.285392192721921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fbbc4ed41345%3A0x9a7a8ae762918f4e!2sRumah%20Sakit%20Menur%20Provinsi%20Jawa%20Timur!5e0!3m2!1sen!2ssg!4v1762771985888!5m2!1sen!2ssg"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default ContactPage;