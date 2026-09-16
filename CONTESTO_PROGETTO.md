# OpenERP Canarias - Contesto Progetto

## 🎯 COSA ABBIAMO FATTO

### Sistema ERP completo con:
- ✅ Autenticazione con ruoli (admin, manager, agent, viewer)
- ✅ Dashboard con ricerca clienti e statistiche
- ✅ Gestione contatti completa con 8 tab
- ✅ Preventivi, Ordini, Fatture, DDT con numeri progressivi
- ✅ Gestione magazzino con carico/scarico
- ✅ Gestione agenti con piano settimanale
- ✅ Gestione trasportatori
- ✅ PDF professionali con logo aziendale
- ✅ Design responsive azzurro/verde
- ✅ Sistema sicurezza completo

### File principali:
- `src/App.tsx` - Componente principale
- `src/types.ts` - Tipi TypeScript
- `src/data.ts` - Dati iniziali
- `src/i18n.ts` - Traduzioni IT/ES
- `src/index.css` - Stili con animazioni

### Componenti:
- `src/components/Contacts.tsx` (911 righe) - Gestione contatti completa
- `src/components/Dashboard.tsx` - Dashboard
- `src/components/Inventory.tsx` - Magazzino
- `src/components/Orders.tsx` - Ordini
- `src/components/Invoicing.tsx` - Fatturazione
- `src/components/Agents.tsx` - Agenti
- `src/components/Carriers.tsx` - Trasportatori
- `src/components/CompanySettings.tsx` - Impostazioni azienda
- `src/components/SalesActivity.tsx` - Attività vendita
- `src/components/WeeklyPlanner.tsx` - Piano settimanale
- `src/components/UserManagement.tsx` - Gestione utenti
- `src/components/Sidebar.tsx` - Menu laterale
- `src/components/Header.tsx` - Header
- `src/components/Login.tsx` - Login

### Utilities:
- `src/utils/auth.ts` - Autenticazione
- `src/utils/security.ts` - Sicurezza
- `src/utils/pdfTemplates.ts` - Template PDF

## 🎨 DESIGN SYSTEM
- Colori: Azzurro (#0ea5e9) + Verde (#10b981)
- Gradienti: sky-500 to emerald-500
- Animazioni: fade-in, slide-in, scale-in
- Responsive: Mobile-first

## 🔑 CREDENZIALI TEST
- Username: admin
- Password: Admin@2026!

## 📊 FORMATI DOCUMENTI
- Preventivo: PRES.0001.NomeCliente.YYMMDD
- Ordine: PED.0001.NomeCliente.YYMMDD
- Fattura: FAT.0001.NomeCliente.YYMMDD
- DDT: DDT.0001.NomeCliente.YYMMDD

## 🚀 COME AVVIARE
```bash
npm install
npm run dev