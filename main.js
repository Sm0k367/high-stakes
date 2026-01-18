/**
 * EPIC TECH AI // HIGH_STAKES ENGINE
 * CORE: NEURAL_INTERFACE_V1
 * POWERED BY: @TSI_ORG
 */

let scene, camera, renderer, particles;
const terminalOutput = document.getElementById('terminal-output');

// --- INITIALIZE NEURAL BACKGROUND ---
function initNeuralEngine() {
    const canvas = document.getElementById('neural-canvas');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create Neural Particle Web
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 8000; i++) {
        vertices.push(
            THREE.MathUtils.randFloatSpread(100),
            THREE.MathUtils.randFloatSpread(100),
            THREE.MathUtils.randFloatSpread(100)
        );
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    const material = new THREE.PointsMaterial({ 
        color: 0x00f2ff, 
        size: 0.1, 
        transparent: true, 
        opacity: 0.5 
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 30;
}

// --- TERMINAL LOGIC ---
function logToTerminal(message, type = 'SYSTEM') {
    const p = document.createElement('p');
    p.className = 'line';
    p.innerHTML = `<span style="color: #ff00ff">[${type}]</span> ${message}`;
    terminalOutput.appendChild(p);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function handleCommand(cmd) {
    logToTerminal(`EXECUTING: ${cmd}...`, 'USER');
    
    switch(cmd.toUpperCase()) {
        case 'SCAN_SOUND':
            logToTerminal('ACCESSING WEB_AUDIO_API... ANALYZING FREQUENCIES.');
            gsap.to(particles.rotation, { duration: 2, y: "+=6.28", ease: "power4.inOut" });
            break;
        case 'PULL_BACKPACK':
            logToTerminal('CONNECTING TO TSI_ORG CLOUD... RETRIEVING ASSETS.');
            break;
        case 'RENDER_NEURAL':
            logToTerminal('BYPASSING LOGIC GATES... RENDERING 15,000 PARTICLE CLOUD.');
            break;
        case 'SYNC_TSI':
            logToTerminal('UPLINK ESTABLISHED WITH @TSI_ORG INFRASTRUCTURE.');
            break;
        default:
            logToTerminal('COMMAND UNKNOWN. REDIRECTING TO EPIC TECH AI PROTOCOLS.');
    }
}

// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);
    
    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;

    // Dynamic scale based on "Neural Load"
    const time = Date.now() * 0.001;
    particles.scale.x = 1 + Math.sin(time) * 0.05;
    particles.scale.y = 1 + Math.cos(time) * 0.05;

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
    if (input.value) {
        handleCommand(input.value);
        input.value = '';
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
    logToTerminal('EPIC TECH AI CORE ONLINE.');
    logToTerminal('VERSION 1.0.420 - STABLE BUILD.');
    
    // Simulate system load variance
    setInterval(() => {
        const load = (Math.random() * 0.1).toFixed(3);
        document.getElementById('system-load').innerText = `${load}%`;
    }, 2000);
};
