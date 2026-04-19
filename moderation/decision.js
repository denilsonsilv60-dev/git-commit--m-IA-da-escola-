function decidePost(score) {
  if (score >= 6) {
    return { action: "bloquear", message: "❌ Conteúdo não permitido." };
  }

  if (score >= 3) {
    return { action: "revisao", message: "⚠️ Conteúdo em análise." };
  }

  return { action: "aprovar", message: "✅ Publicado." };
}

function decideComment(score) {
  if (score >= 7) {
    return { action: "bloquear", message: "❌ Comentário não permitido." };
  }

  if (score >= 5) {
    return { action: "revisao", message: "⚠️ Comentário em análise." };
  }

  if (score >= 3) {
    return { action: "aviso", message: "⚠️ Pode ser ofensivo." };
  }

  return { action: "aprovar", message: "✅ Comentário enviado." };
}

module.exports = { decidePost, decideComment };
