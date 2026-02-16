import type { Locale } from '../types';

const translations: Record<string, Record<Locale, string>> = {
  // --- env / export ---
  'env.theme_changed': {
    fr: 'Thème changé',
    en: 'Theme changed',
    de: 'Thema geändert',
  },
  'env.themes_available': {
    fr: 'Thèmes disponibles',
    en: 'Available themes',
    de: 'Verfügbare Themen',
  },
  'env.lang_changed': {
    fr: 'Langue changée',
    en: 'Language changed',
    de: 'Sprache geändert',
  },
  'env.langs_available': {
    fr: 'Langues disponibles',
    en: 'Available languages',
    de: 'Verfügbare Sprachen',
  },
  'env.var_readonly': {
    fr: "Variable '{0}' non modifiable.",
    en: "Variable '{0}' is read-only.",
    de: "Variable '{0}' ist schreibgeschützt.",
  },
  'env.modifiable_vars': {
    fr: 'Variables modifiables',
    en: 'Modifiable variables',
    de: 'Änderbare Variablen',
  },

  // --- filesystem ---
  'fs.no_such_file': {
    fr: "Aucun fichier ou dossier de ce type",
    en: 'No such file or directory',
    de: 'Datei oder Verzeichnis nicht gefunden',
  },
  'fs.is_directory': {
    fr: 'Est un dossier',
    en: 'Is a directory',
    de: 'Ist ein Verzeichnis',
  },
  'fs.not_directory': {
    fr: "N'est pas un dossier",
    en: 'Not a directory',
    de: 'Ist kein Verzeichnis',
  },
  'fs.usage_cat': {
    fr: 'Usage: cat <fichier>',
    en: 'Usage: cat <file>',
    de: 'Verwendung: cat <Datei>',
  },
  'fs.dir': { fr: 'dossier', en: 'directory', de: 'Verzeichnis' },
  'fs.dirs': { fr: 'dossiers', en: 'directories', de: 'Verzeichnisse' },
  'fs.file': { fr: 'fichier', en: 'file', de: 'Datei' },
  'fs.files': { fr: 'fichiers', en: 'files', de: 'Dateien' },

  // --- find ---
  'find.usage': {
    fr: 'Usage: find [chemin] -name <motif>',
    en: 'Usage: find [path] -name <pattern>',
    de: 'Verwendung: find [Pfad] -name <Muster>',
  },
  'find.no_results': {
    fr: "Aucun fichier trouvé pour '{0}'.",
    en: "No files found for '{0}'.",
    de: "Keine Dateien gefunden für '{0}'.",
  },

  // --- grep ---
  'grep.usage': {
    fr: 'Usage: grep <pattern> [chemin]',
    en: 'Usage: grep <pattern> [path]',
    de: 'Verwendung: grep <Muster> [Pfad]',
  },
  'grep.invalid_regex': {
    fr: "regex invalide '{0}'",
    en: "invalid regex '{0}'",
    de: "ungültiger Regex '{0}'",
  },
  'grep.no_results': {
    fr: "Aucun résultat pour '{0}'.",
    en: "No results for '{0}'.",
    de: "Keine Ergebnisse für '{0}'.",
  },

  // --- history ---
  'history.empty': {
    fr: 'Historique vide.',
    en: 'History is empty.',
    de: 'Verlauf ist leer.',
  },

  // --- finger ---
  'finger.available': {
    fr: 'Témoignages disponibles :',
    en: 'Available testimonials:',
    de: 'Verfügbare Empfehlungen:',
  },
  'finger.unknown_user': {
    fr: "utilisateur inconnu.",
    en: 'unknown user.',
    de: 'unbekannter Benutzer.',
  },
  'finger.available_list': {
    fr: 'Disponibles',
    en: 'Available',
    de: 'Verfügbar',
  },

  // --- man ---
  'man.usage': {
    fr: 'Usage: man <page>',
    en: 'Usage: man <page>',
    de: 'Verwendung: man <Seite>',
  },
  'man.available_pages': {
    fr: 'Pages disponibles',
    en: 'Available pages',
    de: 'Verfügbare Seiten',
  },
  'man.no_page': {
    fr: "Pas de page de manuel pour '{0}'.",
    en: "No manual page for '{0}'.",
    de: "Keine Handbuchseite für '{0}'.",
  },

  // --- help ---
  'help.title': {
    fr: 'Commandes disponibles :',
    en: 'Available commands:',
    de: 'Verfügbare Befehle:',
  },
  'help.hint': {
    fr: 'Tab pour complétion, ↑/↓ pour historique.',
    en: 'Tab for completion, ↑/↓ for history.',
    de: 'Tab für Vervollständigung, ↑/↓ für Verlauf.',
  },
  'help.cat_navigation': {
    fr: 'Navigation',
    en: 'Navigation',
    de: 'Navigation',
  },
  'help.cat_info': {
    fr: 'Information',
    en: 'Information',
    de: 'Information',
  },
  'help.cat_system': {
    fr: 'Système',
    en: 'System',
    de: 'System',
  },
  'help.cat_action': {
    fr: 'Actions',
    en: 'Actions',
    de: 'Aktionen',
  },

  // --- welcome ---
  'welcome.title': {
    fr: 'Bienvenue sur antoinecunin.fr',
    en: 'Welcome to antoinecunin.fr',
    de: 'Willkommen auf antoinecunin.fr',
  },
  'welcome.hint': {
    fr: "Tapez 'help' pour voir les commandes disponibles.",
    en: "Type 'help' to see available commands.",
    de: "Geben Sie 'help' ein, um verfügbare Befehle anzuzeigen.",
  },

  // --- command descriptions (for help output) ---
  'cmd.ls': { fr: 'Lister le contenu du dossier', en: 'List directory contents', de: 'Verzeichnisinhalt auflisten' },
  'cmd.cd': { fr: 'Changer de dossier', en: 'Change directory', de: 'Verzeichnis wechseln' },
  'cmd.cat': { fr: 'Afficher le contenu d\'un fichier', en: 'Display file contents', de: 'Dateiinhalt anzeigen' },
  'cmd.pwd': { fr: 'Afficher le répertoire courant', en: 'Print working directory', de: 'Arbeitsverzeichnis anzeigen' },
  'cmd.tree': { fr: 'Afficher l\'arborescence', en: 'Display directory tree', de: 'Verzeichnisbaum anzeigen' },
  'cmd.whoami': { fr: 'Afficher l\'identité', en: 'Display user identity', de: 'Benutzeridentität anzeigen' },
  'cmd.man': { fr: 'Afficher les pages de manuel', en: 'Display manual pages', de: 'Handbuchseiten anzeigen' },
  'cmd.uname': { fr: 'Infos système', en: 'Display system information', de: 'Systeminformationen anzeigen' },
  'cmd.env': { fr: 'Afficher les variables d\'environnement', en: 'Display environment variables', de: 'Umgebungsvariablen anzeigen' },
  'cmd.export': { fr: 'Modifier une variable d\'environnement', en: 'Set environment variable', de: 'Umgebungsvariable setzen' },
  'cmd.grep': { fr: 'Chercher un motif dans les fichiers', en: 'Search for a pattern in files', de: 'Muster in Dateien suchen' },
  'cmd.find': { fr: 'Chercher des fichiers par nom', en: 'Search for files by name', de: 'Dateien nach Namen suchen' },
  'cmd.history': { fr: 'Afficher l\'historique', en: 'Display command history', de: 'Befehlsverlauf anzeigen' },
  'cmd.finger': { fr: 'Afficher les témoignages', en: 'Display testimonials', de: 'Empfehlungen anzeigen' },
  'cmd.help': { fr: 'Lister les commandes', en: 'List available commands', de: 'Verfügbare Befehle auflisten' },
  'cmd.clear': { fr: 'Effacer l\'écran', en: 'Clear the terminal screen', de: 'Bildschirm leeren' },

  // --- labels (filesystem content & commands) ---
  'label.name': { fr: 'Nom', en: 'Name', de: 'Name' },
  'label.role': { fr: 'Rôle', en: 'Role', de: 'Rolle' },
  'label.location': { fr: 'Lieu', en: 'Location', de: 'Standort' },
  'label.status': { fr: 'Statut', en: 'Status', de: 'Status' },
  'label.company': { fr: 'Entreprise', en: 'Company', de: 'Unternehmen' },
  'label.email': { fr: 'Email', en: 'Email', de: 'E-Mail' },
  'label.website': { fr: 'Site', en: 'Website', de: 'Webseite' },
  'label.period': { fr: 'Période', en: 'Period', de: 'Zeitraum' },
  'label.institution': { fr: 'Établissement', en: 'Institution', de: 'Einrichtung' },
  'label.context': { fr: 'Contexte', en: 'Context', de: 'Kontext' },
  'label.ssh': { fr: 'SSH', en: 'SSH', de: 'SSH' },

  // --- man page headers ---
  'man.header_experience': { fr: 'EXPERIENCE(7) — Expérience professionnelle', en: 'EXPERIENCE(7) — Professional Experience', de: 'EXPERIENCE(7) — Berufserfahrung' },
  'man.header_education': { fr: 'EDUCATION(7) — Formation', en: 'EDUCATION(7) — Education', de: 'EDUCATION(7) — Ausbildung' },
  'man.header_projects': { fr: 'PROJECTS(7) — Projets', en: 'PROJECTS(7) — Projects', de: 'PROJECTS(7) — Projekte' },

  // --- command not found ---
  'cmd.not_found': { fr: 'commande introuvable', en: 'command not found', de: 'Befehl nicht gefunden' },

  // --- README ---
  'readme.nav_desc': { fr: 'Naviguer dans le filesystem', en: 'Navigate the filesystem', de: 'Im Dateisystem navigieren' },
  'readme.man_desc': { fr: 'Pages de manuel (experience, education, projects)', en: 'Manual pages (experience, education, projects)', de: 'Handbuchseiten (experience, education, projects)' },
  'readme.whoami_desc': { fr: 'Informations personnelles', en: 'Personal information', de: 'Persönliche Informationen' },
  'readme.finger_desc': { fr: 'Témoignages', en: 'Testimonials', de: 'Empfehlungen' },
  'readme.env_desc': { fr: "Variables d'environnement", en: 'Environment variables', de: 'Umgebungsvariablen' },

  // --- sections ---
  'section.achievements': { fr: 'Réalisations', en: 'Achievements', de: 'Erfolge' },
  'section.contact': { fr: 'Contact', en: 'Contact', de: 'Kontakt' },
  'category.coding': { fr: 'Programmation', en: 'Coding', de: 'Programmierung' },
  'category.creative': { fr: 'Créatif', en: 'Creative', de: 'Kreativ' },

  // --- project ---
  'project.ssh': {
    fr: 'Code source accessible : ssh {id}@antoinecunin.fr',
    en: 'Source code available: ssh {id}@antoinecunin.fr',
    de: 'Quellcode verfügbar: ssh {id}@antoinecunin.fr',
  },

  // --- ssh ---
  'ssh.usage': {
    fr: 'Usage: ssh <projet>@antoinecunin.fr',
    en: 'Usage: ssh <project>@antoinecunin.fr',
    de: 'Verwendung: ssh <Projekt>@antoinecunin.fr',
  },
  'ssh.connecting': {
    fr: "Connexion à {0}...",
    en: 'Connecting to {0}...',
    de: 'Verbindung zu {0}...',
  },
  'ssh.connected': {
    fr: 'Connexion établie.',
    en: 'Connection established.',
    de: 'Verbindung hergestellt.',
  },
  'ssh.hint': {
    fr: "Tapez 'exit' pour quitter.",
    en: "Type 'exit' to disconnect.",
    de: "Geben Sie 'exit' ein, um die Verbindung zu trennen.",
  },
  'ssh.already_connected': {
    fr: 'Session SSH déjà active. Tapez exit pour quitter.',
    en: 'SSH session already active. Type exit to disconnect.',
    de: 'SSH-Sitzung bereits aktiv. Geben Sie exit ein, um die Verbindung zu trennen.',
  },
  'ssh.invalid_host': {
    fr: "Hôte inconnu : {0}",
    en: 'Unknown host: {0}',
    de: 'Unbekannter Host: {0}',
  },
  'ssh.unknown_project': {
    fr: "Projet inconnu : {0}",
    en: 'Unknown project: {0}',
    de: 'Unbekanntes Projekt: {0}',
  },
  'ssh.no_ssh': {
    fr: "Pas de code source disponible pour {0}.",
    en: 'No source code available for {0}.',
    de: 'Kein Quellcode verfügbar für {0}.',
  },

  // --- exit ---
  'exit.closed': {
    fr: 'Connexion à {0} fermée.',
    en: 'Connection to {0} closed.',
    de: 'Verbindung zu {0} geschlossen.',
  },
  'exit.not_connected': {
    fr: "Pas de session SSH active.",
    en: 'No active SSH session.',
    de: 'Keine aktive SSH-Sitzung.',
  },

  // --- command descriptions ---
  'cmd.ssh': { fr: 'Se connecter à un projet via SSH', en: 'Connect to a project via SSH', de: 'Per SSH mit einem Projekt verbinden' },
  'cmd.exit': { fr: 'Fermer la session SSH', en: 'Close SSH session', de: 'SSH-Sitzung beenden' },
};

export default translations;
