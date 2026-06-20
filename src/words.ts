import { WordData } from './types';

// Helper to remove Portuguese accents and casing
export function normalizeText(text: string): string {
  return text
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/Ç/g, 'C')
    .trim();
}

export const PORTUGUESE_WORDS: WordData[] = [
  // --- FÁCIL: PALAVRAS DE 4 LETRAS ---
  {
    word: 'CASA',
    category: 'Locais',
    clue: 'Construção onde as pessoas moram e vivem.',
    difficulty: 'fácil',
    explanation: 'Palavra muito comum de 4 letras que denota abrigo humano fundamental.'
  },
  {
    word: 'FOGO',
    category: 'Natureza',
    clue: 'Reação de combustão química acompanhada de calor e chamas.',
    difficulty: 'fácil',
    explanation: 'Termo básico e essencial de 4 letras que descreve um elemento elementar.'
  },
  {
    word: 'BOLA',
    category: 'Objetos',
    clue: 'Corpo esférico feito de couro ou borracha usado para jogar.',
    difficulty: 'fácil',
    explanation: 'Substantivo clássico usado na infância e em eventos esportivos.'
  },
  {
    word: 'VIDA',
    category: 'Natureza',
    clue: 'A existência orgânica de qualquer ser biológico vivo.',
    difficulty: 'fácil',
    explanation: 'Conceito existencial elementar com 4 letras ricas em vogais.'
  },
  {
    word: 'MESA',
    category: 'Objetos',
    clue: 'Móvel de tampo horizontal apoiado em pés, usado para refeições.',
    difficulty: 'fácil',
    explanation: 'Ferramenta de mobília muito habitual em lares e locais de trabalho.'
  },
  {
    word: 'SAPO',
    category: 'Animais',
    clue: 'Anfíbio saltador sem cauda de pele rugosa.',
    difficulty: 'fácil',
    explanation: 'Palavra animal clássica com vogais de fácil reconhecimento.'
  },
  {
    word: 'GATO',
    category: 'Animais',
    clue: 'Pequeno mamífero carnívoro domesticado, muito comum.',
    difficulty: 'fácil',
    explanation: 'Familiar animal fofo e ágil de 4 letras.'
  },
  {
    word: 'BOLO',
    category: 'Alimentos',
    clue: 'Doce de massa assada com recheio ou cobertura deliciosa.',
    difficulty: 'fácil',
    explanation: 'Destaque comum em brunches e eventos comemorativos infantis.'
  },
  {
    word: 'SUCO',
    category: 'Alimentos',
    clue: 'Líquido doce extraído de bagas ou frutos maduros.',
    difficulty: 'fácil',
    explanation: 'Bebida saudável muito comum e apreciada.'
  },
  {
    word: 'ROBÔ',
    category: 'Tecnologia',
    clue: 'Mecanismo cibernético encarregado de efetuar serviços autônomos.',
    difficulty: 'fácil',
    explanation: 'Variante aceita de 4 letras ideal para amantes de ficção científica.'
  },
  {
    word: 'CHIP',
    category: 'Tecnologia',
    clue: 'Pequena pastilha semicondutora onde há micropistas digitais.',
    difficulty: 'fácil',
    explanation: 'Conector cerebral de computadores e processamento celular.'
  },
  {
    word: 'DADO',
    category: 'Tecnologia',
    clue: 'Unidade bruta que alimenta sistemas de informação programáticos.',
    difficulty: 'fácil',
    explanation: 'Elemento fundamental de 4 letras que serve para formar informações.'
  },

  // --- DIFÍCIL: PALAVRAS DE 6 LETRAS ---
  {
    word: 'XADREZ',
    category: 'Objetos',
    clue: 'Jogo de tabuleiro altamente tático que simula um combate militar medieval.',
    difficulty: 'difícil',
    explanation: 'Do árabe "ash-shatranj". Contém as consoantes de alta complexidade X e Z.'
  },
  {
    word: 'BRONZE',
    category: 'Objetos',
    clue: 'Liga de cobre e estanho que marcou uma era inteira do progresso humano.',
    difficulty: 'difícil',
    explanation: 'Metal de liga com alta maleabilidade e o fonema com Z com terminação líquida.'
  },
  {
    word: 'PLANET',
    category: 'Natureza',
    clue: 'Enorme esfera gravitacional celeste orbitando um centro solar (grafia reduzida).',
    difficulty: 'difícil',
    explanation: 'Formato adaptado de 6 letras para designar corpos siderais orbitalmente dominantes.'
  },
  {
    word: 'COSMOS',
    category: 'Natureza',
    clue: 'O universo ordenado em oposição ao caos ancestral espalhado.',
    difficulty: 'difícil',
    explanation: 'Do grego antigo. Oferece o desafio de repetição da consoante sibilante S.'
  },
  {
    word: 'NÚCLEO',
    category: 'Tecnologia',
    clue: 'Carne centralizadora que abriga informações ou processadores integrados.',
    difficulty: 'difícil',
    explanation: 'Foco dinâmico com acentuação e terminação vocálica tripla complexa.'
  },
  {
    word: 'CEREJA',
    category: 'Alimentos',
    clue: 'Fruto pequeno esférico vermelho com sabor adocicado, usado em bolos.',
    difficulty: 'difícil',
    explanation: 'Fruta nobre com a combinação silábica CE-RE-JA de média complexidade.'
  },
  {
    word: 'BANANA',
    category: 'Alimentos',
    clue: 'Fruta tropical alongada rica em potássio com casca protectora amarela.',
    difficulty: 'difícil',
    explanation: 'Oferece um enorme desafio devido à excessiva repetição de NA-NA.'
  },
  {
    word: 'DRAGÃO',
    category: 'Animais',
    clue: 'Monstro lendário cuspidor de jatos de labaredas e escamas coriáceas.',
    difficulty: 'difícil',
    explanation: 'Répteis imaginários com acentos e encontro nasal Ã-O na cauda da string.'
  },
  {
    word: 'PIGMEU',
    category: 'Animais',
    clue: 'Indivíduo ou animal caracterizado por sua estatura reduzida peculiar.',
    difficulty: 'difícil',
    explanation: 'Contém fonemas mistos e terminação ditongada de alta complexidade.'
  },
  {
    word: 'FUTURO',
    category: 'Tecnologia',
    clue: 'O horizonte temporal adiante, moldado e arquitetado pela computação.',
    difficulty: 'difícil',
    explanation: 'Conceito utópico de 6 letras que designa o porvir científico.'
  },

  // NATUREZA/CIÊNCIA
  {
    word: 'TERRA',
    category: 'Natureza',
    clue: 'O terceiro planeta a partir do Sol, cheio de oceanos e vida.',
    difficulty: 'fácil',
    explanation: 'A palavra \"TERRA\" origina-se do latim \"tellus\" ou \"terra\". Representa o solo arável, a geologia terrestre ou o próprio planeta em que habitamos. É extremamente comum e serve como excelente ponto de partida no Termo.'
  },
  {
    word: 'PEDRA',
    category: 'Natureza',
    clue: 'Corpo sólido e duro, formado por minerais abundantes na crosta.',
    difficulty: 'fácil',
    explanation: 'Do grego \"petra\". Refere-se a qualquer fragmento rochoso. É uma palavra balanceada geograficamente e rica em consoantes plosivas como P e D.'
  },
  {
    word: 'FOLHA',
    category: 'Natureza',
    clue: 'Órgão das plantas, geralmente verde e chato, essencial para fotosíntese.',
    difficulty: 'médio',
    explanation: 'Origem no latim \"folia\". Representa a unidade fotossexuada básica das plantas vasculares. Contém o dígrafo \"LH\", oferecendo um desafio intermediário.'
  },
  {
    word: 'CHUVA',
    category: 'Natureza',
    clue: 'Precipitação de água líquida caindo das nuvens na atmosfera.',
    difficulty: 'fácil',
    explanation: 'Do latim \"pluvia\". Essencial para a sobrevivência da biota. Apresenta o dígrafo \"CH\" e vogais altamente frequentes.'
  },
  {
    word: 'VENTO',
    category: 'Natureza',
    clue: 'Fluxo de gases em grande escala terrestre; o ar em movimento natural.',
    difficulty: 'fácil',
    explanation: 'Do latim \"ventus\". Corrente atmosférica gerada por diferenciais de pressão barométrica.'
  },
  {
    word: 'CLIMA',
    category: 'Natureza',
    clue: 'Conjunto de condições atmosféricas que caracterizam uma região.',
    difficulty: 'médio',
    explanation: 'Do grego \"klima\" (inclinação solar). Representa as médias de longo prazo de temperatura, umidade e ventos.'
  },
  {
    word: 'FLORA',
    category: 'Natureza',
    clue: 'Conjunto de plantas de uma determinada região ou período geológico.',
    difficulty: 'médio',
    explanation: 'Do latim \"Flora\", deusa das flores. Representa toda a biomassa vegetal de um bioma específico.'
  },
  {
    word: 'NUVEM',
    category: 'Natureza',
    clue: 'Conjunto visível de partículas minúsculas de água líquida suspensas.',
    difficulty: 'fácil',
    explanation: 'Do latim \"nubes\". Acúmulo hidrológico que desempenha papel fundamental na reflexão solar.'
  },

  // ANIMAIS
  {
    word: 'GATO',
    category: 'Animais',
    clue: 'Pequeno felino carnívoro domesticado, ágil e muito carinhoso (ou independente).',
    difficulty: 'fácil',
    explanation: 'Palavra de quatro letras estendida para cinco: \"GATOS\" ou o feminino \"GATAS\" (substituída por \"TIGRE\" ou \"PEIXE\"). Usamos a variante normalizada de 5 letras \"TIGRE\".'
  },
  {
    word: 'TIGRE',
    category: 'Animais',
    clue: 'Grande felino asiático listrado de preto e laranja, predador supremo.',
    difficulty: 'fácil',
    explanation: 'Do grego \"tigris\". Maior espécie de felídeo vivo do gênero Panthera.'
  },
  {
    word: 'PEIXE',
    category: 'Animais',
    clue: 'Animal vertebrado aquático, que respira por guelras e possui nadadeiras.',
    difficulty: 'fácil',
    explanation: 'Do latim \"piscis\". Possui o dígrafo silábico do português e o incomum caractere \"X\".'
  },
  {
    word: 'LEZMA',
    category: 'Animais',
    clue: 'Molusco terrestre lento, que deixa um rastro brilhante de muco por onde passa.',
    difficulty: 'difícil',
    explanation: 'Variante aceita de lesma (grafada ordinariamente com S, mas oferecendo o desafio de \"LESMA\"). Letras bem distribuídas.'
  },
  {
    word: 'LESMA',
    category: 'Animais',
    clue: 'Molusco gastrópode terrestre, lento e sem concha externa.',
    difficulty: 'médio',
    explanation: 'Do latim vulgar \"limax\". Animal hermafrodita pulmonado de movimentação por contrações musculares podais.'
  },
  {
    word: 'CISNE',
    category: 'Animais',
    clue: 'Ave aquática de pescoço longo, famosa por sua elegância.',
    difficulty: 'médio',
    explanation: 'Ave da família Anatidae pertencente ao gênero Cygnus, muito referenciada em fábulas literárias.'
  },
  {
    word: 'COBRA',
    category: 'Animais',
    clue: 'Répteis ápodes de corpo alongado, algumas espécies injetam veneno.',
    difficulty: 'fácil',
    explanation: 'Do latim \"colubra\". Serpentes carnívoras de alta distribuição planetária.'
  },
  {
    word: 'CEGON',
    category: 'Animais',
    clue: 'Ave pernalta de grande porte que a lenda diz trazer bebês.',
    difficulty: 'difícil',
    explanation: 'Grafada como \"CEGONHA\" adaptada em 5 letras como \"CEGON\" (ou alterada para \"ZEBRA\" para melhor ortografia).'
  },
  {
    word: 'ZEBRA',
    category: 'Animais',
    clue: 'Mamífero africano conhecido por suas listras verticais contrastantes.',
    difficulty: 'fácil',
    explanation: 'Mamífero perissodáctilo caracterizado pelo pelo listrado preto e branco alternante.'
  },
  {
    word: 'ÁGUIA',
    category: 'Animais',
    clue: 'Ave de rapina impressionante, com visão aguçada e majestosa.',
    difficulty: 'médio',
    explanation: 'Do latim \"aquila\". Famosa pela quantidade excepcional de vogais adjacentes, incluindo o dígrafo \"GU\".'
  },

  // ALIMENTOS/OBJETOS
  {
    word: 'PRATO',
    category: 'Objetos',
    clue: 'Utensílio circular côncavo usado para servir e comer alimentos.',
    difficulty: 'fácil',
    explanation: 'Do latim tardio \"plattus\" (chato). Utensílio de mesa indispensável na gastronomia.'
  },
  {
    word: 'LIVRO',
    category: 'Objetos',
    clue: 'Conjunto de folhas de papel impressas e encadernadas com conteúdo literário.',
    difficulty: 'fácil',
    explanation: 'Do latim \"liber\". Principal vetor histórico de transmissão de conhecimento cognitivo estruturado.'
  },
  {
    word: 'COPO',
    category: 'Objetos',
    clue: 'Recipiente cilíndrico geralmente de vidro para beber líquidos.',
    difficulty: 'fácil',
    explanation: 'Do latim \"cuppus\". Uma das ferramentas mais antigas para transporte e sorvimento hídrico.'
  },
  {
    word: 'CHAVE',
    category: 'Objetos',
    clue: 'Instrumento metálico pequeno usado para acionar trincos ou fechaduras.',
    difficulty: 'fácil',
    explanation: 'Do latim \"clavis\". Metáfora universal para acesso, soluções e decodificação analítica.'
  },
  {
    word: 'GARFO',
    category: 'Objetos',
    clue: 'Utensílio de mesa com dentes pontiagudos usado para espetar comida.',
    difficulty: 'fácil',
    explanation: 'Possível empréstimo do árabe \"gurf\" ou derivação mecânica. Revolucionou a etiqueta ocidental na Idade Média.'
  },
  {
    word: 'PUDIM',
    category: 'Alimentos',
    clue: 'Sobremesa doce e macia, frequentemente feita com leite condensado e calda de caramelo.',
    difficulty: 'médio',
    explanation: 'Sobremesa tradicional com cozimento em banho-maria. Uma palavra muito doce no Termo.'
  },
  {
    word: 'ARROZ',
    category: 'Alimentos',
    clue: 'Grão que constitui a base da alimentação em grande parte do mundo.',
    difficulty: 'fácil',
    explanation: 'Do árabe \"ar-ruzz\". Gramínea domesticada que nutre mais da metade da população global humana.'
  },
  {
    word: 'LIMÃO',
    category: 'Alimentos',
    clue: 'Fruta cítrica muito ácida, amarela ou verde, usada em temperos e bebidas.',
    difficulty: 'médio',
    explanation: 'Fruto rico em ácido cítrico. O suco possui pH de aproximadamente 2,2.'
  },
  {
    word: 'PINTO',
    category: 'Animais',
    clue: 'Filhote de galinha recém-nascido, coberto de penugem amarela.',
    difficulty: 'fácil',
    explanation: 'Denominação jovem da ave Gallus gallus domesticus.'
  },
  {
    word: 'PIZZA',
    category: 'Alimentos',
    clue: 'Disco de massa assado, coberto com molho de tomate, queijo e outros ingredientes.',
    difficulty: 'médio',
    explanation: 'Especialidade de origem italiana, mundialmente consumida. Exibe a incomum repetição da letra \"Z\".'
  },

  // TECNOLOGIA/CIÊNCIA/GÉNERO
  {
    word: 'ROBÔ',
    category: 'Tecnologia',
    clue: 'Dispositivo autônomo mecânico controlado por software para realizar tarefas.',
    difficulty: 'fácil',
    explanation: 'Introduzido pelo escritor Karel Capek em 1920 (do tcheco \"robota\" - trabalho escravo). Representa a automação de processos.'
  },
  {
    word: 'MOUSE',
    category: 'Tecnologia',
    clue: 'Dispositivo apontador periférico usado em computadores para navegar a GUI.',
    difficulty: 'médio',
    explanation: 'Palavra anglicizada de uso universal em TI. Facilita interações bidimensionais em telas digitais.'
  },
  {
    word: 'DADOS',
    category: 'Tecnologia',
    clue: 'Unidade básica de informação bruta sem contexto (plural de dado).',
    difficulty: 'fácil',
    explanation: 'Do latim \"datum\" (dado/oferecido). Na computação, representa os bits armazenados na memória.'
  },
  {
    word: 'TELAS',
    category: 'Tecnologia',
    clue: 'Superfícies de exibição de imagens em monitores, TVs ou celulares (plural).',
    difficulty: 'médio',
    explanation: 'Interfaces físico-químicas de cristal líquido, AMOLED ou fósforo ativo que emitem luz.'
  },
  {
    word: 'FÍSICA',
    category: 'Natureza',
    clue: 'Ciência que estuda a matéria, energia, espaço e tempo naturais.',
    difficulty: 'difícil',
    explanation: 'Adaptada para 5 letras como \"FISIC\" ou o nome da própria disciplina \"FISIA\" (usamos \"FISIO\" para combinar com fisiologia ou a palavra \"FOCAL\"). Usaremos \"FOCAL\".'
  },
  {
    word: 'FOCAL',
    category: 'Tecnologia',
    clue: 'Relativo ao ponto em que convergem raios luminosos em uma lente.',
    difficulty: 'difícil',
    explanation: 'Termo crucial na engenharia ótica e projetos de câmeras/telescópios.'
  },
  {
    word: 'NÚCLEO',
    category: 'Tecnologia',
    clue: 'Centro de uma célula orgânica, de um átomo ou processador digital.',
    difficulty: 'médio',
    explanation: 'Do latim \"nucleus\". Contém as estruturas fundamentais ou núcleos de computação.'
  },
  {
    word: 'NIVEL',
    category: 'Tecnologia',
    clue: 'Patamar de altura, status ou complexidade de um sistema ou jogo.',
    difficulty: 'fácil',
    explanation: 'Do latim vulgar \"libella\". Escala de progressão hierárquica.'
  },

  // LUGARES/GERAIS
  {
    word: 'BRISA',
    category: 'Natureza',
    clue: 'Vento suave, fresco e de baixa intensidade, comum no litoral de tarde.',
    difficulty: 'médio',
    explanation: 'Vento costeiro gerado pelas diferenças térmicas entre a terra firme e a massa d\'água oceânica.'
  },
  {
    word: 'HOTEL',
    category: 'Locais',
    clue: 'Estabelecimento que oferece hospedagem temporária mediante pagamento.',
    difficulty: 'fácil',
    explanation: 'Do francês antigo \"hostel\". Estrutura urbana otimizada para turismo e viagens de negócios.'
  },
  {
    word: 'PRAIA',
    category: 'Locais',
    clue: 'Faixa de areia ou pedregulhos à beira de um oceano, lago ou rio marítimo.',
    difficulty: 'fácil',
    explanation: 'Do latim tardio \"plagia\". Região litorânea de grande atração turística mundial.'
  },
  {
    word: 'TORRE',
    category: 'Locais',
    clue: 'Estrutura alta vertical, construída para defesa, comunicação ou estética.',
    difficulty: 'fácil',
    explanation: 'Do latim \"turris\". Famosa pela repetição do \"R\" e ampla aplicação arquitetônica histórica.'
  },
  {
    word: 'MUSEU',
    category: 'Locais',
    clue: 'Instituição dedicada à coleta, conservação e exibição de obras e objetos históricos.',
    difficulty: 'médio',
    explanation: 'Do grego \"mouseion\" (templo das musas). Espaço histórico-cultural público de educação.'
  },
  {
    word: 'SELVA',
    category: 'Natureza',
    clue: 'Floresta tropical densa e impenetrável repleta de flora abundante.',
    difficulty: 'fácil',
    explanation: 'Do latim \"silva\". Ecossistema terrestre de altíssima biodiversidade e umidade.'
  },
  {
    word: 'ARENA',
    category: 'Locais',
    clue: 'Estádio ou recinto circular onde ocorrem competições, combates ou espetáculos.',
    difficulty: 'fácil',
    explanation: 'Do latim \"harena\" (areia que cobria o piso dos anfiteatros romanos). Espaço contemporâneo de entretenimento.'
  },
  {
    word: 'CAMPO',
    category: 'Locais',
    clue: 'Área aberta de terra sem florestas, usada para agricultura ou esportes.',
    difficulty: 'fácil',
    explanation: 'Do latim \"campus\". Área rural agricultável ou extensão planar.'
  }
];

export const ENGLISH_WORDS: WordData[] = [
  // --- EASY: 4-LETTER WORDS ---
  {
    word: 'HOME',
    category: 'Places',
    clue: 'The place where one lives permanently and feels sheltered.',
    difficulty: 'fácil',
    explanation: 'A fundamental 4-letter word describing a sanctuary or dwelling space.'
  },
  {
    word: 'FIRE',
    category: 'Nature',
    clue: 'Combustion reaction producing heat, bright light, and flames.',
    difficulty: 'fácil',
    explanation: 'An elemental 4-letter concept essential to primitive human survival.'
  },
  {
    word: 'GAME',
    category: 'Objects',
    clue: 'An interactive activity designed for amusement or competitiveness.',
    difficulty: 'fácil',
    explanation: 'A basic 4-letter word fitting perfectly for our Wordle terminal clone!'
  },
  {
    word: 'WIND',
    category: 'Nature',
    clue: 'The natural kinetic movement of air atmospheric currents.',
    difficulty: 'fácil',
    explanation: 'Extremely common 4-letter word relating to pressure displacements.'
  },
  {
    word: 'TREE',
    category: 'Nature',
    clue: 'A tall woody botanical plant structure with branches and green leaves.',
    difficulty: 'fácil',
    explanation: 'Features double vowels (EE) providing an easy entry layout.'
  },
  {
    word: 'BOOK',
    category: 'Objects',
    clue: 'A written or printed medium with bound dynamic pages of records.',
    difficulty: 'fácil',
    explanation: 'Includes repeating O vowels that are highly recurring.'
  },
  {
    word: 'LION',
    category: 'Animals',
    clue: 'Large feline predator native to savannahs, crowned king of beasts.',
    difficulty: 'fácil',
    explanation: 'Simple 4-letter animal name with high distribution of key vowels.'
  },
  {
    word: 'FISH',
    category: 'Animals',
    clue: 'A limbed aquatic organism with gills that lives permanently underwater.',
    difficulty: 'fácil',
    explanation: 'Common animal with the standard English digraph "SH".'
  },
  {
    word: 'CAKE',
    category: 'Foods',
    clue: 'A sweet baked item made of flour, eggs, and dynamic frosting.',
    difficulty: 'fácil',
    explanation: 'A highly predictable, delightful culinary dessert of 4 letters.'
  },
  {
    word: 'MILK',
    category: 'Foods',
    clue: 'Opaque white nutrient-rich liquid secreted by female mammals.',
    difficulty: 'fácil',
    explanation: 'Primary source of nourishment with distinct consonants M and K.'
  },
  {
    word: 'DATA',
    category: 'Tech',
    clue: 'Raw factual segments compiled by automated logic devices.',
    difficulty: 'fácil',
    explanation: 'Core computing concept of 4 letters with repeating vowel A.'
  },
  {
    word: 'BYTE',
    category: 'Tech',
    clue: 'A base group of binary digits (usually eight) processed as a unit.',
    difficulty: 'fácil',
    explanation: 'Computer science standard unit containing rare consonant Y.'
  },

  // --- HARD: 6-LETTER WORDS ---
  {
    word: 'WIZARD',
    category: 'Objects',
    clue: 'A person who is believed to have magical powers, typically depicted with a staff.',
    difficulty: 'difícil',
    explanation: 'An advanced 6-letter word with highly rare letters like W and Z.'
  },
  {
    word: 'OXYGEN',
    category: 'Nature',
    clue: 'An odorless reactive gaseous element critical for biological respiration.',
    difficulty: 'difícil',
    explanation: 'A complex biochemical term with low-frequency characters X and Y.'
  },
  {
    word: 'MATRIX',
    category: 'Tech',
    clue: 'A multi-dimensional grid of numeric data cells or a simulated cyber reality.',
    difficulty: 'difícil',
    explanation: 'A sci-fi favorite featuring the extremely challenging character X.'
  },
  {
    word: 'COSMOS',
    category: 'Nature',
    clue: 'The vast, structured system of the interstellar universe.',
    difficulty: 'difícil',
    explanation: 'Double sibilant S distribution creates complex matching conditions.'
  },
  {
    word: 'BRONZE',
    category: 'Objects',
    clue: 'An alloy composed mainly of copper, historically marking a key age.',
    difficulty: 'difícil',
    explanation: 'Contains the highly distinct terminal vowel combination with Z.'
  },
  {
    word: 'SHADOW',
    category: 'Nature',
    clue: 'A dark shape produced by a body blocking rays of incoming light.',
    difficulty: 'difícil',
    explanation: 'Features dual digraphs (SH and OW) for advanced players.'
  },
  {
    word: 'DRAGON',
    category: 'Animals',
    clue: 'A legendary reptilian monster with physical scales, wings, and breath of fire.',
    difficulty: 'difícil',
    explanation: 'A strong 6-letter keyword with standard, yet challenging, arrangements.'
  },
  {
    word: 'HYBRID',
    category: 'Tech',
    clue: 'A mixture of separate components, architectures, or engine modes.',
    difficulty: 'difícil',
    explanation: 'Includes uncommon letters Y and B in a complex consonant frame.'
  },
  {
    word: 'CYPHER',
    category: 'Tech',
    clue: 'An algorithmic key or encrypted pattern of coding lines.',
    difficulty: 'difícil',
    explanation: 'Cryptocoding jargon featuring Y and PH digraph configuration.'
  },
  {
    word: 'QUARTZ',
    category: 'Nature',
    clue: 'A hard crystalline mineral composed of silicon and oxygen silicones.',
    difficulty: 'difícil',
    explanation: 'Extremely difficult setup containing both uncommon letters Q and Z.'
  },

  // NATURE/SCIENCE
  {
    word: 'EARTH',
    category: 'Nature',
    clue: 'The third planet from the Sun, mostly covered in water, supporting life.',
    difficulty: 'fácil',
    explanation: 'Derived from Old English \"eorthe\". The cosmic harbor of our species. Rich in extremely helpful vowels (E, A) and consonants (R, T, H).'
  },
  {
    word: 'STONE',
    category: 'Nature',
    clue: 'A non-metallic mineral matter of which rocks are made.',
    difficulty: 'fácil',
    explanation: 'A fundamental word in English Wordle due to its extremely common set of characters (S, T, O, N, E), capturing the perfect vowels and constraints.'
  },
  {
    word: 'CLOUD',
    category: 'Nature',
    clue: 'A visible mass of condensed water vapor floating in the atmosphere.',
    difficulty: 'fácil',
    explanation: 'From Old English \"clud\". Atmospheric mass that drives precipitation and filters sunlight.'
  },
  {
    word: 'STORM',
    category: 'Nature',
    clue: 'A violent disturbance of the atmosphere with strong winds, rain, or thunder.',
    difficulty: 'médio',
    explanation: 'Meteorological event caused by deep low-pressure systems.'
  },
  {
    word: 'PLANT',
    category: 'Nature',
    clue: 'A living organism of the vegetable kingdom, typically growing in a permanent site.',
    difficulty: 'fácil',
    explanation: 'From Latin \"planta\". Autotrophic eukaryotic organisms forming the photosynthetic core of ecosystems.'
  },

  // ANIMALS
  {
    word: 'TIGER',
    category: 'Animals',
    clue: 'A large solitary striped feline, the heaviest of the big cats.',
    difficulty: 'fácil',
    explanation: 'The majestic striped apex carnivore Panthera tigris, found in Asian jungles.'
  },
  {
    word: 'EAGLE',
    category: 'Animals',
    clue: 'A large bird of prey with massive wingspan and incredible keen eyesight.',
    difficulty: 'médio',
    explanation: 'Raptorial birds in the family Accipitridae, high-altitude apex flyers.'
  },
  {
    word: 'SHARK',
    category: 'Animals',
    clue: 'A large marine fish with multiple rows of teeth and a cartilaginous skeleton.',
    difficulty: 'médio',
    explanation: 'Cartilaginous apex predators patrolling global oceans for millions of years.'
  },
  {
    word: 'SNAKE',
    category: 'Animals', // Modified from Reptiles for simplicity
    clue: 'A long, legless reptile that can sometimes inject venom.',
    difficulty: 'fácil',
    explanation: 'Elongated limbless carnivorous reptiles of the suborder Serpentes.'
  },
  {
    word: 'KOALA',
    category: 'Animals',
    clue: 'A small furry Australian marsupial that feeds almost exclusively on eucalyptus leaves.',
    difficulty: 'difícil',
    explanation: 'Arboreal herbivorous marsupial native to Australia, famous for low-metabolism sleeps.'
  },

  // OBJECTS/FOODS
  {
    word: 'BREAD',
    category: 'Foods',
    clue: 'A food made from flour, water, and yeast mixture, then baked in ovens.',
    difficulty: 'fácil',
    explanation: 'The oldest staple food of humankind, essential in agricultural civilizations.'
  },
  {
    word: 'PLATE',
    category: 'Objects',
    clue: 'A flat, dish-like utensil on which food is served and eaten.',
    difficulty: 'fácil',
    explanation: 'From Medieval Latin \"plata\". Essential item of tableware.'
  },
  {
    word: 'CLOCK',
    category: 'Objects',
    clue: 'An instrument used for measuring, verifying, and keeping track of time.',
    difficulty: 'fácil',
    explanation: 'From Middle Dutch \"clocke\". Device calculating entropy and tracking standard time coordinates.'
  },
  {
    word: 'CHAIR',
    category: 'Objects',
    clue: 'A piece of furniture for sitting on, typically having four legs and a backrest.',
    difficulty: 'fácil',
    explanation: 'From Greek \"kathedra\" via French. Fundamental ergonomic furniture piece.'
  },
  {
    word: 'PIZZA',
    category: 'Foods',
    clue: 'An oven-baked flatbread topped with tomato marinara sauce and mozzarella cheese.',
    difficulty: 'médio',
    explanation: 'A globally adored Culinary masterpiece originally from Naples, Italy.'
  },

  // TECH/SCIENCE
  {
    word: 'ROBOT',
    category: 'Tech',
    clue: 'A machine capable of carrying out a complex series of actions automatically.',
    difficulty: 'fácil',
    explanation: 'From Czech \"robota\" (forced labor), coined by Capek. Embodies software-driven kinetic motion.'
  },
  {
    word: 'MOUSE',
    category: 'Tech',
    clue: 'A small handheld device that controls a cursor on a display screen.',
    difficulty: 'fácil',
    explanation: 'Input peripheral invented by Douglas Engelbart, resembling a small rodent.'
  },
  {
    word: 'PIXEL',
    category: 'Tech',
    clue: 'The smallest single controllable element of a picture represented on screen.',
    difficulty: 'difícil',
    explanation: 'Coined from \"picture element\" (pix-el). The atomic structural unit of modern raster displays.'
  },
  {
    word: 'LOGIC',
    category: 'Tech',
    clue: 'Reasoning conducted or assessed according to strict principles of validity.',
    difficulty: 'médio',
    explanation: 'From Greek \"logos\". The mathematical and philosophical bedrock of automated state gates and processors.'
  },
  {
    word: 'MICRO',
    category: 'Tech',
    clue: 'Extremely small scale or prefix representing one-millionth unit.',
    difficulty: 'difícil',
    explanation: 'Greek prefix \"mikros\" indicating miniature scale, critical in microprocessors.'
  },

  // PLACES/PLACES
  {
    word: 'HOTEL',
    category: 'Places',
    clue: 'An establishment providing paid lodging, meals, and customer services on a short-term basis.',
    difficulty: 'fácil',
    explanation: 'Overnight resting facility for global tourists and traveling professionals.'
  },
  {
    word: 'BEACH',
    category: 'Places',
    clue: 'A sandy or pebbly shore by the ocean, sea, or lakeside.',
    difficulty: 'fácil',
    explanation: 'Coastal buffer zone formed of loose granular sand sediment deposited by waves.'
  },
  {
    word: 'TOWER',
    category: 'Places',
    clue: 'A tall narrow structure standing alone or forming part of a castle/building.',
    difficulty: 'fácil',
    explanation: 'From Latin \"turris\". Vertical accentuation maximizing structural overview and defensibility.'
  },
  {
    word: 'HOUSE',
    category: 'Places',
    clue: 'A building that serves as a living space for human beings.',
    difficulty: 'fácil',
    explanation: 'A cozy dwelling protecting biological nodes from microclimatic pressure.'
  },
  {
    word: 'OCEAN',
    category: 'Nature',
    clue: 'A vast body of saltwater that covers almost three-quarters of the Earth.',
    difficulty: 'médio',
    explanation: 'High volume hydration mass of critical relevance for planetary homeostasis.'
  }
];

export function getWordsByLanguage(lang: 'pt' | 'en'): WordData[] {
  return lang === 'pt' 
    ? [...PORTUGUESE_WORDS, ...EXTRA_PORTUGUESE_WORDS] 
    : [...ENGLISH_WORDS, ...EXTRA_ENGLISH_WORDS];
}

/**
 * Returns a word data based on configuration.
 * Uses selected difficulty and temperature to select words.
 * - Easy: 4 letters, highly common characters
 * - Medium: 5 letters, standard mixed frequency
 * - Hard: 6 letters, rare characters, complex patterns
 */
export function generateWordOffline(
  lang: 'pt' | 'en',
  category: string,
  temp: number,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): WordData {
  let usedWordsHistory: string[] = [];
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem('termo_used_words_history');
      if (raw) {
        const parsed: { word: string; timestamp: number }[] = JSON.parse(raw);
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;
        usedWordsHistory = parsed
          .filter(r => now - r.timestamp < oneDayMs)
          .map(r => r.word.toUpperCase());
      }
    } catch (e) {
      console.error('Error reading word history', e);
    }
  }

  const dictionary = getWordsByLanguage(lang);
  let candidates = dictionary;

  // Filter based on selected difficulty target word length:
  // Easy: 4 letters. Medium: 5 letters. Hard: 6 letters.
  const targetLength = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;
  candidates = dictionary.filter((w) => w.word.length === targetLength);

  // Filter by category if specified and valid
  const cleanCat = category.trim().toLowerCase();
  if (cleanCat && cleanCat !== 'all' && cleanCat !== 'qualquer' && cleanCat !== 'todos') {
    candidates = candidates.filter(
      (w) => w.category.toLowerCase() === cleanCat ||
             // support bilingual selection translates
             (cleanCat === 'natureza' && w.category.toLowerCase() === 'nature') ||
             (cleanCat === 'nature' && w.category.toLowerCase() === 'natureza') ||
             (cleanCat === 'animais' && w.category.toLowerCase() === 'animals') ||
             (cleanCat === 'animals' && w.category.toLowerCase() === 'animais') ||
             (cleanCat === 'alimentos' && w.category.toLowerCase() === 'foods') ||
             (cleanCat === 'foods' && w.category.toLowerCase() === 'alimentos') ||
             (cleanCat === 'objetos' && w.category.toLowerCase() === 'objects') ||
             (cleanCat === 'objects' && w.category.toLowerCase() === 'objetos') ||
             (cleanCat === 'locais' && w.category.toLowerCase() === 'places') ||
             (cleanCat === 'places' && w.category.toLowerCase() === 'locais') ||
             (cleanCat === 'tecnologia' && w.category.toLowerCase() === 'tech') ||
             (cleanCat === 'tech' && w.category.toLowerCase() === 'tecnologia')
    );
  }

  // Filter out recently used words
  let availableCandidates = candidates.filter(w => !usedWordsHistory.includes(w.word.toUpperCase()));
  if (availableCandidates.length === 0) {
    // If all candidates in this specific category or difficulty are used, fallback to standard candidates
    availableCandidates = candidates;
  }

  if (availableCandidates.length === 0) {
    // fallback to just length filtering if no words in this category have this length
    const lengthCandidates = dictionary.filter((w) => w.word.length === targetLength);
    availableCandidates = lengthCandidates.filter(w => !usedWordsHistory.includes(w.word.toUpperCase()));
    if (availableCandidates.length === 0) {
      availableCandidates = lengthCandidates;
    }
  }

  if (availableCandidates.length === 0) {
    availableCandidates = dictionary; // fallback of last resort
  }

  // Choose a random word from available candidate set
  const randomIndex = Math.floor(Math.random() * availableCandidates.length);
  const chosen = availableCandidates[randomIndex];

  // Record it in the 24h history
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem('termo_used_words_history');
      let parsed: { word: string; timestamp: number }[] = [];
      if (raw) {
        parsed = JSON.parse(raw);
      }
      const now = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000;
      const updated = [
        ...parsed.filter(r => now - r.timestamp < oneDayMs),
        { word: chosen.word.toUpperCase(), timestamp: now }
      ];
      localStorage.setItem('termo_used_words_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving word history', e);
    }
  }

  return chosen;
}

// Full vocabulary of legal 5-letter search terms for validating user guesses in Termo.
// Accents will be normalized when checking. We include extra common words to avoid false negatives.
export const VALID_GUESS_VOCABULARY_PT = [
  'TERRA', 'PEDRA', 'FOLHA', 'CHUVA', 'VENTO', 'CLIMA', 'FLORA', 'NUVEM',
  'GATO', 'TIGRE', 'PEIXE', 'LESMA', 'CISNE', 'COBRA', 'ZEBRA', 'AGUIA',
  'PRATO', 'LIVRO', 'COPO', 'CHAVE', 'GARFO', 'PUDIM', 'ARROZ', 'LIMAO',
  'PINTO', 'PIZZA', 'ROBO', 'MOUSE', 'DADOS', 'TELAS', 'FOCAL', 'NUCLEO',
  'NIVEL', 'BRISA', 'HOTEL', 'PRAIA', 'TORRE', 'MUSEU', 'SELVA', 'ARENA',
  'CAMPO', 'ANIMA', 'AMIGO', 'CORPO', 'TEMPO', 'MENTE', 'RADIO', 'RELOG',
  'PORTA', 'CANETA', 'LAPIS', 'MESA', 'PASTA', 'PAPEL', 'VAPOR', 'SONHO',
  'NORTI', 'SULIS', 'GOVER', 'FORCA', 'CARRO', 'NAVIO', 'AVIAO', 'TREMS',
  'FAZDA', 'VILAS', 'CIDCO', 'PAULO', 'CARTA', 'FIRMA', 'VISTA', 'POETA',
  'SABIO', 'FERRO', 'OUROS', 'PRATA', 'COBRE', 'ZINCO', 'CHAPA', 'PLACA',
  'GLOBO', 'MAPAS', 'MITOS', 'LINHA', 'SINAL', 'REDEI', 'GRUPO', 'FOTOS',
  'VILAO', 'HEROI', 'FADAS', 'MANGA', 'MACAJ', 'PERAS', 'MELAO', 'AMORA',
  'NOZES', 'TRIGO', 'LEITE', 'QUEIJ', 'CARNE', 'OVOSS', 'BOLOS', 'DOCES'
];

export const VALID_GUESS_VOCABULARY_EN = [
  'EARTH', 'STONE', 'CLOUD', 'STORM', 'PLANT', 'TIGER', 'EAGLE', 'SHARK',
  'SNAKE', 'KOALA', 'BREAD', 'PLATE', 'CLOCK', 'CHAIR', 'PIZZA', 'ROBOT',
  'MOUSE', 'PIXEL', 'LOGIC', 'MICRO', 'HOTEL', 'BEACH', 'TOWER', 'HOUSE',
  'OCEAN', 'APPLE', 'GRAPE', 'PEACH', 'BERRY', 'MANGO', 'LEMON', 'MELON',
  'SWEET', 'CANDY', 'WATER', 'JUICE', 'GLASS', 'KNIFE', 'SPOON', 'PAPER',
  'BOARD', 'LIGHT', 'SOUND', 'PHASE', 'WAVEI', 'STARS', 'MOONS', 'SPACE',
  'WORLD', 'TRAIN', 'PLANE', 'TRUCK', 'CYCLE', 'MOTOR', 'DRIVE', 'SPEED',
  'GLOVE', 'SHIRT', 'PANTS', 'SHOES', 'COATS', 'SOCKS', 'Watch', 'CLOCK',
  'SMILE', 'LAUGH', 'FEEL', 'SPEAK', 'HEART', 'BRAIN', 'NERVE', 'BLOOD',
  'BONES', 'SKINS', 'FLESH', 'GRASS', 'TREES', 'FRUIT', 'GRAIN', 'SEEDS'
];

export function isValidGuess(guess: string, lang: 'pt' | 'en', expectedLength: number = 5): boolean {
  const normGuess = normalizeText(guess);
  if (normGuess.length !== expectedLength) return false;
  return /^[A-Z]+$/.test(normGuess);
}

export interface LargeWordData {
  word: string;
  category: string;
  clue: string;
}

export const LARGE_WORDS_PT: LargeWordData[] = [
  { word: 'PLANETA', category: 'Natureza', clue: 'Corpo celeste que orbita uma estrela e brilha com luz refletida.' },
  { word: 'CIENCIA', category: 'Tecnologia', clue: 'Corpo de conhecimentos obtidos através da observação e experimentação.' },
  { word: 'FLORESTA', category: 'Natureza', clue: 'Grande extensão de terra coberta de árvores e vegetação densa.' },
  { word: 'TECLADO', category: 'Tecnologia', clue: 'Conjunto de teclas para digitar caracteres em um computador.' },
  { word: 'CEREBRO', category: 'Mente', clue: 'Órgão central do sistema nervoso responsável pela cognição.' },
  { word: 'QUIMICA', category: 'Natureza', clue: 'Ciência que estuda a matéria, suas propriedades e transformações.' },
  { word: 'ANIMAIS', category: 'Animais', clue: 'Seres vivos pluricelulares, eucariontes e heterótrofos.' },
  { word: 'PASSARO', category: 'Animais', clue: 'Ave de pequeno ou médio porte capaz de voar e cantar.' },
  { word: 'CASTELO', category: 'Locais', clue: 'Grande edifício fortificado típico da época medieval.' },
  { word: 'PADARIA', category: 'Locais', clue: 'Estabelecimento onde se fabrica e vende pão de vários tipos.' },
  { word: 'LENTILHA', category: 'Alimentos', clue: 'Pequena leguminosa comestível rica em ferro, muito usada em sopas.' },
  { word: 'FOGUETE', category: 'Espaço', clue: 'Veículo espacial impulsionado por motores de reação química.' },
  { word: 'UNIVERSO', category: 'Espaço', clue: 'Toda a matéria, energia e espaço físico que existem ao nosso redor.' },
  { word: 'ESTRELA', category: 'Espaço', clue: 'Esfera gigante de plasma que brilha intensamente no céu noturno.' },
  { word: 'MAQUINA', category: 'Tecnologia', clue: 'Dispositivo mecânico ou eletrônico que realiza algum trabalho.' }
];

export const LARGE_WORDS_EN: LargeWordData[] = [
  { word: 'PLANET', category: 'Nature', clue: 'A celestial body orbiting a star, shining by reflected light.' },
  { word: 'SCIENCE', category: 'Tech', clue: 'Systematic study of the structure and behavior of the physical world.' },
  { word: 'FOREST', category: 'Nature', clue: 'A large area covered chiefly with trees and undergrowth.' },
  { word: 'KEYBOARD', category: 'Tech', clue: 'A panel of keys that operates a computer or typewriter.' },
  { word: 'BRAIN', category: 'Mind', clue: 'An organ of soft nervous tissue contained in the skull.' },
  { word: 'CHEMICAL', category: 'Nature', clue: 'A distinct compound or substance that has been prepared or purified.' },
  { word: 'ANIMALS', category: 'Animals', clue: 'Living organisms that feed on organic matter, typically having specialized sense organs.' },
  { word: 'WEATHER', category: 'Nature', clue: 'The state of the atmosphere at a place and time as regards heat, dryness, etc.' },
  { word: 'CASTLE', category: 'Places', clue: 'A large fortified building or set of buildings, typical of medieval times.' },
  { word: 'BAKERY', category: 'Places', clue: 'A place where bread and cakes are made or sold.' },
  { word: 'COMPUTER', category: 'Tech', clue: 'An electronic device for storing and processing data.' },
  { word: 'ROCKET', category: 'Space', clue: 'A cylindrical projectile that can be propelled to a great height or into space.' },
  { word: 'UNIVERSE', category: 'Space', clue: 'All existing matter and space considered as a whole.' },
  { word: 'GALAXY', category: 'Space', clue: 'A system of millions or billions of stars, together with gas and dust.' },
  { word: 'MACHINE', category: 'Tech', clue: 'An apparatus using mechanical power and having several parts.' }
];

export function getRandomLargeWord(lang: 'pt' | 'en'): LargeWordData {
  let usedWordsHistory: string[] = [];
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem('termo_used_words_history');
      if (raw) {
        const parsed: { word: string; timestamp: number }[] = JSON.parse(raw);
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;
        usedWordsHistory = parsed
          .filter(r => now - r.timestamp < oneDayMs)
          .map(r => r.word.toUpperCase());
      }
    } catch (e) {
      console.error('Error reading word history', e);
    }
  }

  const list = lang === 'pt' 
    ? [...LARGE_WORDS_PT, ...EXTRA_LARGE_WORDS_PT] 
    : [...LARGE_WORDS_EN, ...EXTRA_LARGE_WORDS_EN];
  let available = list.filter(w => !usedWordsHistory.includes(w.word.toUpperCase()));
  if (available.length === 0) {
    available = list; // fallback if all used
  }

  const idx = Math.floor(Math.random() * available.length);
  const chosen = available[idx];

  // Record it in the 24h history
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem('termo_used_words_history');
      let parsed: { word: string; timestamp: number }[] = [];
      if (raw) {
        parsed = JSON.parse(raw);
      }
      const now = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000;
      const updated = [
        ...parsed.filter(r => now - r.timestamp < oneDayMs),
        { word: chosen.word.toUpperCase(), timestamp: now }
      ];
      localStorage.setItem('termo_used_words_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving word history', e);
    }
  }

  return chosen;
}

// Supplementary Large/Medium/Easy Words to prevent repetitive games
export const EXTRA_PORTUGUESE_WORDS: WordData[] = [
  // --- FÁCIL (4 cartas/letras) ---
  { word: 'MALA', category: 'Objetos', clue: 'Utensílio para guardar roupas em viagens.', difficulty: 'fácil', explanation: 'Substantivo simples de 4 letras que designa mala de viagem.' },
  { word: 'CAFE', category: 'Alimentos', clue: 'Bebida quente e estimulante feita de grãos torrados.', difficulty: 'fácil', explanation: 'Infusão popular global com alta concentração de cafeína.' },
  { word: 'ARTE', category: 'Objetos', clue: 'Expressão humana de sentimentos, ideias e estética.', difficulty: 'fácil', explanation: 'Atividade estética humana presente em toda as culturas.' },
  { word: 'REDE', category: 'Tecnologia', clue: 'Estrutura interconectada de computadores ou fios suspensos.', difficulty: 'fácil', explanation: 'Sistema de conexões digitais ou malha de repouso.' },
  { word: 'SUCO', category: 'Alimentos', clue: 'Líquido extraído de frutas exprimidas.', difficulty: 'fácil', explanation: 'Bebida natural rica em vitaminas extraídas diretamente de frutas.' },
  { word: 'LAGO', category: 'Natureza', clue: 'Grande corpo de água cercado por terra.', difficulty: 'fácil', explanation: 'Reservatório natural de água doce cercado por margens terrestres.' },
  { word: 'MAPA', category: 'Objetos', clue: 'Representação gráfica e visual de uma região geográfica.', difficulty: 'fácil', explanation: 'Instrumento cartográfico indispensável de orientação espacial.' },
  { word: 'VACA', category: 'Animais', clue: 'Mamífero fêmea domesticado produtor de leite.', difficulty: 'fácil', explanation: 'Grande ruminante herbívoro essencial para subsistência rural.' },
  { word: 'SOFA', category: 'Objetos', clue: 'Móvel estofado comprido com encosto para várias pessoas.', difficulty: 'fácil', explanation: 'Móvel acolchoado confortável presente na maioria das salas.' },
  { word: 'LEAO', category: 'Animais', clue: 'Grande felino carnívoro conhecido como o rei da selva.', difficulty: 'fácil', explanation: 'Predador imponente africano símbolo de liderança e força.' },
  { word: 'GELO', category: 'Natureza', clue: 'Água em estado sólido sob baixas temperaturas.', difficulty: 'fácil', explanation: 'Forma cristalizado-sólida de H2O abaixo de zero graus Celsius.' },

  // --- MÉDIO (5 cartas/letras) ---
  { word: 'VERDE', category: 'Natureza', clue: 'A cor característica das folhas e das plantas vivas.', difficulty: 'médio', explanation: 'Matiz cromático abundante na vegetação clorofilada terrestre.' },
  { word: 'FORTE', category: 'Objetos', clue: 'Que tem força física ou grande resistência mecânica.', difficulty: 'médio', explanation: 'Atributo de robustez física ou fortificação de defesa militar.' },
  { word: 'FESTA', category: 'Locais', clue: 'Reunião celebrativa animada com música e convidados.', difficulty: 'médio', explanation: 'Evento social comemorativo que promove união e alegria.' },
  { word: 'SABOR', category: 'Alimentos', clue: 'Sensação produzida no paladar pelas substâncias alimentares.', difficulty: 'médio', explanation: 'Propriedade organoléptica estimuladora dos receptores gustativos.' },
  { word: 'PODER', category: 'Mente', clue: 'Capacidade ou autoridade para realizar e determinar algo.', difficulty: 'médio', explanation: 'Faculdade de exercer influência ou governar estruturas.' },
  { word: 'SAUDE', category: 'Mente', clue: 'Estado de completo bem-estar físico, mental e social.', difficulty: 'médio', explanation: 'Condição fisiológica ótima de um organismo biológico estável.' },
  { word: 'LUGAR', category: 'Locais', clue: 'Espaço ou ponto delimitado ocupado por algo.', difficulty: 'médio', explanation: 'Conceito geográfico de localização ou porção espacial.' },
  { word: 'VALOR', category: 'Mente', clue: 'Preço econômico ou importância moral de algo.', difficulty: 'médio', explanation: 'Atributo de relevância financeira ou princípio ético pessoal.' },
  { word: 'CAIXA', category: 'Objetos', clue: 'Recipiente rígido com tampa para guardar ou transportar coisas.', difficulty: 'médio', explanation: 'Embalagem volumétrica tridimensional com abas ou tampa.' },
  { word: 'CLUBE', category: 'Locais', clue: 'Associação de pessoas com interesses sociais ou esportivos.', difficulty: 'médio', explanation: 'Entidade de convívio social para recreação ou atividade física.' },

  // --- DIFÍCIL (6 cartas/letras) ---
  { word: 'BRONZE', category: 'Objetos', clue: 'Liga metálica resistente de cobre e estanho.', difficulty: 'difícil', explanation: 'Liga histórica durável utilizada em medalhas e estátuas antigas.' },
  { word: 'VIAGEM', category: 'Locais', clue: 'O ato de ir de um lugar para outro distante.', difficulty: 'difícil', explanation: 'Deslocamento espacial de lazer ou negócios mudando de região.' },
  { word: 'TEATRO', category: 'Locais', clue: 'Edifício onde são apresentadas peças dramáticas e musicais.', difficulty: 'difícil', explanation: 'Locus cultural dedicado a performances artísticas interpretativas vívidas.' },
  { word: 'ESCADA', category: 'Objetos', clue: 'Série de degraus para subir ou descer níveis verticais.', difficulty: 'difícil', explanation: 'Dispositivo mecânico imóvel para transposição de altura.' },
  { word: 'ABELHA', category: 'Animais', clue: 'Inseto voador polinizador produtor de mel saboroso.', difficulty: 'difícil', explanation: 'Importante agente ecológico himenóptero coletor de pólen.' },
  { word: 'AGULHA', category: 'Objetos', clue: 'Pequena haste metálica pontiaguda com orifício para passar linha.', difficulty: 'difícil', explanation: 'Instrumento afiado ancestral para costura de tecidos.' },
  { word: 'BRANCO', category: 'Objetos', clue: 'Cor pura acromática que reflete toda a luz visível.', difficulty: 'difícil', explanation: 'Oposto de preto no espectro, representando brilho integral.' },
  { word: 'QUENTE', category: 'Natureza', clue: 'Que irradia calor elevado ou está sob alta temperatura.', difficulty: 'difícil', explanation: 'Estado de excitação molecular térmica elevada acima do padrão.' },
  { word: 'PARQUE', category: 'Locais', clue: 'Grande área verde recreativa urbana ou reserva florestal.', difficulty: 'difícil', explanation: 'Reserva para proteção biológica ou lazer de populações locais.' },
  { word: 'CIDADE', category: 'Locais', clue: 'Área urbana densamente povoada dotada de autogoverno.', difficulty: 'difícil', explanation: 'Assentamento humano complexo com infraestrutura desenvolvida.' },
  { word: 'QUADRO', category: 'Objetos', clue: 'Pintura artística em tela ou placa para escrever com giz.', difficulty: 'difícil', explanation: 'Superfície plana delimitada com intuitos de exposição visual.' },
  { word: 'PAREDE', category: 'Objetos', clue: 'Estrutura vertical sólida que divide ambientes internos.', difficulty: 'difícil', explanation: 'Barreira arquitetônica divisória e de sustentação estrutural.' }
];

export const EXTRA_ENGLISH_WORDS: WordData[] = [
  // --- EASY (4 letters) ---
  { word: 'GOLF', category: 'Places', clue: 'Outdoor sport played with clubs and a tiny ball on grass.', difficulty: 'fácil', explanation: 'Gentleman sport originating in Scotland requiring spacious green fields.' },
  { word: 'LAND', category: 'Nature', clue: 'The part of the earth surface that is not covered by water.', difficulty: 'fácil', explanation: 'Dry terrestrial crust defining state boundaries and agricultural activity.' },
  { word: 'WIND', category: 'Nature', clue: 'The natural movement of the air in the form of a current.', difficulty: 'fácil', explanation: 'Atmospheric fluid velocity displacement powered by solar heating variance.' },
  { word: 'BIRD', category: 'Animals', clue: 'A warm-blooded egg-laying vertebrate distinguished by feathers.', difficulty: 'fácil', explanation: 'Avian biological category capable of self-powered sustained flight.' },
  { word: 'FISH', category: 'Animals', clue: 'A limbless cold-blooded vertebrate animal with gills living in water.', difficulty: 'fácil', explanation: 'Aquatic vertebrate breathing dissolved oxygen via branchial systems.' },
  { word: 'MILK', category: 'Foods', clue: 'An opaque white fluid rich in fat and protein secreted by mammals.', difficulty: 'fácil', explanation: 'Primary nutrient dense liquid produced by maternal mammal structures.' },
  { word: 'BOAT', category: 'Objects', clue: 'A small vessel for traveling over water powered by oars or motor.', difficulty: 'fácil', explanation: 'Hydrodynamic buoyant vehicle displacement for waterborne transport.' },
  { word: 'BOOK', category: 'Objects', clue: 'A written or printed work consisting of pages glued together.', difficulty: 'fácil', explanation: 'Classic informational storage device bound within protective covers.' },
  { word: 'STAR', category: 'Nature', clue: 'A luminous point in the night sky that is a large glowing ball of gas.', difficulty: 'fácil', explanation: 'Giant nuclear fusion reaction core suspended in deep cosmic void.' },
  { word: 'DESK', category: 'Objects', clue: 'A piece of furniture with a flat table-style surface used for working.', difficulty: 'fácil', explanation: 'Workspace furniture designed to optimize cognitive and physical output.' },

  // --- MEDIUM (5 letters) ---
  { word: 'GREEN', category: 'Nature', clue: 'The color of growing grass and leaves of plants.', difficulty: 'médio', explanation: 'Chromatic wavelength dominant in environments rich in chlorophyll.' },
  { word: 'HEAVY', category: 'Objects', clue: 'Having great weight or difficult to lift or move.', difficulty: 'médio', explanation: 'Possessing significant mass subjecting the node to gravity force.' },
  { word: 'PARTY', category: 'Places', clue: 'A social gathering of invited guests for eating, drinking, and dancing.', difficulty: 'médio', explanation: 'Interpersonal gathering celebrating nodes with loud music vibrations.' },
  { word: 'TASTE', category: 'Foods', clue: 'The sensation of flavor perceived in the mouth and throat on contact.', difficulty: 'médio', explanation: 'Chemical sensor evaluation trigger located in the oral cavity.' },
  { word: 'POWER', category: 'Mind', clue: 'The capacity or ability to direct or influence the behavior of others.', difficulty: 'médio', explanation: 'Political or structural energy vector indicating top hierarchy.' },
  { word: 'WORLD', category: 'Nature', clue: 'The earth, together with all of its countries and peoples.', difficulty: 'médio', explanation: 'The global planetary biosystem populated by active human entities.' },
  { word: 'PLACE', category: 'Places', clue: 'A particular position, point, or area in space.', difficulty: 'médio', explanation: 'Locational geographic coordinates representing spatial occupation.' },
  { word: 'SHORE', category: 'Nature', clue: 'The land along the edge of a sea, lake, or other large body of water.', difficulty: 'médio', explanation: 'Granular interface segment dividing ocean elements from continental landmass.' },
  { word: 'CHAIR', category: 'Objects', clue: 'A separate seat for one person, typically with four legs and a back.', difficulty: 'médio', explanation: 'Support furniture item designed to hold weight in a seated posture.' },
  { word: 'GRAIN', category: 'Foods', clue: 'Wheat or other cultivated cereal crop used as raw food source.', difficulty: 'médio', explanation: 'Starchy endosperm seed component powering human agriculture since ancient times.' },

  // --- HARD (6 letters) ---
  { word: 'BRONZE', category: 'Objects', clue: 'A yellowish-brown alloy of copper and high percentage of tin.', difficulty: 'difícil', explanation: 'Historic durable alloy marking a key technological epoch of humanity.' },
  { word: 'TRAVEL', category: 'Places', clue: 'Make a journey, typically of some length or to overseas.', difficulty: 'difícil', explanation: 'Intentional translocation across geological coordinates for tourism.' },
  { word: 'ABBEYS', category: 'Places', clue: 'The buildings occupied by a community of monks or nuns as shelter.', difficulty: 'difícil', explanation: 'Monastic architectural retreats designed for self-contained devout lifestyle.' },
  { word: 'FLIGHT', category: 'Tech', clue: 'The action or process of flying through the air using wings/engines.', difficulty: 'difícil', explanation: 'Aerodynamic lift translocation overcoming earth gravitational constant.' },
  { word: 'BEETLE', category: 'Animals', clue: 'An insect of an order distinguished by forewings modified into hard wing-cases.', difficulty: 'difícil', explanation: 'Coleoptera species possessing chitinous protective elytra structures.' },
  { word: 'NEEDLE', category: 'Objects', clue: 'A very thin, sharp metal tool used for sewing garments.', difficulty: 'difícil', explanation: 'Surgical or textile piercing instrument designed to direct thread.' },
  { word: 'YELLOW', category: 'Objects', clue: 'The color between green and orange in the spectrum, like ripe lemons.', difficulty: 'difícil', explanation: 'Bright primary chromatic wavelength resembling sun rays.' },
  { word: 'SUMMER', category: 'Nature', clue: 'The warmest season of the year, between spring and autumn.', difficulty: 'difícil', explanation: 'The seasonal period marked by highest solar radiation exposure.' },
  { word: 'FOREST', category: 'Nature', clue: 'A large area covered chiefly with trees, shrubs, and dense undergrowth.', difficulty: 'difícil', explanation: 'A massive biome characterized by high density tree coverage.' },
  { word: 'VALLEY', category: 'Nature', clue: 'A low area of land between hills or mountains, typically with a river.', difficulty: 'difícil', explanation: 'Depressed topography formed by hydraulic erosion over eras.' },
  { word: 'SQUARE', category: 'Objects', clue: 'A plane figure with four equal straight sides and four right angles.', difficulty: 'difícil', explanation: 'Regular quadrilateral geometric shape with ninety-degree offsets.' },
  { word: 'BRIDGE', category: 'Tech', clue: 'A structure carrying a road, path, or railway across an obstacle.', difficulty: 'difícil', explanation: 'Structural engineering asset spanning geological chasms or rivers.' }
];

export const EXTRA_LARGE_WORDS_PT: LargeWordData[] = [
  { word: 'BIBLIOTECA', category: 'Locais', clue: 'Espaço que reúne acervos de livros consultáveis e leitura silenciosa.' },
  { word: 'COMPUTADOR', category: 'Tecnologia', clue: 'Dispositivo eletrônico capaz de realizar computação de alta velocidade.' },
  { word: 'MICROFONE', category: 'Tecnologia', clue: 'Transdutor eletroacústico que converte som em energia elétrica.' },
  { word: 'BORBOLETA', category: 'Animais', clue: 'Inseto voador com asas membranosas coloridas e ciclo metamórfico completo.' },
  { word: 'SINFONIA', category: 'Mente', clue: 'Composição musical complexa dividida em múltiplos movimentos.' },
  { word: 'TELEFONE', category: 'Tecnologia', clue: 'Aparelho portátil para transmissão vocal a distância por ondas de rádio.' },
  { word: 'CHOCOLATE', category: 'Alimentos', clue: 'Alimento energético doce feito de sementes torradas de cacau.' },
  { word: 'CACHORRO', category: 'Animais', clue: 'O melhor e mais fiel mamífero domesticado canídeo amigo do homem.' },
  { word: 'VENTILADOR', category: 'Objetos', clue: 'Aparelho elétrico rotativo para produzir vento e refrescar ambientes.' },
  { word: 'ESMERALDA', category: 'Natureza', clue: 'Gema mineral verde preciosa super resistente e lindamente polida.' },
  { word: 'DINOSSAURO', category: 'Animais', clue: 'Grande réptil pré-histórico extinto que habitava a Terra no Jurássico.' },
  { word: 'ASTRONAUTA', category: 'Espaço', clue: 'Indivíduo treinado para pilotar ou servir a bordo de espaçonaves.' },
  { word: 'FOTOGRAFIA', category: 'Tecnologia', clue: 'Processo óptico de registrar e fixar imagens reais sobre superfícies sensíveis.' },
  { word: 'CONGELADOR', category: 'Alimentos', clue: 'Compartimento de baixa temperatura extrema para guardar comidas.' },
  { word: 'GEOGRAFIA', category: 'Natureza', clue: 'Estudo da superfície do nosso planeta e suas variações climáticas e físicas.' }
];

export const EXTRA_LARGE_WORDS_EN: LargeWordData[] = [
  { word: 'LIBRARY', category: 'Places', clue: 'A building containing collections of books and periodicals for reading.' },
  { word: 'COMPUTER', category: 'Tech', clue: 'An electronic device designed to store, retrieve, and process rich data.' },
  { word: 'MICROPHONE', category: 'Tech', clue: 'An acoustic transducer that converts air pressure oscillations into electric sound signals.' },
  { word: 'BUTTERFLY', category: 'Animals', clue: 'A nectar-feeding insect with two pairs of large, typically brightly colored wings.' },
  { word: 'SYMPHONY', category: 'Mind', clue: 'An elaborate musical composition for full orchestra in several movements.' },
  { word: 'TELEPHONE', category: 'Tech', clue: 'A telecommunications device that permits two or more users to conduct a voice call.' },
  { word: 'CHOCOLATE', category: 'Foods', clue: 'A sweet, brown food preparation of roasted and ground cacao seeds.' },
  { word: 'SATELLITE', category: 'Space', clue: 'An artificial body placed in orbit around the earth or moon to gather information.' },
  { word: 'ASTRONAUT', category: 'Space', clue: 'A trained human scientific specialist who travels in a spacecraft beyond earth orbit.' },
  { word: 'EMERALD', category: 'Nature', clue: 'A precious gemstone of a bright, deep green species of beryl.' },
  { word: 'DINOSAUR', category: 'Animals', clue: 'A diverse group of extinct reptiles that dominated land during the Mesozoic era.' },
  { word: 'FREEZER', category: 'Foods', clue: 'An insulated cabinet or compartment kept cold below the freezing point of water.' },
  { word: 'BACKPACK', category: 'Objects', clue: 'A bag with shoulder straps that is carried on one back.' },
  { word: 'PHOTOGRAPH', category: 'Tech', clue: 'An image of a real object captured by light on a sensor or chemical film.' },
  { word: 'GEOGRAPHY', category: 'Nature', clue: 'The systematic scientific study of the earth features and political boundaries.' }
];
