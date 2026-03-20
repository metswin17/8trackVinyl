'use strict';

// Voting state
let votes = {
  original: 0,
  cover: 0
};

// Grab the images
const originalImg = document.getElementById('original-img');
const coverImg = document.getElementById('cover-img');

// Load saved votes from localStorage
let savedVotes = localStorage.getItem('hurtVotes');
if (savedVotes) {
  votes = JSON.parse(savedVotes);
}

// Voting click handlers
originalImg.addEventListener('click', () => vote('original'));
coverImg.addEventListener('click', () => vote('cover'));

function vote(choice) {
  votes[choice]++;
  localStorage.setItem('hurtVotes', JSON.stringify(votes));

  alert(`You voted for ${choice}!  
Original: ${votes.original} | Cover: ${votes.cover}`);
  
  // Optional: Load next battle here
}