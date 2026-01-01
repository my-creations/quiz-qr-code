const questions = [
    {
        id: 1,
        question: "Prémio: Ladrãozinho do Armário",
        description: "Este prémio vai para aquela pessoa que mantém o serviço em défice calórico: não por trabalhar demais, mas porque os suplementos desaparecem misteriosamente sempre que ela/e está por perto. Com uma perícia digna de agente secreto, consegue abrir embalagens sem um único som e deixar o armário com um eco triste de vazio.",
        options: [
            { text: "Bárbara Moreira", image: "images/Bárbara Moreira.jpeg" },
            { text: "Pedro Bargão", image: "images/Pedro Bargão.jpeg" },
            { text: "João Pereira", image: "images/João Pereira.jpeg" }
        ],
    },
    {
        id: 2,
        question: "Prémio: Mestre do Intestino Brilhante",
        description: "Este prémio vai para a pessoa que leva o conceito de limpeza intestinal a outro nível, a pessoa que não se contenta com um intestino limpo, quer um intestino esterilizado ao nível de sala branca da NASA.\nDiz-se por aí que no final de uma colonoscopia o intestino fica tão limpo que podíamos fazer lá dentro um piquenique.",
        options: [
            { text: "Sandra Pires", image: "images/Sandra Pires.jpeg" },
            { text: "Aires Figueiredo", image: "images/Aires Figueiredo.jpeg", imagePosition: "center 20%" },
            { text: "Ricardo Gorjão", image: "images/Ricardo Gorjão.jpeg" }
        ],
    },
    {
        id: 3,
        question: "Prémio: Flash",
        description: "Este prémio vai para o auxiliar que desafia as leis da física hospitalar. Está em três postos ao mesmo tempo, muda lençóis, prepara salas, e ainda tem tempo para dizer 'já está feito' antes de alguém pedir!",
        options: [
            { text: "Carla Costa", image: "images/Carla Costa.jpeg", imagePosition: "center" },
            { text: "Pedro Bernardo", image: "images/Pedro Bernardo.jpeg" },
            { text: "Jéssica Almeida", image: "images/Jéssica Almeida.jpeg" },
            { text: "Sónia Reis", image: "images/Sónia Reis.jpeg", imagePosition: "center" }
        ],
    },
    {
        id: 4,
        question: "Prémio: Antes Tarde que Nunca",
        description: "Este prémio vai para a pessoa que transformou o atraso numa marca pessoal. Quando diz 'já estou a caminho', sabemos que ainda está a calçar as meias. O turno pode começar às 8h, mas o relógio dela funciona num fuso horário paralelo. Mesmo assim, chega sempre com aquele ar calmo de quem 'nem está assim tão atrasado'.",
        options: [
            { text: "Teresa Fraga", image: "images/Teresa Fraga.jpeg" },
            { text: "Mafalda Monteiro", image: "images/Mafalda Monteiro.jpeg" },
            { text: "Conceição Alves", image: "images/Conceição Alves.jpeg" },
        ],
    },
    {
        id: 5,
        question: "Prémio: Tudo Sob Control (Mais ou Menos)",
        description: "Este prémio celebra o administrativo que transforma o dia a dia do serviço numa verdadeira montanha-russa de emoções. Sempre bem-disposto e pronto a ajudar, consegue transformar até os pequenos imprevistos em momentos de boa disposição. Entre etiquetas trocadas e processos que desaparecem misteriosamente, garantem sempre uma dose diária de adrenalina.",
        options: [
            { text: "Mara", image: "images/Mara.jpeg" },
            { text: "Mariana", image: "images/Mariana.jpeg" },
            { text: "André", image: "images/André.jpeg" },
            { text: "Gonçalo", image: "images/Gonçalo.jpeg", imagePosition: "center 20%" }
        ],
    },
    {
        id: 6,
        question: "Prémio: Aquisição do Ano",
        description: "Este prémio celebra quem chegou há pouco e já se tornou indispensável, enfrentando cada exame com profissionalismo, humor e sangue-frio. Porque no nosso serviço, só entra quem tem... estômago para isto!",
        options: [
            { text: "Inês Lima", image: "images/Inês Lima.jpeg" },
            { text: "Luís Correia", image: "images/Luís Correia.jpeg" },
            { text: "Diana Carvalho", image: "images/Diana Carvalho.jpeg" },
            { text: "Cristiana Sabino", image: "images/Cristiana Sabino.jpeg" }
        ],
    },
    {
        id: 7,
        question: "Prémio: Espécie Rara do Ano",
        description: "Encontrar um anestesista disponível é mais difícil do que começar um exame à hora certa. Passam o dia a correr de sala em sala, a adormecer uns e a tentar não adormecer eles próprios. Por isso, este prémio vai para o verdadeiro herói silencioso, o mestre da calma e do multitasking extremo.",
        options: [
            { text: "Rita Fragoso", image: "images/Rita Fragoso.jpeg" },
            { text: "Ana Machado", image: "images/Ana Machado.jpeg" },
            { text: "Cristina Pestana", image: "images/Cristina Pestana.jpeg" },
            { text: "Isabel Bonifácio", image: "images/Isabel Bonifácio.jpeg" }
        ],
    },
    {
        id: 8,
        question: "Prémio: Regresso Triunfal",
        description: "Há regressos lendários na história — o de Jesus, o dos Backstreet Boys, e agora... o dos nossos colegas que estiveram de baixa! Voltaram mais fortes, mais descansados (ou não). Fala-se até que alguns chegaram a sentir saudades do trabalho! Mas foi só nas primeiras horas, depois já estavam a contar os dias para o fim de semana outra vez.",
        options: [
            { text: "Susana Costa", image: "images/Susana Costa.jpeg" },
            { text: "Ana Pires", image: "images/Ana Pires.jpeg" },
            { text: "Maria dos Anjos", image: "images/Maria dos Anjos.jpeg" }
        ],
    },
    {
        id: 9,
        question: "Prémio: Kit Mãos Livres",
        description: "Este prémio vai para o médico que, durante a colonoscopia, pede para virar o doente vezes sem conta. Um verdadeiro talento da participação simbólica, cuja função é não largar o aparelho e dar instruções motivacionais. Enquanto isso, a enfermeira e a auxiliar vivem uma experiência completamente diferente: com as costas a ranger e suor na testa, viram o doente de um lado para o outro como se estivessem a assar um leitão no espeto.",
        options: [
            { text: "Sandra Morgado", image: "images/Sandra Morgado.jpeg" },
            { text: "Paulo Ratilal", image: "images/Paulo Ratilal.jpeg" },
            { text: "Bruno Pereira", image: "images/Bruno Pereira.jpeg" }
        ],
    },
    {
        id: 10,
        question: "Prémio: Grávida do Ano",
        description: "Este prémio distingue a pessoa que não só está a fabricar/fabricou um ser humano, como ainda consegue gerir desejos estranhos, ataques de choro/riso, birras hormonais e fome súbita com um talento que desafia a medicina moderna.",
        options: [
            { text: "Margarida Duarte", image: "images/Margarida Duarte.jpeg" },
            { text: "Rita Ornelas", image: "images/Rita Ornelas.jpeg" },
            { text: "Bruno Carneiro", image: "images/Bruno Carneiro.jpeg" }
        ],
    },
    {
        id: 11,
        question: "Prémio: GPS Humano",
        description: "Este prémio distingue a pessoa que não só sabe onde está tudo, como também sabe o que é, para que serve, quem o inventou. Estamos a falar de alguém que é literalmente uma mistura entre: um GPS ultra preciso, a Wikipédia, e a tia sábia da aldeia que sabe sempre tudo antes de toda a gente. Se o mundo acabasse amanhã e só pudéssemos salvar uma fonte de conhecimento, não precisamos de livros, internet ou bibliotecas… levávamos esta pessoa.",
        options: [
            { text: "Susana Bernardo", image: "images/Susana Bernardo.jpeg" },
            { text: "Verónica Costa", image: "images/Verónica Costa.jpeg" },
            { text: "Soraia Duarte", image: "images/Soraia Duarte.jpeg" },
            { text: "Fifi", image: "images/Fifi.jpeg" }
        ],
    },
    {
        id: 12,
        question: "Prémio: Chefinho do Ano",
        description: "Este prémio vai para a pessoa que não precisa de cargo, contrato ou autoridade formal para ser líder. Ela manda por vibração natural. Estamos a falar de alguém que nasceu a dar ordens: dizem que, no berçário, já organizava os outros bebés por ordem de peso.",
        options: [
            { text: "Anabela Lobo", image: "images/Anabela Lobo.jpeg" },
            { text: "Rita Serejo", image: "images/Rita Serejo.jpeg" },
            { text: "Susana Filipa", image: "images/Susana Filipa.jpeg" }
        ],
    },
    {
        id: 13,
        question: "Prémio: Enfermeiro 3-em-1",
        description: "Este prémio vai para o enfermeiro que reúne três características raríssimas no mesmo ser humano: empatia genuína, calma inabalável e uma rapidez irritantemente natural.\nÉ aquele enfermeiro que percebe o que alguém precisa antes mesmo de a pessoa conseguir explicar, que mantém a serenidade quando tudo à volta acelera e que resolve situações em tempo recorde como se fosse a coisa mais natural do mundo sem perder o controlo e o sorriso.",
        options: [
            { text: "Vera Fonseca", image: "images/Vera Fonseca.jpeg" },
            { text: "Patrícia Marinheiro", image: "images/Patricia Marinheiro.jpeg" },
            { text: "Sandra Camilo", image: "images/Sandra Camilo.jpeg", imagePosition: "center 20%" },
            { text: "Márcia Dias", image: "images/Márcia Dias.jpeg", imagePosition: "center 20%" }
        ],
    },
    {
        id: 14,
        question: "Prémio: Simpatia Natural",
        description: "Este prémio distingue aquela pessoa que não precisa de fazer esforços, cursos, workshops, terapia de grupo ou respirações profundas para ser simpática. Ela simplesmente… é. É simpática por defeito de fábrico. Enquanto alguns acordam maldispostos só porque o despertador tocou, esta pessoa aparece sempre com um sorriso ou pelo menos um ar suficientemente agradável para não assustar ninguém.",
        options: [
            { text: "Filipa Santos", image: "images/Filipa Santos.jpeg" },
            { text: "Céu Baptista", image: "images/Céu Baptista.jpeg" },
            { text: "Raquel Ferreira", image: "images/Raquel Ferreira.jpeg" },
            { text: "Nina Câmara", image: "images/Nina Câmara.jpeg" }
        ],
    },
    {
        id: 15,
        question: "Prémio: Fazes cá falta",
        description: "Este prémio é atribuído não a quem morreu, mas a quem deixou o nosso serviço e nos lembrou que afinal faz cá falta e deixou um espaço que ninguém conseguiu preencher da mesma forma. É para quem saiu do nosso dia a dia, mas ficou nas histórias, nas memórias e naquele pensamento recorrente: “Se ele/ela estivesse aqui…”",
        options: [
            { text: "António", image: "images/António.jpeg" },
            { text: "Inês Duarte", image: "images/Inês Duarte.jpeg" },
            { text: "Carlos Gaspar", image: "images/Carlos Gaspar.jpeg" },
            { text: "Latifa", image: "images/Latifa.jpeg" }
        ],
    },
    {
        id: 16,
        question: "Prémio: Carreira",
        description: "O Prémio Carreira celebra um percurso feito de dedicação e propósito.\nNão se mede apenas pelo que foi alcançado, mas pelo impacto deixado em quem trabalhou ao seu lado.\nUm caminho que inspirou, ensinou e continua presente.",
        options: [
            { text: "António Bugalho", image: "images/António Bugalho.jpeg" },
            { text: "Manuela Lança", image: "images/Manuela Lança.jpeg" },
            { text: "Ricardo Gorjão", image: "images/Ricardo Gorjão.jpeg" }
        ],
    },
    {
        id: 17,
        question: "Prémio: Categoria que inventámos só para vos meter aqui",
        description: "Este prémio existe por um motivo muito simples: não sabíamos onde pôr estas quatro pessoas. Nenhuma categoria vos servia, nenhuma descrição vos encaixava, e juntar-vos parecia um exercício de criatividade… ou desespero. Por isso, criámos esta categoria especialmente para vocês — uma categoria onde não é preciso ter nada em comum, nem talento específico, nem sequer uma justificação lógica. Basta… existir. E vocês fazem isso lindamente. Aqui, tudo é válido: votar por afinidade, por simpatia, por instinto ou só porque gostam do nome.",
        options: [
            { text: "Paula", image: "images/Paula.jpeg" },
            { text: "Manuel Teixeira", image: "images/Manuel Teixeira.jpeg" },
            { text: "Rita Semedo", image: "images/Rita Semedo.jpeg" },
            { text: "Margarida Pires", image: "images/Margarida Pires.jpeg" }
        ],
    }
];
