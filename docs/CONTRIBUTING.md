# TaskIdea - Contributing Guidelines

Thank you for your interest in contributing to TaskIdea! This document provides guidelines for contributing to the project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Testing](#testing)
- [Pull Requests](#pull-requests)
- [Reporting Issues](#reporting-issues)
- [Project Structure](#project-structure)

---

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inspiring community for all. Please read and adhere to the following principles:

- **Be respectful**: Treat all community members with respect
- **Be inclusive**: Welcome contributions from everyone
- **Be honest**: Be truthful in all interactions
- **Be constructive**: Provide helpful feedback
- **No harassment**: Unacceptable behavior will not be tolerated

### Enforcement
Violations can be reported to hbudida@gmail.com. All reports will be reviewed confidentially.

---

## How to Contribute

### Types of Contributions

**Code**
- Bug fixes
- New features
- Performance improvements
- Code refactoring

**Documentation**
- Improve existing docs
- Add missing documentation
- Fix typos and grammar
- Add code examples

**Testing**
- Write unit tests
- Write integration tests
- Report bugs
- Test features

**Community**
- Help answer questions
- Share ideas and suggestions
- Improve documentation examples
- Report security issues (privately)

### Contribution Process

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Commit** with clear messages
6. **Push** to your fork
7. **Create** a pull request
8. **Respond** to feedback

---

## Getting Started

### Prerequisites

- Node.js 14+
- npm or yarn
- Git
- Code editor (VS Code recommended)
- Basic understanding of React Native

### Setup Development Environment

```bash
# 1. Fork and clone repository
git clone https://github.com/YOUR_USERNAME/TaskIdea.git
cd TaskIdea

# 2. Install dependencies
npm install

# 3. Create feature branch
git checkout -b feature/your-feature-name

# 4. Set up environment
cp .env.example .env

# 5. Start development
npm run web:dev
```

### Essential Resources

- [docs/SPECIFICATION.md](SPECIFICATION.md) - Complete specification
- [docs/ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [BUILD_INSTRUCTIONS.md](../BUILD_INSTRUCTIONS.md) - Setup guide
- [docs/API_GUIDE.md](API_GUIDE.md) - API documentation

---

## Development Workflow

### Branch Naming

Use descriptive branch names:

```
feature/task-form-validation      # New feature
bugfix/sync-error-handling        # Bug fix
docs/update-readme                # Documentation
refactor/component-structure      # Code refactoring
test/add-unit-tests              # Testing
```

### Commit Messages

Follow conventional commits format:

```
type(scope): description

More detailed explanation if needed.

Closes #issue-number
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (no logic changes)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Testing
- `ci`: CI/CD changes

**Examples:**
```
feat(tasks): add task priority filtering
fix(sync): resolve Google Drive API timeout
docs: update installation instructions
refactor(components): extract TaskCard component
test(auth): add Google Sign-In tests
```

### Code Review Checklist

Before submitting a PR, verify:

- [ ] Code follows style guidelines
- [ ] Changes are tested
- [ ] Documentation updated if needed
- [ ] No console warnings/errors
- [ ] All tests pass
- [ ] Works on all platforms (if applicable)
- [ ] No breaking changes (unless major version)
- [ ] Commits are clean and well-organized

---

## Code Style

### TypeScript

- Use TypeScript for all new code
- Enable strict mode: `"strict": true`
- Define interfaces for data structures
- Use `const` by default, `let` if needed

**Example:**
```typescript
// ✅ Good
interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  status: TaskStatus;
}

const createTask = (task: Task): Promise<void> => {
  // Implementation
};

// ❌ Avoid
const task = {
  id: 'uuid',
  title: 'Task',
  priority: 'high'
};
function createTask(task) {
  // Implementation
}
```

### React/React Native Components

- Use functional components
- Use React hooks (useState, useEffect, useContext)
- Memoize expensive components
- Prop destructuring

**Example:**
```typescript
// ✅ Good
interface TaskCardProps {
  task: Task;
  onTap: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onTap }) => {
  return (
    <TouchableOpacity onPress={() => onTap(task.id)}>
      <Text>{task.title}</Text>
    </TouchableOpacity>
  );
};

export default React.memo(TaskCard);

// ❌ Avoid
class TaskCard extends React.Component {
  render() {
    return <View>...</View>;
  }
}
```

### Naming Conventions

```typescript
// Components: PascalCase
TaskCard.tsx
TaskForm.tsx

// Functions/Variables: camelCase
const handleTaskDelete = () => {}
const isLoading = true

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3
const API_BASE_URL = 'https://...'

// Private functions: _camelCase prefix (optional)
const _internalHelper = () => {}

// Types/Interfaces: PascalCase
interface Task { }
type TaskStatus = 'pending' | 'completed'
```

### Formatting

Use Prettier for automatic formatting:

```bash
npm run format
```

**.prettierrc** configuration:
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2
}
```

### Linting

Run ESLint before committing:

```bash
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

---

## Testing

### Test Files Location

```
__tests__/
├── unit/
│   ├── utils/
│   ├── services/
│   └── formatters/
├── integration/
│   ├── googleDriveService.test.ts
│   └── syncService.test.ts
└── __mocks__/
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test TaskCard.test.tsx

# Watch mode (re-run on changes)
npm test -- --watch

# Coverage report
npm test -- --coverage
```

### Writing Tests

```typescript
// ✅ Good - Clear test descriptions
describe('TaskCard', () => {
  it('should render task title', () => {
    const { getByText } = render(<TaskCard task={mockTask} />);
    expect(getByText(mockTask.title)).toBeInTheDocument();
  });

  it('should call onTap when pressed', () => {
    const onTap = jest.fn();
    const { getByTestId } = render(
      <TaskCard task={mockTask} onTap={onTap} />
    );
    fireEvent.press(getByTestId('task-card'));
    expect(onTap).toHaveBeenCalledWith(mockTask.id);
  });
});

// ❌ Avoid
describe('TaskCard', () => {
  it('works', () => {
    // Unclear what is being tested
  });
});
```

### Test Coverage Goals

- Unit tests: 80%+ coverage
- Integration tests: Critical flows
- E2E tests: Major user workflows

---

## Pull Requests

### Before Creating PR

1. **Ensure your branch is up-to-date**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run tests and linting**
   ```bash
   npm test
   npm run lint
   ```

3. **Build for your target platform**
   ```bash
   npm run web:build
   ```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Code refactoring

## Related Issues
Closes #issue-number

## Changes
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Added unit tests
- [ ] Added integration tests
- [ ] Tested on web
- [ ] Tested on mobile
- [ ] Tested on desktop

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No breaking changes
- [ ] Documentation updated
- [ ] No console errors/warnings
```

### Review Process

1. Submit PR with clear description
2. Wait for code review
3. Address feedback if requested
4. Re-request review after changes
5. Maintainer merges when approved

### Expected Response Time

- Initial review: 2-3 days
- Response to feedback: 1-2 days
- Merge: Within 1 day of approval

---

## Reporting Issues

### Bug Reports

Include:
- **Title**: Clear, descriptive title
- **Description**: What should happen vs. what actually happens
- **Steps to reproduce**: Exact steps to trigger bug
- **Platform**: Which platform (iOS/Android/Web/Desktop)
- **Environment**: App version, OS version, etc.
- **Attachments**: Screenshots, error logs

**Template:**
```markdown
## Description
[Clear description of the bug]

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Platform
- [ ] iOS
- [ ] Android
- [ ] Web
- [ ] Desktop

## Environment
- App Version: 1.0.0
- OS/Browser: iOS 14.5
- Device: iPhone 12

## Attachments
[Screenshots, logs, etc.]
```

### Feature Requests

Include:
- **Title**: Clear description of feature
- **Motivation**: Why this feature is needed
- **Proposed Solution**: How it should work
- **Alternatives**: Other possible approaches

**Template:**
```markdown
## Feature Description
[Clear description]

## Motivation
[Why this is needed]

## Proposed Solution
[How it should work]

## Alternatives Considered
[Other approaches]

## Examples
[Real-world examples]
```

### Security Issues

**Do not** create public GitHub issues for security vulnerabilities. Instead:

1. Email hbudida@gmail.com with:
   - Vulnerability description
   - Impact assessment
   - Suggested fix (if available)
2. Allow time for patch before public disclosure
3. We will credit you in release notes

---

## Project Structure

Understanding the codebase:

```
TaskIdea/
├── src/                          # Shared code (all platforms)
│   ├── screens/                  # Top-level screens
│   ├── components/               # Reusable components
│   ├── services/                 # Business logic
│   ├── context/                  # State management
│   ├── theme/                    # Design system
│   ├── utils/                    # Helper functions
│   └── App.tsx                   # Root component
│
├── mobile/                       # Mobile-specific
│   ├── app.json                  # Expo config
│   └── app.tsx                   # Mobile entry
│
├── web/                          # Web-specific
│   ├── index.html
│   └── app.tsx                   # Web entry
│
├── desktop/                      # Desktop-specific
│   ├── main.js                   # Electron main
│   └── app.tsx                   # Electron renderer
│
├── docs/                         # Documentation
│   ├── SPECIFICATION.md
│   ├── ARCHITECTURE.md
│   ├── API_GUIDE.md
│   └── DEPLOYMENT.md
│
├── __tests__/                    # Tests
├── .github/                      # GitHub config (actions, templates)
├── package.json
├── tsconfig.json
└── README.md
```

### Key Files to Understand

1. **docs/SPECIFICATION.md** - Complete feature spec
2. **docs/ARCHITECTURE.md** - System design
3. **src/App.tsx** - Root component and navigation
4. **src/services/** - API and business logic
5. **package.json** - Scripts and dependencies

---

## Additional Resources

### Documentation
- [Specification](SPECIFICATION.md)
- [Architecture](ARCHITECTURE.md)
- [API Guide](API_GUIDE.md)
- [Deployment](DEPLOYMENT.md)

### Learning
- [React Native Docs](https://reactnative.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Google Drive API](https://developers.google.com/drive)

### Tools
- [VS Code](https://code.visualstudio.com/)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)

---

## Questions?

- 📖 Check [docs/SPECIFICATION.md](SPECIFICATION.md) first
- 💬 Open a GitHub Discussion
- 📧 Email: hbudida@gmail.com
- 🐦 Check GitHub Issues for similar questions

---

**Thank you for contributing to TaskIdea!** 🎉

Your contributions help make TaskIdea better for everyone.
