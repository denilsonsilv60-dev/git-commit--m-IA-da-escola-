
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

// 🔥 Gírias ofensivas (pesadas)
const slangs = [
  "fdp","vsf","tmnc","pqp","krl","caralho","porra",
  "foder","vai se foder","seu fdp"
];

// 🔥 Substituições pra burlar
const replacements = {
  "1": "i", "0": "o", "@": "a", "3": "e",
  "$": "s", "!": "i", "4": "a", "7": "t"
};

// 🔥 Normalização pesada
function normalizeText(text) {
  let normalized = text.toLowerCase();

  // remove acentos
  normalized = normalized.normalize("NFD").replace(/[-\u0300-\u036f]/g, "");

  // substitui números/símbolos
  Object.keys(replacements).forEach(char => {
    const regex = new RegExp(char, "g");
    normalized = normalized.replace(regex, replacements[char]);
  });

  // remove símbolos estranhos
  normalized = normalized.replace(/[^a-z0-9\s]/g, " ");

  // limpa espaços
  normalized = normalized.replace(/\s+/g, " ").trim();

  return normalized;
}

// 🔥 Tokenização
function tokenize(text) {
  return text.split(" ");
}

// 🔥 Bullying
function detectBullying(text) {
  const patterns = [
    "voce e",
    "vc e",
    "tu e",
    "ninguem gosta de voce",
    "vai se matar",
    "se matar",
    "te odeio",
    "ninguem te quer"
  ];

  return patterns.some(p => text.includes(p));
}

// 🔥 Spam (repetição)
function detectSpam(words) {
  let count = {};
  let score = 0;

  for (let w of words) {
    count[w] = (count[w] || 0) + 1;
  }

  Object.values(count).forEach(qtd => {
    if (qtd >= 3) score += 2;
  });

  return score;
}

// 🚀 FUNÇÃO PRINCIPAL
function analyzeText(text) {
  let score = 0;
  let flags = [];

  const normalized = normalizeText(text);
  const words = tokenize(normalized);

  let detected = new Set();

  // 🔹 Detectar palavras
  for (let word of words) {
    for (let [level, list] of Object.entries(categories)) {
      if (list.includes(word) && !detected.has(word)) {
        detected.add(word);

        if (level === "leve") score += 2;
        if (level === "media") score += 3;
        if (level === "grave") score += 6;

        flags.push(`${level}: ${word}`);
      }
    }
  }

  // 🔹 Detectar gírias
  slangs.forEach(slang => {
    if (normalized.includes(slang)) {
      score += 6;
      flags.push(`giria grave: ${slang}`);
    }
  });

  // 🔹 Bullying
  if (detectBullying(normalized)) {
    score += 3;
    flags.push("bullying");
  }

  // 🔹 Spam ofensivo
  score += detectSpam(words);

  return { score, flags };
}

module.exports = { analyzeText };
