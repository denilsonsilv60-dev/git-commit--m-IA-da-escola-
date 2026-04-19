const { moderateMedia } = require("./backend/services/moderation/media");

// Mock user data for testing
const mockUsers = {
  student: { id: "1", nome: "Aluno Teste", role: "aluno" },
  director: { id: "2", nome: "Diretora Teste", role: "diretoria" }
};

async function runMediaTests() {
  console.log("\n--- Executando Testes de Moderação de Mídia ---");

  // Teste 1: Imagem Inofensiva
  const content1 = {
    file: "base64_image_content_safe_photo",
    type: "image",
    metadata: { tags: ["nature", "landscape"] },
    user: mockUsers.student
  };
  const resultImageSafe = await moderateMedia(content1);
  console.log("\n🔹 TESTE 1 (Imagem Segura - Aluno)");
  console.log("Conteúdo: Imagem de paisagem");
  console.log("Resultado:", JSON.stringify(resultImageSafe, null, 2));

  // Teste 2: Imagem Potencialmente Ofensiva (simulada)
  const content2 = {
    file: "base64_image_content_mild_suggestive",
    type: "image",
    metadata: { tags: ["person", "art"] },
    user: mockUsers.student
  };
  const resultImageMild = await moderateMedia(content2);
  console.log("\n🔹 TESTE 2 (Imagem Potencialmente Ofensiva - Aluno)");
  console.log("Conteúdo: Imagem sugestiva (simulada)");
  console.log("Resultado:", JSON.stringify(resultImageMild, null, 2));

  // Teste 3: Imagem Ofensiva (simulada)
  const content3 = {
    file: "base64_image_content_offensive_explicit",
    type: "image",
    metadata: { tags: ["person"] },
    user: mockUsers.student
  };
  const resultImageOffensive = await moderateMedia(content3);
  console.log("\n🔹 TESTE 3 (Imagem Ofensiva - Aluno)");
  console.log("Conteúdo: Imagem explícita (simulada)");
  console.log("Resultado:", JSON.stringify(resultImageOffensive, null, 2));

  // Teste 4: Vídeo Inofensivo (simulado)
  const content4 = {
    file: "/path/to/safe_video.mp4",
    type: "video",
    metadata: { tags: ["education", "tutorial"] },
    user: mockUsers.student
  };
  const resultVideoSafe = await moderateMedia(content4);
  console.log("\n🔹 TESTE 4 (Vídeo Seguro - Aluno)");
  console.log("Conteúdo: Vídeo educativo (simulado)");
  console.log("Resultado:", JSON.stringify(resultVideoSafe, null, 2));

  // Teste 5: Vídeo Ofensivo (simulado)
  const content5 = {
    file: "/path/to/offensive_video.mp4",
    type: "video",
    metadata: { tags: ["bullying"] },
    user: mockUsers.student
  };
  const resultVideoOffensive = await moderateMedia(content5);
  console.log("\n🔹 TESTE 5 (Vídeo Ofensivo - Aluno)");
  console.log("Conteúdo: Vídeo com bullying (simulado)");
  console.log("Resultado:", JSON.stringify(resultVideoOffensive, null, 2));

  // Teste 6: Conteúdo bloqueado por filtro rápido (tags) - Aluno
  const content6 = {
    file: "any_file_content",
    type: "image",
    metadata: { tags: ["sport", "nsfw"] },
    user: mockUsers.student
  };
  const resultBlockedByTag = await moderateMedia(content6);
  console.log("\n🔹 TESTE 6 (Bloqueado por Quick Filter - Aluno)");
  console.log("Conteúdo: Imagem com tag 'nsfw'");
  console.log("Resultado:", JSON.stringify(resultBlockedByTag, null, 2));

  // Teste 7: Imagem Ofensiva (simulada) - Diretoria
  const content7 = {
    file: "base64_image_content_offensive_explicit",
    type: "image",
    metadata: { tags: ["person"] },
    user: mockUsers.director
  };
  const resultDirectorOffensive = await moderateMedia(content7);
  console.log("\n🔹 TESTE 7 (Imagem Ofensiva - Diretoria)");
  console.log("Conteúdo: Imagem explícita (simulada)");
  console.log("Resultado:", JSON.stringify(resultDirectorOffensive, null, 2));

    // Teste 8: Conteúdo bloqueado por filtro rápido (tags) - Diretoria
  const content8 = {
    file: "any_file_content",
    type: "image",
    metadata: { tags: ["sport", "nsfw"] },
    user: mockUsers.director
  };
  const resultDirectorBlockedByTag = await moderateMedia(content8);
  console.log("\n🔹 TESTE 8 (Bloqueado por Quick Filter - Diretoria)");
  console.log("Conteúdo: Imagem com tag 'nsfw'");
  console.log("Resultado:", JSON.stringify(resultDirectorBlockedByTag, null, 2));

  // NOVO TESTE 9: Imagem com traje de banho (simulada)
  const content9 = {
    file: "base64_image_content_swimsuit_mock", // Gatilho para a simulação de 'swimsuit'
    type: "image",
    metadata: { tags: ["beach", "summer"] },
    user: mockUsers.student
  };
  const resultImageSwimsuit = await moderateMedia(content9);
  console.log("\n🔹 TESTE 9 (Imagem com Traje de Banho - Aluno)");
  console.log("Conteúdo: Imagem com traje de banho (simulada)");
  console.log("Resultado:", JSON.stringify(resultImageSwimsuit, null, 2));
}

runMediaTests();
