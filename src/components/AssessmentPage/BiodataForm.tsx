import { useMemo, useState } from 'react'

export type GenderOption = 'Laki-laki' | 'Perempuan'

export interface Biodata {
    age: number
    gender: GenderOption
    userName?: string
    phoneNumber?: string
    address?: string
}

interface BiodataFormProps {
    title?: string
    description?: string
    initialValue?: Partial<Biodata>
    submitLabel?: string
    onSubmit: (biodata: Biodata) => void
}

function toInt(value: string): number | null {
    const trimmed = value.trim()
    if (!trimmed) return null
    const num = Number(trimmed)
    if (!Number.isFinite(num)) return null
    const int = Math.floor(num)
    if (int <= 0) return null
    return int
}

export default function BiodataForm({
    title = 'Data Diri',
    description = 'Isi data diri sebelum memulai assessment. Usia dan jenis kelamin wajib diisi.',
    initialValue,
    submitLabel = 'Lanjut',
    onSubmit,
}: BiodataFormProps) {
    const [ageText, setAgeText] = useState(initialValue?.age ? String(initialValue.age) : '')
    const [gender, setGender] = useState<GenderOption | ''>((initialValue?.gender as GenderOption) ?? '')
    const [userName, setUserName] = useState(initialValue?.userName ?? '')
    const [phoneNumber, setPhoneNumber] = useState(initialValue?.phoneNumber ?? '')
    const [address, setAddress] = useState(initialValue?.address ?? '')

    const ageParsed = useMemo(() => toInt(ageText), [ageText])
    const canSubmit = Boolean(ageParsed && gender)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!ageParsed || !gender) return

        onSubmit({
            age: ageParsed,
            gender: gender as GenderOption,
            userName: userName.trim() || undefined,
            phoneNumber: phoneNumber.trim() || undefined,
            address: address.trim() || undefined,
        })
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border-2 border-blue-100">
            <div className="mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">{title}</h2>
                <p className="text-sm text-gray-600">{description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Usia <span className="text-red-600">*</span></label>
                    <input
                        type="number"
                        inputMode="numeric"
                        min={1}
                        placeholder="Contoh: 20"
                        value={ageText}
                        onChange={(e) => setAgeText(e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm placeholder:text-gray-400"
                        required
                    />
                    {!ageParsed && ageText.trim() !== '' && (
                        <p className="mt-1 text-xs text-red-600">Usia harus berupa angka &gt 0.</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin <span className="text-red-600">*</span></label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as GenderOption | '')}
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                        required
                    >
                        <option value="" disabled>Pilih…</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama (Opsional)</label>
                    <input
                        type="text"
                        placeholder="Masukkan nama"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm placeholder:text-gray-400"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor HP (Opsional)</label>
                    <input
                        type="tel"
                        placeholder="Contoh: 081234567890"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm placeholder:text-gray-400"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat (Opsional)</label>
                    <textarea
                        placeholder="Masukkan alamat"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm resize-none placeholder:text-gray-400"
                    />
                </div>
            </div>

            <div className="mt-5 flex justify-end">
                <button
                    type="submit"
                    disabled={!canSubmit}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 text-sm"
                >
                    {submitLabel}
                </button>
            </div>
        </form>
    )
}
