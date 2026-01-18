/**
 * EPIC TECH AI // NEURAL_SEQUENCE_V2.7
 * CORE: SEQUENTIAL_DATA_STREAMER
 */

let scene, camera, renderer, particles;
let neuralQueue = [];
let currentQueueIndex = 0;
let currentActiveMedia = null;

const terminalOutput = document.getElementById('terminal-output');
const dropZone = document.getElementById('drop-zone');
const mediaInput = document.getElementById('media-upload');
const injectBtn = document.getElementById('inject-btn');
const portal = document.getElementById('fullscreen-video-portal');
const portalContent = document.getElementById('portal-content');
const queueDisplay = document.getElementById('queue-count');

// --- INITIALIZATION ---
window.startTerminal = function() {
    const bootOverlay = document.getElementById('boot-overlay');
    const uiContainer = document.getElementById('ui-container');
    
    gsap.to(bootOverlay, { duration: 1, opacity: 0, pointerEvents: 'none', onComplete: () => {
        bootOverlay.style.display = 'none';
        uiContainer.style.display = 'flex';
        initNeuralEngine();
        animate();
        logToTerminal('NEURAL LINK ESTABLISHED. READY FOR SEQUENCE.', 'SUCCESS');
    }});

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
};

// --- QUEUE ENGINE ---
function addToQueue(files) {
    const fileArray = Array.from(files);
    fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            neuralQueue.push({
                name: file.name,
                type: file.type,
                data: e.target.result
            });
            updateQueueDisplay();
            
            // If nothing is playing, start the stream
            if (neuralQueue.length === fileArray.length && currentActiveMedia === null) {
                playNextInSequence();
            }
        };
        reader.readAsDataURL(file);
    });
    logToTerminal(`${fileArray.length} ASSETS INJECTED INTO QUEUE.`, 'SYSTEM');
}

function updateQueueDisplay() {
    const remaining = neuralQueue.length - currentQueueIndex;
    queueDisplay.innerText = remaining.toString().padStart(2, '0');
    
    const nextUp = document.getElementById('next-up');
    if (neuralQueue[currentQueueIndex + 1]) {
        nextUp.innerText = `NEXT_UP: ${neuralQueue[currentQueueIndex + 1].name.substring(0, 20)}...`;
    } else {
        nextUp.innerText = "END_OF_SEQUENCE";
    }
}

function playNextInSequence() {
    if (currentQueueIndex >= neuralQueue.length) {
        logToTerminal('SEQUENCE COMPLETED.', 'FINISH');
        currentActiveMedia = null;
        return;
    }

    const asset = neuralQueue[currentQueueIndex];
    renderMedia(asset.data, asset.type, asset.name);
    updateQueueDisplay();
}

window.nextSequence = function() {
    if (currentActiveMedia) {
        currentActiveMedia.pause();
        currentActiveMedia = null;
    }
    currentQueueIndex++;
    playNextInSequence();
};

// --- RENDERER ---
function renderMedia(data, type, name) {
    const display = document.getElementById('asset-display');
    const label = document.getElementById('media-name');
    display.innerHTML = '';
    label.innerText = name.toUpperCase();

    if (type.startsWith('video/')) {
        openVideoPortal(data);
    } else if (type.startsWith('audio/')) {
        closePortal(); // Ensure we aren't stuck in video mode
        const audio = new Audio(data);
        currentActiveMedia = audio;
        audio.play();
        
        // Auto-advance when audio ends
        audio.onended = () => nextSequence();

        const container = document.createElement('div');
        container.className = 'audio-visual-container';
        for(let i=0; i<15; i++) {
            const bar = document.createElement('div');
            bar.className = 'visual-bar';
            bar.style.animationDuration = `${0.2 + Math.random() * 0.5}s`;
            container.appendChild(bar);
        }
        display.appendChild(container);
    } else {
        // Images play for 5 seconds then advance
        const img = document.createElement('img');
        img.src = data;
        img.style.maxWidth = "100%";
        display.appendChild(img);
        setTimeout(() => nextSequence(), 5000);
    }
}

function openVideoPortal(src) {
    portalContent.innerHTML = `<video id="portal-video" src="${src}" autoplay playsinline></video>`;
    portal.style.display = 'flex';
    const v = document.getElementById('portal-video');
    currentActiveMedia = v;
    
    // Auto-advance when video ends
    v.onended = () => {
        nextSequence();
    };
}

window.closePortal = function() {
    portal.style.display = 'none';
    portalContent.innerHTML = '';
};

// --- INTERFACE EVENTS ---
injectBtn.addEventListener('click', () => mediaInput.click());

mediaInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) addToQueue(e.target.files);
});

dropZone.addEventListener('dragover', (e) => e.preventDefault());
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) addToQueue(e.dataTransfer.files);
});

// --- ENGINE ---
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
    particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x00f2ff, size: 0.1, transparent: true, opacity: 0.8 }));
    scene.add(particles);
    camera.position.z = 50;
}

function animate() {
    requestAnimationFrame(animate);
    if(particles) {
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.0005;
    }
    renderer.render(scene, camera);
}

function logToTerminal(msg, type = 'SYSTEM') {
    const p = document.createElement('p');
    p.className = 'line';
    p.innerHTML = `<span style="color: #ff00ff">[${type}]</span> ${msg}`;
    terminalOutput.appendChild(p);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}
