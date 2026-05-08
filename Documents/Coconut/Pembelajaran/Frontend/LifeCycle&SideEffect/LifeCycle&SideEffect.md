Life Cycle & Side Effect

-Mounting : Baru muncul
-Updating : Selalu berkembang / terupdate
-Unmounting : Dihapus


-UseEffect : useEffect adalah React Hook yang memungkinkan kamu menjalankan side effect di dalam functional component. Side effect adalah operasi yang terjadi "di luar" proses rendering, seperti: Fetch data dari API, Setup timer (setInterval, setTimeout), Menambah event listener, Manipulasi DOM secara langsung
-Dependency Array : Array yang berisi variabel yang "diawasi" oleh useEffect. Setiap kali nilai variabel di dalam array berubah, effect akan berjalan ulang.
-Cleanup Function : Fungsi yang dikembalikan (`return`) dari dalam useEffect. Fungsinya: 1. Berjalan **sebelum** effect berikutnya (saat dependency berubah) 2. Berjalan saat component **di-unmount** (dihapus dari DOM) Tanpa cleanup, side effect seperti `setInterval` akan terus berjalan di background dan menyebabkan memory leak.