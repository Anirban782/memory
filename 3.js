const form = document.getElementById('memoryForm');
const imageUploader = document.getElementById('imageUploader');
const noteInput = document.getElementById('noteInput');
const memoryList = document.getElementById('memoryList');

// Load memories on page load
document.addEventListener('DOMContentLoaded', showMemories);

// Resize image function
function resizeImage(file, maxWidth, maxHeight, callback) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');

            // Calculate resize ratio
            let ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;

            // Draw resized image on canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Convert to Data URL (JPEG, quality 0.7)
            const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            callback(resizedDataUrl);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// Submit memory
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const file = imageUploader.files[0];
    const note = noteInput.value.trim();

    if (!file) {
        alert("Please upload an image!");
        return;
    }
    if (!note) {
        alert("Please write a memory!");
        return;
    }

    // Resize the image before saving
    resizeImage(file, 800, 800, function(resizedDataUrl){
        let memories = JSON.parse(localStorage.getItem('memories')) || [];
        memories.push({ image: resizedDataUrl, note });
        localStorage.setItem('memories', JSON.stringify(memories));
        form.reset();
        showMemories();
    });
});

// Display memories
function showMemories() {
    memoryList.innerHTML = '';
    const memories = JSON.parse(localStorage.getItem('memories')) || [];

    if (memories.length === 0) {
        memoryList.innerHTML = '<p>No memories shared yet 📖</p>';
        return;
    }

    memories.forEach((memory, index) => {
        const div = document.createElement('div');
        div.className = 'memory-item';
        div.innerHTML = `
            <img src="${memory.image}" alt="Memory">
            <p>${memory.note}</p>
            <div class="memory-actions">
                <button onclick="deleteMemory(${index})">Delete</button>
            </div>
        `;
        memoryList.appendChild(div);
    });
}

// Delete memory
function deleteMemory(index) {
    let memories = JSON.parse(localStorage.getItem('memories')) || [];
    if (confirm("Are you sure you want to delete this memory?")) {
        memories.splice(index, 1);
        localStorage.setItem('memories', JSON.stringify(memories));
        showMemories();
    }
}
