"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { 
  ArrowLeft, 
  Save, 
  Bot, 
  Sliders, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  Sparkles,
  ShieldCheck
} from "lucide-react";

interface UnitConfig {
  id: string;
  name: string;
  ai_financial_enabled: boolean;
  ai_custom_instructions: string | null;
  fup_preventive_days: number;
  fup_preventive_enabled: boolean;
  fup_due_date_enabled: boolean;
  fup_d3_enabled: boolean;
  fup_d7_enabled: boolean;
  fup_d15_enabled: boolean;
  fup_d30_enabled: boolean;
  fup_d60_enabled: boolean;
  fup_d90_enabled: boolean;
  gemini_key: string | null;
  groq_key: string | null;
  asaas_key: string | null;
}

export default function UnitSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const unitId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState<UnitConfig>({
    id: "",
    name: "",
    ai_financial_enabled: true,
    ai_custom_instructions: "",
    fup_preventive_days: 2,
    fup_preventive_enabled: true,
    fup_due_date_enabled: true,
    fup_d3_enabled: true,
    fup_d7_enabled: true,
    fup_d15_enabled: true,
    fup_d30_enabled: true,
    fup_d60_enabled: true,
    fup_d90_enabled: true,
    gemini_key: "",
    groq_key: "",
    asaas_key: "",
  });

  useEffect(() => {
    async function fetchUnit() {
      if (!unitId) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("units")
        .select("*")
        .eq("id", unitId)
        .single();

      if (error) {
        setMessage({ type: "error", text: "Erro ao carregar os dados da unidade." });
      } else if (data) {
        setForm({
          id: data.id,
          name: data.name,
          ai_financial_enabled: data.ai_financial_enabled ?? true,
          ai_custom_instructions: data.ai_custom_instructions || "",
          fup_preventive_days: data.fup_preventive_days || 2,
          fup_preventive_enabled: data.fup_preventive_enabled ?? true,
          fup_due_date_enabled: data.fup_due_date_enabled ?? true,
          fup_d3_enabled: data.fup_d3_enabled ?? true,
          fup_d7_enabled: data.fup_d7_enabled ?? true,
          fup_d15_enabled: data.fup_d15_enabled ?? true,
          fup_d30_enabled: data.fup_d30_enabled ?? true,
          fup_d60_enabled: data.fup_d60_enabled ?? true,
          fup_d90_enabled: data.fup_d90_enabled ?? true,
          gemini_key: data.gemini_key || "",
          groq_key: data.groq_key || "",
          asaas_key: data.asaas_key || "",
        });
      }
      setLoading(false);
    }

    fetchUnit();
  }, [unitId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from("units")
      .update({
        ai_financial_enabled: form.ai_financial_enabled,
        ai_custom_instructions: form.ai_custom_instructions,
        fup_preventive_days: Number(form.fup_preventive_days),
        fup_preventive_enabled: form.fup_preventive_enabled,
        fup_due_date_enabled: form.fup_due_date_enabled,
        fup_d3_enabled: form.fup_d3_enabled,
        fup_d7_enabled: form.fup_d7_enabled,
        fup_d15_enabled: form.fup_d15_enabled,
        fup_d30_enabled: form.fup_d30_enabled,
        fup_d60_enabled: form.fup_d60_enabled,
        fup_d90_enabled: form.fup_d90_enabled,
        gemini_key: form.gemini_key?.trim() || null,
        groq_key: form.groq_key?.trim() || null,
        asaas_key: form.asaas_key?.trim() || null,
      })
      .eq("id", unitId);

    if (error) {
      setMessage({ type: "error", text: `Falha ao salvar: ${error.message}` });
    } else {
      setMessage({ type: "success", text: "Configurações da unidade atualizadas com sucesso!" });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1329] flex items-center justify-center text-slate-400">
        Carregando configurações da unidade...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b1329] text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="text-xs uppercase tracking-wider text-orange-500 font-bold">
                Configurações da Unidade
              </span>
              <h1 className="text-2xl font-bold text-white">{form.name}</h1>
              <p className="text-xs text-slate-400 font-mono">ID: {form.id}</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>

        {/* Feedback de Notificação */}
        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 text-sm border ${
            message.type === "success" 
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" 
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}>
            {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* 1. Ativação do Agente Financeiro */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Agente IA de Atendimento Financeiro</h3>
                  <p className="text-xs text-slate-400">Ativa as respostas automáticas e negociações de parcelas via WhatsApp</p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={form.ai_financial_enabled} 
                  onChange={(e) => setForm({ ...form, ai_financial_enabled: e.target.checked })}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Instruções Específicas da Unidade (Playbook Local)
              </label>
              <textarea
                rows={4}
                value={form.ai_custom_instructions || ""}
                onChange={(e) => setForm({ ...form, ai_custom_instructions: e.target.value })}
                placeholder="Exemplo: Na unidade de Anápolis aceitamos desconto de pontualidade até o 5º dia útil. Chave PIX local: financeiro@multprofissoes.com.br..."
                className="w-full bg-slate-950/70 border border-slate-800 focus:border-orange-500 rounded-xl p-3 text-sm text-slate-200 outline-none transition-colors"
              />
            </div>
          </section>

          {/* 2. Réguas de Cobrança por Vencimento */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/10 text-orange-400 rounded-xl flex items-center justify-center border border-orange-500/20">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Réguas de Notificação de Vencimento</h3>
                <p className="text-xs text-slate-400">Ative ou pause os disparos automáticos baseados nas datas de vencimento dos boletos</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Lembrete Preventivo */}
              <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-200">Lembrete Preventivo</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400">Disparar</span>
                    <input 
                      type="number" 
                      min="1" 
                      max="10" 
                      value={form.fup_preventive_days} 
                      onChange={(e) => setForm({ ...form, fup_preventive_days: Number(e.target.value) })}
                      className="w-12 bg-slate-900 border border-slate-700 text-center text-xs rounded py-0.5 text-white outline-none"
                    />
                    <span className="text-xs text-slate-400">dias antes</span>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={form.fup_preventive_enabled} 
                  onChange={(e) => setForm({ ...form, fup_preventive_enabled: e.target.checked })}
                  className="w-4 h-4 accent-orange-500" 
                />
              </div>

              {/* No Dia do Vencimento */}
              <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-200">Dia do Vencimento (Dia D)</p>
                  <p className="text-xs text-slate-400 mt-1">Alerta amigável no dia exato do boleto</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={form.fup_due_date_enabled} 
                  onChange={(e) => setForm({ ...form, fup_due_date_enabled: e.target.checked })}
                  className="w-4 h-4 accent-orange-500" 
                />
              </div>

              {/* D+3 */}
              <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-200">Atraso Leve (D+3)</p>
                  <p className="text-xs text-slate-400 mt-1">Cobrança suave 3 dias após o vencimento</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={form.fup_d3_enabled} 
                  onChange={(e) => setForm({ ...form, fup_d3_enabled: e.target.checked })}
                  className="w-4 h-4 accent-orange-500" 
                />
              </div>

              {/* D+7 */}
              <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-200">Cobrança Semanal (D+7)</p>
                  <p className="text-xs text-slate-400 mt-1">Disparo com 1 semana de atraso</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={form.fup_d7_enabled} 
                  onChange={(e) => setForm({ ...form, fup_d7_enabled: e.target.checked })}
                  className="w-4 h-4 accent-orange-500" 
                />
              </div>

              {/* D+15 */}
              <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-200">Quinzenal (D+15)</p>
                  <p className="text-xs text-slate-400 mt-1">Alerta de juros e atualização de PIX</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={form.fup_d15_enabled} 
                  onChange={(e) => setForm({ ...form, fup_d15_enabled: e.target.checked })}
                  className="w-4 h-4 accent-orange-500" 
                />
              </div>

              {/* D+30 */}
              <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-200">Mensal (D+30)</p>
                  <p className="text-xs text-slate-400 mt-1">Proposta amigável de renegociação</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={form.fup_d30_enabled} 
                  onChange={(e) => setForm({ ...form, fup_d30_enabled: e.target.checked })}
                  className="w-4 h-4 accent-orange-500" 
                />
              </div>

              {/* D+60 */}
              <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-200">Crítico (D+60)</p>
                  <p className="text-xs text-slate-400 mt-1">Alerta antes de protesto / bloqueio pedagógico</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={form.fup_d60_enabled} 
                  onChange={(e) => setForm({ ...form, fup_d60_enabled: e.target.checked })}
                  className="w-4 h-4 accent-orange-500" 
                />
              </div>

              {/* D+90 */}
              <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-200">Jurídico / Transbordo (D+90)</p>
                  <p className="text-xs text-slate-400 mt-1">Notificação final com direcionamento humano</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={form.fup_d90_enabled} 
                  onChange={(e) => setForm({ ...form, fup_d90_enabled: e.target.checked })}
                  className="w-4 h-4 accent-orange-500" 
                />
              </div>
            </div>
          </section>

          {/* 3. Cofre de Chaves Exclusivas da Unidade (Opcional) */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center border border-purple-500/20">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Cofre de Chaves de IA & Asaas da Unidade</h3>
                <p className="text-xs text-slate-400">Deixe em branco para usar automaticamente as credenciais Globais Master</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Gemini API Key (Unidade)
                </label>
                <input 
                  type="password"
                  placeholder="Herdando Chave Master Global"
                  value={form.gemini_key || ""}
                  onChange={(e) => setForm({ ...form, gemini_key: e.target.value })}
                  className="w-full bg-slate-950/70 border border-slate-800 focus:border-purple-500 rounded-xl p-3 text-xs text-slate-200 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Groq API Key (Unidade)
                </label>
                <input 
                  type="password"
                  placeholder="Herdando Chave Master Global"
                  value={form.groq_key || ""}
                  onChange={(e) => setForm({ ...form, groq_key: e.target.value })}
                  className="w-full bg-slate-950/70 border border-slate-800 focus:border-purple-500 rounded-xl p-3 text-xs text-slate-200 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Asaas API Key (Unidade)
                </label>
                <input 
                  type="password"
                  placeholder="Herdando Chave Master Global"
                  value={form.asaas_key || ""}
                  onChange={(e) => setForm({ ...form, asaas_key: e.target.value })}
                  className="w-full bg-slate-950/70 border border-slate-800 focus:border-purple-500 rounded-xl p-3 text-xs text-slate-200 outline-none font-mono"
                />
              </div>
            </div>
          </section>

        </form>

      </div>
    </main>
  );
}
