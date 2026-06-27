# Nobre Imóveis — Curadoria de Imóveis de Luxo

Uma landing page premium para a **Nobre Imóveis**, focada na apresentação e curadoria exclusiva de imóveis de alto padrão. O design foi desenvolvido com foco em estética minimalista, sofisticação visual e animações fluidas para proporcionar uma experiência de usuário imersiva e de alto nível.

---

## 🌟 Recursos e Diferenciais

- **Estética Premium**: Paleta de cores sofisticada (tons de bege, terracota, branco e detalhes escuros), tipografia refinada e layout harmonioso.
- **Design Responsivo & Fluido**: Utilização de *Fluid Type Scale* e *Fluid Spacing* (`clamp()`) para garantir que o layout se adapte com perfeição a qualquer tamanho de tela (de celulares compactos a monitores ultra-wide).
- **Animações Cinematográficas**:
  - Efeito **Ken Burns** na imagem de fundo do Hero (zoom sutil contínuo).
  - Revelação de texto linha por linha (*line-by-line reveal*) na entrada da página.
  - Efeito **Parallax** na imagem de fundo e nos elementos textuais ao rolar a página.
  - Suporte à acessibilidade com detecção de preferência de movimento reduzido (`prefers-reduced-motion: reduce`) para desativar animações pesadas.
- **Vidro Fosco (Frosted Glass)**: Menu de navegação dinâmico que ativa o efeito de vidro fosco (`backdrop-filter`) ao rolar a página.
- **Acessibilidade**: Estrutura semântica HTML5 com tags `aria-*` apropriadas, contraste de cores otimizado e menu acessível para leitores de tela.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** (Estrutura semântica)
- **Vanilla CSS** (Estilização baseada em Design Tokens customizados)
- **GSAP (GreenSock Animation Platform)** & **ScrollTrigger** (Para animações fluidas e efeitos baseados em scroll)
- **Google Fonts** (Fontes *Playfair Display* e *Inter*)

---

## 🚀 Como Executar o Projeto Localmente

Por se tratar de uma aplicação estática (HTML/CSS/JS puros), você não precisa de builds complexos ou instalações de dependências.

### Opção 1: Abertura Direta
Basta abrir o arquivo [index.html](file:///c:/Users/jotap/OneDrive/Documentos/nobre-im/index.html) diretamente em qualquer navegador moderno.

### Opção 2: Servidor Local (Recomendado)
Para garantir o carregamento correto de todos os recursos externos e simular um ambiente de produção:

- **Usando VS Code**: Instale a extensão **Live Server**, abra a pasta do projeto e clique em *"Go Live"*.
- **Usando Python**:
  ```bash
  python -m http.server 8000
  ```
  Depois, acesse `http://localhost:8000` no seu navegador.
- **Usando Node.js (npx)**:
  ```bash
  npx serve
  ```

---

## 📁 Estrutura de Arquivos

```
nobre-im/
├── index.html       # Estrutura HTML, estilos CSS internos e scripts de animação
├── hero-bg.jpg      # Imagem de fundo principal de alta resolução
├── .gitignore       # Arquivo de configuração para ignorar arquivos desnecessários no Git
├── LICENSE          # Licença MIT do projeto
└── README.md        # Documentação do projeto
```

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](file:///c:/Users/jotap/OneDrive/Documentos/nobre-im/LICENSE) para mais detalhes.

---

Desenvolvido por **João Costa**.
