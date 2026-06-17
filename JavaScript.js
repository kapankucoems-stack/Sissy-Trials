// Funzione per generare il tag HTML corretto (img o video)
function getMediaHTML(filePath) {
  if (filePath.endsWith('.mp4')) {
    return `<video src="${filePath}" class="challenge-image" controls autoplay style="max-width: 100%; height: auto;"></video>`;
  } else {
    return `<img src="${filePath}" class="challenge-image intro-image" alt="Challenge">`;
  }
}

const categoryFolderMap = {
  anal: 'Anal',
  chastity: 'Chastity',
  oral: 'Oral',
  ballbusting: 'Ballbusting',
  hypno: 'Hypno'
};

function findIntroImageSrc(category, callback) {
  const folder = categoryFolderMap[category];
  if (!folder) {
    callback(null);
    return;
  }

  const basePath = `img/${folder}/Main${folder}`;
  const extensions = ['webp', 'jpg', 'jpeg', 'png'];
  let index = 0;

  function tryNext() {
    if (index >= extensions.length) {
      callback(null);
      return;
    }

    const src = `${basePath}.${extensions[index++]}`;
    const image = new Image();
    image.onload = () => callback(src);
    image.onerror = tryNext;
    image.src = src;
  }

  tryNext();
}

function renderCategoryIntroImages() {
  if (gameActive && gameMode !== 'choice') return;

  Object.keys(categoryFolderMap).forEach(category => {
    findIntroImageSrc(category, src => {
      if (!src) return;
      const contentElement = document.getElementById(`${category}Content`);
      if (contentElement) {
        contentElement.innerHTML = getMediaHTML(src);
      }
    });
  });
}

function enterChoiceSelection(type, contentId) {
  if (choiceTaskSelected && choiceCategorySelected === type) return;
  choiceTaskSelected = false;
  choiceCategorySelected = type;

  const selectedColumn = document.getElementById(contentId).closest('.col-md-4');
  const cols = document.querySelectorAll('.col-md-4');
  cols.forEach(col => {
    if (col === selectedColumn) {
      col.style.display = 'block';
      col.classList.add('offset-md-4');
    } else {
      col.style.display = 'none';
      col.classList.remove('offset-md-4');
    }
  });

  document.getElementById('gameButtons').style.display = 'block';
  const backButton = document.querySelector('#gameButtons .btn-warning');
  if (backButton) backButton.style.display = 'inline-block';
  const completeButton = document.querySelector('#gameButtons .btn-success');
  const failedButton = document.querySelector('#gameButtons .btn-danger');
  if (completeButton) completeButton.style.display = 'none';
  if (failedButton) failedButton.style.display = 'none';

  document.getElementById('choiceBackRow').style.display = 'none';
  document.getElementById('scoreDisplay').style.display = 'none';
  document.getElementById('modeInfo').textContent = 'Modalità: Choice';

  showChoiceTaskOptions(type, contentId);
}

function showChoiceTaskOptions(type, contentId) {
  const challenges = challengeData[type] || [];
  const contentDiv = document.getElementById(contentId);
  const buttonRows = challenges.map((challenge, index) => `
      <button type="button" class="btn btn-outline-primary btn-block mb-3" onclick="selectChoiceTask('${type}', ${index}, '${contentId}')">
        ${challenge.task}
      </button>
  `).join('');
  contentDiv.innerHTML = `
      <div>
        <h5 style="margin-bottom: 15px;">Scegli il task</h5>
        ${buttonRows}
      </div>
  `;
}

function selectChoiceTask(type, taskIndex, contentId) {
  const challenges = challengeData[type] || [];
  if (!challenges[taskIndex]) return;

  currentChallenge = challenges[taskIndex];
  choiceTaskSelected = true;

  const contentDiv = document.getElementById(contentId);
  contentDiv.innerHTML = `
      ${getMediaHTML(currentChallenge.image)}
      <p style="font-weight: bold; color: #e74c3c; font-size: 18px;">${currentChallenge.task}</p>
  `;

  const backButton = document.querySelector('#gameButtons .btn-warning');
  const completeButton = document.querySelector('#gameButtons .btn-success');
  const failedButton = document.querySelector('#gameButtons .btn-danger');
  if (backButton) backButton.style.display = 'inline-block';
  if (completeButton) completeButton.style.display = 'inline-block';
  if (failedButton) failedButton.style.display = 'inline-block';
}

function restoreChoiceModeView(mode = 'choice') {
  choiceTaskSelected = false;
  choiceCategorySelected = null;

  const heroCategories = ['anal', 'oral', 'ballbusting'];
  const cols = document.querySelectorAll('.col-md-4');
  cols.forEach(col => {
    const content = col.querySelector('[id$="Content"]');
    const category = content ? content.id.replace('Content', '') : '';
    if (mode === 'hero') {
      if (heroCategories.includes(category)) {
        col.style.display = 'block';
      } else {
        col.style.display = 'none';
      }
    } else {
      col.style.display = 'block';
    }
    col.classList.remove('offset-md-4');
  });

  document.getElementById('gameButtons').style.display = 'none';
  document.getElementById('choiceBackRow').style.display = 'block';
  document.getElementById('scoreDisplay').style.display = 'none';
  document.getElementById('modeInfo').textContent = mode === 'hero' ? 'Modalità: Hero' : 'Modalità: Choice';

  clearAllContent();
  renderCategoryIntroImages();
}

// Database di foto e task
const challengeData = {
  anal: [
    { image: "img/Anal/Anal1.mp4", task: "Task Anal 1: Insert 1 finger and massage slowly" },
    { image: "img/Anal/Anal2.mp4", task: "Task Anal 2: Insert 2 fingers and massage slowly" },
    { image: "img/Anal/Anal3.mp4", task: "Task Anal 3: Insert 3 fingers and massage slowly" },
    { image: "img/Anal/Anal4.mp4", task: "Task Anal 4: Ride your small dildo for 5 minutes at 100 bpm" },
    { image: "img/Anal/Anal5.mp4", task: "Task Anal 5: Ride your medium dildo for 5 minutes at 80 bpm" },
    { image: "img/Anal/Anal6.mp4", task: "Task Anal 6: Ride your medium dildo for 5 minutes at 110 bpm" },
    { image: "img/Anal/Anal7.mp4", task: "Task Anal 7: Insert your anal beads and remove them all" },
    { image: "img/Anal/Anal8.mp4", task: "Task Anal 8: Insert your anal beads and remove them all fastly" },
    { image: "img/Anal/Anal9.mp4", task: "Task Anal 9: Ride your large dildo for 5 minutes at 90 bpm" },
    { image: "img/Anal/Anal10.mp4", task: "Task Anal 10: Ride your large dildo for 5 minutes at 120 bpm" },
    { image: "img/Anal/Anal11.mp4", task: "Task Anal 11: Destroy your little boipussy ride your large dildo for 10 minute at 150 bpm" },
    { image: "img/Anal/Anal12.mp4", task: "Task Anal 12: Insert two dildos and ride them for 5minutes at 60bpm" },
    { image: "img/Anal/Anal13.mp4", task: "Task Anal 13: Insert a knotted dildo and ride it at your own pace for 10 minutes" },
    { image: "img/Anal/Anal14.mp4", task: "Task Anal 14: Ride a horse cock dildo for 5 minutes at 80 bpm " },
    { image: "img/Anal/Anal15.mp4", task: "Task Anal 15: Ride all your dildos for 2 minutes each at 100 bpm" }
  ],
  
  chastity: [
    { image: "img/Chastity/Chastity1.mp4", task: "Task Chastity 1: relax and get comfortable" },
    { image: "img/Chastity/Chastity2.mp4", task: "Task Chastity 2: put your chastity cage on" },
    { image: "img/Chastity/Chastity3.mp4", task: "Task Chastity 3: massage gently your balls" },
    { image: "img/Chastity/Chastity4.mp4", task: "Task Chastity 4: stroke your chastity cage" },
    { image: "img/Chastity/Chastity5.mp4", task: "Task Chastity 5: put a tighter cage on" },
    { image: "img/Chastity/Chastity6.mp4", task: "Task Chastity 6: put a flat chastity cage on" },
    { image: "img/Chastity/Chastity7.mp4", task: "Task Chastity 7: put a dildo on your flat chastity cage and stroke it" }
  ],
  oral: [
    { image: "img/Oral/Oral1.mp4", task: "Task Oral 1: Slowly lick your small dildo for 5 minutes" },
    { image: "img/Oral/Oral2.mp4", task: "Task Oral 2: suck your small dildo for 7 minutes at 80bpm" },
    { image: "img/Oral/Oral3.mp4", task: "Task Oral 3: Deepthroat your small dildo for 5 minutes at 70bpm" },
    { image: "img/Oral/Oral4.mp4", task: "Task Oral 4: Suck your medium dildo for 7 minutes at 100bpm" },
    { image: "img/Oral/Oral5.mp4", task: "Task Oral 5: Deepthroat your medium dildo for 5 minutes at 80bpm" },
    { image: "img/Oral/Oral6.mp4", task: "Task Oral 6: Suck your large dildo for 10 minutes at 120bpm" },
    { image: "img/Oral/Oral7.mp4", task: "Task Oral 7: Deepthroat your large dildo for 5 minutes at 90bpm" },
    { image: "img/Oral/Oral8.mp4", task: "Task Oral 8: Keep your large dildo in your mouth as long as you can" },
    { image: "img/Oral/Oral9.mp4", task: "Task Oral 9: Deepthroat your large dildo for 5 minutes at 100bpm be as messy as possible do not swallow your spit" },
    { image: "img/Oral/Oral10.mp4", task: "Task Oral 10: Deepthroat your large dildo for 5 minutes at 100bpm while watching your reflection on a mirror" },
    { image: "img/Oral/Oral11.mp4", task: "Task Oral 11: Get a large dildo and copy the girl in the video" },
    { image: "img/Oral/Oral12.mp4", task: "Task Oral 12: Destroy your throat by pushing two dildos inside your mouth" },

  ],
  ballbusting: [
    { image: "img/Ballbusting/Ballbusting1.mp4", task: "Task Ballbusting 1: gently squeeze your balls for 20 times" },
    { image: "img/Ballbusting/Ballbusting2.mp4", task: "Task Ballbusting 2: give yourself 40 light slaps on your balls" },
    { image: "img/Ballbusting/Ballbusting3.mp4", task: "Task Ballbusting 3: Tie your balls with a rope or with your chastity cage ring" },
    { image: "img/Ballbusting/Ballbusting4.mp4", task: "Task Ballbusting 4: slap your balls normally with a random object for 100 times" },
    { image: "img/Ballbusting/Ballbusting5.mp4", task: "Task Ballbusting 5: Squeeze your balls hard for 30 seconds and then a quick break of 15 seconds, do it 5times" },
    { image: "img/Ballbusting/Ballbusting6.mp4", task: "Task Ballbusting 6: Slap your balls hard with you hand 50 times" },
    { image: "img/Ballbusting/Ballbusting7.mp4", task: "Task Ballbusting 7: get a big dildo and plap your balls hard for 150 times" },
    { image: "img/Ballbusting/Ballbusting8.mp4", task: "Task Ballbusting 8: Destroy your balls by plapping with a huge dildo as fast as you can and as hard as you can for 2minutes" }
  ],
  hypno: [
    { image: "img/Hypno/Hypno1.mp4", task: "Task Hypno 1: Watch this video and concentrate on your breathing" },
    { image: "img/Hypno/Hypno2.mp4", task: "Task Hypno 2: Watch this video and rub your clitty" },
    { image: "img/Hypno/Hypno3.mp4", task: "Task Hypno 3: Watch this video and play with your tits" },
    { image: "img/Hypno/Hypno4.mp4", task: "Task Hypno 4: Watch this video and stroke a dildo" },
    { image: "img/Hypno/Hypno5.mp4", task: "Task Hypno 5: Watch this video and lick a dildo" },
    { image: "img/Hypno/Hypno6.mp4", task: "Task Hypno 6: Watch this video and wear panties" }
  ]
};

// Variabili di gioco
let gameScore = 0;
let gameActive = false;
let gameMode = null;
let currentChallenge = null;
let currentDifficulty = 'easy';
let challengeStartTime = null;
let challengeStreak = 0;
let choiceTaskSelected = false;
let choiceCategorySelected = null;
let selectedHeroCategory = null;
let heroTaskIndex = 0;
let heroCompletedCategories = new Set(); // Traccia quali categorie hero sono completate

// Sistema di progressione
let playerData = {
  totalPoints: 0,
  wins: 0,
  losses: 0,
  bestStreak: 0,
  bestScore: 0,
  totalTime: 0
};

// Funzione per inizializzare i dati del giocatore
function initializePlayer() {
  const saved = localStorage.getItem('sissy_trial_data');
  if (saved) {
    playerData = JSON.parse(saved);
  } else {
    localStorage.setItem('sissy_trial_data', JSON.stringify(playerData));
  }
}

// Funzione per salvare i dati
function savePlayerData() {
  localStorage.setItem('sissy_trial_data', JSON.stringify(playerData));
}


// Funzione per pulire tutti i contenuti
function clearAllContent() {
    document.getElementById('analContent').innerHTML = '';
    document.getElementById('chastityContent').innerHTML = '';
    document.getElementById('oralContent').innerHTML = '';
    document.getElementById('ballbustingContent').innerHTML = '';
    document.getElementById('hypnoContent').innerHTML = '';
}

// Anal Challenge
function analChallenge() {
    if (!gameActive) return;
    console.log("Anal Challenge attivato");
    showGameChallenge('anal', 'analContent');
}

// Buttplug category removed

// Chastity Challenge
function chastityChallenge() {
    if (!gameActive) return;
    console.log("Chastity Challenge attivato");
    showGameChallenge('chastity', 'chastityContent');
}

// Oral Challenge
function oralChallenge() {
    if (!gameActive) return;
    console.log("Oral Challenge attivato");
    showGameChallenge('oral', 'oralContent');
}

// Ballbusting Challenge
function ballbustingChallenge() {
    if (!gameActive) return;
    console.log("Ballbusting Challenge attivato");
    showGameChallenge('ballbusting', 'ballbustingContent');
}

// Hypno Challenge
function hypnoChallenge() {
    if (!gameActive) return;
    console.log("Hypno Challenge attivato");
    showGameChallenge('hypno', 'hypnoContent');
}

function startGame(mode) {
    console.log("Gioco iniziato in modalità: " + mode);
    initializePlayer();
    gameActive = true;
    document.body.classList.add('game-active');
    document.body.classList.toggle('choice-active', mode === 'choice');
    gameMode = mode;
    gameScore = 0;
    currentChallenge = null;
    selectedHeroCategory = null;
    heroTaskIndex = 0;
    choiceTaskSelected = false;
    challengeStreak = 0;

    if (mode === 'hero') {
        currentDifficulty = 'hero';
        heroCompletedCategories = new Set(); // Reset categorie completate per hero mode
    } else if (mode === 'random') {
        const difficulties = ['easy', 'medium', 'hard'];
        currentDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    } else {
        currentDifficulty = 'easy';
    }

    updateScoreDisplay();
    document.getElementById('scoreDisplay').style.display = (mode === 'random' || mode === 'hero') ? 'block' : 'none';
    document.getElementById('gameButtons').style.display = (mode === 'random') ? 'block' : 'none';
    document.getElementById('choiceBackRow').style.display = 'none';
    document.getElementById('randomModeBtn').style.display = 'none';
    document.getElementById('choiceModeBtn').style.display = 'none';
    document.getElementById('analHeroBtn').style.display = 'none';
    document.getElementById('modeInfo').textContent = mode === 'random' ? 'Modalità: Random' : mode === 'choice' ? 'Modalità: Choice' : 'Modalità: Hero';

    const cols = document.querySelectorAll('.col-md-4');
    if (mode === 'random') {
        cols.forEach((col, index) => {
            if (index === 0) {
                col.style.display = 'block';
                col.classList.add('offset-md-4');
            } else {
                col.style.display = 'none';
                col.classList.remove('offset-md-4');
            }
        });
        showNextChallenge();
    } else if (mode === 'hero') {
        const heroCategories = ['anal', 'oral', 'ballbusting'];
        cols.forEach(col => {
            const content = col.querySelector('[id$="Content"]');
            if (!content) return;
            const category = content.id.replace('Content', '');
            if (heroCategories.includes(category)) {
                col.style.display = 'block';
                col.classList.remove('offset-md-4');
            } else {
                col.style.display = 'none';
                col.classList.remove('offset-md-4');
            }
        });
        document.getElementById('gameButtons').style.display = 'none';
        document.getElementById('choiceBackRow').style.display = 'block';
        renderCategoryIntroImages();
    } else if (mode === 'choice') {
        cols.forEach(col => {
            col.style.display = 'block';
            col.classList.remove('offset-md-4');
        });
        document.getElementById('gameButtons').style.display = 'none';
        document.getElementById('choiceBackRow').style.display = 'block';
        renderCategoryIntroImages();
    }
}

function backToMenuOrChoice() {
    if (gameMode === 'choice') {
        restoreChoiceModeView();
    } else {
        stopGame();
    }
}

// Funzione per tornare al menu
function stopGame() {
    console.log("Ritorno al menu");
    gameActive = false;
    gameMode = null;
    selectedHeroCategory = null;
    choiceCategorySelected = null;
    heroCompletedCategories = new Set(); // Reset categorie hero
    clearAllContent();
    
    document.body.classList.remove('game-active');
    document.body.classList.remove('choice-active');
    
    // Nascondi punteggio e bottoni
    document.getElementById('scoreDisplay').style.display = 'none';
    document.getElementById('gameButtons').style.display = 'none';
    document.getElementById('choiceBackRow').style.display = 'none';
    document.getElementById('randomModeBtn').style.display = 'inline-block';
    document.getElementById('choiceModeBtn').style.display = 'inline-block';
    document.getElementById('analHeroBtn').style.display = 'inline-block';
    const cols = document.querySelectorAll('.col-md-4');
    cols.forEach(col => {
        col.style.display = 'block';
        col.classList.remove('offset-md-4');
    });
    // Ripristina il titolo
    document.getElementById('cardTitle').textContent = 'Anal';
    
    document.getElementById('cardsSection').style.display = 'flex';
    document.getElementById('modeInfo').textContent = '';
    renderCategoryIntroImages();
}

// Funzione per mostrare il prossimo task random (solo per modalità random)
function showNextChallenge() {
    let randomType;
    if (gameMode === 'hero') {
        randomType = selectedHeroCategory || ['anal', 'oral', 'ballbusting'][Math.floor(Math.random() * 3)];
    } else {
      const types = ['anal', 'chastity', 'oral', 'ballbusting', 'hypno'];
      randomType = types[Math.floor(Math.random() * types.length)];
    }
    const challenges = challengeData[randomType];
    currentChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    
    // Aggiorna il titolo della card
    const titleMap = {
      'anal': 'Anal',
      'chastity': 'Chastity',
      'oral': 'Oral',
      'ballbusting': 'Ballbusting',
      'hypno': 'Hypno'
    };
    document.getElementById('cardTitle').textContent = titleMap[randomType];
    
    // Pulisci tutto
    clearAllContent();
    
    // Inizia il cronometro
    challengeStartTime = Date.now();
    
    const contentDiv = document.getElementById(gameMode === 'hero' ? `${randomType}Content` : 'analContent');
    const difficultyColor = currentDifficulty === 'hero' ? '#9b59b6' : currentDifficulty === 'hard' ? '#e74c3c' : currentDifficulty === 'medium' ? '#f39c12' : '#27ae60';
    const difficultyLabel = currentDifficulty === 'hero' ? 'HERO' : currentDifficulty === 'hard' ? 'HARD' : currentDifficulty === 'medium' ? 'MEDIUM' : 'EASY';
    
    contentDiv.innerHTML = `
        ${getMediaHTML(currentChallenge.image)}
        <p style="font-weight: bold; color: #e74c3c; font-size: 18px;">${currentChallenge.task}</p>
        <p style="font-size: 14px; color: ${difficultyColor}; font-weight: bold;">Difficulty: ${difficultyLabel}</p>
    `;
}

function showNextHeroChallenge() {
    if (!selectedHeroCategory) return;

    const challenges = challengeData[selectedHeroCategory];
    if (heroTaskIndex >= challenges.length) {
        // Categoria completata: aggiungila al set
        heroCompletedCategories.add(selectedHeroCategory);
        
        // Controlla se tutte e 3 le categorie hero sono state completate
        const heroCategories = ['anal', 'oral', 'ballbusting'];
        if (heroCompletedCategories.size === heroCategories.length) {
                // Tutte le categorie completate: termina la partita senza modali
                stopGame();
                return;
        }
        
            // Una categoria è completata: torna alla selezione categorie senza modali
            restoreHeroModeView();
            return;
    }

    currentChallenge = challenges[heroTaskIndex];
    heroTaskIndex++;
    clearAllContent();

    const contentDiv = document.getElementById(`${selectedHeroCategory}Content`);
    const difficultyColor = currentDifficulty === 'hero' ? '#9b59b6' : currentDifficulty === 'hard' ? '#e74c3c' : currentDifficulty === 'medium' ? '#f39c12' : '#27ae60';
    const difficultyLabel = currentDifficulty === 'hero' ? 'HERO' : currentDifficulty === 'hard' ? 'HARD' : currentDifficulty === 'medium' ? 'MEDIUM' : 'EASY';

    contentDiv.innerHTML = `
        ${getMediaHTML(currentChallenge.image)}
        <p style="font-weight: bold; color: #e74c3c; font-size: 18px;">${currentChallenge.task}</p>
        <p style="font-size: 14px; color: ${difficultyColor}; font-weight: bold;">Difficulty: ${difficultyLabel}</p>
    `;
}

function enterHeroSelection(type, contentId) {
    selectedHeroCategory = type;
    choiceTaskSelected = true;

    const selectedColumn = document.getElementById(contentId).closest('.col-md-4');
    const cols = document.querySelectorAll('.col-md-4');
    cols.forEach(col => {
        if (col === selectedColumn) {
            col.style.display = 'block';
            col.classList.add('offset-md-4');
        } else {
            col.style.display = 'none';
            col.classList.remove('offset-md-4');
        }
    });

    document.getElementById('gameButtons').style.display = 'block';
    const backButton = document.querySelector('#gameButtons .btn-warning');
    if (backButton) backButton.style.display = 'none';
    const completeButton = document.querySelector('#gameButtons .btn-success');
    const failedButton = document.querySelector('#gameButtons .btn-danger');
    if (completeButton) completeButton.style.display = 'inline-block';
    if (failedButton) failedButton.style.display = 'inline-block';

    document.getElementById('choiceBackRow').style.display = 'none';
    document.getElementById('scoreDisplay').style.display = 'none';
    document.getElementById('modeInfo').textContent = 'Modalità: Hero';
}

// Funzione per mostrare il task durante il gioco (scelta)
function showGameChallenge(type, contentId) {
    if (gameMode === 'choice') {
        if (choiceTaskSelected) {
            return;
        }
        if (!choiceCategorySelected) {
            enterChoiceSelection(type, contentId);
        }
        return;
    }

    if (gameMode === 'random' && currentChallenge) {
        return;
    }

    if (gameMode === 'hero') {
        if (selectedHeroCategory && type !== selectedHeroCategory) {
            return;
        }
        if (!selectedHeroCategory) {
            enterHeroSelection(type, contentId);
        }
        clearAllContent();
        const challenges = challengeData[selectedHeroCategory];
        if (heroTaskIndex >= challenges.length) {
            heroTaskIndex = 0;
        }
        currentChallenge = challenges[heroTaskIndex];
        heroTaskIndex++;
    } else {
        if (gameMode === 'choice') {
            enterChoiceSelection(type, contentId);
        }
        clearAllContent();
        const challenges = challengeData[type];
        currentChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    }

    const contentDiv = document.getElementById(contentId);
    contentDiv.innerHTML = `
        ${getMediaHTML(currentChallenge.image)}
        <p style="font-weight: bold; color: #e74c3c; font-size: 18px;">${currentChallenge.task}</p>
    `;
}

// Funzione per completare il task
function completeChallenge() {
    console.log("Task completato!");
    const points = calculatePoints(10);
    gameScore += points;
    challengeStreak++;
    playerData.wins++;
    playerData.totalPoints += points;
    
    if (playerData.bestStreak < challengeStreak) {
        playerData.bestStreak = challengeStreak;
    }
    
    if (playerData.bestScore < gameScore) {
        playerData.bestScore = gameScore;
    }
    
    updateGameUI();
    
    if (gameMode === 'choice') {
        restoreChoiceModeView();
        savePlayerData();
        return;
    }
    
    if (gameMode === 'random') {
        setTimeout(showNextChallenge, 500);
    }
    if (gameMode === 'hero') {
        setTimeout(showNextHeroChallenge, 500);
    }
    
    savePlayerData();
}

// Funzione per fallire il task
function failChallenge() {
    console.log("Task fallito!");
    gameScore = Math.max(0, gameScore - 5);
    challengeStreak = 0;
    playerData.losses++;
    updateGameUI();
    
    // Controlla se i punti sono arrivati a 0
    if (gameScore <= 0) {
        showMessageModal('Game Over', `Hai perso! Il tuo punteggio è sceso a zero!\n\nPunti totali: ${playerData.totalPoints}`);
        stopGame();
        gameScore = 0;
        savePlayerData();
        return;
    }
    
    stopGame();
    savePlayerData();
}

// Funzione per aggiornare il display del punteggio
function updateScoreDisplay() {
    const multiplier = getPointMultiplier();
    document.getElementById('scoreDisplay').textContent = `Score: ${gameScore} | Streak: ${challengeStreak}x`;
}

// Funzione per ottenere il moltiplicatore di punti
function getPointMultiplier() {
    let multiplier = 1;
    if (currentDifficulty === 'medium') multiplier = 1.5;
    if (currentDifficulty === 'hard') multiplier = 2;
    if (currentDifficulty === 'hero') multiplier = 3;
    if (challengeStreak > 5) multiplier *= (1 + (challengeStreak - 5) * 0.1);
    if (gameMode === 'hero') multiplier *= 1.25;
    return multiplier;
}

// Funzione per calcolare punti con difficoltà
function calculatePoints(basePoints = 10) {
    const multiplier = getPointMultiplier();
    let points = Math.floor(basePoints * multiplier);
    
    // Bonus tempo
    if (challengeStartTime) {
        const timeElapsed = (Date.now() - challengeStartTime) / 1000;
        if (timeElapsed < 10) {
            points += 20;
        }
        if (gameMode === 'hero' && timeElapsed < 15) {
            points += 15;
        }
    }
    
    return points;
}

// Funzione per aggiornare UI di gioco
function updateGameUI() {
    updateScoreDisplay();
}

// ===== FUNZIONI UI MODALI =====

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showMessageModal(title, message) {
    document.getElementById('messageModalTitle').textContent = title;
    document.getElementById('messageModalBody').innerHTML = `<p>${message.replace(/\n/g, '<br>')}</p>`;
    document.getElementById('messageModal').style.display = 'block';
}

function showHeroCongratulationsModal() {
    // Achievement system removed: no modal shown
    return;
}

function showCategoryCompletedModal(category, completedCount, totalCategories) {
    // Achievement system removed: no modal shown
    return;
}

function restoreHeroModeView() {
    // Resetta la categoria selezionata e torna alla vista di selezione
    selectedHeroCategory = null;
    choiceTaskSelected = false;
    heroTaskIndex = 0;
    
    const cols = document.querySelectorAll('.col-md-4');
    const heroCategories = ['anal', 'oral', 'ballbusting'];
    
    cols.forEach(col => {
        const content = col.querySelector('[id$="Content"]');
        if (!content) return;
        const category = content.id.replace('Content', '');
        if (heroCategories.includes(category)) {
            col.style.display = 'block';
            col.classList.remove('offset-md-4');
        } else {
            col.style.display = 'none';
        }
    });
    
    document.getElementById('gameButtons').style.display = 'none';
    document.getElementById('choiceBackRow').style.display = 'block';
    document.getElementById('scoreDisplay').style.display = 'block';
    document.getElementById('modeInfo').textContent = 'Modalità: Hero';
    
    clearAllContent();
    renderCategoryIntroImages();
}
