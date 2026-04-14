# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite portfolio website. It's a minimal setup with React 19, TypeScript, and Vite as the build tool.

## Project Structure

- `src/` - Main source code directory
  - `App.tsx` - Main application component
  - `main.tsx` - Entry point that renders the App component
  - `index.css` - Global CSS styles
- `public/` - Static assets directory
- `dist/` - Build output directory (not version controlled)

## Development Commands

- `npm run dev` - Start the development server with HMR
- `npm run build` - Build the production version (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint on the codebase
- `npm run preview` - Preview the production build locally

## Configuration Files

- `vite.config.ts` - Vite configuration with React plugin
- `tsconfig.json` - Base TypeScript configuration referencing app and node configs
- `tsconfig.app.json` - TypeScript configuration for application code
- `tsconfig.node.json` - TypeScript configuration for Node.js environment (Vite config)
- `eslint.config.js` - ESLint configuration with React and TypeScript support
- `package.json` - Project dependencies and scripts

## Architecture

This is a client-side React application using functional components. The main entry point is `main.tsx` which renders the `App` component. The application uses modern React with hooks and TypeScript for type safety.

The build system is Vite which provides Hot Module Replacement (HMR) for development and optimized builds for production.

## Key Dependencies

- React 19 (with React DOM)
- TypeScript
- Vite (build tool)
- ESLint (linting)

## Development Workflow

1. Run `npm run dev` to start the development server
2. Make changes to files in the `src/` directory
3. View changes in the browser with HMR
4. Run `npm run lint` to check for code issues
5. Run `npm run build` to create a production build
6. Run `npm run preview` to test the production build locally