// Polling-based Whiteboard client
const ROOM_ID = "room_5673"; // Replace after gen_config
const API = "http://localhost:8000";
const FILTERS = ["blur"];

const select = document.getElementById("filter-select");
FILTERS.forEach(f => {
    const opt = document.createElement("option");
    opt.value = f;
    opt.textContent = f;
    select.appendChild(opt);
});

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
let drawing = false;

// Optional: Set canvas dimensions and line style explicitly
canvas.width = 800;  // Adjust as needed
canvas.height = 600; // Adjust as needed
ctx.lineWidth = 2;   // Make lines more visible
ctx.strokeStyle = 'black'; // Default color

canvas.addEventListener('mousedown', e => {
    drawing = true;
    const rect = canvas.getBoundingClientRect();
    const startCmd = { x: e.clientX - rect.left, y: e.clientY - rect.top, type: "start" };
    sendCommand(startCmd);
    draw(startCmd); // Draw locally immediately
});

canvas.addEventListener('mousemove', e => {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const lineCmd = { x: e.clientX - rect.left, y: e.clientY - rect.top, type: "line" };
    sendCommand(lineCmd);
    draw(lineCmd); // Draw locally immediately
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
    // No need for ctx.beginPath() here; handled by "start" command
});

document.getElementById('refresh').onclick = poll;

function draw(cmd) {
    if (cmd.type === "start") {
        ctx.beginPath();      // Start a new stroke
        ctx.moveTo(cmd.x, cmd.y); // Move to the starting point
    } else if (cmd.type === "line") {
        ctx.lineTo(cmd.x, cmd.y); // Draw line to the current point
        ctx.stroke();         // Render the line segment
    }
}

async function sendCommand(cmd) {
    await fetch(`${API}/draw/${ROOM_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cmd)
    });
    // Note: Add error handling in production (e.g., try-catch)
}

async function poll() {
    const res = await fetch(`${API}/draw/${ROOM_ID}`);
    const cmds = await res.json();
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    cmds.forEach(draw); // Redraw all commands in sequence
}

// Placeholder for applyFilter (to be implemented based on server capabilities)
document.getElementById("apply-filter")
     .addEventListener("click", applyFilter);

     async function applyFilter() {
      const { width, height } = canvas;
      // Отримуємо пікселі з Canvas
      const imgData = ctx.getImageData(0, 0, width, height);
      const dataArray = Array.from(imgData.data);  // Перетворюємо у звичайний масив
    
      const filterName = select.value;  // Обраний у селекті фільтр
    
      // Відправляємо POST-запит на бекенд з даними зображення
      const res = await fetch(`http://localhost:8000/filter/${ROOM_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_data: dataArray,
          filter_name: filterName,
          width,
          height
        })
      });
      const json = await res.json();  // Чекаємо відповідь
    
      // Отримуємо перетворені пікселі та малюємо назад на Canvas
      const newData = new Uint8ClampedArray(json.image_data);
      ctx.putImageData(new ImageData(newData, width, height), 0, 0);
    }
    

function applyFilter() {
    ctx.save();
ctx.globalCompositeOperation = "destination-over";
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.restore();
    const filter = select.value;
    console.log(`Applying filter: ${filter}`);
    // TODO: Implement filter logic, e.g., send filter request to server
    // Example: await fetch(`${API}/filter/${ROOM_ID}`, { method: 'POST', body: filter });
    poll(); // Refresh canvas after applying filter
}

// Initial data load
poll();