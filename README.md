# 🎯 Quiz com Votação em Tempo Real

Sistema de votação interativo com QR Code, temporizador e resultados em tempo real. Totalmente gratuito e hospedável no GitHub Pages!

## ✨ Funcionalidades

- ✅ Geração automática de QR Code para votação
- ✅ Temporizador configurável por pergunta (padrão: 1 minuto)
- ✅ Controles de navegação (anterior/próxima pergunta)
- ✅ Pausa/retomar temporizador
- ✅ Modo fullscreen para apresentações
- ✅ Resultados em tempo real com gráficos
- ✅ Página de resultados com opção vencedora
- ✅ Suporte para imagens nas opções
- ✅ Múltiplas perguntas configuráveis
- ✅ Design responsivo e moderno
- ✅ 100% gratuito (sem backend necessário)

## 📁 Estrutura do Projeto

```
quiz-qr-code/
├── index.html              # Painel principal (exibir resultados)
├── vote.html               # Página de votação
├── css/
│   └── styles.css          # Estilos da aplicação
├── js/
│   ├── questions.js        # Configuração das perguntas
│   ├── app.js              # Lógica do painel principal
│   └── vote.js             # Lógica da página de votação
├── images/                 # Imagens para as opções
│   ├── IMG_4039.jpeg
│   ├── IMG_4045.jpeg
│   ├── IMG_4135.jpeg
│   └── IMG_4136.jpeg
├── docs/
│   ├── README.md           # Documentação detalhada
│   └── PLANO.md            # Plano de desenvolvimento
└── .gitignore
```

## 🚀 Como Usar

### Localmente

1. Clone ou baixe este repositório
2. Abra `index.html` num navegador (painel de controle)
3. Abra `vote.html` noutra aba ou dispositivo (página de votação)
4. Ou escaneie o QR Code gerado para votar no telemóvel

### No GitHub Pages

1. Crie um repositório no GitHub
2. Faça upload de todos os arquivos
3. Vá em Settings > Pages
4. Selecione a branch `main` e pasta `/root`
5. Aguarde alguns minutos
6. Acesse: `https://seu-usuario.github.io/nome-do-repo/`

## ⚙️ Configuração das Perguntas

Edite o arquivo `js/questions.js` para adicionar/modificar perguntas:

```javascript
const questions = [
    {
        id: 1,
        question: "Sua pergunta aqui?",
        description: "Descrição opcional da pergunta",
        options: [
            { text: "Opção 1", image: "images/foto1.jpg" },
            { text: "Opção 2", image: "images/foto2.jpg" },
            // até 5 opções
        ],
        duration: 60000 // 1 minuto em milissegundos
    },
    // Adicione mais perguntas...
];
```

### Formato das Opções

**Com imagem:**
```javascript
{ text: "Nome", image: "images/foto.jpg" }
```

**Sem imagem (texto simples):**
```javascript
"Nome da Opção"
```

**Com imagem de URL externa:**
```javascript
{ text: "Nome", image: "https://exemplo.com/imagem.png" }
```

## 🎮 Controles do Painel

- **⏸️ Pausar/Retomar** - Controla o temporizador
- **← Anterior** - Volta para pergunta anterior
- **→ Próxima** - Avança para próxima pergunta
- **🖥️ Fullscreen** - Ativa modo tela cheia (ideal para apresentações)

## 🎨 Adicionando Imagens

1. Coloque suas imagens na pasta `images/`
2. Formatos suportados: JPG, PNG, SVG, GIF
3. Recomendado: imagens quadradas (ratio 1:1)
4. Tamanho sugerido: 200x200px a 500x500px

## 💾 Como Funciona o Armazenamento

Os votos são armazenados no **LocalStorage** do navegador:
- Funciona perfeitamente para demos e apresentações
- Sincronização automática entre abas do mesmo navegador
- Cada dispositivo pode votar uma vez por pergunta
- Para resetar: limpar LocalStorage ou reiniciar quiz

**Limitação:** Votos são locais ao navegador/dispositivo. Para uso em produção com múltiplos dispositivos, considere integrar Firebase Realtime Database (gratuito).

## 🌐 Compatibilidade

- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile (iOS/Android)

## 📱 Uso em Eventos

### Cenário Ideal
1. Projetor/TV mostra `index.html` (painel principal)
2. Audiência escaneia QR Code
3. Vota no telemóvel via `vote.html`
4. Resultados aparecem em tempo real no projetor

## 🎨 Personalização

### Mudar Cores
Edite `css/styles.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Ajustar Temporizador
Edite `js/questions.js`:
```javascript
duration: 120000 // 2 minutos
```

### Tamanho das Imagens
Edite `css/styles.css`:
```css
.option-image {
    width: 60px;  /* ajuste conforme necessário */
    height: 60px;
}
```

## 🔧 Melhorias Futuras Possíveis

- [ ] Integração com Firebase Realtime Database
- [ ] Sistema de autenticação por código único
- [ ] Exportar resultados para CSV/PDF
- [ ] Gráficos animados com Chart.js
- [ ] Sons de notificação
- [ ] Modo escuro
- [ ] Análise de resultados históricos

## 📄 Licença

Este projeto é de código aberto e livre para uso pessoal e comercial.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

Criado com ❤️ para tornar apresentações mais interativas!
