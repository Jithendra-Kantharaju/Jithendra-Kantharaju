# How to publish the GitHub-only profile

1. Sign in to `https://github.com/Jithendra-Kantharaju`.
2. Open the special profile repository: `https://github.com/Jithendra-Kantharaju/Jithendra-Kantharaju`. If absent, create a **public** repository with the exact name `Jithendra-Kantharaju` and add a README.
3. Upload the **contents of this package** into the root of that repository. Keep the `.github/workflows/`, `assets/`, `scripts/` and `data/` folder structure unchanged. Do not upload the parent folder itself.
4. Commit to `main` (or adjust the workflow if the default branch differs).
5. In **Settings → Actions → General**, set workflow permissions to **Read and write permissions** if repository policy permits. A workflow needs permission to push updated SVGs. If branch protection blocks pushes, allow the bot or use a pull request-based update workflow.
6. Open **Actions → Update GitHub profile activity → Run workflow**. The job fetches real contributions and repository stats, generates both SVGs, and commits the result. Inspect the Actions logs and `assets/` files to confirm success. Scheduled updates then run each day.
7. Visit `https://github.com/Jithendra-Kantharaju`. The new README appears automatically. GitHub Pages is **not required**.

## What is included

- `README.md`: Your complete profile page.
- `assets/*.svg`: Self-hosted hero, headings, projects, skills, credentials, and activity graphics.
- `assets/jithendra-portrait.jpg`: Optimized source of the photo embedded inside `hero.svg`.
- `scripts/*.mjs`: Built-in Node.js scripts; no npm packages needed.
- `.github/workflows/update-github-profile.yml`: Daily generation for contributions and account stats.
- `data/`: Real GitHub contribution snapshot after successful execution.

## Notes

- No portfolio website, website deployment, resume page, or GitHub Pages workflow is included.
- Public statistics come directly from the GitHub API. Primary languages are measured by *public repository count*, not code volume.
- The snake needs a first successful workflow run. Placeholders do not contain invented data.
- GitHub sometimes caches image previews. If the workflow succeeded but you still see old artwork, reload after a short interval.
- If you use a different GitHub login, update repo links and the default names in the scripts.
- The CloudOps repository link follows the supplied README. Check its visibility and exact spelling before publishing; its public reachability could not be independently confirmed during preparation.
- The embedded photograph makes `hero.svg` self-contained. To replace it later, regenerate the SVG with the updated photo rather than changing the JPG alone.
