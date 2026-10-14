/*
 * Consentimento de cookies (LGPD) com o Google Consent Mode v2.
 * Precisa carregar ANTES do snippet do GTM: define tudo como "negado" até a pessoa escolher.
 * A escolha fica no localStorage ("marelli_cookies": "aceito" ou "recusado").
 * Qualquer link com href="#cookies" reabre o aviso para a pessoa mudar de ideia.
 */
(function () {
  var CHAVE = 'marelli_cookies';
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function ler() {
    try { return localStorage.getItem(CHAVE); } catch (e) { return null; }
  }
  function gravar(valor) {
    try { localStorage.setItem(CHAVE, valor); } catch (e) {}
  }
  function estado(aceito) {
    var v = aceito ? 'granted' : 'denied';
    return { ad_storage: v, analytics_storage: v, ad_user_data: v, ad_personalization: v };
  }

  // Padrão: nada de cookie de medição ou anúncio sem consentimento.
  var padrao = estado(false);
  padrao.wait_for_update = 500;
  gtag('consent', 'default', padrao);

  var escolha = ler();
  if (escolha === 'aceito') gtag('consent', 'update', estado(true));

  function escolher(aceito) {
    gravar(aceito ? 'aceito' : 'recusado');
    gtag('consent', 'update', estado(aceito));
    // Gatilho para tags que não seguem o Consent Mode sozinhas (ex: Pixel da Meta).
    window.dataLayer.push({ event: aceito ? 'cookies_aceitos' : 'cookies_recusados' });
    fechar();
  }

  var aviso = null;
  function fechar() {
    if (aviso) { aviso.remove(); aviso = null; }
  }

  function mostrar() {
    if (aviso) return;
    aviso = document.createElement('div');
    aviso.setAttribute('role', 'dialog');
    aviso.setAttribute('aria-label', 'Aviso de cookies');
    aviso.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:90;max-width:560px;margin:0 auto;' +
      'background:#FFFFFF;color:#3A3A3A;border:1px solid #E5E5E5;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,0.16);' +
      'padding:18px 20px;font-family:Poppins,sans-serif;display:flex;flex-direction:column;gap:14px';
    aviso.innerHTML =
      '<div style="font-size:13.5px;line-height:1.6">Usamos cookies para medir o uso do site e melhorar nossos anúncios. ' +
      'Você escolhe se aceita. Saiba mais na <a href="privacidade.html" style="color:#C41230;font-weight:600;text-decoration:underline">Política de Privacidade</a>.</div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
      '<button type="button" data-cookies="recusar" style="flex:1 1 140px;padding:12px 18px;border-radius:999px;border:1.5px solid #C41230;background:#FFFFFF;color:#C41230;font-family:inherit;font-weight:600;font-size:13.5px;cursor:pointer">Recusar</button>' +
      '<button type="button" data-cookies="aceitar" style="flex:1 1 140px;padding:12px 18px;border-radius:999px;border:1.5px solid #C41230;background:#C41230;color:#FFFFFF;font-family:inherit;font-weight:600;font-size:13.5px;cursor:pointer">Aceitar</button>' +
      '</div>';
    aviso.addEventListener('click', function (e) {
      var acao = e.target.getAttribute && e.target.getAttribute('data-cookies');
      if (acao) escolher(acao === 'aceitar');
    });
    document.body.appendChild(aviso);
  }

  // Links "#cookies" (rodapé e política) reabrem o aviso.
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href="#cookies"]');
    if (!link) return;
    e.preventDefault();
    mostrar();
  });

  function iniciar() { if (!ler()) mostrar(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
