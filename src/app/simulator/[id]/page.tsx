"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { 
  ArrowLeft, 
  Send, 
  Bot, 
  User, 
  Cpu, 
  Clock, 
  Zap, 
  ShieldAlert, 
  Sparkles,
  RefreshCw,
  Sliders
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  provider?: string;
  model?: string;
  latencyMs?: number;
  fallbackUsed?: boolean;
}

export default function SimulatorPage() {
  const params = useParams();
  const unitId = params?.id as string;

  const [unitName, setUnitName] = useState<string>("Carregando...");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Sou o assistente financeiro da MULT Profissões nesta unidade. Como posso te ajudar hoje?",
      provider: "system",
      latencyMs: 0
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentName, setStudentName] = useState("Lucas Ferreira");
  const [hasDebts, setHasDebts] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadUnit() {
      if (!unitId) return;
      const { data } = await supabase
        .from("units")
        .select("name")
        .eq("id", unitId)
        .single();

      if (data) setUnitName(data.name);
    }
    loadUnit();
  }, [unitId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMsg = inputMessage.trim();
    setInputMessage("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const simulatedDebts = hasDebts ? [
        {
          id: "deb_001",
          description: "Mensalidade Curso de Manutenção",
          value: 189.90,
          due_date: "10/11/2026",
          status: "pending"
        }
      ] : [];

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitId,
          message: userMsg,
          studentName,
          studentDebts: simulatedDebts
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.text,
            provider: data.provider,
            model: data.model,
            latencyMs: data.latencyMs,
            fallbackUsed: data.fallbackUsed
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Erro na resposta: ${data.error || "Falha desconhecida"}`,
            provider: "error"
          }
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Erro de conexão ao simular resposta.",
          provider: "error"
        }
      ]);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#0b1329] text-slate-100 p-4 md:p-8 font-sans flex flex-col">
      <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col space-y-6">
        
        {/* Topo / Barra de Navegação */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  Sandbox de Teste
                </span>
                <span className="text-xs text-slate-400 font-mono">Unidade: {unitName}</span>
              </div>
              <h1 className="text-xl font-bold text-white mt-0.5">
                Simulador do Cérebro da IA (Ao Vivo)
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/units/${unitId}`}
              className="flex items-center gap-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3.5 py-2 rounded-xl transition-colors"
            >
              <Sliders className="w-4 h-4 text-orange-400" />
              Ajustar Playbook & Réguas
            </Link>
            <button
              onClick={() => setMessages([{ role: "assistant", content: "Chat reiniciado. Como posso te ajudar?", provider: "system" }])}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Limpar Conversa"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Grade Central: Simulador + Painel de Diagnóstico */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          
          {/* Coluna 1 e 2: Interface do Chat */}
          <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl flex flex-col h-[600px] overflow-hidden">
            
            {/* Mensagens do Chat */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.map((msg, index) => {
                const isBot = msg.role === "assistant";
                return (
                  <div key={index} className={`flex flex-col ${isBot ? "items-start" : "items-end"}`}>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1 px-1">
                      {isBot ? <Bot className="w-3.5 h-3.5 text-orange-400" /> : <User className="w-3.5 h-3.5 text-sky-400" />}
                      <span>{isBot ? "Agente Financeiro" : studentName}</span>
                    </div>

                    <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                      isBot 
                        ? "bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-tl-sm" 
                        : "bg-blue-600 text-white rounded-tr-sm"
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>

                    {/* Telemetria do Disparo da IA */}
                    {isBot && msg.provider && msg.provider !== "system" && (
                      <div className="flex items-center gap-2 mt-1.5 px-1 text-[10px] font-mono">
                        <span className={`px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                          msg.provider === "gemini" 
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20" 
                            : msg.provider === "groq"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}>
                          <Cpu className="w-2.5 h-2.5" />
                          {msg.provider.toUpperCase()} ({msg.model})
                        </span>

                        {msg.latencyMs !== undefined && (
                          <span className="text-slate-400 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-slate-500" />
                            {msg.latencyMs}ms
                          </span>
                        )}

                        {msg.fallbackUsed && (
                          <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1 rounded flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5" />
                            Fallback Ativado
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/40 border border-slate-800 px-3 py-2 rounded-xl w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-spin" />
                  Orquestrando resposta (Gemini ➔ Groq)...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de Mensagem */}
            <form onSubmit={handleSend} className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Simular mensagem do aluno (ex: Quero pagar minha mensalidade com PIX)..."
                disabled={loading}
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white p-3 rounded-xl transition-colors shadow"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Coluna 3: Painel de Contexto e Diagnóstico */}
          <div className="space-y-4">
            
            {/* Simulador de Contexto do Aluno */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-sky-400" />
                Contexto do Aluno (Mock)
              </h3>
              
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Nome do Aluno
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-300">Simular Parcela em Aberto</p>
                  <p className="text-[11px] text-slate-500">R$ 189,90 (Vencimento 10/11)</p>
                </div>
                <input
                  type="checkbox"
                  checked={hasDebts}
                  onChange={(e) => setHasDebts(e.target.checked)}
                  className="w-4 h-4 accent-orange-500"
                />
              </div>
            </div>

            {/* Diagnóstico da Orquestração */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                Motor Híbrido & Latência
              </h3>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400">1º Provedor (Primário)</span>
                  <span className="font-semibold text-blue-400">Google Gemini Flash</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400">2º Fallback (Circuit Breaker)</span>
                  <span className="font-semibold text-emerald-400">Groq Llama 3.3 70B (~0.3s)</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400">Thinking Budget</span>
                  <span className="font-semibold text-orange-400">0s (Ultra-rápido)</span>
                </div>
              </div>
            </div>

            {/* Aviso Operacional */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-[11px] text-slate-400 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
              <span>
                As mensagens enviadas no simulador utilizam a inteligência real cadastrada para esta unidade, mas <strong>não realizam disparos reais de WhatsApp</strong>.
              </span>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
