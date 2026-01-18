/**
 * EPIC TECH AI // MEDIA_INTERFACE_V2.3
 * CORE: UNIVERSAL_INJECTOR [IMAGE_VIDEO_AUDIO]
 */

let scene, camera, renderer, particles;
const terminalOutput = document.getElementById('terminal-output');
const dropZone = document.getElementById('drop-zone');
const mediaInput = document.getElementById('media-upload');

// --- TERMINAL BOOT SEQUENCE ---
function startTerminal() {
    document.getElementById('boot-overlay').style.display = 'none';
    document.getElementById('ui-container').style.display = 'flex';
    
    initNeuralEngine();
    animate();
    
    // Unlock Audio Context for all media types
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    logToTerminal('EPIC TECH AI CORE V2.3 ONLINE.', 'SYSTEM');
    logToTerminal('UNIVERSAL MEDIA INJECTOR: ACTIVE.', 'SYSTEM');
}

// --- NEURAL ENGINE SETUP ---
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

// --- UNIVERSAL MEDIA INJECTION ---
function processFile(file) {
    const reader = new FileReader();
    const assetDisplay = document.getElementById('asset-display');
    const mediaName = document.getElementById('media-name');

    logToTerminal(`INJECTING: ${file.name.toUpperCase()}`, 'NEURAL_DATA');
    mediaName.innerText = file.name.toUpperCase();

    reader.onload = (e) => {
        assetDisplay.innerHTML = ''; 

        // VIDEO HANDLER
        if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = e.target.result;
            video.autoplay = true;
            video.loop = true;
            video.playsInline = true;
            video.play().catch(() => logToTerminal('AUDIO_BLOCKED: CLICK TO UNMUTE', 'WARN'));
            assetDisplay.appendChild(video);
        } 
        // AUDIO HANDLER (MP3/WAV)
        else if (file.type.startsWith('audio/')) {
            const audio = new Audio(e.target.result);
            audio.play().catch(() => logToTerminal('AUDIO_BLOCKED: INTERACTION REQUIRED', 'WARN'));
            
            // Create a visual indicator for audio
            const visualizer = document.createElement('div');
            visualizer.className = 'audio-visual-mode';
            for(let i=0; i<5; i++) {
                const bar = document.createElement('div');
                bar.className = 'audio-bar';
                bar.style.animationDelay = `${i * 0.1}s`;
                visualizer.appendChild(bar);
            }
            assetDisplay.appendChild(visualizer);
            logToTerminal('AUDIO STREAM INITIALIZED.', 'SUCCESS');
        }
        // IMAGE HANDLER
        else if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = e.target.result;
            assetDisplay.appendChild(img);
        }
        
        gsap.from(assetDisplay, { duration: 0.8, opacity: 0, scale: 0.5, ease: "expo.out" });
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
}

// --- EVENT LISTENERS ---
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

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
