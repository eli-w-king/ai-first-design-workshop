import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { crc32 } from 'node:zlib';

// A stored ZIP needs no runtime dependencies. Fixed dates keep public builds reproducible.
function zip(files) {
  const local = [], central = [];
  let offset = 0;
  const u16 = n => { const b = Buffer.alloc(2); b.writeUInt16LE(n); return b; };
  const u32 = n => { const b = Buffer.alloc(4); b.writeUInt32LE(n); return b; };
  for (const [file, bytes] of files) {
    const name = Buffer.from(`kit/${file}`);
    // ZIP 2.0, UTF-8 filenames, no compression, 1980-01-01 at midnight.
    const fields = [u16(20), u16(0x800), u16(0), u16(0), u16(33), u32(crc32(bytes)), u32(bytes.length), u32(bytes.length), u16(name.length), u16(0)];
    const header = Buffer.concat([u32(0x04034b50), ...fields, name]);
    local.push(header, bytes);
    central.push(Buffer.concat([u32(0x02014b50), u16(20), ...fields, u16(0), u16(0), u16(0), u32(0), u32(offset), name]));
    offset += header.length + bytes.length;
  }
  const directory = Buffer.concat(central);
  return Buffer.concat([...local, directory, u32(0x06054b50), u16(0), u16(0), u16(files.size), u16(files.size), u32(directory.length), u32(offset), u16(0)]);
}

export async function buildKit(source, out) {
  const manifest = await fs.readFile(path.join(source, 'manifest.json'));
  const files = new Map([['manifest.json', manifest]]);
  for (const { file, sha256 } of JSON.parse(manifest).files) {
    if (!/^(decks|notes|prd|research|screens)\/[\w .'-]+\.(txt|md|png)$/.test(file) || files.has(file)) throw new Error('Unexpected public kit path.');
    const input = path.join(source, file);
    if (await fs.realpath(input) !== input) throw new Error('Kit inputs must not be symbolic links.');
    const bytes = await fs.readFile(input);
    if (createHash('sha256').update(bytes).digest('hex') !== sha256) throw new Error(`Review the kit checksum for ${file}.`);
    files.set(file, bytes);
  }
  for (const [file, bytes] of files) {
    const dest = path.join(out, 'kit', file);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, bytes);
  }
  await fs.writeFile(path.join(out, 'kit.zip'), zip(files));
}
