// =====================================
// IMPORTS
// =====================================

import { useEffect, useState } from 'react'
import axios from 'axios'

// =====================================
// API
// =====================================

const API = 'https://sistema-escola-api.onrender.com'

// =====================================
// ESTILOS
// =====================================

const cardStyle = {
  background: '#fff',
  borderRadius: 28,
  padding: 30,
  boxShadow: '0 10px 30px rgba(0,0,0,0.10)'
}

const inputStyle = {
  width: '100%',
  padding: 14,
  marginTop: 15,
  borderRadius: 14,
  border: '1px solid #cbd5e1',
  fontSize: 16,
  outline: 'none',
  boxSizing: 'border-box'
}

const buttonStyle = {
  padding: 14,
  background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
  color: '#fff',
  border: 'none',
  borderRadius: 14,
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: 16,
  transition: '0.3s'
}

// =====================================
// APP
// =====================================

export default function App() {

  // =====================================
  // STATES
  // =====================================

  const [arquivo, setArquivo] = useState(null)

  const [usuario, setUsuario] = useState('')

  const [senha, setSenha] = useState('')

  const [logado, setLogado] = useState(false)

  const [dadosUsuario, setDadosUsuario] = useState(null)

  const [arquivos, setArquivos] = useState([])

  const [busca, setBusca] = useState('')

  const [impressoras, setImpressoras] = useState([])

  const [impressoraSelecionada, setImpressoraSelecionada] =
    useState('')

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
  // LOGIN
  // =====================================

  async function fazerLogin() {

    try {

      const resposta = await axios.post(
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

        alert('Login realizado')

      } else {

        alert('Usuário inválido')

      }

    } catch (erro) {

      console.log(erro)

      alert('Erro no login')

    }

  }

  // =====================================
  // CARREGAR ARQUIVOS
  // =====================================

  async function carregarArquivos() {

    try {

      const resposta = await axios.get(
        `${API}/arquivos`,
        {
          params: {
            usuario: dadosUsuario?.usuario,
            tipo: dadosUsuario?.tipo
          }
        }
      )

      setArquivos(resposta.data)

    } catch (erro) {

      console.log(erro)

    }

  }

  // =====================================
  // CARREGAR IMPRESSORAS
  // =====================================

  async function carregarImpressoras() {

    try {

      const resposta = await axios.get(
        `${API}/impressoras`
      )

      setImpressoras(resposta.data)

    } catch (erro) {

      console.log(erro)

    }

  }

  // =====================================
  // ENVIAR ARQUIVO
  // =====================================

  async function enviarArquivo() {

    if (!arquivo) {

      alert('Selecione um arquivo')
      return

    }

    try {

      const formData = new FormData()

      formData.append('arquivo', arquivo)

      formData.append(
        'usuario',
        dadosUsuario.usuario
      )

      const resposta = await axios.post(
        `${API}/upload`,
        formData
      )

      if (resposta.data.sucesso) {

        alert('Arquivo enviado')

        setArquivo(null)

        carregarArquivos()

      }

    } catch (erro) {

      console.log(erro)

      alert('Erro ao enviar')

    }

  }

  // =====================================
  // EXCLUIR
  // =====================================

  async function excluirArquivo(id) {

    const confirmar = window.confirm(
      'Deseja excluir este arquivo?'
    )

    if (!confirmar) return

    try {

      const resposta = await axios.delete(
        `${API}/arquivos/${id}`
      )

      if (resposta.data.sucesso) {

        alert('Arquivo excluído')

        carregarArquivos()

      }

    } catch (erro) {

      console.log(erro)

      alert('Erro ao excluir')

    }

  }

  // =====================================
  // CADASTRAR USUÁRIO
  // =====================================

  async function cadastrarUsuario() {

    try {

      const resposta = await axios.post(
        `${API}/usuarios`,
        {
          usuario: novoUsuario,
          senha: novaSenha,
          tipo: tipoCadastro
        }
      )

      if (resposta.data.sucesso) {

        alert('Usuário cadastrado')

        setNovoUsuario('')
        setNovaSenha('')

      } else {

        alert(resposta.data.erro)

      }

    } catch (erro) {

      console.log(erro)

      alert('Erro ao cadastrar')

    }

  }

  // =====================================
  // USE EFFECT
  // =====================================

  useEffect(() => {

    if (logado && dadosUsuario) {

      carregarArquivos()
      carregarImpressoras()

    }

  }, [logado, dadosUsuario])

  // =====================================
  // FILTRO
  // =====================================

  const arquivosFiltrados = arquivos.filter((item) => {

    return (

      item.usuario
        .toLowerCase()
        .includes(busca.toLowerCase())

      ||

      item.nome
        .toLowerCase()
        .includes(busca.toLowerCase())

      ||

      item.status
        .toLowerCase()
        .includes(busca.toLowerCase())

    )

  })

  // =====================================
  // LOGIN SCREEN
  // =====================================

  if (!logado) {

    return (

      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background:
          'linear-gradient(135deg,#0f172a,#1e293b)'
      }}>

        <div style={{
          ...cardStyle,
          width: 380
        }}>

          <h1 style={{
            textAlign: 'center',
            marginBottom: 30
          }}>
            Controle Escolar
          </h1>

          <input
            placeholder="Usuário"
            value={usuario}
            onChange={(e) =>
              setUsuario(e.target.value)
            }
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) =>
              setSenha(e.target.value)
            }
            style={inputStyle}
          />

          <button
            onClick={fazerLogin}
            style={{
              ...buttonStyle,
              width: '100%',
              marginTop: 20
            }}
          >
            Entrar
          </button>

        </div>

      </div>

    )

  }

  // =====================================
  // SISTEMA
  // =====================================

  return (

    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background:
        'linear-gradient(135deg,#f1f5f9,#cbd5e1)'
    }}>

      {/* MENU */}

      <div style={{
        width: 260,
        background:
          'linear-gradient(135deg,#0f172a,#1e293b)',
        color: '#fff',
        padding: 30
      }}>

        <h2>ESCOLA</h2>

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
            ...buttonStyle,
            width: '100%',
            marginTop: 20,
            background: '#dc2626'
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

        <div style={{
          background:
            'linear-gradient(135deg,#0f172a,#1e293b)',
          color: '#fff',
          padding: 35,
          borderRadius: 28,
          marginBottom: 30
        }}>

          <h1 style={{
            fontSize: 42,
            fontWeight: '800'
          }}>
            Controle de Impressões
          </h1>

          <p>
            Escola Argentina Santos da Silva
          </p>

        </div>

        {/* DASHBOARD */}

        <div style={{
          display: 'flex',
          gap: 20,
          flexWrap: 'wrap',
          marginBottom: 30
        }}>

          <div style={{
            flex: 1,
            minWidth: 220,
            background:
              'linear-gradient(135deg,#2563eb,#1d4ed8)',
            color: '#fff',
            padding: 30,
            borderRadius: 28
          }}>

            <h3>Total</h3>

            <h1>
              {arquivos.length}
            </h1>

          </div>

          <div style={{
            flex: 1,
            minWidth: 220,
            background:
              'linear-gradient(135deg,#16a34a,#15803d)',
            color: '#fff',
            padding: 30,
            borderRadius: 28
          }}>

            <h3>Impressos</h3>

            <h1>
              {
                arquivos.filter(
                  item =>
                    item.status === 'Impresso'
                ).length
              }
            </h1>

          </div>

          <div style={{
            flex: 1,
            minWidth: 220,
            background:
              'linear-gradient(135deg,#f59e0b,#d97706)',
            color: '#fff',
            padding: 30,
            borderRadius: 28
          }}>

            <h3>Pendentes</h3>

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

        <div style={cardStyle}>

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
    ...buttonStyle,
    width: '100%',
    marginTop: 20
  }}
>

  Enviar Documento

</button>

</div>
            {/* HISTÓRICO */}

<div style={{
  ...cardStyle,
  marginTop: 30
}}>

  <h2>
    Documentos Recebidos
  </h2>

  <input

    placeholder="🔎 Pesquisar documentos"

    value={busca}

    onChange={(e) =>

      setBusca(e.target.value)

    }

    style={inputStyle}

  />

  <p style={{

    marginBottom: 20,
    color: '#475569',
    fontWeight: 'bold'

  }}>

    {arquivosFiltrados.length}
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

      <tr style={{

        background: '#e2e8f0'

      }}>

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

        arquivosFiltrados.map((item) => (

          <tr

            key={item.id}

            style={{

              borderBottom:
              '1px solid #e2e8f0'

            }}

          >

            <td>{item.id}</td>

            <td>{item.usuario}</td>

            <td>{item.nome}</td>

            <td>{item.data}</td>

            <td>

              <span style={{

                padding: '6px 12px',
                borderRadius: 14,
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 14,

                background:

                  item.status === 'Impresso'

                  ? '#16a34a'

                  : item.status === 'Imprimindo'

                  ? '#2563eb'

                  : '#f59e0b'

              }}>

                {item.status}

              </span>

            </td>

            <td>

              <select

                value={impressoraSelecionada}

                onChange={(e) =>

                  setImpressoraSelecionada(
                    e.target.value
                  )

                }

                style={{

                  padding: 8,
                  borderRadius: 10,
                  border:
                  '1px solid #cbd5e1'

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
                  padding: '8px 14px',
                  background: '#16a34a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontWeight: 'bold'

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

                  padding: '8px 14px',
                  background: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontWeight: 'bold'

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

{/* CADASTRAR USUÁRIO */}

{

  dadosUsuario?.tipo ===
  'Coordenador'

  && (

    <div style={{

      ...cardStyle,
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

        style={inputStyle}

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

        style={inputStyle}

      />

      <select

        value={tipoCadastro}

        onChange={(e) =>

          setTipoCadastro(
            e.target.value
          )

        }

        style={inputStyle}

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

          ...buttonStyle,
          width: '100%',
          background:
          'linear-gradient(135deg,#16a34a,#15803d)'

        }}

      >

        Cadastrar Usuário

              </button>

      </div>

    )

  }

</div>

  )

}
