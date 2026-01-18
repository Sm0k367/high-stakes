/**
 * EPIC TECH AI // NEURAL_OVERRIDE_V2.5
 * CORE: IMMERSIVE_MEDIA_PORTAL
 */

let scene, camera, renderer, particles;
const terminalOutput = document.getElementById('terminal-output');
const dropZone = document.getElementById('drop-zone');
const mediaInput = document.getElementById('media-upload');
const injectBtn = document.getElementById('inject-btn');
const portal = document.getElementById('fullscreen-video-portal');
const portalContent = document.getElementById('portal-content');

// --- GATEWAY INITIALIZATION ---
function startTerminal() {
    gsap.to('#boot-overlay', { duration: 1.5, opacity: 0, scale: 2, ease: "expo.inOut", onComplete: () => {
        document.getElementById('boot-overlay').style.display = 'none';
        document.getElementById('ui-container').style.display = 'flex';
        
        // Stunner: Burst particles on entry
        gsap.to(particles.material, { size: 0.5, duration: 2, yoyo: true, repeat: 1 });
    }});

    initNeuralEngine();
    animate();
    
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

// --- THREE.JS NEURAL BACKGROUND ---
function initNeuralEngine() {
    const canvas = document.getElementById('neural-canvas');
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
    particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x00f2ff, size: 0.08, transparent: true, opacity: 0.8 }));
    scene.add(particles);
    camera.position.z = 50;
}

// --- MEDIA PORTAL LOGIC ---
function processFile(file) {
    const reader = new FileReader();
    logToTerminal(`INJECTING NEURAL DATA: ${file.name.toUpperCase()}`, 'CRITICAL');

    reader.onload = (e) => {
        const data = e.target.result;
        
        if (file.type.startsWith('video/')) {
            openVideoPortal(data);
        } else {
            renderMedia(data, file.type, file.name);
        }
    };
    reader.readAsDataURL(file);
}

function openVideoPortal(src) {
    portalContent.innerHTML = `<video src="${src}" autoplay loop playsinline></video>`;
    portal.style.display = 'flex';
    gsap.from(portal, { opacity: 0, duration: 1 });
    logToTerminal('IMMERSIVE_PORTAL_ACTIVE: ESC TO RETURN', 'SYSTEM');
}

function closePortal() {
    portalContent.innerHTML = '';
    portal.style.display = 'none';
    logToTerminal('PORTAL_CLOSED. RETURNING TO TERMINAL.', 'SYSTEM');
}

function renderMedia(data, type, name) {
    const display = document.getElementById('asset-display');
    const label = document.getElementById('media-name');
    display.innerHTML = '';
    label.innerText = name.toUpperCase();

    if (type.startsWith('audio/')) {
        const audio = new Audio(data);
        audio.play();
        
        // MIND-BLOW VISUALIZER
        const container = document.createElement('div');
        container.className = 'audio-visual-container';
        for(let i=0; i<15; i++) {
            const bar = document.createElement('div');
            bar.className = 'visual-bar';
            bar.style.animationDuration = `${0.2 + Math.random() * 0.5}s`;
            container.appendChild(bar);
        }
        display.appendChild(container);
        
        // Sync particles to audio vibe
        gsap.to(particles.rotation, { y: "+=6.28", duration: 10, repeat: -1, ease: "none" });
    } else if (type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = data;
        img.style.maxWidth = "100%";
        display.appendChild(img);
    }
}

// --- UTILS & EVENTS ---
function logToTerminal(msg, type = 'SYSTEM') {
    const p = document.createElement('p');
    p.className = 'line';
    p.innerHTML = `<span style="color: #ff00ff">[${type}]</span> ${msg}`;
    terminalOutput.appendChild(p);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

injectBtn.addEventListener('click', () => mediaInput.click());
mediaInput.addEventListener('change', (e) => {
    if (e.target.files[0]) processFile(e.target.files[0]);
});

// ESC Key closes portal
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePortal();
});

function animate() {
    requestAnimationFrame(animate);
    particles.rotation.x += 0.0005;
    particles.rotation.y += 0.0005;
    renderer.render(scene, camera);
}
