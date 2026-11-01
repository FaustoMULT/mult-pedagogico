"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { 
  Building2, 
  Bot, 
  MessageSquare, 
  Wifi, 
  WifiOff, 
  Sliders, 
  Cpu, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw
} from "lucide-react";

interface Unit {
  id: string;
  name: string;
  whatsapp_number: string | null;
  whatsapp_status: string | null;
  ai_financial_enabled: boolean;
}

const DEFAULT_UNITS: Unit[] = [
  { id: "sede-global", name: "Sede Global (Admin)", whatsapp_number: null, whatsapp_status: "DISCONNECTED", ai_financial_enabled: true },
  { id: "agua-boa", name: "Agua Boa", whatsapp_number: null, whatsapp_status: "DISCONNECTED", ai_financial_enabled: true },
  { id: "anapolis", name: "Anápolis", whatsapp_number: null, whatsapp_status: "DISCONNECTED", ai_financial_enabled: true },
  { id: "aparecida-de-goiania", name: "Aparecida de Goiania", whatsapp_number: null, whatsapp_status: "DISCONNECTED", ai_financial_enabled: true },
  { id: "bom-jesus", name: "Bom Jesus", whatsapp_number: null, whatsapp_status: "DISCONNECTED", ai_financial_enabled: true },
  { id: "rio-verde", name: "Rio Verde", whatsapp_number: null, whatsapp_status: "DISCONNECTED", ai_financial_enabled: true },
];

export default function Home() {
  const [units, setUnits] = useState<Unit[]>(DEFAULT_UNITS);
  const [loading, setLoading] = useState(false);
  const [dbConnected, setDbConnected] = useState(true);

  async function loadUnits() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("units")
        .select("id, name, whatsapp_number, whatsapp_status, ai_financial_enabled")
        .order("name", { ascending: true });

      if (error) {
        console.warn("Aviso ao consultar Supabase:", error.message);
        setDbConnected(false);
      } else if (data && data.length > 0) {
        setUnits(data);
        setDbConnected(true);
      }
    } catch (err) {
      console.error("Erro de conexão com o banco:", err);
      setDbConnected(false);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadUnits();
  }, []);

  const activeBots = units.filter((u) => u.ai_financial_enabled).length;
  const connectedWhatsapp = units.filter((u) => u.whatsapp_status === "CONNECTED").length;

  return (
    <main className="min-h-screen bg-[#0b1329] text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-black tracking-wider text-orange-500 uppercase">
                MULT <span className="text-white font-light text-base">Profissões</span>
              </span>
              <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                v1.0
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">
              Painel de Gestão & Monitoramento de Bots
            </h1>
            <p className="text-sm text-slate-400">
              Orquestração de IA Financeira, Réguas de Vencimento e Transbordo Humano
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-xl shadow-lg">
            <div className="w-9 h-9 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow">
              FV
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-tight">Fausto Vieira</p>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">
                MASTER GLOBAL
              </span>
            </div>
          </div>
        </header>

        {/* Métricas Globais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Unidades</p>
              <p className="text-2xl font-bold text-white mt-1">{units.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Franquias na rede</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20">
              <Building2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Bots Ativos</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{activeBots} / {units.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Agente Financeiro ligado</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <Bot className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">WhatsApp</p>
              <p className="text-2xl font-bold text-sky-400 mt-1">{connectedWhatsapp} / {units.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Instâncias Conectadas</p>
            </div>
            <div className="w-12 h-12 bg-sky-500/10 text-sky-400 rounded-xl flex items-center justify-center border border-sky-500/20">
              <Wifi className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Cérebro Híbrido</p>
              <p className="text-sm font-bold text-purple-400 mt-1.5">Gemini + Groq</p>
              <p className="text-xs text-slate-500 mt-0.5">Failover em ~0.3s</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center border border-purple-500/20">
              <Cpu className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Lista de Unidades */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-500" />
                Unidades e Instâncias de Atendimento
              </h2>
              <p className="text-xs text-slate-400">
                Gestão isolada de chaves, réguas de vencimento e simulador
              </p>
            </div>

            <button
              onClick={loadUnits}
              disabled={loading}
              className="flex items-center gap-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-orange-400" : ""}`} />
              Atualizar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {units.map((unit) => {
              const isConnected = unit.whatsapp_status === "CONNECTED";
              return (
                <div 
                  key={unit.id}
                  className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all rounded-2xl p-5 flex flex-col justify-between gap-5 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-base text-white group-hover:text-orange-400 transition-colors">
                          {unit.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {unit.id}</p>
                      </div>

                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                        isConnected 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}>
                        {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                        {isConnected ? "Conectado" : "Desconectado"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
                      <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-medium ${
                        unit.ai_financial_enabled 
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                          : "bg-slate-800 text-slate-500"
                      }`}>
                        <Bot className="w-3 h-3" />
                        Bot Financeiro {unit.ai_financial_enabled ? "Ativo" : "Pausado"}
                      </span>

                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-medium bg-slate-800 text-slate-400 border border-slate-700">
                        <CheckCircle2 className="w-3 h-3 text-orange-400" />
                        Réguas até D+90
                      </span>
                    </div>
                  </div>

                  {/* Ações com Links Funcionais */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800">
                    <Link 
                      href={`/simulator/${unit.id}`}
                      className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 transition-colors text-xs font-semibold text-center"
                    >
                      <Cpu className="w-4 h-4 text-purple-400" />
                      Simulador
                    </Link>

                    <Link 
                      href={`/units/${unit.id}`}
                      className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/20 transition-colors text-xs font-semibold text-center"
                    >
                      <Sliders className="w-4 h-4 text-orange-400" />
                      Configurar
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </main>
  );
}
