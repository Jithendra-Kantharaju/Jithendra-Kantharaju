# Publish your animated GitHub profile

This repository is **GitHub profile README only**. It does not include a portfolio website or resume page.

## Quick setup

1. Create or open the repository **`Jithendra-Kantharaju/Jithendra-Kantharaju`**. The repository name must match your GitHub username exactly for GitHub to display it on your profile.
2. Upload the **contents** of this archive to the root of that repository. Keep `README.md`, `.github/workflows/`, `assets/`, `scripts/` and `data/` in their original paths. Uploading just `README.md` will break the graphics.
3. In **Settings > Actions > General > Workflow permissions**, enable **Read and write permissions**. Your workflow needs to commit generated artwork. If your repository's branch rules block bot pushes, update those rules or use a permitted destination branch.
4. On GitHub, go to **Actions > Update GitHub profile activity > Run workflow**. Wait for a successful run and check that `data/contributions.json`, `assets/contribution-snake.svg` and `assets/github-stats.svg` have been committed.
5. Open your GitHub profile. GitHub may cache images; a refresh or cache expiry may be needed to see the latest graphics.

The workflow runs daily at 06:17 UTC and can also be triggered manually. No custom personal-access token is required for the default workflow. `GITHUB_TOKEN` is provided by GitHub Actions.

## How animation works

- GitHub profile README HTML is restricted. JavaScript and page CSS cannot run in the README.
- **Each SVG includes its own** CSS keyframes and, where useful, SMIL animation elements. They are embedded using normal `<img>` elements.
- SVGs use built-in fonts, local assets, and no external visual-generation services.
- The code honors `prefers-reduced-motion` for CSS-based animation. SMIL motion in the contribution snake may depend on viewer/browser behavior.
- The GitHub contribution animation comes from public/profile GitHub data. No invented activity figures are published.
- If the API fails, the workflow fails rather than silently replacing real data with sample numbers. Existing generated files remain in the repository.
- Some GitHub viewers and browser configurations may show a still frame instead of motion. The static information remains readable.

## Visual files

- `assets/hero.svg` includes the embedded portrait and animated banner.
- `assets/title-*.svg` contains seven animated section headings.
- `assets/project-*.svg` contains four animated project visualizations.
- `assets/interlude-*.svg` replaces the plain paragraphs between SVG images with designed kinetic-typography panels.
- `assets/buttons/*.svg` contains local animated link buttons.
- `assets/tech-toolkit.svg`, `assets/highlights.svg` and `assets/certifications.svg` contain animated content cards.
- `assets/contribution-snake.svg`, `assets/github-stats.svg` are generated using the included scripts.

## Edit content

Edit `README.md` for links and readable descriptions. SVG copy and color are edited directly in `assets/*.svg` and `assets/interlude-*.svg`. For changing the embedded hero photo, edit `assets/hero.svg` using an SVG editor or script, or regenerate the base artwork. The original image is also at `assets/jithendra-portrait.jpg`.

The graphic styles are **not** controlled by `README.md` CSS, because GitHub does not support that. The optional build script used to generate this version is not necessary to publish the profile.

## Rebuild checks

```bash
node scripts/validate-profile.mjs
node --check scripts/fetch-contributions.mjs
node --check scripts/build-heatmap-svg.mjs
node --check scripts/build-github-stats.mjs
```

To generate the snake locally, first obtain your own real data using `GH_USERNAME=Jithendra-Kantharaju GH_TOKEN=<your_token> node scripts/fetch-contributions.mjs` in an environment with network access, then run `node scripts/build-heatmap-svg.mjs`. Never commit personal access tokens.
