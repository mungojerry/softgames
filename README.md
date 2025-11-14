# Softgames Pixi.js App

A Pixi.js TypeScript application with a menu system featuring three game scenes.

## Features

- Main Menu with three game options
- **Ace of Shadows**: Dark themed scene with shadow particle effects
- **Magic Words**: Magical scene with floating animated words
- **Phoenix Flames**: Fire themed scene with rising flame animations

## Technologies

- Pixi.js v7
- TypeScript
- Vite

## Project Structure

```
src/
  main.ts                    # Application entry point
  scenes/
    Scene.ts                 # Base scene class
    SceneManager.ts          # Scene management and transitions
    MainMenuScene.ts         # Main menu with three buttons
    AceOfShadowsScene.ts     # First game scene
    MagicWordsScene.ts       # Second game scene
    PhoenixFlamesScene.ts    # Third game scene
```

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Build

Build for production:

```bash
npm run build
```

## Local Preview of Production Build

```bash
npm run preview
```

## Continuous Integration & Deployment

This project uses GitHub Actions for CI/CD and automatic deployment to GitHub Pages.

### CI/CD Workflow

- On every push to `main` or pull request, the workflow will:
  - Install dependencies
  - Run build
  - Deploy to GitHub Pages on `main` branch

### GitHub Actions Setup

The workflow file is located at `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### GitHub Pages Configuration

- The app is deployed to the `gh-pages` branch and served from `/softgames/`.
- The Vite config sets the correct base path for GitHub Pages:
  - `base: '/softgames/'` in `vite.config.ts` for production.
- After deployment, your site will be available at:
  - `https://mungojerry.github.io/softgames/`

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

ISC
