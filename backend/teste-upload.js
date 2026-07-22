const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

(async () => {
  try {

    const resultado = await cloudinary.uploader.upload(
      "./uploads/enem.pdf",
      {
        resource_type: "raw"
      }
    );

    console.log(resultado);

  } catch (e) {

    console.log("ERRO");
    console.log(e);

  }
})();