// Mapeamento de Processos: comportamento do site (sem dependências externas)
(function () {
  "use strict";

  // Aviso de prévia
  var aviso = document.getElementById("aviso-previa");
  if (aviso) {
    aviso.querySelector("button").addEventListener("click", function () { aviso.hidden = true; });
  }

  // Vídeo: sem menu de contexto nem arrasto. Reduz o download casual; não impede cópia nem gravação de tela.
  var video = document.getElementById("video-input");
  if (video) {
    video.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    video.addEventListener("dragstart", function (e) { e.preventDefault(); });
  }

  // Leitor de telas da apresentação
  var telas = [
    { titulo: "Abertura: Mapeamento de Processos" },
    { titulo: "Introdução: nem sempre o trabalho é complicado" },
    { titulo: "Vamos acompanhar o caminho de um pedido" },
    { titulo: "Vídeo do INPUT", nota: 'No encontro, o vídeo tocou dentro do monitor desta tela. <a href="#video">Assista no Capítulo 1</a>.' },
    { titulo: "Depois do vídeo: e os caminhos da sua área?" },
    { titulo: "Uma proposta para a SAPE" },
    { titulo: "Participação: quem participa e o que caberia a cada um" },
    { titulo: "Possíveis encaminhamentos" },
    { titulo: "Para levar: um convite à participação" },
    { titulo: "Obrigado" }
  ];
  var leitor = document.getElementById("leitor");
  if (!leitor) return;

  var imagem = document.getElementById("leitor-imagem");
  var atualEl = document.getElementById("leitor-atual");
  var notaEl = document.getElementById("leitor-nota");
  var btnAnt = document.getElementById("leitor-ant");
  var btnProx = document.getElementById("leitor-prox");
  var lista = document.getElementById("leitor-miniaturas");
  var btnCheia = document.getElementById("leitor-tela-cheia");
  var atual = 0;

  function numero(i) { return String(i + 1).padStart(2, "0"); }

  document.getElementById("leitor-total").textContent = telas.length;

  telas.forEach(function (t, i) {
    var li = document.createElement("li");
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Tela " + (i + 1) + ": " + t.titulo);
    b.innerHTML = '<img src="img/slides/mini-' + numero(i) + '.webp" alt="" width="320" height="180" loading="lazy"><span>' + (i + 1) + "</span>";
    b.addEventListener("click", function () { mostrar(i, "miniatura"); });
    li.appendChild(b);
    lista.appendChild(li);
  });
  var miniaturas = lista.querySelectorAll("button");

  // Pré-carrega a vizinha para a troca ser imediata
  function precarregar(i) {
    if (i >= 0 && i < telas.length) { new Image().src = "img/slides/tela-" + numero(i) + ".webp"; }
  }

  // origem: como a pessoa chegou à tela (seta, teclado, miniatura, deslizar); vazia na abertura da página
  function mostrar(i, origem) {
    if (i < 0 || i >= telas.length || (origem && i === atual)) return;
    atual = i;
    imagem.src = "img/slides/tela-" + numero(i) + ".webp";
    imagem.alt = "Tela " + (i + 1) + " de " + telas.length + ": " + telas[i].titulo;
    atualEl.textContent = i + 1;
    notaEl.innerHTML = telas[i].nota || "";
    btnAnt.disabled = i === 0;
    btnProx.disabled = i === telas.length - 1;
    miniaturas.forEach(function (m, j) { m.setAttribute("aria-current", j === i ? "true" : "false"); });
    var m = miniaturas[i];
    lista.scrollTo({ left: m.parentNode.offsetLeft - lista.clientWidth / 2 + m.clientWidth / 2, behavior: "smooth" });
    precarregar(i + 1);
    precarregar(i - 1);
    if (origem) {
      leitor.dispatchEvent(new CustomEvent("telamudou", { detail: { numero: i + 1, origem: origem } }));
    }
  }

  btnAnt.addEventListener("click", function () { mostrar(atual - 1, "seta"); });
  btnProx.addEventListener("click", function () { mostrar(atual + 1, "seta"); });

  leitor.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "PageDown") { mostrar(atual + 1, "teclado"); e.preventDefault(); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { mostrar(atual - 1, "teclado"); e.preventDefault(); }
    else if (e.key === "Home") { mostrar(0, "teclado"); e.preventDefault(); }
    else if (e.key === "End") { mostrar(telas.length - 1, "teclado"); e.preventDefault(); }
  });

  // Deslizar o dedo no celular
  var palco = leitor.querySelector(".leitor__palco");
  var inicioX = null, inicioY = null;
  palco.addEventListener("touchstart", function (e) {
    inicioX = e.touches[0].clientX; inicioY = e.touches[0].clientY;
  }, { passive: true });
  palco.addEventListener("touchend", function (e) {
    if (inicioX === null) return;
    var dx = e.changedTouches[0].clientX - inicioX;
    var dy = e.changedTouches[0].clientY - inicioY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { mostrar(atual + (dx < 0 ? 1 : -1), "deslizar"); }
    inicioX = null;
  });

  // Tela cheia (quando o navegador permite; no iPhone o botão some)
  if (leitor.requestFullscreen) {
    btnCheia.addEventListener("click", function () {
      if (document.fullscreenElement) { document.exitFullscreen(); }
      else { leitor.requestFullscreen().then(function () { leitor.focus(); }).catch(function () {}); }
    });
    document.addEventListener("fullscreenchange", function () {
      btnCheia.textContent = document.fullscreenElement ? "Sair da tela cheia" : "Tela cheia";
    });
  } else {
    btnCheia.hidden = true;
  }

  imagem.addEventListener("dragstart", function (e) { e.preventDefault(); });

  mostrar(0);
})();
