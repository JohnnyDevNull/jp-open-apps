# JP Open Apps - Development Guidelines

## Project Overview
This is an Nx monorepo containing React applications with TypeScript, using Vite for bundling and Vitest for testing. The project includes two main applications: `time-tracking` and `household-calculator`, each with their own e2e test suites.

## Build/Configuration Instructions

### Environment Requirements
- Node.js: `^22.20.0` (strictly enforced)
- npm: `^10.9.0` (strictly enforced)

### Key Configuration Files
- **nx.json**: Nx workspace configuration with caching enabled, SCSS styling, ESLint linting, and Vite bundling
- **tsconfig.base.json**: TypeScript base configuration targeting ES2015 with ES2020/DOM libraries
- **package.json**: Contains specific npm scripts for each application

### Build Commands
```bash
# Build specific applications
npm run build-time-tracking
npm run build-household-calculator

# Start development servers
npm run start-app-time-tracking        # Runs on localhost:4200
npm run start-app-household-calculator # Runs on separate port

# Run all builds
npm run nx -- run-many --all --target=build
```

### Application Structure
Each application follows this structure:
- `apps/[app-name]/src/` - Source code
- `apps/[app-name]/project.json` - Nx project configuration
- `apps/[app-name]/vite.config.ts` - Vite configuration with Vitest setup
- `apps/[app-name]/tsconfig.*.json` - TypeScript configurations for app and specs
- `apps/[app-name]-e2e/` - Cypress e2e tests

## Testing Information

### Test Configuration
- **Test Framework**: Vitest with jsdom environment
- **Testing Library**: @testing-library/react (requires @testing-library/dom as peer dependency)
- **Coverage**: v8 provider with reports in `coverage/apps/[app-name]/`
- **Test Pattern**: `src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}`

### Running Tests
```bash
# Run all tests
npm test

# Run tests for specific app
npm run nx -- test time-tracking
npm run nx -- test household-calculator

# Run tests with pattern matching
npm run nx -- test time-tracking --testNamePattern="specific test name"

# Run affected tests only
npm run test:affected

# Run e2e tests
npm run e2e-app-time-tracking
npm run e2e-app-household-calculator
```

### Creating Tests
Tests should be placed alongside source files with `.spec.ts` or `.test.ts` extensions.

**Example Test Structure:**
```typescript
import { add, multiply } from './math';

describe('Math utilities', () => {
  describe('add', () => {
    it('should add two positive numbers correctly', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should handle negative numbers', () => {
      expect(add(-1, 1)).toBe(0);
      expect(add(-2, -3)).toBe(-5);
    });
  });

  describe('multiply', () => {
    it('should multiply two positive numbers correctly', () => {
      expect(multiply(3, 4)).toBe(12);
    });

    it('should handle multiplication by zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });
  });
});
```

**React Component Testing:**
```typescript
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(baseElement).toBeTruthy();
  });
});
```

### Important Testing Notes
- React Router components must be wrapped in `<BrowserRouter>` for testing
- Missing dependency issue: `@testing-library/dom` was required as a peer dependency and has been added
- Vitest configuration shows deprecation warning about `cache.dir` - consider using Vite's `cacheDir` instead

## Development Guidelines

### Code Style & Linting
- **Linter**: ESLint with TypeScript support
- **Formatter**: Prettier
- **Styling**: SCSS (configured as default in Nx generators)
- **Pre-commit**: Husky with lint-staged for code quality

### Linting Commands
```bash
# Run linting on all projects
npm run lint

# Lint specific project
npm run nx -- lint time-tracking
```

### Nx Workspace Commands
```bash
# List available plugins and generators
npm run nx -- list

# Generate new React component
npm run nx -- generate @nx/react:component my-component --project=time-tracking

# Generate new React app
npm run nx -- generate @nx/react:app my-new-app

# Show project graph
npm run nx -- graph
```

### Technology Stack
- **Frontend**: React 19.1.1 with TypeScript
- **Routing**: React Router DOM 7.9.3
- **Styling**: Material-UI 7.3.3 with Emotion, SCSS
- **Build Tool**: Vite 7.1.7
- **Testing**: Vitest 3.2.4 + @testing-library/react
- **E2E Testing**: Cypress 15.3.0
- **Monorepo**: Nx 21.6.2

### Important Development Notes
- Node.js version is strictly enforced (^22.20.0) - ensure you're using the correct version
- Applications use Vite for fast development and building
- The project uses path mapping for clean imports (configured in tsconfig.base.json)
- Build artifacts are output to `dist/apps/[app-name]/`
- Cache directory for tests: `node_modules/.vitest`
- Coverage reports: `coverage/apps/[app-name]/`

### Debugging Tips
- Use `--verbose` flag with nx commands for detailed output
- Vitest UI available via `@vitest/ui` for interactive test debugging
- Check `node_modules/.vite/apps/[app-name]` for Vite cache issues
- ESLint configuration may show warnings about missing rules - this is a known configuration issue

### Commit Standards
- Uses Commitlint with conventional commits
- Husky pre-commit hooks ensure code quality
- Staged files are automatically linted and formatted

## Quick Start for New Developers
1. Ensure Node.js ^22.20.0 and npm ^10.9.0 are installed
2. Run `npm install` to install all dependencies
3. Run `npm run start-app-time-tracking` to start development server
4. Run `npm test` to ensure all tests pass
5. Use `npm run nx -- graph` to visualize the project structure
