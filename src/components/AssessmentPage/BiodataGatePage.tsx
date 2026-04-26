import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/navbar';
import BiodataForm, { type Biodata } from './BiodataForm';

type GateState = { next?: string } | null;

export default function BiodataGatePage() {
    const navigate = useNavigate();
    const next = (useLocation().state as GateState)?.next;

    const handleSubmit = (biodata: Biodata) => {
        navigate(next ?? '/assessment', { state: next ? { biodata } : undefined });
    };

    return (
        <>
            <Navbar currentPage="Assessments" />
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center bg-blue-400 rounded-b-4xl p-6 sm:p-8 shadow-lg mt-18">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-100 mb-2 px-4">
                        Isi Biodata
                    </h1>
                    <p className="text-sm sm:text-lg text-gray-100 max-w-3xl mx-auto px-4">
                        Silakan isi biodata sebelum memulai assessment
                    </p>
                </div>

                <div className="flex justify-center mt-8 md:px-12">
                    <div className="w-full max-w-3xl">
                        <div className="mb-4 flex justify-start">
                            <button
                                onClick={() => navigate(-1)}
                                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-300 text-sm cursor-pointer"
                            >
                                ← Kembali
                            </button>
                        </div>
                        <BiodataForm
                            title="Data Diri untuk Laporan"
                            description="Usia dan jenis kelamin wajib. Nama, alamat, dan nomor telepon bersifat opsional."
                            submitLabel="Mulai Assessment"
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}