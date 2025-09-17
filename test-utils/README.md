# Test Utilities

This folder contains development-only utilities for testing the checkout flow.

## Files

- **`test-states.js`** - JavaScript functions for state management and mock data population
- **`test-panel.html`** - HTML component for the test control panel
- **`test-styles.css`** - Styles for the test components

## Usage

To include test functionality in development:

```html
<!-- Include in your HTML head -->
<link rel="stylesheet" href="test-utils/test-styles.css">

<!-- Include the test panel in your body after main content -->
<!-- Copy contents of test-panel.html and paste into your HTML body -->

<!-- Include before closing body tag -->
<script src="test-utils/test-states.js"></script>
```

## Integration Example

Here's how to add test functionality to your development environment:

1. **Add CSS to head section:**
   ```html
   <link rel="stylesheet" href="test-utils/test-styles.css">
   ```

2. **Add test panel HTML after your main content:**
   ```html
   <!-- Insert the entire contents of test-panel.html here -->
   ```

3. **Add JavaScript before closing body tag:**
   ```html
   <script src="test-utils/test-states.js"></script>
   ```

## Functions Available

### State Management
- `changeState(newState)` - Changes checkout state without mock data
- `changeStateWithMockData(newState)` - Changes state and populates with mock data

### Mock Data Population
- `populateContactData(contactData)` - Fills contact section with test data
- `populateDeliveryData(deliveryData)` - Fills delivery section with test data

### Panel Controls
- `toggleTestStates()` - Shows/hides the test control panel

## Test States

- **contact** - Fresh form, no data filled
- **delivery** - Contact complete, delivery empty
- **payment** - Contact and delivery complete

## Important Notes

⚠️ **These files should NOT be included in production builds!**

The test utilities are designed for development and testing purposes only.