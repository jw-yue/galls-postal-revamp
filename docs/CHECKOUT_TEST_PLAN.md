# Galls Postal Checkout - Comprehensive Test Plan

## Overview

This test plan covers end-to-end testing of the Galls Postal Checkout system, including functional testing, user experience validation, form validation, state management, and integration testing.

## Table of Contents

1. [Test Environment Setup](#test-environment-setup)
2. [Functional Testing](#functional-testing)
3. [State Management Testing](#state-management-testing)
4. [Form Validation Testing](#form-validation-testing)
5. [UI/UX Testing](#uiux-testing)
6. [Responsive Design Testing](#responsive-design-testing)
7. [Accessibility Testing](#accessibility-testing)
8. [Performance Testing](#performance-testing)
9. [Browser Compatibility Testing](#browser-compatibility-testing)
10. [Integration Testing](#integration-testing)
11. [Test Data and Mock States](#test-data-and-mock-states)
12. [Automated Testing Scripts](#automated-testing-scripts)

---

## Test Environment Setup

### Prerequisites

- **Local Server**: `python -m http.server 8000` (required for ES6 modules)
- **Test URL**: `http://localhost:8000`
- **Browser Developer Tools**: Console access for testing functions
- **Test Utilities**: Built-in test panel with state controls

### Test Utilities Access

1. **Test Panel**: Available in development mode on the checkout page
2. **Console Functions**: Access to global testing functions via browser console
3. **State Controls**: Buttons to simulate different checkout states

---

## Functional Testing

### 1. Contact Section Testing

#### Test Case 1.1: Contact Form Functionality

- **Objective**: Verify contact form accepts valid email input
- **Steps**:
  1. Navigate to checkout page in contact state
  2. Enter valid email address in contact form
  3. Click "Complete" button
- **Expected Result**: Contact section collapses, delivery section opens
- **Test Data**: `test@example.com`, `user.name+tag@domain.co.uk`

#### Test Case 1.2: Contact Form Validation

- **Objective**: Verify email validation works correctly
- **Steps**:
  1. Enter invalid email formats
  2. Attempt to complete contact section
- **Expected Result**: Form validation prevents completion
- **Test Data**: `invalid-email`, `@domain.com`, `user@`, `spaces in email`

#### Test Case 1.3: Contact Edit Functionality

- **Objective**: Verify users can edit completed contact information
- **Steps**:
  1. Complete contact section
  2. Click "Edit" button on contact summary
  3. Modify email address
  4. Click "Complete"
- **Expected Result**: Contact summary updates with new email

#### Test Case 1.4: Contact Empty State Management

- **Objective**: Verify contact section shows appropriate empty state
- **Steps**:
  1. Load page with empty contact data
  2. Verify "Add your contact" message displays
  3. Complete contact form
  4. Verify empty state hides and summary shows
- **Expected Result**: Proper empty state management

### 2. Delivery Section Testing

#### Test Case 2.1: Shipping Address Form

- **Objective**: Verify all shipping address fields work correctly
- **Steps**:
  1. Open delivery section
  2. Fill all required shipping fields
  3. Complete delivery section
- **Required Fields**: Full Name, Street Address, City, State, ZIP Code
- **Optional Fields**: Apartment/Suite
- **Expected Result**: Delivery section closes, payment section opens

#### Test Case 2.2: Phone Number Field

- **Objective**: Verify phone number input formatting and validation
- **Steps**:
  1. Enter phone number in various formats
  2. Verify field accepts standard phone formats
- **Test Data**: `(555) 123-4567`, `555-123-4567`, `5551234567`

#### Test Case 2.3: Billing Address Toggle Functionality

- **Objective**: Verify "Use shipping address as billing address" checkbox works
- **Steps**:
  1. Verify checkbox is checked by default
  2. Verify billing section is hidden
  3. Uncheck the checkbox
  4. Verify billing section appears
  5. Re-check the checkbox
  6. Verify billing section hides
- **Expected Result**: Billing section toggles visibility correctly

#### Test Case 2.4: Billing Address Form Validation

- **Objective**: Verify billing address fields are validated when required
- **Steps**:
  1. Uncheck "Use shipping address as billing address"
  2. Leave billing fields empty
  3. Attempt to complete delivery section
  4. Verify completion is blocked
  5. Fill billing fields
  6. Complete delivery section
- **Expected Result**: Billing validation works when checkbox unchecked

#### Test Case 2.5: State Dropdown Functionality

- **Objective**: Verify state dropdowns work in both shipping and billing
- **Steps**:
  1. Test shipping address state dropdown
  2. Test billing address state dropdown (when visible)
  3. Verify states can be selected and validated
- **Expected Result**: State selection works for both forms

#### Test Case 2.6: Delivery Form Progression Logic

- **Objective**: Verify delivery completion detection works correctly
- **Steps**:
  1. Fill partial delivery information
  2. Verify cannot progress to payment
  3. Complete all required fields
  4. Verify can progress to payment
- **Expected Result**: Progression only occurs when all required fields complete

### 3. Payment Section Testing

#### Test Case 3.1: Payment Method Selection

- **Objective**: Verify payment method cards can be selected
- **Steps**:
  1. Navigate to payment section
  2. Click different payment method cards
  3. Verify visual selection feedback
- **Expected Result**: Payment methods highlight when selected

#### Test Case 3.2: Credit Card Form Validation

- **Objective**: Verify credit card forms validate correctly
- **Steps**:
  1. Test card number formatting and validation
  2. Test expiration date validation
  3. Test CVV validation
  4. Test cardholder name validation
- **Test Data**: Valid/invalid card numbers, past/future dates

#### Test Case 3.3: CCA Voucher Functionality

- **Objective**: Verify CCA voucher form works correctly including file upload capability
- **Steps**:
  1. Select CCA voucher payment method
  2. Enter voucher details in text fields
  3. Test file upload functionality:
     - Click file upload button/area
     - Select valid file types (PDF, JPG, PNG)
     - Verify file upload progress indicator
     - Verify successful file upload confirmation
     - Test file removal/replacement functionality
  4. Test file upload validation:
     - Attempt to upload invalid file types
     - Attempt to upload oversized files
     - Verify appropriate error messages
  5. Verify form validation with uploaded files
  6. Test form submission with attached files
- **Test Files**:
  - Valid: voucher.pdf, receipt.jpg, document.png
  - Invalid: executable.exe, oversized.pdf (>10MB), unsupported.txt
- **Expected Result**:
  - CCA voucher form functions properly
  - Files upload successfully with valid formats
  - File upload validation prevents invalid uploads
  - Uploaded files are properly associated with form submission

---

## State Management Testing

### Test Case 4.1: Contact State Initialization

- **Objective**: Verify page loads correctly in contact state
- **Steps**:
  1. Load page with `data-chk-state="contact"`
  2. Use test panel "Contact State" button
- **Expected Result**: Contact form open, other sections collapsed

### Test Case 4.2: Delivery State Initialization

- **Objective**: Verify page loads correctly in delivery state
- **Steps**:
  1. Load page with `data-chk-state="delivery"`
  2. Use test panel "Delivery State" button
- **Expected Result**: Contact complete, delivery form open, payment collapsed

### Test Case 4.3: Payment State Initialization

- **Objective**: Verify page loads correctly in payment state
- **Steps**:
  1. Load page with `data-chk-state="payment"`
  2. Use test panel "Payment State" button
- **Expected Result**: Contact and delivery complete, payment highlighted

### Test Case 4.4: State Transitions

- **Objective**: Verify smooth transitions between states
- **Steps**:
  1. Progress from contact → delivery → payment
  2. Edit previous sections and verify state management
- **Expected Result**: Proper state transitions and UI updates

### Test Case 4.5: Mock Data Population

- **Objective**: Verify mock data populates correctly
- **Steps**:
  1. Use test panel "Mock Data" buttons
  2. Verify forms populate with test data
  3. Verify section completion detection
- **Expected Result**: Forms populate and validate correctly

---

## Form Validation Testing

### Test Case 5.1: Required Field Validation

- **Objective**: Verify all required fields are validated
- **Steps**:
  1. Attempt to complete sections with empty required fields
  2. Verify validation prevents completion
- **Fields to Test**:
  - Contact: Email
  - Delivery: Full Name, Street Address, City, State, ZIP
  - Billing: All fields when checkbox unchecked
  - Payment: Card details, cardholder information

### Test Case 5.2: Optional Field Handling

- **Objective**: Verify optional fields don't block completion
- **Steps**:
  1. Leave optional fields empty
  2. Complete sections
- **Optional Fields**: Apartment/Suite, marketing checkboxes

### Test Case 5.3: Input Format Validation

- **Objective**: Verify proper input formatting
- **Test Areas**:
  - Email format validation
  - Phone number formatting
  - Credit card number formatting
  - ZIP code format validation

### Test Case 5.4: Cross-Section Validation

- **Objective**: Verify validation works across form sections
- **Steps**:
  1. Test billing address validation when checkbox unchecked
  2. Test section progression logic
  3. Verify incomplete sections block progression

---

## UI/UX Testing

### Test Case 6.1: Visual Feedback

- **Objective**: Verify proper visual feedback for user interactions
- **Elements to Test**:
  - Button hover states
  - Form focus states
  - Section highlighting (blue headers)
  - Card selection feedback

### Test Case 6.2: Animation and Transitions

- **Objective**: Verify smooth animations and transitions
- **Elements to Test**:
  - Section expand/collapse animations
  - Form slide transitions
  - Border radius changes
  - Opacity transitions

### Test Case 6.3: Loading States

- **Objective**: Verify loading states display appropriately
- **Steps**:
  1. Test form submission states
  2. Verify loading indicators
  3. Test disabled states during processing

### Test Case 6.4: Error State Display

- **Objective**: Verify error messages display clearly
- **Steps**:
  1. Trigger validation errors
  2. Verify error message clarity and positioning
  3. Test error state recovery

---

## Responsive Design Testing

### Test Case 7.1: Mobile Responsiveness (320px - 768px)

- **Objective**: Verify checkout works on mobile devices
- **Elements to Test**:
  - Form field sizing and usability
  - Button accessibility
  - Text readability
  - Section navigation

### Test Case 7.2: Tablet Responsiveness (768px - 1024px)

- **Objective**: Verify checkout works on tablets
- **Elements to Test**:
  - Layout optimization
  - Touch interaction compatibility
  - Form field grouping

### Test Case 7.3: Desktop Responsiveness (1024px+)

- **Objective**: Verify optimal desktop experience
- **Elements to Test**:
  - Full layout utilization
  - Hover interactions
  - Keyboard navigation

### Test Case 7.4: Specific Breakpoint Testing

- **Critical Breakpoints**: 1024px (identified layout issue)
- **Steps**:
  1. Test at exact breakpoint
  2. Verify no layout breaks
  3. Test slight variations (1020px, 1028px)

---

## Accessibility Testing

### Test Case 8.1: Keyboard Navigation

- **Objective**: Verify full keyboard accessibility
- **Steps**:
  1. Navigate entire checkout using only keyboard
  2. Test Tab/Shift+Tab navigation
  3. Test Enter/Space activation
  4. Test Escape key functionality

### Test Case 8.2: Screen Reader Compatibility

- **Objective**: Verify screen reader compatibility
- **Tools**: NVDA, JAWS, VoiceOver
- **Elements to Test**:
  - Form labels and descriptions
  - Section headings hierarchy
  - Error message announcements

### Test Case 8.3: Focus Management

- **Objective**: Verify proper focus management
- **Steps**:
  1. Test focus indicators visibility
  2. Test focus trapping in modal states
  3. Test focus restoration after actions

### Test Case 8.4: Color Contrast and Visual Accessibility

- **Objective**: Verify visual accessibility standards
- **Tools**: WAVE, axe DevTools
- **Standards**: WCAG 2.1 AA compliance

---

## Performance Testing

### Test Case 9.1: Page Load Performance

- **Objective**: Verify acceptable load times
- **Metrics**:
  - First Contentful Paint (FCP) < 1.8s
  - Largest Contentful Paint (LCP) < 2.5s
  - Cumulative Layout Shift (CLS) < 0.1

### Test Case 9.2: Form Interaction Performance

- **Objective**: Verify responsive form interactions
- **Elements to Test**:
  - Input field responsiveness
  - Validation speed
  - Section transition smoothness

### Test Case 9.3: JavaScript Performance

- **Objective**: Verify efficient JavaScript execution
- **Tools**: Chrome DevTools Performance tab
- **Metrics**: No blocking tasks > 50ms

---

## Browser Compatibility Testing

### Test Case 10.1: Chrome/Chromium-based Browsers

- **Browsers**: Chrome, Edge, Opera, Brave
- **Versions**: Current and previous major version

### Test Case 10.2: Firefox

- **Versions**: Current and ESR (Extended Support Release)

### Test Case 10.3: Safari

- **Versions**: Current and previous major version
- **Platforms**: macOS and iOS

### Test Case 10.4: Feature Support Verification

- **Features to Test**:
  - ES6 modules support
  - CSS Grid/Flexbox
  - Form validation API
  - Bootstrap 5 compatibility

---

## Integration Testing

### Test Case 11.1: Module Integration

- **Objective**: Verify ES6 modules work correctly
- **Modules to Test**:
  - section-manager.js
  - form-functionality.js
  - galls-validation.js

### Test Case 11.2: External Library Integration

- **Libraries to Test**:
  - Bootstrap 5 (CSS and JS)
  - Inputmask for credit cards
  - Font loading (Google Fonts)

### Test Case 11.3: Global Function Exposure

- **Objective**: Verify test utilities and global functions work
- **Console Functions to Test**:
  - `window.toggleBillingAddress()`
  - `window.isDeliveryFormComplete()`
  - `window.getCurrentEditingSection()`

---

## Test Data and Mock States

### Mock Data Sets

#### Contact State Data

```javascript
{
  contact: { email: "" },
  delivery: { /* all empty */ }
}
```

#### Delivery State Data

```javascript
{
  contact: { email: "test@example.com" },
  delivery: { /* partially filled */ }
}
```

#### Payment State Data

```javascript
{
  contact: { email: "test@example.com" },
  delivery: { /* completely filled */ }
}
```

### Test Credit Card Numbers

- **Visa**: 4111 1111 1111 1111
- **MasterCard**: 5555 5555 5555 4444
- **American Express**: 3782 822463 10005
- **Discover**: 6011 1111 1111 1117

### Test Address Data

```
Name: John Doe
Address: 123 Main Street
Apartment: Apt 4B (optional)
City: New York
State: NY
ZIP: 10001
Phone: (555) 123-4567
```

---

## Automated Testing Scripts

### Console Testing Commands

```javascript
// Test billing address toggle
window.toggleBillingAddress(document.getElementById("useShippingAsBilling"));

// Test form completion detection
window.isDeliveryFormComplete();

// Test current editing section
window.getCurrentEditingSection();

// Test state initialization
window.initializeFromState();

// Test section completion
window.completeEditing("contact");
window.startEditing("delivery");
```

### Browser DevTools Testing

1. **Network Tab**: Monitor request/response times
2. **Performance Tab**: Profile JavaScript execution
3. **Lighthouse**: Run accessibility and performance audits
4. **Console Tab**: Execute test commands and monitor errors

---

## Test Execution Checklist

### Pre-Test Setup

- [ ] Start local server (`python -m http.server 8000`)
- [ ] Open browser developer tools
- [ ] Clear browser cache and cookies
- [ ] Verify test panel is visible

### Functional Testing Execution

- [ ] Contact section tests (1.1 - 1.4)
- [ ] Delivery section tests (2.1 - 2.6)
- [ ] Payment section tests (3.1 - 3.3)
- [ ] State management tests (4.1 - 4.5)
- [ ] Form validation tests (5.1 - 5.4)

### UI/UX Testing Execution

- [ ] Visual feedback tests (6.1 - 6.4)
- [ ] Responsive design tests (7.1 - 7.4)
- [ ] Accessibility tests (8.1 - 8.4)

### Performance and Compatibility

- [ ] Performance tests (9.1 - 9.3)
- [ ] Browser compatibility tests (10.1 - 10.4)
- [ ] Integration tests (11.1 - 11.3)

### Test Results Documentation

- [ ] Record test results for each case
- [ ] Document any bugs or issues found
- [ ] Note browser-specific behaviors
- [ ] Capture screenshots for visual issues

---

## Bug Reporting Template

```markdown
### Bug Report

**Test Case**: [Test Case Number and Name]
**Browser**: [Browser name and version]
**Device**: [Desktop/Mobile/Tablet]
**Steps to Reproduce**:

1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result**: [What should happen]
**Actual Result**: [What actually happened]
**Severity**: [Critical/High/Medium/Low]
**Screenshots**: [If applicable]
**Console Errors**: [Any JavaScript errors]
```

---

## Conclusion

This comprehensive test plan covers all aspects of the Galls Postal Checkout system. Execute tests systematically, document results thoroughly, and use the built-in test utilities to validate functionality across different states and scenarios.

For questions or additional test scenarios, refer to the Backend Integration Guide and development team documentation.
