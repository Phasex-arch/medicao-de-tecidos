//console.log('Script iniciado');
//console.log('CREDENTIALS:', CREDENTIALS);
//console.log('Pacientes:', pacientes);

// Configuração MQTT
let mqttClient = null;
const mqttConfig = {
    broker: CREDENTIALS.broker_url,
    options: {
        username: CREDENTIALS.mqtt_username,
        password: CREDENTIALS.mqtt_password,
        clientId: CREDENTIALS.mqtt_clientId + Math.random().toString(16).substr(2, 8),
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 1000
    },
    topic: 'medicao/nodered'
};

// Função para conectar ao MQTT
function conectarMQTT() {
    const loadingElement = document.getElementById('loading');
    loadingElement.classList.remove('hidden'); // Mostra o loading

    try {
        if (!mqttClient || !mqttClient.connected) {
            mqttClient = mqtt.connect(mqttConfig.broker, mqttConfig.options);

            mqttClient.on('connect', function () {
                console.log('✅ Conectado ao broker MQTT');
                adicionarLog('Conexão MQTT estabelecida');
                loadingElement.classList.add('hidden'); // Esconde o loading
            });

            mqttClient.on('error', function (error) {
                console.error('❌ Erro MQTT:', error);
                loadingElement.classList.add('hidden'); // Esconde o loading em caso de erro
            });

            mqttClient.on('reconnect', function () {
                console.log('🔄 Reconectando ao MQTT...');
                // Se você quiser mostrar o loading novamente durante a reconexão, descomente a linha abaixo
                // loadingElement.classList.remove('hidden');
            });
        } else {
            loadingElement.classList.add('hidden'); // Esconde o loading se já estiver conectado
        }
    } catch (error) {
        console.error('❌ Erro ao conectar MQTT:', error);
        loadingElement.classList.add('hidden'); // Esconde o loading em caso de erro
    }
}

// Dados dos pacientes - TOTAL DE 10 PACIENTES
const pacientes = [
    {
        id: "PX-A147",
        nome: "Maria de Souza",
        idade: 46,
        sexo: "Feminino",
        prontuario: "PRT-908233",
        convenio: "Amil",
        status: "a_analisar",
        medico: "Dr. Henrique Torres",
        cirurgiao: "—",
        hospital: "São Lucas",
        data_coleta: "2025-10-21",
        data_recebimento: "2025-10-22",
        hipotese: "Carcinoma ductal invasivo",
        indicacao_cirurgica: "Tumor",
        historia_clinica: "Nódulo de 2,1 cm em QSE, dor intermitente.",
        macros: {
            tipo_material: "Biópsia",
            local_anatomico: "Mama esquerda (QSE)",
            lateralidade: "Esquerda",
            fixacao: "Formol 10%",
            dimensoes: { comp: 21, larg: 12, esp: 7, unidade: "mm" },
            peso_g: 3.2,
            n_fragmentos: 3,
            cor: "Branco-rosado",
            consistencia: "Firme",
            textura: "Fibroelástica",
            superficie: "Ligeiramente nodular",
            lesoes_visiveis: "Nódulo central, 8 mm",
            margens: { status: "livres", distancia_mm: 4.2 },
            estruturas_associadas: "Gordura, ductos",
            percent_tumoral: 38
        },
        micros: {
            tipo_tecido: "Glandular mamário",
            padrao: "Maligno",
            grau_histologico: "Grau II",
            necrose: "Focal",
            hemorragia: "Ausente",
            inflamacao: "Moderada",
            fibrose: "Presente",
            calcificacao: "Ausente",
            invasao: { vascular: "Ausente", linfatica: "Presente", perineural: "Ausente" },
            margens: "Livres",
            indices: { mitoses_por_campo: 8, ki67_percent: 22, celularidade: "Alta" }
        },
        conclusao: {
            diagnostico_final: "Carcinoma ductal invasivo de mama",
            grau_histologico: "II",
            estadiamento: { pT: "pT2", pN: "pN0", pM: "pMx" },
            observacoes: "Sugerida imuno adicional para perfil molecular."
        },
        complementares: {
            coloracoes: [{ nome: "PAS", resultado: "Positivo focal" }],
            imunohistoquimica: [{ marcador: "HER2", resultado: "2+" }, { marcador: "Ki-67", resultado: "22%" }],
            moleculares: []
        }
    },
    {
        id: "PX-B289",
        nome: "João Silva",
        idade: 62,
        sexo: "Masculino",
        prontuario: "PRT-114522",
        convenio: "Particular",
        status: "em_revisao",
        medico: "Dra. Carla Mendes",
        cirurgiao: "Dr. Paulo Arantes",
        hospital: "Albert Einstein",
        data_coleta: "2025-10-18",
        data_recebimento: "2025-10-19",
        hipotese: "Adenocarcinoma de próstata",
        indicacao_cirurgica: "Biópsia de rastreamento",
        historia_clinica: "PSA elevado, toque retal suspeito.",
        macros: {
            tipo_material: "Biópsia (múltiplos fragmentos)",
            local_anatomico: "Próstata",
            lateralidade: "—",
            fixacao: "Formol 10%",
            dimensoes: { comp: 2.4, larg: 0.2, esp: 0.2, unidade: "cm" },
            peso_g: 0.6,
            n_fragmentos: 12,
            cor: "Amarelado",
            consistencia: "Macia",
            textura: "Homogênea",
            superficie: "Lisa",
            lesoes_visiveis: "Não evidentes a olho nu",
            margens: { status: "—", distancia_mm: null },
            estruturas_associadas: "—",
            percent_tumoral: 12
        },
        micros: {
            tipo_tecido: "Glandular prostático",
            padrao: "Maligno",
            grau_histologico: "Gleason 3+4",
            necrose: "Ausente",
            hemorragia: "Focal",
            inflamacao: "Leve",
            fibrose: "Leve",
            calcificacao: "Ausente",
            invasao: { vascular: "Ausente", linfatica: "Ausente", perineural: "Presente" },
            margens: "—",
            indices: { mitoses_por_campo: 5, ki67_percent: 10, celularidade: "Moderada" }
        },
        conclusao: {
            diagnostico_final: "Adenocarcinoma de próstata",
            grau_histologico: "Gleason 7 (3+4)",
            estadiamento: { pT: "pT1c", pN: "pNx", pM: "pMx" },
            observacoes: "Correlacionar com PSA e imagem."
        },
        complementares: {
            coloracoes: [],
            imunohistoquimica: [{ marcador: "p504s", resultado: "Positivo" }],
            moleculares: []
        }
    },
    {
        id: "PX-C432",
        nome: "Ana Oliveira",
        idade: 34,
        sexo: "Feminino",
        prontuario: "PRT-771092",
        convenio: "SulAmérica",
        status: "concluido",
        medico: "Dr. Roberto Almeida",
        cirurgiao: "—",
        hospital: "Sírio-Libanês",
        data_coleta: "2025-10-05",
        data_recebimento: "2025-10-06",
        hipotese: "Melanoma maligno cutâneo",
        indicacao_cirurgica: "Excisão de lesão",
        historia_clinica: "Lesão pigmentada em crescimento.",
        macros: {
            tipo_material: "Peça cirúrgica",
            local_anatomico: "Pele do dorso",
            lateralidade: "—",
            fixacao: "Formol 10%",
            dimensoes: { comp: 35, larg: 22, esp: 8, unidade: "mm" },
            peso_g: 12.4,
            n_fragmentos: 1,
            cor: "Marrom-escuro",
            consistencia: "Firme",
            textura: "Irregular",
            superficie: "Ulcerada focal",
            lesoes_visiveis: "Placa pigmentada, 17 mm",
            margens: { status: "livres", distancia_mm: 6.0 },
            estruturas_associadas: "Pannículo adiposo",
            percent_tumoral: 62
        },
        micros: {
            tipo_tecido: "Cutâneo",
            padrao: "Maligno",
            grau_histologico: "Alto grau",
            necrose: "Presente",
            hemorragia: "Presente",
            inflamacao: "Moderada",
            fibrose: "Leve",
            calcificacao: "Ausente",
            invasao: { vascular: "Ausente", linfatica: "Presente", perineural: "Ausente" },
            margens: "Livres",
            indices: { mitoses_por_campo: 12, ki67_percent: 35, celularidade: "Alta" }
        },
        conclusao: {
            diagnostico_final: "Melanoma maligno cutâneo",
            grau_histologico: "Alto grau",
            estadiamento: { pT: "pT3b", pN: "pN0", pM: "pMx" },
            observacoes: "Correlacionar com Breslow/Clark e linfonodo sentinela."
        },
        complementares: {
            coloracoes: [{ nome: "Tricrômico", resultado: "—" }],
            imunohistoquimica: [{ marcador: "S100", resultado: "Positivo difuso" }],
            moleculares: [{ teste: "NGS painel melanoma", resultado: "Em processamento" }]
        }
    },
    {
        id: "PX-D567",
        nome: "Carlos Santos",
        idade: 58,
        sexo: "Masculino",
        prontuario: "PRT-445612",
        convenio: "Bradesco Saúde",
        status: "a_analisar",
        medico: "Dra. Fernanda Lima",
        cirurgiao: "Dr. Ricardo Moura",
        hospital: "Hospital das Clínicas",
        data_coleta: "2025-10-25",
        data_recebimento: "2025-10-26",
        hipotese: "Carcinoma de células renais",
        indicacao_cirurgica: "Nefrectomia",
        historia_clinica: "Massa renal detectada em ultrassom de rotina.",
        macros: {
            tipo_material: "Peça cirúrgica",
            local_anatomico: "Rim direito",
            lateralidade: "Direita",
            fixacao: "Formol 10%",
            dimensoes: { comp: 85, larg: 45, esp: 35, unidade: "mm" },
            peso_g: 145.8,
            n_fragmentos: 1,
            cor: "Amarelado",
            consistencia: "Firme",
            textura: "Heterogênea",
            superficie: "Nodular",
            lesoes_visiveis: "Massa cortical, 42 mm",
            margens: { status: "livres", distancia_mm: 8.5 },
            estruturas_associadas: "Cápsula renal, gordura perirrenal",
            percent_tumoral: 45
        },
        micros: {
            tipo_tecido: "Renal",
            padrao: "Maligno",
            grau_histologico: "Grau III",
            necrose: "Extensa",
            hemorragia: "Presente",
            inflamacao: "Leve",
            fibrose: "Moderada",
            calcificacao: "Focal",
            invasao: { vascular: "Presente", linfatica: "Presente", perineural: "Ausente" },
            margens: "Livres",
            indices: { mitoses_por_campo: 15, ki67_percent: 28, celularidade: "Alta" }
        },
        conclusao: {
            diagnostico_final: "Carcinoma de células renais de células claras",
            grau_histologico: "III",
            estadiamento: { pT: "pT1b", pN: "pN0", pM: "pMx" },
            observacoes: "Acompanhamento urológico necessário."
        },
        complementares: {
            coloracoes: [{ nome: "PAS", resultado: "Positivo" }],
            imunohistoquimica: [{ marcador: "CD10", resultado: "Positivo" }, { marcador: "Vimentina", resultado: "Positivo" }],
            moleculares: []
        }
    },
    {
        id: "PX-E789",
        nome: "Beatriz Costa",
        idade: 29,
        sexo: "Feminino",
        prontuario: "PRT-889034",
        convenio: "Unimed",
        status: "em_revisao",
        medico: "Dr. Paulo Henrique",
        cirurgiao: "—",
        hospital: "Santa Casa",
        data_coleta: "2025-10-20",
        data_recebimento: "2025-10-21",
        hipotese: "Tireoidite de Hashimoto",
        indicacao_cirurgica: "Biópsia por agulha",
        historia_clinica: "Hipotireoidismo, aumento difuso da tireoide.",
        macros: {
            tipo_material: "Biópsia",
            local_anatomico: "Tireoide",
            lateralidade: "—",
            fixacao: "Formol 10%",
            dimensoes: { comp: 1.2, larg: 0.1, esp: 0.1, unidade: "cm" },
            peso_g: 0.8,
            n_fragmentos: 6,
            cor: "Acastanhado",
            consistencia: "Firme",
            textura: "Homogênea",
            superficie: "Lisa",
            lesoes_visiveis: "Não evidentes",
            margens: { status: "—", distancia_mm: null },
            estruturas_associadas: "—",
            percent_tumoral: 0
        },
        micros: {
            tipo_tecido: "Tireoidiano",
            padrao: "Benigno",
            grau_histologico: "—",
            necrose: "Ausente",
            hemorragia: "Focal",
            inflamacao: "Crônica",
            fibrose: "Presente",
            calcificacao: "Ausente",
            invasao: { vascular: "Ausente", linfatica: "Ausente", perineural: "Ausente" },
            margens: "—",
            indices: { mitoses_por_campo: 1, ki67_percent: 2, celularidade: "Baixa" }
        },
        conclusao: {
            diagnostico_final: "Tireoidite linfocítica crônica (Hashimoto)",
            grau_histologico: "—",
            estadiamento: { pT: "—", pN: "—", pM: "—" },
            observacoes: "Correlacionar com exames laboratoriais."
        },
        complementares: {
            coloracoes: [],
            imunohistoquimica: [],
            moleculares: []
        }
    },
    {
        id: "PX-F901",
        nome: "Roberto Alves",
        idade: 71,
        sexo: "Masculino",
        prontuario: "PRT-556723",
        convenio: "Particular",
        status: "concluido",
        medico: "Dra. Simone Rocha",
        cirurgiao: "Dr. Marcelo Tavares",
        hospital: "Albert Einstein",
        data_coleta: "2025-10-15",
        data_recebimento: "2025-10-16",
        hipotese: "Adenocarcinoma colorretal",
        indicacao_cirurgica: "Colectomia",
        historia_clinica: "Sangramento intestinal, alteração do hábito intestinal.",
        macros: {
            tipo_material: "Peça cirúrgica",
            local_anatomico: "Cólon sigmoide",
            lateralidade: "—",
            fixacao: "Formol 10%",
            dimensoes: { comp: 18, larg: 4.5, esp: 2.8, unidade: "cm" },
            peso_g: 89.3,
            n_fragmentos: 1,
            cor: "Rosado",
            consistencia: "Firme",
            textura: "Irregular",
            superficie: "Ulcerada",
            lesoes_visiveis: "Úlcera infiltrante, 3.2 cm",
            margens: { status: "livres", distancia_mm: 12.4 },
            estruturas_associadas: "Gordura pericólica, linfonodos",
            percent_tumoral: 55
        },
        micros: {
            tipo_tecido: "Colônico",
            padrao: "Maligno",
            grau_histologico: "Grau II",
            necrose: "Presente",
            hemorragia: "Presente",
            inflamacao: "Moderada",
            fibrose: "Presente",
            calcificacao: "Ausente",
            invasao: { vascular: "Presente", linfatica: "Presente", perineural: "Ausente" },
            margens: "Livres",
            indices: { mitoses_por_campo: 10, ki67_percent: 25, celularidade: "Moderada" }
        },
        conclusao: {
            diagnostico_final: "Adenocarcinoma moderadamente diferenciado do cólon",
            grau_histologico: "II",
            estadiamento: { pT: "pT3", pN: "pN1b", pM: "pMx" },
            observacoes: "Quimioterapia adjuvante indicada."
        },
        complementares: {
            coloracoes: [{ nome: "PAS", resultado: "Positivo" }],
            imunohistoquimica: [{ marcador: "CK20", resultado: "Positivo" }, { marcador: "CDX2", resultado: "Positivo" }],
            moleculares: []
        }
    },
    {
        id: "PX-G234",
        nome: "Fernanda Lima",
        idade: 41,
        sexo: "Feminino",
        prontuario: "PRT-667812",
        convenio: "Amil",
        status: "em_processo",
        medico: "Dr. Antonio Carlos",
        cirurgiao: "—",
        hospital: "Sírio-Libanês",
        data_coleta: "2025-10-28",
        data_recebimento: "2025-10-29",
        hipotese: "Lesão mamária benigna",
        indicacao_cirurgica: "Biópsia excisional",
        historia_clinica: "Nódulo palpável em mama direita, assintomático.",
        macros: {
            tipo_material: "Biópsia",
            local_anatomico: "Mama direita (QSI)",
            lateralidade: "Direita",
            fixacao: "Formol 10%",
            dimensoes: { comp: 15, larg: 10, esp: 8, unidade: "mm" },
            peso_g: 2.1,
            n_fragmentos: 1,
            cor: "Branco-amarelado",
            consistencia: "Elástica",
            textura: "Homogênea",
            superficie: "Lisa",
            lesoes_visiveis: "Nódulo bem delimitado, 8 mm",
            margens: { status: "livres", distancia_mm: 3.5 },
            estruturas_associadas: "Tecido adiposo",
            percent_tumoral: 0
        },
        micros: {
            tipo_tecido: "Mamário",
            padrao: "Benigno",
            grau_histologico: "—",
            necrose: "Ausente",
            hemorragia: "Ausente",
            inflamacao: "Leve",
            fibrose: "Presente",
            calcificacao: "Ausente",
            invasao: { vascular: "Ausente", linfatica: "Ausente", perineural: "Ausente" },
            margens: "Livres",
            indices: { mitoses_por_campo: 1, ki67_percent: 3, celularidade: "Baixa" }
        },
        conclusao: {
            diagnostico_final: "Fibroadenoma mamário",
            grau_histologico: "—",
            estadiamento: { pT: "—", pN: "—", pM: "—" },
            observacoes: "Controle em 6 meses."
        },
        complementares: {
            coloracoes: [],
            imunohistoquimica: [],
            moleculares: []
        }
    },
    {
        id: "PX-H567",
        nome: "Pedro Martins",
        idade: 67,
        sexo: "Masculino",
        prontuario: "PRT-334589",
        convenio: "SulAmérica",
        status: "em_revisao",
        medico: "Dra. Carla Santos",
        cirurgiao: "Dr. Roberto Figueiredo",
        hospital: "São Lucas",
        data_coleta: "2025-10-22",
        data_recebimento: "2025-10-23",
        hipotese: "Carcinoma de pulmão",
        indicacao_cirurgica: "Lobectomia",
        historia_clinica: "Tabagista, tosse crônica, nódulo pulmonar em TC.",
        macros: {
            tipo_material: "Peça cirúrgica",
            local_anatomico: "Pulmão direito (lobo superior)",
            lateralidade: "Direita",
            fixacao: "Formol 10%",
            dimensoes: { comp: 6.5, larg: 4.2, esp: 3.8, unidade: "cm" },
            peso_g: 45.7,
            n_fragmentos: 1,
            cor: "Cinza-escuro",
            consistencia: "Firme",
            textura: "Carnoso",
            superficie: "Irregular",
            lesoes_visiveis: "Massa brancacenta, 3.8 cm",
            margens: { status: "livres", distancia_mm: 15.2 },
            estruturas_associadas: "Pleura, brônquio",
            percent_tumoral: 70
        },
        micros: {
            tipo_tecido: "Pulmonar",
            padrao: "Maligno",
            grau_histologico: "Grau III",
            necrose: "Extensa",
            hemorragia: "Presente",
            inflamacao: "Moderada",
            fibrose: "Leve",
            calcificacao: "Ausente",
            invasao: { vascular: "Presente", linfatica: "Presente", perineural: "Ausente" },
            margens: "Livres",
            indices: { mitoses_por_campo: 18, ki67_percent: 45, celularidade: "Alta" }
        },
        conclusao: {
            diagnostico_final: "Carcinoma de pulmão de não pequenas células",
            grau_histologico: "III",
            estadiamento: { pT: "pT2a", pN: "pN1", pM: "pMx" },
            observacoes: "Oncologia para definição de tratamento adjuvante."
        },
        complementares: {
            coloracoes: [{ nome: "Mucicarmim", resultado: "Negativo" }],
            imunohistoquimica: [{ marcador: "TTF-1", resultado: "Positivo" }, { marcador: "p40", resultado: "Negativo" }],
            moleculares: []
        }
    },
    {
        id: "PX-I890",
        nome: "Juliana Ferreira",
        idade: 52,
        sexo: "Feminino",
        prontuario: "PRT-778945",
        convenio: "Bradesco Saúde",
        status: "concluido",
        medico: "Dr. Leonardo Mendes",
        cirurgiao: "—",
        hospital: "Santa Casa",
        data_coleta: "2025-10-17",
        data_recebimento: "2025-10-18",
        hipotese: "Pólipo endometrial",
        indicacao_cirurgica: "Histeroscopia",
        historia_clinica: "Sangramento uterino anormal.",
        macros: {
            tipo_material: "Biópsia",
            local_anatomico: "Endométrio",
            lateralidade: "—",
            fixacao: "Formol 10%",
            dimensoes: { comp: 2.1, larg: 0.8, esp: 0.6, unidade: "cm" },
            peso_g: 1.8,
            n_fragmentos: 2,
            cor: "Rosado",
            consistencia: "Mole",
            textura: "Homogênea",
            superficie: "Lisa",
            lesoes_visiveis: "Pólipo pediculado",
            margens: { status: "—", distancia_mm: null },
            estruturas_associadas: "—",
            percent_tumoral: 0
        },
        micros: {
            tipo_tecido: "Endometrial",
            padrao: "Benigno",
            grau_histologico: "—",
            necrose: "Ausente",
            hemorragia: "Focal",
            inflamacao: "Leve",
            fibrose: "Presente",
            calcificacao: "Ausente",
            invasao: { vascular: "Ausente", linfatica: "Ausente", perineural: "Ausente" },
            margens: "—",
            indices: { mitoses_por_campo: 2, ki67_percent: 5, celularidade: "Baixa" }
        },
        conclusao: {
            diagnostico_final: "Pólipo endometrial benigno",
            grau_histologico: "—",
            estadiamento: { pT: "—", pN: "—", pM: "—" },
            observacoes: "Controle ginecológico regular."
        },
        complementares: {
            coloracoes: [],
            imunohistoquimica: [],
            moleculares: []
        }
    },
    {
        id: "PX-J123",
        nome: "Ricardo Oliveira",
        idade: 48,
        sexo: "Masculino",
        prontuario: "PRT-992345",
        convenio: "Unimed",
        status: "em_processo",
        medico: "Dra. Patricia Almeida",
        cirurgiao: "Dr. Sergio Ramos",
        hospital: "Hospital das Clínicas",
        data_coleta: "2025-10-30",
        data_recebimento: "2025-10-31",
        hipotese: "Tumor de bexiga",
        indicacao_cirurgica: "Ressecção transuretral",
        historia_clinica: "Hematúria, tumor vesical em cistoscopia.",
        macros: {
            tipo_material: "Biópsia múltipla",
            local_anatomico: "Bexiga",
            lateralidade: "—",
            fixacao: "Formol 10%",
            dimensoes: { comp: 1.8, larg: 0.9, esp: 0.5, unidade: "cm" },
            peso_g: 2.3,
            n_fragmentos: 5,
            cor: "Rosado-acinzentado",
            consistencia: "Firme",
            textura: "Irregular",
            superficie: "Vilosa",
            lesoes_visiveis: "Lesão papilífera",
            margens: { status: "—", distancia_mm: null },
            estruturas_associadas: "Mucosa vesical",
            percent_tumoral: 40
        },
        micros: {
            tipo_tecido: "Urotelial",
            padrao: "Maligno",
            grau_histologico: "Grau II",
            necrose: "Ausente",
            hemorragia: "Focal",
            inflamacao: "Leve",
            fibrose: "Leve",
            calcificacao: "Ausente",
            invasao: { vascular: "Ausente", linfatica: "Ausente", perineural: "Ausente" },
            margens: "—",
            indices: { mitoses_por_campo: 6, ki67_percent: 15, celularidade: "Moderada" }
        },
        conclusao: {
            diagnostico_final: "Carcinoma urotelial papilífero de baixo grau",
            grau_histologico: "II",
            estadiamento: { pT: "pTa", pN: "pNx", pM: "pMx" },
            observacoes: "Cistoscopia de controle em 3 meses."
        },
        complementares: {
            coloracoes: [],
            imunohistoquimica: [{ marcador: "CK7", resultado: "Positivo" }, { marcador: "CK20", resultado: "Positivo" }],
            moleculares: []
        }
    }
];

// Estado da aplicação
let state = {
    pacientesFiltrados: [...pacientes],
    pacienteSelecionado: null,
    filtroAtivo: 'all',
    termoBusca: '',
    modoTeste: false,
    logEntries: [],
    indicadores: {
        precisao: 96.5,
        temperatura: 28,
        umidade: 42
    }
};

// Elementos DOM
const elements = {
    patientsList: document.getElementById('patientsList'),
    searchInput: document.getElementById('searchInput'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    emptyState: document.getElementById('emptyState'),
    identificacaoCard: document.getElementById('identificacaoCard'),
    clinicosCard: document.getElementById('clinicosCard'),
    macroscopiaCard: document.getElementById('macroscopiaCard'),
    microscopiaCard: document.getElementById('microscopiaCard'),
    conclusaoCard: document.getElementById('conclusaoCard'),
    complementaresCard: document.getElementById('complementaresCard'),
    controlesCard: document.getElementById('controlesCard'),
    indicadoresCard: document.getElementById('indicadoresCard'),
    identificacaoGrid: document.getElementById('identificacaoGrid'),
    clinicosGrid: document.getElementById('clinicosGrid'),
    macroscopiaContent: document.getElementById('macroscopiaContent'),
    microscopiaContent: document.getElementById('microscopiaContent'),
    conclusaoContent: document.getElementById('conclusaoContent'),
    complementaresContent: document.getElementById('complementaresContent'),
    btnIniciar: document.getElementById('btnIniciar'),
    btnEmRevisao: document.getElementById('btnEmRevisao'),
    btnConcluir: document.getElementById('btnConcluir'),
    logContainer: document.getElementById('logContainer'),
    indicatorsGrid: document.getElementById('indicatorsGrid'),
    lastUpdateTime: document.getElementById('lastUpdateTime'),
    updateNotice: document.getElementById('updateNotice'),
    themeToggle: document.getElementById('themeToggle'),
    mobileToggle: document.getElementById('mobileToggle'),
    patientsColumn: document.getElementById('patientsColumn'),
    overlay: document.getElementById('overlay'),
    closeSidebar: document.getElementById('closeSidebar')
};

// Função para enviar payload MQTT
function enviarMQTT() {
    if (!state.pacienteSelecionado) {
        console.warn('⚠️ Nenhum paciente selecionado');
        return;
    }

    // Preparar payload completo com todos os dados do paciente
    const payload = {
        timestamp: new Date().toISOString(),
        acao: 'iniciarAnalise',
        paciente: {
            // Identificação
            id: state.pacienteSelecionado.id,
            nome: state.pacienteSelecionado.nome,
            idade: state.pacienteSelecionado.idade,
            sexo: state.pacienteSelecionado.sexo,
            prontuario: state.pacienteSelecionado.prontuario,
            convenio: state.pacienteSelecionado.convenio,
            status: 'Analisando',

            // Dados administrativos
            medico: state.pacienteSelecionado.medico,
            cirurgiao: state.pacienteSelecionado.cirurgiao,
            hospital: state.pacienteSelecionado.hospital,
            data_coleta: state.pacienteSelecionado.data_coleta,
            data_recebimento: state.pacienteSelecionado.data_recebimento,

            // Dados clínicos
            hipotese: state.pacienteSelecionado.hipotese,
            indicacao_cirurgica: state.pacienteSelecionado.indicacao_cirurgica,
            historia_clinica: state.pacienteSelecionado.historia_clinica,

            // Macroscopia
            macroscopia: state.pacienteSelecionado.macros,

            // Microscopia
            microscopia: state.pacienteSelecionado.micros,

            // Conclusão diagnóstica
            conclusao: state.pacienteSelecionado.conclusao,

            // Exames complementares
            complementares: state.pacienteSelecionado.complementares
        },

        // Indicadores técnicos
        indicadores: {
            precisao: state.indicadores.precisao,
            temperatura: state.indicadores.temperatura,
            umidade: state.indicadores.umidade
        }
    };

    // Enviar payload para o tópico MQTT
    const payloadString = JSON.stringify(payload);

    if (mqttClient && mqttClient.connected) {
        mqttClient.publish(mqttConfig.topic, payloadString, { qos: 1 }, function (err) {
            if (err) {
                console.error('❌ Erro ao enviar MQTT:', err);
                adicionarLog('Erro ao enviar dados MQTT');
            } else {
                console.log('✅ Payload enviado para MQTT:', mqttConfig.topic);
                console.log('📦 Payload:', payload);
                adicionarLog(`Dados enviados para ${mqttConfig.topic}`);
            }
        });
    } else {
        console.warn('⚠️ Cliente MQTT não conectado. Tentando reconectar...');
        conectarMQTT();
        // Tentar enviar novamente após 2 segundos
        setTimeout(() => {
            if (mqttClient && mqttClient.connected) {
                mqttClient.publish(mqttConfig.topic, payloadString, { qos: 1 });
                console.log('✅ Payload enviado após reconexão');
                adicionarLog(`Dados enviados para ${mqttConfig.topic}`);
            }
        }, 2000);
    }
}

// Funções de utilidade (mantidas iguais)
function formatarData(dataStr) {
    if (!dataStr || dataStr === "—") return "—";
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
}

function getStatusIcon(status) {
    const icons = {
        em_processo: 'fas fa-microscope',
        em_revisao: 'fas fa-eye',
        concluido: 'fas fa-check'
    };
    return icons[status] || 'fas fa-circle';
}

function getStatusClass(status) {
    return `status-${status}`;
}

// Funções de cálculo (mantidas iguais)
function calcArea(dimensoes) {
    if (!dimensoes || !dimensoes.comp || !dimensoes.larg) return null;
    return dimensoes.comp * dimensoes.larg;
}

function calcVolume(dimensoes) {
    if (!dimensoes || !dimensoes.comp || !dimensoes.larg || !dimensoes.esp) return null;
    return dimensoes.comp * dimensoes.larg * dimensoes.esp;
}

function calcDensidade(peso, volume) {
    if (!peso || !volume || volume === 0) return null;
    return peso / volume;
}

function formatUnidade(valor, unidadeBase, tipo) {
    if (!valor) return null;

    if (unidadeBase === "mm") {
        if (tipo === "area") return { valor: valor / 100, unidade: "cm²" };
        if (tipo === "volume") return { valor: valor / 1000, unidade: "cm³" };
    }

    if (tipo === "area") return { valor, unidade: `${unidadeBase}²` };
    if (tipo === "volume") return { valor, unidade: `${unidadeBase}³` };

    return { valor, unidade: unidadeBase };
}

// Funções de renderização (mantidas iguais)
function renderizarListaPacientes() {
    elements.patientsList.innerHTML = '';

    if (state.pacientesFiltrados.length === 0) {
        elements.patientsList.innerHTML = `
    <div class="empty-state">
    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 10px;"></i>
    <p>Nenhum paciente encontrado</p>
    </div>
    `;
        return;
    }

    state.pacientesFiltrados.forEach(paciente => {
        const isSelected = state.pacienteSelecionado && state.pacienteSelecionado.id === paciente.id;
        const patientCard = document.createElement('div');
        patientCard.className = `patient-card ${isSelected ? 'selected' : ''}`;
        patientCard.dataset.id = paciente.id;

        patientCard.innerHTML = `
    <div class="patient-name">${paciente.nome}</div>
    <div class="patient-id">${paciente.id}</div>
    <div class="patient-status ${getStatusClass(paciente.status)}">
    <i class="${getStatusIcon(paciente.status)}"></i>
    <span>${paciente.status.replace('_', ' ')}</span>
    </div>
    `;

        patientCard.addEventListener('click', () => selecionarPaciente(paciente));
        elements.patientsList.appendChild(patientCard);
    });
}

function selecionarPaciente(paciente) {
    state.pacienteSelecionado = paciente;

    // Atualizar seleção visual
    document.querySelectorAll('.patient-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`.patient-card[data-id="${paciente.id}"]`).classList.add('selected');

    // Mostrar conteúdo do paciente
    elements.emptyState.classList.add('hidden');
    elements.identificacaoCard.classList.remove('hidden');
    elements.clinicosCard.classList.remove('hidden');
    elements.controlesCard.classList.remove('hidden');
    elements.indicadoresCard.classList.remove('hidden');

    // Preencher os dados básicos (sempre disponíveis)
    preencherIdentificacao(paciente);
    preencherDadosClinicos(paciente);

    // Controlar visibilidade dos dados conforme status
    controlarVisibilidadeDados(paciente.status);

    // Controlar botões conforme status
    controlarBotoesControle(paciente.status);

    // Fechar painel lateral em mobile/tablet
    if (window.innerWidth <= 1023) {
        fecharMenuMobile();
    }
}

function controlarVisibilidadeDados(status) {
    // Sempre mostrar identificação e dados clínicos
    elements.identificacaoCard.classList.remove('hidden');
    elements.clinicosCard.classList.remove('hidden');

    // Controlar visibilidade conforme status
    if (status === 'concluido' || status === 'em_revisao') {
        // Concluído ou Revisão: mostrar dados detalhados
        elements.macroscopiaCard.classList.remove('hidden');
        elements.microscopiaCard.classList.remove('hidden');
        elements.conclusaoCard.classList.remove('hidden');
        elements.complementaresCard.classList.remove('hidden');

        // Preencher os dados
        preencherMacroscopia(state.pacienteSelecionado);
        preencherMicroscopia(state.pacienteSelecionado);
        preencherConclusao(state.pacienteSelecionado);
        preencherComplementares(state.pacienteSelecionado);
    } else {
        // Em processo: ocultar dados detalhados
        elements.macroscopiaCard.classList.add('hidden');
        elements.microscopiaCard.classList.add('hidden');
        elements.conclusaoCard.classList.add('hidden');
        elements.complementaresCard.classList.add('hidden');

        // Mostrar mensagem de dados não disponíveis
        const mensagem = `
    <div class="unavailable-message">
    <i class="fas fa-lock"></i>
    <p>Dados disponíveis apenas para pacientes com status "Revisão" ou "Concluído"</p>
    </div>
    `;

        elements.macroscopiaContent.innerHTML = mensagem;
        elements.microscopiaContent.innerHTML = mensagem;
        elements.conclusaoContent.innerHTML = mensagem;
        elements.complementaresContent.innerHTML = mensagem;
    }
}

function controlarBotoesControle(status) {
    // Resetar todos os botões
    elements.btnIniciar.disabled = false;
    elements.btnEmRevisao.disabled = false;
    elements.btnConcluir.disabled = false;

    // Aplicar regras conforme status
    switch (status) {
        case 'em_processo':
            // Em processo
            elements.btnIniciar.disabled = true;
            elements.btnEmRevisao.disabled = true;
            elements.btnConcluir.disabled = true;
            break;

        case 'em_revisao':
            // Revisão
            elements.btnEmRevisao.disabled = true;
            break;

        case 'concluido':
            // Concluído
            elements.btnIniciar.disabled = true;
            elements.btnConcluir.disabled = true;
            break;
    }
}

function preencherIdentificacao(paciente) {
    elements.identificacaoGrid.innerHTML = `
    <div class="info-item">
    <span class="info-label">Nome</span>
    <span class="info-value">${paciente.nome}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Idade</span>
    <span class="info-value">${paciente.idade} anos</span>
    </div>
    <div class="info-item">
    <span class="info-label">Sexo</span>
    <span class="info-value">${paciente.sexo}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Prontuário</span>
    <span class="info-value">${paciente.prontuario}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Convênio</span>
    <span class="info-value">${paciente.convenio}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Protocolo</span>
    <span class="info-value">${paciente.id}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Médico</span>
    <span class="info-value">${paciente.medico}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Cirurgião</span>
    <span class="info-value">${paciente.cirurgiao}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Hospital</span>
    <span class="info-value">${paciente.hospital}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Data da coleta</span>
    <span class="info-value">${formatarData(paciente.data_coleta)}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Data do recebimento</span>
    <span class="info-value">${formatarData(paciente.data_recebimento)}</span>
    </div>
    `;
}

function preencherDadosClinicos(paciente) {
    elements.clinicosGrid.innerHTML = `
    <div class="info-item">
    <span class="info-label">Hipótese diagnóstica</span>
    <span class="info-value">${paciente.hipotese}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Indicação cirúrgica</span>
    <span class="info-value">${paciente.indicacao_cirurgica}</span>
    </div>
    <div class="info-item">
    <span class="info-label">História clínica</span>
    <span class="info-value">${paciente.historia_clinica}</span>
    </div>
    `;
}

function preencherMacroscopia(paciente) {
    const macros = paciente.macros;
    let html = `
    <div class="card-grid">
    <div class="info-item">
    <span class="info-label">Tipo de material</span>
    <span class="info-value">${macros.tipo_material}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Local anatômico</span>
    <span class="info-value">${macros.local_anatomico}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Lateralidade</span>
    <span class="info-value">${macros.lateralidade}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Fixação</span>
    <span class="info-value">${macros.fixacao}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Dimensões</span>
    <span class="info-value">
    ${macros.dimensoes.comp} × ${macros.dimensoes.larg} × ${macros.dimensoes.esp} ${macros.dimensoes.unidade}
    </span>
    </div>
    <div class="info-item">
    <span class="info-label">Peso</span>
    <span class="info-value">${macros.peso_g} g</span>
    </div>
    <div class="info-item">
    <span class="info-label">Nº de fragmentos</span>
    <span class="info-value">${macros.n_fragmentos}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Cor</span>
    <span class="info-value">${macros.cor}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Consistência</span>
    <span class="info-value">${macros.consistencia}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Textura</span>
    <span class="info-value">${macros.textura}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Superfície</span>
    <span class="info-value">${macros.superficie}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Lesões visíveis</span>
    <span class="info-value">${macros.lesoes_visiveis}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Margens</span>
    <span class="info-value">
    ${macros.margens.status} ${macros.margens.distancia_mm ? `(${macros.margens.distancia_mm} mm)` : ''}
    </span>
    </div>
    <div class="info-item">
    <span class="info-label">Estruturas associadas</span>
    <span class="info-value">${macros.estruturas_associadas}</span>
    </div>
    <div class="info-item">
    <span class="info-label">% Tumoral</span>
    <span class="info-value">${macros.percent_tumoral}%</span>
    </div>
    </div>
    `;

    // Cálculos derivados
    const area = calcArea(macros.dimensoes);
    const volume = calcVolume(macros.dimensoes);
    const densidade = calcDensidade(macros.peso_g, volume);

    const areaFormatada = formatUnidade(area, macros.dimensoes.unidade, "area");
    const volumeFormatada = formatUnidade(volume, macros.dimensoes.unidade, "volume");

    if (areaFormatada || volumeFormatada || densidade) {
        html += `<div class="badges-container">`;

        if (areaFormatada) {
            html += `<div class="badge"><i class="fas fa-ruler-combined"></i> Área: ${areaFormatada.valor.toFixed(2)} ${areaFormatada.unidade}</div>`;
        }

        if (volumeFormatada) {
            html += `<div class="badge"><i class="fas fa-cube"></i> Volume: ${volumeFormatada.valor.toFixed(2)} ${volumeFormatada.unidade}</div>`;
        }

        if (densidade) {
            html += `<div class="badge"><i class="fas fa-weight-scale"></i> Densidade: ${densidade.toFixed(3)} g/cm³</div>`;
        }

        html += `</div>`;
    }

    elements.macroscopiaContent.innerHTML = html;
}

function preencherMicroscopia(paciente) {
    const micros = paciente.micros;
    elements.microscopiaContent.innerHTML = `
    <div class="card-grid">
    <div class="info-item">
    <span class="info-label">Tipo de tecido</span>
    <span class="info-value">${micros.tipo_tecido}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Padrão</span>
    <span class="info-value">${micros.padrao}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Grau histológico</span>
    <span class="info-value">${micros.grau_histologico}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Necrose</span>
    <span class="info-value">${micros.necrose}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Hemorrhagia</span>
    <span class="info-value">${micros.hemorragia}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Inflamação</span>
    <span class="info-value">${micros.inflamacao}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Fibrose</span>
    <span class="info-value">${micros.fibrose}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Calcificação</span>
    <span class="info-value">${micros.calcificacao}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Invasão vascular</span>
    <span class="info-value">${micros.invasao.vascular}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Invasão linfática</span>
    <span class="info-value">${micros.invasao.linfatica}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Invasão perineural</span>
    <span class="info-value">${micros.invasao.perineural}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Margens</span>
    <span class="info-value">${micros.margens}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Mitoses por campo</span>
    <span class="info-value">${micros.indices.mitoses_por_campo}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Ki-67</span>
    <span class="info-value">${micros.indices.ki67_percent}%</span>
    </div>
    <div class="info-item">
    <span class="info-label">Cellularidade</span>
    <span class="info-value">${micros.indices.celularidade}</span>
    </div>
    </div>
    `;
}

function preencherConclusao(paciente) {
    const conclusao = paciente.conclusao;
    elements.conclusaoContent.innerHTML = `
    <div class="card-grid">
    <div class="info-item">
    <span class="info-label">Diagnóstico final</span>
    <span class="info-value">${conclusao.diagnostico_final}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Grau histológico</span>
    <span class="info-value">${conclusao.grau_histologico}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Estadiamento (pT)</span>
    <span class="info-value">${conclusao.estadiamento.pT}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Estadiamento (pN)</span>
    <span class="info-value">${conclusao.estadiamento.pN}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Estadiamento (pM)</span>
    <span class="info-value">${conclusao.estadiamento.pM}</span>
    </div>
    <div class="info-item">
    <span class="info-label">Observações</span>
    <span class="info-value">${conclusao.observacoes}</span>
    </div>
    </div>
    `;
}

function preencherComplementares(paciente) {
    const complementares = paciente.complementares;
    let html = '<div class="card-grid">';

    // Colorações especiais
    if (complementares.coloracoes.length > 0) {
        html += `
    <div class="info-item">
    <span class="info-label">Colorações especiais</span>
    <span class="info-value">
    ${complementares.coloracoes.map(c => `${c.nome}: ${c.resultado}`).join(', ')}
    </span>
    </div>
    `;
    }

    // Imunohistoquímica
    if (complementares.imunohistoquimica.length > 0) {
        html += `
    <div class="info-item">
    <span class="info-label">Imunohistoquímica</span>
    <span class="info-value">
    ${complementares.imunohistoquimica.map(i => `${i.marcador}: ${i.resultado}`).join(', ')}
    </span>
    </div>
    `;
    }

    // Testes moleculares
    if (complementares.moleculares.length > 0) {
        html += `
    <div class="info-item">
    <span class="info-label">Testes moleculares</span>
    <span class="info-value">
    ${complementares.moleculares.map(m => `${m.teste}: ${m.resultado}`).join(', ')}
    </span>
    </div>
    `;
    }

    if (!html.includes('info-item')) {
        html += `
    <div class="info-item">
    <span class="info-label">Complementares</span>
    <span class="info-value">Nenhum exame complementar registrado</span>
    </div>
    `;
    }

    html += '</div>';
    elements.complementaresContent.innerHTML = html;
}

// Funções de menu mobile
function abrirMenuMobile() {
    elements.patientsColumn.classList.add('active');
    elements.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function fecharMenuMobile() {
    elements.patientsColumn.classList.remove('active');
    elements.overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function toggleMenuMobile() {
    if (elements.patientsColumn.classList.contains('active')) {
        fecharMenuMobile();
    } else {
        abrirMenuMobile();
    }
}

// Funções de filtro e busca
function filtrarPacientes() {
    let resultados = [...pacientes];

    // Aplicar filtro de status
    if (state.filtroAtivo !== 'all') {
        resultados = resultados.filter(p => p.status === state.filtroAtivo);
    }

    // Aplicar busca
    if (state.termoBusca) {
        const termo = state.termoBusca.toLowerCase();
        resultados = resultados.filter(p =>
            p.nome.toLowerCase().includes(termo) ||
            p.id.toLowerCase().includes(termo)
        );
    }

    state.pacientesFiltrados = resultados;
    renderizarListaPacientes();
}

// Funções de log
function adicionarLog(acao) {
    const agora = new Date();
    const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const logEntry = {
        hora,
        acao,
        timestamp: agora.getTime()
    };

    state.logEntries.unshift(logEntry);

    // Manter apenas os últimos 10 registros
    if (state.logEntries.length > 10) {
        state.logEntries = state.logEntries.slice(0, 10);
    }

    renderizarLog();
}

function renderizarLog() {
    elements.logContainer.innerHTML = '';

    state.logEntries.forEach(entry => {
        if (!entry.acao) return;
        if (entry.acao == null) return;
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        logItem.innerHTML = `
    <i class="fas fa-clock"></i>
    <span>Comando "${entry.acao}" enviado à máquina Phase-X às ${entry.hora}.</span>
    `;
        elements.logContainer.appendChild(logItem);
    });
}

// Funções de indicadores técnicos
function atualizarIndicadores() {
    // Gerar valores plausíveis dentro das faixas
    state.indicadores.precisao = (94 + Math.random() * 5).toFixed(1);
    state.indicadores.temperatura = Math.floor(25 + Math.random() * 10);
    state.indicadores.umidade = Math.floor(38 + Math.random() * 7);

    renderizarIndicadores();

    // Atualizar horário
    const agora = new Date();
    const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    elements.lastUpdateTime.textContent = hora;

    // Mostrar aviso de atualização
    elements.updateNotice.style.display = 'flex';
    setTimeout(() => {
        elements.updateNotice.style.display = 'none';
    }, 5000);
}

function renderizarIndicadores() {
    elements.indicatorsGrid.innerHTML = `
    <div class="indicator-card">
    <i class="fas fa-bullseye indicator-icon"></i>
    <div class="indicator-value">${state.indicadores.precisao}%</div>
    <div class="indicator-label">Precisão da leitura</div>
    </div>
    <div class="indicator-card">
    <i class="fas fa-temperature-half indicator-icon"></i>
    <div class="indicator-value">${state.indicadores.temperatura}°C</div>
    <div class="indicator-label">Temperatura interna</div>
    </div>
    <div class="indicator-card">
    <i class="fas fa-droplet indicator-icon"></i>
    <div class="indicator-value">${state.indicadores.umidade}%</div>
    <div class="indicator-label">Umidade interna</div>
    </div>
    `;
}

// Funções de controle de status
function alterarStatus(novoStatus) {
    if (!state.pacienteSelecionado) return;

    // Atualizar status no array de pacientes
    const pacienteIndex = pacientes.findIndex(p => p.id === state.pacienteSelecionado.id);
    if (pacienteIndex !== -1) {
        pacientes[pacienteIndex].status = novoStatus;
        state.pacienteSelecionado.status = novoStatus;

        // Atualizar lista
        filtrarPacientes();

        // Atualizar visibilidade dos dados e botões
        controlarVisibilidadeDados(novoStatus);
        controlarBotoesControle(novoStatus);

        // Adicionar log
        const acoes = {
            em_processo: 'Iniciar Análise',
            em_revisao: 'Enviar para Revisão',
            concluido: 'Concluir'
        };

        adicionarLog(acoes[novoStatus]);
    }
}

// Inicialização
function inicializar() {
    // Conectar ao broker MQTT
    conectarMQTT();

    // Renderizar lista inicial
    renderizarListaPacientes();
    renderizarIndicadores();

    // Configurar eventos de busca
    let timeoutBusca;
    elements.searchInput.addEventListener('input', (e) => {
        state.termoBusca = e.target.value;
        clearTimeout(timeoutBusca);
        timeoutBusca = setTimeout(filtrarPacientes, 200);
    });

    // Configurar eventos de filtro
    elements.filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filtro = e.currentTarget.dataset.filter;

            // Atualizar estado dos botões
            elements.filterButtons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');

            // Aplicar filtro
            state.filtroAtivo = filtro;
            filtrarPacientes();
        });
    });

    // Configurar eventos de controle
    elements.btnIniciar.addEventListener('click', () => {
        alterarStatus('em_processo');
        enviarMQTT()
        setTimeout(() => {
            alterarStatus('a_revisar')
        }
            , 10000);
    });

    elements.btnEmRevisao.addEventListener('click', () => alterarStatus('em_revisao'));
    elements.btnConcluir.addEventListener('click', () => alterarStatus('concluido'));


    // Configurar toggle de tema
    elements.themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);

        // Atualizar ícone
        const icon = elements.themeToggle.querySelector('i');
        icon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    });

    // Configurar toggle mobile
    elements.mobileToggle.addEventListener('click', toggleMenuMobile);
    elements.overlay.addEventListener('click', fecharMenuMobile);
    elements.closeSidebar.addEventListener('click', fecharMenuMobile);

    // Fechar menu ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            fecharMenuMobile();
        }
    });

    // Configurar atualização automática de indicadores
    const intervalo = state.modoTeste ? 5000 : 30000; // 5s em teste, 5min em produção
    setInterval(atualizarIndicadores, intervalo);

    // Atualizar indicadores imediatamente
    atualizarIndicadores();

    // Ajustar layout na inicialização
    window.dispatchEvent(new Event('resize'));
}

// Iniciar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', inicializar);
