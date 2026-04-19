const { moderateMedia } = require("./backend/services/moderation/media");
const { getUserById } = require("./backend/models/userModel");

async function runTests() {

  const tests = [
    {
      userId: "1", // aluno
      type: "image",
      file: "fake_image_nsfw.jpg",
      metadata: { tags: ["test", "nsfw_content"] } // Add metadata for quickFilter
    },
    {
      userId: "2", // diretoria
      type: "image",
      file: "fake_image_nsfw.jpg",
      metadata: { tags: ["test", "nsfw_content"] } // Add metadata for quickFilter
    },
    {
      userId: "1", // aluno
      type: "video",
      file: "fake_video.mp4",
      metadata: { tags: ["test", "educational"] } // Add metadata for quickFilter
    }
  ];

  for (let test of tests) {

    const user = getUserById(test.userId);

    // The moderateMedia function expects a single content object
    const content = {
      file: test.file,
      type: test.type,
      metadata: test.metadata,
      user: user
    };

    const result = await moderateMedia(content);

    console.log("------------");
    console.log("Usuário:", user.nome, "| Role:", user.role);
    console.log("Tipo:", test.type);
    console.log("Resultado:", result);
  }
}

runTests();
