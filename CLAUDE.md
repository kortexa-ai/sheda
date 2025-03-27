# Commands for Sheda Project

## Build & Development
- Install: `npm install --legacy-peer-deps`
- Start dev server: `npm start`
- Run iOS: `npm run ios`
- Run iOS (release): `npm run ios:release`
- Run Android: `npm run android`
- Run web: `npm run web`

## Code Quality
- Lint: `npm run lint`
- Lint with auto-fix: `npm run lint:fix`
- Type check: `npm run typecheck`
- Clean project: `npm run clean`

## Code Style Guidelines
- **Imports**: Use type imports (`import type {...}`). Use path alias `@/*` for src directory
- **Formatting**: Single quotes, no spaces in object braces, trailing commas
- **Types**: Strict TypeScript, no `any` type, unused params prefixed with underscore
- **Naming**: PascalCase for components, camelCase for variables/functions
- **Components**: Use functional components with hooks
- **Error handling**: Use try/catch for async operations, avoid throwing in render methods