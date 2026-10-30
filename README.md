name: Generate Contribution Snake

on:
  schedule:
    - cron: "0 8 * * *"
  workflow_dispatch:
  push:
    paths:
      - ".github/workflows/snake.yml"

permissions:
  contents: write

concurrency:
  group: contribution-snake
  cancel-in-progress: false

jobs:
  generate:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Generate cyan and violet snakes
        uses: Platane/snk/svg-only@v3
        with:
          github_user_name: Jithendra-Kantharaju
          outputs: |
            dist/github-snake.svg?color_snake=#7C3AED&color_dots=#F1F5F9,#CFFAFE,#67E8F9,#22D3EE,#7C3AED
            dist/github-snake-dark.svg?palette=github-dark&color_snake=#22D3EE&color_dots=#0F172A,#312E81,#5B21B6,#7C3AED,#22D3EE
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Publish generated SVGs
        uses: crazy-max/ghaction-github-pages@v3.1.0
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}