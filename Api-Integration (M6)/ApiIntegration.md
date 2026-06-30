## API Integration
Proses menghubungkan aplikasi yang kita buat dengan layanan atau sistem lain (server) melalui API (Aplication Programing Interface)

API 
- Jembatan untuk menghubungkan 2 aplikasi saling bertukar data (Frontend & Backend)

Fetch API
- Fitur bawaan javascript untuk mengirim request dan mengambil data. Singkatnya, fetch API itu adalah alat yang digunakan untuk melakukan http request.

HTTP Request
- Proses pengiriman request dari client.

Ada 4 method utama dalam HTTP Request
1. GET -> Mengambil data
2. POST -> Mengirim data
3. PUT -> Memperbarui data
4. DELETE -> Menghapus data

Error Handling
- Proses yang menangani kesalahan yang terjadi saat berkomunikasi dengan API. tanpa error handling, apikasi bisa berhenti bekerja begitu saja. Pengguna bisa bingung saat aplikasinya tiba-tiba saja menjadi kosong. Dengan error handling, aplikasi akan tetap stabil karena masalahnya bisa diketahui dan pengguna bisa mendapatkan informasi atau pesan yang jelas.

Loading State Management
- Cara mengelola aplikasi ketika aplikasi sedang mengambil, mengirim, atau memproses data. Tujuannya adalah agar user tau kalau aplikasi masih bekerja dan tidak mengalami error. 

##Dynamic Routing & Navigation
- Proses menampilkan halaman yang berbeda berdasarkan URL yang diminta oleh pengguna. Proses ini memungkinkan pengguna untuk berpindah dari satu halaman ke halaman lain dalam aplikasi tanpa perlu me-refresh seluruh halaman. 
- Routing : Proses yang menentukan halaman mana yang akan ditampilkan berdasarkan URL yang akan diakses pengguna.
-- Dynamic Routing : Teknik membuat satu halaman yang dapat menampilkan data yang berbeda-beda berdasarkan parameter pada URL.
-- Nested Routes : Teknik membuat halaman yang memiliki hubungan bertingkat/memiliki halaman lain. Biasanya digunakan untuk kategori dan subkategori.
- Navigation : Cara pengguna berpindah dari satu halaman ke halaman lainnya.

Conditional Rendering
- Teknik menampilkan atau menyembunyikan komponen berdasarkan suatu kondisi.

##Performance Optimization
- Sebuah proses yang mengoptimlkan kinerja aplikasi agar lebih cepat, ringan, dan nyaman digunakan oleh pengguna.

    Code Splitting
    - Sebuah teknik yang membagi kode aplikasi menjadi beberapa bagian, sehingga browser hanya mengundukh kode yang dibutuhkan.

    Lazy Loading
    - Teknik yang menunda proses memuat komponen, gambar, atau halaman hingga benar-benar dibutuhkan oleh pengguan.

    Memoization
    - Sebuah teknik menyimpan hasil perhitungan atau fungsi yang sudah pernah dibuat agar tidak dihitung ulang setiap kali halaman diperbaharui atau dirender.
    -- Usememo
    - Digunakan untuk menyimpan hasil perhitungan yang membutuhkan proses cukup berat. Jika data yang digunakan tidak berubah, react akan menggunakan hasil yang sudah disimpan sebelumnya.
    -- Usecallback
    - Digunakan untuk menyimpan fungsi agar tidak dibuat ulang setiap kali komponen melakukan render.

Debounce
