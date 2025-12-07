// Navigation
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    document.querySelector(`button[onclick="switchTab('${tabId}')"]`).classList.add('active');
}

// Data
const ZODIAC_SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

// Helper: Deterministic Hash
function generateHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

// Feature 1: Kundali Logic
function generateKundali(e) {
    e.preventDefault();
    const name = document.getElementById('k-name').value;
    const dob = document.getElementById('k-dob').value;

    const seed = name + dob;
    renderChart(seed);
    renderPlanets(seed);

    document.getElementById('kundali-result').classList.remove('hidden');
}

function renderChart(seed) {
    const svg = document.getElementById('planets-layer');
    svg.innerHTML = '';
    const hash = generateHash(seed);

    // House Centers (Approx)
    const houseCenters = [
        { x: 200, y: 100 }, { x: 100, y: 50 }, { x: 50, y: 100 },
        { x: 100, y: 200 }, { x: 50, y: 300 }, { x: 100, y: 350 },
        { x: 200, y: 300 }, { x: 300, y: 350 }, { x: 350, y: 300 },
        { x: 300, y: 200 }, { x: 350, y: 100 }, { x: 300, y: 50 }
    ];

    PLANETS.forEach((planet, i) => {
        const houseIdx = (hash + i * 7) % 12;
        const pos = houseCenters[houseIdx];

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", pos.x);
        text.setAttribute("y", pos.y + (i % 2 === 0 ? 0 : 15)); // Stagger slightly
        text.setAttribute("text-anchor", "middle");
        text.textContent = planet.substring(0, 2);
        svg.appendChild(text);
    });

    // House Numbers
    const houseNums = [
        { x: 200, y: 180, n: 1 }, { x: 100, y: 100, n: 2 }, { x: 30, y: 30, n: 3 },
        { x: 100, y: 200, n: 4 }, { x: 30, y: 370, n: 5 }, { x: 100, y: 300, n: 6 },
        { x: 200, y: 220, n: 7 }, { x: 300, y: 300, n: 8 }, { x: 370, y: 370, n: 9 },
        { x: 300, y: 200, n: 10 }, { x: 370, y: 30, n: 11 }, { x: 300, y: 100, n: 12 }
    ];
    houseNums.forEach(h => {
        const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
        t.setAttribute("x", h.x); t.setAttribute("y", h.y);
        t.setAttribute("fill", "rgba(255,215,0,0.3)");
        t.textContent = h.n;
        svg.appendChild(t);
    });
}

function renderPlanets(seed) {
    const tbody = document.getElementById('planet-tbody');
    tbody.innerHTML = '';
    const hash = generateHash(seed);

    PLANETS.forEach((planet, i) => {
        const sign = ZODIAC_SIGNS[(hash + i * 3) % 12];
        const deg = (hash + i * 13) % 30;
        tbody.innerHTML += `<tr><td>${planet}</td><td>${sign}</td><td>${deg}°</td></tr>`;
    });
}

// Feature 2: Matchmaking Logic
function calculateMatch(e) {
    e.preventDefault();
    const bName = document.getElementById('b-name').value;
    const gName = document.getElementById('g-name').value;

    const seed = bName + gName;
    const hash = generateHash(seed);

    // Score 10-36
    const score = 10 + (hash % 27);

    document.getElementById('score-number').textContent = score;

    const verdictEl = document.getElementById('score-text');
    if (score >= 25) { verdictEl.textContent = "Excellent Match"; verdictEl.style.color = "#4ade80"; }
    else if (score >= 18) { verdictEl.textContent = "Average Match"; verdictEl.style.color = "#facc15"; }
    else { verdictEl.textContent = "Not Recommended"; verdictEl.style.color = "#f87171"; }

    renderKootas(score);
    document.getElementById('match-result').classList.remove('hidden');
}

function renderKootas(totalScore) {
    const tbody = document.getElementById('koota-tbody');
    tbody.innerHTML = '';

    const kootas = [
        { n: "Varna", m: 1 }, { n: "Vashya", m: 2 }, { n: "Tara", m: 3 }, { n: "Yoni", m: 4 },
        { n: "Graha Maitri", m: 5 }, { n: "Gana", m: 6 }, { n: "Bhakoot", m: 7 }, { n: "Nadi", m: 8 }
    ];

    let current = 0;
    kootas.forEach((k, i) => {
        let obt = 0;
        if (i === 7) {
            obt = Math.max(0, totalScore - current);
            if (obt > k.m) obt = k.m;
        } else {
            obt = Math.round(Math.random() * k.m);
            if (current + obt > totalScore) obt = 0;
        }
        current += obt;
        tbody.innerHTML += `<tr><td>${k.n}</td><td>${k.m}</td><td>${obt}</td></tr>`;
    });
}
