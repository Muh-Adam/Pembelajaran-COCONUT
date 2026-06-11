COMPONENTS & PROPS

Componen: Blok bangunan

Component tree : Struktur hierarki component

Di react setiap component terisolasi perlu berkomunikasi untuk ;
- Bisa berbagi data
- Bisa menangani event dari component lain
- Bisa membagun UI dinamis

Props : Properti, data yang dilewatkan dari component parent ke child component. Props bersifat read-only (hanya dibaca di dalam component child)

Props Drilling : Props di terus terusan dilewatkan ke component yang tidak membutuhkannya hanya agar bisa sampai ke component yang membutuhkan

Reuse Component : Kemampuan menggunakan kembali component di berbagai tempat dalam aplikasi

Props Destructuring : Teknik membuka props langsung di dalam component, sehingga tidak perlu menulis "props." berulang kali

