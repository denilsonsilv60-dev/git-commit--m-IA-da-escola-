const fs = require('fs');
const { moderateMedia } = require('./backend/services/moderation/media');
const { getUserById } = require('./backend/models/userModel');

async function runSpecificImageTest() {
  console.log('\n--- Testando Imagem Específica ---');

  // Ler o conteúdo base64 do arquivo temporário
  const imageBase64Content = fs.readFileSync('school-app/temp_image_base64.txt', 'utf-8');

  // Para simular a detecção de 'ofensivo' no mock, adicionamos a palavra chave.
  // Em uma implementação real, a análise de IA detectaria isso do conteúdo da imagem.
  const simulatedOffensiveImageBase64 = imageBase64Content + "_offensive_";

  const user = getUserById("1"); // Simula um aluno

  const content = {
    file: simulatedOffensiveImageBase64,
    type: "image",
    metadata: { tags: ["custom_test", "user_upload"] },
    user: user
  };

  const result = await moderateMedia(content);

  console.log("\n🔹 TESTE (Imagem do Usuário - Simulação Ofensiva)");
  console.log("Conteúdo: Sua imagem Base64 com marcador 'offensive' para o mock");
  console.log("Resultado:", JSON.stringify(result, null, 2));
}

runSpecificImageTest();
