import { useEffect, useState } from 'react'
import axios from 'axios'

const API = 'https://sistema-escola-api.onrender.com'

export default function App() {

  // =====================================
  // STATES
  // =====================================

  const [arquivo, setArquivo] =
  useState(null)

  const [usuario, setUsuario] =
  useState('')

  const [senha, setSenha] =
  useState('')

  const [logado, setLogado] =
  useState(false)

  const [dadosUsuario, setDadosUsuario] =
  useState(null)

  const [arquivos, setArquivos] =
  useState([])

  const [busca, setBusca] =
  useState('')

  const [pesquisa, setPesquisa] =
  useState('')

  const [impressoras, setImpressoras] =
  useState([])

  const [
    impressoraSelecionada,
    setImpressoraSelecionada
  ] = useState('')

  const [novoUsuario, setNovoUsuario] = useState('')
  
  const [novaSenha, setNovaSenha] = useState('')
  
  const [tipoCadastro, setTipoCadastro] =
useState('Professor')

// =====================================
// LOGOUT
// =====================================

function sair() {

  setLogado(false)

  setDadosUsuario(null)

  setUsuario('')

  setSenha('')

}

  // =====================================
  // CARREGAR ARQUIVOS
  // =====================================

  async function carregarArquivos() {

  try {

    const resposta =
    await axios.get(

      `${API}/arquivos`,

      {

        params: {

          usuario:
          dadosUsuario?.usuario,

          tipo:
          dadosUsuario?.tipo

        }

      }

    )

    setArquivos(
      resposta.data
    )

  } catch (erro) {

    console.log(erro)

  }

}

  // =====================================
  // CARREGAR IMPRESSORAS
  // =====================================

  async function carregarImpressoras() {

    try {

      const resposta =
      await axios.get(

        `${API}/impressoras`

      )

      setImpressoras(
        resposta.data
      )

    } catch (erro) {

      console.log(erro)

    }

  }

// =====================================
// CADASTRAR USUÁRIO
// =====================================

async function cadastrarUsuario() {

  try {

    const resposta =
    await axios.post(

  'https://sistema-escola-api.onrender.com/usuarios',

      {

        usuario: novoUsuario,

        senha: novaSenha,

        tipo: tipoCadastro

      }

    )

    if (resposta.data.sucesso) {

      alert(
        'Usuário cadastrado'
      )

      setNovoUsuario('')
      setNovaSenha('')

    } else {

      alert(
        resposta.data.erro
      )

    }

  } catch (erro) {

    console.log(erro)

    alert(
      'Erro ao cadastrar'
    )

  }

}

  // =====================================
  // ENVIAR ARQUIVO
  // =====================================

  async function enviarArquivo() {

    if (!arquivo) {

      alert(
        'Selecione um arquivo'
      )

      return

    }

    if (!dadosUsuario?.usuario) {

  alert(
    'Usuário inválido'
  )

  return

}

    try {

      const formData =
      new FormData()

      formData.append(
        'arquivo',
        arquivo
      )

      formData.append(

  'usuario',

  dadosUsuario.usuario

)

      const resposta =
      await axios.post(

        `${API}/upload`,

        formData

      )

      if (resposta.data.sucesso) {

        alert(
          'Arquivo enviado'
        )

        setArquivo(null)

        carregarArquivos()

      }

    } catch (erro) {

      console.log(erro)

      alert(
        'Erro ao enviar'
      )

    }

  }

// =====================================
// EXCLUIR ARQUIVO
// =====================================

async function excluirArquivo(id) {

  const confirmar = window.confirm(

    'Deseja excluir este arquivo?'

  )

  if (!confirmar) {

    return

  }

  try {

    const resposta =
    await axios.delete(

      `${API}/arquivos/${id}`

    )

    if (resposta.data.sucesso) {

      alert(
        'Arquivo excluído'
      )

      carregarArquivos()

    }

  } catch (erro) {

    console.log(erro)

    alert(
      'Erro ao excluir'
    )

  }

}

  // =====================================
  // INICIAR
  // =====================================

  useEffect(() => {

  if (logado) {

    carregarArquivos()

    carregarImpressoras()

  }

}, [logado])

// =====================================
// LOGIN
// =====================================

async function fazerLogin() {

  try {

    const resposta =
    await axios.post(

      `${API}/login`,

      {

        usuario,
        senha

      }

    )

    if (resposta.data.sucesso) {

      setLogado(true)

      setDadosUsuario(
        resposta.data.usuario
      )

      carregarArquivos()

      alert('Login realizado')

    } else {

      alert(
        'Usuário inválido'
      )

    }

  } catch (erro) {

    console.log(erro)

    alert(
      'Erro no login'
    )

  }

}

// =====================================
// FILTRAR ARQUIVOS
// =====================================

const arquivosFiltrados =

arquivos.filter((item) => {

  return (

    item.usuario
    .toLowerCase()
    .includes(
      pesquisa.toLowerCase()
    )

    ||

    item.nome
    .toLowerCase()
    .includes(
      pesquisa.toLowerCase()
    )

  )

})

  // =====================================
  // TELA
  // =====================================

if (!logado) {

  return (

    <div style={{

      height: '100vh',

      display: 'flex',

      justifyContent: 'center',

      alignItems: 'center',

      background: '#0f172a'

    }}>

      <div style={{

        background: '#fff',

        padding: 40,

        borderRadius: 28,

boxShadow:
'0 10px 30px rgba(0,0,0,0.15)',

        width: 350

      }}>

        <h1>

          Login

        </h1>

        <input

          placeholder="Usuário"

          value={usuario}

          onChange={(e) =>

            setUsuario(
              e.target.value
            )

          }

          style={{

            width: '100%',

            padding: 12,

            marginTop: 20,

            borderRadius: 14,
border: '1px solid #cbd5e1',
fontSize: 16

          }}

        />

        <input

          type="password"

          placeholder="Senha"

          value={senha}

          onChange={(e) =>

            setSenha(
              e.target.value
            )

          }

          style={{

            width: '100%',

            padding: 12,

            marginTop: 20,

            borderRadius: 14,

border: '1px solid #cbd5e1',
fontSize: 16

          }}

        />

        <button

          onClick={fazerLogin}

          style={{

            width: '100%',

            padding: 14,

            marginTop: 20,

            background:
'linear-gradient(135deg,#2563eb,#1d4ed8)',

            color: '#fff',

            border: 'none',

            borderRadius: 14,

border: '1px solid #cbd5e1',
fontSize: 16

transition: '0.3s',
boxShadow:
'0 8px 20px rgba(37,99,235,0.3)'

          }}

        >

          Entrar

        </button>

      </div>

    </div>

  )

}

  return (

  <div style={{

    display: 'flex',
    minHeight: '100vh',
    background:
'linear-gradient(135deg,#f1f5f9,#cbd5e1)'

  }}>

    {/* MENU LATERAL */}

    <div style={{

      width: 250,
      background:
'linear-gradient(135deg,#0f172a,#1e293b)',
      color: '#fff',
      padding: 35

    }}>

      <h2>

        ESCOLA

      </h2>

      <p>

        Argentina Santos da Silva

      </p>

      <hr style={{

        marginTop: 20,
        marginBottom: 20,
        borderColor: '#334155'

      }} />

      <p>

        👤 {dadosUsuario?.usuario}

      </p>

      <p>

        🔐 {dadosUsuario?.tipo}

      </p>

      <button

        onClick={sair}

        style={{

          width: '100%',
          padding: 12,
          marginTop: 30,
          background: '#dc2626',
          color: '#fff',
          border: 'none',
          borderRadius: 14,
          cursor: 'pointer',
          fontWeight: 'bold',

transition: '0.3s',
boxShadow:
'0 8px 20px rgba(37,99,235,0.3)'

border: '1px solid #cbd5e1',
fontSize: 16

        }}

      >

        Sair

      </button>

    </div>

    {/* CONTEÚDO */}

    <div style={{

      flex: 1,
      padding: 30

    }}>

      {/* TOPO */}

      <div
        style={{
          background: '#0f172a',
          color: '#fff',
          padding: 35,
          borderRadius: 28,
         
 marginBottom: 30,

transition: '0.3s',
boxShadow:
'0 8px 20px rgba(37,99,235,0.3)'
        
}}
      >

        <h1 style={{

  fontSize: 42,
  marginBottom: 10,
  fontWeight: '800',
  letterSpacing: -1,
  textTransform: 'uppercase'

}}>

  Controle de Impressões

</h1>

<p style={{

  fontSize: 18,
  opacity: 0.9,
  marginTop: 5

}}>

  👤 {dadosUsuario?.usuario}

</p>

<p style={{

  fontSize: 18,
  opacity: 0.9

}}>

  🔐 {dadosUsuario?.tipo}

</p>

        <p style={{

  marginTop: 10,
  fontSize: 20,
  fontWeight: '600',
  color: '#cbd5e1'

}}>

  Escola Argentina Santos da Silva

</p>

<button

  onClick={sair}

  style={{

    marginTop: 15,
    padding: '10px 20px',
    background: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: 14,
    cursor: 'pointer',
    fontWeight: 'bold',

transition: '0.3s',
boxShadow:
'0 8px 20px rgba(37,99,235,0.3)'

border: '1px solid #cbd5e1',
fontSize: 16

  }}

>

  Sair do Sistema

</button>

      </div>

      {/* ENVIAR */}

{/* DASHBOARD */}

<div style={{

  display: 'flex',
  gap: 20,
  marginBottom: 30,
  flexWrap: 'wrap'

transition: '0.3s',
boxShadow:
'0 8px 20px rgba(37,99,235,0.3)'

}}>

  {/* CARD TOTAL */}

  <div style={{

    flex: 1,
    minWidth: 220,
    background:
'linear-gradient(135deg,#2563eb,#1d4ed8)',
    color: '#fff',
    padding: 35,
    borderRadius: 28,

  }}>

    <h3>

      Total de Arquivos

    </h3>

    <h1>

      {arquivos.length}

    </h1>

  </div>

  {/* CARD IMPRESSOS */}

  <div style={{

    flex: 1,
    minWidth: 220,
    background: '#16a34a',
    color: '#fff',
    padding: 35,
    borderRadius: 28,

boxShadow:
'0 10px 30px rgba(0,0,0,0.15)',


  }}>

    <h3>

      Impressos

    </h3>

    <h1>

      {

        arquivos.filter(

          item =>
          item.status === 'Impresso'

        ).length

      }

    </h1>

  </div>

  {/* CARD PENDENTES */}

  <div style={{

    flex: 1,
    minWidth: 220,
    background: '#f59e0b',
    color: '#fff',
    padding: 35,
    borderRadius: 28,

boxShadow:
'0 10px 30px rgba(0,0,0,0.15)',

  }}>

    <h3>

      Pendentes

    </h3>

    <h1>

      {

        arquivos.filter(

          item =>
          item.status === 'Pendente'

        ).length

      }

    </h1>

  </div>

</div>

      {/* ENVIAR */}

<div style={{

  background: '#fff',
  padding: 30,
  borderRadius: 28,

boxShadow:
'0 10px 30px rgba(0,0,0,0.15)',

  marginBottom: 30,

}}>

  <h2>

    Enviar Documento

  </h2>

  <input

    type="file"

    onChange={(e) =>

      setArquivo(
        e.target.files[0]
      )

    }

    style={{

      marginTop: 20

    }}

  />

  <button

    onClick={enviarArquivo}

    style={{

      width: '100%',
      padding: 14,
      marginTop: 20,
      background:
'linear-gradient(135deg,#2563eb,#1d4ed8)',
      color: '#fff',
      border: 'none',
      borderRadius: 14,
      cursor: 'pointer',
      fontWeight: 'bold',

border: '1px solid #cbd5e1',
fontSize: 16

    }}

  >

    Enviar Documento

  </button>

</div>

      {/* HISTÓRICO */}

      <div
        style={{
          background: '#fff',
          padding: 30,
          borderRadius: 28,

boxShadow:
'0 10px 30px rgba(0,0,0,0.15)',

        }}
      >

        <h2>
          Documentos Recebidos
        </h2>

<p style={{

  marginBottom: 20,
  color: '#475569',
  fontWeight: 'bold',

}}>

  {

    arquivos.filter((item) =>

      item.usuario
      .toLowerCase()
      .includes(
        busca.toLowerCase()
      )

      ||

      item.nome
      .toLowerCase()
      .includes(
        busca.toLowerCase()
      )

      ||

      item.status
      .toLowerCase()
      .includes(
        busca.toLowerCase()
      )

    ).length

  }

  documentos encontrados

</p>

<input

  placeholder="🔎 Pesquisar documentos"

  value={busca}

  onChange={(e) =>

    setBusca(
      e.target.value
    )

  }

  style={{

    width: '100%',
    padding: 12,
    marginTop: 15,
    marginBottom: 20,
    borderRadius: 14,
    border: '1px solid #cbd5e1',
    fontSize: 16

  }}

/>

<input

  placeholder="Pesquisar arquivo ou professor"

  value={pesquisa}

  onChange={(e) =>

    setPesquisa(
      e.target.value
    )

  }

  style={{

    width: '100%',
    padding: 12,
    marginTop: 15,
    marginBottom: 20,
    borderRadius: 14,
    border: '1px solid #cbd5e1'

border: '1px solid #cbd5e1',
fontSize: 16

  }}

/>

<p style={{

  marginBottom: 20,
  color: '#475569',
  fontWeight: 'bold',

}}>

  {

    arquivos

    .filter((item) =>

      item.usuario
      .toLowerCase()
      .includes(
        busca.toLowerCase()
      )

      ||

      item.nome
      .toLowerCase()
      .includes(
        busca.toLowerCase()
      )

      ||

      item.status
      .toLowerCase()
      .includes(
        busca.toLowerCase()
      )

    )

    .length

  }

  {' '}documentos encontrados

</p>

        <table
  width="100%"
  cellPadding="12"
  style={{
    borderCollapse: 'collapse'
  }}
>

          <thead>

            <tr>

              <th>ID</th>
              <th>Professor</th>
              <th>Arquivo</th>
              <th>Data</th>
              <th>Status</th>
              <th>Imprimir</th>
              <th>Excluir</th>

            </tr>

          </thead>

          <tbody>

            {

              arquivos

.filter((item) =>

  item.usuario
  .toLowerCase()
  .includes(
    busca.toLowerCase()
  )

  ||

  item.nome
  .toLowerCase()
  .includes(
    busca.toLowerCase()
  )

  ||

  item.status
  .toLowerCase()
  .includes(
    busca.toLowerCase()
  )

)

.map((item) => (

                <tr key={item.id}>

                  <td>
                    {item.id}
                  </td>

                  <td>
                    {item.usuario}
                  </td>

                  <td>
                    {item.nome}
                  </td>

                  <td>
                    {item.data}
                  </td>

                  <td>

                    <span

                      style={{

                        padding:
                        '6px 12px',

                        borderRadius: 14,

                        color: '#fff',

                        fontWeight:
                        'bold',

border: '1px solid #cbd5e1',
fontSize: 16

                        background:

                          item.status === 'Impresso'

                          ? '#16a34a'

                          : item.status === 'Imprimindo'

                          ? '#2563eb'

                          : item.status === 'Disponível'

                          ? '#2563eb'

                          : '#f59e0b'

                      }}

                    >

                      {item.status}

                    </span>

                  </td>

                  <td>

                    <select

                      value={
                        impressoraSelecionada
                      }

                      onChange={(e) =>

                        setImpressoraSelecionada(
                          e.target.value
                        )

                      }

                      style={{

                        padding: 8,
                        borderRadius: 8

                      }}

                    >

                      <option value="">
                        Impressora
                      </option>

                      {

                        impressoras.map((imp, index) => (

                          <option

                            key={index}

                            value={imp.name}

                          >

                            {imp.name}

                          </option>

                        ))

                      }

                    </select>

                    <button

                      onClick={() =>

  window.open(

    `${API}/uploads/${item.nome}`,

    '_blank'

  )

}

                      style={{

                        marginLeft: 10,
                        padding: 8,
                        background: '#16a34a',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer'

                      }}

                    >

                      🖨️ Imprimir

                    </button>

                  </td>

<td>

  <button

    onClick={() =>

      excluirArquivo(item.id)

    }

    style={{

      padding: 8,
      background: '#dc2626',
      color: '#fff',
      border: 'none',
      borderRadius: 8,
      cursor: 'pointer'

    }}

  >

    Excluir

  </button>

</td>

                </tr>

              ))

            }

          </tbody>

                </table>

style={{

}}

      </div>

{

dadosUsuario?.tipo === 'Coordenador' && (

      <div style={{

        background: '#fff',
        padding: 30,
        borderRadius: 28,

boxShadow:
'0 10px 30px rgba(0,0,0,0.15)',

        marginTop: 30

      }}>

        <h2>

          Cadastrar Usuário

        </h2>

        <input

          placeholder="Usuário"

          value={novoUsuario}

          onChange={(e) =>

            setNovoUsuario(
              e.target.value
            )

          }

          style={{

            width: '100%',
            padding: 12,
            marginTop: 15,
            borderRadius: 14,
            border: '1px solid #cbd5e1'

border: '1px solid #cbd5e1',
fontSize: 16

          }}

        />

        <input

          type="password"

          placeholder="Senha"

          value={novaSenha}

          onChange={(e) =>

            setNovaSenha(
              e.target.value
            )

          }

          style={{

            width: '100%',
            padding: 12,
            marginTop: 15,
            borderRadius: 14,
            border: '1px solid #cbd5e1'

border: '1px solid #cbd5e1',
fontSize: 16

          }}

        />

        <select

          value={tipoCadastro}

          onChange={(e) =>

            setTipoCadastro(
              e.target.value
            )

          }

          style={{

            width: '100%',
            padding: 12,
            marginTop: 15,
            borderRadius: 14,

border: '1px solid #cbd5e1',
fontSize: 16

          }}

        >

          <option value="Professor">

            Professor

          </option>

          <option value="Coordenador">

            Coordenador

          </option>

        </select>

        <button

          onClick={cadastrarUsuario}

          style={{

            width: '100%',
            padding: 14,
            marginTop: 20,
            background: '#16a34a',
            color: '#fff',
            border: 'none',
            borderRadius: 14,
            cursor: 'pointer',
            fontWeight: 'bold',

border: '1px solid #cbd5e1',
fontSize: 16

          }}

        >

                  Cadastrar Usuário

        </button>

      </div>

)

}

      </div>

    </div>

  )

}