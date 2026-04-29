(function () {
  'use strict';

  const STORAGE_KEY = 'kidHappyLearning';
  const STORAGE_VERSION = '1.0.0';
  const STARS_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000;
  const FOOTER_CLICK_COUNT = 5;

  const CATEGORY_NAMES = {
    letters: '字母乐园',
    words: '单词小屋',
    chinese: '汉字启蒙'
  };

  let content = null;
  let audioManager = null;
  let state = null;
  let quizState = null;
  let isTouchDevice = true;
  let footerClickCount = 0;
  let currentStoryLetterId = null;
  let isSpeaking = false;

  function getStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data.version !== STORAGE_VERSION) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      if (data.starsTimestamp && Date.now() - data.starsTimestamp > STARS_EXPIRY_MS) {
        data.stars = 0;
        data.starsTimestamp = Date.now();
      }
      return data;
    } catch (e) {
      return null;
    }
  }

  function saveStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }

  function initState() {
    const saved = getStorage();
    state = {
      version: STORAGE_VERSION,
      stars: saved?.stars ?? 0,
      starsTimestamp: saved?.starsTimestamp ?? Date.now(),
      visitedLetters: saved?.visitedLetters ?? [],
      visitedWords: saved?.visitedWords ?? [],
      visitedChinese: saved?.visitedChinese ?? [],
      quizStats: saved?.quizStats ?? {},
      quizHistory: saved?.quizHistory ?? [],
      privacyAccepted: saved?.privacyAccepted ?? false,
      highContrast: saved?.highContrast ?? false
    };
    if (state.highContrast) {
      document.documentElement.classList.add('high-contrast');
    }
  }

  function updateStarsDisplay() {
    const el = document.getElementById('starCount');
    if (el) el.textContent = state.stars;
  }

  function addStar() {
    state.stars += 1;
    state.starsTimestamp = Date.now();
    saveStorage();
    updateStarsDisplay();
  }

  function speak(text, lang) {
    if (!('speechSynthesis' in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang || 'zh-CN';
    utterance.rate = 0.85;
    utterance.pitch = 1.2;
    utterance.onstart = function () {
      isSpeaking = true;
    };
    utterance.onend = function () {
      isSpeaking = false;
    };
    utterance.onerror = function () {
      isSpeaking = false;
    };
    window.speechSynthesis.speak(utterance);
  }

  function playAudioOrSpeak(audioKey, text, lang) {
    if (audioManager && audioManager.sounds && audioManager.sounds[audioKey]) {
      audioManager.play(audioKey);
    } else {
      speak(text, lang);
    }
  }

  function AudioManager() {
    this.sounds = {};
    this.currentAudio = null;
  }

  AudioManager.prototype.loadSound = function (key, src) {
    try {
      if (typeof Howl !== 'undefined') {
        this.sounds[key] = new Howl({
          src: [src.replace('.mp3', '.webm'), src],
          html5: true,
          preload: false
        });
      }
    } catch (e) {
      console.warn('Failed to load sound:', key, e);
    }
  };

  AudioManager.prototype.play = function (key) {
    if (this.sounds[key]) {
      if (this.currentAudio) {
        this.currentAudio.stop();
      }
      this.sounds[key].play();
      this.currentAudio = this.sounds[key];
    } else {
      const src = key;
      try {
        const audio = new Audio(src);
        audio.play().catch(function () {});
        this.currentAudio = audio;
      } catch (e) {
        console.warn('Failed to play audio:', src, e);
      }
    }
  };

  AudioManager.prototype.stop = function () {
    if (this.currentAudio) {
      if (this.currentAudio.stop) {
        this.currentAudio.stop();
      } else if (this.currentAudio.pause) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }
      this.currentAudio = null;
    }
  };

  function initAudio() {
    audioManager = new AudioManager();
    if (content.letters) {
      content.letters.forEach(function (l) {
        audioManager.loadSound(l.id, l.audioFile);
        if (l.storyAudioFile) {
          audioManager.loadSound(l.id + '-story', l.storyAudioFile);
        }
      });
    }
    if (content.words) {
      content.words.forEach(function (w) {
        audioManager.loadSound(w.id, w.audioFile);
      });
    }
    if (content.chinese) {
      content.chinese.forEach(function (c) {
        audioManager.loadSound(c.id, c.audioFile);
      });
    }
    if (content.rewards) {
      audioManager.loadSound('star', content.rewards.starAudio);
      audioManager.loadSound('correct', content.rewards.correctAudio);
      audioManager.loadSound('wrong', content.rewards.wrongAudio);
    }
  }

  function detectTouch() {
    isTouchDevice = navigator.maxTouchPoints > 0;
    if (!isTouchDevice) {
      document.body.classList.add('no-touch');
    }
  }

   function showHomeView() {
     document.getElementById('homeView').classList.remove('hidden');
     document.getElementById('learningView').classList.add('hidden');
     // Remove car theme when returning to home view
     document.documentElement.classList.remove('car-theme');
   }

  function showLearningView(category) {
    document.getElementById('homeView').classList.add('hidden');
    document.getElementById('learningView').classList.remove('hidden');

    var titleEl = document.getElementById('learningTitle');
    titleEl.textContent = CATEGORY_NAMES[category];

    var grid = document.getElementById('learningGrid');
    grid.innerHTML = '';

    if (category === 'letters') {
      renderLetters(grid);
    } else if (category === 'words') {
      renderWords(grid);
    } else if (category === 'chinese') {
      renderChinese(grid);
    }
  }

  function renderLetters(grid) {
    content.letters.forEach(function (letter) {
      var card = createCard(
        'letter-card',
        letter.emoji,
        letter.letter,
        letter.word,
        function () {
          playAudioOrSpeak(letter.id, letter.letter, 'en-US');
          state.visitedLetters.push(letter.id);
          saveStorage();
          setTimeout(function () {
            showStory(letter);
          }, 1000);
        }
      );
      card.setAttribute('aria-label', '字母 ' + letter.letter + ' - ' + letter.word);
      grid.appendChild(card);
    });
  }

  function renderWords(grid) {
    content.words.forEach(function (word) {
      var card = createCard(
        'word-card',
        word.emoji,
        word.word,
        word.translation,
        function () {
          playAudioOrSpeak(word.id, word.word, 'en-US');
          state.visitedWords.push(word.id);
          saveStorage();
        }
      );
      card.setAttribute('aria-label', '单词 ' + word.word + ' - ' + word.translation);
      grid.appendChild(card);
    });
  }

  function renderChinese(grid) {
    content.chinese.forEach(function (cn) {
      var card = document.createElement('div');
      card.className = 'card chinese-card';
      card.tabIndex = 0;
      card.innerHTML =
        '<div class="card-emoji">' + cn.emoji + '</div>' +
        '<div class="card-main">' + cn.character + '</div>' +
        '<div class="card-sub">' + cn.pinyin + '</div>' +
        '<div class="card-phrase">' + cn.phrases.map(function (p) { return '<span>' + p + '</span>'; }).join('') + '</div>';
      card.addEventListener('click', function () {
        playAudioOrSpeak(cn.id, cn.character, 'zh-CN');
        state.visitedChinese.push(cn.id);
        saveStorage();
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
      card.setAttribute('aria-label', '汉字 ' + cn.character + ' - ' + cn.pinyin);
      grid.appendChild(card);
    });
  }

  function createCard(typeClass, emoji, mainText, subText, onClick) {
    var card = document.createElement('div');
    card.className = 'card ' + typeClass;
    card.tabIndex = 0;
    card.innerHTML =
      '<div class="card-emoji">' + emoji + '</div>' +
      '<div class="card-main">' + mainText + '</div>' +
      '<div class="card-sub">' + subText + '</div>';
    card.addEventListener('click', onClick);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
    return card;
  }

  function showStory(letter) {
    currentStoryLetterId = letter.id;
    var modal = document.getElementById('storyModal');
    document.getElementById('storyEmoji').textContent = letter.emoji;
    document.getElementById('storyText').textContent = letter.story;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('active');
    document.getElementById('storyModalClose').focus();
  }

  function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    if (audioManager) audioManager.stop();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isSpeaking = false;
  }

  function showRewardAnimation(text) {
    var el = document.getElementById('rewardAnimation');
    document.getElementById('rewardText').textContent = text;
    el.classList.add('active');
    setTimeout(function () {
      el.classList.remove('active');
    }, 1200);
  }

  function initQuiz() {
    quizState = {
      allQuestions: [],
      currentQuestion: null,
      answered: false,
      seenQuestions: state.quizHistory ? state.quizHistory.slice() : [],
      consecutiveCorrect: {},
      consecutiveWrong: {}
    };

    content.letters.forEach(function (l) {
      quizState.allQuestions.push({
        id: l.id,
        type: 'letter',
        question: '哪个字母代表 "' + l.word + '" ' + l.emoji + '？',
        correct: l.letter,
        emoji: l.emoji,
        pool: content.letters.map(function (x) { return x.letter; })
      });
    });

    content.words.forEach(function (w) {
      quizState.allQuestions.push({
        id: w.id,
        type: 'word',
        question: '"' + w.emoji + '" 的英文单词是什么？',
        correct: w.word,
        emoji: w.emoji,
        pool: content.words.map(function (x) { return x.word; })
      });
    });

    content.chinese.forEach(function (c) {
      quizState.allQuestions.push({
        id: c.id,
        type: 'chinese',
        question: '"' + c.emoji + '" 是哪个汉字？',
        correct: c.character,
        emoji: c.emoji,
        pool: content.chinese.map(function (x) { return x.character; })
      });
    });
  }

  function pickQuestion() {
    var unseen = quizState.allQuestions.filter(function (q) {
      return quizState.seenQuestions.indexOf(q.id) === -1;
    });

    var pool = unseen.length > 0 ? unseen : quizState.allQuestions.slice();

    var weights = pool.map(function (q) {
      var w = 1;
      if (quizState.consecutiveCorrect[q.id] && quizState.consecutiveCorrect[q.id] >= 3) {
        w = 0.3;
      }
      if (quizState.consecutiveWrong[q.id] && quizState.consecutiveWrong[q.id] >= 2) {
        w = 2;
      }
      return w;
    });

    var totalWeight = weights.reduce(function (a, b) { return a + b; }, 0);
    var rand = Math.random() * totalWeight;
    var cumulative = 0;
    for (var i = 0; i < pool.length; i++) {
      cumulative += weights[i];
      if (rand <= cumulative) {
        return pool[i];
      }
    }
    return pool[pool.length - 1];
  }

  function showQuiz() {
    quizState.answered = false;
    var q = pickQuestion();
    quizState.currentQuestion = q;

    document.getElementById('quizProgress').textContent =
      '已完成 ' + quizState.seenQuestions.length + '/' + quizState.allQuestions.length + ' 题';
    document.getElementById('quizQuestion').textContent = q.question;
    document.getElementById('quizEmoji').textContent = q.emoji;

    var options = [q.correct];
    var others = q.pool.filter(function (x) { return x !== q.correct; });
    shuffleArray(others);
    while (options.length < 3 && others.length > 0) {
      options.push(others.shift());
    }
    shuffleArray(options);

    var optionsEl = document.getElementById('quizOptions');
    optionsEl.innerHTML = '';
    options.forEach(function (opt) {
      var btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.tabIndex = 0;
      btn.addEventListener('click', function () { handleQuizAnswer(opt, btn); });
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
      optionsEl.appendChild(btn);
    });

    document.getElementById('quizFeedback').textContent = '';
    document.getElementById('quizNextBtn').classList.remove('visible');

    var modal = document.getElementById('quizModal');
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('active');
  }

  function handleQuizAnswer(selected, btnEl) {
    if (quizState.answered) return;
    quizState.answered = true;

    var q = quizState.currentQuestion;
    var feedbackEl = document.getElementById('quizFeedback');
    var allOptions = document.querySelectorAll('.quiz-option');

    if (selected === q.correct) {
      btnEl.classList.add('correct');
      addStar();
      audioManager.play('correct');
      var phrases = content.rewards.encouragePhrases;
      var phrase = phrases[Math.floor(Math.random() * phrases.length)];
      feedbackEl.textContent = '⭐ ' + phrase;
      showRewardAnimation(phrase);
      speak(phrase);

      quizState.consecutiveCorrect[q.id] = (quizState.consecutiveCorrect[q.id] || 0) + 1;
      quizState.consecutiveWrong[q.id] = 0;
    } else {
      btnEl.classList.add('wrong');
      audioManager.play('wrong');
      feedbackEl.textContent = '再试一次哦~ 正确答案是：' + q.correct;

      allOptions.forEach(function (opt) {
        if (opt.textContent === q.correct) {
          opt.classList.add('highlight');
        }
      });

      quizState.consecutiveWrong[q.id] = (quizState.consecutiveWrong[q.id] || 0) + 1;
      quizState.consecutiveCorrect[q.id] = 0;
    }

    if (quizState.seenQuestions.indexOf(q.id) === -1) {
      quizState.seenQuestions.push(q.id);
    }
    state.quizHistory = quizState.seenQuestions.slice();
    state.quizStats = quizState.consecutiveCorrect;
    saveStorage();

    document.getElementById('quizNextBtn').classList.add('visible');
  }

  function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  function showPrivacyModal() {
    var modal = document.getElementById('privacyModal');
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('active');
  }

  function acceptPrivacy() {
    state.privacyAccepted = true;
    saveStorage();
    closeModal('privacyModal');
  }

  function showParentModal() {
    document.getElementById('statStars').textContent = state.stars;
    document.getElementById('statLetters').textContent = state.visitedLetters.length + '/7';
    document.getElementById('statWords').textContent = state.visitedWords.length + '/6';
    document.getElementById('statChinese').textContent = state.visitedChinese.length + '/6';
    document.getElementById('highContrastToggle').checked = state.highContrast;

    var modal = document.getElementById('parentModal');
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('active');
  }

  function clearAllData() {
    if (confirm('确定要清除所有学习数据吗？此操作不可撤销。')) {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  }

  function toggleHighContrast(checked) {
    state.highContrast = checked;
    saveStorage();
    if (checked) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }

  function initFooterTriggers() {
    var triggers = document.getElementById('footerTriggers');
    triggers.addEventListener('click', function () {
      footerClickCount++;
      if (footerClickCount >= FOOTER_CLICK_COUNT) {
        footerClickCount = 0;
        showParentModal();
      }
    });
  }

  function initEventListeners() {
    document.getElementById('storyModalClose').addEventListener('click', function () {
      closeModal('storyModal');
    });

    document.getElementById('storyAudioBtn').addEventListener('click', function () {
      if (currentStoryLetterId) {
        var letter = content.letters.find(function (l) {
          return l.id === currentStoryLetterId;
        });
        if (letter && letter.storyAudioFile) {
          audioManager.play(currentStoryLetterId + '-story');
        } else if (letter && letter.story) {
          speak(letter.story, 'zh-CN');
        }
      }
    });

    document.getElementById('storyModal').addEventListener('click', function (e) {
      if (e.target === this) closeModal('storyModal');
    });

    document.getElementById('quizModalClose').addEventListener('click', function () {
      closeModal('quizModal');
    });

    document.getElementById('quizModal').addEventListener('click', function (e) {
      if (e.target === this) closeModal('quizModal');
    });

    document.getElementById('quizNextBtn').addEventListener('click', showQuiz);

    document.getElementById('privacyAcceptBtn').addEventListener('click', acceptPrivacy);

    document.getElementById('parentModalClose').addEventListener('click', function () {
      closeModal('parentModal');
    });

    document.getElementById('parentModal').addEventListener('click', function (e) {
      if (e.target === this) closeModal('parentModal');
    });

    document.getElementById('clearDataBtn').addEventListener('click', clearAllData);

    document.getElementById('showPrivacyBtn').addEventListener('click', function () {
      closeModal('parentModal');
      setTimeout(showPrivacyModal, 300);
    });

    document.getElementById('highContrastToggle').addEventListener('change', function (e) {
      toggleHighContrast(e.target.checked);
    });

    document.getElementById('backBtn').addEventListener('click', function () {
      showHomeView();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    });

     var categoryCards = document.querySelectorAll('.category-card');
     categoryCards.forEach(function (card) {
       card.addEventListener('click', function () {
         var category = card.getAttribute('data-category');
         var name = CATEGORY_NAMES[category];
         var welcomeText = '欢迎小朋友来到' + name;
         speak(welcomeText, 'zh-CN');
         // Apply car theme immediately
         document.documentElement.classList.add('car-theme');
         showLearningView(category);
       });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var modals = ['storyModal', 'quizModal', 'privacyModal', 'parentModal'];
        modals.forEach(function (id) {
          var modal = document.getElementById(id);
          if (modal.classList.contains('active')) {
            closeModal(id);
          }
        });
      }
    });
  }

  function initServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    }
  }

  function init() {
    detectTouch();
    initState();
    updateStarsDisplay();

    fetch('data/content.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        content = data;
        initAudio();
        initQuiz();
      })
      .catch(function (err) {
        console.error('Failed to load content:', err);
      });

    initEventListeners();
    initFooterTriggers();

    if (!state.privacyAccepted) {
      setTimeout(showPrivacyModal, 1000);
    }

    initServiceWorker();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
