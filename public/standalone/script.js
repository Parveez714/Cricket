// ===== Game State =====
let score = 0;
let isOut = false;
let isPlaying = false;
let history = [];
let audioContext = null;

// ===== Hand Emojis =====
const handEmojis = ["✊", "☝️", "✌️", "🤟", "🖐️", "🤙", "👊"];

// ===== DOM Elements =====
const scoreCard = document.getElementById("scoreCard");
const scoreValue = document.getElementById("scoreValue");
const resultCard = document.getElementById("resultCard");
const resultPlaceholder = document.getElementById("resultPlaceholder");
const resultContent = document.getElementById("resultContent");
const resultBadge = document.getElementById("resultBadge");
const resultText = document.getElementById("resultText");
const playerHandIcon = document.getElementById("playerHandIcon");
const playerHandValue = document.getElementById("playerHandValue");
const computerHandIcon = document.getElementById("computerHandIcon");
const computerHandValue = document.getElementById("computerHandValue");
const historyCard = document.getElementById("historyCard");
const historyList = document.getElementById("historyList");
const wicketModal = document.getElementById("wicketModal");
const modalScore = document.getElementById("modalScore");
const handButtons = document.querySelectorAll(".hand-button");

// ===== Audio Context =====
function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

// ===== Sound Effects =====
function playClick() {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.setValueAtTime(800, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.1);
}

function playScore(runs) {
  const ctx = getAudioContext();
  const baseFreq = 400 + runs * 50;

  for (let i = 0; i < Math.min(runs, 3); i++) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(baseFreq + i * 100, ctx.currentTime + i * 0.1);
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.15);

    oscillator.start(ctx.currentTime + i * 0.1);
    oscillator.stop(ctx.currentTime + i * 0.1 + 0.15);
  }
}

function playOut() {
  const ctx = getAudioContext();

  // Dramatic descending tone
  const oscillator1 = ctx.createOscillator();
  const gainNode1 = ctx.createGain();
  oscillator1.connect(gainNode1);
  gainNode1.connect(ctx.destination);

  oscillator1.frequency.setValueAtTime(600, ctx.currentTime);
  oscillator1.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
  oscillator1.type = "sawtooth";

  gainNode1.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

  oscillator1.start(ctx.currentTime);
  oscillator1.stop(ctx.currentTime + 0.5);

  // Crash sound (noise)
  const bufferSize = ctx.sampleRate * 0.3;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const noise = ctx.createBufferSource();
  const noiseGain = ctx.createGain();
  noise.buffer = noiseBuffer;
  noise.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  noiseGain.gain.setValueAtTime(0.2, ctx.currentTime + 0.1);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

  noise.start(ctx.currentTime + 0.1);
}

// ===== Update UI =====
function updateScoreDisplay() {
  scoreValue.textContent = score;
  
  if (isOut) {
    scoreCard.classList.add("out");
    scoreCard.classList.remove("highlight");
  }
}

function updateResultDisplay(playerHand, computerHand, result, runsScored) {
  resultPlaceholder.classList.add("hide");
  resultContent.classList.add("show");
  resultBadge.classList.add("show");

  playerHandIcon.textContent = handEmojis[playerHand];
  playerHandValue.textContent = playerHand;
  computerHandIcon.textContent = handEmojis[computerHand];
  computerHandValue.textContent = computerHand;

  // Reset animations
  resultBadge.classList.remove("run", "out");
  
  // Force reflow to restart animation
  void resultBadge.offsetWidth;

  if (result === "run") {
    resultBadge.classList.add("run");
    resultText.textContent = `+${runsScored} runs!`;
    scoreCard.classList.add("highlight");
  } else {
    resultBadge.classList.add("out");
    resultText.textContent = "OUT! 🏏💥";
    scoreCard.classList.remove("highlight");
  }
}

function updateHistory() {
  if (history.length === 0) {
    historyCard.classList.remove("show");
    return;
  }

  historyCard.classList.add("show");
  historyList.innerHTML = history.slice(-10).map(entry => `
    <div class="history-item ${entry.result}">
      <span>${handEmojis[entry.playerHand]}</span>
      <span class="vs">vs</span>
      <span>${handEmojis[entry.computerHand]}</span>
      <span class="result">${entry.result === "run" ? `+${entry.runsScored}` : "OUT"}</span>
    </div>
  `).join("");
}

function showWicketModal() {
  modalScore.textContent = score;
  wicketModal.classList.add("show");

  // Animate wicket elements
  setTimeout(() => {
    document.querySelectorAll(".stump, .bail, .ball").forEach(el => {
      el.classList.add("animate");
    });
  }, 100);
}

function hideWicketModal() {
  wicketModal.classList.remove("show");
  document.querySelectorAll(".stump, .bail, .ball").forEach(el => {
    el.classList.remove("animate");
  });
}

function setButtonsDisabled(disabled) {
  handButtons.forEach(btn => {
    btn.disabled = disabled;
  });
}

// ===== Game Logic =====
function playHand(value) {
  if (isOut || isPlaying) return;

  playClick();
  isPlaying = true;
  setButtonsDisabled(true);

  // Generate computer's hand (1-6)
  const computer = Math.floor(Math.random() * 6) + 1;

  if (value === computer) {
    // Out!
    isOut = true;
    history.push({ playerHand: value, computerHand: computer, result: "out", runsScored: 0 });
    updateResultDisplay(value, computer, "out", 0);
    updateHistory();
    updateScoreDisplay();

    setTimeout(() => {
      playOut();
      showWicketModal();
      isPlaying = false;
    }, 300);
  } else {
    // Scored runs
    score += value;
    history.push({ playerHand: value, computerHand: computer, result: "run", runsScored: value });
    updateResultDisplay(value, computer, "run", value);
    updateHistory();
    updateScoreDisplay();

    setTimeout(() => {
      playScore(value);
    }, 100);

    isPlaying = false;
    setButtonsDisabled(false);
  }
}

function resetGame() {
  playClick();
  hideWicketModal();

  score = 0;
  isOut = false;
  isPlaying = false;
  history = [];

  scoreValue.textContent = "0";
  scoreCard.classList.remove("out", "highlight");

  resultPlaceholder.classList.remove("hide");
  resultContent.classList.remove("show");
  resultBadge.classList.remove("show", "run", "out");

  historyCard.classList.remove("show");
  historyList.innerHTML = "";

  setButtonsDisabled(false);
}

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", () => {
  // Buttons already have onclick in HTML
  console.log("🏏 Hand Cricket loaded!");
});
