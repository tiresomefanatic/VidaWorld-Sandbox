# Button Component

This button component follows a structured design system with a clear dependency flow for styling.

## Dependency Structure

The styling of the button follows this dependency chain:

1. **Button Background Fill:**
   Primitive colors → Semantic colors → Variants → States → Prominence → Button background fill

2. **Button Text Fill:**
   Primitive colors → Semantic colors → Variants → States → Prominence → Button text fill

3. **Button Padding:**
   Spacing → Size → Button padding

4. **Button Border-radius:**
   Radius → Button border-radius

5. **Button Item Spacing:**
   Spacing → Button item spacing

6. **Button Icon Visibility:**
   Icon visibility → Button icon visibility

## Available Props

| Prop | Type | Options | Default | Description |
|------|------|---------|---------|-------------|
| `label` | string | any | "Label" | The text displayed in the button |
| `prominence` | string | "light", "dark", "link" | "light" | Controls the visual weight of the button |
| `size` | string | "s", "m", "l" | "m" | Controls the size of the button |
| `state` | string | "default", "hover", "pressed" | "default" | Controls the state appearance |
| `disabled` | boolean | true, false | false | Whether the button is disabled |
| `customIcon` | element | any React element | null | Custom icon element to display |
| `semanticTypography` | string | "desktop", "mobile" | "desktop" | Typography styling context |
| `visibility` | string | "left", "right", "off" | "left" | Controls icon visibility and position |
| `variant` | string | "primary", "secondary", "tertiary", "destructive" | "primary" | Button style variant |
| `onClick` | function | any | undefined | Click handler |
| `className` | string | any | "" | Additional CSS classes |

## Styling Implementation

The styling uses a modular SCSS approach with mixins that dynamically apply styles based on the props:

1. **Base styles** are applied to all buttons
2. **Size styles** are applied based on the `size` prop
3. **Variant + Prominence + State styles** are applied based on a combination of these props
4. **Disabled styles** are applied when the `disabled` prop is true
5. **Visibility styles** are applied based on the `visibility` prop
6. **Semantic typography styles** are applied based on the `semanticTypography` prop

## Usage Example

```jsx
<Button 
  label="Reserve Now"
  prominence="light"
  size="m"
  state="default"
  disabled={false}
  variant="primary"
  semanticTypography="desktop"
  visibility="left"
  customIcon={<CustomIcon />}
  onClick={() => console.log('Button clicked!')}
  className="custom-class"
/>
```

## Design Note

This component structure follows the DRY (Don't Repeat Yourself) principle by using dynamic mixins that adapt to different combinations of props, rather than defining each combination separately. 