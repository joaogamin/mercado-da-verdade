import { SITE_URL } from "@/lib/site";

const TEXTO =
  "109 dos 112 produtos que a campanha usa como prova seguem mais caros que em janeiro de 2019. E a conta é feita com os números deles.";

const wa = `https://wa.me/?text=${encodeURIComponent(`${TEXTO} ${SITE_URL}/`)}`;
const x = `https://twitter.com/intent/tweet?text=${encodeURIComponent(TEXTO)}&url=${encodeURIComponent(SITE_URL + "/")}`;

const SCRIPT = `(function(){
  var b=document.getElementById('copiar-link'); if(!b) return;
  b.addEventListener('click',function(){
    var url=${JSON.stringify(SITE_URL + "/")};
    function feito(){ var o=b.textContent; b.textContent='Link copiado'; setTimeout(function(){b.textContent=o;},2000); }
    if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(url).then(feito,feito); }
    else { var i=document.createElement('input'); i.value=url; document.body.appendChild(i); i.select();
           try{document.execCommand('copy');}catch(e){} document.body.removeChild(i); feito(); }
  });
})();`;

const botao: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 20px",
  fontSize: 13, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase",
  textDecoration: "none", border: "2px solid var(--ink)", background: "#fff",
  color: "var(--ink)", cursor: "pointer", fontFamily: "var(--mono)",
};

export default function Compartilhe() {
  return (
    <section id="compartilhe" className="sec sec--tight" style={{ background: "var(--accent)" }}>
      <div className="wrap">
        <div className="eyebrow" style={{ color: "var(--ink)" }}>Compartilhe</div>
        <h2 className="sec-title" style={{ color: "var(--ink)", maxWidth: "24ch" }}>
          Essa conta precisa circular.
        </h2>
        <p style={{ fontSize: 17, color: "var(--ink)", maxWidth: "60ch", marginTop: 16, opacity: 0.85 }}>
          A régua torta viaja rápido porque é simples. O contexto viaja devagar porque exige explicação.
          Se esta checagem te ajudou a entender o número, ela ajuda outra pessoa também.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 26 }}>
          <a href={wa} target="_blank" rel="noopener noreferrer" style={botao}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.29-.77.95-.94 1.15-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.29-.02-.45.13-.6.13-.13.3-.35.45-.52.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.29-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.34zM12.04 21.5h-.01a9.44 9.44 0 0 1-4.8-1.32l-.35-.2-3.57.94.95-3.48-.23-.36a9.4 9.4 0 0 1-1.44-5.03c0-5.2 4.24-9.44 9.46-9.44 2.53 0 4.9.99 6.68 2.77a9.38 9.38 0 0 1 2.77 6.68c0 5.2-4.24 9.44-9.46 9.44zM20.5 3.49A11.8 11.8 0 0 0 12.04 0C5.46 0 .1 5.35.1 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.28-1.65a11.9 11.9 0 0 0 5.75 1.47h.01c6.58 0 11.94-5.35 11.94-11.92 0-3.19-1.24-6.18-3.49-8.43z" />
            </svg>
            WhatsApp
          </a>

          <a href={x} target="_blank" rel="noopener noreferrer" style={botao}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41z" />
            </svg>
            Postar no X
          </a>

          <button id="copiar-link" type="button" style={botao}>
            Copiar link
          </button>
        </div>

        <p className="mono" style={{ fontSize: 12.5, color: "var(--ink)", opacity: 0.7, marginTop: 20 }}>
          O texto já vai pronto com o dado principal. Se preferir, escreva o seu — o link é o mesmo.
        </p>
      </div>

      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
    </section>
  );
}
