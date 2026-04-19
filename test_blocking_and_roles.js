const { moderateContent } = require("./backend/services/moderation/index.js");
const { getUserById, blockUser } = require("./backend/models/userModel");

async function runNewTests() {
  console.log("\n--- Executando Novos Testes de Bloqueio e Funções ---");

  // Preparar um usuário para ser bloqueado para o Teste 2
  const studentUserBlocked = getUserById("1");
  // Simulando que o aluno foi bloqueado
  blockUser(studentUserBlocked);
  console.log(`Simulando bloqueio para o Aluno (ID: ${studentUserBlocked.id}).`);

  // Teste 2 (aluno bloqueado tentando postar)
  const blockedText = "bom dia professora";
  const result2 = await moderateContent({
    type: "post",
    text: blockedText,
    user: studentUserBlocked
  });
  console.log("\n🔹 TESTE 2 (aluno bloqueado tentando postar)");
  console.log("Entrada:", `"${blockedText}"`);
  console.log("Resultado:", JSON.stringify(result2, null, 2));

  // Reverter bloqueio para o aluno para não afetar outros testes se for o mesmo ID
  studentUserBlocked.blockedUntil = null;

  // 🔹 TESTE 3 (outro aluno normal)
  const studentUserNormal = { id: "10", nome: "Aluno Novo", role: "aluno", infractions: 0, blockedUntil: null };
  const normalStudentText = "bom dia professora, tudo bem?";
  const result3 = await moderateContent({
    type: "post",
    text: normalStudentText,
    user: studentUserNormal
  });
  console.log("\n🔹 TESTE 3 (outro aluno normal)");
  console.log("Entrada:", `"${normalStudentText}"`);
  console.log("Resultado:", JSON.stringify(result3, null, 2));

  // 🔹 TESTE 4 (diretoria postando algo)
  const directorUser = getUserById("2");
  const directorOffensiveText = "vc é um idiota vsf";
  const result4 = await moderateContent({
    type: "post",
    text: directorOffensiveText,
    user: directorUser
  });
  console.log("\n🔹 TESTE 4 (diretoria postando algo)");
  console.log("Entrada:", `"${directorOffensiveText}"`);
  console.log("Usuário:", directorUser.nome);
  console.log("Resultado:", JSON.stringify(result4, null, 2));
}

runNewTests();
