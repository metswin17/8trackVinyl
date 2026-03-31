'use strict';

// Array to store votes for each battle
let votes = [];

// Select all battles
const battleElements = document.querySelectorAll('section.battle');

// Initialize votes array for each battle
battleElements.forEach((battle, index) => {
 
  let savedVotes = localStorage.getItem('musicVotes');

if (savedVotes) {
  votes = JSON.parse(savedVotes);
} else {
  battleElements.forEach(() => {
    votes.push({ original: 0, cover: 0 });
  });
}

// Voting function
function vote(battleIndex, choice) {
  votes[battleIndex][choice]++;
  localStorage.setItem('musicVotes', JSON.stringify(votes));

  alert(`You voted for ${choice} in battle ${battleIndex + 1}!
    Original: ${votes[battleIndex].original} | Cover: ${votes[battleIndex].cover}`);

  // Optional: hide current battle and show next
  showNextBattle(battleIndex + 1);
}

// Function to show one battle at a time (optional)
function showNextBattle(index) {
  battleElements.forEach((battle, i) => {
    battle.style.display = i === index ? 'flex' : 'none';
  });
}

// Start with first battle visible
showNextBattle(0);

let startBtn = document.getElementById('start-btn');
let banner = document.getElementById('now-playing');

let originalImg = document.getElementById('original-img');
let coverImg = document.getElementById('cover-img');

let originalAudio = document.getElementById('original-audio');
let coverAudio = document.getElementById('cover-audio');

let votingEnabled = false;

startBtn.addEventListener('click', function () {

  votingEnabled = false;

  // ORIGINAL FIRST
  banner.textContent = "Now Playing: Original Song";

  originalImg.classList.add('front');
  coverImg.classList.remove('front');

  originalAudio.currentTime = 0;
  originalAudio.play();

});

originalAudio.addEventListener('ended', function () {

  banner.textContent = "Now Playing: Cover Song";

  coverImg.classList.add('front');
  originalImg.classList.remove('front');

  coverAudio.currentTime = 0;
  coverAudio.play();

});

coverAudio.addEventListener('ended', function () {

  banner.textContent = "Vote Your Favorite";

  votingEnabled = true;

});

let originalVotes = 0;
let coverVotes = 0;

document.getElementById('vote-original').addEventListener('click', function () {
  if (!votingEnabled) return;
  originalVotes++;
  console.log('Original:', originalVotes);
});

document.getElementById('vote-cover').addEventListener('click', function () {
  if (!votingEnabled) return;
  coverVotes++;
  console.log('Cover:', coverVotes);
});

let video = document.getElementById('record-video');

startBtn.addEventListener('click', function () {
  video.currentTime = 0;
  video.play();
});

coverAudio.addEventListener('ended', function () {
  video.pause();
});


