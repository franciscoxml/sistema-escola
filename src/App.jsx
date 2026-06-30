import axios from 'axios'

import { useState, useEffect } from 'react'

import {
  FaPrint,
  FaTrash,
  FaUpload,
  FaSignOutAlt,
  FaHome,
  FaFileAlt,
  FaChartBar,
  FaUsers
} from 'react-icons/fa'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function App() {
  
  const [dadosUsuario, setDadosUsuario] = useState(null)
 
  const [tela, setTela] = useState('dashboard')
  
  const [usuario, setUsuario] = useState('')
  
  const [pesquisaUsuario, setPesquisaUsuario] = useState('')

  const [senha, setSenha] = useState('')
  
  const [logado, setLogado] = useState(false)
  
  const [novoDocumento, setNovoDocumento] = useState(null)

  const [quantidade, setQuantidade] = useState('')

  const [pesquisa, setPesquisa] = useState('')

  const [filtroStatus, setFiltroStatus] = useState('Todos')

  const [pdfAtual, setPdfAtual] = useState(null)

  const [novoUsuario, setNovoUsuario] = useState('')
  
  const [novaSenha, setNovaSenha] = useState('')

  const [novoTipo, setNovoTipo] = useState('Professor')

  const [usuarios, setUsuarios] = useState([])
  
  const tipoUsuario = dadosUsuario?.tipo

  const nomeUsuario = dadosUsuario?.usuario
  
  const removerDocumento = async (id) => {

  try {

    await axios.delete(
      `https://sistema-escola-api.onrender.com/arquivos/${id}`
    )

    await carregarArquivos()

  } catch (erro) {

    console.log(erro)

    alert('Erro ao excluir arquivo')

  }

}
 
  const [documentos, setDocumentos] = useState([])

  console.log(documentos)

  const carregarArquivos = async () => {

  if (!nomeUsuario || !tipoUsuario) return

  try {

    console.log('================')
    console.log('USUARIO:', nomeUsuario)
    console.log('TIPO:', tipoUsuario)

    const url =
      `https://sistema-escola-api.onrender.com/arquivos?usuario=${nomeUsuario}&tipo=${tipoUsuario}`

    console.log('URL:', url)

    const resposta = await axios.get(url)

    console.log('RESPOSTA API:')
    console.log(resposta.data)

    setDocumentos(

resposta.data

.sort((a,b)=>b.id-a.id)

.map(doc => ({

...
doc,

arquivo: doc.nome,

file:
`https://sistema-escola-api.onrender.com/uploads/${doc.nome}`

}))

)

  } catch (erro) {

    console.log('ERRO:')
    console.log(erro)

  }

}

const carregarUsuarios = async () => {

  try {

    const resposta = await axios.get(
      'https://sistema-escola-api.onrender.com/usuarios'
    )

    setUsuarios(resposta.data)

  } catch (erro) {

    console.log(erro)

  }

}

useEffect(() => {

  const usuarioSalvo = localStorage.getItem('usuario')

  if (usuarioSalvo) {

    const dados = JSON.parse(usuarioSalvo)

    setDadosUsuario(dados)

    setLogado(true)

  }

}, [])

useEffect(() => {

  if (dadosUsuario) {

    carregarArquivos()

    if (dadosUsuario.tipo === 'Coordenador') {

      carregarUsuarios()

    }

  }

}, [dadosUsuario])


  const dadosGrafico = [

  { nome: 'Seg', paginas: 120 },
  { nome: 'Ter', paginas: 300 },
  { nome: 'Qua', paginas: 250 },
  { nome: 'Qui', paginas: 420 },
  { nome: 'Sex', paginas: 390 },
  { nome: 'Sáb', paginas: 500 }

]

if (!logado) {

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-950">

      <div className="bg-slate-900 p-10 rounded-3xl w-96">

        <h1 className="text-4xl text-white font-bold mb-6">

          Sistema de Impressões

        </h1>

<p className="text-slate-400 mb-6">

Escola Argentina Santos da Silva

</p>

        <input
          type="text"
          placeholder="Usuário"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="w-full p-4 rounded-xl mb-4 bg-slate-800 text-white"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-4 rounded-xl mb-4 bg-slate-800 text-white"
        />

        <button

          onClick={async () => {

            try {

              const resposta = await axios.post(

                'https://sistema-escola-api.onrender.com/login',

                {

                  usuario,
                  senha

                }

              )

              if (resposta.data.sucesso) {

                

                localStorage.setItem(
  'usuario',
  JSON.stringify(resposta.data)
)

setDadosUsuario(
  resposta.data
)

setLogado(true)

              } else {

                alert('Usuário ou senha inválidos')

              }

            } catch (erro) {

              console.log(erro)

              alert('Erro ao conectar ao servidor')

            }

          }}

          className="w-full bg-green-600 hover:bg-green-700"

        >

          Entrar

        </button>

      </div>

    </div>

  )

}

  return (

    <div className="flex min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-green-950">

      {/* MENU */}

<div className="w-72 bg-black/50 backdrop-blur-3xl border-r border-slate-800 text-white p-8 shadow-black/50 shadow-2xl flex flex-col justify-between">

  <div>

    <div className="text-center">

  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-2xl shadow-lg">

👨‍🏫

</div>

  <h1 className="mt-5 text-2xl font-black text-white leading-tight">

    Escola Argentina

  </h1>

  <p className="text-lg text-blue-400 font-semibold">

    Santos da Silva

  </p>

  <div className="mt-4 h-px bg-slate-700"></div>

  <p className="mt-4 text-slate-400 text-sm uppercase tracking-widest">

    Sistema de Impressões

  </p>

</div>

    {/* MENU ITENS */}

    <div className="mt-14 flex flex-col gap-4">

  <button
    onClick={() => setTela('dashboard')}
    className={`p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${
      tela === 'dashboard'
        ? 'bg-blue-600 shadow-lg shadow-blue-500/30'
        : 'bg-slate-800/40 hover:bg-slate-700'
    }`}
  >
    <FaHome />
    Dashboard
  </button>

  <button
    onClick={() => setTela('documentos')}
    className={`p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${
      tela === 'documentos'
        ? 'bg-blue-600 shadow-lg shadow-blue-500/30'
        : 'bg-slate-800/40 hover:bg-slate-700'
    }`}
  >
    <FaFileAlt />
    Documentos
  </button>

  {tipoUsuario === 'Coordenador' && (

<button
  onClick={() => setTela('relatorios')}
  className={`p-4 rounded-2xl flex items-center gap-4`}
>
  <FaChartBar />
  Relatórios
</button>

)}

{tipoUsuario === 'Coordenador' && (

<button
  onClick={() => setTela('usuarios')}
  className={`p-4 rounded-2xl flex items-center gap-4 ${
    tela === 'usuarios'
      ? 'bg-blue-600'
      : 'bg-slate-800/40 hover:bg-slate-700'
  }`}
>
 <FaUsers />
  Usuários
</button>

)}

</div>

  </div>

  {/* SAIR */}

 <button

onClick={() => {

  localStorage.removeItem('usuario')

  window.location.reload()

}}

className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:scale-105 transition-all duration-300 p-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl"

>

  <FaSignOutAlt />

  Sair

</button>

</div>

      {/* CONTEÚDO */}

      <div className="flex-1 p-8">

        {/* TOPO */}

<div className="bg-black/40 backdrop-blur-2xl border border-slate-800 text-white rounded-3xl p-8 shadow-blue-500/20 shadow-2xl flex items-center justify-between">

  {/* ESQUERDA */}

  <div>

    <div>

<h1 className="text-5xl font-black text-white">

Escola Argentina Santos da Silva

</h1>

<p className="text-blue-400 text-xl mt-2 font-semibold">

Sistema Inteligente de Controle de Impressões

</p>

<p className="text-slate-400 mt-2">

Secretaria Escolar • Professores • Coordenação

</p>

</div>

  </div>

  {/* DIREITA */}

  <div className="flex items-center gap-5">

    {/* PESQUISA */}

    <input
      type="text"
      placeholder="Pesquisar documentos..."
      value={pesquisa}
      onChange={(e) => setPesquisa(e.target.value)}
      className="bg-slate-800 border border-slate-700 px-5 py-3 rounded-2xl text-white outline-none focus:border-blue-500 transition-all w-80"
    />

<select
value={filtroStatus}
onChange={(e)=>setFiltroStatus(e.target.value)}
className="bg-slate-800 border border-slate-700 px-5 py-3 rounded-2xl text-white"
>

<option>Todos</option>
<option>Pendente</option>
<option>Impresso</option>
<option>Cancelado</option>

</select>

    {/* NOTIFICAÇÃO */}

    <button className="bg-slate-800 hover:bg-slate-700 transition-all duration-300 p-4 rounded-2xl">

      🔔

    </button>

    {/* USUÁRIO */}

    <div className="flex items-center gap-3 bg-slate-800 px-4 py-3 rounded-2xl">

      <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center font-bold text-lg">

🏫

</div>

      <div>

        <h2 className="font-bold text-lg">

{dadosUsuario?.usuario}

</h2>

        <p className="text-green-400 font-semibold">

{dadosUsuario?.tipo}

</p>

      </div>

    </div>

  </div>

</div>
 
{
  tela === 'dashboard' && (
    <>

        {/* CARDS */}

        <div className="grid grid-cols-3 gap-6 mt-8">

          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all duration-300">

            <h2 className="text-xl">
              Total
            </h2>

            <h1 className="text-6xl font-bold mt-4">
              {documentos.length}
            </h1>

          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all duration-300">

            <h2 className="text-xl">
              Impressos
            </h2>

            <h1 className="text-6xl font-bold mt-4">
              {
  documentos.filter(doc => doc.status === 'Impresso').length
}
            </h1>

          </div>

          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all duration-300">

            <h2 className="text-xl">
              Pendentes
            </h2>

            <h1 className="text-6xl font-bold mt-4">
              {
  documentos.filter(doc => doc.status === 'Pendente').length
}
            </h1>

          </div>

        </div>

<div className="bg-slate-800 p-6 rounded-3xl">

<h2 className="text-2xl font-bold">

Impressos

</h2>

<p className="text-5xl font-black text-green-500 mt-4">

{
documentos.filter(
doc=>doc.status==="Impresso"
).length
}

</p>

</div>

        {/* ENVIAR */}

        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700 rounded-3xl p-8 mt-8 shadow-2xl">

          <h2 className="text-3xl font-bold text-white mb-6">

            Enviar Documento

          </h2>

          <input
  type="file"
  onChange={(e) => setNovoDocumento(e.target.files[0])}
  className="mt-6 w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white"
/>

<input
type="number"
placeholder="Quantidade de cópias"
value={quantidade}
onChange={(e)=>setQuantidade(e.target.value)}
className="mt-6 w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white"
/>

          <button
 onClick={async () => {

  if (!novoDocumento) return

  const formData = new FormData()

  formData.append(
    'arquivo',
    novoDocumento
  )

  formData.append(
  'usuario',
  nomeUsuario
)

formData.append(
'quantidade',
quantidade
)

  try {

    const resposta = await axios.post(

      'https://sistema-escola-api.onrender.com/upload',

      formData

    )

    console.log(resposta.data)

    alert('Documento enviado com sucesso!')

    await carregarArquivos()

    setNovoDocumento(null)

  } catch (erro) {

    console.log(erro)

    alert('Erro ao enviar documento')

  }

}}

  className="mt-6 bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-110 hover:shadow-blue-500/40 transition text-white px-8 py-4 rounded-2xl flex items-center gap-3"
>

  <FaUpload />

  Enviar Documento

</button>

        </div>

{/* GRÁFICO */}

<div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-700 rounded-3xl p-8 mt-8 shadow-blue-500/10 shadow-2xl text-white">

  <h2 className="text-3xl font-bold mb-8">

    Volume de Impressões

  </h2>

  <div style={{ width: '100%', height: '400px' }}>

  <ResponsiveContainer width="100%" height={400}>

    <LineChart data={dadosGrafico}>

        <XAxis
          dataKey="nome"
          stroke="#94a3b8"
        />

        <YAxis stroke="#94a3b8" />

        <Tooltip
  contentStyle={{
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '16px',
    color: '#fff'
  }}
/>

        <Line
  type="monotone"
  dataKey="paginas"
  stroke="#3b82f6"
  strokeWidth={5}
  dot={{
    r: 6,
    fill: '#3b82f6',
    strokeWidth: 2,
    stroke: '#fff'
  }}
  activeDot={{
    r: 10
  }}
/>

      </LineChart>

    </ResponsiveContainer>

  </div>

</div>

        {/* TABELA */}

        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700 rounded-3xl p-8 mt-8 shadow-2xl text-white">

          <h2 className="text-3xl font-bold text-white mb-6">

            Documentos

          </h2>

          <table className="w-full overflow-hidden rounded-3xl border-separate border-spacing-y-4">

            <thead>

              <tr className="text-left text-slate-400 uppercase text-sm tracking-widest">

<th className="pb-4">
Professor
</th>

<th className="pb-4">
Arquivo
</th>

<th className="pb-4">
Quantidade
</th>

<th className="pb-4">
Status
</th>

<th className="pb-4">
Data Impressão
</th>

<th className="pb-4">
Ações
</th>

</tr>

            </thead>

            <tbody>

  {documentos

.filter(doc =>

doc.nome.toLowerCase().includes(
pesquisa.toLowerCase()
)

||

doc.usuario.toLowerCase().includes(
pesquisa.toLowerCase()

)

)

.filter(doc =>

filtroStatus === 'Todos'

?

true

:

doc.status === filtroStatus

)

.map((doc,index)=>(



    <tr
      key={index}
      className="bg-slate-900/80 hover:bg-slate-800/80 transition-all duration-300 shadow-xl"
    >

      <td className="py-6 px-4 rounded-l-2xl font-semibold">

  <div>

    <p>
  {doc.usuario}
</p>

    <p className="text-slate-500 text-sm mt-1">
      {doc.data}
    </p>

  </div>

</td>

      <td>
        {doc.nome}
      </td>

      <td>
        {doc.quantidade}
      </td>

      <td>

        <span
  className={`px-4 py-2 rounded-full text-sm font-bold text-white ${
    doc.status === 'Impresso'
      ? 'bg-green-600'
      : doc.status === 'Cancelado'
      ? 'bg-red-600'
      : 'bg-yellow-500'
  }`}
>

<select
  value={doc.status}
  onChange={async (e) => {

  const novoStatus = e.target.value
  
  console.log("ID:", doc.id)
  console.log("STATUS:", novoStatus)
  
  try {

    await axios.put(
  `https://sistema-escola-api.onrender.com/arquivos/${doc.id}`,
  {
    status: novoStatus,
    observacao: doc.observacao || '',
    quantidade: doc.quantidade || 0
  }
)

    await carregarArquivos()

  } catch (erro) {

    alert('Erro ao atualizar status')

  }

}}
  className="bg-transparent outline-none text-white"
>

  <option value="Pendente" className="text-black">
    Pendente
  </option>

  <option value="Impresso" className="text-black">
    Impresso
  </option>

  <option value="Cancelado" className="text-black">
    Cancelado
  </option>

</select>

</span>

      </td>
<td>

{doc.dataImpressao || '-'}

</td>
      <td>

        <div className="flex gap-3">

<button
  onClick={() => window.open(doc.file)}
  className="bg-yellow-500 hover:bg-yellow-600 transition text-white p-3 rounded-xl"
>

  👁

</button>

          <button
  onClick={() => {

  window.open(
  `https://sistema-escola-api.onrender.com/uploads/${doc.nome}`
)

  const novaLista = [...documentos]

novaLista[index].status = 'Impresso'

setDocumentos(novaLista)

  document.getElementById(`download-${index}`).click()

  const atualizados = documentos.map((item, i) => {

    if (i === index) {
      return { ...item, status: 'Impresso' }
    }
 
    return item

  })

  setDocumentos(atualizados)

}}
  className="bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-xl"
>

  <FaPrint />

<a
  href={doc.file}
  download={doc.arquivo}
  className="hidden"
  id={`download-${index}`}
></a>

</button>

          {tipoUsuario === 'Coordenador' && (

<button
  onClick={() => {

    const confirmar = window.confirm(
      'Deseja realmente excluir este documento?'
    )

    if (confirmar) {
      removerDocumento(doc.id)
    }

  }}
  className="bg-gradient-to-r from-red-500 to-red-700 hover:scale-110 transition-all duration-300 text-white p-3 rounded-xl"
>

  <FaTrash />

</button>

)}

        </div>

      </td>

    </tr>

  ))}

</tbody>

          </table>

        </div>

            </>
      )
}

{
  tela === 'documentos' && (

    <div className="mt-8 bg-slate-900/60 backdrop-blur-2xl border border-slate-700 rounded-3xl p-8 shadow-2xl">

      <div className="flex items-center justify-between mb-8">

        <h1 className="text-4xl font-black">
          Documentos
        </h1>

        <button className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-2xl font-bold">
          + Novo Documento
        </button>

      </div>

      <div className="space-y-4">

  {documentos.map((doc, index) => (

    <div
      key={index}
      className="bg-slate-800 p-6 rounded-2xl flex items-center justify-between"
    >

      <div>

        <h2 className="text-2xl font-bold">
          {doc.arquivo}
        </h2>

        <td className="py-6 px-4 rounded-l-2xl font-semibold">

  <div>

    <p>
  {doc.usuario}
</p>

    <p className="text-slate-500 text-sm mt-1">
      {doc.data}
    </p>

  </div>

</td>

      </div>

      <div className="flex gap-3">

        <button
  onClick={() => {

window.open(

`https://sistema-escola-api.onrender.com/uploads/${doc.arquivo}`,

'_blank'

)

}}
  className="bg-blue-600 hover:bg-blue-700 transition p-3 rounded-xl"
>

  <FaPrint />

<a
  href={doc.file}
  download={doc.arquivo}
  className="hidden"
  id={`download-${index}`}
></a>

</button>

        <button
  onClick={() => {

    const confirmar = window.confirm(
      'Deseja realmente excluir este documento?'
    )

    if (confirmar) {
      removerDocumento(doc.id)
    }

  }}
  className="bg-gradient-to-r from-red-500 to-red-700 hover:scale-110 hover:shadow-red-500/40 transition-all duration-300 text-white p-3 rounded-xl shadow-lg"
>

  <FaTrash />

</button>

      </div>

    </div>

  ))}

</div>

    </div>

  )
}

{
  tela === 'relatorios' && (

    <div className="mt-8 bg-slate-900/60 backdrop-blur-2xl border border-slate-700 rounded-3xl p-8 shadow-2xl">

      <h1 className="text-4xl font-black mb-8">
        Relatórios
      </h1>

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-slate-800 p-6 rounded-3xl">

          <h2 className="text-2xl font-bold">
            Total de Impressões
          </h2>

          <p className="text-5xl font-black text-blue-500 mt-4">
            {documentos.length}
          </p>

        </div>

        <div className="bg-slate-800 p-6 rounded-3xl">

          <h2 className="text-2xl font-bold">
            Professores Ativos
          </h2>

          <p className="text-5xl font-black text-green-500 mt-4">
            {
usuarios.length
}
          </p>

        </div>

        <div className="bg-slate-800 p-6 rounded-3xl">

          <h2 className="text-2xl font-bold">
            Pendências
          </h2>

          <p className="text-5xl font-black text-yellow-500 mt-4">
            {
documentos.filter(
doc=>doc.status==="Pendente"
).length
}
          </p>

        </div>

      </div>

    </div>

  )
}

{
  tela === 'usuarios' &&
  tipoUsuario === 'Coordenador' && (

    <div className="mt-8 bg-slate-900/60 rounded-3xl p-8">

      <h1 className="text-4xl font-black mb-8">
        Cadastro de Usuários
      </h1>

      <div className="max-w-xl space-y-4">

        <input
          type="text"
          placeholder="Usuário"
          value={novoUsuario}
          onChange={(e) => setNovoUsuario(e.target.value)}
          className="w-full p-4 rounded-xl bg-slate-800"
        />

        <input
          type="password"
          placeholder="Senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          className="w-full p-4 rounded-xl bg-slate-800"
        />

        <select
          value={novoTipo}
          onChange={(e) => setNovoTipo(e.target.value)}
          className="w-full p-4 rounded-xl bg-slate-800"
        >
          <option>Professor</option>
          <option>Coordenador</option>
        </select>

        <button
          onClick={async () => {

            try {

              await axios.post(
                'https://sistema-escola-api.onrender.com/usuarios',
                {
                  usuario: novoUsuario,
                  senha: novaSenha,
                  tipo: novoTipo
                }
              )

              alert('Usuário criado com sucesso')

              setNovoUsuario('')
              setNovaSenha('')
              setNovoTipo('Professor')

              carregarUsuarios()

            } catch (erro) {

              alert('Erro ao criar usuário')

            }

          }}
          className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-2xl font-bold"
        >
          Criar Usuário
        </button>

<div className="mt-8">

<h2 className="text-2xl font-bold mb-6">

Usuários cadastrados

</h2>

<input
  type="text"
  placeholder="Pesquisar usuário..."
  value={pesquisaUsuario}
  onChange={(e) => setPesquisaUsuario(e.target.value)}
  className="w-full bg-slate-800 p-4 rounded-2xl mb-6"
/>

<div className="bg-slate-800 p-5 rounded-2xl mb-6">

  <h2 className="text-slate-400 text-lg">

    Total de usuários

  </h2>

  <h1 className="text-5xl font-black text-blue-500">

    {usuarios.length}

  </h1>

</div>

<div className="space-y-4">

{usuarios
.filter(user =>
  user.usuario.toLowerCase().includes(
    pesquisaUsuario.toLowerCase()
  )
)
.map((user,index)=>(

<div
key={index}
className="bg-slate-800 p-5 rounded-2xl flex justify-between items-center"
>

<div>

<h2 className="font-bold text-xl">

{user.usuario}

</h2>

<p className="text-slate-400">

{user.tipo}

</p>

</div>

<button

onClick={async()=>{

if(window.confirm('Excluir usuário?')){

try{

await axios.delete(

`https://sistema-escola-api.onrender.com/usuarios/${user.id}`

)

carregarUsuarios()

}catch{

alert('Erro ao excluir')

}

}

}}

className="bg-red-600 hover:bg-red-700 p-3 rounded-xl"

>

<FaTrash/>

</button>

</div>

))}

</div>

</div>

      </div>

    </div>

  )
}

      </div>

    </div>

  )

}