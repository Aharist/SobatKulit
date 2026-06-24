# PENGINGAT MIDTRANS WEBHOOK

Saat ini fitur pembayaran berlangganan Premium di aplikasi SobatKulit menggunakan mekanisme callback frontend (melalui `onSuccess` di `window.snap.pay`) yang memanggil rute `/api/upgrade`.

**PENTING:**
Metode ini hanya boleh digunakan untuk pengujian (sandbox). Untuk rilis produksi, metode ini rentan terhadap eksploitasi di mana pengguna dapat memalsukan respons success di sisi frontend.

**TODO UNTUK PRODUKSI:**
1. Implementasi HTTP Notification (Webhook) Midtrans.
2. Buat endpoint baru (misal: `/api/midtrans/webhook`).
3. Endpoint webhook tersebut harus membaca payload POST dari Midtrans.
4. Verifikasi `signature_key` menggunakan SHA512 dari `order_id + status_code + gross_amount + server_key` untuk membuktikan bahwa webhook tersebut benar-benar dari Midtrans.
5. Update kolom `role` menjadi `premium` di database secara server-to-server jika `transaction_status` adalah `capture` atau `settlement`.
6. Hapus pemanggilan API `/api/upgrade` dari frontend callback `onSuccess` dan serahkan sepenuhnya ke webhook.
