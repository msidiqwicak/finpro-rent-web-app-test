# Panduan Menggabungkan (Merge) Git: Skenario `dev` Branch

Karena struktur branch Anda adalah `main -> dev -> features1 & features2`, maka cara terbaik untuk melakukan merge **bukanlah** dengan menggabungkan `features2` langsung ke dalam `features1` secara asal. 

Terdapat aturan standar dalam kerja tim (Git Flow) yang sebaiknya diikuti agar struktur kode tidak berantakan. Berikut adalah dua cara (skenario) yang harus Anda pilih sesuai dengan tujuan Anda.

---

## SKENARIO 1: Menyatukan Hasil Kerja untuk Dites Bersama (BEST PRACTICE 🌟)
**Tujuan:** Anda dan partner sudah sama-sama selesai (atau ingin melihat gabungan aplikasinya), dan ingin menggabungkannya ke branch `dev`.

Ini adalah cara standar yang paling aman. Kalian berdua akan menyetor kode masing-masing ke branch `dev`.

### Langkah-langkah:
1. **Simpan pekerjaan Anda di `features1`:**
   ```bash
   git add .
   git commit -m "Menyelesaikan fitur saya di features1"
   git push origin features1
   ```
2. **Pindah ke branch `dev`:**
   ```bash
   git checkout dev
   ```
3. **Tarik update terbaru `dev` dari server:**
   ```bash
   git pull origin dev
   ```
4. **Gabungkan (Merge) `features1` Anda ke dalam `dev`:**
   ```bash
   git merge features1
   # (Selesaikan jika ada konflik)
   git push origin dev
   ```
5. **Gabungkan (Merge) `features2` partner Anda ke dalam `dev`:**
   *(Pastikan partner Anda sudah melakukan git push pada branch features2 miliknya)*
   ```bash
   git fetch origin
   git merge origin/features2
   # (Selesaikan jika ada konflik)
   git push origin dev
   ```
Sekarang, branch `dev` sudah berisi gabungan hasil kerja Anda (`features1`) dan partner Anda (`features2`). Kalian bisa menjalankan aplikasi di branch `dev` untuk mengetesnya.

---

## SKENARIO 2: Menarik Kode Teman ke Branch Anda
**Tujuan:** Anda masih bekerja di `features1`, tetapi Anda *membutuhkan* fitur/fungsi yang dibuat partner Anda di `features2` agar pekerjaan Anda bisa dilanjutkan.

Dalam kasus ini, Anda akan memasukkan `features2` ke dalam `features1`.

### Langkah-langkah:
1. **Pastikan Anda berada di branch Anda sendiri (`features1`):**
   ```bash
   git checkout features1
   ```
2. **Simpan pekerjaan Anda yang sekarang:**
   ```bash
   git add .
   git commit -m "Save progress sebelum merge features2"
   ```
3. **Ambil update terbaru dari server:**
   ```bash
   git fetch origin
   ```
4. **Gabungkan (Merge) branch `features2` milik partner ke branch Anda:**
   ```bash
   git merge origin/features2
   ```
5. **Atasi Konflik (Bila Ada) ⚠️**
   - Jika terminal berkata `CONFLICT`, buka VS Code.
   - Periksa file yang berwarna merah (`both modified`).
   - Pilih kode mana yang mau dipertahankan (Accept Current / Accept Incoming / Accept Both).
   - Simpan file.
6. **Selesaikan Merge:**
   ```bash
   git add .
   git commit -m "Merge features2 ke features1"
   ```
7. **Lanjutkan Pekerjaan Anda!**
   Kini branch `features1` Anda sudah mengandung kode dari teman Anda. Anda bisa melanjutkan koding seperti biasa.

---

### Ringkasan Aturan:
- **Jangan** langsung bekerja/mengubah kode di dalam branch `dev` atau `main`.
- Selalu selesaikan pekerjaan di branch `features` masing-masing.
- Saat waktunya digabung untuk rilis/tes, kumpulkan semuanya di branch `dev`.
