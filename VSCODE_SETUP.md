# Visual Studio Code Setup Guide

This guide will help you set up VS Code for optimal development experience with the Travel Companion app.

## Quick Setup

### 1. Open the Project
```bash
# Clone and open the project
git clone <repository-url>
cd travel-companion
code travel-companion.code-workspace
```

### 2. Install Recommended Extensions
VS Code will automatically prompt you to install recommended extensions. Click "Install All" or install them individually:

**Core Extensions:**
- **Prettier** - Code formatter
- **ESLint** - JavaScript/TypeScript linting
- **TypeScript** - Enhanced TypeScript support
- **Tailwind CSS IntelliSense** - CSS class autocomplete

**Development Tools:**
- **Thunder Client** - API testing (built-in Postman alternative)
- **GitLens** - Enhanced Git integration
- **Error Lens** - Inline error display
- **Auto Rename Tag** - Automatic HTML/JSX tag renaming

**Optional Enhancements:**
- **GitHub Copilot** - AI code completion
- **Todo Tree** - TODO comment highlighting
- **Path Intellisense** - File path autocomplete

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment
```bash
# Database is automatically provisioned in Replit
# No additional environment setup needed
```

## Features & Capabilities

### 🚀 Development Server
- **Start**: Press `Ctrl+Shift+P` → "Tasks: Run Task" → "Start Development Server"
- **Debug**: Press `F5` to start debugging
- **Port**: Application runs on `http://localhost:5000`

### 🔍 Debugging
Three debug configurations available:
- **Debug Server** - Backend only
- **Debug Client** - Frontend only  
- **Debug Full Stack** - Complete application

### 🎨 Code Formatting
- **Auto-format on save** enabled
- **Prettier** configuration optimized for the project
- **Tailwind CSS** class sorting and completion

### 🧪 API Testing
Thunder Client is pre-configured with:
- **Development environment** (`http://localhost:5000`)
- **API collection** with common endpoints
- **Environment variables** for easy testing

Access via: `Ctrl+Shift+P` → "Thunder Client"

### 📊 Database Management
SQLTools integration for PostgreSQL:
- View database schema
- Run SQL queries
- Manage connections

### ⚡ Code Snippets
Custom snippets available:
- `rfc` - React Functional Component
- `rhook` - Custom React Hook
- `dtable` - Drizzle Table Schema
- `aroute` - API Route Handler
- `rquery` - React Query Hook
- `rmutation` - React Mutation Hook
- `twc` - Tailwind Component

## Project Structure

```
travel-companion/
├── .vscode/                    # VS Code configuration
│   ├── settings.json          # Workspace settings
│   ├── extensions.json        # Recommended extensions
│   ├── launch.json           # Debug configurations
│   ├── tasks.json            # Task definitions
│   ├── snippets.code-snippets # Custom code snippets
│   └── thunder-client/        # API testing collections
├── client/                    # React frontend
│   └── src/
├── server/                    # Express backend
├── shared/                    # Shared types and schemas
├── travel-companion.code-workspace # VS Code workspace file
├── .prettierrc               # Prettier configuration
├── .eslintrc.json           # ESLint configuration
└── package.json             # Dependencies
```

## Development Workflow

### 1. Start Development
```bash
# Option 1: Use VS Code task
Ctrl+Shift+P → "Tasks: Run Task" → "Start Development Server"

# Option 2: Use terminal
npm run dev
```

### 2. Code with IntelliSense
- **TypeScript** autocomplete and error checking
- **Tailwind CSS** class suggestions
- **Path completion** for imports
- **Auto-imports** for components and utilities

### 3. Format and Lint
- Code automatically formats on save
- ESLint errors show inline with Error Lens
- Use `Ctrl+Shift+P` → "Format Document" for manual formatting

### 4. Test APIs
- Open Thunder Client (`Ctrl+Shift+P` → "Thunder Client")
- Use pre-configured requests
- Switch between Development/Production environments

### 5. Debug Issues
- Set breakpoints in TypeScript files
- Press `F5` to start debugging
- Use Debug Console for inspecting variables

## Database Operations

### Schema Changes
```bash
# Push schema changes to database
npm run db:push

# Open database studio
npm run db:studio
```

### SQL Queries
Use SQLTools extension:
1. `Ctrl+Shift+P` → "SQLTools: Connect"
2. Select "Travel App Database"
3. Run queries in SQL files

## Keyboard Shortcuts

| Action | Keyboard Shortcut |
|--------|------------------|
| Start Debugging | `F5` |
| Command Palette | `Ctrl+Shift+P` |
| Quick Open File | `Ctrl+P` |
| Format Document | `Shift+Alt+F` |
| Toggle Terminal | `Ctrl+`` |
| Multi-cursor | `Ctrl+D` |
| Go to Definition | `F12` |
| Find References | `Shift+F12` |

## Troubleshooting

### Extension Issues
```bash
# Reload VS Code window
Ctrl+Shift+P → "Developer: Reload Window"
```

### TypeScript Errors
```bash
# Restart TypeScript server
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Database Connection
```bash
# Check database status
npm run db:push

# Reset database (if needed)
npm run db:reset
```

### Port Issues
- Default port: `5000`
- Check terminal output for actual port
- Update Thunder Client environment if different

## Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Drizzle ORM Guide](https://orm.drizzle.team/docs/overview)
- [VS Code Tips & Tricks](https://code.visualstudio.com/docs/getstarted/tips-and-tricks)

## Support

For VS Code specific issues:
1. Check the Extensions view for error messages
2. Look at the Output panel (`Ctrl+Shift+U`)
3. Use "Developer: Toggle Developer Tools" for debugging

For application issues:
1. Check the integrated terminal for server logs
2. Use the Debug Console when debugging
3. Check Thunder Client for API response details