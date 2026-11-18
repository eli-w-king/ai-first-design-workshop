export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
}

export function promptBlock(id, text, label = 'Prompt') {
  return `<div class="prompt"><div class="prompt-bar"><span>${escapeHtml(label)}</span><button class="copy" type="button" data-copy="${escapeHtml(id)}" aria-label="Copy ${escapeHtml(label.toLowerCase())}" hidden>Copy</button></div><pre><code id="${escapeHtml(id)}">${escapeHtml(text)}</code></pre></div>`;
}

function inline(text) {
  const tokens = /(`[^`\n]+`|\[[^\]\n]+\]\([^\s)]+\)|\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g;
  return text.split(tokens).map(part => {
    if (part.startsWith('`') && part.endsWith('`')) return `<code>${escapeHtml(part.slice(1, -1))}</code>`;
    if (part.startsWith('**') && part.endsWith('**')) return `<strong>${escapeHtml(part.slice(2, -2))}</strong>`;
    if (part.startsWith('*') && part.endsWith('*')) return `<em>${escapeHtml(part.slice(1, -1))}</em>`;
    const link = part.match(/^\[([^\]]+)\]\(([^\s)]+)\)$/);
    if (link) {
      if (!/^(https:\/\/|\/(?!\/)|#[a-zA-Z])/.test(link[2])) throw new Error('Unsupported link in course source. Use HTTPS or a site-relative link.');
      return `<a href="${escapeHtml(link[2])}">${escapeHtml(link[1])}</a>`;
    }
    return escapeHtml(part);
  }).join('');
}

// The course uses a small, deliberately HTML-free Markdown subset.
export function renderMarkdown(markdown, prefix = 'lesson', headingOffset = 1) {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  const output = [];
  let index = 0;
  let codeCount = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index++; continue; }
    if (line.startsWith('```')) {
      const label = line.slice(3).trim() === 'prompt' ? 'Prompt' : 'Copyable text';
      const code = [];
      index++;
      while (index < lines.length && lines[index] !== '```') code.push(lines[index++]);
      if (index >= lines.length) throw new Error('Unclosed code block in course source.');
      output.push(promptBlock(`${prefix}-prompt-${++codeCount}`, code.join('\n'), label));
      index++;
      continue;
    }
    const heading = line.match(/^(#{1,5})\s+(.+)$/);
    if (heading) {
      const level = Math.min(6, heading[1].length + headingOffset);
      output.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      index++;
      continue;
    }
    const list = line.match(/^(?:([-*]) |(\d+)\. )(.+)$/);
    if (list) {
      const tag = list[2] ? 'ol' : 'ul';
      const pattern = tag === 'ol' ? /^\d+\. (.+)$/ : /^[-*] (.+)$/;
      const items = [];
      while (index < lines.length) {
        const item = lines[index].match(pattern);
        if (!item) break;
        items.push(`<li>${inline(item[1])}</li>`);
        index++;
      }
      output.push(`<${tag}>${items.join('')}</${tag}>`);
      continue;
    }
    if (line.startsWith('> ')) {
      output.push(`<div class="note"><p>${inline(line.slice(2))}</p></div>`);
      index++;
      continue;
    }
    const paragraph = [line];
    index++;
    while (index < lines.length && lines[index].trim() && !/^(#{1,5}\s|```|> |[-*] |\d+\. )/.test(lines[index])) paragraph.push(lines[index++]);
    output.push(`<p>${inline(paragraph.join(' '))}</p>`);
  }
  return output.join('\n');
}
