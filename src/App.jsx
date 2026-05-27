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

      'http://localhost:3001/usuarios',

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

    if (!usuario) {

      alert(
        'Digite o nome do professor'
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
  // IMPRIMIR
  // =====================================

  async function imprimirArquivo(nomeArquivo) {

    try {

      await axios.post(

        `${API}/imprimir/${nomeArquivo}`,

        {

          impressora:
          impressoraSelecionada

        }

      )

      alert(
        'Imprimindo...'
      )

      carregarArquivos()

    } catch (erro) {

      console.log(erro)

      alert(
        'Erro ao imprimir'
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

        borderRadius: 20,

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

            borderRadius: 10

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

            borderRadius: 10

          }}

        />

        <button

          onClick={fazerLogin}

          style={{

            width: '100%',

            padding: 14,

            marginTop: 20,

            background: '#2563eb',

            color: '#fff',

            border: 'none',

            borderRadius: 10

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
    background: '#e2e8f0'

  }}>

    {/* MENU LATERAL */}

    <div style={{

      width: 250,
      background: '#0f172a',
      color: '#fff',
      padding: 25

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
          borderRadius: 10,
          cursor: 'pointer',
          fontWeight: 'bold'

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
          padding: 25,
          borderRadius: 20,
          marginBottom: 30
        }}
      >

        <h1>
          Controle de Impressões
        </h1>

<p>

  Usuário:
  {dadosUsuario?.usuario}

</p>

<p>

  Tipo:
  {dadosUsuario?.tipo}

</p>

        <p>
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
    borderRadius: 10,
    cursor: 'pointer',
    fontWeight: 'bold'

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

}}>

  {/* CARD TOTAL */}

  <div style={{

    flex: 1,
    minWidth: 220,
    background: '#2563eb',
    color: '#fff',
    padding: 25,
    borderRadius: 20

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
    padding: 25,
    borderRadius: 20

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
    padding: 25,
    borderRadius: 20

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
  padding: 20,
  borderRadius: 20,
  marginBottom: 30

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
      background: '#2563eb',
      color: '#fff',
      border: 'none',
      borderRadius: 10,
      cursor: 'pointer',
      fontWeight: 'bold'

    }}

  >

    Enviar Documento

  </button>

</div>

      {/* HISTÓRICO */}

      <div
        style={{
          background: '#fff',
          padding: 20,
          borderRadius: 20
        }}
      >

        <h2>
          Documentos Recebidos
        </h2>

<p style={{

  marginBottom: 20,
  color: '#475569',
  fontWeight: 'bold'

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
    borderRadius: 10,
    border: '1px solid #cbd5e1'

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
    borderRadius: 10,
    border: '1px solid #cbd5e1'

  }}

/>

<p style={{

  marginBottom: 20,
  color: '#475569',
  fontWeight: 'bold'

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
        >

          <thead>

            <tr>

              <th>ID</th>
              <th>Professor</th>
              <th>Arquivo</th>
              <th>Data</th>
              <th>Status</th>
              <th>PDF</th>
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

                        borderRadius: 10,

                        color: '#fff',

                        fontWeight:
                        'bold',

                        background:

                          item.status === 'Impresso'

                          ? '#16a34a'

                          : item.status === 'Imprimindo'

                          ? '#2563eb'

                          : item.status === 'Erro'

                          ? '#dc2626'

                          : '#f59e0b'

                      }}

                    >

                      {item.status}

                    </span>

                  </td>

                  <td>

                    <button

                      onClick={() =>

                        window.open(

`${API}/uploads/${item.nome}`,

'_blank'

                        )

                      }

                      style={{

                        padding: 8,
                        background: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer'

                      }}

                    >

                      Abrir PDF

                    </button>

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

                        imprimirArquivo(
                          item.nome
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

      </div>

{

dadosUsuario?.tipo === 'Coordenador' && (

      <div style={{

        background: '#fff',
        padding: 20,
        borderRadius: 20,
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
            borderRadius: 10,
            border: '1px solid #cbd5e1'

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
            borderRadius: 10,
            border: '1px solid #cbd5e1'

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
            borderRadius: 10

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
            borderRadius: 10,
            cursor: 'pointer',
            fontWeight: 'bold'

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