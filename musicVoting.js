'use strict';

let battles = document.querySelectorAll('.battle');
let votes = [];
let currentBattle = 0;

// Load saved votes
let saved = localStorage.getItem('musicVotes');
if (saved) {
  votes = JSON.parse(saved);

  if (votes.length !== battles.length) {
    votes = battles.map(() => ({ original: 0, cover: 0 }));
  }
} else {
  votes = battles.map(() => ({ original: 0, cover: 0 }));
}

// Attach listeners
battles.forEach((battle, index) => {
  let originalImg = battle.querySelector('.original-img');
  let coverImg = battle.querySelector('.cover-img');

  originalImg.addEventListener('click', () => vote(index, 'original'));
  coverImg.addEventListener('click', () => vote(index, 'cover'));
});

// Voting function
function vote(index, choice) {
  votes[index][choice]++;
  localStorage.setItem('musicVotes', JSON.stringify(votes));

  // move to next battle
  currentBattle++;

  if (currentBattle < battles.length) {
    showBattle(currentBattle);
  } else {
    alert('Voting complete! 🎉');
  }
}

// Show one battle at a time
function showBattle(index) {
  battles.forEach((battle, i) => {
    battle.style.display = i === index ? 'flex' : 'none';
  });
}

// Start first battle
showBattle(0);