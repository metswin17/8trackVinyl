'use strict';

// Array to store votes for each battle
let votes = [];

// Select all battles
const battles = document.querySelectorAll('.battle');

// Initialize votes array for each battle
battles.forEach((battle, index) => {
  votes.push({ original: 0, cover: 0 });

  const originalImg = battle.querySelector('.original-img');
  const coverImg = battle.querySelector('.cover-img');

  // Event listeners for each battle
  originalImg.addEventListener('click', () => vote(index, 'original'));
  coverImg.addEventListener('click', () => vote(index, 'cover'));
});

// Load votes from localStorage if available
let savedVotes = localStorage.getItem('musicVotes');
if (savedVotes) {
  votes = JSON.parse(savedVotes);
}

// Voting function
function vote(battleIndex, choice) {
  votes[battleIndex][choice]++;
  localStorage.setItem('musicVotes', JSON.stringify(votes));

  alert(`You voted for ${choice} in battle ${battleIndex + 1}!\n` +
        `Original: ${votes[battleIndex].original} | Cover: ${votes[battleIndex].cover}`);

  // Optional: hide current battle and show next
  showNextBattle(battleIndex + 1);
}

// Function to show one battle at a time (optional)
function showNextBattle(index) {
  battles.forEach((battle, i) => {
    battle.style.display = i === index ? 'flex' : 'none';
  });
}

// Start with first battle visible
showNextBattle(0);