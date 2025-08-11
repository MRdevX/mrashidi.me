# Email Service Documentation

This directory contains a clean, maintainable email service implementation with separated templates and utilities.

## Structure

```
email/
├── email.service.ts          # Main email service class
├── types.ts                  # TypeScript interfaces
├── templates/                # Email templates directory
│   ├── index.ts             # Template exports
│   ├── base-template.ts     # Base template utilities
│   ├── contact-templates.ts # Contact form templates
│   ├── resume-templates.ts  # Resume request templates
│   └── config.ts            # Template configuration
└── README.md                # This file
```

## Architecture

### Base Template (`base-template.ts`)

The `BaseTemplate` class provides:

- Common HTML structure and styles
- Reusable UI components (buttons, dividers, info rows)
- Template rendering utilities
- Message formatting helpers

### Template Classes

- **ContactTemplates**: Handles contact form emails (admin notifications + user confirmations)
- **ResumeTemplates**: Handles resume request emails (admin notifications + user confirmations)

### Configuration (`config.ts`)

Centralized configuration for:

- Company information
- Social media links
- Skills and expertise
- Website URLs

## Usage

### Basic Usage

```typescript
import { EmailService } from "./email.service";

const emailService = new EmailService();

// Send contact form emails
await emailService.sendContactFormEmail(contactData);

// Send resume request emails
await emailService.sendResumeRequestEmail(resumeData);
```

### Creating New Templates

1. Create a new template class in `templates/`
2. Extend or use `BaseTemplate` utilities
3. Export from `templates/index.ts`
4. Add to `EmailService` if needed

### Example Template Structure

```typescript
export class NewTemplate {
  static createHtml(data: DataType, config: ITemplateConfig): string {
    const content = `
      ${BaseTemplate.createInfoRow("Label", data.value)}
      ${BaseTemplate.getDividerElement()}
      ${BaseTemplate.createMessageBox(data.message)}
    `;

    return BaseTemplate.render({
      title: "Email Title",
      content,
      templateConfig: config,
    });
  }
}
```

## Benefits

1. **DRY Principle**: Common elements are reused across templates
2. **Maintainability**: Templates are separated and easy to modify
3. **Consistency**: All emails use the same base structure and styling
4. **Type Safety**: Full TypeScript support with proper interfaces
5. **Scalability**: Easy to add new email types and templates
6. **Testability**: Each template can be tested independently

## Environment Variables

Required environment variables:

- `AWS_REGION`: AWS region (defaults to "eu-central-1")
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `EMAIL_FROM_ADDRESS`: Sender email (defaults to "no-reply@mrashidi.me")
- `EMAIL_TO_ADDRESS`: Admin email (defaults to "contact@mrashidi.me")
