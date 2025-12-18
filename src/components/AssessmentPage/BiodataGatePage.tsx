import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/navbar';
import BiodataForm, { type Biodata } from './BiodataForm';

interface GateState {
    next?: string;
}

export default function BiodataGatePage() {
    const navigate = useNavigate();
    const location = useLocation();

    const next = (location.state as GateState | null)?.next;

    const handleSubmit = (biodata: Biodata) => {
        if (!next) {
            navigate('/assessment');
            return;
        }

        navigate(next, { state: { biodata } });
    };

    return (
        <>
            <Navbar currentPage="Assessments" />
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center bg-blue-400 rounded-b-4xl p-6 sm:p-8 shadow-lg mt-18">
                    <div>
                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-100 mb-3 sm:mb-4 px-4">
                            Isi Biodata
                        </h1>
                        <p className="text-sm sm:text-lg text-gray-100 max-w-2xl mx-auto px-4">
                            Silakan isi biodata sebelum memulai assessment. Data ini akan digunakan untuk pengiriman laporan hasil assessment Anda. Data Anda akan dijaga kerahasiaannya.
                        </p>
                    </div>
                </div>

                <div className="flex justify-center mt-8 md:px-12">
                    <div className="w-full max-w-3xl">
                        <BiodataForm
                            title="Data Diri untuk Laporan"
                            description="Usia dan jenis kelamin wajib. Nama, alamat, dan nomor telepon bersifat opsional."
                            submitLabel="Mulai Assessment"
                            onSubmit={handleSubmit}
                        />

                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={() => navigate('/assessment')}
                                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-300 text-sm cursor-pointer"
                            >
                                Kembali
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
