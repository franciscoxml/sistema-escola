const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const express = require('express')
const cors = require('cors')
const pool = require('./db')
const cloudinary = require('cloudinary').v2
const app = express()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
console.log("CONFIG CLOUDINARY:");
console.log(cloudinary.config());
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME)
console.log("API Key existe?", !!process.env.CLOUDINARY_API_KEY)
console.log("API Secret existe?", !!process.env.CLOUDINARY_API_SECRET)

app.use(cors())
app.use(express.json())

const SECRET = 'ESCOLA_2026'

// ======================================
// PASTA UPLOADS
// ======================================

const pastaUploads = path.join(
  __dirname,
  'uploads'
)

if (!fs.existsSync(pastaUploads)) {

  fs.mkdirSync(pastaUploads)

}

// ======================================
// LIBERAR PDFS
// ======================================

app.use(
  '/uploads',
  express.static(pastaUploads)
)

// ======================================
// CONFIG MULTER
// ======================================

const storage = multer.diskStorage({

  destination: function(req, file, cb) {

    cb(null, pastaUploads)

  },

  filename: function(req, file, cb) {

    cb(

      null,

      Date.now() +
      '-' +
      file.originalname

    )

  }

})

const upload = multer({
  storage
})

// ======================================
// TABELAS
// ======================================

async function iniciarBanco() {

  await pool.query(`

CREATE TABLE IF NOT EXISTS usuarios(

id SERIAL PRIMARY KEY,

usuario VARCHAR(100) UNIQUE,

senha TEXT,

tipo VARCHAR(50)

)

`)

  await pool.query(`

CREATE TABLE IF NOT EXISTS arquivos(

id SERIAL PRIMARY KEY,

nome TEXT,

usuario TEXT,

data TEXT,

status TEXT,

observacao TEXT,

quantidade INTEGER DEFAULT 0,

dataImpressao TEXT

)

`)

await pool.query(`
ALTER TABLE arquivos
ADD COLUMN IF NOT EXISTS url TEXT
`)
 
const admin = await pool.query(

`SELECT * FROM usuarios WHERE usuario='admin'`

)

  if(admin.rows.length===0){

      const senhaHash=await bcrypt.hash("123456",10)

      await pool.query(

`INSERT INTO usuarios(usuario,senha,tipo)

VALUES($1,$2,$3)`,

["admin",senhaHash,"Coordenador"]

)

  }

}

iniciarBanco()

// ======================================
// LOGIN
// ======================================

app.post('/login', async (req, res) => {

  try {

    const { usuario, senha } = req.body

    const resultado = await pool.query(

      'SELECT * FROM usuarios WHERE usuario = $1',

      [usuario]

    )

    if (resultado.rows.length === 0) {

      return res.json({
        sucesso: false
      })

    }

    const user = resultado.rows[0]

    const senhaValida = await bcrypt.compare(

      senha,

      user.senha

    )

    if (!senhaValida) {

      return res.json({
        sucesso: false
      })

    }

    res.json({

      sucesso: true,

      usuario: user.usuario,

      tipo: user.tipo

    })

  } catch (erro) {

    console.log(erro)

    res.json({
      sucesso: false
    })

  }

})

// ======================================
// UPLOAD ARQUIVO
// ======================================

// ======================================
// UPLOAD ARQUIVO
// ======================================

app.post(
  '/upload',
  upload.single('arquivo'),
async (req, res) => {

    try {

      if (!req.file) {
        return res.json({
          sucesso: false,
          erro: 'Arquivo não enviado'
        })
      }

      const usuario = req.body.usuario
const quantidade = req.body.quantidade || 0
const observacao = req.body.observacao || ''
const data = new Date().toLocaleString()
const nomeArquivo = req.file.filename

let resultadoCloudinary;

try {

  resultadoCloudinary = await cloudinary.uploader.upload(
    req.file.path,
    {
      resource_type: "raw",
      folder: "documentos-escola"
    }
  );

  console.log("UPLOAD OK");
  console.log(resultadoCloudinary);

} catch (erro) {

  console.log("========== ERRO CLOUDINARY ==========");
  console.log(erro);
  console.log(erro.message);
  console.log(erro.http_code);
  console.log(erro.error);
  console.log("====================================");

  return res.status(500).json(erro);

}

const urlArquivo = resultadoCloudinary.secure_url

// remove o arquivo local
fs.unlinkSync(req.file.path)

console.log("OBSERVAÇÃO RECEBIDA:")
console.log(observacao)

await pool.query(

`
INSERT INTO arquivos
(nome, usuario, data, status, observacao, quantidade, url)
VALUES ($1,$2,$3,$4,$5,$6,$7)
`,

[
  nomeArquivo,
  usuario,
  data,
  'Pendente',
  observacao,
  quantidade,
  urlArquivo
]

)

      res.json({
        sucesso: true
      })

    } catch (erro) {

      console.log(erro)

      res.json({
        sucesso: false,
        erro: erro.message
      })

    }

  }

)

// ======================================
// LISTAR ARQUIVOS
// ======================================

app.get('/arquivos', async (req, res) => {

  try {

    const usuario = req.query.usuario
    const tipo = req.query.tipo

    let resultado

    if (tipo === 'Coordenador') {

      resultado = await pool.query(

        `
        SELECT *
        FROM arquivos
        ORDER BY id DESC
        `

      )

    } else {

      resultado = await pool.query(

        `
        SELECT *
        FROM arquivos
        WHERE usuario = $1
        ORDER BY id DESC
        `,

        [usuario]

      )

    }

    console.log(resultado.rows) 

    res.json(resultado.rows)

  } catch (erro) {

    console.log(erro)

    res.json([])

  }

})


// ======================================
// TESTE API
// ======================================

app.get('/', (req, res) => {

  res.json({

    sistema: 'ONLINE'

  })

})

// ======================================
// CADASTRAR USUÁRIO
// ======================================

app.post('/usuarios', async (req, res) => {

  try {

    const {

      usuario,

      senha,

      tipo

    } = req.body

    const senhaHash = await bcrypt.hash(senha,10)

    await pool.query(

      `

      INSERT INTO usuarios

      (usuario,senha,tipo)

      VALUES($1,$2,$3)

      `,

      [

        usuario,

        senhaHash,

        tipo

      ]

    )

    res.json({

      sucesso:true

    })

  } catch (erro) {

    console.log(erro)

    res.json({

      sucesso:false

    })

  }

})

// ======================================
// EXCLUIR ARQUIVO
// ======================================

app.delete('/arquivos/:id', async (req, res) => {

  try {

    const id = req.params.id

    const resultado = await pool.query(

      `
      SELECT *
      FROM arquivos
      WHERE id = $1
      `,

      [id]

    )

    if (resultado.rows.length === 0) {

      return res.json({
        sucesso: false
      })

    }

    const arquivo = resultado.rows[0]

    const caminhoArquivo = path.join(

      __dirname,
      'uploads',
      arquivo.nome

    )

    if (fs.existsSync(caminhoArquivo)) {

      fs.unlinkSync(caminhoArquivo)

    }

    await pool.query(

      `
      DELETE FROM arquivos
      WHERE id = $1
      `,

      [id]

    )

    res.json({
      sucesso: true
    })

  } catch (erro) {

    console.log(erro)

    res.json({
      sucesso: false
    })

  }

})

// ======================================
// SERVIDOR
// ======================================

app.get('/usuarios', async (req, res) => {

  try {

    const resultado = await pool.query(

      'SELECT id, usuario, tipo FROM usuarios ORDER BY id'

    )

    res.json(resultado.rows)

  } catch (erro) {

    console.log(erro)

    res.json([])

  }

})

app.put('/arquivos/:id', async (req, res) => {

  try {

    const atual = await pool.query(
      'SELECT * FROM arquivos WHERE id=$1',
      [req.params.id]
    )

    if (atual.rows.length === 0) {
      return res.json({ sucesso:false })
    }

    const documento = atual.rows[0]

    const status =
      req.body.status ?? documento.status

    const observacao =
      req.body.observacao ?? documento.observacao

    const quantidade =
      req.body.quantidade ?? documento.quantidade

    let dataImpressao =
      documento.dataimpressao

    if(status === "Impresso"){
      dataImpressao = new Date().toLocaleString("pt-BR")
    }

    await pool.query(

      `
      UPDATE arquivos
      SET
      status=$1,
      observacao=$2,
      quantidade=$3,
      dataImpressao=$4
      WHERE id=$5
      `,

      [
        status,
        observacao,
        quantidade,
        dataImpressao,
        req.params.id
      ]

    )

    res.json({ sucesso:true })

  } catch(err){

    console.log(err)

    res.json({ sucesso:false })

  }

})

app.delete('/usuarios/:id', async (req, res) => {

  try {

    await pool.query(

      `
      DELETE FROM usuarios
      WHERE id = $1
      `,

      [req.params.id]

    )

    res.json({
      sucesso: true
    })

  } catch (erro) {

    console.log(erro)

    res.json({
      sucesso: false
    })

  }

})

app.put('/usuarios/:id', async (req, res) => {

  try {

    const {
      usuario,
      senha,
      tipo
    } = req.body

    if (!senha || senha.trim() === '') {

      await pool.query(

        `
        UPDATE usuarios
        SET
          usuario = $1,
          tipo = $2
        WHERE id = $3
        `,

        [
          usuario,
          tipo,
          req.params.id
        ]

      )

    } else {

      const senhaHash = await bcrypt.hash(senha, 10)

      await pool.query(

        `
        UPDATE usuarios
        SET
          usuario = $1,
          senha = $2,
          tipo = $3
        WHERE id = $4
        `,

        [
          usuario,
          senhaHash,
          tipo,
          req.params.id
        ]

      )

    }

    res.json({
      sucesso: true
    })

  } catch (erro) {

    console.log(erro)

    res.json({
      sucesso: false
    })

  }

})

app.listen(3001, () => {

  console.log('=======================')
  console.log('SERVIDOR ONLINE')
  console.log('PORTA 3001')
  console.log('=======================')

})