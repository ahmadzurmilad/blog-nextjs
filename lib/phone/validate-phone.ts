// c:\laragon\www\blog\lib\phone\validate-phone.ts
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function isValidPhoneNumber(phoneNumber: string, countryCode: string) {
    // Jika kosong, dianggap valid (karena field optional di schema), 
    // validasi required ditangani oleh z.string().min(1) jika diperlukan.
    if (!phoneNumber) return true;

    // Hapus angka 0 di depan jika ada, agar validasi sesuai dengan format internasional
    let cleanNumber = phoneNumber;
    if (cleanNumber.startsWith("0")) {
        cleanNumber = cleanNumber.slice(1);
    }

    try {
        // Gabungkan kode negara dan nomor telepon
        const fullNumber = `+${countryCode}${cleanNumber}`;
        const parsed = parsePhoneNumberFromString(fullNumber);

        return parsed?.isValid() || false;
    } catch (error) {
        return false;
    }
}
