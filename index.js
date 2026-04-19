// moderation/index.js

const { analyzeText } = require("./text");
// const { decidePost, decideComment } = require("./decision"); // Removed
const { getUserById, blockUser, isBlocked } = require("../../models/userModel");

// Placeholder para notificação da diretoria
function notifyDirector(director, message) {
  console.log(`Notificação para ${director.nome}: ${message}`);
}

async function moderateContent(content) {
  const user = content.user;

  // 4. Antes de postar/comentar: Verificar bloqueio
  if (isBlocked(user)) {
    return {
      action: "bloquear",
      message: "👀 Você está sem permissão para postar por 3 dias."
    };
  }

  const result = analyzeText(content.text);

  // IA SEMPRE roda
  let action = "aprovar";

  // regras por role
  if (user.role === "aluno") {
    action = result.score >= 10 ? "bloquear" : "aprovar";
  } else if (user.role === "professor") {
    action = result.score >= 12 ? "bloquear" : "aprovar";
  } else if (user.role === "diretoria") {
    action = "aprovar"; // mas mantém logs
  }

  // 5. Aplicar punição: Bloquear usuário se a ação for "bloquear"
  if (action === "bloquear") {
    blockUser(user);
    const director = getUserById("2"); // Assumindo que a diretora tem ID '2'
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
    monitored: user.role === "diretoria" ? true : false // Only monitored for diretoria as per original comment
  };
}

module.exports = { moderateContent };
