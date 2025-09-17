# Galls Postal Checkout - Modular Structure

This project has been refactored into a clean, modular structure using ES6 modules for better maintainability and organization.

## Project Structure

```
galls-postal-revamp/
├── index.html                          # Main HTML file (clean, modular)
├── complete-checkout-contact-delivery-filled.html  # Original monolithic file (for reference)
├── css/
│   ├── main.css                        # Global styles and reset
│   ├── forms.css                       # Form-specific styles
│   └── components.css                  # Component styles and layout
├── js/
│   ├── main.js                         # Main application coordinator
│   ├── modules/
│   │   ├── sectionManager.js           # Section management utilities
│   │   ├── validation.js               # Galls-style validation functions
│   │   ├── contactComponent.js         # Contact section logic
│   │   └── deliveryComponent.js        # Delivery section logic
│   └── test-states/
│       └── testStates.js               # Test state management and mock data
└── README.md                           # This file
```

## Key Features

### Modular Architecture

- **ES6 Modules**: Each functionality is separated into its own module
- **Clear Dependencies**: Import/export system makes dependencies explicit
- **Browser Compatible**: Works directly in modern browsers without build tools

### Separation of Concerns

- **CSS Organization**: Styles split into logical files (main, forms, components)
- **JavaScript Modules**: Business logic separated by functionality
- **Test States Isolation**: Testing functionality in its own dedicated folder

### Maintainable Code

- **DRY Principles**: Shared functionality extracted into reusable functions
- **Generic Functions**: `updateEditButtonText()` handles both contact and delivery
- **Consistent Naming**: BEM methodology with `p-chk-` prefix throughout

## Usage

### Running the Application

1. Open `index.html` in a modern browser
2. The application will automatically initialize
3. Use the test state buttons to switch between different scenarios

### Test States

- **Contact**: New user scenario with contact form open
- **Delivery**: Contact completed, delivery form active
- **Payment**: Both sections completed, payment highlighted

### Adding New Components

1. Create a new module file in `js/modules/`
2. Export the necessary functions
3. Import and integrate in `js/main.js`
4. Add corresponding CSS to appropriate stylesheet

## Development Benefits

### Before (Monolithic)

- ❌ 5,691 lines in single HTML file
- ❌ Difficult to locate specific functionality
- ❌ Code duplication across sections
- ❌ Hard to test individual components
- ❌ CSS and JS mixed with HTML structure

### After (Modular)

- ✅ Clean HTML structure (~300 lines)
- ✅ Logical file organization
- ✅ Reusable utility functions
- ✅ Easy to test and modify individual modules
- ✅ Clear separation of concerns

## Browser Support

This application uses ES6 modules and modern JavaScript features. It requires:

- Chrome 61+
- Firefox 60+
- Safari 11+
- Edge 16+

## Key Functions

### Global Functions (available in browser console)

- `changeState(newState)` - Change application state
- `changeStateWithMockData(newState)` - Change state with mock data population

### Main Modules

- **SectionManager**: Handles section display, headers, and state management
- **Validation**: Galls-style form validation and error handling
- **Components**: Contact and delivery specific functionality
- **TestStates**: Mock data and state switching for testing

## Form Integration

The form maintains full compatibility with Galls validation patterns:

- **Progressive Validation**: Uses `onchange` and `onkeyup` events
- **Cloudflare Security**: Includes CF hash updates for security
- **Error Display**: Visual error styling and message placement
- **Server Integration**: Ready for AJAX integration with existing backend

## Styling Architecture

### CSS Organization

- **main.css**: Global reset, body styles, and utility classes
- **forms.css**: Form field styles, inputs, selects, and validation states
- **components.css**: Component layout, cards, buttons, and responsive design

### Design System

- **Consistent Spacing**: Systematic use of padding and margins
- **Color Palette**: Blue primary (#2287ef), error red (#dc3545)
- **Typography**: Roboto font family with weight hierarchy
- **Responsive**: Mobile-first approach with grid layouts
