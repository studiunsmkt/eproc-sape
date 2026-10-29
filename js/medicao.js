// Mapeamento de Processos: eventos do Google Analytics (G-KRV4BWRV29)
// A visualização de página vai pelo próprio gtag('config'). No fluxo, a "Métrica otimizada" está com
// Rolagens, Cliques de saída e páginas por histórico desligados, para não duplicar o que este arquivo envia.
(function () {
  "use strict";
  if (typeof window.gtag !== "function") return;

  function enviar(nome, parametros) { window.gtag("event", nome, parametros || {}); }

  // Rolagem: 25, 50, 75 e 90%, cada marco uma vez por carregamento
  var marcos = [25, 50, 75, 90];
  var enviados = {};
  var agendado = false;
  function conferirRolagem() {
    agendado = false;
    var doc = document.documentElement;
    var total = doc.scrollHeight - window.innerHeight;
    if (total <= 0) return;
    var pct = (window.scrollY / total) * 100;
    marcos.forEach(function (m) {
      if (pct >= m && !enviados[m]) {
        enviados[m] = true;
        enviar("scroll", { percent_scrolled: m });
      }
    });
    if (enviados[90]) window.removeEventListener("scroll", aoRolar);
  }
  function aoRolar() {
    if (!agendado) { agendado = true; window.requestAnimationFrame(conferirRolagem); }
  }
  window.addEventListener("scroll", aoRolar, { passive: true });

  // Navegação interna: menu do topo e botão da capa
  document.querySelectorAll('.topo__nav a, .quadro--legenda .botao').forEach(function (a) {
    a.addEventListener("click", function () {
      enviar("clique_navegacao", {
        secao: a.getAttribute("href").replace("#", ""),
        local: a.classList.contains("botao") ? "capa" : "menu"
      });
    });
  });

  // Leitor de telas: só quando a pessoa troca de tela (a abertura da página não conta)
  var leitor = document.getElementById("leitor");
  if (leitor) {
    leitor.addEventListener("telamudou", function (e) {
      enviar("tela_apresentacao", { numero_tela: e.detail.numero, origem: e.detail.origem });
    });
    var btnCheia = document.getElementById("leitor-tela-cheia");
    if (btnCheia) {
      btnCheia.addEventListener("click", function () {
        if (!document.fullscreenElement) enviar("tela_cheia", { secao: "apresentacao" });
      });
    }
  }

  // Botão "Ver vídeo": mede a abertura do link do Drive, não a reprodução lá dentro
  var verVideo = document.getElementById("ver-video");
  if (verVideo) {
    verVideo.addEventListener("click", function () {
      enviar("ver_video", { secao: "video", link_domain: "drive.google.com" });
    });
  }
})();
