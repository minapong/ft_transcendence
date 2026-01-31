# Button Component Usage Guide

## Basic Usage

```tsx
import Button from "@/app/components/ui/Button";

// Simple button
<Button>Click me</Button>

// With variant and size
<Button variant="primary" size="lg">
  Submit
</Button>

// With onClick handler
<Button 
  variant="success" 
  onClick={() => console.log("Clicked!")}
>
  Save
</Button>
```

## Variants

```tsx
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Alternative</Button>
<Button variant="success">Confirm</Button>
<Button variant="danger">Delete</Button>
<Button variant="game">⬆</Button>
<Button variant="hero">Epic CTA</Button>
<Button variant="glass">Glass Effect</Button>
```

## Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

## States

```tsx
// Disabled
<Button disabled>Can't click</Button>

// Loading
<Button loading>Processing...</Button>

// Full width
<Button fullWidth>Stretch</Button>
```

## Navigation

```tsx
// Button that navigates
<Button href="/user/me">Go to Profile</Button>

// Or use LinkButton
import { LinkButton } from "@/app/components/ui/Button";
<LinkButton href="/game/pong">Play Game</LinkButton>
```

## Icons

```tsx
<Button iconBefore={<span className="icon-[mdi--check]" />}>
  Confirm
</Button>

<Button iconAfter={<span className="icon-[mdi--arrow-right]" />}>
  Next
</Button>
```

## Convenience Components

```tsx
import { 
  PrimaryButton, 
  SecondaryButton, 
  SuccessButton, 
  DangerButton 
} from "@/app/components/ui/Button";

<PrimaryButton>Main Action</PrimaryButton>
<SecondaryButton>Alternative</SecondaryButton>
<SuccessButton>Confirm</SuccessButton>
<DangerButton>Delete</DangerButton>
```

## Examples

### Login Button
```tsx
<Button 
  variant="primary" 
  size="lg" 
  fullWidth
  href="/auth/login"
>
  Login
</Button>
```

### Delete with Confirmation
```tsx
<Button 
  variant="danger"
  onClick={() => {
    if (confirm("Are you sure?")) {
      deleteItem();
    }
  }}
>
  Delete
</Button>
```

### Submit Form
```tsx
<Button 
  type="submit"
  variant="success"
  loading={isSubmitting}
  disabled={!isValid}
>
  {isSubmitting ? "Saving..." : "Save Changes"}
</Button>
```

### Game Control
```tsx
<Button variant="game" onClick={moveUp}>
  ⬆
</Button>
```
