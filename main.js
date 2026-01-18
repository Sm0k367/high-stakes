/**
 * EPIC TECH AI // HIGH_STAKES ENGINE
 * CORE: NEURAL_INTERFACE_V1
 * POWERED BY: @TSI_ORG
 */

let scene, camera, renderer, particles, lineMesh;
const terminalOutput = document.getElementById('terminal-output');

// --- INITIALIZE NEURAL ENGINE ---
function initNeuralEngine() {
    const canvas = document.getElementById('neural-canvas');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create Neural Particle Web
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 5000; i++) {
        vertices.push(
            THREE.MathUtils.randFloatSpread(100),
            THREE.MathUtils.randFloatSpread(100),
            THREE.MathUtils.randFloatSpread(100)
        );
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    const material = new THREE.PointsMaterial({ 
        color: 0x00f2ff, 
        size: 0.15, 
        transparent: true, 
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 50;
}

// --- TERMINAL LOGIC ---
function logToTerminal(message, type = 'SYSTEM') {
    const p = document.createElement('p');
    p.className = 'line';
    const timestamp = new Date().toLocaleTimeString().split(' ')[0];
    p.innerHTML = `<span style="color: #ff00ff; opacity: 0.7;">[${timestamp}]</span> <span style="color: #ff00ff">[${type}]</span> ${message}`;
    terminalOutput.appendChild(p);
    
    // Auto-scroll to bottom
    const frame = document.querySelector('.scanner-frame');
    frame.scrollTop = frame.scrollHeight;
}

function handleCommand(cmd) {
    const cleanCmd = cmd.trim().toUpperCase();
    if(!cleanCmd) return;

    logToTerminal(`EXECUTING: ${cleanCmd}`, 'USER');
    
    switch(cleanCmd) {
        case 'SCAN_SOUND':
            logToTerminal('ACCESSING WEB_AUDIO_API... ANALYZING FREQUENCIES.');
            gsap.to(particles.rotation, { duration: 1.5, y: "+=3.14", ease: "expo.out" });
            break;
        case 'PULL_BACKPACK':
            logToTerminal('SYNCING DIGITAL BACKPACK... LOADING TSI_ORG ASSETS.');
            gsap.to(".neural-orb", { duration: 0.5, scale: 1.5, repeat: 1, yoyo: true });
            break;
        case 'RENDER_NEURAL':
            logToTerminal('BYPASSING LOGIC GATES... OPTIMIZING GPU SHADERS.');
            particles.material.color.setHex(0xff00ff);
            setTimeout(() => particles.material.color.setHex(0x00f2ff), 1000);
            break;
        case 'SYNC_TSI':
            logToTerminal('UPLINK ESTABLISHED. HANDSHAKE COMPLETE WITH @TSI_ORG.');
            document.getElementById('uplink-status').innerText = 'SECURE_LINK';
            document.getElementById('uplink-status').style.color = '#ff00ff';
            break;
        default:
            logToTerminal(`UNRECOGNIZED NODE: ${cleanCmd}. REDIRECTING...`);
    }
}

// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    particles.rotation.y += 0.002;
    particles.rotation.x += 0.001;

    // Organic breathing motion
    particles.scale.x = 1 + Math.sin(time) * 0.1;
    particles.scale.y = 1 + Math.sin(time) * 0.1;

    renderer.render(scene, camera);
}

// --- EVENT LISTENERS ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.getElementById('process-btn').addEventListener('click', () => {
    const input = document.getElementById('neural-input');
    handleCommand(input.value);
    input.value = '';
});

document.getElementById('neural-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleCommand(e.target.value);
        e.target.value = '';
    }
});

document.querySelectorAll('.node-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        handleCommand(btn.dataset.cmd);
    });
});

// --- BOOT SEQUENCE ---
window.onload = () => {
    initNeuralEngine();
    animate();
    
    logToTerminal('EPIC TECH AI // HIGH_STAKES CORE ONLINE.');
    logToTerminal('NEURAL INTERFACE STABILIZED.');
    
    // Simulate system load variance
    setInterval(() => {
        const load = (Math.random() * 0.1).toFixed(3);
        document.getElementById('system-load').innerText = `${load}%`;
    }, 3000);
};
