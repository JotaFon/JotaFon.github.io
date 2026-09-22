# João Victor Fonseca — Portfolio

Portfolio em português, com conteúdo baseado no PDF fornecido. React, TypeScript, Vinext, Three.js, WebGL 2, shaders em TSL, GSAP e i18next.

## Desenvolvimento

```sh
npm install
npm run dev
```

A prévia usa http://localhost:5173. Para verificar tipos e criar a versão de produção:

```sh
npx tsc --noEmit
npm run build
```

## Conteúdo e experiência

- `lib/locales/pt.ts`: textos em português e dados profissionais. O namespace é `portfolio`.
- `components/portfolio/sculpture.tsx`: escultura procedural, material em TSL, interação por ponteiro e teclado, pausa e troca de material.
- `app/page.tsx`: apresentação, trajetória profissional, perfil e contato.
- `app/globals.css`: identidade visual e layouts responsivos.
- `public/joao-victor-fonseca-portfolio.pdf`: documento original para download.

A renderização usa o backend WebGL 2 do WebGPURenderer para executar os materiais TSL. A cena carrega sob demanda, limita a densidade de pixels, suspende a renderização fora da tela e respeita movimento reduzido. A navegação usa rolagem nativa. Sem suporte gráfico, todo o conteúdo profissional permanece acessível.

As experiências de trabalho são apresentadas como trajetória, sem inventar projetos pessoais, imagens de produtos ou métricas. O site não inclui formulário com envio simulado: contato por e-mail, LinkedIn e GitHub.
