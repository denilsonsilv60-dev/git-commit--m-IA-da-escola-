const { moderateContent } = require("./backend/services/moderation/index.js");
const { getUserById } = require("./backend/models/userModel");

async function runTests() {

  const tests = [
    {
      userId: "1", // aluno
      text: "vc é um idiota vsf"
    },
    {
      userId: "2", // diretoria
      text: "vc é um idiota vsf"
    }
  ];

  for (let test of tests) {
    const user = getUserById(test.userId);

    const result = await moderateContent({
      type: "post",
      text: test.text,
      user
    });

    console.log("------------");
    console.log("Usuário:", user.nome, "| Role:", user.role);
    console.log("Texto:", test.text);
    console.log("Resultado:", result);
  }
}

runTests();
