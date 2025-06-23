# Components Documentation

## Structure Overview

```
src/components/
├── navigation/     # Navigation components (Navbar, etc.)
├── forms/          # Form components (ContactForm, FormInput, etc.)
├── terminal/       # Interactive terminal components
├── skills/         # Skills display components
├── experience/     # Work experience components
├── ui/             # Generic UI components
└── index.ts        # Export barrel file
```

## Component Guidelines

### 1. File Naming

- Use PascalCase for component files: `MyComponent.tsx`
- Use kebab-case for folders: `my-component/`

### 2. Component Structure

```typescript
// 1. Imports
import { useState } from 'react';
import { cn } from '@/lib/utils';

// 2. Types (if component-specific)
interface MyComponentProps {
  title: string;
  className?: string;
}

// 3. Component
export default function MyComponent({ title, className }: MyComponentProps) {
  // 4. State and hooks
  const [isOpen, setIsOpen] = useState(false);

  // 5. Event handlers
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  // 6. Render
  return (
    <div className={cn('base-styles', className)}>
      <h2>{title}</h2>
      {/* Component content */}
    </div>
  );
}
```

### 3. Props Guidelines

- Use TypeScript interfaces for props
- Make props optional when appropriate
- Use descriptive prop names
- Include `className` prop for styling flexibility

### 4. Styling

- Use Tailwind CSS classes
- Use `cn()` utility for conditional classes
- Keep styles close to components
- Use CSS variables for theme values

### 5. Performance

- Use `React.memo()` for expensive components
- Implement proper dependency arrays in hooks
- Lazy load heavy components when possible

### 6. Accessibility

- Include proper ARIA labels
- Use semantic HTML elements
- Ensure keyboard navigation works
- Test with screen readers

## Component Categories

### UI Components (`ui/`)

Generic, reusable components that don't have business logic:

- `BackgroundEffects.tsx`
- `LoadingAnimation.tsx`
- `ContributionGraph.tsx`

### Form Components (`forms/`)

Components related to form handling:

- `ContactForm.tsx`
- `FormInput.tsx`
- `StatusMessage.tsx`
- `validation.ts`
- `types.ts`

### Navigation Components (`navigation/`)

Components for site navigation:

- `Navbar.tsx`

### Feature Components

Components with specific business logic:

- `terminal/` - Interactive terminal
- `skills/` - Skills display
- `experience/` - Work experience timeline

## Best Practices

1. **Single Responsibility**: Each component should have one clear purpose
2. **Composition**: Prefer composition over inheritance
3. **Props Drilling**: Avoid deep prop drilling, use context when needed
4. **Error Boundaries**: Wrap components that might fail
5. **Testing**: Write tests for complex components
6. **Documentation**: Add JSDoc comments for complex components
