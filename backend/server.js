const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()

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
// BANCO SQLITE
// ======================================

const db = new sqlite3.Database('./database.db')

// ======================================
// TABELAS
// ======================================

db.serialize(() => {

  db.run(`

    CREATE TABLE IF NOT EXISTS arquivos (

id INTEGER PRIMARY KEY AUTOINCREMENT,

nome TEXT,

usuario TEXT,

data TEXT,

status TEXT,

observacao TEXT,

quantidade INTEGER,

dataImpressao TEXT

)

  `)

// ======================================
// ATUALIZAR BANCO AUTOMATICAMENTE
// ======================================

db.all("PRAGMA table_info(arquivos)", (erro, colunas) => {

  if (erro) {
    console.log("Erro ao verificar tabela:", erro)
    return
  }

  const nomes = colunas.map(c => c.name)

  if (!nomes.includes("quantidade")) {

    db.run(
      "ALTER TABLE arquivos ADD COLUMN quantidade INTEGER DEFAULT 0",
      (erro) => {

        if (erro) {
          console.log("Erro criando coluna quantidade:", erro)
        } else {
          console.log("Coluna quantidade criada.")
        }

      }
    )

  }

  if (!nomes.includes("observacao")) {

    db.run(
      "ALTER TABLE arquivos ADD COLUMN observacao TEXT",
      (erro) => {

        if (erro) {
          console.log("Erro criando coluna observacao:", erro)
        } else {
          console.log("Coluna observacao criada.")
        }

      }
    )

  }

  if (!nomes.includes("dataImpressao")) {

    db.run(
      "ALTER TABLE arquivos ADD COLUMN dataImpressao TEXT",
      (erro) => {

        if (erro) {
          console.log("Erro criando coluna dataImpressao:", erro)
        } else {
          console.log("Coluna dataImpressao criada.")
        }

      }
    )

  }

})

  db.run(`

CREATE TABLE IF NOT EXISTS usuarios (

id INTEGER PRIMARY KEY AUTOINCREMENT,

usuario TEXT UNIQUE,

senha TEXT,

tipo TEXT

)

`)

// ======================================
// ADMIN PADRÃO
// ======================================

db.get(

"SELECT * FROM usuarios WHERE usuario = ?",

["admin"],

async (erro, row) => {

if (!row) {

const senhaHash = await bcrypt.hash(
"123456",
10
)

db.run(

`
INSERT INTO usuarios
(usuario, senha, tipo)
VALUES (?, ?, ?)
`,

[
"admin",
senhaHash,
"Coordenador"
]

)

}

}

)

})

// ======================================
// LOGIN
// ======================================

app.post(

  '/login',

  async (req, res) => {

    const {

      usuario,
      senha

    } = req.body

    db.get(

      `

      SELECT *
      FROM usuarios

      WHERE usuario = ?

      `,

      [usuario],

      async (erro, user) => {

        if (erro || !user) {

          return res.json({

            sucesso: false

          })

        }

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

      }

    )

  }

)

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

app.post(

  '/usuarios',

  async (req, res) => {

    try {

      const {

        usuario,
        senha,
        tipo

      } = req.body

      const senhaHash =
      await bcrypt.hash(

        senha,
        10

      )

      db.run(

        `

        INSERT INTO usuarios (

          usuario,
          senha,
          tipo

        )

        VALUES (?, ?, ?)

        `,

        [

          usuario,
          senhaHash,
          tipo

        ],

        function(erro) {

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

    } catch (erro) {

      console.log(erro)

      res.json({

        sucesso: false

      })

    }

  }

)

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

app.get('/usuarios', (req, res) => {

  db.all(

    'SELECT id, usuario, tipo FROM usuarios',

    [],

    (erro, rows) => {

      if (erro) {

        return res.json([])

      }

      res.json(rows)

    }

  )

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

app.listen(3001, () => {

  console.log('=======================')
  console.log('SERVIDOR ONLINE')
  console.log('PORTA 3001')
  console.log('=======================')

})