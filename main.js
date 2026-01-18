/**
 * EPIC TECH AI // HIGH_STAKES ENGINE
 * CORE: NEURAL_INTERFACE_V2 [ECONOMY_ENABLED]
 * POWERED BY: @TSI_ORG
 */

let scene, camera, renderer, particles;
const terminalOutput = document.getElementById('terminal-output');
const dropZone = document.getElementById('drop-zone');
const mediaInput = document.getElementById('media-upload');

// --- SMOKEN_TOKEN ECONOMY ---
let smokenTokens = parseInt(localStorage.getItem('smoken_tokens')) || 0;

function updateWallet(amount) {
    smokenTokens += amount;
    localStorage.setItem('smoken_tokens', smokenTokens);
    document.getElementById('token-balance').innerText = smokenTokens.toString().padStart(4, '0');
    if (amount > 0) logToTerminal(`REWARD: +${amount} SMOKEN_TOKENS`, 'ECONOMY');
}

// --- INITIALIZE NEURAL ENGINE ---
function initNeuralEngine() {
    const canvas = document.getElementById('neural-canvas');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 6000; i++) {
        vertices.push(THREE.MathUtils.randFloatSpread(120), THREE.MathUtils.randFloatSpread(120), THREE.MathUtils.randFloatSpread(120));
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ color: 0x00f2ff, size: 0.12, transparent: true, opacity: 0.7 });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
    camera.position.z = 40;
}

// --- TERMINAL & COMMAND LOGIC ---
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

    switch(cleanCmd) {
        case 'SCAN_SOUND':
            updateWallet(5);
            gsap.to(particles.rotation, { duration: 1, y: "+=1.57", ease: "power2.out" });
            break;
        case 'INJECT_MEDIA':
            mediaInput.click();
            break;
        case 'SYNC_TSI':
            updateWallet(20);
            logToTerminal('SYNCING WITH @TSI_ORG CLOUD...');
            break;
        case 'PULL_BACKPACK':
            logToTerminal('RETRIEVING DIGITAL BACKPACK DATA...');
            break;
        default:
            logToTerminal('PROCESSING NEURAL REQUEST...');
    }
}

// --- MEDIA INJECTION LOGIC ---
function processFile(file) {
    const reader = new FileReader();
    const assetDisplay = document.getElementById('asset-display');
    const mediaName = document.getElementById('media-name');

    logToTerminal(`INJECTING: ${file.name}`, 'INJECTOR');
    mediaName.innerText = file.name.toUpperCase();
    updateWallet(50); // High reward for data injection

    reader.onload = (e) => {
        assetDisplay.innerHTML = '';
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = e.target.result;
            assetDisplay.appendChild(img);
        } else if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = e.target.result;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            assetDisplay.appendChild(video);
        }
        gsap.from(assetDisplay, { duration: 0.5, opacity: 0, scale: 0.5 });
    };
    reader.readAsDataURL(file);
}

// --- DRAG & DROP HANDLERS ---
dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', () => { dropZone.classList.remove('drag-over'); });
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
});

mediaInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
});

// --- ANIMATION & BOOT ---
function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += 0.001;
    renderer.render(scene, camera);
}

window.onload = () => {
    initNeuralEngine();
    animate();
    updateWallet(0); // Initialize wallet display
    logToTerminal('EPIC TECH AI CORE V2.0 ONLINE.');
};

document.getElementById('process-btn').addEventListener('click', () => {
    const input = document.getElementById('neural-input');
    handleCommand(input.value);
    input.value = '';
});

document.querySelectorAll('.node-btn').forEach(btn => {
    btn.addEventListener('click', () => handleCommand(btn.dataset.cmd));
});
