// Inventory declared package metadata; upstream license texts remain authoritative.
import fs from 'node:fs/promises';
const lock = JSON.parse(await fs.readFile('package-lock.json', 'utf8'));
const rows = Object.entries(lock.packages).filter(([name]) => name).map(([location, pkg]) => ({
  name: location.split('node_modules/').at(-1),
  version: pkg.version,
  license: pkg.license || 'Not declared in lockfile; inspect upstream',
  use: pkg.dev ? 'Development' : 'Runtime / optional runtime',
  location,
})).sort((a, b) => a.name.localeCompare(b.name) || a.version.localeCompare(b.version));
const escape = value => String(value).replaceAll('|', '\\|');
const output = '# Dependency license inventory\n\nGenerated from the committed `package-lock.json` with `node scripts/license-inventory.mjs`. Includes optional platform and development packages, whether or not installed on this computer. This records declared metadata, not a legal audit or replacement for upstream copyright notices and license texts. See [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md).\n\n| Package | Version | Declared license | Use |\n|---|---|---|---|\n' + rows.map(pkg => `| ${escape(pkg.name)} | ${escape(pkg.version)} | ${escape(pkg.license)} | ${escape(pkg.use)} |`).join('\n') + '\n';
await fs.writeFile('docs/DEPENDENCY_LICENSES.md', output);
console.log(`Documented ${rows.length} locked package entries.`);
