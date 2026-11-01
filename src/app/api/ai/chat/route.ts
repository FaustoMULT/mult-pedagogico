import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const { unitId, message, conversationId, studentName, studentDebts } = body;

    if (!unitId || !message) {
      return NextResponse.json(
        { error: "Parâmetros obrigatórios ausentes: unitId e message são requeridos." },
        { status: 400 }
      );
    }

    // 1. Busca configurações e chaves da unidade
    const { data: unit, error: unitError } = await supabase
      .from("units")
      .select("*")
      .eq("id", unitId)
      .single();

    if (unitError || !unit) {
      return NextResponse.json(
        { error: "Unidade não encontrada no banco de dados." },
        { status: 404 }
      );
    }

    if (!unit.ai_financial_enabled) {
      return NextResponse.json(
        { 
          text: "O atendimento automático da unidade está temporariamente pausado. Um atendente humano responderá em breve.",
          provider: "system",
          latencyMs: Date.now() - startTime
        },
        { status: 200 }
      );
    }

    // 2. Chaves de IA (Unidade ou Master Global)
    const geminiKey = unit.gemini_key || process.env.GEMINI_API_KEY || "";
    const groqKey = unit.groq_key || process.env.GROQ_API_KEY || "";

    // 3. Montagem do Prompt de Sistema (Agente Financeiro MULT Profissões)
    const systemPrompt = `Você é o Assistente Virtual do Setor Financeiro da rede "MULT Profissões - Cursos Profissionalizantes" (Unidade: ${unit.name}).
Sua missão é atender alunos e responsáveis com cordialidade, empatia, clareza e foco em resolução ágil de mensalidades e dúvidas financeiras.

Diretrizes de Atendimento:
1. Seja sempre educado, amigável e direto. Mantenha as respostas curtas e fáceis de ler no WhatsApp (evite parágrafos longos).
2. Se o aluno quiser pagar ou solicitar segunda via, informe o valor da parcela, ofereça a opção de PIX Copia-e-Cola e o boleto em PDF.
3. Se a dívida for muito antiga (acima de 90 dias) ou o aluno exigir condições extraordinárias fora do padrão, informe gentilmente que você transferirá o contato para a equipe financeira humana responsável da unidade.
4. Regras e particularidades desta unidade:
${unit.ai_custom_instructions || "Siga o procedimento padrão de negociação amigável sem descontos abusivos."}

Contexto do Aluno:
- Nome identificado: ${studentName || "Não identificado"}
- Títulos em aberto: ${studentDebts ? JSON.stringify(studentDebts) : "Nenhum débito consultado ainda"}
`;

    let replyText = "";
    let providerUsed = "gemini";
    let modelName = "gemini-2.5-flash";
    let fallbackTriggered = false;

    // 4. Execução Primária: Google Gemini (com timeout de 3.5 segundos)
    if (geminiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: `${systemPrompt}\n\nMensagem do Aluno: ${message}` }]
                }
              ],
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 500,
                thinkingConfig: {
                  thinkingBudget: 0
                }
              }
            })
          }
        );

        clearTimeout(timeoutId);

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            replyText = candidateText;
          } else {
            throw new Error("Resposta vazia do Gemini");
          }
        } else {
          throw new Error(`Gemini status ${geminiRes.status}: ${await geminiRes.text()}`);
        }
      } catch (geminiError: any) {
        console.warn("Gemini falhou ou deu timeout. Acionando Fallback Groq Cloud:", geminiError?.message || geminiError);
        fallbackTriggered = true;
      }
    } else {
      fallbackTriggered = true;
    }

    // 5. Fallback Instantâneo: Groq Cloud (Llama 3.3 70B Versatile em ~0.3s)
    if (fallbackTriggered && groqKey) {
      try {
        providerUsed = "groq";
        modelName = "llama-3.3-70b-versatile";

        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: message }
            ],
            temperature: 0.3,
            max_tokens: 500
          })
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          replyText = groqData.choices?.[0]?.message?.content || "Olá! Como posso ajudar você hoje?";
        } else {
          throw new Error(`Groq status ${groqRes.status}`);
        }
      } catch (groqError: any) {
        console.error("Falha também na Groq Cloud:", groqError?.message || groqError);
        replyText = "Olá! Estamos com alta demanda em nosso atendimento no momento. Por favor, aguarde que um de nossos consultores falará com você.";
      }
    }

    const latencyMs = Date.now() - startTime;

    // 6. Registro em ai_audit_logs
    await supabase.from("ai_audit_logs").insert({
      unit_id: unitId,
      conversation_id: conversationId || null,
      trigger_type: "receptive",
      provider_used: providerUsed,
      model_name: modelName,
      latency_ms: latencyMs,
      output_text: replyText,
      input_payload: { message, fallbackTriggered }
    });

    return NextResponse.json({
      text: replyText,
      provider: providerUsed,
      model: modelName,
      latencyMs,
      fallbackUsed: fallbackTriggered
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erro interno no servidor de IA." },
      { status: 500 }
    );
  }
}
