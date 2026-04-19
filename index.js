const { analyzeText } = require("./text.js");
const { getUserById, blockUser, isBlocked } = require("../models/userModel");

// Notificação da diretoria (placeholder)
function notifyDirector(director, message) {
  console.log(`Notificação para ${director.nome}: ${message}`);
}

async function moderateContent(content) {
  const user = content.user;

  // 🔒 Verificar bloqueio antes de tudo
  if (isBlocked(user)) {
    return {
      action: "bloquear",
      message: "👀 Você está sem permissão para postar por 3 dias."
    };
  }

  const result = analyzeText(content.text);

  let action = "aprovar";

  // 📌 Regras por função
  if (user.role === "aluno") {
    action = result.score >= 10 ? "bloquear" : "aprovar";
  } 
  else if (user.role === "professor") {
    action = result.score >= 12 ? "bloquear" : "aprovar";
  } 
  else if (user.role === "diretoria") {
    action = "aprovar"; // só monitora
  }

  // 🚨 Bloqueio automático
  if (action === "bloquear") {
    blockUser(user);

    const director = getUserById("2"); // ID da diretora
    if (director) {
      notifyDirector(
        director,
        `⚠️ Usuário ${user.nome} bloqueado. Motivo: ${result.flags.join(", ")} (Score: ${result.score})`
      );
    }
  }

  return {
    ...result,
    action,
    monitored: user.role === "diretoria"
  };
}

module.exports = { moderateContent };
