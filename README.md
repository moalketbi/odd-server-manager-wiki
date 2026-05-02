# ODD ARK Server Manager — Wiki

Tutorials for the ODD ARK Server Manager — English and Arabic.

🌐 **Live site:** <https://moalketbi.github.io/odd-server-manager-wiki/>

## Local development

```bash
npm install
npm run dev
```

Open <http://localhost:4321/odd-server-manager-wiki/>.

## Adding a tutorial

1. Copy an existing `.mdx` file in `src/content/docs/en/` and rename it.
2. Update the frontmatter (`title`, `description`).
3. Add a matching file at the same path under `src/content/docs/ar/` for the Arabic version.
4. Drop screenshots into `public/screenshots/`.
5. Add the page to the sidebar in `astro.config.mjs`.
6. `git push` — the site rebuilds and redeploys automatically.

## Tech stack

- [Astro](https://astro.build/) 4.x
- [Starlight](https://starlight.astro.build/) 0.28.x
- Markdown / MDX content
- Pagefind search (built-in)
- GitHub Actions → GitHub Pages
