/**
 * EPIC TECH AI // NEURAL_OVERRIDE_V2.6
 * CORE: STABLE_INJECTOR_SYSTEM
 */

let scene, camera, renderer, particles;
const terminalOutput = document.getElementById('terminal-output');
const dropZone = document.getElementById('drop-zone');
const mediaInput = document.getElementById('media-upload');
const injectBtn = document.getElementById('inject-btn');
const portal = document.getElementById('fullscreen-video-portal');
const portalContent = document.getElementById('portal-content');

// --- GATEWAY INITIALIZATION ---
window.startTerminal = function() {
    const bootOverlay = document.getElementById('boot-overlay');
    const uiContainer = document.getElementById('ui-container');
    
    gsap.to(bootOverlay, { duration: 1, opacity: 0, pointerEvents: 'none', onComplete: () => {
        bootOverlay.style.display = 'none';
        uiContainer.style.display = 'flex';
        initNeuralEngine();
        animate();
        logToTerminal('NEURAL LINK ESTABLISHED.', 'SUCCESS');
    }});

    // Unlock Audio Context
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
};

// --- THREE.JS ENGINE ---
function initNeuralEngine() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 8000; i++) {
        vertices.push(THREE.MathUtils.randFloatSpread(150), THREE.MathUtils.randFloatSpread(150), THREE.MathUtils.randFloatSpread(150));
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x00f2ff, size: 0.1, transparent: true, opacity: 0.8 }));
    scene.add(particles);
    camera.position.z = 50;
}

// --- CORE INJECTION LOGIC ---
function processFile(file) {
    if (!file) return;
    const reader = new FileReader();
    logToTerminal(`INJECTING: ${file.name.toUpperCase()}`, 'DATA');

    reader.onload = (e) => {
        const data = e.target.result;
        const type = file.type;

        if (type.startsWith('video/')) {
            openVideoPortal(data);
        } else {
            renderMedia(data, type, file.name);
        }
    };
    reader.readAsDataURL(file);
}

function renderMedia(data, type, name) {
    const display = document.getElementById('asset-display');
    const label = document.getElementById('media-name');
    display.innerHTML = '';
    label.innerText = name.toUpperCase();

    if (type.startsWith('audio/')) {
        const audio = new Audio(data);
        audio.play().catch(e => logToTerminal('AUDIO_ERROR: CLICK_UI_FIRST', 'ERROR'));
        
        const container = document.createElement('div');
        container.className = 'audio-visual-container';
        for(let i=0; i<15; i++) {
            const bar = document.createElement('div');
            bar.className = 'visual-bar';
            bar.style.animationDuration = `${0.2 + Math.random() * 0.5}s`;
            container.appendChild(bar);
        }
        display.appendChild(container);
        gsap.to(particles.rotation, { y: "+=6.28", duration: 5, repeat: -1, ease: "none" });
    } else if (type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = data;
        img.style.maxWidth = "100%";
        display.appendChild(img);
    }
    gsap.from(display, { duration: 0.5, scale: 0.8, opacity: 0 });
}

function openVideoPortal(src) {
    portalContent.innerHTML = `<video src="${src}" autoplay loop playsinline controls></video>`;
    portal.style.display = 'flex';
    gsap.from(portal, { opacity: 0, duration: 1 });
}

window.closePortal = function() {
    portalContent.innerHTML = '';
    portal.style.display = 'none';
};

// --- EVENTS ---
if(injectBtn) {
    injectBtn.addEventListener('click', () => {
        mediaInput.click();
    });
}

mediaInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        processFile(e.target.files[0]);
    }
});

// Drag and Drop
dropZone.addEventListener('dragover', (e) => { e.preventDefault(); });
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePortal();
});

function logToTerminal(msg, type = 'SYSTEM') {
    const p = document.createElement('p');
    p.className = 'line';
    p.innerHTML = `<span style="color: #ff00ff">[${type}]</span> ${msg}`;
    terminalOutput.appendChild(p);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function animate() {
    requestAnimationFrame(animate);
    if(particles) {
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.0005;
    }
    renderer.render(scene, camera);
}
