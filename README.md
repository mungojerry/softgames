# Softgames Pixi.js App

A Pixi.js TypeScript application with a menu system featuring three game scenes.

## Features

- Main Menu with three game options
- **Ace of Shadows** - Dark themed scene with shadow particle effects
- **Magic Words** - Magical scene with floating animated words
- **Phenix Flames** - Fire themed scene with rising flame animations

## Installation

```
npm install
```

## Development

Start the development server:

```
npm run dev
```

The app will open at `http://localhost:3000`

## Build

Build for production:

```
npm run build
```

## Project Structure

```
src/
├── main.ts                    # Application entry point
├── scenes/
│   ├── Scene.ts              # Base scene class
│   ├── SceneManager.ts       # Scene management and transitions
│   ├── MainMenuScene.ts      # Main menu with three buttons
│   ├── AceOfShadowsScene.ts  # First game scene
│   ├── MagicWordsScene.ts    # Second game scene
│   └── PhenixFlamesScene.ts  # Third game scene
```

## Technologies

- Pixi.js v7
- TypeScript
- Vite
