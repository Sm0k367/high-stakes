/**
 * EPIC TECH AI // MEDIA_INTERFACE_V2.4
 * CORE: PERSISTENT_BACKPACK_ENGINE
 */

let scene, camera, renderer, particles;
const terminalOutput = document.getElementById('terminal-output');
const dropZone = document.getElementById('drop-zone');
const mediaInput = document.getElementById('media-upload');

// --- DIGITAL BACKPACK STORAGE LOGIC ---
let smokenTokens = parseInt(localStorage.getItem('smoken_tokens')) || 0;

function updateWallet(amount) {
    smokenTokens += amount;
    localStorage.setItem('smoken_tokens', smokenTokens);
    document.getElementById('token-balance').innerText = smokenTokens.toString().padStart(4, '0');
    if (amount > 0) logToTerminal(`CREDIT: +${amount} SMOKEN_TOKENS`, 'ECONOMY');
}

function saveToBackpack(fileName, fileData, type) {
    localStorage.setItem('backpack_asset_name', fileName);
    localStorage.setItem('backpack_asset_data', fileData);
    localStorage.setItem('backpack_asset_type', type);
    document.getElementById('backpack-status').innerText = "DATA_LOADED";
    logToTerminal('NEURAL_DATA SAVED TO DIGITAL BACKPACK.', 'SYSTEM');
}

function pullBackpack() {
    const savedName = localStorage.getItem('backpack_asset_name');
    const savedData = localStorage.getItem('backpack_asset_data');
    const savedType = localStorage.getItem('backpack_asset_type');

    if (savedData) {
        logToTerminal(`RETRIEVING: ${savedName}`, 'BACKPACK');
        renderMedia(savedData, savedType, savedName);
    } else {
        logToTerminal('BACKPACK IS EMPTY.', 'WARNING');
    }
}

// --- TERMINAL BOOT SEQUENCE ---
function startTerminal() {
    document.getElementById('boot-overlay').style.display = 'none';
    document.getElementById('ui-container').style.display = 'flex';
    
    initNeuralEngine();
    animate();
    
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    updateWallet(0); // Initialize wallet display
    
    // Auto-pull from backpack on boot
    if(localStorage.getItem('backpack_asset_data')) {
        setTimeout(pullBackpack, 1000);
    }
}

// --- NEURAL ENGINE ---
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
    particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x00f2ff, size: 0.12, transparent: true, opacity: 0.7 }));
    scene.add(particles);
    camera.position.z = 40;
}

// --- UNIVERSAL RENDERER ---
function renderMedia(data, type, name) {
    const assetDisplay = document.getElementById('asset-display');
    const mediaName = document.getElementById('media-name');
    assetDisplay.innerHTML = '';
    mediaName.innerText = name.toUpperCase();

    if (type.startsWith('video/')) {
        const video = document.createElement('video');
        video.src = data;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;
        video.play();
        assetDisplay.appendChild(video);
    } else if (type.startsWith('audio/')) {
        const audio = new Audio(data);
        audio.play();
        const visualizer = document.createElement('div');
        visualizer.className = 'audio-visual-mode';
        for(let i=0; i<5; i++) {
            const bar = document.createElement('div');
            bar.className = 'audio-bar';
            bar.style.animationDelay = `${i * 0.1}s`;
            visualizer.appendChild(bar);
        }
        assetDisplay.appendChild(visualizer);
    } else if (type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = data;
        assetDisplay.appendChild(img);
    }
    gsap.from(assetDisplay, { duration: 0.8, opacity: 0, scale: 0.5, ease: "expo.out" });
}

// --- FILE PROCESSING ---
function processFile(file) {
    const reader = new FileReader();
    logToTerminal(`INJECTING: ${file.name.toUpperCase()}`, 'NEURAL_DATA');

    reader.onload = (e) => {
        const fileData = e.target.result;
        renderMedia(fileData, file.type, file.name);
        saveToBackpack(file.name, fileData, file.type);
        updateWallet(100); 
    };
    reader.readAsDataURL(file);
}

// --- SYSTEM UTILS ---
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
    if(cleanCmd === 'PULL_BACKPACK') pullBackpack();
    if(cleanCmd === 'PURGE_DATA') {
        localStorage.clear();
        location.reload();
    }
}

// --- LISTENERS ---
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
    particles.rotation.y += 0.0012;
    renderer.render(scene, camera);
}
