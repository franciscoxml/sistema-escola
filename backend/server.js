const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const express = require('express')
const cors = require('cors')
const pool = require('./db')

const app = express()

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

app.post(

  '/upload',

  upload.single('arquivo'),

  (req, res) => {

    try {

      if (!req.file) {

        return res.json({

          sucesso: false,

          erro: 'Arquivo não enviado'

        })

      }

      const usuario =
req.body.usuario

const quantidade =
req.body.quantidade || 0

const data =
new Date().toLocaleString()

const nomeArquivo = req.file.filename

console.log("=== DADOS QUE SERÃO GRAVADOS ===");
console.log("nomeArquivo:", nomeArquivo);
console.log("usuario:", usuario);
console.log("data:", data);
console.log("quantidade:", quantidade);
console.log("===============================");

      db.run(

        `

        INSERT INTO arquivos (

nome,
usuario,
data,
status,
quantidade

)

VALUES (?, ?, ?, ?, ?)

        `,

        [
  nomeArquivo,
  usuario,
  data,
  'Pendente',
  quantidade
],

        function(erro) {

          if (erro) {

            console.log(erro)

            return res.json({

              sucesso: false,

              erro: erro.message

            })

          }

          console.log(
            'ARQUIVO SALVO:',
            nomeArquivo
          )

          res.json({

            sucesso: true

          })

        }

      )

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

app.get('/arquivos', (req, res) => {

console.log("=== LISTAR ARQUIVOS ===")
console.log("Usuário:", req.query.usuario)
console.log("Tipo:", req.query.tipo)
console.log("=======================")

    const usuario =
    req.query.usuario

    const tipo =
    req.query.tipo

    // COORDENADOR VÊ TUDO

    if (

      tipo === 'Coordenador'

    ) {

      db.all(

        `

        SELECT * FROM arquivos

        ORDER BY id DESC

        `,

        (erro, rows) => {

          if (erro) {

            return res.json([])

          }

          res.json(rows)

        }

      )

    }

    // PROFESSOR VÊ APENAS OS DELE

    else {

      db.all(

        `

        SELECT * FROM arquivos

        WHERE usuario = ?

        ORDER BY id DESC

        `,

        [usuario],

        (erro, rows) => {

          if (erro) {

            return res.json([])

          }

          res.json(rows)

        }

      )

    }

  }

)


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

app.delete(

  '/arquivos/:id',

  (req, res) => {

    const id = req.params.id

    db.get(

      `

      SELECT * FROM arquivos
      WHERE id = ?

      `,

      [id],

      (erro, arquivo) => {

        if (erro || !arquivo) {

          return res.json({

            sucesso: false

          })

        }

        const caminhoArquivo = path.join(

          __dirname,

          'uploads',

          arquivo.nome

        )

        // APAGAR PDF

        if (fs.existsSync(caminhoArquivo)) {

          fs.unlinkSync(caminhoArquivo)

        }

        // APAGAR BANCO

        db.run(

  `

  DELETE FROM arquivos
  WHERE id = ?

  `,

  [id],

  function (erroDelete) {

    console.log('=================')
    console.log('ID:', id)
    console.log('APAGADOS:', this.changes)
    console.log('ERRO:', erroDelete)
    console.log('=================')

    if (erroDelete) {

      return res.json({

        sucesso: false,
        erro: erroDelete.message

      })

    }

    res.json({

      sucesso: true,
      apagados: this.changes

    })

  }

)

      }

    )

  }

)

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

app.put('/arquivos/:id', (req, res) => {

  const {
    status,
    observacao,
    quantidade
  } = req.body

  let dataImpressao = null

  if (status === 'Impresso') {
    dataImpressao = new Date().toLocaleString('pt-BR')
  }

  console.log(req.body)

  db.run(

    `
    UPDATE arquivos
    SET
      status = ?,
      observacao = ?,
      quantidade = ?,
      dataImpressao = ?
    WHERE id = ?
    `,

    [
      status,
      observacao,
      quantidade,
      dataImpressao,
      req.params.id
    ],

    function (erro) {

      if (erro) {

        console.log(erro)

        return res.json({
          sucesso: false
        })

      }

      res.json({
        sucesso: true
      })

    }

  )

})

app.delete(

  '/usuarios/:id',

  (req, res) => {

    db.run(

      'DELETE FROM usuarios WHERE id = ?',

      [req.params.id],

      function (erro) {

        if (erro) {

          return res.json({
            sucesso: false
          })

        }

        res.json({
          sucesso: true
        })

      }

    )

  }

)

app.put('/usuarios/:id', async (req, res) => {

  const { usuario, senha, tipo } = req.body

  try {

    // se a senha veio vazia, não altera
    if (!senha) {

      db.run(

        `
        UPDATE usuarios
        SET usuario = ?, tipo = ?
        WHERE id = ?
        `,

        [
          usuario,
          tipo,
          req.params.id
        ],

        function (erro) {

          if (erro) {

            return res.json({
              sucesso: false
            })

          }

          res.json({
            sucesso: true
          })

        }

      )

    } else {

      const senhaHash = await bcrypt.hash(senha, 10)

      db.run(

        `
        UPDATE usuarios
        SET
          usuario = ?,
          senha = ?,
          tipo = ?
        WHERE id = ?
        `,

        [
          usuario,
          senhaHash,
          tipo,
          req.params.id
        ],

        function (erro) {

          if (erro) {

            return res.json({
              sucesso: false
            })

          }

          res.json({
            sucesso: true
          })

        }

      )

    }

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