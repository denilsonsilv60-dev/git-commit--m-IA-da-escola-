const { analyzeText } = require("./text");
const { getUserById, blockUser, isBlocked } = require("../../models/userModel");

// Notificação da diretoria
function notifyDirector(director, message) {
  console.log(`Notificação para ${director.nome}: ${message}`);
}

async function moderateContent(content) {
  const user = content.user;

  if (!user || !content.text) {
    return {
      action: "bloquear",
      message: "Conteúdo inválido."
    };
  }

  // Verificar bloqueio
  if (isBlocked(user)) {
    return {
      action: "bloquear",
      message: "👀 Você está sem permissão para postar por 3 dias."
    };
  }

  const result = analyzeText(content.text);

  let action = "aprovar";

  // regras por role
  if (user.role === "aluno") {
    action = result.score >= 10 ? "bloquear" : "aprovar";
  } else if (user.role === "professor") {
    action = result.score >= 12 ? "bloquear" : "aprovar";
  } else if (user.role === "diretoria") {
    action = "aprovar";
  }

  // punição
  if (action === "bloquear") {
    blockUser(user);

    const director = getUserById("2");

    if (director) {
      notifyDirector(
        director,
        `⚠️ Usuário ${user.nome} bloqueado. Motivo: ${result.flags.join(", ")} (Score: ${result.score})`
      );
    }
  }

  return {
    score: result.score,
    flags: result.flags,
    action,
    monitored: user.role === "diretoria"
  };
}

module.exports = { moderateContent };
