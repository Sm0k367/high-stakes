let neuralQueue = [];
let currentQueueIndex = 0;
let currentActiveMedia = null;

// Ensure startTerminal is globally available
window.startTerminal = function() {
    const boot = document.getElementById('boot-overlay');
    const ui = document.getElementById('ui-container');
    
    gsap.to(boot, { duration: 0.8, opacity: 0, onComplete: () => {
        boot.style.display = 'none';
        ui.style.display = 'flex';
        initNeuralEngine();
        animate();
    }});
};

const mediaInput = document.getElementById('media-upload');
const injectBtn = document.getElementById('inject-btn');

injectBtn.addEventListener('click', (e) => {
    e.preventDefault();
    mediaInput.click();
});

mediaInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        addToQueue(e.target.files);
        // Reset value so same file can be re-injected
        e.target.value = ""; 
    }
});

function addToQueue(files) {
    const fileArray = Array.from(files);
    fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            neuralQueue.push({ name: file.name, type: file.type, data: ev.target.result });
            if (currentActiveMedia === null) playNext();
        };
        reader.readAsDataURL(file);
    });
}

function playNext() {
    if (currentQueueIndex >= neuralQueue.length) {
        currentActiveMedia = null;
        return;
    }
    const asset = neuralQueue[currentQueueIndex];
    render(asset);
}

function render(asset) {
    const display = document.getElementById('asset-display');
    display.innerHTML = "";
    
    if (asset.type.startsWith('video/')) {
        const portal = document.getElementById('fullscreen-video-portal');
        const content = document.getElementById('portal-content');
        content.innerHTML = `<video src="${asset.data}" autoplay style="width:100%"></video>`;
        portal.style.display = "flex";
        const v = content.querySelector('video');
        currentActiveMedia = v;
        v.onended = () => { currentQueueIndex++; playNext(); };
    } else if (asset.type.startsWith('audio/')) {
        const a = new Audio(asset.data);
        currentActiveMedia = a;
        a.play();
        a.onended = () => { currentQueueIndex++; playNext(); };
        display.innerHTML = `<div class="audio-visual-container">${Array(10).fill('<div class="visual-bar"></div>').join('')}</div>`;
    }
}

// Global skip for portal
window.nextSequence = () => {
    if (currentActiveMedia) currentActiveMedia.pause();
    currentQueueIndex++;
    playNext();
};

window.closePortal = () => {
    document.getElementById('fullscreen-video-portal').style.display = 'none';
};

// Neural Engine (Three.js) logic remains the same...
