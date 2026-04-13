'use strict';

console.log('app.js connected');

// ==============================
// SETUP
// ==============================
if (!window.YT) {
  let tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(tag);
}

// Convert to real array
const battles = Array.from(document.querySelectorAll('.battle'));

let currentBattle = 0;
let votes = [];

const battlesData = [
  {
    original: "gJt1xSRmgfQ", 
    cover: "ved4B_4DBrc"    
  },
  {
    original: "QJdipZ4_lpc",
    cover: "QMI1MSw2JCw"
  },
  {
    original: "KczYxdoJJjs",
    cover: "Up6xS_BiOfY"
  }
]; 


let playersAreReady = false;


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
const clipLength = 25;

let playersReady = 0;

function onPlayerReady() {
  playersReady++;
  console.log("Player ready:", playersReady);

  if (playersReady === 2) {
    console.log("Both players ready");

    playersAreReady = true;
  
    setTimeout(() => {
      loadBattleVideos(0);
    }, 500); // safer for refresh timing
  }
}

function onYouTubeIframeAPIReady() {
  originalPlayer = new YT.Player('ytOriginal', {
    playerVars: { playsinline: 1 },
    events: { onReady: onPlayerReady }
  });

  coverPlayer = new YT.Player('ytCover', {
    playerVars: { playsinline: 1 },
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
  const data = battlesData[index];

  originalPlayer.cueVideoById({
    videoId: data.original,
    startSeconds: startTime
  });

  coverPlayer.cueVideoById({
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




// ==============================
// START BUTTON
// ==============================

document.getElementById('start-btn').addEventListener('click', () => {

  if (!playersAreReady) {
    console.log("Players not ready yet");
    return;
  }

  currentBattle = 0;
  showBattle(0);

  loadBattleVideos(0);

  setTimeout(() => {
    playBattleSequence();
  }, 500);
});
// ==============================
// PLAY SEQUENCE
// ==============================

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


// ==============================
// NEXT BATTLE
// ==============================

function nextBattle() {
  currentBattle++;

  if (currentBattle >= battles.length) {
    alert("All battles complete! 🎉");
    return;
  }

  showBattle(currentBattle);
  loadBattleVideos(currentBattle);

  setTimeout(() => {
    playBattleSequence();
  }, 300);
}