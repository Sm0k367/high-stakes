/**
 * EPIC TECH AI // HIGH_STAKES ENGINE
 * CORE: NEURAL_INTERFACE_V2.1 [MEDIA_FIX]
 * POWERED BY: @TSI_ORG
 */

let scene, camera, renderer, particles;
const terminalOutput = document.getElementById('terminal-output');
const dropZone = document.getElementById('drop-zone');
const mediaInput = document.getElementById('media-upload');

// --- ECONOMY STATE ---
let smokenTokens = parseInt(localStorage.getItem('smoken_tokens')) || 0;

function updateWallet(amount) {
    smokenTokens += amount;
    localStorage.setItem('smoken_tokens', smokenTokens);
    document.getElementById('token-balance').innerText = smokenTokens.toString().padStart(4, '0');
}

// --- INITIALIZE ENGINE ---
function initNeuralEngine() {
    const canvas = document.getElementById('neural-canvas');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 5000; i++) {
        vertices.push(THREE.MathUtils.randFloatSpread(100), THREE.MathUtils.randFloatSpread(100), THREE.MathUtils.randFloatSpread(100));
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x00f2ff, size: 0.1, transparent: true, opacity: 0.6 }));
    scene.add(particles);
    camera.position.z = 40;
}

// --- MEDIA INJECTION LOGIC (THE FIX) ---
function processFile(file) {
    const reader = new FileReader();
    const assetDisplay = document.getElementById('asset-display');
    const mediaName = document.getElementById('media-name');

    logToTerminal(`INJECTING: ${file.name.toUpperCase()}`, 'NEURAL_DATA');
    mediaName.innerText = file.name.split('.')[0].toUpperCase();

    reader.onload = (e) => {
        assetDisplay.innerHTML = ''; // Clear previous content

        if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = e.target.result;
            video.autoplay = true;
            video.loop = true;
            video.muted = true; // Required for most browsers to allow autoplay
            video.playsInline = true;
            video.setAttribute('controls', 'true'); // Add controls just in case
            
            // Force play promise
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    logToTerminal('AUTOPLAY BLOCKED: CLICK VIDEO TO START', 'WARNING');
                });
            }
            assetDisplay.appendChild(video);

        } else if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = e.target.result;
            assetDisplay.appendChild(img);
        } else {
            logToTerminal('UNSUPPORTED MIME-TYPE', 'ERROR');
        }
        
        gsap.from(assetDisplay, { duration: 0.8, opacity: 0, scale: 0.8, ease: "back.out" });
        updateWallet(100); 
    };
    reader.readAsDataURL(file);
}

// --- UI LOGIC ---
function logToTerminal(message, type = 'SYSTEM') {
    const p = document.createElement('p');
    p.className = 'line';
    p.innerHTML = `<span style="color: #ff00ff">[${type}]</span> ${message}`;
    terminalOutput.appendChild(p);
    dropZone.scrollTop = dropZone.scrollHeight;
}

function handleCommand(cmd) {
    const cleanCmd = cmd.trim().toUpperCase();
    if(!cleanCmd) return;
    logToTerminal(cleanCmd, 'USER');
    if(cleanCmd === 'INJECT_MEDIA') mediaInput.click();
    if(cleanCmd === 'SCAN_SOUND') gsap.to(particles.rotation, { duration: 2, y: "+=3.14" });
}

// --- EVENTS ---
dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', () => { dropZone.classList.remove('drag-over'); });
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
});

mediaInput.addEventListener('change', (e) => {
    if (e.target.files[0]) processFile(e.target.files[0]);
});

document.querySelectorAll('.node-btn').forEach(btn => {
    btn.addEventListener('click', () => handleCommand(btn.dataset.cmd));
});

function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += 0.001;
    renderer.render(scene, camera);
}

window.onload = () => {
    initNeuralEngine();
    animate();
    updateWallet(0);
};
