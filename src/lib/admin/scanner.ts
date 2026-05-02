// scanner.ts — find <Screenshot src="..."/> references in MDX content.
// Each unique filename becomes a "slot" that the admin can fill.

export interface ScreenshotSlot {
  filename: string;        // e.g. "main-window.png"
  fullPath: string;        // e.g. "/odd-server-manager-wiki/screenshots/main-window.png"
  sourcePages: string[];   // tutorial files that reference this filename
}

const SCREENSHOT_RE = /<Screenshot\b[^>]*\bsrc=["']([^"']+)["'][^>]*\/>/g;

export function findSlotsInMdx(
  mdxText: string,
  sourcePath: string,
): { filename: string; fullPath: string; sourcePath: string }[] {
  const matches: { filename: string; fullPath: string; sourcePath: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = SCREENSHOT_RE.exec(mdxText)) !== null) {
    const fullPath = m[1];
    const filename = fullPath.split('/').pop() ?? fullPath;
    matches.push({ filename, fullPath, sourcePath });
  }
  return matches;
}

export function aggregateSlots(
  perFile: { filename: string; fullPath: string; sourcePath: string }[],
): ScreenshotSlot[] {
  const map = new Map<string, ScreenshotSlot>();
  for (const item of perFile) {
    const existing = map.get(item.filename);
    if (existing) {
      if (!existing.sourcePages.includes(item.sourcePath)) {
        existing.sourcePages.push(item.sourcePath);
      }
    } else {
      map.set(item.filename, {
        filename: item.filename,
        fullPath: item.fullPath,
        sourcePages: [item.sourcePath],
      });
    }
  }
  // Sort by first-seen source page so EN/AR pairs render adjacent in groups.
  return Array.from(map.values()).sort((a, b) =>
    a.sourcePages[0].localeCompare(b.sourcePages[0])
  );
}

export function pageTitleFromPath(path: string): string {
  // "src/content/docs/en/install-server.mdx" → "install-server"
  const slug = path.split('/').pop()?.replace(/\.mdx?$/, '') ?? path;
  // Title-case the slug
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
