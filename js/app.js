'use strict';

console.log('app.js connected');

let originalPlayer;
let coverPlayer;

let sequenceRunning = false;

let battleVideoReady = false;

let playersAreReady = false;

let votingEnabled = false;

let hasVotedThisRound = false;

let battles = [];
let currentBattle = 0;
let votes = [];

if (!window.YT) {
  let tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(tag);
}


const battlesData = [
  {
    original: "gJt1xSRmgfQ", 
    cover: "ved4B_4DBrc"    
  },
  {
    original: "5rW5vXAVDOg",
    cover: "5rW5vXAVDOg"
  },
  {
    original: "C9wp6BRdqZU",
    cover: "CWbXb7YxLNw"
  },
  {
    original: "RO8yzOTNYqs", 
    cover: "RO8yzOTNYqs"    
  },
]; 





// ==============================
// LOAD / INIT VOTES
// ==============================

let savedVotes = localStorage.getItem('musicVotes');

if (savedVotes) {
  votes = JSON.parse(savedVotes);
} else {
  votes = battles.map(() => ({ original: 0, cover: 0 }));
}

// ==============================
// YOUTUBE SETUP
// ==============================





const startTime = 30;
const clipLength = 25;

let playersReady = 0;

function onPlayerReady() {
  playersReady++;
  console.log("Player ready:", playersReady);

  if (playersReady === 2) {
    console.log("Both players ready");
    playersAreReady = true;

    document.getElementById('start-btn').disabled = false;
    document.getElementById('start-btn').textContent = "Start Battle";

    // 🔥 IMPORTANT: delay initialization slightly
    setTimeout(() => {
      showBattle(0);
      loadBattleVideos(0);
    }, 500);
  }
}

function onYouTubeIframeAPIReady() {
  originalPlayer = new YT.Player('ytOriginal', {
    playerVars: {
      playsinline: 1,
      autoplay: 0
    },
    events: { onReady: onPlayerReady }
  });

  coverPlayer = new YT.Player('ytCover', {
    playerVars: {
      playsinline: 1,
      autoplay: 0
    },
    events: { onReady: onPlayerReady }
  });
}

// ==============================
// VIDEO DATA (YOUR CLIPS GO HERE)
// ==============================


// ==============================
// LOAD VIDEOS
// ==============================

function loadBattleVideos(index) {
  if (!playersAreReady) return;

  battleVideoReady = false;

  const data = battlesData[index];

  originalPlayer.cueVideoById({
    videoId: data.original,
    startSeconds: startTime
  });

  coverPlayer.cueVideoById({
    videoId: data.cover,
    startSeconds: startTime
  });

  // ✅ SIMPLE + RELIABLE
  
}
// ==============================
// PLAY BUTTONS
// ==============================




// ==============================
// VOTING
// ==============================



function vote(index, choice) {
  console.log("VOTE CLICKED", {
    votingEnabled,
    hasVotedThisRound,
    currentBattle,
    index,
    choice
  });

  if (!votingEnabled || hasVotedThisRound) return;

  votes[index][choice]++;
  localStorage.setItem('musicVotes', JSON.stringify(votes));

  hasVotedThisRound = true;

  console.log("Voted:", choice);
}

// ==============================
// DISPLAY CONTROL
// ==============================

function showBattle(index) {

  if (!battles || !battles.length) {
    console.log("Battles not ready yet");
    return;
  }

  if (!battles[index]) {
    console.log("Invalid battle index:", index);
    return;
  }

  battles.forEach((battle, i) => {
    battle.style.display = i === index ? 'flex' : 'none';
  });

  const battle = battles[index];

  const originalImg = battle.querySelector('.original-img');
  const coverImg = battle.querySelector('.cover-img');

  if (originalImg) {
    originalImg.src = `https://img.youtube.com/vi/${battlesData[index].original}/0.jpg`;
  }

  if (coverImg) {
    coverImg.src = `https://img.youtube.com/vi/${battlesData[index].cover}/0.jpg`;
  }
}

// Start first battle


// ==============================
// START BUTTON
// ==============================



document.getElementById('start-btn').addEventListener('click', () => {
  if (!playersAreReady) return;

  console.log("START CLICKED");

  currentBattle = -1;
  sequenceRunning = false;

  document.getElementById('overlay').classList.add('active');
  document.body.classList.add('dimmed');

  nextBattle();
});
// ==============================
// PLAY SEQUENCE
// ==============================

function nextBattle() {

  if (window.battleTimer) {
    clearTimeout(window.battleTimer);
  }
  sequenceRunning = false;
  hasVotedThisRound = false;
  votingEnabled = false;

  currentBattle++;

  if (currentBattle >= battlesData.length) {
    console.log("All battles complete");

    document.getElementById('overlay').classList.remove('active');
    document.body.classList.remove('dimmed');

    resetVotingUI();

    originalPlayer.stopVideo();
    coverPlayer.stopVideo();

    showResultsChart();
    return;
  }

  showBattle(currentBattle);
  loadBattleVideos(currentBattle);

  setTimeout(() => {
    playBattleSequence();
  }, 800);
}

 


function playBattleSequence() {
  if (sequenceRunning) return;

  sequenceRunning = true;
  hasVotedThisRound = false;
  votingEnabled = false;

  resetVotingUI();

  document.getElementById('vote-message').textContent = "Listen carefully...";

  // PLAY ORIGINAL
  originalPlayer.playVideo();

  // switch to cover
  setTimeout(() => {
    originalPlayer.pauseVideo();
    coverPlayer.playVideo();

    // 🔥 ENABLE VOTING IMMEDIATELY WHEN COVER STARTS
    votingEnabled = true;

    document.getElementById('vote-message').textContent = "🔥 VOTE NOW!";

    document.getElementById('vote-original').classList.add('vote-glow');
    document.getElementById('vote-cover').classList.add('vote-glow');

    document.getElementById('vote-original').style.opacity = 1;
    document.getElementById('vote-cover').style.opacity = 1;

  }, clipLength * 1000);

  // pause cover near end
  setTimeout(() => {
    coverPlayer.pauseVideo();
  }, clipLength * 2 * 1000);

  // 🔥 ALWAYS ADVANCE BATTLE (this is the critical fix)
  clearTimeout(window.battleTimer);

  window.battleTimer = setTimeout(() => {
    nextBattle();
  }, clipLength * 2.2 * 1000);
}



function showResultsChart() {
  const totalOriginal = votes.reduce((sum, v) => sum + v.original, 0);
  const totalCover = votes.reduce((sum, v) => sum + v.cover, 0);

  const ctx = document.getElementById('resultsChart').getContext('2d');

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Original', 'Cover'],
      datasets: [{
        data: [totalOriginal, totalCover],
        backgroundColor: ['#4caf50', '#2196f3']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}



window.addEventListener('DOMContentLoaded', () => {
  battles = Array.from(document.querySelectorAll('.battle'));

  document.getElementById('vote-original').addEventListener('click', () => {
    vote(currentBattle, 'original');
  });
  
  document.getElementById('vote-cover').addEventListener('click', () => {
    vote(currentBattle, 'cover');
  });

  // ▶ TEST ORIGINAL BUTTON
  document.getElementById('play-original').addEventListener('click', () => {
    if (!playersAreReady) return;

    originalPlayer.loadVideoById({
      videoId: battlesData[currentBattle].original,
      startSeconds: startTime
    });
  });

  // ▶ TEST COVER BUTTON
  document.getElementById('play-cover').addEventListener('click', () => {
    if (!playersAreReady) return;

    coverPlayer.loadVideoById({
      videoId: battlesData[currentBattle].cover,
      startSeconds: startTime
    });
  });
});

function resetVotingUI() {
  votingEnabled = false;

  document.getElementById('vote-message').textContent = "Listen carefully...";

  const v1 = document.getElementById('vote-original');
  const v2 = document.getElementById('vote-cover');

  v1.classList.remove('vote-glow');
  v2.classList.remove('vote-glow');

  // dim BOTH during original
  v1.style.opacity = 0.3;
v2.style.opacity = 0.3;
}


