import axios from 'axios'

import logo from './assets/logo.png'

import { useState, useEffect } from 'react'

import {
  FaPrint,
  FaTrash,
  FaUpload,
  FaSignOutAlt,
  FaHome,
  FaFileAlt,
  FaChartBar,
  FaUsers,
  FaFolderOpen,
  FaClipboardList,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

function MenuBotao({
  ativo,
  onClick,
  icone,
  texto
}) {

  return (

    <button

      onClick={onClick}

      className={`

      w-full
      p-5
      rounded-2xl
      flex
      items-center
      gap-4

      text-lg
      font-semibold

      transition-all
      duration-300

      hover:translate-x-2
      hover:shadow-xl

      ${
        ativo

          ? 'bg-gradient-to-r from-blue-600 to-blue-800 shadow-blue-500/40 shadow-2xl'

          : 'bg-slate-800/40 hover:bg-slate-700'

      }

      `}

    >

      <div className="text-2xl">

        {icone}

      </div>

      <span>

        {texto}

      </span>

    </button>

  )

}

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

          SECRETARIA ESCOLAR

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

<div className="w-80 bg-black/50 backdrop-blur-3xl border-r border-slate-800 text-white p-8 shadow-black/50 shadow-2xl flex flex-col justify-between">

  <div>

    <div className="text-center">

 <img
src={logo}
className="w-24 h-24 rounded-full shadow-lg"
/>


  <h1 className="text-5xl font-black tracking-tight">
  Escola Argentina Santos da Silva
</h1>

<p className="mt-3 text-blue-400 text-xl font-semibold">
  Sistema de Controle de Impressões
</p>

<p className="mt-2 text-slate-400">
  Secretaria Escolar • Coordenação • Professores
</p>

<div className="mt-5 flex gap-3">

<span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
Controle Escolar
</span>

<span className="bg-green-600 px-3 py-1 rounded-full text-sm">
Sistema Online
</span>

<span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm">
Versão 2.0
</span>

</div>

</div>

    {/* MENU ITENS */}

{/* Informações da Escola */}

<div className="bg-slate-800/40 rounded-2xl p-5 mb-6 border border-slate-700">

  <p className="text-xs text-slate-400 uppercase">
    Unidade Escolar
  </p>

  <h2 className="text-lg font-bold mt-1">
    Escola Argentina Santos da Silva 
    Inep 12022438
  </h2>

  <p className="text-sm text-slate-400 mt-2">
    Feijó - Acre
  </p>

  <div className="mt-4 space-y-2">

    <div className="flex justify-between">
      <span className="text-slate-400">
        Status
      </span>

      <span className="text-green-400 font-bold">
        Online
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-slate-400">
        Ano Letivo
      </span>

      <span>
        2026
      </span>
    </div>

  </div>

</div>

    <div className="mt-14 flex flex-col gap-4">

  <MenuBotao
  ativo={tela === 'Painel Geral'}
  onClick={() => setTela('Painel Geral')}
  icone={<FaHome />}
  texto="Painel Geral"
/>

  <MenuBotao
  ativo={tela === 'Solicitações'}
  onClick={() => setTela('Solicitações')}
  icone={<FaFileAlt />}
  texto="Solicitações"
/>

  {tipoUsuario === 'Coordenador' && (

<MenuBotao
  ativo={tela === 'Estatísticas'}
  onClick={() => setTela('Estatísticas')}
  icone={<FaChartBar />}
  texto="Estatísticas"
/>

)}

{tipoUsuario === 'Coordenador' && (

<MenuBotao
  ativo={tela === 'Funcionários'}
  onClick={() => setTela('Funcionários')}
  icone={<FaUsers />}
  texto="Funcionários"
/>

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

<p className="text-xl text-blue-400 font-semibold mt-2">
Sistema Oficial de Controle de Impressões
</p>

<div className="flex gap-3 mt-5">

<span className="bg-green-600 px-4 py-2 rounded-full text-sm font-bold">
Ano Letivo 2026
</span>

<span className="bg-blue-600 px-4 py-2 rounded-full text-sm font-bold">
INEP 12022438
</span>

<span className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold">
Feijó - Acre
</span>

</div>

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

    <div className="bg-slate-800 rounded-2xl px-6 py-4 flex items-center gap-5">

<div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-2xl font-bold">

{dadosUsuario?.usuario?.charAt(0).toUpperCase()}

</div>

<div>

<h2 className="font-bold text-lg">

{dadosUsuario?.usuario}

</h2>

<p className="text-green-400">

{dadosUsuario?.tipo}

</p>

<p className="text-slate-500 text-sm">

Conectado

</p>

</div>

</div>

  </div>

</div>
 
{
  tela === 'Painel Geral' && (
    <>

<div className="bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 rounded-3xl p-8 shadow-2xl mb-8">

  <h1 className="text-4xl font-black text-white">
Bem-vindo ao Sistema de Impressões , {dadosUsuario?.usuario}! 👋
</h1>

<p className="mt-3 text-slate-200 text-lg">
Controle centralizado de solicitações, impressão de documentos e acompanhamento em tempo real.
</p>

</div>

<div className="flex justify-between items-center mb-8">

<div>

{/* INDICADORES DA ESCOLA */}

<div className="grid grid-cols-4 gap-5 mb-8">

  <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
    <p className="text-slate-400 text-sm">
      Unidade Escolar
    </p>

    <h2 className="text-xl font-bold mt-2">
      Argentina Santos da Silva
    </h2>
  </div>

  <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
    <p className="text-slate-400 text-sm">
      Usuário
    </p>

    <h2 className="text-xl font-bold mt-2">
      {dadosUsuario?.usuario}
    </h2>
  </div>

  <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
    <p className="text-slate-400 text-sm">
      Cargo
    </p>

    <h2 className="text-xl font-bold mt-2 text-green-400">
      {dadosUsuario?.tipo}
    </h2>
  </div>

  <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
    <p className="text-slate-400 text-sm">
      Data
    </p>

    <h2 className="text-xl font-bold mt-2">
      {new Date().toLocaleDateString('pt-BR')}
    </h2>
  </div>

</div>

<h2 className="text-2xl font-bold">

Painel Geral

</h2>

<p className="text-slate-400">

{new Date().toLocaleDateString('pt-BR', {
weekday:'long',
day:'2-digit',
month:'long',
year:'numeric'
})}

</p>

</div>

</div>

{/* BARRA DE ESTATÍSTICAS */}

<div className="grid grid-cols-5 gap-5 mt-8">

<div className="bg-green-600 rounded-2xl p-5 text-center shadow-lg">

<h3 className="text-sm text-green-100">
STATUS
</h3>

<p className="text-2xl font-bold">
🟢 ONLINE
</p>

</div>

<div className="bg-slate-800 rounded-2xl p-5 text-center">

<h3 className="text-sm text-slate-400">
PROFESSORES
</h3>

<p className="text-3xl font-bold">

{usuarios.length}

</p>

</div>

<div className="bg-slate-800 rounded-2xl p-5 text-center">

<h3 className="text-sm text-slate-400">
DOCUMENTOS
</h3>

<p className="text-3xl font-bold">

{documentos.length}

</p>

</div>

<div className="bg-slate-800 rounded-2xl p-5 text-center">

<h3 className="text-sm text-slate-400">
CÓPIAS
</h3>

<p className="text-3xl font-bold">

{

documentos.reduce(

(total,doc)=>total+(Number(doc.quantidade)||0),

0

)

}

</p>

</div>

<div className="bg-slate-800 rounded-2xl p-5 text-center">

<h3 className="text-sm text-slate-400">
AGORA
</h3>

<p className="text-xl font-bold">

{new Date().toLocaleTimeString('pt-BR')}

</p>

</div>

</div>

        {/* DASHBOARD PRINCIPAL */}

<div className="grid grid-cols-4 gap-6 mt-8">

{/* DOCUMENTOS */}

<div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-7 shadow-2xl hover:scale-105 transition-all">

<div className="flex justify-between items-center">

<div>

<p className="text-blue-200 uppercase text-sm">
Documentos
</p>

<h1 className="text-6xl font-black mt-3">
{documentos.length}
</h1>

<p className="text-blue-100 mt-2">
Arquivos cadastrados
</p>

</div>

<FaFolderOpen className="text-7xl opacity-30"/>

</div>

</div>

{/* IMPRESSOS */}

<div className="bg-gradient-to-br from-green-600 to-green-900 rounded-3xl p-7 shadow-2xl hover:scale-105 transition-all">

<div className="flex justify-between items-center">

<div>

<p className="text-green-200 uppercase text-sm">
Impressos
</p>

<h1 className="text-6xl font-black mt-3">

{documentos.filter(doc=>doc.status==="Impresso").length}

</h1>

<p className="text-green-100 mt-2">
Finalizados
</p>

</div>

<FaCheckCircle className="text-7xl opacity-30"/>

</div>

</div>

{/* PENDENTES */}

<div className="bg-gradient-to-br from-yellow-500 to-orange-700 rounded-3xl p-7 shadow-2xl hover:scale-105 transition-all">

<div className="flex justify-between items-center">

<div>

<p className="text-yellow-100 uppercase text-sm">
Pendentes
</p>

<h1 className="text-6xl font-black mt-3">

{documentos.filter(doc=>doc.status==="Pendente").length}

</h1>

<p className="text-yellow-100 mt-2">
Aguardando impressão
</p>

</div>

<FaClock className="text-7xl opacity-30"/>

</div>

</div>

{/* CÓPIAS */}

<div className="bg-gradient-to-br from-purple-600 to-purple-900 rounded-3xl p-7 shadow-2xl hover:scale-105 transition-all">

<div className="flex justify-between items-center">

<div>

<p className="text-purple-200 uppercase text-sm">
Cópias
</p>

<h1 className="text-6xl font-black mt-3">

{
documentos.reduce(
(total,doc)=>total+(Number(doc.quantidade)||0),
0
)
}

</h1>

<p className="text-purple-100 mt-2">
Total solicitado
</p>

</div>

<FaClipboardList className="text-7xl opacity-30"/>

</div>

</div>

</div>

{/* AÇÕES RÁPIDAS */}

<div className="grid grid-cols-4 gap-5 mt-8">

<button
onClick={() => setTela('Solicitações')}
className="bg-blue-600 hover:bg-blue-700 p-6 rounded-3xl shadow-xl transition hover:scale-105"
>

<FaFileAlt className="text-4xl mb-3 mx-auto"/>

<p className="font-bold">
Documentos
</p>

</button>

<button
onClick={() => setTela('Estatísticas')}
className="bg-green-600 hover:bg-green-700 p-6 rounded-3xl shadow-xl transition hover:scale-105"
>

<FaChartBar className="text-4xl mb-3 mx-auto"/>

<p className="font-bold">
Relatórios
</p>

</button>

<button
onClick={() => setTela('Funcionários')}
className="bg-purple-600 hover:bg-purple-700 p-6 rounded-3xl shadow-xl transition hover:scale-105"
>

<FaUsers className="text-4xl mb-3 mx-auto"/>

<p className="font-bold">
Usuários
</p>

</button>

<button
onClick={() => window.location.reload()}
className="bg-yellow-500 hover:bg-yellow-600 p-6 rounded-3xl shadow-xl transition hover:scale-105"
>

<FaHome className="text-4xl mb-3 mx-auto"/>

<p className="font-bold">
Atualizar
</p>

</button>

</div>

        {/* ENVIAR */}

        <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700 rounded-3xl p-8 mt-8 shadow-2xl">

          <div className="flex items-center gap-4 mb-8">

<div className="bg-blue-600 p-4 rounded-2xl">

<FaUpload className="text-3xl"/>

</div>

<div>

<h2 className="text-3xl font-bold">

Nova Solicitação de Impressão

</h2>

<p className="text-slate-400">

Envie um documento para impressão na secretaria.

</p>

</div>

</div>

         <label className="block">

<p className="mb-2 text-slate-400">

Documento (PDF)

</p>

<input
type="file"
onChange={(e)=>setNovoDocumento(e.target.files[0])}
className="w-full bg-slate-800 rounded-2xl p-5 border border-slate-700"
/>

</label>

<label className="block mt-6">

<p className="mb-2 text-slate-400">

Quantidade de Cópias

</p>

<input
type="number"
placeholder="Ex: 50"
value={quantidade}
onChange={(e)=>setQuantidade(e.target.value)}
className="w-full bg-slate-800 rounded-2xl p-5 border border-slate-700"
/>

</label>

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

  className="mt-8 w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 hover:scale-[1.02] transition-all duration-300 p-5 rounded-2xl font-bold text-xl flex justify-center items-center gap-4 shadow-2xl shadow-blue-900/40"
>

 <FaUpload />

<span>Enviar Solicitação</span>

</button>

        </div>

{/* ÚLTIMAS SOLICITAÇÕES */}

<div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-700 rounded-3xl p-8 mt-8 shadow-2xl">

<h2 className="text-3xl font-bold mb-6">
Últimas Solicitações
</h2>

<div className="space-y-4">

{

documentos

.slice(0,5)

.map((doc,index)=>(

<div
key={index}
className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-3xl p-6 transition-all duration-300 shadow-lg"
>

<div>

<h3 className="text-2xl font-bold text-white">

{doc.nome}

</h3>

<p className="text-slate-400 mt-2">
👤 Professor: {doc.usuario}
</p>

<p className="text-slate-500">
🖨️ Quantidade: {doc.quantidade}
</p>

</div>

<div className="text-right">

<p className="text-slate-400">

📅 {doc.data}

</p>

<span
className={`px-3 py-1 rounded-full text-sm font-bold ${
doc.status==="Impresso"
?"bg-green-600"
:doc.status==="Cancelado"
?"bg-red-600"
:"bg-yellow-500"
}`}
>

{doc.status}

</span>

</div>

</div>

))

}

</div>

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

          <div className="space-y-5">

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

<div

key={index}

className="bg-slate-800 hover:bg-slate-700 rounded-3xl p-6 transition-all duration-300 shadow-xl border border-slate-700"

>

<div className="flex justify-between items-start">

<div className="flex gap-5 items-center">

<div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl">

<FaFolderOpen className="text-6xl opacity-40" />

</div>

<div>

<h2 className="text-2xl font-bold">

{doc.nome}

</h2>

<p className="text-slate-400 mt-2">

👤 {doc.usuario}

</p>

<p className="text-slate-500 text-sm">

📅 {doc.data}

</p>

</div>

</div>

<div className="text-right">

<p className="text-slate-400">

Quantidade

</p>

<h2 className="text-3xl font-black">

{doc.quantidade}

</h2>

</div>

</div>

<div className="mt-6 flex justify-between items-center">

<div>

<span

className={`px-5 py-2 rounded-full font-bold text-white ${
doc.status==="Impresso"
?

"bg-green-600"

:

doc.status==="Cancelado"

?

"bg-red-600"

:

"bg-yellow-500"

}`}

>

{doc.status}

</span>

</div>

<div className="flex gap-3">

<button

onClick={()=>

window.open(doc.file)

}

className="bg-blue-600 hover:bg-blue-700 p-3 rounded-xl"

>

👁

</button>

<button

onClick={() => {

const confirmar = window.confirm(

'Deseja excluir este documento?'

)

if(confirmar){

removerDocumento(doc.id)

}

}}

className="bg-red-600 hover:bg-red-700 p-3 rounded-xl"

>

<FaTrash/>

</button>

</div>

</div>

</div>

))

}

</div>

        </div>

            </>
      )
}

{
  tela === 'Solicitações' && (

    <div className="mt-8 bg-slate-900/60 backdrop-blur-2xl border border-slate-700 rounded-3xl p-8 shadow-2xl">

      <div className="flex items-center justify-between mb-8">

        <h1 className="text-4xl font-black">
          Documentos
        </h1>

        <button className="bg-gradient-to-br
from-blue-500
to-blue-700
shadow-2xl
hover:scale-105
transition-all
duration-300 hover:bg-blue-700 transition px-6 py-3 rounded-2xl font-bold">
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
  className="bg-gradient-to-br
from-blue-500
to-blue-700
shadow-2xl
hover:scale-105
transition-all
duration-300 hover:bg-blue-700 transition p-3 rounded-xl"
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
  tela === 'Estatísticas' && (

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

<div className="fixed bottom-0 left-72 right-0 h-12 bg-slate-950 border-t border-slate-800 flex items-center justify-between px-8 text-sm text-slate-400">

<div>

© 2026 • Escola Argentina Santos da Silva

</div>

<div>

Sistema de Controle de Impressões • Versão 2.0

</div>

</div>

      </div>

    </div>

  )

}  