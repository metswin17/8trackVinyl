'use strict';

console.log('app.js connected');



let battleVideoReady = false;

if (!window.YT) {
  let tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(tag);
}

let battles = [];
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

  // 🔥 give YouTube time to actually load
  setTimeout(() => {
    battleVideoReady = true;
  }, 1200);
}

// ==============================
// PLAY BUTTONS
// ==============================

document.getElementById('play-original').addEventListener('click', () => {
  if (!playersAreReady) return;

  // 🔥 THIS LINE GOES HERE
  clearTimeout(window.battleTimer);

  originalPlayer.loadVideoById({
    videoId: battlesData[currentBattle].original,
    startSeconds: startTime
  });

  setTimeout(() => {
    originalPlayer.pauseVideo();
  }, clipLength * 1000);
});

document.getElementById('play-cover').addEventListener('click', () => {
  if (!playersAreReady) return;

  clearTimeout(window.battleTimer);

  coverPlayer.loadVideoById({
    videoId: battlesData[currentBattle].cover,
    startSeconds: startTime
  });

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

  if (!originalPlayer || !coverPlayer) {
    console.log("Players not ready");
    return;
  }

  currentBattle = 0;

  showBattle(0);

  setTimeout(() => {
    loadBattleVideos(0);

    setTimeout(() => {
      playBattleSequence();
    }, 800);

  }, 300);
});
// ==============================
// PLAY SEQUENCE
// ==============================

function playBattleSequence() {

  if (!battleVideoReady) {
    setTimeout(playBattleSequence, 300);
    return;
  }

  votingEnabled = false;

  originalPlayer.seekTo(startTime);
  originalPlayer.playVideo();

  setTimeout(() => {
    originalPlayer.pauseVideo();

    setTimeout(() => {
      coverPlayer.seekTo(startTime);
      coverPlayer.playVideo();
    }, 300);

    setTimeout(() => {
      coverPlayer.pauseVideo();

      votingEnabled = true;

      setTimeout(() => {
        nextBattle();
      }, 1500);

    }, clipLength * 1000);

  }, clipLength * 1000);
}


function nextBattle() {
  currentBattle++;

  if (!originalPlayer || !coverPlayer) {
    console.log("Players not ready yet");
    return;
  }

  votingEnabled = false;
  clearTimeout(window.battleTimer);

  if (originalPlayer && coverPlayer) {
    originalPlayer.stopVideo();
    coverPlayer.stopVideo();
  }

  showBattle(currentBattle);
  loadBattleVideos(currentBattle);

  setTimeout(() => {
    playBattleSequence();
  }, 1000);
}
 
window.addEventListener('DOMContentLoaded', () => {
  battles = Array.from(document.querySelectorAll('.battle'));
});

// ==============================
// MUSIC VOTING
// ==============================