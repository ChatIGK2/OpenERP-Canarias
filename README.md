# OpenERP Canarias - Sistema Gestionale ERP

Sistema gestionale ERP completo per aziende, sviluppato con React, TypeScript e Tailwind CSS.

## 🚀 Caratteristiche Principali

### 📊 Dashboard
- Ricerca clienti avanzata
- Statistiche in tempo reale
- Piano di lavoro settimanale per agenti
- Performance agenti con metriche dettagliate

### 👥 Gestione Contatti
- Gestione clienti (privati e aziende)
- Anagrafica completa con dati suddivisi
- Indirizzo fatturazione e spedizione separati
- PEC, codice univoco, seconda email/telefono
- Codice fiscale per privati
- Partita IVA per aziende

### 📦 Magazzino
- Gestione prodotti con campo "lineas" per descrizioni dettagliate
- Carico/scarico magazzino con giustificazione obbligatoria
- Storico movimenti completo
- Alert per stock sotto minima

### 📋 Preventivi, Ordini, Fatture, DDT
- Numerazione progressiva automatica
- Selezione prodotti da magazzino
- Calcolo IGIC automatico
- Gestione rate di pagamento
- PDF professionali con logo aziendale
- Trasportatori e dati spedizione per DDT

### 🎯 Pro Vendita
- Attività (chiamate, email, note, promemoria, riunioni, visite)
- Filtro per stato (pianificate, completate)
- Priorità (alta, media, bassa)
- Statistiche per tipo attività

### 👔 Gestione Agenti
- Creazione e gestione agenti
- Statistiche per agente (lead, preventivi, ordini, fatture)
- Dettaglio contatti assegnati
- Performance e fatturato

### 🚚 Gestione Trasportatori
- Creazione e gestione trasportatori
- Ricerca e filtri
- Attivazione/disattivazione

### 🏢 La Mia Azienda
- Dati aziendali completi
- Upload logo aziendale
- Dati bancari (IBAN, SWIFT/BIC)
- Informazioni fiscali (NIF, P.IVA, Registro Imprese)

### 🔐 Sicurezza
- Autenticazione con ruoli (admin, manager, agent, viewer)
- Rate limiting per login
- Audit log completo
- Session management con timeout
- Validazione password avanzata

## 📦 Installazione

### Prerequisiti
- Node.js 18+
- npm o yarn

### Passaggi

1. **Clona o scarica il progetto**
```bash
cd openerp-canarias
```

2. **Installa le dipendenze**
```bash
npm install
```

3. **Avvia il server di sviluppo**
```bash
npm run dev
```

4. **Apri il browser**
```
http://localhost:3000
```

## 🔑 Credenziali di Default

- **Username:** `admin`
- **Password:** `Admin@2026!`

⚠️ **IMPORTANTE:** Cambia la password dopo il primo accesso!

## 🛠️ Comandi Disponibili

```bash
# Avvia server di sviluppo
npm run dev

# Build per produzione
npm run build

# Verifica tipi TypeScript
npm run typecheck

# Preview build produzione
npm run preview
```

## 📁 Struttura del Progetto

```
openerp-canarias/
├── src/
│   ├── components/          # Componenti React
│   │   ├── Accounting.tsx
│   │   ├── Agents.tsx
│   │   ├── Carriers.tsx
│   │   ├── CompanySettings.tsx
│   │   ├── Contacts.tsx
│   │   ├── Dashboard.tsx
│   │   ├── EmailMarketing.tsx
│   │   ├── Header.tsx
│   │   ├── Inventory.tsx
│   │   ├── Invoicing.tsx
│   │   ├── Login.tsx
│   │   ├── Orders.tsx
│   │   ├── SalesActivity.tsx
│   │   ├── Settings.tsx
│   │   ├── Sidebar.tsx
│   │   ├── UserManagement.tsx
│   │   └── WeeklyPlanner.tsx
│   ├── utils/               # Utility functions
│   │   ├── auth.ts         # Autenticazione e autorizzazione
│   │   ├── security.ts     # Sicurezza e validazione
│   │   └── pdfTemplates.ts # Template PDF professionali
│   ├── App.tsx             # Componente principale
│   ├── main.tsx            # Entry point
│   ├── index.css           # Stili globali con Tailwind
│   ├── data.ts             # Dati iniziali
│   ├── types.ts            # Definizioni TypeScript
│   └── i18n.ts             # Internazionalizzazione
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.js
└── README.md
```

## 🎨 Design System

### Colori Principali
- **Azzurro (Sky):** `#0ea5e9` - Colore primario
- **Verde (Emerald):** `#10b981` - Colore secondario
- **Viola:** `#8b5cf6` - Accento
- **Ambra:** `#f59e0b` - Warning

### Animazioni
- `animate-fade-in` - Fade in con movimento verticale
- `animate-slide-in-right` - Slide da destra
- `animate-slide-in-left` - Slide da sinistra
- `animate-scale-in` - Scale in
- `animate-pulse-soft` - Pulsazione soft

### Classi Custom
- `card-hover` - Effetto hover per card
- `btn-hover` - Effetto hover per bottoni
- `gradient-primary` - Gradiente primario
- `gradient-secondary` - Gradiente secondario
- `gradient-mixed` - Gradiente misto
- `glass` - Effetto glass morphism

## 🔐 Ruoli e Permessi

### Admin
- Accesso completo a tutte le funzionalità
- Gestione utenti
- Gestione agenti
- Gestione trasportatori
- Configurazione azienda

### Manager
- Gestione contatti (lettura, scrittura, eliminazione)
- Gestione preventivi, ordini, fatture
- Gestione magazzino
- Visualizzazione report

### Agent
- Gestione contatti (lettura, scrittura)
- Gestione preventivi e ordini
- Visualizzazione fatture e magazzino

### Viewer
- Solo lettura su contatti, preventivi, ordini, fatture

## 📊 Funzionalità Principali

### Gestione Documenti
- **Preventivi:** Numerazione `PRES.0001.NomeCliente.240115`
- **Ordini:** Numerazione `PED.0001.NomeCliente.240115`
- **Fatture:** Numerazione `FAT.0001.NomeCliente.240115`
- **DDT:** Numerazione `DDT.0001.NomeCliente.240115`

### Modalità di Pagamento
- Bonifico 30/60/90 giorni
- Pagamento anticipato
- 50% subito + 50% a 30 giorni
- 30% acconto + 70% alla consegna
- 30% subito + 35% a 30gg + 35% a 60gg

### PDF Professionali
- Logo aziendale personalizzabile
- Dati aziendali completi
- Dati cliente
- Tabella articoli con totali
- Rate di pagamento (se applicabile)
- Dati bancari per fatture
- Firma per DDT

## 🌐 Internazionalizzazione

Il sistema supporta italiano e spagnolo:
- Interfaccia switchabile
- Documenti sempre in spagnolo
- Date e valute localizzate

## 🔒 Sicurezza

### Autenticazione
- Password hash con SHA-256
- Rate limiting (5 tentativi, 15 minuti)
- Blocco account dopo 5 tentativi falliti
- Session timeout (30 minuti inattività)
- Session expiration (8 ore)

### Validazione
- Validazione email
- Validazione telefono
- Validazione NIF/CIF
- Validazione IBAN
- Validazione password avanzata

### Audit Log
- Tracciamento completo di tutte le azioni
- Login/logout
- Creazione/modifica/eliminazione utenti
- Movimenti magazzino
- Filtri e ricerca

## 📝 Note Importanti

### Magazzino
- Il carico/scarico manuale richiede giustificazione obbligatoria
- Tutti i movimenti sono registrati nello storico
- Lo scarico automatico avviene con le fatture
- Il carico automatico avviene con le note di credito

### Fatturazione
- Le fatture generano automaticamente lo scarico magazzino
- Le note di credito ricaricano il magazzino
- Supporto per fatturazione elettronica (API pronta)

### PDF
- I PDF si aprono in una nuova finestra
- Possono essere stampati o salvati
- Includono tutti i dati aziendali e del cliente

## 🐛 Troubleshooting

### Problemi comuni

**Errore TypeScript:**
```bash
npm run typecheck
```

**Problemi con le dipendenze:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Porta 3000 già in uso:**
Modifica `vite.config.js` e cambia la porta

## 📞 Supporto

Per supporto o domande:
- Email: support@openerp-canarias.es
- Telefono: +34 928 123 456

## 📄 Licenza

Questo progetto è proprietario di OpenERP Canarias S.L.

## 🎯 Roadmap Futura

- [ ] Integrazione API fatturazione elettronica
- [ ] Report avanzati con grafici
- [ ] Export dati (Excel, CSV)
- [ ] Backup automatico
- [ ] Notifiche email
- [ ] App mobile
- [ ] Multi-azienda
- [ ] Integrazione CRM avanzato

---

**Versione:** 2.0
**Ultimo aggiornamento:** Gennaio 2026
**Sviluppato da:** OpenERP Canarias S.L.
