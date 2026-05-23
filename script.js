/**
 * Нүүдэлчин Наадамчид - Тоглоомын логик
 * 2026 он
 */

// --- Өгөгдөл ба Төлөв (State) ---
let readLessons = new Set();
let level = 1;
let score = 0;
let selectedShagai = [];
let horsePositions = [0, 0, 0];
let currentLang = 'mn';

const questions = [
    { 
        q: 'Шагай хэдэн янзаар буудаг вэ?', 
        a: '4', 
        c: ['2', '3', '4', '5'] 
    },
    { 
        q: 'Алаг мэлхий ямар чадварыг хөгжүүлдэг вэ?', 
        a: 'Дүрэм баримтлах', 
        c: ['Дүрэм баримтлах', 'Зураг зурах', 'Дуу дуулах', 'Усанд сэлэх'] 
    },
    { 
        q: 'Шагайн морь уралдуулах тоглоом хүүхдэд юуг сургадаг вэ?', 
        a: 'Тэвчээр', 
        c: ['Тэвчээр', 'Уурлах', 'Маргах', 'Залхуурах'] 
    }
];

const text = {
    mn: {
        heroTitle: 'Монгол наадгайгаар тоглоцгооё!',
        heroText: '7-11 насны сурагчдад зориулсан мэдлэг, тоглоом, урамшуулалтай үндэсний платформ'
    },
    en: {
        heroTitle: 'Let’s Play Mongolian Games!',
        heroText: 'A national learning platform with knowledge, games, and rewards for ages 7–11'
    }
};

// --- Хэлний тохиргоо ---
function changeLang(lang) {
    currentLang = lang;
    document.getElementById('heroTitle').innerText = text[lang].heroTitle;
    document.getElementById('heroText').innerText = text[lang].heroText;
    document.querySelectorAll('nav a').forEach(a => {
        a.innerText = a.getAttribute(`data-${lang}`);
    });
}

// --- Мэдлэг бататгах хэсэг ---
function markRead(n) {
    readLessons.add(n);
    showMessage(`👏 ${n}-р мэдлэг уншигдлаа. Нийт: ${readLessons.size}/3`, 'success');
    if (readLessons.size === 3) {
        startLevel1();
    }
}

// --- Тоглоомын үндсэн функцууд ---
function getRank() {
    if (score >= 100) return 'Монгол наадгай мастер 🥇';
    if (score >= 70) return 'Өв соёл судлаач 🥈';
    if (score >= 40) return 'Наадгай сонирхогч 🥉';
    return 'Шинэ суралцагч 🌱';
}

function updateUI() {
    document.getElementById('levelText').innerText = level;
    document.getElementById('scoreText').innerText = score;
    document.getElementById('rankText').innerText = getRank();
    document.getElementById('progressFill').style.width = Math.min(score, 100) + '%';
}

function showMessage(msg, type = '') {
    const box = document.getElementById('message');
    box.className = 'message ' + type;
    box.innerText = msg;
}

// --- Үеүүд (Levels) ---
function startLevel1() {
    level = 1;
    updateUI();
    document.getElementById('rewardBox').style.display = 'none';
    const q = questions[0];
    document.getElementById('gameBox').innerHTML = `
        <h3>❓ 1-р үе: Шагайн мэдлэг</h3>
        <p>${q.q}</p>
        <div class="choices">${q.c.map(x => `<button onclick="answerQuestion('${x}', '${q.a}', 2)">👉 ${x}</button>`).join('')}</div>`;
    showMessage('Зөв хариулбал 2-р үе нээгдэнэ.');
}

function answerQuestion(choice, answer, next) {
    if (choice === answer) {
        score += 20;
        level = next;
        updateUI();
        showMessage('🎉 Зөв байна! Дараагийн үе нээгдлээ.', 'success');
        if (next === 2) startLevel2();
        if (next === 3) startLevel3();
        if (next === 4) startLevel4();
    } else {
        showMessage('😊 Дахин оролдоорой. Мэдлэгээ дахин уншаарай.', 'error');
    }
}

function startLevel2() {
    const q = questions[1];
    document.getElementById('gameBox').innerHTML = `
        <h3>🐸 2-р үе: Алаг мэлхий</h3>
        <p>${q.q}</p>
        <div class="choices">${q.c.map(x => `<button onclick="answerQuestion('${x}', '${q.a}', 3)">👉 ${x}</button>`).join('')}</div>`;
}

function startLevel3() {
    selectedShagai = [];
    level = 3;
    updateUI();
    document.getElementById('gameBox').innerHTML = `
        <h3>🎲 3-р үе: Шагай ангилах</h3>
        <p>Зөвхөн морь шагайг сонгоорой. Морь = 🐎</p>
        <div class="shagai-row">
            ${['🐎','🐑','🐫','🐐','🐎','🐑','🐎','🐐'].map(x => `<div class="shagai" onclick="selectShagai(this, '${x}')">${x}</div>`).join('')}
        </div>
        <button class="btn" onclick="checkShagai()">✅ Шалгах</button>`;
    showMessage('Морь шагайнуудыг дарж сонгоорой.');
}

function selectShagai(el, type) {
    el.classList.toggle('selected');
    if (el.classList.contains('selected')) {
        selectedShagai.push(type);
    } else {
        const index = selectedShagai.indexOf(type);
        if (index > -1) selectedShagai.splice(index, 1);
    }
}

function checkShagai() {
    const ok = selectedShagai.length === 3 && selectedShagai.every(x => x === '🐎');
    if (ok) {
        score += 25;
        level = 4;
        updateUI();
        showMessage('🏅 Маш сайн! Морь шагайг зөв ялгалаа.', 'success');
        startLevel4();
    } else {
        showMessage('😊 Зөвхөн 3 морь шагайг сонгоорой.', 'error');
    }
}

function startLevel4() {
    const q = questions[2];
    document.getElementById('gameBox').innerHTML = `
        <h3>🐎 4-р үе: Морь уралдуулах асуулт</h3>
        <p>${q.q}</p>
        <div class="choices">${q.c.map(x => `<button onclick="answerRaceQuestion('${x}', '${q.a}')">👉 ${x}</button>`).join('')}</div>`;
}

function answerRaceQuestion(choice, answer) {
    if (choice === answer) {
        score += 20;
        level = 5;
        updateUI();
        showMessage('🎉 Зөв! Одоо морь уралдуулъя.', 'success');
        startRace();
    } else {
        showMessage('😊 Дахин оролдоорой.', 'error');
    }
}

// --- Морь уралдуулах (Race Game) ---
function startRace() {
    horsePositions = [0, 0, 0];
    document.getElementById('gameBox').innerHTML = `
        <h3>🏇 5-р үе: Шагайн морь уралдуулах</h3>
        <p>“Шагай хаях” товчийг дар. Морь буувал таны морь урагшилна.</p>
        <div class="horse-track">
            <div class="lane">Та: <span id="h0" class="horse">🐎</span></div>
            <div class="lane">Найз: <span id="h1" class="horse">🐎</span></div>
            <div class="lane">Багш: <span id="h2" class="horse">🐎</span></div>
        </div>
        <button class="btn" onclick="rollShagai()">🎲 Шагай хаях</button>
        <p id="rollResult"></p>`;
}

function rollShagai() {
    const sides = ['морь', 'хонь', 'тэмээ', 'ямаа'];
    const roll = sides[Math.floor(Math.random() * 4)];
    document.getElementById('rollResult').innerText = '🎲 Буусан тал: ' + roll;
    
    if (roll === 'морь') horsePositions[0] += 25;
    horsePositions[1] += Math.random() > .55 ? 18 : 5;
    horsePositions[2] += Math.random() > .6 ? 18 : 5;
    
    for (let i = 0; i < 3; i++) {
        document.getElementById('h' + i).style.marginLeft = Math.min(horsePositions[i], 85) + '%';
    }
    
    if (horsePositions[0] >= 85) {
        score = 100;
        updateUI();
        showReward(true);
    } else if (horsePositions[1] >= 85 || horsePositions[2] >= 85) {
        showReward(false);
    }
}

// --- Урамшуулал ба Дахин эхлүүлэх ---
function showReward(win) {
    const box = document.getElementById('rewardBox');
    box.style.display = 'block';
    if (win) {
        document.getElementById('badgeIcon').innerText = '🥇';
        document.getElementById('rewardTitle').innerText = 'Баяр хүргэе! Та түрүүллээ!';
        document.getElementById('rewardText').innerText = `Таны дүн: ${score}/100. Цол: ${getRank()}`;
        showMessage('🏆 Та Монгол наадгай мастер боллоо!', 'success');
        speakText('Баяр хүргэе. Та Монгол наадгай мастер боллоо.');
    } else {
        document.getElementById('badgeIcon').innerText = '🥈';
        document.getElementById('rewardTitle').innerText = 'Сайн оролдлоо!';
        document.getElementById('rewardText').innerText = 'Дахин тоглож оноогоо ахиулаарай.';
    }
}

function restartGame() {
    location.reload(); // Хуудсыг дахин ачаалж бүх төлөвийг шинэчилнэ
}

// --- Дуу хоолой (Accessibility) ---
function speakText(value) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = currentLang === 'en' ? 'en-US' : 'mn-MN';
    speechSynthesis.speak(utterance);
}

function stopSpeak() {
    speechSynthesis.cancel();
}

// Анхны ачаалалт
updateUI();