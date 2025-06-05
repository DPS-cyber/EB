// ===== TIME UPDATE =====
function updateTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  document.getElementById("location-time").textContent = `Your Time: ${hours}:${minutes} ${ampm}`;
}
updateTime();
setInterval(updateTime, 60000);


// ===== SCHEDULE PANEL TOGGLE =====
const scheduleToggle = document.getElementById('schedule-toggle');
const schedulePanel = document.getElementById('schedule-panel');
let scheduleOpen = false;

function toggleSchedule() {
  scheduleOpen = !scheduleOpen;
  if (scheduleOpen) {
    schedulePanel.style.left = '0';
    scheduleToggle.classList.add('open');
  } else {
    schedulePanel.style.left = '-300px';
    scheduleToggle.classList.remove('open');
  }
}


// ===== TIMETABLE TOGGLE =====
function showHalfDay() {
  document.getElementById('half-day-table').style.display = 'table';
  document.getElementById('full-day-table').style.display = 'none';
  document.getElementById('btn-halfday').classList.add('active');
  document.getElementById('btn-fullday').classList.remove('active');
}

function showFullDay() {
  document.getElementById('half-day-table').style.display = 'none';
  document.getElementById('full-day-table').style.display = 'table';
  document.getElementById('btn-fullday').classList.add('active');
  document.getElementById('btn-halfday').classList.remove('active');
}

window.onload = () => {
  showHalfDay();

  const savedGoals = localStorage.getItem('myGoals');
  if (savedGoals) {
    document.getElementById('goal-pad').value = savedGoals;
  }

  fetchWeatherByCity('Hyderabad');
};

// ===== SAVE & LOAD GOALS =====
function saveGoals() {
  const goals = document.getElementById('goal-pad').value;
  localStorage.setItem('myGoals', goals);
  alert('Goals saved!');
}


// ===== WEATHER FETCH BY CITY NAME =====
async function fetchWeatherByCity(city) {
  const apiKey = '48ddfe8c9cf29f95b7d0e54d6e171008';
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();
    displayWeather(data);
  } catch (error) {
    console.warn('Weather fetch failed for', city, error);
    if (city !== "Hyderabad") {
      fetchWeatherByCity("Hyderabad");
    } else {
      document.getElementById('weather').textContent = "Weather info unavailable.";
    }
  }
}

function displayWeather(data) {
  if (!data || !data.weather || !data.weather.length) {
    document.getElementById('weather').textContent = "No weather data available.";
    return;
  }

  const weatherMain = data.weather[0].main.toLowerCase();
  const temp = Math.round(data.main.temp);
  const cityName = data.name;
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  document.getElementById('weather').innerHTML =
    `<img src="${iconUrl}" alt="${weatherMain}" style="vertical-align:middle;width:30px;height:30px;"> ${cityName}: ${capitalize(weatherMain)} — ${temp}°C`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


// ===== CHATBOT =====
function sendMessage() {
  const input = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');
  const msg = input.value.trim();
  if (!msg) return;

  // Show user message
  const userMsg = document.createElement('div');
  userMsg.textContent = `You: ${msg}`;
  userMsg.style.color = 'cyan';
  chatBox.appendChild(userMsg);

  const lowerMsg = msg.toLowerCase();
  const normalizedMsg = lowerMsg.replace(/\s+/g, ' ').trim();
  let replyHTML = '';

  if (normalizedMsg.includes("weather")) {
    const cityMatch = msg.match(/weather in ([a-z\s]+)/i);
    const city = cityMatch ? cityMatch[1].trim() : "Hyderabad";
    fetchWeatherByCity(city);
    replyHTML = `Fetching weather for <b>${city}</b>...`;
  }
  else if (normalizedMsg.includes("time")) {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    replyHTML = `Your time: <b>${hours}:${minutes} ${ampm}</b>`;
  }
  else if (normalizedMsg.includes("hello") || normalizedMsg.includes("hi")) {
    replyHTML = "Hi! How can I help?";
  }
  else if (normalizedMsg.includes("goal")) {
    replyHTML = "Remember to save your goals!";
  }
  else if (normalizedMsg.includes("schedule")) {
    replyHTML = "Use the schedule panel toggle on the left.";
  }
  else if (
  normalizedMsg.includes("what all can you do") ||
  normalizedMsg.includes("what all can u do") ||
  normalizedMsg.includes("what can u do") ||
  normalizedMsg.includes("what can you do") ||
  normalizedMsg.includes("what are ur features") ||
  normalizedMsg.includes("what are your features") ||
  normalizedMsg.includes("feature") ||
  normalizedMsg.includes("features") ||
  normalizedMsg.includes("help")
) {
    replyHTML = `
      <b>Features:</b><br>
      - 🕒 Tell time<br>
      - 🌦️ Get weather info<br>
      - 🎯 Manage goals<br>
      - 📅 Schedule panel<br>
      - 🤖 Chat & assist<br>
      - 🔍 Google search fallback
    `;
  }
  else if (
  normalizedMsg.includes("most popular cbse teachers") ||
  normalizedMsg.includes("most loved cbse teachers in india") ||
  normalizedMsg.includes("teaching trio")
  ) {
    replyHTML = `
      <b>Popular CBSE Teachers:</b><br>
      - <a href="https://www.youtube.com/@ExpHub" target="_blank">Prashant Kirad (Science)</a><br>
      - <a href="https://www.youtube.com/@MathsByShobhitNirwan" target="_blank">Shobit Nirwan (Math)</a><br>
      - <a href="https://www.youtube.com/@DigrajSinghRajput214" target="_blank">Digraj Singh (SST)</a>
      "many more but no data,here's database:
       <a href="https://github.com/DPS-cyber/EB" target="_blank">Github repo</a>
    `;
  }
  else if (
  normalizedMsg.includes("study tips") ||
  normalizedMsg.includes("unlock potential") ||
  normalizedMsg.includes("unlock your full potential") ||
  normalizedMsg.includes("unlock ur full potential") ||
  normalizedMsg.includes("how to unlock your potential") ||
  normalizedMsg.includes("how to unlock ur potential") ||
  normalizedMsg.includes("neuroscience study") ||
  normalizedMsg.includes("how to study") ||
  normalizedMsg.includes("best way to study") ||
  normalizedMsg.includes("study better") ||
  normalizedMsg.includes("improve study habits") ||
  normalizedMsg.includes("study motivation")
  ) {
    replyHTML = `
      <b>Study Videos:</b><br>
      1. <a href="https://youtu.be/Ffh_6VkO0W8" target="_blank">Neuroscience with Andrew Huberman</a><br>
      "many more but no data,here's database:
       <a href="https://github.com/DPS-cyber/EB" target="_blank">Github repo</a>
    `;
  }
else if (
  normalizedMsg.includes("ai tools to study") ||
  normalizedMsg.includes("best ai tools for studying") ||
  normalizedMsg.includes("study tools using ai")
) {
  replyHTML = `
    <b>Popular AI Study Tools:</b><br>
    - 🧠 <a href="https://quizlet.com" target="_blank">Quizlet</a> — AI flashcards and study sets<br>
    - ✍️ <a href="https://grammarly.com" target="_blank">Grammarly</a> — AI writing assistant<br>
    - 📚 <a href="https://socratic.org" target="_blank">Socratic by Google</a> — AI problem solver<br>
    - 📖 <a href="https://chat.openai.com" target="_blank">ChatGPT</a> — AI study buddy for explanations<br><br>
    These are some of the most popular tools!
    "many more but no data,here's database:
       <a href="https://github.com/DPS-cyber/EB" target="_blank">Github repo</a>
  `;
}


  else {
    const query = encodeURIComponent(msg);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
    replyHTML = "Didn't get that, so I searched it on Google.";
  }

  // Show bot message with HTML
  const botMsg = document.createElement('div');
  botMsg.innerHTML = `Bot: ${replyHTML}`;
  botMsg.style.color = 'white';
  chatBox.appendChild(botMsg);

  chatBox.scrollTop = chatBox.scrollHeight;
  input.value = '';
}
const audio = document.getElementById('focus-audio');
const audioBtn = document.getElementById('audio-btn');

const audioTracks = [
 "https://github.com/DPS-cyber/EB/releases/download/v.1/Binaural-Beats-40hz.mp3",
  "https://github.com/DPS-cyber/EB/releases/download/v.1/electra.mp3",
  "https://github.com/DPS-cyber/EB/releases/download/v.1/lofi.mp3"
];

let currentIndex = 0;
const source = audio.querySelector('source');

// Set initial source and load
source.src = audioTracks[currentIndex];
audio.load();

let nextAudioPreloader = new Audio();
let preloadingIndex = (currentIndex + 1) % audioTracks.length;
nextAudioPreloader.src = audioTracks[preloadingIndex];
nextAudioPreloader.load();

// Warm up by playing muted and immediately pausing
audio.muted = true;
audio.play().then(() => {
  audio.pause();
  audioBtn.innerHTML = '<i class="fas fa-volume-mute"></i> Mute';
}).catch(() => {
  // Autoplay blocked, wait for user to toggle
});

function toggleAudio() {
  if (audio.paused || audio.muted) {
    audio.muted = false;
    audio.play().catch(() => {
      audio.addEventListener('canplaythrough', () => audio.play(), { once: true });
    });
    audioBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else {
    audio.pause();
    audio.muted = true;
    audioBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  }
}

function switchAudio() {
  currentIndex = (currentIndex + 1) % audioTracks.length;
  const newSrc = audioTracks[currentIndex];
  source.src = newSrc;
  audio.load();

  audio.muted = false;
  audio.play().catch(() => {
    audio.addEventListener('canplaythrough', () => audio.play(), { once: true });
  });

  audioBtn.innerHTML = '<i class="fas fa-volume-up"></i>';

  preloadingIndex = (currentIndex + 1) % audioTracks.length;
  nextAudioPreloader.src = audioTracks[preloadingIndex];
  nextAudioPreloader.load();
}
