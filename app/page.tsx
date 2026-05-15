"use client";

import { useState } from "react";

// Lista dos idiomas suportados mapeados diretamente conforme as rotas da API
const LANGUAGES = [
  { code: "", name: "English" },
  { code: "ar", name: "العربية (Árabe)" },
  { code: "de", name: "Deutsch (Alemão)" },
  { code: "el", name: "Ελληνικά (Grego)" },
  { code: "es", name: "Español (Espanhol)" },
  { code: "fr", name: "Français (Francês)" },
  { code: "he", name: "עברית (Hebraico)" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "it", name: "Italiano" },
  { code: "ko", name: "한국어 (Coreano)" },
  { code: "pt", name: "Português (Padrão)" },
  { code: "ru", name: "Русский (Russo)" },
  { code: "zh", name: "中文 (Chinês)" },
];

export default function Home() {
  const [lang, setLang] = useState<string>("pt");
  const [excuse, setExcuse] = useState<string>(
    "Clique no botão abaixo para gerar uma desculpa perfeita.",
  );
  const [loading, setLoading] = useState<boolean>(false);

  const fetchExcuse = async () => {
    setLoading(true);
    try {
      const baseUrl = "https://naas.isalman.dev/no";
      // O novo endpoint não parece suportar rotas de idioma como `/no/pt`, 
      // então usamos o endpoint base que retorna em inglês.
      const url = baseUrl;

      // 'no-store' para garantir que cada clique traga uma desculpa nova (evita cache do Next)
      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) throw new Error("Erro ao buscar desculpa");

      // A API retorna JSON com a propriedade `reason`
      const data = await res.json();
      let finalExcuse = data.reason?.trim() || "Não.";

      // Como a API original só responde em inglês, usamos o MyMemory API para traduzir a resposta em tempo real
      if (lang && finalExcuse !== "Não.") {
        try {
          const transUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(finalExcuse)}&langpair=en|${lang}`;
          const transRes = await fetch(transUrl);
          const transData = await transRes.json();
          
          if (transData.responseData?.translatedText) {
            finalExcuse = transData.responseData.translatedText;
          }
        } catch (e) {
          console.error("Erro na tradução:", e);
        }
      }

      setExcuse(finalExcuse);
    } catch (error) {
      setExcuse("Erro ao obter resposta da API. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(excuse);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 transition-all duration-300 hover:border-slate-700">
        {/* Cabeçalho */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
            NaaS: No as a Service
          </h1>
          <p className="text-sm text-slate-400">
            Diga "Não" com elegância, em qualquer idioma.
          </p>
        </div>

        {/* Seletor de Idioma */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Selecione o Idioma
          </label>
          <div className="relative">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all cursor-pointer appearance-none"
            >
              {LANGUAGES.map((item) => (
                <option
                  key={item.code}
                  value={item.code}
                  className="bg-slate-900"
                >
                  {item.name}
                </option>
              ))}
            </select>
            {/* Ícone Indicador Customizado do Select */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Box de Texto com a Desculpa */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Sua Resposta Oficial
          </label>
          <div className="w-full min-h-[140px] bg-slate-950 border border-slate-800 rounded-xl p-5 flex items-center justify-center text-center relative overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-slate-500">
                  Formulando recusa...
                </span>
              </div>
            ) : (
              <p
                className={`font-medium text-slate-200 transition-all duration-200 ${
                  excuse.length > 50 ? "text-base" : "text-xl"
                }`}
              >
                "{excuse}"
              </p>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="space-y-3">
          <button
            onClick={fetchExcuse}
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-sky-500/10 transition-all duration-200 text-center"
          >
            {loading ? "Processando..." : "Gerar Desculpa"}
          </button>

          <button
            onClick={shareOnWhatsApp}
            disabled={loading || excuse === "Clique no botão abaixo para gerar uma desculpa perfeita." || excuse.startsWith("Erro")}
            className="w-full bg-[#25D366] hover:bg-[#1EBE5D] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-[#25D366]/10 transition-all duration-200 text-center flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            Compartilhar no WhatsApp
          </button>
        </div>
      </div>
    </main>
  );
}
