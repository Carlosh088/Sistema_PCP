/* Dados inventados para o portfólio. Este arquivo não faz requisições de rede. */
(function (global) {
  "use strict";
  const DB_KEY = "pcp_portfolio_interativo_v4";
  const STATE_KEYS = [
    "portfolio_interativo_state_v4",
    "portfolio_interativo_fichas_map_v4",
    "portfolio_interativo_modelos_map_v4",
  ];
  const MACHINE_IDS = [1, 2, 3, 4, 5];
  const RATES = { 1: 20, 2: 22, 3: 30, 4: 40, 5: 25 };
  const TABLES = ["usuarios", "produtos", "producoes", "historico_producoes",
    "fichas_tecnicas", "ficha_codigos", "captacoes_fichas", "captacoes_parametros"];
  const user = Object.freeze({ id: "visitante-demo", email: "visitante@example.invalid" });
  const copy = value => JSON.parse(JSON.stringify(value));
  let counter = 0;
  const uid = () => global.crypto?.randomUUID?.() || `demo-${Date.now()}-${++counter}`;
  let persistent = true;
  function seed() {
    const now = Date.now();
    const iso = delta => new Date(now + delta).toISOString();
    const hour = 3600000;
    const produtos = ["A", "B", "C", "D", "E", "F"].map((letter, i) => ({
      id: `produto-demo-${i + 1}`, codigo: `DEMO-00${i + 1}`,
      nome: `Produto ${letter} — demonstrativo`, peso: 10 + i * 5, ativo: true,
    }));
    const production = (id, machine, product, weight, status, order = 0) => ({
      id, maquina_id: String(machine), codigo: produtos[product].codigo,
      produto: produtos[product].nome, peso: weight, quantidade: 1, turno: "dia",
      status, estimated_ms: weight / RATES[machine] * hour,
      elapsed_ms: status === "paused" ? 0.5 * hour : status === "running" ? 0.3 * hour : 0,
      start_time: status === "fila" ? null : iso(-0.3 * hour),
      night_setup_until: null, ordem: order, created_at: iso(-hour), updated_at: iso(0),
    });
    const modelos = ["sem_linha", "com_linha", "com_linha_colorida"];
    const fichas = modelos.map((modelo, i) => ({ id: `ficha-demo-${i + 1}`,
      modelo, nome_produto: produtos[i].nome, maquina: String([1, 3, 4][i]),
      status: "ativa", created_at: iso(-hour), updated_at: iso(0) }));
    const captacoes = fichas.map((ficha, i) => ({ id: `captacao-demo-${i + 1}`,
      ficha_id: ficha.id, modelo: ficha.modelo, nome_produto: ficha.nome_produto,
      maquina: ficha.maquina, status: "concluida", data_captacao: iso(-hour),
      created_at: iso(-hour), updated_at: iso(0) }));
    captacoes.push({ id: "rascunho-demo", ficha_id: null, modelo: "sem_linha",
      nome_produto: produtos[3].nome, maquina: "1", status: "em_captacao",
      data_captacao: iso(0), created_at: iso(0), updated_at: iso(0) });
    const parametros = [];
    captacoes.forEach((cap, i) => {
      const fields = cap.modelo === "sem_linha" ? {
        materia_prima: "Material fictício A", diametro_interno: "10", diametro_externo: "14",
        pino: "PINO-DEMO", matriz: "MATRIZ-DEMO", velocidade_puxador: "5", velocidade_extrusora: "8",
      } : {
        ruptura: "50", materia_prima_tubo: "Material fictício B", diametro_interno_tubo: "12",
        pino_tubo: "PINO-DEMO", matriz_tubo: "MATRIZ-DEMO", velocidade_puxador_tubo: "6",
        velocidade_extrusora_tubo: "9", velocidade_overley: "4", distribuidor: "DEMO",
        materia_prima_capa: "Material fictício C", diametro_externo_capa: "18",
        pino_capa: "PINO-DEMO", matriz_capa: "MATRIZ-DEMO", velocidade_puxador_capa: "5",
        velocidade_extrusora_capa: "7", pigmento_capa: "Azul fictício", quantidade_pigmento_capa: "1",
        pigmento_tarja: "Branco fictício", quantidade_tarja: "1", arruela: "ARRUELA-DEMO",
      };
      const prefixes = cap.modelo === "sem_linha" ? ["painel"] : ["painel_tubo", "painel_capa", "painel_tarja", "forno"];
      prefixes.forEach(prefix => {
        const zones = prefix === "painel_tarja" ? 2 : prefix === "forno" ? 4 : 5;
        for (let n = 1; n <= zones; n++) fields[`${prefix}_zona_${String(n).padStart(2, "0")}`] = String(100 + n * 5);
        fields[`${prefix}_cabecote`] = "125";
      });
      function section(campo) {
        if (campo.startsWith("painel_tubo_")) return "Painel Tubo";
        if (campo.startsWith("painel_capa_")) return "Painel Capa";
        if (campo.startsWith("painel_tarja_")) return "Painel Tarja";
        if (campo.startsWith("forno_")) return "Forno";
        if (campo.startsWith("painel_")) return "Painel";
        if (campo === "ruptura") return "Informações do Produto";
        if (campo === "velocidade_overley" || campo === "distribuidor") return "Trança";
        if (campo.endsWith("_tarja")) return "Tarja";
        if (campo.endsWith("_capa") || campo === "arruela") return "Capa";
        return "Tubo";
      }
      Object.entries(fields).forEach(([campo, valor]) => parametros.push({
        id: `param-demo-${i}-${campo}`, captacao_id: cap.id, secao: section(campo), campo, valor,
      }));
    });
    return {
      usuarios: [{ ...user, perfil: "admin", nome: "Visitante da demonstração" }], produtos,
      producoes: [production("producao-demo-1", 1, 0, 80, "running"),
        production("producao-demo-2", 3, 1, 90, "paused"),
        production("producao-demo-3", 1, 3, 40, "fila"),
        production("producao-demo-4", 1, 4, 60, "fila", 1),
        production("producao-demo-5", 3, 2, 75, "fila"),
        production("producao-demo-6", 4, 5, 80, "fila"),
        ...[2, 5].map((machine, i) => production(`producao-demo-extra-${machine}`, machine, i % produtos.length, 40 + i * 10, "fila"))],
      historico_producoes: [0, 1, 2].map(i => ({
        ...production(`historico-demo-${i}`, MACHINE_IDS[i], i, 20, "done"),
        producao_id: `concluida-demo-${i}`, start_time: iso(-(i + 3) * hour),
        finished_at: iso(-(i + 1) * hour), elapsed_ms: 2 * hour,
      })),
      fichas_tecnicas: fichas,
      ficha_codigos: fichas.map((f, i) => ({ id: `codigo-demo-${i}`, ficha_id: f.id, codigo_interno: produtos[i].codigo })),
      captacoes_fichas: captacoes, captacoes_parametros: parametros,
    };
  }
  function load() {
    try {
      const stored = JSON.parse(global.sessionStorage.getItem(DB_KEY));
      if (stored?.version === 1 && TABLES.every(table => Array.isArray(stored.tables?.[table]))) return stored.tables;
    } catch { persistent = false; }
    return seed();
  }
  let db = load();
  function persist() {
    try { global.sessionStorage.setItem(DB_KEY, JSON.stringify({ version: 1, tables: db })); }
    catch { persistent = false; }
  }
  persist();

  // Adaptador local com apenas as operações utilizadas pelas telas existentes.
  // Não importa SDK, não aceita URL, não possui fallback para banco remoto.
  class Query {
    constructor(table) {
      if (!TABLES.includes(table)) throw new Error("Tabela fora da demonstração.");
      this.table = table; this.filters = []; this.sorts = []; this.operation = "read";
    }
    select(columns = "*", options = {}) { this.columns = columns; this.options = options; return this; }
    eq(field, value) { this.filters.push(row => String(row[field]) === String(value)); return this; }
    order(field, options = {}) { this.sorts.push([field, options.ascending !== false]); return this; }
    limit(number) { this.maximum = number; return this; }
    insert(rows) { this.operation = "insert"; this.rows = copy(Array.isArray(rows) ? rows : [rows]); return this; }
    upsert(rows, options = {}) { this.insert(rows); this.operation = "upsert"; this.conflict = (options.onConflict || "id").split(",").map(s => s.trim()); return this; }
    update(values) { this.operation = "update"; this.values = copy(values); return this; }
    delete() { this.operation = "delete"; return this; }
    single() { this.one = "required"; return this; }
    maybeSingle() { this.one = "optional"; return this; }
    then(resolve, reject) {
      this.result ||= Promise.resolve().then(() => this.execute());
      return this.result.then(resolve, reject);
    }
    execute() {
      let rows = db[this.table].filter(row => this.filters.every(test => test(row)));
      if (this.operation === "insert" || this.operation === "upsert") {
        rows = this.rows.map(values => {
          const existing = this.operation === "upsert" && db[this.table].find(row =>
            this.conflict.every(field => values[field] != null && String(row[field]) === String(values[field])));
          if (existing) { Object.assign(existing, values); return existing; }
          const record = { id: uid(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...values };
          db[this.table].push(record); return record;
        });
      } else if (this.operation === "update") {
        rows.forEach(row => Object.assign(row, this.values));
      } else if (this.operation === "delete") {
        const removed = new Set(rows);
        db[this.table] = db[this.table].filter(row => !removed.has(row));
        if (this.table === "captacoes_fichas") {
          const ids = new Set(rows.map(row => row.id));
          db.captacoes_parametros = db.captacoes_parametros.filter(row => !ids.has(row.captacao_id));
        }
      }
      if (this.operation !== "read") persist();
      rows = copy(rows);
      if (this.table === "fichas_tecnicas") rows.forEach(row => {
        row.ficha_codigos = copy(db.ficha_codigos.filter(code => code.ficha_id === row.id));
      });
      if (this.sorts.length) rows.sort((a, b) => {
        for (const [field, ascending] of this.sorts) {
          const result = String(a[field] ?? "").localeCompare(String(b[field] ?? ""), "pt-BR", { numeric: true });
          if (result) return ascending ? result : -result;
        }
        return 0;
      });
      const count = rows.length;
      if (this.maximum != null) rows = rows.slice(0, this.maximum);
      if (this.one && (rows.length > 1 || (this.one === "required" && rows.length !== 1))) {
        return { data: null, error: { message: "Registro demonstrativo não encontrado ou duplicado." }, count };
      }
      return { data: this.options?.head ? null : this.one ? rows[0] || null : rows, error: null, count };
    }
  }
  const client = Object.freeze({
    from: table => new Query(table),
    channel: () => { const channel = { on: () => channel, subscribe: () => channel }; return channel; },
    removeChannel: () => {},
  });
  global.PCPDemo = Object.freeze({
    client, user, get persistent() { return persistent; },
    reset() {
      db = seed(); persist();
      STATE_KEYS.forEach(key => { try { global.localStorage.removeItem(key); } catch {} });
    },
  });
})(window);
