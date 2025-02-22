# Vue 3 Micro-Frontends Architecture

A scalable and modular Vue 3 application architecture that implements the micro-frontends pattern, allowing teams to independently develop, test, and deploy different parts of a large application. Built with TypeScript, Vue Router, and Pinia, this project supports both Bootstrap 5 and Fomantic UI frameworks.

## About This Project

This project implements a micro-frontends architecture that allows you to:
- Break down a large application into smaller, manageable pieces
- Enable independent teams to work on different features
- Choose between Bootstrap 5 and Fomantic UI for styling (Fomantic UI by default)
- Maintain consistent UI/UX across all micro-frontends
- Share common functionality through core services and components
- Scale the application by adding new micro-frontends without modifying existing ones

### Technical Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Type Safety**: TypeScript for better developer experience and code reliability
- **State Management**: Pinia for predictable state management
- **Routing**: Vue Router for seamless navigation
- **UI Frameworks**: 
  - Fomantic UI (default) - A community fork of Semantic UI
  - Bootstrap 5 (optional) - Popular responsive framework
- **Build Tool**: Vite for fast development and optimized production builds
- **Package Management**: npm

## Features

- 🏗 Micro-frontends architecture
- 📦 Auto-loading of micro-frontend routes
- 🎨 Support for Bootstrap 5 and Fomantic UI
- 🔧 TypeScript support
- 📱 Responsive layouts
- 🔄 State management with Pinia
- 🛠 CLI tool for generating new micro-frontends

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_UI_FRAMEWORK=bootstrap # or fomantic
```

3. Run development server:
```bash
npm run dev
```

## Creating a New Micro-Frontend

Use the provided CLI tool to generate a new micro-frontend:

```bash
npm run create-microfrontend
```

Follow the prompts to configure your new micro-frontend:
- Name (e.g., product)
- Plural name (e.g., Products)
- Singular name (e.g., Product)
- API path (e.g., products)
- UI framework (bootstrap/fomantic)

The tool will generate:
- Interface definitions
- API service
- Pinia store
- CRUD views (List, Create, Edit)
- Route configuration

## Project Structure

```
src/
├── _frontends/           # Micro-frontends
│   └── [name]/          # Each micro-frontend
│       ├── config.ts    # Routes and configuration
│       ├── interfaces/  # TypeScript interfaces
│       ├── services/    # API services
│       ├── stores/      # Pinia stores
│       └── views/       # Vue components
├── layouts/             # Layout components
├── router/             # Vue Router configuration
└── stores/             # Global stores
```

## Micro-Frontend Configuration

Each micro-frontend has a `config.ts` file that defines:
- Routes
- Layout preferences
- Menu configuration

Example:
```typescript
export const config: MicroFrontendConfig = {
  name: 'Product Management',
  layout: 'DefaultLayout',
  menu: 'MainMenu',
  routes: [
    {
      path: '/products',
      name: 'products',
      component: () => import('./views/List.vue'),
      meta: {
        title: 'Products List'
      }
    },
    // ... other routes
  ]
}
```

## UI Framework Configuration

The application supports two UI frameworks:
- Bootstrap 5
- Fomantic UI

Set your preferred framework in `.env`:
```env
VITE_UI_FRAMEWORK=bootstrap # or fomantic
```

The DefaultLayout component will automatically load the appropriate CSS and JS files for your chosen framework.

## Development

1. Create a new micro-frontend using the CLI tool
2. Configure the API endpoint in `.env`
3. Add any additional components or functionality specific to your micro-frontend
4. The router will automatically load your routes from the config file

## Building for Production

```bash
npm run build
```

This will create a production-ready build in the `dist` directory.

## Architecture Details

### Micro-Frontend Pattern

This project follows these micro-frontend principles:
- **Independent Deployment**: Each micro-frontend can be developed and deployed independently
- **Technology Agnostic**: While this implementation uses Vue 3, the pattern allows for different frameworks
- **Isolated State**: Each micro-frontend manages its own state using Pinia stores
- **Shared Core**: Common utilities and components are shared across micro-frontends
- **Consistent UX**: Unified styling through Fomantic UI (default) or Bootstrap 5

### API Integration

Each micro-frontend includes:
- **Service Layer**: Handles API communication using fetch
- **Type Definitions**: TypeScript interfaces for API requests/responses
- **Error Handling**: Consistent error handling across all API calls
- **State Management**: Pinia stores for managing API data and UI state

### Best Practices

1. **Code Organization**:
   - Keep micro-frontends focused on specific business domains
   - Follow Vue 3 Composition API patterns
   - Use TypeScript for all new code
   - Maintain consistent file naming conventions

2. **State Management**:
   - Use Pinia stores for complex state
   - Keep state close to where it's used
   - Implement proper error handling
   - Cache API responses when appropriate

3. **Performance**:
   - Lazy load routes and components
   - Optimize bundle sizes
   - Implement proper caching strategies
   - Use Vue's built-in performance features

4. **Testing**:
   - Write unit tests for critical functionality
   - Test API integration points
   - Verify routing and navigation
   - Test across different UI frameworks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
