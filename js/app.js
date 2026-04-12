'use strict';

console.log('app.js connected');

// ==============================
// SETUP
// ==============================

// Convert to real array
const battles = Array.from(document.querySelectorAll('.battle'));

let currentBattle = 0;
let votes = [];

const battlesData = [
  {
    original: "gJt1xSRmgfQ",
    cover: "p597VDvsekc"
  },
  {
    original: "gJt1xSRmgfQ",
    cover: "p597VDvsekc"
  }
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

let votingEnabled = false;

let originalPlayer;
let coverPlayer;

const startTime = 30;
const clipLength = 15;

// IMPORTANT: This must exist EXACTLY like this
function onYouTubeIframeAPIReady() {
  originalPlayer = new YT.Player('ytOriginal');
  coverPlayer = new YT.Player('ytCover');
}
// ==============================
// VIDEO DATA (YOUR CLIPS GO HERE)
// ==============================


// ==============================
// LOAD VIDEOS
// ==============================

function loadBattleVideos(index) {
  const data = battlesData[index];

  originalPlayer.loadVideoById({
    videoId: data.original,
    startSeconds: startTime
  });

  coverPlayer.loadVideoById({
    videoId: data.cover,
    startSeconds: startTime
  });
}

// ==============================
// PLAY BUTTONS
// ==============================

document.getElementById('play-original').addEventListener('click', () => {
  originalPlayer.playVideo();

  setTimeout(() => {
    originalPlayer.pauseVideo();
  }, clipLength * 1000);
});

document.getElementById('play-cover').addEventListener('click', () => {
  coverPlayer.playVideo();

  setTimeout(() => {
    coverPlayer.pauseVideo();
  }, clipLength * 1000);
});

// ==============================
// VOTING
// ==============================

function vote(index, choice) {
  votes[index][choice]++;
  localStorage.setItem('musicVotes', JSON.stringify(votes));

  currentBattle++;

  if (currentBattle < battles.length) {
    showBattle(currentBattle);
    loadBattleVideos(currentBattle);
  } else {
    alert('Voting complete! 🎉');
  }
}

// Attach vote buttons
document.getElementById('vote-original').addEventListener('click', () => {
  if (!votingEnabled) return;
  vote(currentBattle, 'original');
  
});

document.getElementById('vote-cover').addEventListener('click', () => {
  if (!votingEnabled) return;
  vote(currentBattle, 'cover');

});

// ==============================
// DISPLAY CONTROL
// ==============================

function showBattle(index) {
  battles.forEach((battle, i) => {
    battle.style.display = i === index ? 'flex' : 'none';
  });
}

// Start first battle
showBattle(0);

let playersReady = 0;


function onPlayerReady() {
  playersReady++;

  if (playersReady === 2) {
    setTimeout(() => {
      loadBattleVideos(0);
    }, 300);
  }
}



document.getElementById('start-btn').addEventListener('click', () => {
  currentBattle = 0;
  showBattle(0);
  loadBattleVideos(0);

  playBattleSequence();
});

function playBattleSequence() {
  votingEnabled = false;

  // ORIGINAL
  originalPlayer.seekTo(startTime);
  originalPlayer.playVideo();

  setTimeout(() => {

    // SWITCH TO COVER
    originalPlayer.pauseVideo();

    coverPlayer.seekTo(startTime);
    coverPlayer.playVideo();

    setTimeout(() => {

      coverPlayer.pauseVideo();
      votingEnabled = true;

      console.log("Voting enabled");

    }, clipLength * 1000);

  }, clipLength * 1000);
}

function nextBattle() {
  currentBattle++;

  if (currentBattle >= battles.length) {
    alert("All battles complete! 🎉");
    return;
  }

  showBattle(currentBattle);
  loadBattleVideos(currentBattle);

  // small delay so YouTube catches up
  setTimeout(() => {
    playBattleSequence();
  }, 300);
}
