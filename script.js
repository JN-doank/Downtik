async function fetchData() {
    const input = document.getElementById('url').value;
    const loader = document.getElementById('loader');
    const result = document.getElementById('result');
    const actions = document.getElementById('actions');

    if (!input) return;

    loader.style.display = 'block';
    result.style.display = 'none';
    actions.innerHTML = "";

    try {
        const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(input)}`);
        const json = await res.json();
        const data = json.data;

        document.getElementById('cover').src = data.cover;

        if (data.play) {
            renderBtn("DOWNLOAD VIDEO HD", data.play, "TokSave_Video.mp4", true);
            renderBtn("DOWNLOAD AUDIO (MP3)", data.music, "TokSave_Audio.mp3", false);
        } else if (data.images) {
            data.images.forEach((img, i) => {
                renderBtn(`SIMPAN FOTO ${i+1}`, img, `TokSave_Photo_${i+1}.jpg`, true);
            });
        }

        loader.style.display = 'none';
        result.style.display = 'block';
    } catch (e) {
        alert("Gagal memproses data: " + e.message);
        loader.style.display = 'none';
    }
}

function renderBtn(txt, link, fileName, primary) {
    const b = document.createElement('button');
    b.className = primary ? "dl-btn primary" : "dl-btn secondary";
    b.innerText = txt;
    b.onclick = async () => {
        b.innerText = "PROSES...";
        b.disabled = true;
        
        try {
            const response = await fetch(link);
            const blob = await response.blob();
            const u = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = u;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(u);
            b.innerText = txt;
        } catch (error) {
            console.error("Download error:", error);
            window.open(link, '_blank');
            b.innerText = txt;
        } finally {
            b.disabled = false;
        }
    };
    document.getElementById('actions').appendChild(b);
}

// Optional: Add enter key support for input
document.getElementById('url').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        fetchData();
    }
});
