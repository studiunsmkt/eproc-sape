# Eproc SAPE: Mapeamento de Processos

Site dos materiais da apresentação **Mapeamento de Processos** (SAPE/SC · EPROC, outubro de 2026): vídeo do INPUT, as 10 telas da apresentação, o texto da proposta e o personagem INPUT.

Publicado pelo GitHub Pages a partir da branch `main`, pasta raiz.

© 2026 Studiuns Marketing. Uso permitido como material de apoio pessoal, para estudo e consulta individual, com preservação dos créditos. Não é autorizado o uso comercial ou institucional por empresas, órgãos governamentais ou outras organizações sem autorização prévia do titular. Estar neste repositório não muda essa regra.

## Estrutura

| Caminho | Conteúdo |
|---|---|
| `index.html` | Página única: capa, vídeo, apresentação, proposta, INPUT, créditos |
| `css/site.css` | Estilos (cores e tipos da identidade do INPUT) |
| `js/site.js` | Leitor de telas (setas, teclado, miniaturas, deslizar, tela cheia) |
| `js/medicao.js` | Eventos do Google Analytics |
| `img/` | Telas da apresentação, cenas do vídeo e poses do INPUT (WebP) |
| `fonts/` | Ubuntu Sans e Sniglet (licença em `fonts/Sniglet-OFL.txt`) |
| `previa.py` | Servidor local para testar antes de publicar |

Não há etapa de compilação nem dependências: os arquivos são servidos como estão.

## Vídeo

O vídeo **não fica neste repositório**. O botão "Ver vídeo" abre o arquivo no Google Drive da Studiuns, em nova aba. O link está em `index.html`, no elemento `#ver-video`. No Drive, o arquivo está como "qualquer pessoa com o link: leitor", com download desativado para leitores. Isso dificulta o download, mas não impede gravação de tela.

## Google Analytics

ID de medição `G-KRV4BWRV29` (propriedade exclusiva deste site). A tag fica no `<head>` do `index.html`; os eventos ficam em `js/medicao.js`:

| Evento | Quando |
|---|---|
| `page_view` | ao abrir a página |
| `scroll` | 25, 50, 75 e 90% da página, uma vez cada (`percent_scrolled`) |
| `clique_navegacao` | menu do topo e botão da capa (`secao`, `local`) |
| `tela_apresentacao` | troca de tela no leitor (`numero_tela`, `origem`) |
| `tela_cheia` | entrar em tela cheia no leitor |
| `ver_video` | clique em "Ver vídeo" (mede a abertura do link, não a reprodução no Drive) |

No fluxo do Analytics, a métrica otimizada está com Rolagens, Cliques de saída e páginas por histórico **desligados**, para não duplicar esses eventos. Se mudar algo no fluxo, revise `js/medicao.js`.

Para testar sem misturar com visitas reais, abra o site com `?ga_debug=1` no fim do endereço e acompanhe em Administrador > DebugView. Bloqueadores de anúncio impedem o envio dos eventos.

## Manutenção

1. Teste localmente: `python3 previa.py` e abra http://localhost:8765.
2. Confira celular e computador (sem rolagem lateral), o leitor de telas e o botão do vídeo.
3. Não altere textos, telas, avisos de direitos ou créditos sem autorização de Tiago (Studiuns).
4. Para trocar uma tela: gere a imagem a partir da apresentação, salve como `img/slides/tela-NN.webp` (1920×1080) e `mini-NN.webp` (320×180).

## Publicação

1. Envie as alterações para a branch `main`, por `git push` ou pelo botão "Add file > Upload files" do GitHub.
2. O Pages publica sozinho em alguns minutos. Acompanhe em **Actions** ou em **Settings > Pages**.
3. Abra o endereço publicado, confira a página e veja no DebugView se os eventos chegam.

Não coloque credenciais, o vídeo nem documentos internos neste repositório.
