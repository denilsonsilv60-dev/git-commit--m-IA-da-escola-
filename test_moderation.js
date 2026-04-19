const { moderateContent } = require("./backend/services/moderation");
const { getUserById } = require("./backend/models/userModel");

async function runTest() {
  // Usando um usuário mock para o teste
  const mockUser = getUserById("1"); // Simula um aluno

  const text = "vsf seu fdp, vc é um lixo krl ninguém gosta de vc, tu é inutil, vai se f0d3r";

  const result = await moderateContent({
    type: "post",
    text: text,
    user: mockUser
  });

  console.log("Texto:", text);
  console.log("Resultado:", JSON.stringify(result, null, 2));
}

runTest();
