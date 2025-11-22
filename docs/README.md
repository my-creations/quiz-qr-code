# 🎯 Quiz com Votação em Tempo Real

Sistema de votação interativo com QR Code, temporizador e resultados em tempo real. Totalmente gratuito e hospedável no GitHub Pages!

## ✨ Funcionalidades

- ✅ Geração automática de QR Code para votação
- ✅ Temporizador de 1 minuto por pergunta
- ✅ Resultados em tempo real
- ✅ Página de resultados com opção vencedora
- ✅ Múltiplas perguntas configuráveis
- ✅ Design responsivo e moderno
- ✅ 100% gratuito (sem backend necessário)

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

## 📁 Estrutura de Arquivos

```
quiz-qr-code/
├── index.html      # Painel principal (exibir resultados)
├── vote.html       # Página de votação
├── styles.css      # Estilos da aplicação
├── app.js          # Lógica do painel principal
├── vote.js         # Lógica da página de votação
├── questions.js    # Configuração das perguntas
└── README.md       # Este arquivo
```

## ⚙️ Configuração das Perguntas

Edite o arquivo `questions.js` para adicionar/modificar perguntas:

```javascript
const questions = [
    {
        id: 1,
        question: "Sua pergunta aqui?",
        options: ["Opção 1", "Opção 2", "Opção 3", "Opção 4", "Opção 5"],
        duration: 60000 // 1 minuto em milissegundos
    },
    // Adicione mais perguntas...
];
```

## 🎮 Como Funciona

### Painel Principal (index.html)
- Exibe a pergunta atual
- Mostra QR Code para votação
- Apresenta resultados em tempo real
- Controla o temporizador
- Mostra a opção vencedora após 1 minuto
- Botão para avançar para próxima pergunta

### Página de Votação (vote.html)
- Acesso via QR Code ou link direto
- Usuário seleciona uma opção
- Confirma o voto
- Voto é registrado instantaneamente
- Previne votos duplicados (por dispositivo)

## 💾 Armazenamento

Os votos são armazenados no **LocalStorage** do navegador:
- Funciona perfeitamente para demos e apresentações
- Sincronização automática entre abas do mesmo navegador
- Para uso em produção, considere integrar Firebase (gratuito)

## 🎨 Personalização

### Cores
Edite o `styles.css` para mudar o esquema de cores:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Temporizador
Altere a duração no `questions.js`:
```javascript
duration: 120000 // 2 minutos
```

## 🌐 Compatibilidade

- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile (iOS/Android)

## 📱 Uso em Eventos

### Cenário Ideal
1. Projetor/TV mostra `index.html` (painel principal)
2. Audiência escaneia QR Code
3. Vota no telemóvel
4. Resultados aparecem em tempo real no projetor

### Limitações
- Votos são locais ao navegador/dispositivo
- Cada dispositivo pode votar uma vez por pergunta
- Para resetar votos: limpar LocalStorage ou reiniciar quiz

## 🔧 Melhorias Futuras

- [ ] Integração com Firebase Realtime Database
- [ ] Sistema de autenticação por código único
- [ ] Exportar resultados para CSV/PDF
- [ ] Gráficos animados
- [ ] Sons de notificação
- [ ] Modo escuro

## 📄 Licença

Este projeto é de código aberto e livre para uso pessoal e comercial.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

Criado com ❤️ para tornar apresentações mais interativas!
