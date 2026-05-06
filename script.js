const GURU_DB = ["Rufus Palal Raharja, S.Pd", "Agathon Charis Irawan, S.Pd., M.M.", "Valleria Diani Sita Pradani, S.Pd.", "Dra. Yayuk Handayani", "Wiwin Kristanti, S.Pd.", "Martina Uli Yohana Napitupulu, S.S.", "Edi Pance Ndaling, S.Pd.", "Yefta Irga Krisanda, S.Pd.", "Lazarus Dwi Poertantono, S.Kom, MTA", "David Pierro Panglipur, S.Pd", "Donald Ivantoro, S.Pd.", "Christina BR Ginting, S.Pd.", "Yohana Sari, S.Pd"];
const MAPEL_DB = ["Bahasa Indonesia", "Informatika", "Fisika", "Kimia", "Biologi", "Matematika", "Ekonomi", "Sejarah", "Pendidikan Pancasila", "SPK", "ELS"];

const MPP_LIST = [
    "INFORMATIKA A", "INFORMATIKA B", "INFORMATIKA C",
    "BIOLOGI A", "BIOLOGI B", "BIOLOGI C",
    "FISIKA A", "FISIKA B",
    "KIMIA A", "KIMIA B",
    "MATEMATIKA A", "MATEMATIKA B",
    "EKONOMI A", "EKONOMI B",
    "GEOGRAFI A", "SOSIOLOGI A"
];

let currentPreviewKelas = "";

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const kelasUrl = urlParams.get('kelas');
    if(kelasUrl && document.getElementById('in_kelas')) {
        document.getElementById('in_kelas').value = kelasUrl;
    }

    if(document.getElementById('reguler-buttons')) {
        renderDashboardButtons();
        renderMainLogs();
    }

    populateSelect('in_guru', GURU_DB);
    populateSelect('filterGuruPreview', GURU_DB);
    populateSelect('in_mapel', MAPEL_DB);

    const form = document.getElementById('formJurnal');
    if(form) {
        document.getElementById('in_tanggal').valueAsDate = new Date();
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                id: Date.now(),
                tanggal: document.getElementById('in_tanggal').value,
                kelas: document.getElementById('in_kelas').value,
                jam: document.getElementById('in_jam').value,
                guru: document.getElementById('in_guru').value,
                materi: document.getElementById('in_mapel').value + " (" + document.getElementById('in_materi_detail').value + ")",
                kegiatan: document.getElementById('in_kegiatan').value || "-",
                tugas: document.getElementById('in_tugas').value || "-",
                hadir: document.getElementById('in_hadir').value,
                absen: document.getElementById('in_absen').value,
                ket: document.getElementById('in_ket').value || "-"
            };
            let logs = JSON.parse(localStorage.getItem('petra_logs')) || [];
            logs.unshift(data);
            localStorage.setItem('petra_logs', JSON.stringify(logs));
            alert("Berhasil disimpan!"); 
            window.location.href = 'index.html';
        });
    }
});

function renderDashboardButtons() {
    const regs = ['X-1','X-2','X-3','X-4','XI-1','XI-2','XI-3','XI-4','XII-1','XII-2','XII-3','XII-4','XII-5'];
    document.getElementById('reguler-buttons').innerHTML = regs.map(k => `
        <div class="col-lg-1 col-md-2 col-3 mb-2"><a href="form.html?kelas=${k}" class="btn btn-light btn-sm w-100 fw-bold shadow-sm">${k}</a></div>
    `).join('');
    
    document.getElementById('mpp-xi-buttons').innerHTML = MPP_LIST.map(m => `
        <a href="form.html?kelas=MPP XI ${m}" class="btn btn-outline-light btn-sm px-3 shadow-sm">${m}</a>
    `).join('');

    document.getElementById('mpp-xii-buttons').innerHTML = MPP_LIST.map(m => `
        <a href="form.html?kelas=MPP XII ${m}" class="btn btn-outline-light btn-sm px-3 shadow-sm">${m}</a>
    `).join('');
}

function renderMainLogs() {
    const body = document.getElementById('mainLogBody');
    const logs = JSON.parse(localStorage.getItem('petra_logs')) || [];
    body.innerHTML = logs.length === 0 ? '<tr><td colspan="5" class="text-center py-4 text-white">Belum ada riwayat.</td></tr>' : logs.map(l => `
        <tr>
            <td>${l.tanggal}</td>
            <td><span class="badge bg-primary text-wrap">${l.kelas}</span></td>
            <td><b>${l.guru}</b></td>
            <td class="small">${l.materi}</td>
            <td class="text-center"><button onclick="openPreviewModal('${l.kelas}')" class="btn btn-info btn-sm text-white px-3 shadow-sm">Preview</button></td>
        </tr>
    `).join('');
}

function openPreviewModal(kelas) {
    currentPreviewKelas = kelas;
    applyPreviewFilter();
    new bootstrap.Modal(document.getElementById('modalCetak')).show();
}

function applyPreviewFilter() {
    const guru = document.getElementById('filterGuruPreview').value;
    const start = document.getElementById('filterTglStart').value;
    const end = document.getElementById('filterTglEnd').value;
    let logs = (JSON.parse(localStorage.getItem('petra_logs')) || []).filter(l => l.kelas === currentPreviewKelas);
    if(guru) logs = logs.filter(l => l.guru === guru);
    if(start) logs = logs.filter(l => l.tanggal >= start);
    if(end) logs = logs.filter(l => l.tanggal <= end);

    document.getElementById('cardsContainer').innerHTML = logs.map(l => `
        <div class="journal-card mb-5 border border-dark p-5 bg-white mx-auto shadow-sm" style="max-width:210mm; color:black;">
            <div class="text-center border-bottom border-3 border-dark pb-2 mb-3">
                <h4 class="fw-bold mb-0">SMAS KRISTEN PETRA 4 SIDOARJO</h4>
                <p class="mb-0 small">KARTU JURNAL PEMBELAJARAN GURU - KELAS ${l.kelas}</p>
            </div>
            <table class="table table-bordered border-dark mt-4">
                <tr><th width="30%" class="bg-light">Hari / Tanggal</th><td>${l.tanggal}</td></tr>
                <tr><th class="bg-light">Kelas / Jam Ke</th><td>${l.kelas} / ${l.jam}</td></tr>
                <tr><th class="bg-light">Guru Pengajar</th><td class="fw-bold">${l.guru}</td></tr>
                <tr><th class="bg-light">Materi Pembelajaran</th><td>${l.materi}</td></tr>
                <tr><th class="bg-light">Kegiatan</th><td>${l.kegiatan}</td></tr>
                <tr><th class="bg-light">Presensi Siswa</th><td>Hadir: ${l.hadir}, Absen: ${l.absen} (Ket: ${l.ket})</td></tr>
            </table>
            <div class="row mt-5">
                <div class="col-8"></div>
                <div class="col-4 text-center">
                    <p class="small mb-0">Sidoarjo, ${l.tanggal}</p>
                    <p class="small">Guru Pengajar,</p>
                    <div style="height:60px"></div>
                    <p class="fw-bold text-decoration-underline">(${l.guru})</p>
                </div>
            </div>
        </div>`).join('');
}

function populateSelect(id, data) {
    const el = document.getElementById(id);
    if(el) data.sort().forEach(item => el.add(new Option(item, item)));
}
function exportToExcel() {
    const logs = JSON.parse(localStorage.getItem('petra_logs')) || [];
    
    if (logs.length === 0) {
        alert("Tidak ada data untuk diexport!");
        return;
    }

    // 1. Definisikan Header Kolom
    const headers = ["Tanggal", "Kelas", "Jam Ke", "Guru Pengajar", "Mata Pelajaran & Materi", "Kegiatan", "Tugas", "Hadir", "Absen", "Keterangan"];
    
    // 2. Map data ke dalam array baris
    const rows = logs.map(l => [
        l.tanggal,
        l.kelas,
        l.jam,
        l.guru,
        `"${l.materi.replace(/"/g, '""')}"`, // Bungkus dengan kutip agar koma di dalam teks tidak merusak kolom
        `"${l.kegiatan.replace(/"/g, '""')}"`,
        `"${l.tugas.replace(/"/g, '""')}"`,
        l.hadir,
        l.absen,
        l.ket
    ]);

    // 3. Gabungkan header dan baris dengan pemisah koma (CSV format)
    let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");

    // 4. Proses Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    
    // Penamaan file otomatis dengan tanggal hari ini
    const fileName = `Jurnal_Petra4_${new Date().toISOString().slice(0,10)}.csv`;
    link.setAttribute("download", fileName);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}