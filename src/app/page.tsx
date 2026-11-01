import { Bot, Building2, MessageSquare, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-10 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">MULT Manager</h1>
            <p className="text-slate-400 mt-1">Gestão Multi-Unidades e Bots de Atendimento</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
              FV
            </div>
            <span className="font-semibold text-sm text-slate-200">Fausto Vieira (Master)</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700/60 flex flex-col gap-4">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-200">Unidades</h3>
              <p className="text-sm text-slate-400">6 franquias cadastradas</p>
            </div>
          </div>

          <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700/60 flex flex-col gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-200">Agentes IA</h3>
              <p className="text-sm text-slate-400">Gemini & Groq Prontos</p>
            </div>
          </div>

          <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700/60 flex flex-col gap-4">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-200">Atendimentos</h3>
              <p className="text-sm text-slate-400">Inbox Ativo</p>
            </div>
          </div>

          <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700/60 flex flex-col gap-4">
            <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-200">Operadores</h3>
              <p className="text-sm text-slate-400">Financeiro & Pedagógico</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
