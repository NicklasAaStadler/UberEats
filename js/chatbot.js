const style = document.createElement('style');
style.textContent = `
#chat-btn{position:fixed;bottom:24px;right:24px;width:52px;height:52px;border-radius:50%;background:#06c167;color:#fff;border:none;font-size:1.4rem;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.2);z-index:9999}
#chat-box{display:none;flex-direction:column;position:fixed;bottom:88px;right:24px;width:320px;max-height:480px;background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.15);z-index:9999;overflow:hidden}
#chat-box.open{display:flex}
#chat-head{background:#06c167;color:#fff;padding:.9rem 1rem;font-weight:700;font-size:.95rem}
#chat-msgs{flex:1;padding:1rem;overflow-y:auto;display:flex;flex-direction:column;gap:.5rem}
.cmsg{padding:.6rem .85rem;border-radius:12px;font-size:.87rem;max-width:85%;line-height:1.5}
.cmsg.u{background:#06c167;color:#fff;align-self:flex-end;border-radius:12px 12px 2px 12px}
.cmsg.b{background:#f1f1f1;color:#111;align-self:flex-start;border-radius:12px 12px 12px 2px}
#chat-foot{display:flex;border-top:1px solid #eee}
#chat-in{flex:1;border:none;padding:.75rem;font-size:.9rem;outline:none;font-family:inherit}
#chat-go{background:#06c167;color:#fff;border:none;padding:.75rem 1rem;cursor:pointer;font-weight:700}
`;
document.head.appendChild(style);

const ui = document.createElement('div');
ui.innerHTML = `
<button id="chat-btn">💬</button>
<div id="chat-box">
  <div id="chat-head">UberEats Support 🟢</div>
  <div id="chat-msgs"><div class="cmsg b">Hej! Hvordan kan jeg hjælpe dig i dag? 😊</div></div>
  <div id="chat-foot">
    <input id="chat-in" placeholder="Skriv en besked...">
    <button id="chat-go">Send</button>
  </div>
</div>`;
document.body.appendChild(ui);

 const history = [{role:'system', content:`
  Du er en kundesupport-assistent for UberEats Danmark. Svar altid kort og venligt på dansk.
  
  Om sitet:
  - Brugere kan bestille mad fra restauranter som Pizza Notte, Pasta Basta, Taco Loco og Pho Vietnam
  - Levering tager typisk 20-40 minutter
  - Studerende kan få op til 40% rabat ved at verificere sig via WAYF på studierabat-siden
  - Betaling sker ved checkout – vi accepterer kort
  - Ordrer kan ikke annulleres efter bekræftelse

  Hvis nogen spørger om en specifik ordre eller konto, sig at de skal kontakte support på support@ubereats.dk.
  Hvis du ikke ved svaret, sig det ærligt frem for at gætte.
  `}];

function addMsg(text, who) {
  const el = document.createElement('div');
  el.className = 'cmsg ' + who;
  el.textContent = text;
  const msgs = document.getElementById('chat-msgs');
  msgs.appendChild(el);
  msgs.scrollTop = msgs.scrollHeight;
  return el;
}

async function send() {
  const input = document.getElementById('chat-in');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  addMsg(text, 'u');
  history.push({role:'user', content:text});
  const typing = addMsg('...', 'b');
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {'Authorization':'Bearer '+GROQ_KEY, 'Content-Type':'application/json'},
      body: JSON.stringify({model:'llama-3.1-8b-instant', messages:history})
    });
    const data = await res.json();
    if (!res.ok) {
      console.error('Groq fejl:', JSON.stringify(data));
      typing.textContent = 'Fejl: ' + (data.error?.message || res.status);
      return;
    }
    const reply = data.choices[0].message.content;
    history.push({role:'assistant', content:reply});
    typing.textContent = reply;
  } catch (err) {
    console.error('Chatbot fejl:', err);
    typing.textContent = 'Noget gik galt. Prøv igen.';
  }
}

document.getElementById('chat-btn').onclick = () => document.getElementById('chat-box').classList.toggle('open');
document.getElementById('chat-go').onclick = send;
document.getElementById('chat-in').addEventListener('keydown', e => e.key === 'Enter' && send());
