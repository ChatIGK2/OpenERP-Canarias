--- EXPORT_src_utils_pdfTemplates.ts (原始)


+++ EXPORT_src_utils_pdfTemplates.ts (修改后)
import { companyData } from '../data';

// Template PDF professionale per tutti i documenti
export function generateProfessionalPDF(
  docType: 'PREVENTIVO' | 'ORDINE' | 'FATTURA' | 'DDT',
  docNumber: string,
  date: string,
  client: {
    name: string;
    company?: string;
    address: string;
    email?: string;
    phone?: string;
    nif?: string;
  },
  items: Array<{
    description: string;
    quantity: number;
    unitPrice?: number;
    total: number;
    unit?: string;
  }>,
  totals: {
    subtotal: number;
    igic?: number;
    igicRate?: number;
    total: number;
  },
  additionalInfo?: {
    paymentTerms?: string;
    deliveryDate?: string;
    carrier?: string;
    goodsQuantity?: number;
    goodsUnit?: string;
    packagesPallets?: number;
    packagesBuckets?: number;
    transportReason?: string;
    orderRef?: string;
    notes?: string;
    installments?: Array<{
      percentage: number;
      amount: number;
      dueDate: string;
    }>;
  }
): string {
  const logo = companyData.logo
    ? `<img src="${companyData.logo}" alt="Logo" style="max-width: 150px; max-height: 80px; object-fit: contain;" />`
    : `<div style="font-size: 24px; font-weight: bold; color: #0ea5e9;">${companyData.name}</div>`;

  const docTypeColors = {
    'PREVENTIVO': '#0ea5e9',
    'ORDINE': '#10b981',
    'FATTURA': '#8b5cf6',
    'DDT': '#f59e0b'
  };

  const color = docTypeColors[docType];

  let itemsTable = `
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr style="background: ${color}; color: white;">
          <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Descrizione</th>
          <th style="padding: 12px; text-align: center; border: 1px solid #ddd; width: 80px;">Qtà</th>
          ${docType !== 'DDT' ? '<th style="padding: 12px; text-align: right; border: 1px solid #ddd; width: 100px;">Prezzo Unit.</th>' : ''}
          <th style="padding: 12px; text-align: right; border: 1px solid #ddd; width: 100px;">Totale</th>
        </tr>
      </thead>
      <tbody>
  `;

  items.forEach((item, index) => {
    const bgColor = index % 2 === 0 ? '#f9fafb' : '#ffffff';
    itemsTable += `
      <tr style="background: ${bgColor};">
        <td style="padding: 10px; border: 1px solid #ddd;">${item.description}</td>
        <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${item.quantity} ${item.unit || ''}</td>
        ${docType !== 'DDT' ? `<td style="padding: 10px; text-align: right; border: 1px solid #ddd;">€${(item.unitPrice || 0).toFixed(2)}</td>` : ''}
        <td style="padding: 10px; text-align: right; border: 1px solid #ddd; font-weight: 600;">€${item.total.toFixed(2)}</td>
      </tr>
    `;
  });

  itemsTable += '</tbody></table>';

  let totalsSection = '';
  if (docType !== 'DDT') {
    totalsSection = `
      <table style="width: 300px; margin-left: auto; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; text-align: right; font-weight: 600;">Imponibile:</td>
          <td style="padding: 8px; text-align: right;">€${totals.subtotal.toFixed(2)}</td>
        </tr>
        ${totals.igic !== undefined ? `
        <tr>
          <td style="padding: 8px; text-align: right; font-weight: 600;">IGIC (${totals.igicRate || 7}%):</td>
          <td style="padding: 8px; text-align: right;">€${totals.igic.toFixed(2)}</td>
        </tr>
        ` : ''}
        <tr style="background: ${color}; color: white; font-size: 16px;">
          <td style="padding: 12px; text-align: right; font-weight: bold;">TOTALE:</td>
          <td style="padding: 12px; text-align: right; font-weight: bold;">€${totals.total.toFixed(2)}</td>
        </tr>
      </table>
    `;
  }

  let additionalInfoSection = '';
  if (additionalInfo) {
    const infoItems = [];

    if (additionalInfo.paymentTerms) {
      infoItems.push(`<p><strong>Modalità di Pagamento:</strong> ${additionalInfo.paymentTerms}</p>`);
    }
    if (additionalInfo.deliveryDate) {
      infoItems.push(`<p><strong>Data Consegna:</strong> ${additionalInfo.deliveryDate}</p>`);
    }
    if (additionalInfo.orderRef) {
      infoItems.push(`<p><strong>Riferimento Ordine:</strong> ${additionalInfo.orderRef}</p>`);
    }
    if (additionalInfo.carrier) {
      infoItems.push(`<p><strong>Trasportatore:</strong> ${additionalInfo.carrier}</p>`);
    }
    if (additionalInfo.transportReason) {
      infoItems.push(`<p><strong>Causale Trasporto:</strong> ${additionalInfo.transportReason}</p>`);
    }
    if (additionalInfo.goodsQuantity !== undefined) {
      infoItems.push(`<p><strong>Quantità Merce:</strong> ${additionalInfo.goodsQuantity} ${additionalInfo.goodsUnit || ''}</p>`);
    }
    if (additionalInfo.packagesPallets !== undefined) {
      infoItems.push(`<p><strong>Colli/Pallet:</strong> ${additionalInfo.packagesPallets}</p>`);
    }
    if (additionalInfo.packagesBuckets !== undefined) {
      infoItems.push(`<p><strong>Secchi:</strong> ${additionalInfo.packagesBuckets}</p>`);
    }
    if (additionalInfo.notes) {
      infoItems.push(`<p><strong>Note:</strong> ${additionalInfo.notes}</p>`);
    }

    if (infoItems.length > 0) {
      additionalInfoSection = `
        <div style="margin: 20px 0; padding: 15px; background: #f0f9ff; border-left: 4px solid ${color}; border-radius: 8px;">
          ${infoItems.join('')}
        </div>
      `;
    }

    // Rate di pagamento
    if (additionalInfo.installments && additionalInfo.installments.length > 0) {
      let installmentsTable = `
        <div style="margin: 20px 0;">
          <h3 style="color: ${color}; margin-bottom: 10px;">Piano di Pagamento</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: ${color}; color: white;">
                <th style="padding: 10px; text-align: left;">Rata</th>
                <th style="padding: 10px; text-align: center;">Percentuale</th>
                <th style="padding: 10px; text-align: right;">Importo</th>
                <th style="padding: 10px; text-align: right;">Scadenza</th>
              </tr>
            </thead>
            <tbody>
      `;

      additionalInfo.installments.forEach((inst, index) => {
        installmentsTable += `
          <tr style="background: ${index % 2 === 0 ? '#f9fafb' : '#ffffff'};">
            <td style="padding: 10px; border: 1px solid #ddd;">Rata ${index + 1}</td>
            <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${inst.percentage}%</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #ddd; font-weight: 600;">€${inst.amount.toFixed(2)}</td>
            <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${inst.dueDate}</td>
          </tr>
        `;
      });

      installmentsTable += '</tbody></table></div>';
      additionalInfoSection += installmentsTable;
    }
  }

  // Dati bancari
  let bankInfo = '';
  if (docType === 'FATTURA' && companyData.iban) {
    bankInfo = `
      <div style="margin: 20px 0; padding: 15px; background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 8px;">
        <h3 style="color: #10b981; margin-bottom: 10px;">Dati per il Pagamento</h3>
        <p><strong>IBAN:</strong> ${companyData.iban}</p>
        ${companyData.bankName ? `<p><strong>Banca:</strong> ${companyData.bankName}</p>` : ''}
        ${companyData.swift ? `<p><strong>SWIFT/BIC:</strong> ${companyData.swift}</p>` : ''}
      </div>
    `;
  }

  // Firma
  let signatureSection = '';
  if (docType === 'DDT') {
    signatureSection = `
      <div style="display: flex; justify-content: space-between; margin-top: 60px;">
        <div style="text-align: center;">
          <div style="border-top: 1px solid #333; padding-top: 5px; width: 200px;">Firma Mittente</div>
        </div>
        <div style="text-align: center;">
          <div style="border-top: 1px solid #333; padding-top: 5px; width: 200px;">Firma Destinatario</div>
        </div>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${docType} ${docNumber}</title>
      <style>
        @page {
          size: A4;
          margin: 20mm;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #1f2937;
          line-height: 1.6;
          margin: 0;
          padding: 0;
        }
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <!-- Header con Logo e Dati Azienda -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid ${color};">
        <div>
          ${logo}
          <div style="margin-top: 10px; font-size: 12px; color: #6b7280;">
            <p style="margin: 2px 0;">${companyData.address}</p>
            ${companyData.phone ? `<p style="margin: 2px 0;">Tel: ${companyData.phone}</p>` : ''}
            ${companyData.email ? `<p style="margin: 2px 0;">Email: ${companyData.email}</p>` : ''}
            ${companyData.pec ? `<p style="margin: 2px 0;">PEC: ${companyData.pec}</p>` : ''}
            ${companyData.website ? `<p style="margin: 2px 0;">${companyData.website}</p>` : ''}
          </div>
        </div>
        <div style="text-align: right;">
          <h1 style="color: ${color}; margin: 0; font-size: 32px;">${docType}</h1>
          <p style="margin: 5px 0; font-size: 14px;"><strong>N°:</strong> ${docNumber}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Data:</strong> ${date}</p>
        </div>
      </div>

      <!-- Dati Azienda (in alto a destra) -->
      <div style="margin-bottom: 30px; padding: 15px; background: #f9fafb; border-radius: 8px; font-size: 12px;">
        <p style="margin: 2px 0;"><strong>${companyData.name}</strong></p>
        <p style="margin: 2px 0;">${companyData.address}</p>
        ${companyData.nif ? `<p style="margin: 2px 0;">NIF: ${companyData.nif}</p>` : ''}
        ${companyData.vat ? `<p style="margin: 2px 0;">P.IVA: ${companyData.vat}</p>` : ''}
        ${companyData.registerNumber ? `<p style="margin: 2px 0;">Reg. Imprese: ${companyData.registerNumber}</p>` : ''}
        ${companyData.uniqueCode ? `<p style="margin: 2px 0;">Cod. Univoco: ${companyData.uniqueCode}</p>` : ''}
      </div>

      <!-- Dati Cliente -->
      <div style="margin-bottom: 30px; padding: 15px; background: #f0f9ff; border-left: 4px solid ${color}; border-radius: 8px;">
        <h3 style="color: ${color}; margin: 0 0 10px 0;">Dati Cliente</h3>
        <p style="margin: 2px 0;"><strong>${client.name}</strong></p>
        ${client.company ? `<p style="margin: 2px 0;">${client.company}</p>` : ''}
        <p style="margin: 2px 0;">${client.address}</p>
        ${client.email ? `<p style="margin: 2px 0;">Email: ${client.email}</p>` : ''}
        ${client.phone ? `<p style="margin: 2px 0;">Tel: ${client.phone}</p>` : ''}
        ${client.nif ? `<p style="margin: 2px 0;">NIF: ${client.nif}</p>` : ''}
      </div>

      <!-- Tabella Articoli -->
      ${itemsTable}

      <!-- Totali -->
      ${totalsSection}

      <!-- Informazioni Aggiuntive -->
      ${additionalInfoSection}

      <!-- Dati Bancari -->
      ${bankInfo}

      <!-- Firma per DDT -->
      ${signatureSection}

      <!-- Footer -->
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 10px; color: #9ca3af;">
        <p style="margin: 2px 0;">${companyData.name} - ${companyData.address}</p>
        ${companyData.nif ? `<p style="margin: 2px 0;">NIF: ${companyData.nif}</p>` : ''}
        ${companyData.vat ? `<p style="margin: 2px 0;">P.IVA: ${companyData.vat}</p>` : ''}
      </div>
    </body>
    </html>
  `;
}
