interface LeadData {
  name: string;
  whatsapp: string;
  segmento: string;
  conversa: string;
}

export function leadEmailTemplate(lead: LeadData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #1a1a1a; border-radius: 16px; overflow: hidden; border: 1px solid #2a2a2a; }
    .header { background: linear-gradient(135deg, #7c3aed, #3b82f6); padding: 32px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 24px; }
    .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px; }
    .body { padding: 32px; }
    .field { margin-bottom: 24px; }
    .field-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 4px; }
    .field-value { font-size: 16px; color: #e0e0e0; background: #2a2a2a; padding: 12px 16px; border-radius: 8px; }
    .conversa { font-size: 14px; color: #ccc; background: #2a2a2a; padding: 16px; border-radius: 8px; line-height: 1.6; white-space: pre-wrap; }
    .cta { text-align: center; margin-top: 32px; }
    .cta a { display: inline-block; background: linear-gradient(135deg, #7c3aed, #3b82f6); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; }
    .footer { text-align: center; padding: 24px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Novo Lead Capturado!</h1>
      <p>Robô Vendedor acabou de qualificar mais um lead</p>
    </div>
    <div class="body">
      <div class="field">
        <div class="field-label">Nome</div>
        <div class="field-value">${lead.name}</div>
      </div>
      <div class="field">
        <div class="field-label">WhatsApp</div>
        <div class="field-value">
          <a href="https://wa.me/${lead.whatsapp.replace(/\D/g, "")}" style="color: #7c3aed; text-decoration: none;">
            ${lead.whatsapp}
          </a>
        </div>
      </div>
      <div class="field">
        <div class="field-label">Segmento</div>
        <div class="field-value">${lead.segmento || "Não informado"}</div>
      </div>
      <div class="field">
        <div class="field-label">Conversa com a IA</div>
        <div class="conversa">${lead.conversa || "N/A"}</div>
      </div>
      <div class="cta">
        <a href="https://wa.me/${lead.whatsapp.replace(/\D/g, "")}" target="_blank">
          💬 Chamar no WhatsApp
        </a>
      </div>
    </div>
    <div class="footer">
      Robô Vendedor — michelribeiro.com.br
    </div>
  </div>
</body>
</html>
  `.trim();
}
