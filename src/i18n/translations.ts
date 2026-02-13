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
  'fs.dirs_count': {
    fr: 'dossier(s)',
    en: 'directory(ies)',
    de: 'Verzeichnis(se)',
  },
  'fs.files_count': {
    fr: 'fichier(s)',
    en: 'file(s)',
    de: 'Datei(en)',
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
  'cmd.history': { fr: 'Afficher l\'historique', en: 'Display command history', de: 'Befehlsverlauf anzeigen' },
  'cmd.finger': { fr: 'Afficher les témoignages', en: 'Display testimonials', de: 'Empfehlungen anzeigen' },
  'cmd.help': { fr: 'Lister les commandes', en: 'List available commands', de: 'Verfügbare Befehle auflisten' },
  'cmd.clear': { fr: 'Effacer l\'écran', en: 'Clear the terminal screen', de: 'Bildschirm leeren' },
};

export default translations;
