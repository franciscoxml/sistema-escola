const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "nkukcqza",
  api_key: "387194163179725",
  api_secret: "DxrPLwDBkc58AIIXntKU58b9RsA"
});

cloudinary.api.ping()
.then(console.log)
.catch(console.error);