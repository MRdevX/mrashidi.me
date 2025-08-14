# Contact Components

This directory contains reusable components for the contact functionality, following DRY and KISS principles.

## Components

### Core Components

- **ContactContainer**: Layout wrapper with consistent styling
- **ContactHeader**: Page title and description with animations
- **ContactFormSection**: Contact form wrapper with animations
- **MentorshipSection**: Booking section with ADPList widget
- **ReviewsSection**: Impact and reviews section with multiple widgets
- **ADPListWidget**: Reusable iframe widget component

### Utilities

- **useContactData**: Custom hook for contact page data management
- **types**: TypeScript interfaces for contact data

## Usage

```tsx
import {
  ContactContainer,
  ContactHeader,
  ContactFormSection,
  MentorshipSection,
  ReviewsSection,
  useContactData,
} from "@/components/contact";

export default function ContactPage() {
  const { header, sections, adpListWidgets } = useContactData();

  return (
    <ContactContainer>
      <ContactHeader title={header.title} description={header.description} />
      <ContactFormSection />

      <MentorshipSection section={sections[0]} widget={adpListWidgets.booking} />

      <ReviewsSection section={sections[1]} impactWidget={adpListWidgets.impact} reviewsWidget={adpListWidgets.reviews} />
    </ContactContainer>
  );
}
```

## Benefits

- **DRY**: No code duplication, reusable components
- **KISS**: Simple, focused components with single responsibilities
- **Maintainable**: Easy to update and extend
- **Testable**: Isolated components can be tested independently
- **Consistent**: Uniform styling and behavior across the contact page
- **Configurable**: Data-driven approach with easy customization
