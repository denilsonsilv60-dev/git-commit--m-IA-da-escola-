const ffmpeg = require('fluent-ffmpeg');

// Placeholder for saving moderation logs
function saveLog(logEntry) {
  console.log("--- MODERATION LOG ---\n" + JSON.stringify(logEntry, null, 2) + "\n----------------------");
}

// 1. FILTRO RÁPIDO (MUITO IMPORTANTE)
function quickFilter(metadata) {
  const blockedHints = [
    "nude",
    "sexual",
    "adult",
    "explicit",
    "nsfw"
  ];

  if (!metadata || !metadata.tags) {
      return false;
  }

  return blockedHints.some(h =>
    metadata.tags.includes(h)
  );
}

// 2. ANÁLISE DE IMAGEM (leve e precisa)
async function analyzeImage(imageBase64) {
  console.log("Simulando análise de imagem para: ", imageBase64.substring(0, 50) + "...");
  const mockResults = {
    safe: true,
    nsfwScore: Math.random() * 100, // Pontuação aleatória para simulação
    labels: ["safe", "person"]
  };

  if (imageBase64.includes("offensive")) {
      mockResults.nsfwScore = 80 + Math.random() * 20;
      mockResults.safe = false;
      mockResults.labels.push("explicit");
  } else if (imageBase64.includes("mild")) {
      mockResults.nsfwScore = 40 + Math.random() * 30;
      mockResults.safe = false;
      mockResults.labels.push("suggestive");
  } else if (imageBase64.includes("swimsuit_mock")) { // Novo: para simular traje de banho
      mockResults.nsfwScore = 46 + Math.random() * 5; // Score ligeiramente acima de 45
      mockResults.safe = false;
      mockResults.labels.push("swimsuit");
  }

  return new Promise(resolve => setTimeout(() => resolve(mockResults), 100));
}

// 3. ANÁLISE DE VÍDEO (RÁPIDA)
function extractKeyFrames(videoPath) {
  return new Promise((resolve, reject) => {
    console.log(`Simulando extração de frames para: ${videoPath}`);
    if (!videoPath) return reject(new Error("Video path is undefined"));

    const mockFrames = [
        videoPath + "_frame1_mock_mild",
        videoPath + "_frame2_mock",
        videoPath + "_frame3_mock_offensive"
    ];
    setTimeout(() => resolve(mockFrames), 50);
  });
}

async function analyzeVideo(videoPath) {
  const frames = await extractKeyFrames(videoPath);

  let nsfwTotal = 0;
  let allLabels = new Set();

  for (let frame of frames) {
    const result = await analyzeImage(frame);
    nsfwTotal += result.nsfwScore;
    result.labels.forEach(label => allLabels.add(label));
  }

  const avg = nsfwTotal / frames.length;

  return {
    nsfwScore: avg,
    safe: avg < 60,
    labels: Array.from(allLabels)
  };
}

// 4. REGRA PRINCIPAL (SEGURO ESCOLAR) - ATUALIZADA
function decideContent(analysisResult) {
  let action, message;

  if (analysisResult.nsfwScore > 70) {
    action = "bloquear";
    message = "❌ Conteúdo não permitido (inapropriado).";
  } else if (analysisResult.nsfwScore > 45 && analysisResult.labels.includes("swimsuit")) {
    action = "revisao";
    message = "⚠️ Conteúdo em análise: Possível traje de banho.";
  } else {
    action = "aprovar";
    message = "✅ Conteúdo permitido.";
  }

  return {
    ...analysisResult, // includes nsfwScore, safe, labels
    action,
    message
  };
}

// Internal helper function to perform analysis and decision
async function _analyzeAndDecideMedia(file, type, metadata) {
    // 1. Aplicar filtro rápido primeiro
    if (quickFilter(metadata)) {
        return {
            action: "bloquear",
            message: "❌ Conteúdo bloqueado por filtro rápido (tags/metadados).",
            nsfwScore: 100, // High score for quick-filtered content
            safe: false,
            labels: metadata.tags || []
        };
    }

    let analysisResult;
    if (type === "image") {
        analysisResult = await analyzeImage(file);
    } else if (type === "video") {
        analysisResult = await analyzeVideo(file);
    } else {
        return { action: "erro", message: "Tipo de mídia não suportado." };
    }

    return decideContent(analysisResult);
}

// 5. SISTEMA FINAL (JUNTO)
async function moderateMedia(content) {
  const { file, type, metadata, user } = content; // Assuming user is passed in content

  const result = await _analyzeAndDecideMedia(file, type, metadata);

  // Log the raw result before role-based overrides
  saveLog({
    user: user ? user.id : 'anonymous',
    role: user ? user.role : 'anonymous',
    score: result.nsfwScore,
    flags: result.labels,
    action: result.action,
    message: result.message
  });

  if (user && user.role === "diretoria") {
    return {
      ...result,
      action: "aprovar",
      monitored: true,
      message: "✅ Conteúdo publicado (diretoria - monitorado)"
    };
  }

  return result; // For other roles, return the original decision
}

module.exports = { moderateMedia, quickFilter, analyzeImage, analyzeVideo, decideContent };
