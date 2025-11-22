// Configuração das perguntas do quiz
// Para adicionar imagens: use URLs ou coloque imagens na pasta 'images/' e referencie como 'images/nome.png'
const questions = [
    {
        id: 1,
        question: "Prémio: Pulmão de Ouro",
        description: "Este prémio vai para aquela pessoa que domina a arte da escapadinha estratégica. Um verdadeiro talento natural para desaparecer entre um exame e outro. Ninguém sabe bem para onde vai, mas basta seguir o rasto de fumo e o cheiro a tabaco para a encontrar. Parabéns ao mestre das fugas!",
        options: [
            { text: "Bruno", image: "images/IMG_4039.jpeg" },
            { text: "Vera", image: "images/IMG_4045.jpeg" },
            { text: "Ricardo Freire", image: "images/IMG_4135.jpeg" },
            { text: "Bárbara", image: "images/IMG_4136.jpeg" },
        ],
        duration: 60000 // 1 minuto em milissegundos
    },
    {
        id: 2,
        question: "Qual é o melhor framework JavaScript?",
        description: "Escolha o framework que oferece a melhor experiência de desenvolvimento para aplicações web modernas.",
        options: [
            { text: "React", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
            { text: "Vue", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
            { text: "Angular", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
            { text: "Svelte", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg" }
        ],
        duration: 60000
    },
    {
        id: 3,
        question: "Qual é o melhor editor de código?",
        description: "Selecione o editor que aumenta sua produtividade e oferece as melhores funcionalidades.",
        options: [
            { text: "VS Code", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
            { text: "IntelliJ", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg" },
            { text: "Sublime Text", image: "https://www.sublimetext.com/images/logo.svg" },
            { text: "Vim", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vim/vim-original.svg" },
            { text: "Atom", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/atom/atom-original.svg" }
        ],
        duration: 60000
    },
    {
        id: 4,
        question: "Qual é o melhor sistema operacional para desenvolvimento?",
        description: "Vote no sistema operacional que proporciona o melhor ambiente para programadores.",
        options: [
            { text: "Linux", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
            { text: "macOS", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" },
            { text: "Windows", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg" }
        ],
        duration: 60000
    },
    {
        id: 5,
        question: "Qual é a melhor plataforma de hospedagem?",
        description: "Escolha a plataforma que oferece o melhor custo-benefício e facilidade para hospedar aplicações web.",
        options: [
            { text: "GitHub Pages", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
            { text: "Vercel", image: "https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" },
            { text: "Netlify", image: "https://www.vectorlogo.zone/logos/netlify/netlify-icon.svg" },
            { text: "AWS", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" },
            { text: "Heroku", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/heroku/heroku-original.svg" }
        ],
        duration: 60000
    }
];
