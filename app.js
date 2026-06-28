const STORAGE_KEY = "planner-casamento-state-v1";
const SUPABASE_CONFIG = window.PLANNER_SUPABASE_CONFIG || {};
const supabaseClient = window.supabase && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey
  ? window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey)
  : null;

const DEFAULT_GUEST_GROUPS = [
  "Familia do noivo",
  "Familia da noiva",
  "Amigo do noivo",
  "Amigo da noiva",
  "Amigos em comum",
  "Fornecedores",
  "Trabalho noiva",
  "Trabalho noivo"
];

const DEFAULT_GUEST_ROLES = [
  "Padrinho",
  "Madrinha",
  "Pai da noiva",
  "Mae da noiva",
  "Pai do noivo",
  "Mae do noivo",
  "Pajem",
  "Dama de honra",
  "Convidado comum"
];

const RSVP_STATUSES = ["A enviar convite", "Pendente", "Confirmado", "Não vai"];
const DEFAULT_MUSIC_MOMENTS = ["Entrada", "Cerimonia", "Aliancas", "Cumprimentos", "Primeira danca", "Festa", "Encerramento"];
const DEFAULT_CHECKLIST_CATEGORIES = [
  "Acessorios",
  "Aliancas",
  "Bar",
  "Beleza",
  "Bem-estar",
  "Cerimonial",
  "Cerimonia",
  "Convidados",
  "Contratos",
  "Cronograma",
  "Decoracao",
  "Doces",
  "Documentos",
  "Eventos",
  "Fornecedores",
  "Gastronomia",
  "Hospedagem",
  "Identidade",
  "Imagem",
  "Lembrancas",
  "Local",
  "Lua de mel",
  "Mesas",
  "Musica",
  "Operacao",
  "Orcamento",
  "Pagamentos",
  "Papelaria",
  "Planejamento",
  "Presentes",
  "Site",
  "Trajes",
  "Transporte"
];
const WEDDING_PARTY_MANUAL_EXAMPLES = {
  welcome: "Você faz parte da nossa história e queremos muito ter você pertinho nesse dia tão especial. Preparamos este manual com carinho para deixar tudo mais leve e organizado.",
  weddingInfo: "Data, horário, endereços da cerimônia e da festa, horário de chegada dos padrinhos e madrinhas e ponto de encontro no local.",
  godmotherDressCode: "Paleta de cores, modelo livre ou padronizado, comprimento do vestido, tecido indicado, cores a evitar e orientações sobre brilho, estampas ou transparência.",
  godfatherDressCode: "Cor do terno, camisa, gravata ou acessório, sapato e cinto, e se haverá aluguel conjunto ou cada um providencia o seu.",
  inspirations: "Referências da paleta, vestidos, ternos, gravatas, buquês ou acessórios para alinhar o estilo sem deixar tudo rígido.",
  ceremonyEntrance: "Se entram em casal, ordem de entrada, ensaio, local de espera antes da cerimônia e chegada antecipada para fotos.",
  photos: "Horário e local das fotos, orientação para não sair logo após a cerimônia e combinados sobre celular em momentos específicos.",
  gifts: "Link da lista de presentes ou mensagem carinhosa reforçando que não há obrigação e que a presença já é o mais importante.",
  contacts: "Contato da assessora, cerimonialista, madrinha responsável ou familiar de apoio para o dia do casamento.",
  timeline: "15h30 - Chegada dos padrinhos\n16h00 - Fotos\n17h00 - Cerimônia\n18h00 - Cumprimentos\n19h00 - Festa",
  gentleRules: "Respeitar a paleta escolhida, chegar no horário combinado, avisar imprevistos com antecedência, evitar spoilers antes da cerimônia e curtir o dia com leveza.",
  closing: "Essas orientações foram pensadas para que todo mundo se sinta seguro, bonito e alinhado no nosso grande dia."
};
const DEFAULT_WEDDING_PARTY_MANUAL = Object.fromEntries(
  Object.keys(WEDDING_PARTY_MANUAL_EXAMPLES).map((key) => [key, ""])
);
const DEFAULT_WEDDING_PARTY_MANUAL_CONFIG = {
  customFields: [],
  hiddenFields: []
};
const DEFAULT_WEDDING_PARTY_DETAILS = {
  godmotherDressOptions: [],
  godfatherLapel: "",
  godmotherCorsage: ""
};
const GODMOTHER_DRESS_OPTIONS = ["Vestido longo", "Vestido curto", "Vestido midi", "Sem brilho", "Sem estampa"];

const DEFAULT_BUDGET_BASE = 80000;
const DEFAULT_BUDGET_CATEGORIES = [
  ["Local", 19, 20000, 15000],
  ["Cerimonial / Assessoria", 6, 6400, 5000],
  ["Fotografo", 5, 5600, 4000],
  ["Video / Filmagem", 4, 4800, 3500],
  ["Convite e papelaria", 2, 2400, 1500],
  ["Identidade visual", 1, 1600, 1000],
  ["DJ / Musicos", 4, 4000, 3000],
  ["Lembrancinha", 2, 1600, 1500],
  ["Decoracao", 5, 5600, 4000],
  ["Vestido de noiva", 6, 6400, 5000],
  ["Traje do noivo", 3, 2400, 2000],
  ["Empresa de transporte", 2, 1600, 1500],
  ["Gastronomia / Buffet", 10, 9600, 8000],
  ["Locacao de moveis", 3, 2400, 2000],
  ["Recreacionista / Espaco Kids", 1, 800, 1000],
  ["Bar de drinks", 3, 3200, 2500],
  ["Maquiagem e cabelo", 2, 1600, 1500],
  ["Mesa de doces", 3, 2400, 2000],
  ["Bolo", 1, 1600, 1000],
  ["Celebrante", 1, 800, 800],
  ["Igreja", 1, 800, 1000],
  ["Cabine de fotos", 2, 1600, 1200],
  ["Seguranca / Manobrista", 2, 1600, 1500],
  ["Bem-casados", 1, 800, 500]
];

const moduleConfig = {
  checklist: {
    title: "Checklist",
    eyebrow: "Cronograma",
    layout: "kanban",
    color: "teal",
    fields: [
      ["title", "Tarefa", "text", true],
      ["period", "Periodo", "select", true, ["12 meses", "10 meses", "9 meses", "8 meses", "6 meses", "4 meses", "3 meses", "2 meses", "1 mes", "Semana"]],
      ["category", "Categoria", "select", true, DEFAULT_CHECKLIST_CATEGORIES],
      ["status", "Status", "select", true, ["Pendente", "Concluido"]],
      ["priority", "Prioridade", "select", true, ["Baixa", "Media", "Alta"]],
      ["owner", "Responsavel", "text", false],
      ["notes", "Observacoes", "textarea", false]
    ],
    filters: ["status", "period", "priority"]
  },
  budget: {
    title: "Orcamento",
    eyebrow: "Valores",
    layout: "budget",
    color: "gold",
    fields: [
      ["category", "Categoria", "text", true],
      ["share", "Percentual base", "number", false],
      ["planned", "Planejado", "number", true],
      ["actual", "Real", "number", true],
      ["status", "Status", "select", true, ["Planejado", "Contratado", "Pago", "Estourou"]],
      ["notes", "Observacoes", "textarea", false]
    ],
    filters: ["status"]
  },
  guests: {
    title: "Convidados",
    eyebrow: "Lista e RSVP",
    layout: "table",
    color: "rose",
    fields: [
      ["name", "Nome", "text", true],
      ["group", "Grupo", "select", true, DEFAULT_GUEST_GROUPS],
      ["role", "Papel", "select", true, DEFAULT_GUEST_ROLES],
      ["guestType", "Tipo", "select", true, ["Adulto", "Crianca"]],
      ["rsvp", "RSVP", "select", true, RSVP_STATUSES],
      ["phone", "WhatsApp", "text", false],
      ["notes", "Observacoes", "textarea", false]
    ],
    filters: ["rsvp", "group"]
  },
  weddingParty: {
    title: "Padrinhos e Madrinhas",
    eyebrow: "Corte",
    layout: "weddingParty",
    color: "plum",
    fields: [],
    filters: []
  },
  tables: {
    title: "Mesas",
    eyebrow: "Distribuicao",
    layout: "cards",
    color: "plum",
    fields: [
      ["name", "Mesa", "text", true],
      ["title", "Titulo opcional", "text", false],
      ["capacity", "Capacidade", "number", true],
      ["area", "Area", "text", false],
      ["notes", "Observacoes", "textarea", false]
    ],
    filters: ["area"]
  },
  music: {
    title: "Musicas",
    eyebrow: "Momentos",
    layout: "cards",
    color: "sage",
    fields: [
      ["song", "Musica", "text", true],
      ["artist", "Artista", "text", false],
      ["link", "Link da musica", "url", false],
      ["moment", "Momento", "select", true, DEFAULT_MUSIC_MOMENTS],
      ["status", "Status", "select", true, ["Sugestao", "Aprovada", "Enviar para DJ", "Confirmada"]],
      ["notes", "Observacoes", "textarea", false]
    ],
    filters: ["moment", "status"]
  },
  vendors: {
    title: "Fornecedores",
    eyebrow: "Contratos e contatos",
    layout: "table",
    color: "teal",
    fields: [
      ["name", "Fornecedor", "text", true],
      ["category", "Categoria", "select", true, ["Buffet", "Vestido", "Traje", "Decoracao", "Fotografia", "Filmagem", "Doces", "Transporte", "Maquiagem", "Bar", "Local", "Musica"]],
      ["contact", "Contato", "text", false],
      ["instagramHandle", "Instagram", "text", false],
      ["value", "Valor", "number", false],
      ["status", "Status", "select", true, ["Cotando", "Favorito", "Contratado", "Descartado"]],
      ["contract", "Contrato", "select", true, ["Sem contrato", "Recebido", "Assinado", "Pendente"]],
      ["notes", "Observacoes", "textarea", false]
    ],
    filters: ["category", "status"]
  },
  payments: {
    title: "Pagamentos",
    eyebrow: "Vencimentos",
    layout: "table",
    color: "gold",
    fields: [
      ["description", "Descricao", "text", true],
      ["vendor", "Fornecedor", "text", false],
      ["amount", "Valor", "number", true],
      ["dueDate", "Vencimento", "date", true],
      ["status", "Status", "select", true, ["Pendente", "Pago", "Atrasado"]],
      ["notes", "Observacoes", "textarea", false]
    ],
    filters: ["status"]
  },
  appointments: {
    title: "Compromissos",
    eyebrow: "Agenda",
    layout: "cards",
    color: "rose",
    fields: [
      ["title", "Compromisso", "text", true],
      ["date", "Data", "date", true],
      ["time", "Hora", "time", false],
      ["vendor", "Fornecedor", "text", false],
      ["reminder", "Lembrete", "select", true, ["Nenhum", "1 dia antes", "3 dias antes", "1 semana antes"]],
      ["notes", "Observacoes", "textarea", false]
    ],
    filters: ["reminder"]
  },
  identity: {
    title: "Identidade",
    eyebrow: "Estilo e visual",
    layout: "identity",
    color: "plum",
    fields: [
      ["section", "Secao", "hidden", true],
      ["typographyUse", "Uso da fonte", "select", false, ["Convite geral", "Convite casamento", "Decoracao", "Menus e papelaria", "Site dos noivos", "Sinalizacao", "Outro"]],
      ["fontRole", "Funcao da fonte", "select", false, ["Titulos", "Textos", "Destaques", "Assinatura", "Outra"]],
      ["fontStyle", "Estilo da fonte", "select", false, ["Classica", "Moderna", "Romantica", "Minimalista", "Manuscrita", "Serifada", "Sem serifa", "Outra"]],
      ["fontName", "Nome da fonte", "text", false],
      ["group", "Grupo", "hidden", false],
      ["colorName", "Nome da cor", "text", false],
      ["colorHex", "Codigo HEX", "text", false],
      ["color", "Seletor de cor", "color", false],
      ["status", "Status", "select", true, ["Ideia", "Escolhido", "Comprar", "Finalizado"]],
      ["notes", "Observacoes", "textarea", false]
    ],
    filters: ["status"]
  }
};

const navItems = [
  ["dashboard", "Dashboard"],
  ["checklist", "Checklist"],
  ["budget", "Orcamento"],
  ["guests", "Convidados"],
  ["weddingParty", "Padrinhos e Madrinhas"],
  ["tables", "Mesas"],
  ["music", "Musicas"],
  ["identity", "Identidade"],
  ["vendors", "Fornecedores"],
  ["payments", "Pagamentos"],
  ["appointments", "Compromissos"]
];

const seedState = {
  user: null,
  wedding: null,
  currentView: "dashboard",
  checklistDefaultsVersion: 3,
  budgetDefaultsVersion: 3,
  filters: {},
  tableSort: {},
  identityColorGroups: ["Decoracao", "Noiva", "Noivo", "Pais", "Madrinhas", "Padrinhos"],
  guestGroups: DEFAULT_GUEST_GROUPS,
  guestRoles: DEFAULT_GUEST_ROLES,
  guestView: {
    groupBy: "none"
  },
  guestExtraColumns: [],
  musicMoments: DEFAULT_MUSIC_MOMENTS,
  weddingPartyManual: structuredClone(DEFAULT_WEDDING_PARTY_MANUAL),
  weddingPartyManualConfig: structuredClone(DEFAULT_WEDDING_PARTY_MANUAL_CONFIG),
  weddingPartyDetails: structuredClone(DEFAULT_WEDDING_PARTY_DETAILS),
  tablePlanner: {
    expandedTables: []
  },
  paymentCalendarMonth: "",
  vendorCategories: ["Buffet", "Vestido", "Traje", "Decoracao", "Fotografia", "Filmagem", "Doces", "Transporte", "Maquiagem", "Bar", "Local", "Musica"],
  vendorView: {
    groupBy: "category",
    sortBy: "name-asc"
  },
  data: {
    checklist: defaultChecklistTasks(),
    budget: [],
    guests: [],
    weddingParty: [],
    tables: [],
    music: [],
    identity: [],
    vendors: [],
    payments: [],
    appointments: []
  }
};

let state = loadState();
let authMode = "login";
let editing = null;
let guestDragScrollFrame = null;
let guestDragScrollY = 0;
let cloudSaveTimer = null;
let isApplyingCloudState = false;

const els = {
  authScreen: document.querySelector("#authScreen"),
  appShell: document.querySelector("#appShell"),
  authForm: document.querySelector("#authForm"),
  onboardingDialog: document.querySelector("#onboardingDialog"),
  onboardingForm: document.querySelector("#onboardingForm"),
  itemDialog: document.querySelector("#itemDialog"),
  itemForm: document.querySelector("#itemForm"),
  itemFields: document.querySelector("#itemFields"),
  navList: document.querySelector("#navList"),
  dashboardView: document.querySelector("#dashboardView"),
  moduleView: document.querySelector("#moduleView"),
  screenEyebrow: document.querySelector("#screenEyebrow"),
  screenTitle: document.querySelector("#screenTitle"),
  weddingName: document.querySelector("#weddingName"),
  newButton: document.querySelector("#newButton"),
  settingsButton: document.querySelector("#settingsButton"),
  exportButton: document.querySelector("#exportButton")
};

init();

async function init() {
  wireAuth();
  wireShell();
  handleAuthRedirectMessage();
  await restoreCloudSession();
  render();
}

function wireAuth() {
  document.querySelectorAll("[data-auth-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      authMode = button.dataset.authTab;
      document.querySelectorAll("[data-auth-tab]").forEach((tab) => tab.classList.toggle("active", tab === button));
      document.querySelectorAll("[data-signup-only]").forEach((field) => field.classList.toggle("hidden", authMode !== "signup"));
      els.authForm.querySelector(".primary-action").textContent = authMode === "signup" ? "Criar conta" : "Entrar";
    });
  });

  document.querySelectorAll("[data-signup-only]").forEach((field) => field.classList.add("hidden"));

  els.authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(els.authForm);
    const name = String(form.get("name") || "").trim() || "Usuario";
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    try {
      if (supabaseClient) {
        if (authMode === "signup") await signUpWithSupabase(name, email, password);
        else await signInWithSupabase(email, password);
      } else {
        state.user = { name, email };
        saveState();
      }
      render();
      if (!state.wedding && state.user) openWeddingDialog("create");
    } catch (error) {
      alert(error.message || "Nao foi possivel acessar sua conta.");
    }
  });

  document.querySelector("#recoverButton").addEventListener("click", async () => {
    const email = String(els.authForm.elements.email.value || "").trim();
    if (!email) {
      alert("Informe seu e-mail para recuperar a senha.");
      return;
    }
    if (supabaseClient) {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo: appRedirectUrl() });
      if (error) {
        alert(error.message);
        return;
      }
    }
    alert("Enviamos as instrucoes de recuperacao para o e-mail informado.");
  });

  supabaseClient?.auth.onAuthStateChange((_event, session) => {
    if (!session?.user && state.user?.id) {
      state.user = null;
      saveState();
      render();
    }
  });

  const weddingDateInput = els.onboardingForm.elements.date;
  weddingDateInput.addEventListener("input", () => {
    weddingDateInput.value = maskBrazilianDate(weddingDateInput.value);
    weddingDateInput.setCustomValidity("");
  });

  const budgetInput = els.onboardingForm.elements.budget;
  budgetInput.value = formatCurrencyInput(budgetInput.value);
  budgetInput.addEventListener("focus", () => placeCurrencyCursor(budgetInput));
  budgetInput.addEventListener("input", () => {
    budgetInput.value = formatCurrencyInput(budgetInput.value);
    placeCurrencyCursor(budgetInput);
    budgetInput.setCustomValidity("");
  });

  const coupleTypeInput = els.onboardingForm.elements.coupleType;
  coupleTypeInput.addEventListener("change", () => updatePartnerLabels(coupleTypeInput.value));
  updatePartnerLabels(coupleTypeInput.value);

  els.onboardingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(els.onboardingForm);
    const weddingDate = parseBrazilianDate(form.get("date"));
    if (!weddingDate) {
      weddingDateInput.setCustomValidity("Use uma data valida no formato dd/mm/aaaa.");
      weddingDateInput.reportValidity();
      return;
    }
    const budget = parseCurrencyInput(form.get("budget"));
    if (budget <= 0) {
      budgetInput.setCustomValidity("Informe um valor de orcamento maior que R$ 0,00.");
      budgetInput.reportValidity();
      return;
    }
    const partnerOne = String(form.get("partnerOne") || "").trim();
    const partnerTwo = String(form.get("partnerTwo") || "").trim();
    const coupleType = form.get("coupleType");
    state.wedding = {
      coupleType,
      partnerOne,
      partnerTwo,
      couple: formatCoupleName(partnerOne, partnerTwo),
      date: weddingDate,
      type: form.get("type"),
      style: form.get("style"),
      budget,
      guestTarget: Number(form.get("guestTarget")) || 0
    };
    initializeBudgetDefaults();
    syncBudgetSuggestions();
    saveState();
    els.onboardingDialog.close();
    render();
  });
}

async function signUpWithSupabase(name, email, password) {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: appRedirectUrl(),
      data: { full_name: name }
    }
  });
  if (error) throw error;
  if (!data.session) {
    alert("Cadastro criado. Confira seu e-mail para confirmar a conta antes de entrar.");
    return;
  }
  await applySupabaseUser(data.session.user);
}

async function signInWithSupabase(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw error;
  await applySupabaseUser(data.user);
}

async function restoreCloudSession() {
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient.auth.getSession();
  if (error || !data.session?.user) return;
  await applySupabaseUser(data.session.user);
}

async function applySupabaseUser(user) {
  const cloudUser = {
    id: user.id,
    name: user.user_metadata?.full_name || user.email || "Usuario",
    email: user.email
  };
  state.user = cloudUser;
  await loadCloudState(cloudUser);
}

async function loadCloudState(user) {
  if (!supabaseClient || !user?.id) return;
  const { data, error } = await supabaseClient
    .from("planner_states")
    .select("state")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) {
    console.warn("Nao foi possivel carregar dados do Supabase.", error);
    saveState();
    return;
  }
  if (data?.state) {
    isApplyingCloudState = true;
    state = normalizeState({
      ...structuredClone(seedState),
      ...data.state,
      data: {
        ...structuredClone(seedState).data,
        ...(data.state.data || {})
      },
      user
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    isApplyingCloudState = false;
    return;
  }
  isApplyingCloudState = true;
  state = normalizeState({
    ...structuredClone(seedState),
    user
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  isApplyingCloudState = false;
  saveState();
}

function queueCloudSave() {
  if (!supabaseClient || isApplyingCloudState || !state.user?.id) return;
  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(saveCloudState, 500);
}

async function saveCloudState() {
  if (!supabaseClient || !state.user?.id) return;
  const { error } = await supabaseClient.from("planner_states").upsert({
    user_id: state.user.id,
    state,
    updated_at: new Date().toISOString()
  }, { onConflict: "user_id" });
  if (error) console.warn("Nao foi possivel salvar dados no Supabase.", error);
}

function appRedirectUrl() {
  if (window.location.protocol !== "file:" && window.location.origin && window.location.origin !== "null") {
    return window.location.origin;
  }
  return "https://planner-casamentos.vercel.app";
}

function handleAuthRedirectMessage() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const errorDescription = params.get("error_description");
  if (errorDescription) {
    alert(`Nao foi possivel confirmar o acesso: ${errorDescription.replaceAll("+", " ")}`);
    history.replaceState(null, "", window.location.pathname || "/");
  }
}

function wireShell() {
  document.querySelector("#logoutButton").addEventListener("click", async () => {
    if (supabaseClient) await supabaseClient.auth.signOut();
    state.user = null;
    saveState();
    render();
  });

  els.settingsButton.addEventListener("click", () => openWeddingDialog("edit"));

  els.newButton.addEventListener("click", () => {
    if (state.currentView === "dashboard") {
      state.currentView = "checklist";
      render();
    }
    openItemDialog(state.currentView);
  });

  els.exportButton.addEventListener("click", () => {
    const key = state.currentView === "dashboard" ? "checklist" : state.currentView;
    exportCsv(key);
  });

  els.itemForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const key = editing.key;
    const form = new FormData(els.itemForm);
    if (key === "seatGuest") {
      saveGuestSeat(form);
      els.itemDialog.close();
      editing = null;
      render();
      return;
    }
    if (key === "identityGroup") {
      const groupName = String(form.get("groupName") || "").trim();
      if (groupName && !state.identityColorGroups.includes(groupName)) state.identityColorGroups.push(groupName);
      saveState();
      els.itemDialog.close();
      editing = null;
      render();
      return;
    }
    if (key === "guestColumn") {
      saveGuestColumn(form);
      els.itemDialog.close();
      editing = null;
      render();
      return;
    }
    if (key === "weddingPartyManual") {
      saveWeddingPartyManual(form);
      els.itemDialog.close();
      editing = null;
      render();
      return;
    }
    if (key === "weddingPartyManualField") {
      saveWeddingPartyManualField(form);
      els.itemDialog.close();
      editing = null;
      render();
      return;
    }
    if (key === "identity") {
      saveIdentityItem(form);
      els.itemDialog.close();
      editing = null;
      render();
      return;
    }
    if (key === "vendors") {
      saveVendorItem(form);
      els.itemDialog.close();
      editing = null;
      render();
      return;
    }
    if (key === "guests") {
      saveGuestItem(form);
      els.itemDialog.close();
      editing = null;
      render();
      return;
    }
    if (key === "tables") {
      saveTableItem(form);
      els.itemDialog.close();
      editing = null;
      render();
      return;
    }
    if (key === "music") {
      saveMusicItem(form);
      els.itemDialog.close();
      editing = null;
      render();
      return;
    }
    const item = { id: editing.id || uid() };
    moduleConfig[key].fields.forEach(([name, , type]) => {
      const raw = form.get(name);
      item[name] = type === "number" ? Number(raw) || 0 : raw;
    });
    if (key === "identity") normalizeIdentityItem(item);
    if (editing.id) {
      state.data[key] = state.data[key].map((existing) => existing.id === editing.id ? item : existing);
    } else {
      state.data[key].push(item);
    }
    saveState();
    els.itemDialog.close();
    editing = null;
    render();
  });

  document.querySelector("[data-close-dialog]").addEventListener("click", () => els.itemDialog.close());
}

function render() {
  const isAuthed = Boolean(state.user);
  els.authScreen.classList.toggle("hidden", isAuthed);
  els.appShell.classList.toggle("hidden", !isAuthed);
  if (!isAuthed) return;

  els.weddingName.textContent = state.wedding?.couple || "Casamento";
  renderNav();

  const isDashboard = state.currentView === "dashboard";
  const isIdentity = state.currentView === "identity";
  const isReadOnlyView = ["identity", "weddingParty"].includes(state.currentView);
  els.dashboardView.classList.toggle("active", isDashboard);
  els.moduleView.classList.toggle("active", !isDashboard);
  els.newButton.textContent = isDashboard ? "Nova tarefa" : `Adicionar ${moduleConfig[state.currentView].title}`;
  els.exportButton.textContent = isDashboard ? "Exportar checklist" : "Exportar CSV";
  els.settingsButton.classList.toggle("hidden", !isDashboard);
  els.newButton.classList.toggle("hidden", isReadOnlyView);

  if (isDashboard) renderDashboard();
  else renderModule(state.currentView);
}

function renderNav() {
  els.navList.innerHTML = navItems.map(([key, label]) => (
    `<button class="nav-item ${state.currentView === key ? "active" : ""}" type="button" data-view="${key}">
      <span>${label}</span><span>${countFor(key)}</span>
    </button>`
  )).join("");
  els.navList.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentView = button.dataset.view;
      saveState();
      render();
    });
  });
}

function openWeddingDialog(mode) {
  const isEdit = mode === "edit";
  const wedding = state.wedding || {};
  document.querySelector("#onboardingEyebrow").textContent = isEdit ? "Dados do casamento" : "Configuracao inicial";
  document.querySelector("#onboardingTitle").textContent = isEdit ? "Editar informacoes iniciais" : "Dados do casamento";
  document.querySelector("#onboardingSubmitButton").textContent = isEdit ? "Salvar alteracoes" : "Criar planejamento";

  els.onboardingForm.elements.coupleType.value = wedding.coupleType || "bride_groom";
  updatePartnerLabels(els.onboardingForm.elements.coupleType.value);
  els.onboardingForm.elements.partnerOne.value = wedding.partnerOne || "";
  els.onboardingForm.elements.partnerTwo.value = wedding.partnerTwo || "";
  els.onboardingForm.elements.date.value = formatDate(wedding.date);
  els.onboardingForm.elements.type.value = wedding.type || "Classico";
  els.onboardingForm.elements.style.value = wedding.style || "Elegante";
  els.onboardingForm.elements.budget.value = formatCurrencyInput(wedding.budget || 65000);
  els.onboardingForm.elements.guestTarget.value = wedding.guestTarget || 120;
  els.onboardingDialog.showModal();
}

function renderDashboard() {
  els.screenEyebrow.textContent = state.wedding ? `${state.wedding.type} | ${formatDate(state.wedding.date)}` : "Resumo";
  els.screenTitle.textContent = state.wedding?.couple || "Dashboard";

  const tasks = state.data.checklist;
  const done = tasks.filter((task) => task.status === "Concluido").length;
  const guests = state.data.guests;
  const confirmed = guests.filter((guest) => guest.rsvp === "Confirmado").length;
  const planned = sum(state.data.budget, "planned");
  const actual = sum(state.data.budget, "actual");
  const pendingPayments = state.data.payments.filter((payment) => payment.status !== "Pago");
  const completion = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const daysLeft = weddingDaysLeft();
  const alignment = state.data.identity.length ? Math.min(100, Math.round((state.data.identity.filter((item) => item.status !== "Ideia").length / state.data.identity.length) * 100)) : 0;
  const reality = planned ? Math.min(100, Math.round((actual / planned) * 100)) : 0;

  els.dashboardView.innerHTML = `
    <section class="welcome-panel">
      <div>
        <p class="eyebrow">${periodGreeting()}, ${state.wedding?.couple || "Casamento"}!</p>
        <h3>Vamos planejar seu grande dia?</h3>
      </div>
      <button class="countdown-card" type="button" data-edit-wedding>
        <span class="calendar-icon"></span>
        <div>
          <small>Faltam</small>
          <strong>${daysLeft}</strong>
          <span>dias</span>
          <small>${formatDate(state.wedding?.date)}</small>
        </div>
      </button>
    </section>
    <div class="aro-heading">
      <h3>Seu progresso</h3>
    </div>
    <div class="metric-grid">
      ${progressMetric("Alinhamento", `${alignment}%`, "Estilo, paleta e identidade visual", alignment, "rose", "identity")}
      ${progressMetric("Realidade", `${reality}%`, "Orcamento utilizado", reality, "teal", "budget")}
      ${progressMetric("Organizacao", `${completion}%`, `${done} de ${tasks.length} tarefas`, completion, "plum", "checklist")}
      ${metric("Pagamentos pendentes", pendingPayments.length, money(sum(pendingPayments, "amount")))}
    </div>
    <div class="dashboard-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Proximas tarefas</p>
            <h3>Checklist geral</h3>
          </div>
          <span class="chip teal">${completion}%</span>
        </div>
        <div class="progress-rail"><div class="progress-bar" style="width:${completion}%"></div></div>
        <ul class="quick-list">${tasks.slice(0, 6).map((task) => `
          <li>
            <span class="chip ${chipColor(task.status)}">${task.period}</span>
            <span>${task.title}</span>
            <span class="status-pill">${task.status}</span>
          </li>
        `).join("")}</ul>
      </section>
      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Agenda</p>
            <h3>Proximos compromissos</h3>
          </div>
        </div>
        ${confirmed || guests.length ? `<div class="guest-summary"><strong>${confirmed}</strong><span>confirmados de ${guests.length} convidados</span></div>` : ""}
        <ul class="quick-list">${state.data.appointments
          .slice()
          .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
          .slice(0, 5)
          .map((item) => `
            <li>
              <span class="chip rose">${formatDate(item.date)}</span>
              <span>${item.title}</span>
              <span>${item.time || ""}</span>
            </li>
          `).join("")}</ul>
      </section>
    </div>
  `;

  els.dashboardView.querySelectorAll("[data-dashboard-target]").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentView = button.dataset.dashboardTarget;
      saveState();
      render();
    });
  });
  els.dashboardView.querySelector("[data-edit-wedding]")?.addEventListener("click", () => openWeddingDialog("edit"));
}

function renderModule(key) {
  const config = moduleConfig[key];
  els.screenEyebrow.textContent = config.eyebrow;
  els.screenTitle.textContent = config.title;
  const items = filteredItems(key);
  const filters = config.filters || [];

  els.moduleView.innerHTML = `
    <div class="module-tools">
      <input type="search" placeholder="Buscar" value="${escapeHtml(state.filters[key]?.query || "")}" data-filter-query>
      ${filters.map((field) => renderFilter(key, field)).join("")}
      ${key === "guests" ? renderGuestViewControls() : ""}
      ${key === "guests" ? '<button class="secondary-action" type="button" data-add-guest-column>Adicionar coluna</button>' : ""}
      ${key === "guests" ? '<button class="secondary-action" type="button" data-import-guests>Importar CSV</button><input class="hidden" type="file" accept=".csv" data-import-file>' : ""}
      ${key === "vendors" ? renderVendorViewControls() : ""}
    </div>
    ${renderModuleContent(key, items)}
  `;

  els.moduleView.querySelector("[data-filter-query]").addEventListener("input", (event) => {
    updateFilter(key, "query", event.target.value, {
      restoreQueryFocus: true,
      cursor: event.target.selectionStart ?? event.target.value.length
    });
  });
  els.moduleView.querySelectorAll("[data-filter-field]").forEach((select) => {
    select.addEventListener("change", (event) => updateFilter(key, event.target.dataset.filterField, event.target.value));
  });
  els.moduleView.querySelectorAll("[data-sort-field]").forEach((button) => {
    button.addEventListener("click", () => updateTableSort(key, button.dataset.sortField));
  });
  els.moduleView.querySelectorAll("[data-vendor-view]").forEach((select) => {
    select.addEventListener("change", (event) => {
      state.vendorView = { ...(state.vendorView || {}), [event.target.dataset.vendorView]: event.target.value };
      saveState();
      renderModule("vendors");
    });
  });
  els.moduleView.querySelectorAll("[data-guest-view]").forEach((select) => {
    select.addEventListener("change", (event) => {
      state.guestView = { ...(state.guestView || {}), [event.target.dataset.guestView]: event.target.value };
      saveState();
      renderModule("guests");
    });
  });
  els.moduleView.querySelector("[data-add-guest-column]")?.addEventListener("click", openGuestColumnDialog);
  els.moduleView.querySelectorAll("[data-edit-wedding-party-manual]").forEach((button) => {
    button.addEventListener("click", () => openWeddingPartyManualDialog(button.dataset.editWeddingPartyManual));
  });
  els.moduleView.querySelector("[data-add-wedding-party-manual]")?.addEventListener("click", openWeddingPartyManualFieldDialog);
  els.moduleView.querySelectorAll("[data-delete-wedding-party-manual]").forEach((button) => {
    button.addEventListener("click", () => deleteWeddingPartyManualField(button.dataset.deleteWeddingPartyManual));
  });
  els.moduleView.querySelectorAll("[data-wedding-party-detail]").forEach((input) => {
    input.addEventListener("change", () => {
      saveWeddingPartyDetail(input);
      render();
    });
  });
  els.moduleView.querySelectorAll("[data-payment-month]").forEach((button) => {
    button.addEventListener("click", () => {
      state.paymentCalendarMonth = addMonths(paymentCalendarMonth(), Number(button.dataset.paymentMonth));
      saveState();
      renderModule("payments");
    });
  });
  els.moduleView.querySelectorAll("[data-edit]").forEach((button) => button.addEventListener("click", () => openItemDialog(key, button.dataset.edit)));
  els.moduleView.querySelectorAll("[data-delete]").forEach((button) => button.addEventListener("click", () => deleteItem(key, button.dataset.delete)));
  els.moduleView.querySelectorAll("[data-toggle-task]").forEach((button) => button.addEventListener("click", () => toggleChecklistTask(button.dataset.toggleTask)));
  els.moduleView.querySelectorAll("[data-add-identity-font]").forEach((button) => button.addEventListener("click", () => openIdentityFontDialog()));
  els.moduleView.querySelectorAll("[data-add-identity-group]").forEach((button) => button.addEventListener("click", () => openIdentityGroupDialog()));
  els.moduleView.querySelectorAll("[data-add-identity-color]").forEach((button) => button.addEventListener("click", () => openIdentityColorDialog(button.dataset.addIdentityColor)));
  if (key === "budget") wireBudgetInputs();
  if (key === "tables") wireTablePlanner();

  const importButton = els.moduleView.querySelector("[data-import-guests]");
  if (importButton) {
    const importFile = els.moduleView.querySelector("[data-import-file]");
    importButton.addEventListener("click", () => importFile.click());
    importFile.addEventListener("change", importGuestsCsv);
  }
}

function renderModuleContent(key, items) {
  const layout = moduleConfig[key].layout;
  if (key === "guests") return renderGuests(items);
  if (key === "weddingParty") return renderWeddingParty();
  if (key === "tables") return renderTablePlanner(items);
  if (key === "vendors") return renderVendors(items);
  if (key === "payments") return renderPayments(items);
  if (layout === "table") return renderTable(key, items);
  if (layout === "kanban") return renderChecklistBoard(items);
  if (layout === "budget") return renderBudgetCards(items);
  if (layout === "identity") return renderIdentity(items);
  return renderCards(key, items);
}

function renderFilter(key, field) {
  let values = [...new Set(state.data[key].map((item) => item[field]).filter(Boolean))];
  if (key === "vendors" && field === "category") values = state.vendorCategories;
  if (key === "guests" && field === "group") values = state.guestGroups;
  if (key === "music" && field === "moment") values = state.musicMoments;
  const selected = state.filters[key]?.[field] || "";
  return `
    <select data-filter-field="${field}">
      <option value="">${labelForField(field)}: todos</option>
      ${values.map((value) => `<option ${selected === value ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")}
    </select>
  `;
}

function renderVendorViewControls() {
  const view = state.vendorView || {};
  return `
    <select data-vendor-view="groupBy">
      <option value="category" ${view.groupBy === "category" ? "selected" : ""}>Agrupar: categoria</option>
      <option value="status" ${view.groupBy === "status" ? "selected" : ""}>Agrupar: status</option>
      <option value="none" ${view.groupBy === "none" ? "selected" : ""}>Sem agrupamento</option>
    </select>
    <select data-vendor-view="sortBy">
      <option value="name-asc" ${view.sortBy === "name-asc" ? "selected" : ""}>Ordem: nome A-Z</option>
      <option value="name-desc" ${view.sortBy === "name-desc" ? "selected" : ""}>Ordem: nome Z-A</option>
      <option value="value-asc" ${view.sortBy === "value-asc" ? "selected" : ""}>Ordem: menor valor</option>
      <option value="value-desc" ${view.sortBy === "value-desc" ? "selected" : ""}>Ordem: maior valor</option>
    </select>
  `;
}

function renderGuestViewControls() {
  const view = state.guestView || {};
  return `
    <select data-guest-view="groupBy">
      <option value="none" ${view.groupBy === "none" ? "selected" : ""}>Organizar: sem agrupamento</option>
      <option value="group" ${view.groupBy === "group" ? "selected" : ""}>Organizar: grupo</option>
      <option value="role" ${view.groupBy === "role" ? "selected" : ""}>Organizar: papel</option>
      <option value="rsvp" ${view.groupBy === "rsvp" ? "selected" : ""}>Organizar: RSVP</option>
    </select>
  `;
}

function renderChecklistBoard(items) {
  const periods = ["12 meses", "10 meses", "9 meses", "8 meses", "6 meses", "3 meses", "1 mes", "Semana"];
  const visiblePeriods = periods.filter((period) => items.some((item) => item.period === period));
  const columns = visiblePeriods.length ? visiblePeriods : periods.slice(0, 4);
  return `
    <div class="status-tabs">
      <span>Todas (${state.data.checklist.length})</span>
      <span>Pendentes (${state.data.checklist.filter((item) => item.status !== "Concluido").length})</span>
      <span>Concluidas (${state.data.checklist.filter((item) => item.status === "Concluido").length})</span>
    </div>
    <div class="kanban-board">
      ${columns.map((period) => {
        const periodItems = items.filter((item) => item.period === period);
        const done = periodItems.filter((item) => item.status === "Concluido").length;
        const percent = periodItems.length ? Math.round((done / periodItems.length) * 100) : 0;
        return `
          <section class="kanban-column">
            <header>
              <div>
                <h3>${period}<br>antes</h3>
                <span>${done}/${periodItems.length} tarefas</span>
              </div>
              <div class="mini-progress"><span style="width:${percent}%"></span></div>
            </header>
            <div class="kanban-list">
              ${periodItems.map((item) => `
                <article class="task-pill">
                  <button class="task-check ${item.status === "Concluido" ? "done" : ""}" type="button" data-toggle-task="${item.id}" aria-label="${item.status === "Concluido" ? "Marcar como pendente" : "Marcar como concluido"}"></button>
                  <div class="task-copy">
                    <strong>${escapeHtml(item.title)}</strong>
                    ${item.owner ? `<small>Responsavel: ${escapeHtml(item.owner)}</small>` : ""}
                  </div>
                  <span class="chip ${chipColor(item.priority)}">${escapeHtml(item.priority || "Media")}</span>
                  ${actionButtons(item.id, "compact")}
                </article>
              `).join("") || '<p class="muted-note">Sem tarefas neste periodo.</p>'}
            </div>
          </section>
        `;
      }).join("")}
    </div>
  `;
}

function renderBudgetCards(items) {
  const planned = Number(state.wedding?.budget) || sum(items, "planned");
  const actual = sum(items, "actual");
  const paid = paidPaymentsTotal();
  const available = planned - actual;
  const used = planned ? Math.min(100, Math.round((paid / planned) * 100)) : 0;
  if (!items.length) return emptyPanel();
  return `
    <div class="budget-summary">
      ${metric("Orcamento previsto", money(planned), "Valor informado pelo casal")}
      ${metric("Orcamento real", money(actual), "Soma dos valores reais")}
      ${metric("Disponivel", money(available), "Previsto menos orcamento real")}
      ${metric("Total pago", money(paid), "Pagamentos marcados como Pago")}
      <article class="metric-card wide budget-progress-card">
        <span>Orcamento utilizado pelos pagamentos</span>
        <strong>${used}%</strong>
        <div class="progress-rail"><div class="progress-bar" style="width:${used}%"></div></div>
      </article>
    </div>
    <div class="budget-card-grid">
      ${items.map((item) => `
        <article class="budget-card">
          <header>
            <h3>${escapeHtml(item.category)}</h3>
            <span class="chip ${chipColor(item.status)}">${escapeHtml(item.status)}</span>
          </header>
          <p>${Number(item.share) || 0}% base - ${money(item.planned)} sugerido</p>
          <label>
            Real
            <input data-budget-actual="${item.id}" type="text" inputmode="numeric" value="${money(item.actual)}" placeholder="R$ 0,00">
          </label>
          ${actionButtons(item.id)}
        </article>
      `).join("")}
    </div>
  `;
}

function wireBudgetInputs() {
  els.moduleView.querySelectorAll("[data-budget-actual]").forEach((input) => {
    input.addEventListener("focus", () => placeCurrencyCursor(input));
    input.addEventListener("input", () => {
      input.value = formatCurrencyInput(input.value);
      placeCurrencyCursor(input);
    });
    input.addEventListener("change", () => {
      const value = parseCurrencyInput(input.value);
      state.data.budget = state.data.budget.map((item) => item.id === input.dataset.budgetActual ? { ...item, actual: value } : item);
      saveState();
      renderModule("budget");
    });
  });
}

function renderPayments(items) {
  const paid = items.filter((payment) => payment.status === "Pago");
  const scheduled = items.filter((payment) => payment.status !== "Pago");
  const month = paymentCalendarMonth();
  const monthPayments = items.filter((payment) => monthKey(payment.dueDate) === month);
  return `
    <div class="budget-summary payment-summary">
      ${metric("Total pago", money(sum(paid, "amount")), "Pagamentos realizados")}
      ${metric("A pagar", money(sum(scheduled, "amount")), "Pendentes e atrasados")}
      ${metric("No mes", money(sum(monthPayments, "amount")), `${monthPayments.length} pagamento(s)`)}
    </div>
    ${renderPaymentCalendar(items, month)}
    ${items.length ? renderTable("payments", items) : emptyPanel()}
  `;
}

function renderPaymentCalendar(items, month) {
  const [year, monthNumber] = month.split("-").map(Number);
  const firstDay = new Date(year, monthNumber - 1, 1);
  const lastDay = new Date(year, monthNumber, 0);
  const leadingDays = firstDay.getDay();
  const cells = [
    ...Array.from({ length: leadingDays }, () => null),
    ...Array.from({ length: lastDay.getDate() }, (_, index) => index + 1)
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const monthPayments = items.filter((payment) => monthKey(payment.dueDate) === month);
  return `
    <section class="payment-calendar panel">
      <div class="payment-calendar-header">
        <div>
          <p class="eyebrow">Calendario de pagamentos</p>
          <h3>Parcelas por data</h3>
          <small>Pagos e agendados aparecem no mes de vencimento.</small>
        </div>
        <div class="calendar-controls">
          <button class="icon-button" type="button" data-payment-month="-1" aria-label="Mes anterior">&lsaquo;</button>
          <strong>${formatMonthTitle(month)}</strong>
          <button class="icon-button" type="button" data-payment-month="1" aria-label="Proximo mes">&rsaquo;</button>
        </div>
      </div>
      <div class="calendar-weekdays">
        ${["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day) => `<span>${day}</span>`).join("")}
      </div>
      <div class="calendar-grid">
        ${cells.map((day) => day ? renderPaymentCalendarDay(day, month, items) : '<div class="calendar-day empty"></div>').join("")}
      </div>
      <footer class="calendar-total">
        <span>${formatMonthTitle(month)} - ${monthPayments.length} parcela(s)</span>
        <strong>${money(sum(monthPayments, "amount"))}</strong>
      </footer>
    </section>
  `;
}

function renderPaymentCalendarDay(day, month, items) {
  const date = `${month}-${String(day).padStart(2, "0")}`;
  const payments = items.filter((payment) => payment.dueDate === date);
  return `
    <div class="calendar-day">
      <span class="calendar-date">${day}</span>
      <div class="calendar-payment-list">
        ${payments.map((payment) => `
          <button class="calendar-payment ${payment.status === "Pago" ? "paid" : "scheduled"}" type="button" data-edit="${payment.id}">
            <span>${escapeHtml(payment.description || payment.vendor || "Pagamento")}</span>
            <strong>${money(payment.amount)}</strong>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function renderVendors(items) {
  if (!items.length) return emptyPanel();
  const sorted = sortVendors(items);
  const groupBy = state.vendorView?.groupBy || "category";
  const groups = groupBy === "none" ? [["Todos", sorted]] : [...new Set(sorted.map((item) => item[groupBy] || "Sem classificacao"))].map((group) => [group, sorted.filter((item) => (item[groupBy] || "Sem classificacao") === group)]);
  return `
    <div class="vendor-groups">
      ${groups.map(([group, groupItems]) => `
        <section class="vendor-group">
          <div class="panel-header">
            <div>
              <h3>${escapeHtml(group)}</h3>
            </div>
            <span class="chip teal">${groupItems.length}</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr><th>Nome</th><th>Categoria</th><th>Contato</th><th>Instagram</th><th>Valor</th><th>Status</th><th>Contrato</th><th>Acoes</th></tr>
              </thead>
              <tbody>
                ${groupItems.map((item) => `
                  <tr>
                    <td>${escapeHtml(item.name)}</td>
                    <td>${escapeHtml(item.category)}</td>
                    <td>${formatVendorContact(item.contact)}</td>
                    <td>${formatInstagramLink(item.instagramUrl, item.instagramHandle)}</td>
                    <td>${money(item.value)}</td>
                    <td><span class="chip ${chipColor(item.status)}">${escapeHtml(item.status)}</span></td>
                    <td>${escapeHtml(item.contract)}</td>
                    <td>${actionButtons(item.id)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </section>
      `).join("")}
    </div>
  `;
}

function sortVendors(items) {
  const sorted = [...items];
  const sortBy = state.vendorView?.sortBy || "name-asc";
  const [field, direction] = sortBy.split("-");
  sorted.sort((a, b) => {
    const factor = direction === "desc" ? -1 : 1;
    if (field === "value") return ((Number(a.value) || 0) - (Number(b.value) || 0)) * factor;
    return String(a.name || "").localeCompare(String(b.name || ""), "pt-BR") * factor;
  });
  return sorted;
}

function renderGuests(items) {
  if (!items.length) return emptyPanel();
  const groupBy = state.guestView?.groupBy || "none";
  if (groupBy === "none") return renderTable("guests", items);
  const sorted = sortTableItems("guests", items);
  const groups = [...new Set(sorted.map((item) => item[groupBy] || "Sem classificacao"))]
    .map((group) => [group, sorted.filter((item) => (item[groupBy] || "Sem classificacao") === group)]);
  return `
    <div class="vendor-groups">
      ${groups.map(([group, groupItems]) => `
        <section class="vendor-group">
          <div class="panel-header">
            <div>
              <h3>${escapeHtml(group)}</h3>
            </div>
            <span class="chip rose">${groupItems.length}</span>
          </div>
          ${renderTable("guests", groupItems)}
        </section>
      `).join("")}
    </div>
  `;
}

function renderWeddingParty() {
  const godmothers = weddingPartyGuests("Madrinha");
  const godfathers = weddingPartyGuests("Padrinho");
  return `
    <div class="wedding-party-layout">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>As madrinhas</h3>
          </div>
          <span class="chip plum">${godmothers.length}</span>
        </div>
        ${renderWeddingPartyCards(godmothers)}
      </section>
      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Os padrinhos</h3>
          </div>
          <span class="chip teal">${godfathers.length}</span>
        </div>
        ${renderWeddingPartyCards(godfathers)}
      </section>
      ${renderWeddingPartyManual()}
    </div>
  `;
}

function renderWeddingPartyManual() {
  const manual = state.weddingPartyManual || DEFAULT_WEDDING_PARTY_MANUAL;
  const sections = [
    ["Boas-vindas", manual.welcome],
    ["Informações do casamento", manual.weddingInfo],
    ["Traje das madrinhas", manual.godmotherDressCode],
    ["Traje dos padrinhos", manual.godfatherDressCode],
    ["Inspirações visuais", manual.inspirations],
    ["Entrada na cerimônia", manual.ceremonyEntrance],
    ["Fotos", manual.photos],
    ["Presentes e contribuições", manual.gifts],
    ["Contatos importantes", manual.contacts],
    ["Cronograma resumido", manual.timeline],
    ["Regras gentis", manual.gentleRules],
    ["Agradecimento final", manual.closing]
  ];
  return `
    <section class="panel wedding-party-manual">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Manual</p>
          <h3>Guia dos padrinhos e madrinhas</h3>
        </div>
        <button class="secondary-action" type="button" data-edit-wedding-party-manual>Editar manual</button>
      </div>
      <div class="manual-section-grid">
        ${sections.map(([title, text]) => `
          <article class="manual-section">
            <h4>${escapeHtml(title)}</h4>
            <p>${formatMultilineText(text)}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function weddingPartyGuests(role) {
  return state.data.guests
    .filter((guest) => normalizeGuestRole(guest.role) === role && guest.rsvp !== "Não vai")
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "pt-BR", { sensitivity: "base" }));
}

function renderWeddingPartyCards(guests) {
  if (!guests.length) return '<p class="muted-note">Nenhum convidado marcado com este papel.</p>';
  return `
    <div class="wedding-party-grid">
      ${guests.map((guest) => {
        const table = guest.tableId ? state.data.tables.find((item) => item.id === guest.tableId)?.name : guest.table;
        return `
          <article class="wedding-party-card">
            <div>
              <h4>${escapeHtml(guest.name)}</h4>
              <span class="chip ${chipColor(guest.rsvp)}">${escapeHtml(guest.rsvp)}</span>
            </div>
            <div class="item-meta">
              <span><strong>Grupo:</strong> ${escapeHtml(guest.group || "-")}</span>
              <span><strong>Tipo:</strong> ${escapeHtml(guest.guestType || "Adulto")}</span>
              ${guest.phone ? `<span><strong>WhatsApp:</strong> ${formatWhatsAppLink(guest.phone)}</span>` : ""}
              ${table ? `<span><strong>Mesa:</strong> ${escapeHtml(table)}</span>` : ""}
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function renderWeddingPartyPalette(colors, group) {
  const groupColors = colors.filter((item) => item.group === group);
  if (!groupColors.length) return `<p class="muted-note">Nenhuma cor cadastrada para ${escapeHtml(group)}.</p>`;
  return `<div class="color-card-grid wedding-party-colors">${groupColors.map(renderColorCard).join("")}</div>`;
}

function renderWeddingPartyAttire(colors) {
  const details = normalizeWeddingPartyDetails(state.weddingPartyDetails || {});
  return `
    <section class="panel wedding-party-attire">
      <div class="panel-header">
        <div>
          <h3>Traje das madrinhas</h3>
        </div>
      </div>
      <div class="attire-block">
        <h4>Paleta de cores dos vestidos</h4>
        ${renderWeddingPartyPalette(colors, "Madrinhas")}
      </div>
      <div class="attire-block">
        <h4>Tipo de vestido e orientações</h4>
        <div class="option-stack">
          ${GODMOTHER_DRESS_OPTIONS.map((option) => `
            <label class="inline-check">
              <input type="checkbox" data-wedding-party-detail="godmotherDressOptions" value="${escapeHtml(option)}" ${details.godmotherDressOptions.includes(option) ? "checked" : ""}>
              <span>${escapeHtml(option)}</span>
            </label>
          `).join("")}
        </div>
      </div>
      <div class="attire-block">
        <h4>Corsage / Buquê das madrinhas?</h4>
        ${renderYesNoOptions("godmotherCorsage", details.godmotherCorsage)}
      </div>
    </section>
    <section class="panel wedding-party-attire">
      <div class="panel-header">
        <div>
          <h3>Traje dos padrinhos</h3>
        </div>
      </div>
      <div class="attire-block">
        <h4>Paleta de cores do traje</h4>
        ${renderWeddingPartyPalette(colors, "Padrinhos")}
      </div>
      <div class="attire-block">
        <h4>Lapela dos padrinhos?</h4>
        ${renderYesNoOptions("godfatherLapel", details.godfatherLapel)}
      </div>
    </section>
  `;
}

function renderYesNoOptions(field, value) {
  return `
    <div class="option-row">
      ${["Sim", "Não"].map((option) => `
        <label class="inline-check">
          <input type="radio" name="${escapeHtml(field)}" data-wedding-party-detail="${escapeHtml(field)}" value="${escapeHtml(option)}" ${value === option ? "checked" : ""}>
          <span>${escapeHtml(option)}</span>
        </label>
      `).join("")}
    </div>
  `;
}

function normalizeWeddingPartyDetails(details = {}) {
  return {
    ...structuredClone(DEFAULT_WEDDING_PARTY_DETAILS),
    ...(details || {}),
    godmotherDressOptions: Array.isArray(details?.godmotherDressOptions) ? details.godmotherDressOptions : []
  };
}

function saveWeddingPartyDetail(input) {
  const field = input.dataset.weddingPartyDetail;
  const details = normalizeWeddingPartyDetails(state.weddingPartyDetails || {});
  if (field === "godmotherDressOptions") {
    const option = input.value;
    details.godmotherDressOptions = input.checked
      ? [...new Set([...details.godmotherDressOptions, option])]
      : details.godmotherDressOptions.filter((item) => item !== option);
  } else {
    details[field] = input.value;
  }
  state.weddingPartyDetails = details;
  saveState();
}

function openWeddingPartyManualDialog() {
  editing = { key: "weddingPartyManual", id: null };
  const manual = state.weddingPartyManual || DEFAULT_WEDDING_PARTY_MANUAL;
  const fields = weddingPartyManualFields();
  document.querySelector("#itemDialogEyebrow").textContent = "Manual";
  document.querySelector("#itemDialogTitle").textContent = "Editar manual dos padrinhos";
  els.itemFields.innerHTML = fields.map(([name, label]) => `
    <label class="full-field">${escapeHtml(label)}<textarea name="${name}">${escapeHtml(manual[name] || "")}</textarea></label>
  `).join("");
  els.itemDialog.showModal();
}

function saveWeddingPartyManual(form) {
  const nextManual = {};
  weddingPartyManualFields().forEach(([name]) => {
    nextManual[name] = String(form.get(name) || "").trim();
  });
  state.weddingPartyManual = nextManual;
  saveState();
}

function weddingPartyManualFields() {
  return [
    ["welcome", "Boas-vindas"],
    ["weddingInfo", "Informações do casamento"],
    ["godmotherDressCode", "Traje das madrinhas"],
    ["godfatherDressCode", "Traje dos padrinhos"],
    ["inspirations", "Inspirações visuais"],
    ["ceremonyEntrance", "Entrada na cerimônia"],
    ["photos", "Fotos"],
    ["gifts", "Presentes e contribuições"],
    ["contacts", "Contatos importantes"],
    ["timeline", "Cronograma resumido"],
    ["gentleRules", "Regras gentis"],
    ["closing", "Agradecimento final"]
  ];
}

function normalizeWeddingPartyManual(manual = {}) {
  const normalized = structuredClone(DEFAULT_WEDDING_PARTY_MANUAL);
  weddingPartyManualFields().forEach(([name]) => {
    const value = String(manual?.[name] || "").trim();
    normalized[name] = value === WEDDING_PARTY_MANUAL_EXAMPLES[name] ? "" : value;
  });
  return normalized;
}

function renderWeddingPartyManual() {
  const manual = normalizeWeddingPartyManual(state.weddingPartyManual || {});
  return `
    <section class="panel wedding-party-manual">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Manual</p>
          <h3>Guia dos padrinhos e madrinhas</h3>
        </div>
      </div>
      <div class="manual-section-grid">
        ${weddingPartyManualFields().map(([name, title]) => `
          <article class="manual-section">
            <div class="manual-section-header">
              <h4>${escapeHtml(title)}</h4>
              <button class="icon-button icon-only edit action-link" type="button" data-edit-wedding-party-manual="${escapeHtml(name)}" aria-label="Editar ${escapeHtml(title)}">${iconSvg("edit")}</button>
            </div>
            <p class="manual-example"><strong>Exemplo:</strong> ${formatMultilineText(WEDDING_PARTY_MANUAL_EXAMPLES[name] || "")}</p>
            ${manual[name]
              ? `<p class="manual-answer">${formatMultilineText(manual[name])}</p>`
              : '<p class="manual-empty">Campo em branco.</p>'}
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function openWeddingPartyManualDialog(field = "welcome") {
  const selectedField = weddingPartyManualFields().some(([name]) => name === field) ? field : "welcome";
  const fieldLabel = weddingPartyManualFields().find(([name]) => name === selectedField)?.[1] || "Manual";
  const manual = normalizeWeddingPartyManual(state.weddingPartyManual || {});
  editing = { key: "weddingPartyManual", id: null, field: selectedField };
  document.querySelector("#itemDialogEyebrow").textContent = "Manual";
  document.querySelector("#itemDialogTitle").textContent = `Editar ${fieldLabel}`;
  els.itemFields.innerHTML = `
    <p class="muted-note full-field"><strong>Exemplo:</strong> ${formatMultilineText(WEDDING_PARTY_MANUAL_EXAMPLES[selectedField] || "")}</p>
    <label class="full-field">Texto<textarea name="manualText" placeholder="Escreva aqui a orientacao desse item.">${escapeHtml(manual[selectedField] || "")}</textarea></label>
  `;
  els.itemDialog.showModal();
}

function saveWeddingPartyManual(form) {
  const field = editing?.field || "welcome";
  state.weddingPartyManual = {
    ...normalizeWeddingPartyManual(state.weddingPartyManual || {}),
    [field]: String(form.get("manualText") || "").trim()
  };
  saveState();
}

function normalizeWeddingPartyManualConfig(config = {}) {
  const customFields = Array.isArray(config?.customFields)
    ? config.customFields
        .map((field) => ({
          id: String(field?.id || "").trim(),
          title: String(field?.title || "").trim(),
          example: String(field?.example || "").trim()
        }))
        .filter((field) => field.id && field.title)
    : [];
  const hiddenFields = Array.isArray(config?.hiddenFields)
    ? [...new Set(config.hiddenFields.map((field) => String(field || "").trim()).filter(Boolean))]
    : [];
  return { customFields, hiddenFields };
}

function weddingPartyManualFields(configSource = state.weddingPartyManualConfig || {}) {
  const config = normalizeWeddingPartyManualConfig(configSource);
  const defaultFields = Object.keys(DEFAULT_WEDDING_PARTY_MANUAL).map((name) => [
    name,
    weddingPartyManualTitle(name),
    WEDDING_PARTY_MANUAL_EXAMPLES[name] || "",
    false
  ]).filter(([name]) => !config.hiddenFields.includes(name));
  const customFields = config.customFields.map((field) => [field.id, field.title, field.example, true]);
  return [...defaultFields, ...customFields];
}

function weddingPartyManualTitle(name) {
  const titles = {
    welcome: "Boas-vindas",
    weddingInfo: "Informacoes do casamento",
    godmotherDressCode: "Traje das madrinhas",
    godfatherDressCode: "Traje dos padrinhos",
    inspirations: "Inspiracoes visuais",
    ceremonyEntrance: "Entrada na cerimonia",
    photos: "Fotos",
    gifts: "Presentes e contribuicoes",
    contacts: "Contatos importantes",
    timeline: "Cronograma resumido",
    gentleRules: "Regras gentis",
    closing: "Agradecimento final"
  };
  return titles[name] || name;
}

function normalizeWeddingPartyManual(manual = {}, configSource = state.weddingPartyManualConfig || {}) {
  const normalized = {};
  weddingPartyManualFields(configSource).forEach(([name]) => {
    const value = String(manual?.[name] || "").trim();
    normalized[name] = value === WEDDING_PARTY_MANUAL_EXAMPLES[name] ? "" : value;
  });
  return normalized;
}

function renderWeddingPartyManual() {
  const manual = normalizeWeddingPartyManual(state.weddingPartyManual || {});
  const fields = weddingPartyManualFields();
  const colors = state.data.identity.filter((item) => item.section === "Paleta de cores");
  return `
    <section class="panel wedding-party-manual">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Manual</p>
          <h3>Guia dos padrinhos e madrinhas</h3>
        </div>
        <button class="secondary-action" type="button" data-add-wedding-party-manual>Adicionar campo</button>
      </div>
      <div class="manual-section-grid">
        ${fields.length ? fields.map(([name, title, example, isCustom]) => `
          <article class="manual-section">
            <div class="manual-section-header">
              <h4>${escapeHtml(title)}</h4>
              <div class="inline-actions">
                <button class="icon-button icon-only edit action-link" type="button" data-edit-wedding-party-manual="${escapeHtml(name)}" aria-label="Editar ${escapeHtml(title)}">${iconSvg("edit")}</button>
                <button class="icon-button icon-only danger action-link" type="button" data-delete-wedding-party-manual="${escapeHtml(name)}" aria-label="Excluir ${escapeHtml(title)}">${iconSvg("trash")}</button>
              </div>
            </div>
            <p class="manual-example"><strong>Exemplo:</strong> ${formatMultilineText(example || (isCustom ? "Campo personalizado do manual." : ""))}</p>
            ${manual[name]
              ? `<p class="manual-answer">${formatMultilineText(manual[name])}</p>`
              : '<p class="manual-empty">Campo em branco.</p>'}
            ${renderWeddingPartyManualExtras(name, colors)}
          </article>
        `).join("") : '<p class="muted-note">Nenhum campo no manual. Adicione um campo para comecar.</p>'}
      </div>
    </section>
  `;
}

function renderWeddingPartyManualExtras(name, colors) {
  const details = normalizeWeddingPartyDetails(state.weddingPartyDetails || {});
  if (name === "godmotherDressCode") {
    return `
      <div class="manual-extra-block">
        <h5>Paleta de cores dos vestidos</h5>
        ${renderWeddingPartyPalette(colors, "Madrinhas")}
      </div>
      <div class="manual-extra-block">
        <h5>Tipo de vestido e orientações</h5>
        <div class="option-stack">
          ${GODMOTHER_DRESS_OPTIONS.map((option) => `
            <label class="inline-check">
              <input type="checkbox" data-wedding-party-detail="godmotherDressOptions" value="${escapeHtml(option)}" ${details.godmotherDressOptions.includes(option) ? "checked" : ""}>
              <span>${escapeHtml(option)}</span>
            </label>
          `).join("")}
        </div>
      </div>
      <div class="manual-extra-block">
        <h5>Corsage / Buquê das madrinhas?</h5>
        ${renderYesNoOptions("godmotherCorsage", details.godmotherCorsage)}
      </div>
    `;
  }
  if (name === "godfatherDressCode") {
    return `
      <div class="manual-extra-block">
        <h5>Paleta de cores do traje</h5>
        ${renderWeddingPartyPalette(colors, "Padrinhos")}
      </div>
      <div class="manual-extra-block">
        <h5>Lapela dos padrinhos?</h5>
        ${renderYesNoOptions("godfatherLapel", details.godfatherLapel)}
      </div>
    `;
  }
  return "";
}

function openWeddingPartyManualDialog(field = "welcome") {
  const fields = weddingPartyManualFields();
  const selectedField = fields.some(([name]) => name === field) ? field : fields[0]?.[0];
  if (!selectedField) return openWeddingPartyManualFieldDialog();
  const selected = fields.find(([name]) => name === selectedField);
  const manual = normalizeWeddingPartyManual(state.weddingPartyManual || {});
  editing = { key: "weddingPartyManual", id: null, field: selectedField };
  document.querySelector("#itemDialogEyebrow").textContent = "Manual";
  document.querySelector("#itemDialogTitle").textContent = `Editar ${selected?.[1] || "Manual"}`;
  els.itemFields.innerHTML = `
    <p class="muted-note full-field"><strong>Exemplo:</strong> ${formatMultilineText(selected?.[2] || "")}</p>
    <label class="full-field">Texto<textarea name="manualText" placeholder="Escreva aqui a orientacao desse item.">${escapeHtml(manual[selectedField] || "")}</textarea></label>
  `;
  els.itemDialog.showModal();
}

function openWeddingPartyManualFieldDialog() {
  editing = { key: "weddingPartyManualField", id: null };
  document.querySelector("#itemDialogEyebrow").textContent = "Manual";
  document.querySelector("#itemDialogTitle").textContent = "Adicionar campo";
  els.itemFields.innerHTML = `
    <label class="full-field">Titulo<input name="title" placeholder="Ex.: Hospedagem dos padrinhos" required></label>
    <label class="full-field">Exemplo<textarea name="example" placeholder="Escreva um exemplo para orientar o preenchimento."></textarea></label>
    <label class="full-field">Texto inicial<textarea name="manualText" placeholder="Opcional. Pode deixar em branco."></textarea></label>
  `;
  els.itemDialog.showModal();
}

function saveWeddingPartyManualField(form) {
  const title = String(form.get("title") || "").trim();
  if (!title) return;
  const config = normalizeWeddingPartyManualConfig(state.weddingPartyManualConfig || {});
  const id = uniqueManualFieldId(title, config);
  config.customFields.push({
    id,
    title,
    example: String(form.get("example") || "").trim()
  });
  state.weddingPartyManualConfig = config;
  state.weddingPartyManual = {
    ...normalizeWeddingPartyManual(state.weddingPartyManual || {}),
    [id]: String(form.get("manualText") || "").trim()
  };
  saveState();
}

function deleteWeddingPartyManualField(field) {
  const config = normalizeWeddingPartyManualConfig(state.weddingPartyManualConfig || {});
  const isCustom = config.customFields.some((item) => item.id === field);
  if (isCustom) {
    config.customFields = config.customFields.filter((item) => item.id !== field);
  } else if (!config.hiddenFields.includes(field)) {
    config.hiddenFields.push(field);
  }
  const manual = { ...(state.weddingPartyManual || {}) };
  delete manual[field];
  state.weddingPartyManual = manual;
  state.weddingPartyManualConfig = config;
  saveState();
  render();
}

function uniqueManualFieldId(title, config) {
  const base = normalizeHeader(title).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "campo";
  const existing = new Set([...Object.keys(DEFAULT_WEDDING_PARTY_MANUAL), ...config.customFields.map((field) => field.id)]);
  let id = `custom-${base}`;
  let index = 2;
  while (existing.has(id)) {
    id = `custom-${base}-${index}`;
    index += 1;
  }
  return id;
}

function renderTablePlanner(tables) {
  const sortedTables = tables.slice().sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "pt-BR", { numeric: true }));
  const unassignedGuests = state.data.guests
    .filter((guest) => !guestAssignedTable(guest) && !guestLoosePosition(guest) && guest.rsvp !== "Não vai")
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "pt-BR", { sensitivity: "base" }));
  const looseGuests = state.data.guests
    .filter((guest) => !guestAssignedTable(guest) && guestLoosePosition(guest) && guest.rsvp !== "Não vai")
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "pt-BR", { sensitivity: "base" }));
  return `
    <section class="seating-planner">
      <div class="unassigned-guests" data-drop-unassigned>
        <div class="panel-header">
          <div>
            <p class="eyebrow">Sem mesa</p>
            <h3>Convidados para distribuir</h3>
          </div>
          <span class="chip rose">${unassignedGuests.length}</span>
        </div>
        <div class="guest-token-list">
          ${unassignedGuests.map(renderGuestToken).join("") || '<p class="muted-note">Todos os convidados confirmados/pendentes ja estao em mesas.</p>'}
        </div>
      </div>
      <div class="room-stage" data-room-stage data-drop-stage>
        ${looseGuests.map(renderLooseGuestToken).join("")}
        ${sortedTables.map((table, index) => renderTableShape(table, index)).join("") || '<p class="muted-note">Adicione uma mesa para comecar a organizar o salao.</p>'}
      </div>
    </section>
  `;
}

function renderTableShape(table, index) {
  const assignedGuests = guestsForTable(table);
  const capacity = Number(table.capacity) || 0;
  const load = tableLoad(table);
  const position = tablePosition(table, index);
  const overCapacity = capacity > 0 && assignedGuests.length > capacity;
  const tableTitle = table.title || table.name;
  const tableSubtitle = table.title ? `${table.name} - ${load.used}/${capacity || "-"} lugares` : `${load.used}/${capacity || "-"} lugares`;
  const isExpanded = state.tablePlanner?.expandedTables?.includes(table.id);
  const visibleGuests = isExpanded ? assignedGuests : assignedGuests.slice(0, 3);
  const hiddenCount = Math.max(assignedGuests.length - visibleGuests.length, 0);
  return `
    <article class="table-node ${overCapacity ? "over-capacity" : ""}" style="left:${position.x}%;top:${position.y}%;" data-table-id="${table.id}" data-drop-table="${table.id}">
      <div class="table-move-handle" data-move-table="${table.id}">
        <div class="table-drawing" aria-hidden="true">
          ${renderSeatDots(capacity)}
          <div class="table-center">
            <strong>${escapeHtml(tableTitle)}</strong>
            <span>${escapeHtml(tableSubtitle)}</span>
          </div>
        </div>
      </div>
      <div class="table-node-footer">
        <span>${escapeHtml(table.area || "Area livre")}</span>
        ${actionButtons(table.id, "compact")}
      </div>
      <div class="table-guest-list ${isExpanded ? "expanded" : "collapsed"}">
        ${visibleGuests.map(renderGuestToken).join("") || '<span class="muted-note">Arraste convidados para ca.</span>'}
      </div>
      ${assignedGuests.length > 3 ? `
        <button class="table-guest-toggle" type="button" data-toggle-table-guests="${table.id}">
          ${isExpanded ? "Recolher nomes" : `Ver ${hiddenCount} nomes`}
        </button>
      ` : ""}
    </article>
  `;
}

function renderSeatDots(capacity) {
  const total = Math.min(Math.max(Number(capacity) || 4, 4), 12);
  return Array.from({ length: total }, (_, index) => {
    const angle = (360 / total) * index;
    return `<span class="seat-dot" style="--seat-angle:${angle}deg"></span>`;
  }).join("");
}

function renderGuestToken(guest) {
  return `<button class="guest-token" type="button" draggable="true" data-guest-id="${guest.id}" title="Arraste para uma mesa">${escapeHtml(guest.name || "Convidado")}</button>`;
}

function renderLooseGuestToken(guest) {
  const position = guestLoosePosition(guest) || { x: 4, y: 6 };
  return `<button class="guest-token loose-guest-token" type="button" draggable="true" data-guest-id="${guest.id}" style="left:${position.x}%;top:${position.y}%;" title="Arraste para uma mesa">${escapeHtml(guest.name || "Convidado")}</button>`;
}

function renderIdentity(items) {
  const fonts = items.filter((item) => item.section === "Tipografia");
  const colors = items.filter((item) => item.section === "Paleta de cores");
  return `
    <div class="identity-layout">
      <section class="identity-section">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Tipografia</p>
            <h3>Titulos, textos e outras fontes</h3>
          </div>
          <button class="secondary-action" type="button" data-add-identity-font>Adicionar tipografia</button>
        </div>
        <div class="font-card-grid">
          ${fonts.map((item) => `
            <article class="font-card">
              <header>
                <div>
                  <span class="chip sage">${escapeHtml(item.typographyUse || "Uso livre")}</span>
                  <h3 style="font-family:${fontFamilyFor(item)}">${escapeHtml(item.fontName || item.name)}</h3>
                </div>
                <span class="chip ${chipColor(item.status)}">${escapeHtml(item.status)}</span>
              </header>
              <p class="font-sample" style="font-family:${fontFamilyFor(item)}">${escapeHtml(state.wedding?.couple || "Regiana e Mauricio")}</p>
              <div class="item-meta">
                <span><strong>Funcao:</strong> ${escapeHtml(item.fontRole || "-")}</span>
                <span><strong>Estilo:</strong> ${escapeHtml(item.fontStyle || "-")}</span>
                <span><strong>Fonte:</strong> ${escapeHtml(item.fontName || "Outra fonte")}</span>
              </div>
            ${actionButtons(item.id)}
            </article>
          `).join("") || '<p class="muted-note">Nenhuma tipografia cadastrada.</p>'}
        </div>
      </section>

      <section class="identity-section">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Paleta de cores</p>
            <h3>Cores por grupo e finalidade</h3>
          </div>
          <button class="secondary-action" type="button" data-add-identity-group>Adicionar grupo</button>
        </div>
        ${renderColorGroups(colors)}
      </section>
    </div>
  `;
}

function renderColorGroups(colors) {
  const groups = [...new Set([...(state.identityColorGroups || []), ...colors.map((item) => item.group || "Outros")])];
  if (!groups.length) return '<p class="muted-note">Nenhum grupo cadastrado.</p>';
  return groups.map((group) => `
    <section class="color-group">
      <header>
        <h3>${escapeHtml(group)}</h3>
        <button class="secondary-action color-add-button" type="button" data-add-identity-color="${escapeHtml(group)}" aria-label="Adicionar cor em ${escapeHtml(group)}">
          ${iconSvg("plus")}
          <span>Cor</span>
        </button>
      </header>
      <div class="color-card-grid">
        ${colors.filter((item) => (item.group || "Outros") === group).map(renderColorCard).join("") || '<p class="muted-note">Nenhuma cor neste grupo.</p>'}
      </div>
    </section>
  `).join("");
}

function renderColorCard(item) {
  const hex = item.colorHex || item.color || "";
  const primary = item.usage || item.colorName || item.name || hex || "Cor";
  const colorName = item.colorName || item.name || "";
  return `
    <article class="color-card compact-color-card">
      <span class="color-preview" style="background:${escapeHtml(hex || "#ffffff")}"></span>
      <div class="color-card-info">
        ${primary ? `<strong>${escapeHtml(primary)}</strong>` : ""}
        ${colorName && colorName !== primary ? `<span>${escapeHtml(colorName)}</span>` : ""}
        ${hex && hex !== primary && hex !== colorName ? `<code>${escapeHtml(hex)}</code>` : ""}
      </div>
      ${actionButtons(item.id)}
    </article>
  `;
}

function actionButtons(id, extraClass = "") {
  return `
    <div class="item-actions icon-actions ${extraClass}">
      <button class="icon-button icon-only edit action-link" type="button" data-edit="${id}" title="Editar" aria-label="Editar">${iconSvg("edit")}</button>
      <button class="icon-button icon-only danger action-link" type="button" data-delete="${id}" title="Excluir" aria-label="Excluir">${iconSvg("trash")}</button>
    </div>
  `;
}

function renderCards(key, items) {
  if (!items.length) return emptyPanel();
  return `<div class="card-grid">${items.map((item) => {
    const title = item.title || item.name || item.song || item.description || item.category;
    const meta = Object.entries(item)
      .filter(([field, value]) => field !== "id" && field !== "title" && field !== "name" && field !== "song" && value !== "")
      .slice(0, 4);
    const load = key === "tables" ? tableLoad(item) : null;
    const swatch = item.color ? `<span class="color-swatch" style="background:${escapeHtml(item.color)}"></span>` : "";
    return `
      <article class="item-card">
        <header>
          <h3 class="item-title">${swatch}${escapeHtml(title)}</h3>
          <span class="chip ${moduleConfig[key].color}">${escapeHtml(primaryStatus(item))}</span>
        </header>
        ${load ? `<div><div class="progress-rail"><div class="progress-bar" style="width:${load.percent}%"></div></div><small>${load.used}/${load.capacity} lugares</small></div>` : ""}
        <div class="item-meta">${meta.map(([field, value]) => `<span><strong>${labelForField(field)}:</strong> ${formatValue(field, value)}</span>`).join("")}</div>
        ${actionButtons(item.id)}
      </article>
    `;
  }).join("")}</div>`;
}

function renderTable(key, items) {
  if (!items.length) return emptyPanel();
  const fields = tableFields(key);
  const sortedItems = sortTableItems(key, items);
  const sort = state.tableSort?.[key] || {};
  return `
    <div class="table-wrap">
      <table>
        <thead><tr>${fields.map((field) => `
          <th>
            <button class="table-sort-button ${sort.field === field ? "active" : ""}" type="button" data-sort-field="${field}" aria-label="Ordenar por ${escapeHtml(labelForField(field))}">
              <span>${escapeHtml(labelForField(field))}</span>
              <span class="sort-indicator">${sort.field === field ? (sort.direction === "asc" ? "&uarr;" : "&darr;") : ""}</span>
            </button>
          </th>
        `).join("")}<th>Acoes</th></tr></thead>
        <tbody>${sortedItems.map((item) => `
          <tr>
            ${fields.map((field) => `<td>${formatValue(field, tableCellValue(key, item, field))}</td>`).join("")}
            <td>${actionButtons(item.id)}</td>
          </tr>
        `).join("")}</tbody>
      </table>
    </div>
  `;
}

function tableFields(key) {
  const baseFields = moduleConfig[key].fields.map(([name]) => name).filter((name) => name !== "notes");
  if (key !== "guests") return baseFields;
  return [
    ...baseFields,
    ...(state.guestExtraColumns || []).map((column) => `extra:${column.id}`)
  ];
}

function tableCellValue(key, item, field) {
  if (key === "guests" && field.startsWith("extra:")) return item.extra?.[field.slice(6)] || "";
  return item[field];
}

function wireTablePlanner() {
  els.moduleView.querySelectorAll("[data-guest-id]").forEach((guest) => {
    guest.addEventListener("dragstart", startGuestDrag);
    guest.addEventListener("dragend", stopGuestDrag);
    guest.addEventListener("click", () => openGuestSeatDialog(guest.dataset.guestId));
  });
  els.moduleView.querySelectorAll("[data-drop-table]").forEach((target) => {
    target.addEventListener("dragover", allowGuestDrop);
    target.addEventListener("drop", (event) => {
      event.preventDefault();
      event.stopPropagation();
      assignGuestToTable(event.dataTransfer.getData("text/plain"), target.dataset.dropTable);
    });
  });
  els.moduleView.querySelector("[data-drop-stage]")?.addEventListener("dragover", allowGuestDrop);
  els.moduleView.querySelector("[data-drop-stage]")?.addEventListener("drop", (event) => {
    if (event.target.closest("[data-drop-table]")) return;
    event.preventDefault();
    placeGuestOnStage(event.dataTransfer.getData("text/plain"), event);
  });
  els.moduleView.querySelector("[data-drop-unassigned]")?.addEventListener("dragover", allowGuestDrop);
  els.moduleView.querySelector("[data-drop-unassigned]")?.addEventListener("drop", (event) => {
    event.preventDefault();
    event.stopPropagation();
    unassignGuest(event.dataTransfer.getData("text/plain"));
  });
  els.moduleView.querySelectorAll("[data-toggle-table-guests]").forEach((button) => {
    button.addEventListener("click", () => toggleTableGuests(button.dataset.toggleTableGuests));
  });
  els.moduleView.querySelectorAll("[data-move-table]").forEach((handle) => handle.addEventListener("pointerdown", startTableMove));
}

function toggleTableGuests(tableId) {
  const expanded = new Set(state.tablePlanner?.expandedTables || []);
  if (expanded.has(tableId)) expanded.delete(tableId);
  else expanded.add(tableId);
  state.tablePlanner = { ...(state.tablePlanner || {}), expandedTables: [...expanded] };
  saveState();
  renderModule("tables");
}

function startGuestDrag(event) {
  event.dataTransfer.setData("text/plain", event.currentTarget.dataset.guestId);
  event.dataTransfer.effectAllowed = "move";
  document.addEventListener("dragover", handleGuestDragAutoScroll);
  document.addEventListener("drop", stopGuestDrag, { once: true });
}

function stopGuestDrag() {
  guestDragScrollY = 0;
  if (guestDragScrollFrame) cancelAnimationFrame(guestDragScrollFrame);
  guestDragScrollFrame = null;
  document.removeEventListener("dragover", handleGuestDragAutoScroll);
}

function handleGuestDragAutoScroll(event) {
  const margin = 90;
  const speed = 18;
  if (event.clientY < margin) guestDragScrollY = -speed;
  else if (event.clientY > window.innerHeight - margin) guestDragScrollY = speed;
  else guestDragScrollY = 0;
  if (!guestDragScrollFrame) guestDragScrollFrame = requestAnimationFrame(scrollDuringGuestDrag);
}

function scrollDuringGuestDrag() {
  if (guestDragScrollY) window.scrollBy(0, guestDragScrollY);
  guestDragScrollFrame = guestDragScrollY ? requestAnimationFrame(scrollDuringGuestDrag) : null;
}

function allowGuestDrop(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

function assignGuestToTable(guestId, tableId) {
  const table = state.data.tables.find((entry) => entry.id === tableId);
  if (!guestId || !table) return;
  state.data.guests = state.data.guests.map((guest) => guest.id === guestId ? { ...guest, table: table.name, tableId: table.id, looseX: "", looseY: "" } : guest);
  saveState();
  renderModule("tables");
}

function unassignGuest(guestId) {
  if (!guestId) return;
  state.data.guests = state.data.guests.map((guest) => guest.id === guestId ? { ...guest, table: "", tableId: "", looseX: "", looseY: "" } : guest);
  saveState();
  renderModule("tables");
}

function placeGuestOnStage(guestId, event) {
  const stage = els.moduleView.querySelector("[data-room-stage]");
  if (!guestId || !stage) return;
  const rect = stage.getBoundingClientRect();
  const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 86);
  const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 92);
  state.data.guests = state.data.guests.map((guest) => guest.id === guestId ? {
    ...guest,
    table: "",
    tableId: "",
    looseX: Math.round(x),
    looseY: Math.round(y)
  } : guest);
  saveState();
  renderModule("tables");
}

function startTableMove(event) {
  if (event.button !== 0) return;
  const node = event.currentTarget.closest("[data-table-id]");
  const stage = els.moduleView.querySelector("[data-room-stage]");
  const table = state.data.tables.find((entry) => entry.id === node?.dataset.tableId);
  if (!node || !stage || !table) return;
  event.preventDefault();
  node.setPointerCapture(event.pointerId);
  const stageRect = stage.getBoundingClientRect();
  const nodeRect = node.getBoundingClientRect();
  const offsetX = event.clientX - nodeRect.left;
  const offsetY = event.clientY - nodeRect.top;
  const move = (moveEvent) => {
    const nextX = ((moveEvent.clientX - stageRect.left - offsetX) / stageRect.width) * 100;
    const nextY = ((moveEvent.clientY - stageRect.top - offsetY) / stageRect.height) * 100;
    const clampedX = clamp(nextX, 0, 82);
    const clampedY = clamp(nextY, 0, 76);
    node.style.left = `${clampedX}%`;
    node.style.top = `${clampedY}%`;
    table.x = Math.round(clampedX);
    table.y = Math.round(clampedY);
  };
  const stop = () => {
    node.releasePointerCapture(event.pointerId);
    node.removeEventListener("pointermove", move);
    node.removeEventListener("pointerup", stop);
    node.removeEventListener("pointercancel", stop);
    saveState();
  };
  node.addEventListener("pointermove", move);
  node.addEventListener("pointerup", stop);
  node.addEventListener("pointercancel", stop);
}

function openItemDialog(key, id = null) {
  const config = moduleConfig[key];
  const item = id ? state.data[key].find((entry) => entry.id === id) : {};
  editing = { key, id };
  document.querySelector("#itemDialogEyebrow").textContent = config.eyebrow;
  document.querySelector("#itemDialogTitle").textContent = id ? `Editar ${config.title}` : `Adicionar ${config.title}`;
  if (key === "identity") {
    if ((item || {}).section === "Paleta de cores") renderIdentityColorForm(item || {}, item.group || "Decoracao");
    else renderIdentityFontForm(item || {});
    els.itemDialog.showModal();
    return;
  }
  if (key === "vendors") {
    renderVendorForm(item || {});
    els.itemDialog.showModal();
    return;
  }
  if (key === "guests") {
    renderGuestForm(item || {});
    els.itemDialog.showModal();
    return;
  }
  if (key === "tables") {
    renderTableForm(item || {});
    els.itemDialog.showModal();
    return;
  }
  if (key === "music") {
    renderMusicForm(item || {});
    els.itemDialog.showModal();
    return;
  }
  els.itemFields.innerHTML = config.fields.map(([name, label, type, required, options]) => {
    const value = item?.[name] ?? "";
    if (type === "textarea") {
      return `<label class="full-field">${label}<textarea name="${name}" ${required ? "required" : ""}>${escapeHtml(value)}</textarea></label>`;
    }
    if (type === "select") {
      return `<label>${label}<select name="${name}" ${required ? "required" : ""}>${options.map((option) => `<option ${value === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select></label>`;
    }
    const inputValue = type === "color" ? (value || "#ffffff") : value;
    return `<label>${label}<input name="${name}" type="${type}" value="${escapeHtml(inputValue)}" ${required ? "required" : ""}></label>`;
  }).join("");
  els.itemDialog.showModal();
}

function openGuestSeatDialog(guestId) {
  const guest = state.data.guests.find((entry) => entry.id === guestId);
  if (!guest) return;
  editing = { key: "seatGuest", id: guestId };
  const currentTableId = guestAssignedTable(guest);
  const isLoose = !currentTableId && guestLoosePosition(guest);
  document.querySelector("#itemDialogEyebrow").textContent = "Distribuicao";
  document.querySelector("#itemDialogTitle").textContent = `Mover ${guest.name || "convidado"}`;
  els.itemFields.innerHTML = `
    <label class="full-field">Destino
      <select name="target">
        <option value="" ${!currentTableId && !isLoose ? "selected" : ""}>Sem mesa</option>
        <option value="loose" ${isLoose ? "selected" : ""}>Solto no mapa</option>
        ${state.data.tables.map((table) => `<option value="${table.id}" ${currentTableId === table.id ? "selected" : ""}>${escapeHtml(table.title ? `${table.name} - ${table.title}` : table.name)}</option>`).join("")}
      </select>
    </label>
  `;
  els.itemDialog.showModal();
}

function saveGuestSeat(form) {
  const target = String(form.get("target") || "");
  const guest = state.data.guests.find((entry) => entry.id === editing.id);
  if (!guest) return;
  if (!target) {
    state.data.guests = state.data.guests.map((entry) => entry.id === guest.id ? { ...entry, table: "", tableId: "", looseX: "", looseY: "" } : entry);
  } else if (target === "loose") {
    state.data.guests = state.data.guests.map((entry) => entry.id === guest.id ? {
      ...entry,
      table: "",
      tableId: "",
      looseX: entry.looseX || 4,
      looseY: entry.looseY || 6
    } : entry);
  } else {
    const table = state.data.tables.find((entry) => entry.id === target);
    if (table) {
      state.data.guests = state.data.guests.map((entry) => entry.id === guest.id ? { ...entry, table: table.name, tableId: table.id, looseX: "", looseY: "" } : entry);
    }
  }
  saveState();
}

function openIdentityFontDialog(id = null) {
  const item = id ? state.data.identity.find((entry) => entry.id === id) : {};
  editing = { key: "identity", id };
  document.querySelector("#itemDialogEyebrow").textContent = "Tipografia";
  document.querySelector("#itemDialogTitle").textContent = id ? "Editar tipografia" : "Adicionar tipografia";
  renderIdentityFontForm(item || {});
  els.itemDialog.showModal();
}

function renderVendorForm(item) {
  const selectedCategory = state.vendorCategories.includes(item.category) ? item.category : "Nova categoria";
  const customCategory = selectedCategory === "Nova categoria" ? item.category || "" : "";
  document.querySelector("#itemDialogEyebrow").textContent = "Contratos e contatos";
  document.querySelector("#itemDialogTitle").textContent = item.id ? "Editar fornecedor" : "Adicionar fornecedor";
  els.itemFields.innerHTML = `
    <label>Fornecedor<input name="name" required value="${escapeHtml(item.name || "")}" placeholder="Nome do fornecedor"></label>
    <label>Categoria
      <select name="category">
        ${state.vendorCategories.map((category) => `<option ${selectedCategory === category ? "selected" : ""}>${escapeHtml(category)}</option>`).join("")}
        <option ${selectedCategory === "Nova categoria" ? "selected" : ""}>Nova categoria</option>
      </select>
    </label>
    <label data-new-vendor-category>Nova categoria<input name="newCategory" value="${escapeHtml(customCategory)}" placeholder="Ex: Celebrante"></label>
    <label>WhatsApp / Contato<input name="contact" value="${escapeHtml(item.contact || "")}" placeholder="(00) 00000-0000"></label>
    <label>Instagram @<input name="instagramHandle" value="${escapeHtml(item.instagramHandle || "")}" placeholder="@nomedapagina"></label>
    <label>Valor<input name="value" type="number" min="0" step="100" value="${Number(item.value) || 0}"></label>
    <label>Status
      <select name="status">
        ${["Cotando", "Favorito", "Contratado", "Descartado"].map((option) => `<option ${item.status === option ? "selected" : ""}>${option}</option>`).join("")}
      </select>
    </label>
    <label>Contrato
      <select name="contract">
        ${["Sem contrato", "Recebido", "Assinado", "Pendente"].map((option) => `<option ${item.contract === option ? "selected" : ""}>${option}</option>`).join("")}
      </select>
    </label>
    <label class="full-field">Observacoes<textarea name="notes">${escapeHtml(item.notes || "")}</textarea></label>
  `;
  wireVendorForm();
}

function wireVendorForm() {
  const categorySelect = els.itemForm.elements.category;
  const newCategoryField = els.itemFields.querySelector("[data-new-vendor-category]");
  const refresh = () => newCategoryField.classList.toggle("hidden", categorySelect.value !== "Nova categoria");
  categorySelect.addEventListener("change", refresh);
  refresh();
}

function saveVendorItem(form) {
  let category = form.get("category");
  const newCategory = String(form.get("newCategory") || "").trim();
  if (category === "Nova categoria" && newCategory) category = newCategory;
  if (category && !state.vendorCategories.includes(category) && category !== "Nova categoria") state.vendorCategories.push(category);
  const item = {
    id: editing.id || uid(),
    name: String(form.get("name") || "").trim(),
    category,
    contact: form.get("contact") || "",
    instagramHandle: form.get("instagramHandle") || "",
    value: Number(form.get("value")) || 0,
    status: form.get("status") || "Cotando",
    contract: form.get("contract") || "Sem contrato",
    notes: form.get("notes") || ""
  };
  if (editing.id) state.data.vendors = state.data.vendors.map((entry) => entry.id === editing.id ? item : entry);
  else state.data.vendors.push(item);
  saveState();
}

function renderGuestForm(item) {
  const selectedGroup = item.group ? (state.guestGroups.includes(item.group) ? item.group : "Novo grupo") : "Amigos em comum";
  const customGroup = selectedGroup === "Novo grupo" ? item.group || "" : "";
  const selectedRole = item.role ? (state.guestRoles.includes(item.role) ? item.role : "Novo papel") : "Convidado comum";
  const customRole = selectedRole === "Novo papel" ? item.role || "" : "";
  document.querySelector("#itemDialogEyebrow").textContent = "Lista e RSVP";
  document.querySelector("#itemDialogTitle").textContent = item.id ? "Editar convidado" : "Adicionar convidado";
  els.itemFields.innerHTML = `
    <label class="full-field">Nome<input name="name" required value="${escapeHtml(item.name || "")}" placeholder="Nome do convidado"></label>
    <label>Grupo
      <select name="group" required>
        ${state.guestGroups.map((group) => `<option ${selectedGroup === group ? "selected" : ""}>${escapeHtml(group)}</option>`).join("")}
        <option ${selectedGroup === "Novo grupo" ? "selected" : ""}>Novo grupo</option>
      </select>
    </label>
    <label data-new-guest-group>Novo grupo<input name="newGroup" value="${escapeHtml(customGroup)}" placeholder="Ex: Familia da madrinha"></label>
    <label>Papel
      <select name="role" required>
        ${state.guestRoles.map((role) => `<option ${selectedRole === role ? "selected" : ""}>${escapeHtml(role)}</option>`).join("")}
        <option ${selectedRole === "Novo papel" ? "selected" : ""}>Novo papel</option>
      </select>
    </label>
    <label data-new-guest-role>Novo papel<input name="newRole" value="${escapeHtml(customRole)}" placeholder="Ex: Celebrante"></label>
    <label>Tipo
      <select name="guestType" required>
        ${["Adulto", "Crianca"].map((option) => `<option ${((item.guestType || "Adulto") === option) ? "selected" : ""}>${option}</option>`).join("")}
      </select>
    </label>
    <label>RSVP
      <select name="rsvp" required>
        ${RSVP_STATUSES.map((option) => `<option ${normalizeGuestRsvp(item.rsvp) === option ? "selected" : ""}>${option}</option>`).join("")}
      </select>
    </label>
    <label>WhatsApp<input name="phone" value="${escapeHtml(item.phone || "")}" placeholder="(00) 00000-0000"></label>
    ${guestExtraFields(item)}
    <label class="full-field">Observacoes<textarea name="notes">${escapeHtml(item.notes || "")}</textarea></label>
  `;
  wireGuestForm();
}

function openGuestColumnDialog() {
  editing = { key: "guestColumn", id: null };
  document.querySelector("#itemDialogEyebrow").textContent = "Lista e RSVP";
  document.querySelector("#itemDialogTitle").textContent = "Adicionar coluna";
  els.itemFields.innerHTML = `
    <label class="full-field">Nome da coluna<input name="columnLabel" required placeholder="Ex: Restricao alimentar"></label>
  `;
  els.itemDialog.showModal();
}

function saveGuestColumn(form) {
  const label = String(form.get("columnLabel") || "").trim();
  if (!label) return;
  if ((state.guestExtraColumns || []).some((column) => normalizeHeader(column.label) === normalizeHeader(label))) return;
  const id = uniqueGuestColumnId(label);
  state.guestExtraColumns = [...(state.guestExtraColumns || []), { id, label }];
  state.data.guests = state.data.guests.map((guest) => ({
    ...guest,
    extra: { ...(guest.extra || {}), [id]: "" }
  }));
  saveState();
}

function guestExtraFields(item) {
  const columns = state.guestExtraColumns || [];
  if (!columns.length) return "";
  return columns.map((column) => `
    <label>${escapeHtml(column.label)}
      <input name="extra_${escapeHtml(column.id)}" value="${escapeHtml(item.extra?.[column.id] || "")}" placeholder="${escapeHtml(column.label)}">
    </label>
  `).join("");
}

function uniqueGuestColumnId(label) {
  const base = slugify(label) || `coluna_${uid()}`;
  const existing = new Set((state.guestExtraColumns || []).map((column) => column.id));
  let id = base;
  let count = 2;
  while (existing.has(id)) {
    id = `${base}_${count}`;
    count += 1;
  }
  return id;
}

function wireGuestForm() {
  const groupSelect = els.itemForm.elements.group;
  const roleSelect = els.itemForm.elements.role;
  const newGroupField = els.itemFields.querySelector("[data-new-guest-group]");
  const newRoleField = els.itemFields.querySelector("[data-new-guest-role]");
  const refreshGroup = () => newGroupField.classList.toggle("hidden", groupSelect.value !== "Novo grupo");
  const refreshRole = () => newRoleField.classList.toggle("hidden", roleSelect.value !== "Novo papel");
  groupSelect.addEventListener("change", refreshGroup);
  roleSelect.addEventListener("change", refreshRole);
  refreshGroup();
  refreshRole();
}

function saveGuestItem(form) {
  let group = String(form.get("group") || "").trim();
  let role = String(form.get("role") || "").trim();
  const newGroup = String(form.get("newGroup") || "").trim();
  const newRole = String(form.get("newRole") || "").trim();
  if (group === "Novo grupo" && newGroup) group = newGroup;
  if (role === "Novo papel" && newRole) role = newRole;
  if (!group || group === "Novo grupo") group = "Amigos em comum";
  if (!role || role === "Novo papel") role = "Convidado comum";
  addGuestOption("guestGroups", group);
  addGuestOption("guestRoles", role);
  const previous = editing.id ? state.data.guests.find((entry) => entry.id === editing.id) : {};
  const extra = {};
  (state.guestExtraColumns || []).forEach((column) => {
    extra[column.id] = String(form.get(`extra_${column.id}`) || "").trim();
  });
  const item = {
    id: editing.id || uid(),
    name: String(form.get("name") || "").trim(),
    group,
    role,
    guestType: form.get("guestType") || "Adulto",
    rsvp: normalizeGuestRsvp(form.get("rsvp")),
    table: previous?.table || "",
    tableId: previous?.tableId || "",
    looseX: previous?.looseX || "",
    looseY: previous?.looseY || "",
    phone: form.get("phone") || "",
    extra,
    notes: form.get("notes") || ""
  };
  if (editing.id) state.data.guests = state.data.guests.map((entry) => entry.id === editing.id ? item : entry);
  else state.data.guests.push(item);
  saveState();
}

function renderMusicForm(item) {
  const selectedMoment = item.moment ? (state.musicMoments.includes(item.moment) ? item.moment : "Novo momento") : "Entrada";
  const customMoment = selectedMoment === "Novo momento" ? item.moment || "" : "";
  document.querySelector("#itemDialogEyebrow").textContent = "Momentos";
  document.querySelector("#itemDialogTitle").textContent = item.id ? "Editar musica" : "Adicionar musica";
  els.itemFields.innerHTML = `
    <label class="full-field">Musica<input name="song" required value="${escapeHtml(item.song || "")}" placeholder="Nome da musica"></label>
    <label>Artista<input name="artist" value="${escapeHtml(item.artist || "")}" placeholder="Artista"></label>
    <label>Link da musica<input name="link" type="url" value="${escapeHtml(item.link || "")}" placeholder="https://"></label>
    <label>Momento
      <select name="moment" required>
        ${state.musicMoments.map((moment) => `<option ${selectedMoment === moment ? "selected" : ""}>${escapeHtml(moment)}</option>`).join("")}
        <option ${selectedMoment === "Novo momento" ? "selected" : ""}>Novo momento</option>
      </select>
    </label>
    <label data-new-music-moment>Novo momento<input name="newMoment" value="${escapeHtml(customMoment)}" placeholder="Ex: Corte do bolo"></label>
    <label>Status
      <select name="status" required>
        ${["Sugestao", "Aprovada", "Enviar para DJ", "Confirmada"].map((status) => `<option ${(item.status || "Sugestao") === status ? "selected" : ""}>${escapeHtml(status)}</option>`).join("")}
      </select>
    </label>
    <label class="full-field">Observacoes<textarea name="notes">${escapeHtml(item.notes || "")}</textarea></label>
  `;
  wireMusicForm();
}

function wireMusicForm() {
  const momentSelect = els.itemForm.elements.moment;
  const newMomentField = els.itemFields.querySelector("[data-new-music-moment]");
  const refresh = () => newMomentField.classList.toggle("hidden", momentSelect.value !== "Novo momento");
  momentSelect.addEventListener("change", refresh);
  refresh();
}

function saveMusicItem(form) {
  let moment = String(form.get("moment") || "").trim();
  const newMoment = String(form.get("newMoment") || "").trim();
  if (moment === "Novo momento" && newMoment) moment = newMoment;
  if (!moment || moment === "Novo momento") moment = "Entrada";
  if (!state.musicMoments.includes(moment)) state.musicMoments.push(moment);
  const item = {
    id: editing.id || uid(),
    song: String(form.get("song") || "").trim(),
    artist: String(form.get("artist") || "").trim(),
    link: String(form.get("link") || "").trim(),
    moment,
    status: form.get("status") || "Sugestao",
    notes: form.get("notes") || ""
  };
  if (editing.id) state.data.music = state.data.music.map((entry) => entry.id === editing.id ? item : entry);
  else state.data.music.push(item);
  saveState();
}

function renderTableForm(item) {
  const tableName = item.name || nextTableName();
  const selectedArea = state.guestGroups.includes(item.area) ? item.area : "";
  document.querySelector("#itemDialogEyebrow").textContent = "Distribuicao";
  document.querySelector("#itemDialogTitle").textContent = item.id ? "Editar mesa" : "Adicionar mesa";
  els.itemFields.innerHTML = `
    <label>Numero da mesa<input name="name" required value="${escapeHtml(tableName)}" placeholder="Mesa 1"></label>
    <label>Capacidade<input name="capacity" type="number" min="1" value="${Number(item.capacity) || 8}"></label>
    <label>Area
      <select name="area">
        <option value="" ${selectedArea ? "" : "selected"}>Sem area definida</option>
        ${state.guestGroups.map((group) => `<option value="${escapeHtml(group)}" ${selectedArea === group ? "selected" : ""}>${escapeHtml(group)}</option>`).join("")}
      </select>
    </label>
    <label>Titulo opcional<input name="title" value="${escapeHtml(item.title || "")}" placeholder="Ex: Familia da noiva"></label>
    <label class="full-field">Observacoes<textarea name="notes">${escapeHtml(item.notes || "")}</textarea></label>
  `;
}

function saveTableItem(form) {
  const existing = editing.id ? state.data.tables.find((entry) => entry.id === editing.id) : null;
  const item = {
    id: editing.id || uid(),
    name: String(form.get("name") || "").trim() || nextTableName(editing.id),
    title: String(form.get("title") || "").trim(),
    capacity: Number(form.get("capacity")) || 1,
    area: String(form.get("area") || "").trim(),
    notes: form.get("notes") || ""
  };
  const fallback = tablePosition(existing || item, state.data.tables.length);
  item.x = Number(existing?.x ?? fallback.x);
  item.y = Number(existing?.y ?? fallback.y);
  state.data.guests = state.data.guests.map((guest) => {
    const wasInTable = guest.tableId === item.id || (!guest.tableId && existing?.name && guest.table === existing.name);
    return wasInTable ? { ...guest, table: item.name, tableId: item.id } : guest;
  });
  if (editing.id) state.data.tables = state.data.tables.map((entry) => entry.id === editing.id ? item : entry);
  else state.data.tables.push(item);
  saveState();
}

function openIdentityColorDialog(group, id = null) {
  const item = id ? state.data.identity.find((entry) => entry.id === id) : {};
  editing = { key: "identity", id };
  document.querySelector("#itemDialogEyebrow").textContent = "Paleta de cores";
  document.querySelector("#itemDialogTitle").textContent = id ? "Editar cor" : `Adicionar cor em ${group}`;
  renderIdentityColorForm(item || {}, group);
  els.itemDialog.showModal();
}

function openIdentityGroupDialog() {
  editing = { key: "identityGroup", id: null };
  document.querySelector("#itemDialogEyebrow").textContent = "Paleta de cores";
  document.querySelector("#itemDialogTitle").textContent = "Adicionar grupo";
  els.itemFields.innerHTML = `
    <label class="full-field">Nome do grupo<input name="groupName" required placeholder="Ex: Madrinhas"></label>
  `;
  els.itemDialog.showModal();
}

function renderIdentityFontForm(item) {
  const knownFonts = fontOptions();
  const selectedFont = item.fontName && knownFonts.includes(item.fontName) ? item.fontName : "Outra fonte";
  const customFont = item.fontName && selectedFont === "Outra fonte" ? item.fontName : "";
  els.itemFields.innerHTML = `
    <input type="hidden" name="section" value="Tipografia">
    <label>Uso da fonte
      <select name="typographyUse">
        ${["Convite geral", "Convite casamento", "Decoracao", "Menus e papelaria", "Site dos noivos", "Sinalizacao", "Outro"].map((option) => `<option ${item.typographyUse === option ? "selected" : ""}>${option}</option>`).join("")}
      </select>
    </label>
    <label>Funcao da fonte
      <select name="fontRole">
        ${["Titulos", "Textos", "Destaques", "Assinatura", "Outra"].map((option) => `<option ${item.fontRole === option ? "selected" : ""}>${option}</option>`).join("")}
      </select>
    </label>
    <label>Estilo visual
      <select name="fontStyle">
        ${["Classica", "Moderna", "Romantica", "Minimalista", "Manuscrita", "Serifada", "Sem serifa", "Outra"].map((option) => `<option ${item.fontStyle === option ? "selected" : ""}>${option}</option>`).join("")}
      </select>
    </label>
    <label>Nome da fonte
      <select name="fontName">
        ${knownFonts.map((font) => `<option ${selectedFont === font ? "selected" : ""}>${escapeHtml(font)}</option>`).join("")}
        <option ${selectedFont === "Outra fonte" ? "selected" : ""}>Outra fonte</option>
      </select>
      <small>As fontes da lista carregam via Google Fonts quando houver internet.</small>
    </label>
    <label data-custom-font-field>Outra fonte
      <input name="customFontName" value="${escapeHtml(customFont)}" placeholder="Digite o nome exato da fonte">
      <small>Funciona se a fonte existir no navegador ou no computador.</small>
    </label>
    <div class="font-live-preview full-field">
      <span>Preview</span>
      <p data-font-preview>${escapeHtml(state.wedding?.couple || "Regiana e Mauricio")}</p>
    </div>
    <label>Status
      <select name="status">
        ${["Ideia", "Escolhido", "Comprar", "Finalizado"].map((option) => `<option ${item.status === option ? "selected" : ""}>${option}</option>`).join("")}
      </select>
    </label>
    <label class="full-field">Observacoes<textarea name="notes">${escapeHtml(item.notes || "")}</textarea></label>
  `;
  wireIdentityFontFields();
}

function wireIdentityFontFields() {
  const fontSelect = els.itemForm.elements.fontName;
  const customField = els.itemFields.querySelector("[data-custom-font-field]");
  const customInput = els.itemForm.elements.customFontName;
  const styleSelect = els.itemForm.elements.fontStyle;
  const preview = els.itemFields.querySelector("[data-font-preview]");
  const refresh = () => {
    const usesCustom = fontSelect.value === "Outra fonte";
    customField.classList.toggle("hidden", !usesCustom);
    const fontName = usesCustom ? customInput.value : fontSelect.value;
    preview.style.fontFamily = fontFamilyFor({ fontName, fontStyle: styleSelect.value });
  };
  fontSelect.addEventListener("change", refresh);
  customInput.addEventListener("input", refresh);
  styleSelect.addEventListener("change", refresh);
  refresh();
}

function renderIdentityColorForm(item, group) {
  const color = normalizeHexColor(item.colorHex || item.color) || "#EFBBCF";
  els.itemFields.innerHTML = `
    <input type="hidden" name="section" value="Paleta de cores">
    <input type="hidden" name="group" value="${escapeHtml(group)}">
    <label>Onde sera usada<input name="usage" value="${escapeHtml(item.usage || "")}" placeholder="Ex: vestido, terno, gravata"></label>
    <label>Nome da cor<input name="colorName" required value="${escapeHtml(item.colorName || "")}" placeholder="Ex: Rosa queimado"></label>
    <label>Codigo HEX<input name="colorHex" value="${escapeHtml(color)}" placeholder="#EFBBCF" maxlength="7"></label>
    <label>Seletor de cor<input name="color" type="color" value="${escapeHtml(color)}"></label>
    <label>Status
      <select name="status">
        ${["Ideia", "Escolhido", "Comprar", "Finalizado"].map((option) => `<option ${item.status === option ? "selected" : ""}>${option}</option>`).join("")}
      </select>
    </label>
    <label class="full-field">Observacoes<textarea name="notes">${escapeHtml(item.notes || "")}</textarea></label>
  `;
  wireIdentityColorFields();
}

function wireIdentityColorFields() {
  const colorInput = els.itemForm.elements.color;
  const hexInput = els.itemForm.elements.colorHex;
  colorInput.addEventListener("input", () => {
    hexInput.value = colorInput.value.toUpperCase();
  });
  hexInput.addEventListener("input", () => {
    const normalized = normalizeHexColor(hexInput.value);
    if (normalized) {
      colorInput.value = normalized;
      hexInput.value = normalized;
    }
  });
}

function saveIdentityItem(form) {
  const section = form.get("section");
  const item = { id: editing.id || uid(), section, status: form.get("status") || "Ideia", notes: form.get("notes") || "" };
  if (section === "Tipografia") {
    item.typographyUse = form.get("typographyUse") || "Convite casamento";
    item.fontRole = form.get("fontRole") || "Titulos";
    item.fontStyle = form.get("fontStyle") || "Outra";
    item.fontName = String(form.get("fontName") === "Outra fonte" ? form.get("customFontName") : form.get("fontName") || "").trim();
    item.name = item.fontName || item.fontRole;
  } else {
    item.group = form.get("group") || "Decoracao";
    item.colorName = String(form.get("colorName") || "").trim();
    item.usage = String(form.get("usage") || "").trim();
    item.colorHex = normalizeHexColor(form.get("colorHex") || form.get("color")) || "#FFFFFF";
    item.color = item.colorHex;
    item.name = item.colorName || item.colorHex;
    if (!state.identityColorGroups.includes(item.group)) state.identityColorGroups.push(item.group);
  }
  normalizeIdentityItem(item);
  if (editing.id) {
    state.data.identity = state.data.identity.map((entry) => entry.id === editing.id ? item : entry);
  } else {
    state.data.identity.push(item);
  }
  saveState();
}

function deleteItem(key, id) {
  if (!confirm("Excluir este item?")) return;
  state.data[key] = state.data[key].filter((item) => item.id !== id);
  saveState();
  render();
}

function toggleChecklistTask(id) {
  state.data.checklist = state.data.checklist.map((item) => {
    if (item.id !== id) return item;
    return {
      ...item,
      status: item.status === "Concluido" ? "Pendente" : "Concluido"
    };
  });
  saveState();
  render();
}

function updateFilter(key, field, value, options = {}) {
  state.filters[key] = { ...(state.filters[key] || {}), [field]: value };
  saveState();
  renderModule(key);
  if (options.restoreQueryFocus) {
    restoreFilterQueryFocus(options.cursor);
  }
}

function restoreFilterQueryFocus(cursor) {
  const input = els.moduleView.querySelector("[data-filter-query]");
  if (!input) return;
  input.focus({ preventScroll: true });
  const position = Math.min(Number(cursor) || input.value.length, input.value.length);
  try {
    input.setSelectionRange(position, position);
  } catch {
    // Some browsers may not support selection on search inputs.
  }
}

function updateTableSort(key, field) {
  const current = state.tableSort?.[key] || {};
  const direction = current.field === field && current.direction === "asc" ? "desc" : "asc";
  state.tableSort = { ...(state.tableSort || {}), [key]: { field, direction } };
  saveState();
  renderModule(key);
}

function filteredItems(key) {
  const filters = state.filters[key] || {};
  const query = (filters.query || "").toLowerCase().trim();
  return (state.data[key] || []).filter((item) => {
    const matchesQuery = !query || Object.values(item).join(" ").toLowerCase().includes(query);
    const matchesFilters = Object.entries(filters).every(([field, value]) => field === "query" || !value || item[field] === value);
    return matchesQuery && matchesFilters;
  });
}

function sortTableItems(key, items) {
  const sort = state.tableSort?.[key];
  if (!sort?.field) return items;
  const direction = sort.direction === "desc" ? -1 : 1;
  return [...items].sort((a, b) => compareTableValues(tableCellValue(key, a, sort.field), tableCellValue(key, b, sort.field)) * direction);
}

function compareTableValues(a, b) {
  const valueA = normalizeSortValue(a);
  const valueB = normalizeSortValue(b);
  if (typeof valueA === "number" && typeof valueB === "number") return valueA - valueB;
  return String(valueA).localeCompare(String(valueB), "pt-BR", { sensitivity: "base", numeric: true });
}

function normalizeSortValue(value) {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "number") return value;
  const text = String(value).trim();
  const number = Number(text.replace(/[^\d,-]/g, "").replace(",", "."));
  if (text && !Number.isNaN(number) && /[\d]/.test(text) && /^[R$\s\d.,-]+$/.test(text)) return number;
  return text;
}

function exportCsv(key) {
  if (key === "weddingParty") {
    exportWeddingPartyCsv();
    return;
  }
  const items = sortTableItems(key, filteredItems(key));
  const fields = exportFields(key);
  const labels = fields.map(labelForField);
  const rows = [labels, ...items.map((item) => fields.map((field) => tableCellValue(key, item, field) ?? ""))];
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${key}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function exportWeddingPartyCsv() {
  const rows = [
    ["Nome", "Papel", "Grupo", "Tipo", "RSVP", "WhatsApp"],
    ...[...weddingPartyGuests("Madrinha"), ...weddingPartyGuests("Padrinho")].map((guest) => [
      guest.name || "",
      guest.role || "",
      guest.group || "",
      guest.guestType || "",
      guest.rsvp || "",
      guest.phone || ""
    ])
  ];
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "padrinhos-madrinhas.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function exportFields(key) {
  const baseFields = moduleConfig[key].fields.map(([name]) => name);
  if (key !== "guests") return baseFields;
  return [
    ...baseFields,
    ...(state.guestExtraColumns || []).map((column) => `extra:${column.id}`)
  ];
}

function importGuestsCsv(event) {
  const file = event.target.files[0];
  if (!file) return;
  file.text().then((text) => {
    const rows = parseDelimitedText(text);
    const [headerRow, ...dataRows] = rows.filter((row) => row.some((cell) => String(cell).trim()));
    if (!headerRow) return;
    const headers = headerRow.map(normalizeHeader);
    const imported = dataRows
      .map((cells) => readGuestImportRow(headers, cells))
      .filter((row) => row.name)
      .map((row) => {
      const group = normalizeGuestGroup(row.group || "Amigos em comum");
      const role = normalizeGuestRole(row.role || "Convidado comum");
      addGuestOption("guestGroups", group);
      addGuestOption("guestRoles", role);
      return {
        id: uid(),
        name: row.name,
        group,
        role,
        guestType: row.guestType || "Adulto",
        rsvp: normalizeGuestRsvp(row.rsvp),
        table: "",
        phone: row.phone || "",
        extra: row.extra || {},
        notes: row.notes || ""
      };
    });
    state.data.guests.push(...imported);
    saveState();
    render();
  });
}

function parseDelimitedText(text) {
  const delimiter = detectDelimiter(text);
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (!inQuotes && char === delimiter) {
      row.push(cell.trim());
      cell = "";
      continue;
    }
    if (!inQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    cell += char;
  }
  if (cell || row.length) {
    row.push(cell.trim());
    rows.push(row);
  }
  return rows;
}

function detectDelimiter(text) {
  const firstLine = text.split(/\r?\n/).find((line) => line.trim()) || "";
  const delimiters = [",", ";", "\t"];
  return delimiters
    .map((delimiter) => ({ delimiter, count: countDelimiter(firstLine, delimiter) }))
    .sort((a, b) => b.count - a.count)[0].delimiter;
}

function countDelimiter(line, delimiter) {
  let count = 0;
  let inQuotes = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') inQuotes = !inQuotes;
    if (!inQuotes && char === delimiter) count += 1;
  }
  return count;
}

function readGuestImportRow(headers, cells) {
  const row = Object.fromEntries(headers.map((header, index) => [header, cells[index] || ""]));
  const extra = {};
  (state.guestExtraColumns || []).forEach((column) => {
    extra[column.id] = firstImportValue(row, [column.label, column.id]);
  });
  return {
    name: firstImportValue(row, ["name", "nome", "convidado", "convidada", "nome completo", "guest"]),
    group: firstImportValue(row, ["group", "grupo", "familia", "origem", "categoria"]),
    role: firstImportValue(row, ["role", "papel", "funcao", "cargo", "participacao"]),
    guestType: normalizeGuestType(firstImportValue(row, ["tipo", "tipo de convidado", "adulto crianca", "adulto criança", "idade", "guest type"])),
    rsvp: firstImportValue(row, ["rsvp", "presenca", "presente", "confirmacao", "status"]),
    phone: firstImportValue(row, ["phone", "telefone", "celular", "whatsapp", "zap", "contato"]),
    extra,
    notes: firstImportValue(row, ["notes", "observacoes", "observacao", "obs", "notas", "comentarios"])
  };
}

function firstImportValue(row, aliases) {
  for (const alias of aliases) {
    const value = row[normalizeHeader(alias)];
    if (value) return value;
  }
  return "";
}

function normalizeHeader(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function slugify(value) {
  return normalizeHeader(value).replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return normalizeState(structuredClone(seedState));
  try {
    const parsed = JSON.parse(saved);
    const merged = {
      ...structuredClone(seedState),
      ...parsed,
      checklistDefaultsVersion: parsed.checklistDefaultsVersion || 0,
      data: {
        ...structuredClone(seedState).data,
        ...(parsed.data || {})
      }
    };
    return normalizeState(merged);
  } catch {
    return normalizeState(structuredClone(seedState));
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  queueCloudSave();
}

function initializeBudgetDefaults() {
  state.data.budget = mergeDefaultBudgetItems(state.data.budget, state.wedding?.budget);
  state.budgetDefaultsVersion = seedState.budgetDefaultsVersion;
}

function defaultBudgetItems(totalBudget = 0) {
  return DEFAULT_BUDGET_CATEGORIES.map(([category, share, suggestedBase, actualBase]) => ({
    id: uid(),
    category,
    share,
    suggestedBase,
    actualBase,
    planned: scaledBudgetValue(suggestedBase, totalBudget),
    actual: scaledBudgetValue(actualBase, totalBudget),
    status: "Planejado",
    notes: ""
  }));
}

function mergeDefaultBudgetItems(items = [], totalBudget = 0) {
  const currentItems = Array.isArray(items) ? items : [];
  const mergedItems = currentItems.map((item) => mergeBudgetDefaultsIntoItem(item, totalBudget));
  const seen = new Set(mergedItems.map((item) => normalizeHeader(item.category)));
  const missingDefaults = defaultBudgetItems(totalBudget).filter((item) => !seen.has(normalizeHeader(item.category)));
  return [...mergedItems, ...missingDefaults];
}

function mergeBudgetDefaultsIntoItem(item, totalBudget = 0) {
  const defaults = defaultBudgetForCategory(item.category);
  if (!defaults) return item;
  const planned = scaledBudgetValue(defaults.suggestedBase, totalBudget);
  const actual = Number(item.actual) || 0;
  return {
    ...item,
    share: Number(item.share) || defaults.share,
    suggestedBase: Number(item.suggestedBase) || defaults.suggestedBase,
    actualBase: Number(item.actualBase) || defaults.actualBase,
    planned,
    actual: actual || scaledBudgetValue(defaults.actualBase, totalBudget)
  };
}

function defaultBudgetForCategory(category) {
  const found = DEFAULT_BUDGET_CATEGORIES.find(([name]) => normalizeHeader(name) === normalizeHeader(category));
  if (!found) return null;
  const [name, share, suggestedBase, actualBase] = found;
  return { name, share, suggestedBase, actualBase };
}

function hasMissingDefaultBudgetItems(items = []) {
  const seen = new Set((items || []).map((item) => normalizeHeader(item.category)));
  return DEFAULT_BUDGET_CATEGORIES.some(([category]) => !seen.has(normalizeHeader(category)));
}

function scaledBudgetValue(value, totalBudget = 0) {
  const budget = Number(totalBudget) || 0;
  if (!budget) return 0;
  return Math.round((budget * Number(value || 0)) / DEFAULT_BUDGET_BASE);
}

function syncBudgetSuggestions() {
  const budget = Number(state.wedding?.budget) || 0;
  state.data.budget = state.data.budget.map((item) => {
    const defaults = defaultBudgetForCategory(item.category);
    return {
      ...item,
      planned: defaults
        ? scaledBudgetValue(defaults.suggestedBase, budget)
        : Number(item.share)
          ? Math.round((budget * Number(item.share)) / 100)
          : Number(item.planned) || 0
    };
  });
}

function paidPaymentsTotal() {
  return state.data.payments
    .filter((payment) => payment.status === "Pago")
    .reduce((total, payment) => total + (Number(payment.amount) || 0), 0);
}

function defaultChecklistTasks() {
  const tasks = [
    ["12 meses", "Pesquisar fornecedores", "Fornecedores", "Alta"],
    ["12 meses", "Pesquisar vestido da noiva", "Trajes", "Alta"],
    ["12 meses", "Referencias visuais", "Identidade", "Media"],
    ["12 meses", "Contratar assessoria", "Cerimonial", "Alta"],
    ["12 meses", "Definir a data do casamento", "Planejamento", "Alta"],
    ["12 meses", "Definir budget total", "Orcamento", "Alta"],
    ["12 meses", "Definir estilo do casamento", "Identidade", "Media"],
    ["12 meses", "Reservar local da cerimonia", "Local", "Alta"],
    ["12 meses", "Reservar local da recepcao", "Local", "Alta"],
    ["12 meses", "Criar e-mail do casamento", "Organizacao", "Media"],
    ["12 meses", "Rascunho da lista de convidados", "Convidados", "Media"],

    ["10 meses", "Pesquisar local para lua de mel", "Lua de mel", "Media"],
    ["10 meses", "Contratar decoracao", "Decoracao", "Alta"],
    ["10 meses", "Contratar DJ/banda", "Musica", "Alta"],
    ["10 meses", "Contratar filmagem", "Imagem", "Alta"],
    ["10 meses", "Contratar fotografia", "Imagem", "Alta"],
    ["10 meses", "Contratar buffet/gastronomia", "Gastronomia", "Alta"],
    ["10 meses", "Contratar identidade visual", "Identidade", "Media"],
    ["10 meses", "Contratar celebrante", "Cerimonia", "Alta"],

    ["9 meses", "Pesquisar/planejar hospedagem para convidados", "Hospedagem", "Media"],
    ["9 meses", "Pesquisar hoteis para convidados", "Hospedagem", "Baixa"],
    ["9 meses", "Pesquisar/planejar transporte", "Transporte", "Media"],
    ["9 meses", "Definir madrinhas e padrinhos", "Cerimonia", "Alta"],
    ["9 meses", "Definir pajens e daminhas", "Cerimonia", "Media"],
    ["9 meses", "Definir paleta de cores", "Identidade", "Media"],
    ["9 meses", "Definir traje do noivo", "Trajes", "Media"],
    ["9 meses", "Contratar/comprar traje do noivo", "Trajes", "Alta"],
    ["9 meses", "Ajustar lista de convidados", "Convidados", "Media"],

    ["8 meses", "Pesquisar/planejar lua de mel", "Lua de mel", "Baixa"],
    ["8 meses", "Definir o traje das madrinhas", "Trajes", "Media"],
    ["8 meses", "Contratar bar de drinks", "Bar", "Media"],
    ["8 meses", "Contratar bolo", "Doces", "Media"],
    ["8 meses", "Contratar doces", "Doces", "Media"],
    ["8 meses", "Enviar o save the date", "Papelaria", "Alta"],
    ["8 meses", "Iniciar o site do casamento", "Site", "Media"],
    ["8 meses", "Agendar curso de noivos", "Cerimonia", "Media"],

    ["6 meses", "Planejar despedida", "Eventos", "Media"],
    ["6 meses", "Definir o destino da lua de mel", "Lua de mel", "Media"],
    ["6 meses", "Definir as musicas", "Musica", "Media"],
    ["6 meses", "Comprar as aliancas", "Aliancas", "Alta"],
    ["6 meses", "Contratar maquiagem e cabelo", "Beleza", "Alta"],
    ["6 meses", "Contratar seguranca", "Operacao", "Media"],
    ["6 meses", "Contratar/comprar lembrancinhas", "Lembrancas", "Alta"],
    ["6 meses", "Convidar os padrinhos", "Cerimonia", "Alta"],
    ["6 meses", "Fazer degustacao do buffet", "Gastronomia", "Media"],
    ["6 meses", "Documentacao para casamento civil", "Documentos", "Alta"],
    ["6 meses", "Montar lista de presentes", "Presentes", "Media"],

    ["4 meses", "Contratar convites e papelaria", "Papelaria", "Alta"],
    ["4 meses", "Encomendar chinelos ou lembrancas", "Lembrancas", "Baixa"],
    ["4 meses", "Contratar/comprar acessorios", "Acessorios", "Baixa"],
    ["4 meses", "Porta aliancas", "Cerimonia", "Baixa"],
    ["4 meses", "Comprar passagens da lua de mel", "Lua de mel", "Alta"],
    ["4 meses", "Comprar sapatos da noiva", "Trajes", "Media"],
    ["4 meses", "Fazer ensaio de fotos", "Imagem", "Media"],
    ["4 meses", "Finalizar lista de convidados", "Convidados", "Alta"],
    ["4 meses", "Reservar hotel para convidados", "Hospedagem", "Alta"],

    ["3 meses", "Enviar convites", "Papelaria", "Alta"],
    ["3 meses", "Definir menu final", "Gastronomia", "Media"],
    ["3 meses", "Comprar bebidas extras", "Bar", "Media"],
    ["3 meses", "Fazer prova do vestido", "Trajes", "Alta"],
    ["3 meses", "Confirmar decoracao floral", "Decoracao", "Media"],
    ["3 meses", "Organizar documentos da cerimonia", "Documentos", "Alta"],
    ["3 meses", "Definir layout das mesas", "Mesas", "Media"],
    ["3 meses", "Revisar contratos", "Contratos", "Alta"],
    ["3 meses", "Planejar cronograma do dia", "Cronograma", "Media"],
    ["3 meses", "Agendar reuniao com fornecedores", "Fornecedores", "Media"],

    ["2 meses", "Confirmar presenca dos convidados", "Convidados", "Alta"],
    ["2 meses", "Definir lista final de musicas", "Musica", "Media"],
    ["2 meses", "Comprar itens de toilette", "Operacao", "Baixa"],
    ["2 meses", "Definir roteiro da cerimonia", "Cerimonia", "Media"],
    ["2 meses", "Fazer teste de cabelo e maquiagem", "Beleza", "Alta"],
    ["2 meses", "Ajustar traje do noivo", "Trajes", "Media"],
    ["2 meses", "Confirmar lua de mel", "Lua de mel", "Media"],

    ["1 mes", "Confirmar todos os fornecedores", "Fornecedores", "Alta"],
    ["1 mes", "Fechar numero final do buffet", "Gastronomia", "Alta"],
    ["1 mes", "Enviar cronograma para fornecedores", "Cronograma", "Alta"],
    ["1 mes", "Retirar aliancas", "Aliancas", "Media"],
    ["1 mes", "Separar pagamentos finais", "Pagamentos", "Alta"],
    ["1 mes", "Fazer prova final dos trajes", "Trajes", "Alta"],
    ["1 mes", "Montar kit emergencia", "Operacao", "Baixa"],

    ["Semana", "Separar documentos e contratos", "Documentos", "Alta"],
    ["Semana", "Confirmar horarios com fornecedores", "Fornecedores", "Alta"],
    ["Semana", "Enviar lista final para buffet", "Gastronomia", "Alta"],
    ["Semana", "Conferir malas da lua de mel", "Lua de mel", "Media"],
    ["Semana", "Buscar vestido e trajes", "Trajes", "Alta"],
    ["Semana", "Separar objetos da cerimonia", "Cerimonia", "Media"],
    ["Semana", "Confirmar transporte do dia", "Transporte", "Media"],
    ["Semana", "Descansar e revisar checklist final", "Bem-estar", "Media"]
  ];
  return tasks.map(([period, title, category, priority]) => ({
    id: uid(),
    title,
    period,
    category,
    status: "Pendente",
    priority,
    owner: "",
    notes: ""
  }));
}

function addGuestOption(key, value) {
  if (!value) return;
  state[key] ||= key === "guestGroups" ? [...DEFAULT_GUEST_GROUPS] : [...DEFAULT_GUEST_ROLES];
  if (!state[key].includes(value)) state[key].push(value);
}

function normalizeGuestGroup(value) {
  const original = String(value || "").trim();
  const key = normalizeHeader(original);
  const map = {
    familia: "Familia da noiva",
    "familia noiva": "Familia da noiva",
    "familia da noiva": "Familia da noiva",
    "familia noivo": "Familia do noivo",
    "familia do noivo": "Familia do noivo",
    padrinhos: "Amigos em comum",
    amigos: "Amigos em comum",
    "amigos em comum": "Amigos em comum",
    "amigo noiva": "Amigo da noiva",
    "amigo da noiva": "Amigo da noiva",
    "amigos da noiva": "Amigo da noiva",
    "amigo noivo": "Amigo do noivo",
    "amigo do noivo": "Amigo do noivo",
    "amigos do noivo": "Amigo do noivo",
    trabalho: "Trabalho noiva",
    "trabalho noiva": "Trabalho noiva",
    "trabalho da noiva": "Trabalho noiva",
    "trabalho noivo": "Trabalho noivo",
    "trabalho do noivo": "Trabalho noivo",
    fornecedor: "Fornecedores",
    fornecedores: "Fornecedores"
  };
  return map[key] || findDefaultGuestOption(DEFAULT_GUEST_GROUPS, original) || original || "Amigos em comum";
}

function normalizeGuestRole(value) {
  const original = String(value || "").trim();
  const key = normalizeHeader(original);
  const map = {
    familia: "Convidado comum",
    padrinhos: "Padrinho",
    padrinho: "Padrinho",
    madrinha: "Madrinha",
    fornecedor: "Convidado comum",
    noiva: "Convidado comum",
    noivo: "Convidado comum",
    "pai da noiva": "Pai da noiva",
    "mae da noiva": "Mae da noiva",
    "pai do noivo": "Pai do noivo",
    "mae do noivo": "Mae do noivo",
    pajem: "Pajem",
    "dama de honra": "Dama de honra",
    convidado: "Convidado comum",
    "convidado comum": "Convidado comum"
  };
  return map[key] || findDefaultGuestOption(DEFAULT_GUEST_ROLES, original) || original || "Convidado comum";
}

function normalizeGuestRsvp(value) {
  const key = normalizeHeader(value);
  const map = {
    "a enviar convite": "A enviar convite",
    enviar: "A enviar convite",
    convite: "A enviar convite",
    sim: "Confirmado",
    confirmado: "Confirmado",
    confirmada: "Confirmado",
    presente: "Confirmado",
    nao: "Não vai",
    "nao vai": "Não vai",
    "não vai": "Não vai",
    recusado: "Não vai",
    recusada: "Não vai",
    ausente: "Não vai",
    pendente: "Pendente",
    aguardando: "A enviar convite",
    talvez: "Pendente"
  };
  return map[key] || "A enviar convite";
}

function normalizeGuestType(value) {
  const key = normalizeHeader(value);
  if (["crianca", "criança", "infantil", "kids", "kid", "child"].includes(key)) return "Crianca";
  return "Adulto";
}

function normalizeGuestExtra(extra = {}, columns = []) {
  const normalized = {};
  columns.forEach((column) => {
    normalized[column.id] = String(extra?.[column.id] || "");
  });
  return normalized;
}

function findDefaultGuestOption(options, value) {
  const key = normalizeHeader(value);
  return options.find((option) => normalizeHeader(option) === key);
}

function normalizeState(nextState) {
  nextState.data = {
    ...structuredClone(seedState).data,
    ...(nextState.data || {})
  };
  nextState.weddingPartyManualConfig = normalizeWeddingPartyManualConfig(nextState.weddingPartyManualConfig || {});
  nextState.weddingPartyManual = normalizeWeddingPartyManual(nextState.weddingPartyManual || {}, nextState.weddingPartyManualConfig);
  nextState.weddingPartyDetails = normalizeWeddingPartyDetails(nextState.weddingPartyDetails || {});
  if (nextState.wedding) {
    nextState.wedding.coupleType ||= "bride_groom";
    nextState.wedding.date = normalizeWeddingDate(nextState.wedding.date);
    if (!nextState.wedding.partnerOne || !nextState.wedding.partnerTwo) {
      const [partnerOne, partnerTwo] = splitCoupleName(nextState.wedding.couple);
      nextState.wedding.partnerOne ||= partnerOne;
      nextState.wedding.partnerTwo ||= partnerTwo;
    }
    nextState.wedding.couple = formatCoupleName(nextState.wedding.partnerOne, nextState.wedding.partnerTwo) || nextState.wedding.couple;
  }
  nextState.data.identity ||= structuredClone(seedState.data.identity);
  nextState.data.identity = nextState.data.identity.map(migrateIdentityItem);
  const defaultGroups = structuredClone(seedState.identityColorGroups || []);
  const itemGroups = nextState.data.identity
    .filter((item) => item.section === "Paleta de cores")
    .map((item) => item.group)
    .filter(Boolean);
  nextState.identityColorGroups = [...new Set([...(nextState.identityColorGroups || defaultGroups), ...itemGroups])];
  nextState.tableSort ||= {};
  nextState.tablePlanner = {
    expandedTables: [],
    ...(nextState.tablePlanner || {})
  };
  nextState.guestExtraColumns = Array.isArray(nextState.guestExtraColumns) ? nextState.guestExtraColumns : [];
  nextState.data.guests ||= structuredClone(seedState.data.guests);
  nextState.data.guests = nextState.data.guests.map((item) => ({
    ...item,
    group: normalizeGuestGroup(item.group),
    role: normalizeGuestRole(item.role),
    guestType: normalizeGuestType(item.guestType),
    rsvp: normalizeGuestRsvp(item.rsvp),
    extra: normalizeGuestExtra(item.extra, nextState.guestExtraColumns),
    looseX: item.table || item.tableId ? "" : item.looseX || "",
    looseY: item.table || item.tableId ? "" : item.looseY || ""
  }));
  const dataGuestGroups = nextState.data.guests.map((item) => item.group).filter(Boolean);
  const dataGuestRoles = nextState.data.guests.map((item) => item.role).filter(Boolean);
  nextState.guestGroups = [...new Set([...DEFAULT_GUEST_GROUPS, ...(nextState.guestGroups || []), ...dataGuestGroups])];
  nextState.guestRoles = [...new Set([...DEFAULT_GUEST_ROLES, ...(nextState.guestRoles || []), ...dataGuestRoles])];
  nextState.guestView = {
    groupBy: "none",
    ...(nextState.guestView || {})
  };
  nextState.data.music ||= structuredClone(seedState.data.music);
  const dataMusicMoments = nextState.data.music.map((item) => item.moment).filter(Boolean);
  nextState.musicMoments = [...new Set([...DEFAULT_MUSIC_MOMENTS, ...(nextState.musicMoments || []), ...dataMusicMoments])];
  nextState.data.music = nextState.data.music.map((item) => ({
    ...item,
    link: item.link || "",
    moment: item.moment || "Entrada"
  }));
  nextState.data.tables ||= structuredClone(seedState.data.tables);
  nextState.data.tables = nextState.data.tables.map((table, index) => {
    const position = tablePosition(table, index);
    return {
      ...table,
      name: table.name || nextTableName(null, nextState.data.tables),
      title: table.title || "",
      area: table.area ? normalizeGuestGroup(table.area) : "",
      x: Number(table.x ?? position.x),
      y: Number(table.y ?? position.y)
    };
  });
  nextState.data.guests = nextState.data.guests.map((guest) => {
    if (guest.tableId) return guest;
    const table = nextState.data.tables.find((entry) => guest.table && entry.name === guest.table);
    return table ? { ...guest, tableId: table.id, looseX: "", looseY: "" } : guest;
  });
  const defaultVendorCategories = structuredClone(seedState.vendorCategories || []);
  const dataVendorCategories = (nextState.data.vendors || []).map((item) => item.category).filter(Boolean);
  nextState.vendorCategories = [...new Set([...(nextState.vendorCategories || defaultVendorCategories), ...dataVendorCategories])];
  nextState.vendorView = {
    groupBy: "category",
    sortBy: "name-asc",
    ...(nextState.vendorView || {})
  };
  if (nextState.checklistDefaultsVersion !== seedState.checklistDefaultsVersion || (nextState.data.checklist || []).length < 80) {
    nextState.data.checklist = defaultChecklistTasks();
    nextState.checklistDefaultsVersion = seedState.checklistDefaultsVersion;
  }
  if (
    nextState.wedding
    && (
      nextState.budgetDefaultsVersion !== seedState.budgetDefaultsVersion
      || !(nextState.data.budget || []).length
      || hasMissingDefaultBudgetItems(nextState.data.budget)
    )
  ) {
    nextState.data.budget = mergeDefaultBudgetItems(nextState.data.budget, nextState.wedding.budget);
    nextState.budgetDefaultsVersion = seedState.budgetDefaultsVersion;
  }
  nextState.data.checklist = nextState.data.checklist.map((item) => ({
    ...item,
    priority: item.priority || "Media",
    owner: item.owner || "",
    status: item.status === "Concluido" ? "Concluido" : "Pendente"
  }));
  nextState.data.budget = nextState.data.budget.map((item) => ({
    ...item,
    share: Number(item.share) || 0,
    suggestedBase: Number(item.suggestedBase) || 0,
    actualBase: Number(item.actualBase) || 0,
    planned: Number(item.suggestedBase)
      ? scaledBudgetValue(item.suggestedBase, nextState.wedding?.budget)
      : Number(item.share)
        ? Math.round(((Number(nextState.wedding?.budget) || 0) * Number(item.share)) / 100)
        : Number(item.planned) || 0,
    actual: Number(item.actual) || 0
  }));
  return nextState;
}

function migrateIdentityItem(item) {
  if (item.section) {
    const migrated = { ...item };
    normalizeIdentityItem(migrated);
    return migrated;
  }
  const isFont = item.category === "Fonte";
  const migrated = {
    id: item.id || uid(),
    section: isFont ? "Tipografia" : "Paleta de cores",
    name: item.name || item.category || "Item",
    typographyUse: isFont ? "Convite casamento" : "",
    fontRole: item.name?.toLowerCase().includes("texto") ? "Textos" : "Titulos",
    fontStyle: isFont ? "Outra" : "",
    fontName: isFont ? item.value || item.name : "",
    group: isFont ? "" : groupFromLegacyCategory(item.category),
    usage: isFont ? "" : item.value || item.name,
    colorName: isFont ? "" : item.value || item.name,
    colorHex: normalizeHexColor(item.color || item.value) || "",
    color: normalizeHexColor(item.color || item.value) || "#ffffff",
    status: item.status || "Ideia",
    notes: item.notes || ""
  };
  normalizeIdentityItem(migrated);
  return migrated;
}

function normalizeIdentityItem(item) {
  item.section ||= "Tipografia";
  item.status ||= "Ideia";
  if (item.section === "Tipografia") {
    item.typographyUse ||= "Convite casamento";
    item.fontRole ||= "Titulos";
    item.fontStyle ||= "Outra";
    item.fontName ||= item.name || "";
    item.group = "";
    item.usage = "";
    item.colorName = "";
    item.colorHex = "";
    item.color = "#ffffff";
  } else {
    item.group ||= "Decoracao";
    item.usage ||= "";
    item.colorHex = normalizeHexColor(item.colorHex || item.color) || "#ffffff";
    item.color = item.colorHex;
    item.colorName ||= suggestColorName(item.colorHex);
    item.typographyUse = "";
    item.fontRole = "";
    item.fontStyle = "";
    item.fontName = "";
  }
}

function identityDefaultValue(name, section) {
  const defaults = {
    section,
    status: "Ideia",
    typographyUse: "Convite casamento",
    fontRole: "Titulos",
    fontStyle: "Romantica",
    group: "Decoracao",
    color: "#EFBBCF",
    colorHex: "#EFBBCF"
  };
  return defaults[name] || "";
}

function identityFieldGroup(name) {
  const fontFields = ["typographyUse", "fontRole", "fontStyle", "fontName"];
  const colorFields = ["group", "usage", "colorName", "colorHex", "color"];
  if (fontFields.includes(name)) return "identity-font-field";
  if (colorFields.includes(name)) return "identity-color-field";
  return "";
}

function groupFromLegacyCategory(category) {
  const groups = {
    Traje: "Padrinhos",
    Acessorio: "Padrinhos",
    Decoracao: "Decoracao",
    Papelaria: "Decoracao",
    Paleta: "Decoracao"
  };
  return groups[category] || "Decoracao";
}

function normalizeHexColor(value) {
  const match = /^#?([0-9a-f]{6})$/i.exec(String(value || "").trim());
  return match ? `#${match[1].toUpperCase()}` : "";
}

function suggestColorName(hex) {
  const normalized = normalizeHexColor(hex);
  const names = {
    "#FFFFFF": "Branco",
    "#FAF9F6": "Off-white",
    "#000000": "Preto",
    "#1F3A5F": "Azul profundo",
    "#EFBBCF": "Rosa claro",
    "#F7B7A3": "Rosa salmao",
    "#EAD7C0": "Champagne",
    "#D6C3A3": "Dourado suave",
    "#A8A8A8": "Cinza",
    "#D8B4E2": "Lilas",
    "#FF9A8B": "Coral"
  };
  return names[normalized] || "";
}

function fontOptions() {
  return [
    "Playfair Display",
    "Montserrat",
    "Cormorant Garamond",
    "Great Vibes",
    "Dancing Script",
    "Parisienne",
    "Cinzel",
    "Libre Baskerville",
    "Lora",
    "Poppins",
    "Georgia",
    "Garamond",
    "Times New Roman",
    "Arial",
    "Helvetica",
    "Verdana",
    "Trebuchet MS",
    "Courier New",
    "Brush Script MT",
    "Segoe Script",
    "Lucida Handwriting",
    "Copperplate",
    "Didot",
    "Bodoni 72"
  ];
}

function fontFamilyFor(item) {
  const style = item?.fontStyle || item;
  const families = {
    Classica: "Georgia, 'Times New Roman', serif",
    Moderna: "Arial, Helvetica, sans-serif",
    Romantica: "Georgia, serif",
    Minimalista: "Inter, Arial, sans-serif",
    Manuscrita: "'Brush Script MT', 'Segoe Script', cursive",
    Serifada: "Georgia, 'Times New Roman', serif",
    "Sem serifa": "Arial, Helvetica, sans-serif"
  };
  const fallback = families[style] || "Georgia, serif";
  const fontName = String(item?.fontName || "").trim();
  return fontName ? `${quoteFontFamily(fontName)}, ${fallback}` : fallback;
}

function quoteFontFamily(fontName) {
  return `'${fontName.replaceAll("'", "\\'")}'`;
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function todayPlus(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function metric(label, value, helper) {
  return `<article class="metric-card"><span>${label}</span><strong>${value}</strong><small>${helper}</small></article>`;
}

function progressMetric(label, value, helper, percent, color, target) {
  return `
    <button class="metric-card progress-metric" type="button" data-dashboard-target="${target}">
      <div class="ring" style="--percent:${percent}; --ring-color:var(--${color})">${value}</div>
      <div>
        <strong>${label}</strong>
        <small>${helper}</small>
      </div>
    </button>
  `;
}

function countFor(key) {
  if (key === "weddingParty") return weddingPartyGuests("Madrinha").length + weddingPartyGuests("Padrinho").length;
  return key === "dashboard" ? "" : (state.data[key] || []).length;
}

function sum(items, field) {
  return items.reduce((total, item) => total + (Number(item[field]) || 0), 0);
}

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatCurrencyInput(value) {
  return money(parseCurrencyInput(value));
}

function parseCurrencyInput(value) {
  const text = String(value || "").trim();
  const [reaisText, centsText = ""] = text.split(",");
  const reais = Number(reaisText.replace(/\D/g, "") || "0");
  const cents = Number(centsText.replace(/\D/g, "").slice(0, 2).padEnd(2, "0") || "0") / 100;
  return reais + cents;
}

function paymentCalendarMonth() {
  if (state.paymentCalendarMonth) return state.paymentCalendarMonth;
  const datedPayment = state.data.payments.find((payment) => payment.dueDate);
  return monthKey(datedPayment?.dueDate) || monthKey(new Date().toISOString().slice(0, 10));
}

function monthKey(value) {
  const normalized = normalizeWeddingDate(value);
  return normalized ? normalized.slice(0, 7) : "";
}

function addMonths(month, amount) {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(year, monthNumber - 1 + amount, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthTitle(month) {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(year, monthNumber - 1, 1);
  const title = date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return title.charAt(0).toUpperCase() + title.slice(1);
}

function placeCurrencyCursor(input) {
  const commaIndex = input.value.indexOf(",");
  const position = commaIndex === -1 ? input.value.length : commaIndex;
  requestAnimationFrame(() => input.setSelectionRange(position, position));
}

function weddingDaysLeft() {
  if (!state.wedding?.date) return 0;
  const today = new Date();
  const wedding = new Date(`${state.wedding.date}T00:00:00`);
  if (Number.isNaN(wedding.getTime())) return 0;
  return Math.max(0, Math.ceil((wedding - today) / 86400000));
}

function periodGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function updatePartnerLabels(coupleType) {
  const labels = partnerLabels(coupleType);
  const firstLabel = els.onboardingForm.querySelector('[data-partner-label="one"]');
  const secondLabel = els.onboardingForm.querySelector('[data-partner-label="two"]');
  firstLabel.textContent = labels[0];
  secondLabel.textContent = labels[1];
  els.onboardingForm.elements.partnerOne.placeholder = labels[0].replace("Nome da ", "").replace("Nome do ", "");
  els.onboardingForm.elements.partnerTwo.placeholder = labels[1].replace("Nome da ", "").replace("Nome do ", "");
}

function partnerLabels(coupleType) {
  const labels = {
    bride_groom: ["Nome da Noiva", "Nome do Noivo"],
    bride_bride: ["Nome da Noiva 1", "Nome da Noiva 2"],
    groom_groom: ["Nome do Noivo 1", "Nome do Noivo 2"]
  };
  return labels[coupleType] || labels.bride_groom;
}

function formatCoupleName(partnerOne, partnerTwo) {
  return [partnerOne, partnerTwo].map((name) => String(name || "").trim()).filter(Boolean).join(" e ");
}

function splitCoupleName(coupleName) {
  const parts = String(coupleName || "").split(/\s+(?:&|e)\s+/i).map((part) => part.trim()).filter(Boolean);
  return [parts[0] || "", parts.slice(1).join(" e ") || ""];
}

function maskBrazilianDate(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function parseBrazilianDate(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(value || "").trim());
  if (!match) return null;
  const [, dayText, monthText, yearText] = match;
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1) return null;
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return `${yearText}-${monthText}-${dayText}`;
}

function normalizeWeddingDate(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (isValidIsoDate(text)) return text;
  return parseBrazilianDate(maskBrazilianDate(text)) || "";
}

function isValidIsoDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
  if (!match) return false;
  const [, yearText, monthText, dayText] = match;
  const date = new Date(Number(yearText), Number(monthText) - 1, Number(dayText));
  return date.getFullYear() === Number(yearText) && date.getMonth() === Number(monthText) - 1 && date.getDate() === Number(dayText);
}

function formatDate(value) {
  if (!value) return "";
  const normalized = normalizeWeddingDate(value);
  if (!normalized) return "";
  const [year, month, day] = normalized.split("-");
  return `${day}/${month}/${year}`;
}

function formatValue(field, value) {
  if (value === undefined || value === null || value === "") return "";
  if (["planned", "actual", "value", "amount"].includes(field)) return money(value);
  if (field.toLowerCase().includes("date") || field === "date") return formatDate(value);
  if (field === "phone") return formatWhatsAppLink(value);
  if (field === "link") return formatExternalLink(value);
  return escapeHtml(value);
}

function formatExternalLink(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  const href = /^https?:\/\//i.test(text) ? text : `https://${text}`;
  const platform = linkPlatform(href);
  return `<a class="external-link ${platform.className}" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(text)}">${iconSvg(platform.icon)}<span>${escapeHtml(platform.label)}</span></a>`;
}

function linkPlatform(href) {
  let host = "";
  try {
    host = new URL(href).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return { label: "Abrir link", icon: "external", className: "platform-generic" };
  }
  if (host.includes("youtube.com") || host.includes("youtu.be")) return { label: "YouTube", icon: "youtube", className: "platform-youtube" };
  if (host.includes("spotify.com")) return { label: "Spotify", icon: "spotify", className: "platform-spotify" };
  if (host.includes("soundcloud.com")) return { label: "SoundCloud", icon: "music", className: "platform-soundcloud" };
  if (host.includes("deezer.com")) return { label: "Deezer", icon: "music", className: "platform-deezer" };
  if (host.includes("music.apple.com")) return { label: "Apple Music", icon: "music", className: "platform-apple" };
  return { label: "Abrir link", icon: "external", className: "platform-generic" };
}

function formatMultilineText(value) {
  return escapeHtml(value || "").replace(/\n/g, "<br>");
}

function formatWhatsAppLink(value) {
  const text = String(value || "").trim();
  const number = whatsappNumber(text);
  if (!number) return escapeHtml(text);
  return `<a class="external-link platform-whatsapp" href="https://wa.me/${number}" target="_blank" rel="noopener noreferrer" title="Abrir WhatsApp">${iconSvg("whatsapp")}<span>${escapeHtml(text)}</span></a>`;
}

function formatVendorContact(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  const number = whatsappNumber(text);
  if (number) return formatWhatsAppLink(text);
  return escapeHtml(text);
}

function formatInstagramLink(url, handle) {
  const rawHandle = String(handle || "").trim();
  const rawUrl = String(url || "").trim();
  if (!rawHandle && !rawUrl) return "";
  const cleanHandle = rawHandle
    ? rawHandle.replace(/^@+/, "")
    : instagramHandleFromUrl(rawUrl);
  const label = cleanHandle ? `@${cleanHandle}` : "Instagram";
  const href = rawUrl
    ? (/^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`)
    : `https://instagram.com/${cleanHandle}`;
  return `<a class="external-link platform-instagram" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(href)}">${iconSvg("instagram")}<span>${escapeHtml(label)}</span></a>`;
}

function instagramHandleFromUrl(url) {
  try {
    const parsed = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
    return parsed.pathname.split("/").filter(Boolean)[0] || "";
  } catch {
    return "";
  }
}

function whatsappNumber(value) {
  let digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";
  if ((digits.length === 10 || digits.length === 11) && !digits.startsWith("55")) digits = `55${digits}`;
  return digits.length >= 10 ? digits : "";
}

function iconSvg(name) {
  const icons = {
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4l11-11-4-4L4 16v4zM13 7l4 4"/></svg>',
    trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V5h6v2M8 10v9M12 10v9M16 10v9M6 7l1 14h10l1-14"/></svg>',
    external: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h5v5M10 14L19 5M19 14v5H5V5h5"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8.5c.2-1.4 1.1-2.3 2.4-2.5C8.4 5.7 12 5.7 12 5.7s3.6 0 5.6.3c1.3.2 2.2 1.1 2.4 2.5.3 1.8.3 3.5.3 3.5s0 1.7-.3 3.5c-.2 1.4-1.1 2.3-2.4 2.5-2 .3-5.6.3-5.6.3s-3.6 0-5.6-.3c-1.3-.2-2.2-1.1-2.4-2.5-.3-1.8-.3-3.5-.3-3.5s0-1.7.3-3.5z"/><path d="M10 9.5v5l4.5-2.5L10 9.5z"/></svg>',
    spotify: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M8 10c2.7-.8 5.6-.5 8 1M8.5 13c2-.6 4.5-.4 6.4.8M9 15.7c1.5-.4 3.2-.3 4.6.5"/></svg>',
    music: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V6l10-2v12M9 18a3 3 0 1 1-2-2.8M19 16a3 3 0 1 1-2-2.8"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.2 18.4 4 20l.7-2.8a8 8 0 1 1 3 2.5l-1.5-1.3z"/><path d="M9 9.5c.4 2.5 2 4.2 4.6 5l1.4-1.3 2 .6c.1 1.1-.6 2-1.7 2.3-3.8.9-8.2-3.4-7.4-7.3.2-1.1 1.1-1.8 2.2-1.7l.6 2-1.7 1.4z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="4"/><circle cx="12" cy="12" r="3"/><path d="M16.5 7.5h.01"/></svg>'
  };
  return icons[name] || "";
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function labelForField(field) {
  if (field.startsWith("extra:")) {
    const column = (state.guestExtraColumns || []).find((item) => item.id === field.slice(6));
    return column?.label || "Informacao";
  }
  const labels = {
    title: "Titulo",
    period: "Periodo",
    category: "Categoria",
    status: "Status",
    priority: "Prioridade",
    owner: "Responsavel",
    dueDate: "Prazo",
    notes: "Observacoes",
    section: "Secao",
    share: "Percentual base",
    planned: "Planejado",
    actual: "Real",
    name: "Nome",
    group: "Grupo",
    role: "Papel",
    guestType: "Tipo",
    rsvp: "RSVP",
    table: "Mesa",
    phone: "WhatsApp",
    capacity: "Capacidade",
    area: "Area",
    song: "Musica",
    artist: "Artista",
    link: "Link da musica",
    moment: "Momento",
    contact: "Contato",
    value: "Valor",
    contract: "Contrato",
    description: "Descricao",
    vendor: "Fornecedor",
    amount: "Valor",
    date: "Data",
    time: "Hora",
    reminder: "Lembrete",
    typographyUse: "Uso da fonte",
    fontRole: "Funcao da fonte",
    fontStyle: "Estilo da fonte",
    fontName: "Nome da fonte",
    group: "Grupo",
    usage: "Onde sera usada",
    colorName: "Nome da cor",
    colorHex: "Codigo HEX",
    color: "Seletor de cor"
  };
  return labels[field] || field;
}

function primaryStatus(item) {
  return item.status || item.rsvp || item.period || item.moment || item.area || "Item";
}

function chipColor(value) {
  if (["Concluido", "Confirmado", "Pago", "Contratado", "Assinado", "Aprovada"].includes(value)) return "teal";
  if (["Estourou", "Atrasado", "Não vai"].includes(value)) return "rose";
  if (["Pendente", "A enviar convite", "Em andamento", "Media"].includes(value)) return "gold";
  if (["Alta", "Comprar"].includes(value)) return "rose";
  if (["Baixa", "Ideia"].includes(value)) return "sage";
  return "sage";
}

function tableLoad(table) {
  const used = guestsForTable(table).length;
  const capacity = Number(table.capacity) || 0;
  return {
    used,
    capacity,
    percent: capacity ? Math.min(100, Math.round((used / capacity) * 100)) : 0
  };
}

function guestsForTable(table) {
  return state.data.guests
    .filter((guest) => guest.rsvp !== "Não vai" && (guest.tableId === table.id || (!guest.tableId && guest.table === table.name)))
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "pt-BR", { sensitivity: "base" }));
}

function guestAssignedTable(guest) {
  if (guest.tableId && state.data.tables.some((table) => table.id === guest.tableId)) return guest.tableId;
  const table = state.data.tables.find((entry) => guest.table && entry.name === guest.table);
  return table?.id || "";
}

function guestLoosePosition(guest) {
  if (guest.looseX === "" || guest.looseX === undefined || guest.looseX === null) return null;
  if (guest.looseY === "" || guest.looseY === undefined || guest.looseY === null) return null;
  const x = Number(guest.looseX);
  const y = Number(guest.looseY);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x, y };
}

function tablePosition(table, index = 0) {
  if (Number.isFinite(Number(table?.x)) && Number.isFinite(Number(table?.y))) {
    return { x: Number(table.x), y: Number(table.y) };
  }
  const positions = [
    { x: 8, y: 10 },
    { x: 38, y: 10 },
    { x: 68, y: 10 },
    { x: 18, y: 42 },
    { x: 50, y: 42 },
    { x: 72, y: 42 },
    { x: 8, y: 70 },
    { x: 42, y: 70 }
  ];
  return positions[index % positions.length];
}

function nextTableName(excludeId = null, tables = state.data.tables) {
  const highest = tables
    .filter((table) => table.id !== excludeId)
    .map((table) => /^Mesa\s+(\d+)$/i.exec(String(table.name || "").trim())?.[1])
    .filter(Boolean)
    .map(Number)
    .reduce((max, number) => Math.max(max, number), 0);
  return `Mesa ${highest + 1}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function emptyPanel() {
  return `<section class="panel"><p>Nenhum item encontrado.</p></section>`;
}
