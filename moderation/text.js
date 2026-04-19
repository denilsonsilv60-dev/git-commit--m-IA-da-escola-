// 🔥 Categorias principais
const categories = {
  leve: [
    "idiota","burro","otario","lixo","feio","horrivel",
    "chato","bobo","palhaco","fracassado"
  ],

  media: [
    "inutil","nojento","escroto","babaca","imbecil",
    "ridiculo","merda","bosta"
  ],

  grave: [
    "matar","morte","suicidio","estuprar"
  ]
};

// 🔥 Gírias ofensivas
const slangs = new Set([
  "fdp","vsf","tmnc","pqp","krl","caralho","porra",
  "foder","vai se foder","seu fdp"
]);

// 🔥 Substituições (anti-bypass)
const replacements = {
  "1": "i", "0": "o", "@": "a", "3": "e",
  "$": "s", "!": "i", "4": "a", "7": "t"
};

// 🔥 Normalização (robusta)
function normalizeText(text = "") {
  let t = String(text).toLowerCase();

  // remove acentos corretamente
  t = t.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // substituições anti-bypass
  for (const [k, v] of Object.entries(replacements)) {
    t = t.split(k).join(v);
  }

  // remove símbolos
  t = t.replace(/[^a-z0-9\s]/g, " ");

  // limpa espaços
  return t.replace(/\s+/g, " ").trim();
}

// 🔥 Tokenização
function tokenize(text) {
  return text.length ? text.split(" ") : [];
}

// 🔥 Bullying patterns
function detectBullying(text) {
  const patterns = [
    "voce e","vc e","tu e",
    "ninguem gosta de voce",
    "vai se matar","se matar",
    "te odeio","ninguem te quer"
  ];

  return patterns.some(p => text.includes(p));
}

// 🔥 Spam detector
function detectSpam(words) {
  const count = {};
  let score = 0;

  for (const w of words) {
    count[w] = (count[w] || 0) + 1;
    if (count[w] === 3) score += 2; // só conta uma vez
  }

  return score;
}

// 🚀 IA PRINCIPAL
function analyzeText(text) {
  let score = 0;
  const flags = [];
  const detected = new Set();

  const normalized = normalizeText(text);
  const words = tokenize(normalized);

  // 🔹 palavras comuns
  for (const word of words) {
    for (const [level, list] of Object.entries(categories)) {
      if (list.includes(word) && !detected.has(word)) {
        detected.add(word);

        if (level === "leve") score += 2;
        if (level === "media") score += 3;
        if (level === "grave") score += 6;

        flags.push(`${level}: ${word}`);
      }
    }
  }

  // 🔹 gírias ofensivas
  for (const slang of slangs) {
    if (normalized
