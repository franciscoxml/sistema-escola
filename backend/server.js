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

    CREATE TABLE IF NOT EXISTS usuarios (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      usuario TEXT UNIQUE,

      senha TEXT,

      tipo TEXT

    )

  `)

  db.run(`

    CREATE TABLE IF NOT EXISTS arquivos (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      nome TEXT,

      usuario TEXT,

      data TEXT,

      status TEXT

    )

  `)

})

// ======================================
// ADMIN PADRÃO
// ======================================

db.get(

  `

  SELECT * FROM usuarios
  WHERE usuario = ?

  `,

  ['admin'],

  async (erro, usuario) => {

    if (!usuario) {

      const senhaHash =
      await bcrypt.hash(

        'admin123',
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

          'admin',
          senhaHash,
          'Coordenador'

        ],

        (erroInsert) => {

          if (!erroInsert) {

            console.log(
              'ADMIN CRIADO'
            )

          }

        }

      )

    }

  }

)

// ======================================
// LOGIN
// ======================================

app.post(

  '/login',

  (req, res) => {

    const {

      usuario,
      senha

    } = req.body

    db.get(

      `

      SELECT * FROM usuarios
      WHERE usuario = ?

      `,

      [usuario],

      async (erro, user) => {

        if (erro || !user) {

          return res.json({

            sucesso: false

          })

        }

        const senhaCorreta =
        await bcrypt.compare(

          senha,
          user.senha

        )

        if (!senhaCorreta) {

          return res.json({

            sucesso: false

          })

        }

        const token = jwt.sign(

          {

            id: user.id,
            usuario: user.usuario,
            tipo: user.tipo

          },

          SECRET,

          {

            expiresIn: '8h'

          }

        )

        res.json({

          sucesso: true,

          token,

          usuario: {

            id: user.id,
            usuario: user.usuario,
            tipo: user.tipo

          }

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

      const nomeArquivo =
      req.file.filename

      const usuario =
      req.body.usuario

      const data =
      new Date().toLocaleString()

      db.run(

        `

        INSERT INTO arquivos (

          nome,
          usuario,
          data,
          status

        )

        VALUES (?, ?, ?, ?)

        `,

        [

          nomeArquivo,
          usuario,
          data,
          'Pendente'

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

app.get(

  '/arquivos',

  (req, res) => {

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

app.listen(3001, () => {

  console.log('=======================')
  console.log('SERVIDOR ONLINE')
  console.log('PORTA 3001')
  console.log('=======================')

})