# Contributing to Mi Casa Es Tuya Frontend

Thank you for your interest in contributing! 🎉

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feat/my-awesome-feature
   ```
4. **Make your changes** and test them
5. **Commit** with clear messages
6. **Push** to your fork
7. **Open a Pull Request** describing your changes

## Development Setup

### Prerequisites

- Node.js 18+
- npm 8+
- API running (see `micasaestuya-api` repo)

### Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Update NUXT_PUBLIC_API_BASE if needed

# Start dev server
npm run dev
```

The app will be available at `http://localhost:3000`

### Running Tests

```bash
# Unit tests (Vitest)
npm run test

# E2E tests (Cypress)
npm run test:e2e
```

### Building for Production

```bash
npm run build
npm run preview
```

## Code Style

- Follow ESLint configuration (run `npm run lint`)
- Format code with Prettier
- Use Vue 3 composition API
- Write TypeScript when possible
- Keep components small and reusable
- Use meaningful component names

## Component Guidelines

- **Location**: `components/` directory
- **Structure**: Single file components (.vue)
- **Props**: Type your props
- **Emits**: Define all emits explicitly
- **Docs**: Comment complex logic

Example:

```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
}

defineProps<Props>()
const emit = defineEmits<{
  (e: 'update', value: number): void
}>()
</script>
```

## Commit Messages

Use clear, descriptive commit messages:

```
feat: Add property filter sidebar
fix: Resolve search input styling bug
docs: Update component documentation
test: Add tests for property listing
refactor: Extract filter logic to composable
```

## Pull Request Guidelines

- **Title**: Keep it short and descriptive
- **Description**: Explain what and why (not just what)
- **Tests**: Include tests for new features
- **Screenshots**: For UI changes, include before/after
- **Performance**: Consider bundle size impact
- **One feature per PR**: Keep PRs focused

## Performance Considerations

- Use lazy loading for heavy components
- Optimize images
- Minimize bundle size
- Use Nuxt caching strategies
- Test performance with lighthouse

## Questions?

Open an **Issue** if you have questions. We're here to help!

## License

By contributing, you agree that your contributions will be licensed under the AGPL-3.0 License.

---

**Happy coding!** 🚀
