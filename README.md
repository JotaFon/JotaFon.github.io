# João Victor Fonseca — Portfolio

Portfolio em português e inglês, com conteúdo baseado no PDF fornecido. React, TypeScript, Vinext, Three.js, WebGL 2, shaders em TSL, GSAP e i18next.

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
- `components/portfolio/page-loader.tsx`: abertura com sólidos 3D animados e progresso por etapas de carregamento, com limite de espera e suporte a movimento reduzido.
- `components/portfolio/use-portfolio-motion.ts`: coreografia de scroll, títulos, leitura progressiva, profundidade e microinterações com GSAP.
- `components/portfolio/loader-solid.tsx`: prisma com bordas chanfradas que interpola entre seções triangulares, quadradas, hexagonais e dodecagonais.
- `components/portfolio/sculpture.tsx`: Mickey glTF animado, rotação por arraste ou teclado, animação em loop, pausa, restauração e sombra em TSL.
- `app/page.tsx`: apresentação, trajetória profissional, perfil e contato.
- `app/globals.css`: identidade visual e layouts responsivos.
- `public/joao-victor-fonseca-portfolio.pdf`: documento original para download.

A renderização usa o backend WebGL 2 do WebGPURenderer para executar os materiais TSL. A cena carrega sob demanda, limita a densidade de pixels, suspende a renderização fora da tela e respeita movimento reduzido. A navegação usa rolagem nativa. Sem suporte gráfico, todo o conteúdo profissional permanece acessível.

As experiências de trabalho são apresentadas como trajetória, sem inventar projetos pessoais, imagens de produtos ou métricas. O site não inclui formulário com envio simulado: contato por e-mail, WhatsApp, LinkedIn e GitHub.

Os ícones em `public/icons` vêm de Simple Icons v11 (CC0): https://www.npmjs.com/package/simple-icons/v/11.0.0. Os nomes dos serviços permanecem visíveis e os ícones são decorativos para leitores de tela.

O Mickey em `public/models/mickey` vem de [Steamboat Willie — Animated](https://sketchfab.com/3d-models/steamboat-willie-animated-fd5073a9f0294743b2d6da0909bdb17b), de [Adrian Cojocaru](https://sketchfab.com/FatOfTheLand), sob [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). A animação original de aproximadamente 11 segundos é reproduzida em loop pelo AnimationMixer. A exportação Alembic original usa malhas por quadro e morph targets; `node scripts/prepare-mickey.mjs ../mickey` prepara a versão web com simplificação conservadora, quadros de topologia variável a 15 fps, morph targets interpolados a 7,5 fps e compressão Meshopt. O arquivo binário passa de 462 MB para aproximadamente 19 MB. Materiais monocromáticos, licença e crédito do autor foram mantidos. Quadros inativos não são desenhados e a animação pausa fora da tela ou com movimento reduzido.

A identidade visual usa preto e branco, títulos em Lilita One, contornos e sombras sólidas inspirados em cartoons antigos. A textura sutil é estática; não há cintilação. Enter ou espaço pausam/retomam o personagem, e as setas laterais giram a cena.

O cabeçalho alterna português/inglês com i18next (`lib/locales/pt.ts` e `en.ts`) e salva a escolha localmente. O contato reúne GitHub, Gmail, WhatsApp e LinkedIn; os destinos ficam em `lib/contact.ts`.

Os cursores de luva são do conjunto [Hand Mickey Mouse, por NaLexnu](http://www.rw-designer.com/cursor-set/handmickeymd), disponibilizado sob CC BY-NC, com crédito no rodapé e licença original em `public/cursors/LICENSE.txt`. Os arquivos fornecidos são usados sem modificações e apenas em dispositivos com mouse.

A coreografia usa compressão e extensão, antecipação, entradas escalonadas e acomodação elástica. A reação do personagem ao arraste é sutil e se soma à animação original. O modo de movimento reduzido desativa esses efeitos.
