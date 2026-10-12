import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import vm from 'node:vm';

// Version locale auditée. Une autre version exige une nouvelle revue du pont.
const fingerprints = {
  'build_template.js': '39991f50ea9a9651429ab861aa4cd186e321695168051c1f2f98022362ad90dd',
  'vcoac_base.js': '6ade4a241a74c48e4ad11381f564e50af4e9f89e7a7934626490e6874a0ca138',
  'vcoac_composeurs.js': '6b95307510aab237d658f09bf9e36461749cd50daecceb39b652ca96d45765a9',
  'types_vcoac.json': '3a443bc130f7df0aefd46c24394c7caf43a301834c415d7afd09c77d3be142ae',
  'template_spec.json': '3934939408bf883112587df8a8cdc1cf7d98ed102c468a5785b48068b463f250',
};
export const sha256 = value => createHash('sha256').update(value).digest('hex');

function between(text, start, end) {
  const a = text.indexOf(start), b = text.indexOf(end, a + start.length);
  if (a < 0 || b < 0) throw new Error('Section machine introuvable : nouvelle revue requise.');
  return text.slice(a, b);
}

export async function loadMachine(directory) {
  const files = {};
  for (const [name, expected] of Object.entries(fingerprints)) {
    const bytes = await readFile(join(directory, name));
    if (sha256(bytes) !== expected) throw new Error(`Machine modifiée : ${name}. Nouvelle revue requise.`);
    files[name] = bytes.toString('utf8');
  }
  const contract = JSON.parse(files['types_vcoac.json']);
  const composers = new Set([...files['vcoac_composeurs.js'].matchAll(/def\("([A-Z_]+)"/g)].map(m => m[1]));
  // Exécution des fonctions ORIGINALES, lues à chaque appel. Ni require du moteur,
  // ni stub d'un rendu réussi : le code de construction n'entre pas dans le contexte.
  const native = between(files['build_template.js'], 'function valeursChemin(', '// ─── Fiche du type');
  const french = between(files['vcoac_base.js'], 'function fr(s)', '// ─── Mesure du texte');
  const context = vm.createContext({ TYPES: contract }, { codeGeneration: { strings: false, wasm: false } });
  new vm.Script(`${french}\nconst B = { fr };\n${native}`).runInContext(context, { timeout: 1000 });
  const call = new vm.Script('controlerContrat(slide, definition, alerts)');
  return {
    contract, composers, fingerprints,
    check(slide) {
      const definition = contract.types[slide.type];
      if (!definition || !composers.has(slide.type)) return [`type inconnu : ${slide.type}`];
      context.slide = structuredClone(slide); context.definition = definition; context.alerts = [];
      call.runInContext(context, { timeout: 1000 });
      return Array.from(context.alerts);
    },
  };
}

// Le contrôleur natif ne contrôle pas les types JSON et ignore les clés inconnues.
// Ce complément lit les chemins du catalogue ; il ne recopie pas ses 36 types.
function shapeFrom(fields) {
  const root = { children: {} };
  for (const field of fields) {
    let at = root;
    for (const segment of field.cle.split('.')) {
      const list = segment.endsWith('[]'), key = segment.replace(/\[\]$/, '');
      at.children ??= {};
      at = at.children[key] ??= {};
      if (list) { at.array = true; at = at.item ??= {}; }
    }
    if (field.n) { at.array = true; at.item ??= {}; }
    if (field.max || field.valeurs) at.scalar = true;
  }
  return root;
}

function checkShape(value, shape, path, errors) {
  if (shape.array) {
    if (!Array.isArray(value)) { errors.push(`${path} : tableau requis`); return; }
    value.forEach((v, i) => checkShape(v, shape.item, `${path}[${i}]`, errors));
  } else if (shape.children) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) { errors.push(`${path} : objet requis`); return; }
    for (const [key, v] of Object.entries(value)) {
      if (!shape.children[key]) errors.push(`${path}.${key} : champ inconnu`);
      else checkShape(v, shape.children[key], `${path}.${key}`, errors);
    }
  } else if (path === 'slide.sombre') {
    if (typeof value !== 'boolean') errors.push(`${path} : booléen requis`);
  } else if (typeof value !== 'string' || !value.trim()) errors.push(`${path} : texte non vide requis`);
}

export function validateSpec(spec, machine) {
  const errors = [], nativeWarnings = [], volumes = [];
  if (!spec || !Array.isArray(spec.slides) || !spec.slides.length) return { valid: false, errors: ['slides : tableau non vide requis'], nativeWarnings, volumes };
  for (const key of Object.keys(spec)) if (!['deck', 'slides'].includes(key)) errors.push(`spec.${key} : champ inconnu`);
  if (!spec.deck || typeof spec.deck.titre !== 'string' || typeof spec.deck.auteur !== 'string' || spec.deck.fichesDansNotes !== false) errors.push('Métadonnées deck invalides.');
  spec.slides.forEach((slide, i) => {
    const label = `slide ${i + 1}`;
    const definition = machine.contract.types[slide.type];
    const warnings = machine.check(slide);
    nativeWarnings.push(...warnings.map(message => ({ slide: i + 1, message })));
    if (!definition) return;
    const shape = shapeFrom(machine.contract.commun.concat(definition.champs));
    for (const [key, variant] of Object.entries(definition.variantes || {})) {
      // Les variantes objet sont décrites par leurs sous-champs dans le catalogue.
      const segments = key.split('.'); let at = shape;
      for (const segment of segments) { at.children ??= {}; at = at.children[segment] ??= {}; }
      at.scalar = true;
    }
    checkShape(slide, shape, 'slide', errors);
    // V1 sans fichiers graphiques ni pictogrammes : aucun besoin de résolution d'asset.
    const walk = (v, key = '') => {
      if (['image', 'portrait', 'picto', 'logo', 'chemin'].includes(key)) errors.push(`${label} : ASSET_REQUIRED / asset hors profil V1 (${key})`);
      if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, k));
    };
    walk(slide);
    if (slide.type === 'FICHE_OUTIL' && typeof slide.pied !== 'string') errors.push(`${label} : pied consommé par le composeur requis en V1`);
    if (slide.type === 'PROCESSUS' && slide.etapes?.some(e => typeof e.exemple !== 'string')) errors.push(`${label} : exemple consommé par le composeur requis en V1`);
    // Majorant statique : texte du spec + numéros et libellés fixes du composeur.
    // Le compteur exact D1 appartient au rendu et n'est pas prétendu exécuté.
    const visible = Object.fromEntries(Object.entries(slide).filter(([k]) => !['notes', 'type', 'phase', 'section', 'variante', 'sombre'].includes(k)));
    const words = v => typeof v === 'string' ? v.split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length : (v && typeof v === 'object' ? Object.values(v).reduce((n, x) => n + words(x), 0) : 0);
    const upper = words(visible) + 20;
    volumes.push({ slide: i + 1, conservative_words: upper, max: definition.motsMax });
    if (upper > definition.motsMax) errors.push(`${label} : majorant ${upper} mots > ${definition.motsMax}`);
  });
  return { valid: !errors.length && !nativeWarnings.length, errors, nativeWarnings, volumes };
}
