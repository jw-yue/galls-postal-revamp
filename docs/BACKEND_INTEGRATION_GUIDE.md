# Galls Postal Checkout - Backend Integration Guide

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [State-Driven Template System](#state-driven-template-system)
3. [Data Population Strategy](#data-population-strategy)
4. [Progression Logic](#progression-logic)
5. [API Integration Points](#api-integration-points)
6. [Frontend-Backend Contract](#frontend-backend-contract)
7. [Implementation Examples](#implementation-examples)

---

Note: ES6 modules can't be loaded from the folder protocol due to CORS restrictions. We need to serve the files over HTTP. To run local server with node, run npx http-server -p 8000

## High-Level Architecture

### Overview

The checkout system uses a **state-driven modular architecture** where the frontend renders different UI states based on user data completeness. The backend determines which template state to serve based on existing user information.

### Core Concept

```
Backend Logic → User Data Assessment → Template State Selection → Frontend Rendering
```

### Key Components

- **State Controller**: Backend logic that determines checkout state
- **Template Renderer**: Serves appropriate HTML template with pre-populated data
- **Progress Manager**: Handles section completion and advancement
- **Data Validator**: Ensures data integrity across states

---

## State-Driven Template System

### Primary States

The system operates on three main states controlled by the `data-chk-state` attribute:

#### 1. Contact State (`data-chk-state="contact"`)

**When to Use:**

- New users with no contact information
- Users with incomplete contact data (for the most part users should have their email and craft if logged in. Remember to make a change where we have users select a craft before they can proceed from cart to checkout.)

**Characteristics:**

- Contact form is expanded and ready for input
- Delivery and Payment sections are collapsed
- "Add" button visible for contact section
- Blue header highlights contact section

#### 2. Delivery State (`data-chk-state="delivery"`)

**When to Use:**

- Contact information is complete and verified
- Delivery address is missing or incomplete
- User needs to add/update shipping information

**Characteristics:**

- Contact section shows completed summary with "Edit" button
- Delivery form is expanded and focused
- Payment section remains collapsed
- Blue header highlights delivery section

#### 3. Payment State (`data-chk-state="payment"`)

**When to Use:**

- Both contact and delivery information are complete
- User ready to select payment method
- Final checkout step

**Characteristics:**

- Contact and delivery show completed summaries with "Edit" buttons
- Payment section is highlighted and ready for interaction
- Blue header highlights payment section
- All previous sections display completed data

---

## Data Population Strategy

### Backend Responsibility Matrix

| Data Type        | Source                  | Population Method              | Validation Required               |
| ---------------- | ----------------------- | ------------------------------ | --------------------------------- |
| Contact Email    | User Profile            | Pre-fill form inputs + display | Email format, verification status |
| Contact Craft    | User Profile/HR System  | Pre-select dropdown + display  | Valid craft codes                 |
| Delivery Address | Saved Addresses/Profile | Pre-fill all address fields    | Address validation service        |
| Payment Methods  | Saved Payment Methods   | Display saved cards            | PCI compliance check              |

### Data Population Functions

The backend has **two options** for populating user data:

#### Option 1: JavaScript Function Calls

The frontend provides these JavaScript functions that can be called via server-side rendering or AJAX:

##### Contact Data Population

```javascript
// Backend can call this via server-side rendering or AJAX
populateContactData({
  email: "user@department.gov",
  craft: "Police Officer", // Must match dropdown options
});
```

##### Delivery Data Population

```javascript
// Backend can populate with user's saved/default address
populateDeliveryData({
  fullName: "John Doe",
  streetAddress: "123 Main St",
  apartment: "Apt 4B", // Optional
  city: "New York",
  state: "NY",
  zip: "10001",
});
```

#### Option 2: Template Segment Display

Alternatively, the backend can render different HTML segments based on the state, showing completed vs. empty sections:

##### Contact Section Templates

```html
<!-- For users WITH contact data -->
<div data-display-content="contact">
  <span class="p-chk-contact-card__email">{{user.email}}</span>
  <span class="p-chk-contact-card__job-title">{{user.craft}}</span>
</div>
<button id="contactEditButton" data-edit-button="contact">Edit</button>

<!-- For users WITHOUT contact data -->
<div data-display-content="contact">
  <span class="p-chk-contact-card__email"></span>
  <span class="p-chk-contact-card__job-title"></span>
</div>
<button id="contactEditButton" data-edit-button="contact">Add</button>
```

##### Delivery Section Templates

```html
<!-- For users WITH delivery data -->
<div data-display-content="delivery">
  <div class="p-chk-address-card__address">
    {{user.full_name}}<br />
    {{user.street_address}}<br />
    {{user.city}}, {{user.state}} {{user.zip}}
  </div>
</div>
<button id="deliveryEditButton" data-edit-button="delivery">Edit</button>

<!-- For users WITHOUT delivery data -->
<div data-display-content="delivery">
  <div class="p-chk-address-card__empty-description">
    Add your delivery address
  </div>
</div>
<button id="deliveryEditButton" data-edit-button="delivery">Add</button>
```

### State Determination Logic (Backend)

The backend system (IBM iSeries/mainframe or other architecture) needs to determine which checkout state to serve based on user data completeness:

**State Decision Matrix:**

- **Contact State**: User has no email OR no craft/job title OR email not verified
- **Delivery State**: Contact complete BUT no delivery address OR incomplete address
- **Payment State**: Both contact and delivery information are complete and verified

```pseudocode
// Conceptual logic - implement using your preferred backend architecture
if (!user_has_complete_contact_info()) {
    return "contact"
} else if (!user_has_complete_delivery_info()) {
    return "delivery"
} else {
    return "payment"
}
```

---

## Progression Logic

### Smart Progression System

The frontend automatically advances users to the next incomplete section after completing the current one.

### Backend State Transitions

#### Flow 1: New User Journey

```
Empty State → Contact State → Delivery State → Payment State → Order Complete
```

#### Flow 2: Returning User (Partial Data)

```
Contact Complete → Delivery State → Payment State → Order Complete
```

#### Flow 3: Returning User (Full Profile)

```
All Data Complete → Payment State → Order Complete
```

### Section Completion Detection

The frontend determines section completion using:

```javascript
// Contact completion
const isContactComplete = email && craftText;

// Delivery completion
const isDeliveryComplete =
  deliveryAddress &&
  deliveryAddress.textContent.trim() &&
  !deliveryAddress.textContent.includes("Add your delivery address");
```

---

## API Integration Points

### Backend System Requirements

The backend system (IBM iSeries, mainframe, or other architecture) needs to provide:

1. **User Data Retrieval**: Access to user contact information, saved addresses, and profile data
2. **State Determination**: Logic to assess data completeness and determine appropriate checkout state
3. **Template Rendering**: Ability to serve HTML with correct state attributes and pre-populated data
4. **Data Persistence**: Save user input during checkout process
5. **Order Processing**: Handle final order submission and processing

### Integration Approaches

#### Option A: Server-Side Rendering

- Backend renders complete HTML with user data pre-populated
- State is determined server-side and embedded in template
- Form inputs pre-filled with existing user data
- Recommended for traditional web applications

#### Option B: API-Driven

- Backend provides REST/GraphQL endpoints for data retrieval
- Frontend makes AJAX calls to populate data
- State can be determined client-side or server-side
- Recommended for SPA architectures

#### Option C: Hybrid Approach

- Initial page load with server-side state determination
- AJAX calls for subsequent state transitions
- Best of both worlds for performance and flexibility

### Required Data Endpoints (If Using API Approach)

#### 1. Checkout State Initialization

```
GET /api/checkout/state
Response: {
    "state": "contact|delivery|payment",
    "user_data": {
        "contact": { "email": "", "craft": "" },
        "delivery": { "fullName": "", "streetAddress": "", ... },
        "payment": { "saved_methods": [...] }
    }
}
```

#### 2. Section Data Update

```
POST /api/checkout/update/{section}
Body: {
    "contact": { "email": "user@gov.com", "craft": "Police Officer" }
}
Response: {
    "success": true,
    "next_state": "delivery"
}
```

#### 3. Order Completion

```
POST /api/checkout/complete
Body: {
    "contact": {...},
    "delivery": {...},
    "payment": {...},
    "order_items": [...]
}
```

### Backend Validation Rules

The backend system should implement appropriate validation based on business requirements:

#### Contact Validation

- Email format validation
- Domain restrictions (if required for government users)
- Craft/job title validation against approved lists
- User authentication and authorization

#### Delivery Validation

- Address format and completeness validation
- Geographic service area restrictions
- Shipping method availability
- Address standardization (USPS or equivalent)

#### Payment Validation

- Payment method verification
- Credit/budget limit checks
- Government purchasing compliance (if applicable)
- Security and PCI compliance

---

## Frontend-Backend Contract

### Template Requirements

The backend must serve HTML with these specific attributes:

```html
<!-- Main container with state -->
<div class="p-chk-main__content" data-chk-state="contact">
  <!-- Editable sections -->
  <div data-editable-section="contact">
    <div data-editable-section="delivery">
      <div data-editable-section="payment">
        <!-- Edit buttons -->
        <button id="contactEditButton" data-edit-button="contact">
          <button id="deliveryEditButton" data-edit-button="delivery">
            <!-- Forms -->
            <div data-edit-form="contact">
              <div data-edit-form="delivery">
                <!-- Display content -->
                <div data-display-content="contact">
                  <div data-display-content="delivery"></div>
                </div>
              </div>
            </div>
          </button>
        </button>
      </div>
    </div>
  </div>
</div>
```

### Data Binding Points

#### Contact Section

```html
<!-- Display elements -->
<span class="p-chk-contact-card__email">{{user.email}}</span>
<span class="p-chk-contact-card__job-title">{{user.craft}}</span>

<!-- Form inputs -->
<input type="email" value="{{user.email}}">
<select>
    <option {{#if_eq user.craft 'Police Officer'}}selected{{/if_eq}}>
        Police Officer
    </option>
</select>
```

#### Delivery Section

```html
<!-- Address display -->
<div class="p-chk-address-card__address">
  {{user.address.full_name}}<br />
  {{user.address.street}}<br />
  {{user.address.city}}, {{user.address.state}} {{user.address.zip}}
</div>

<!-- Form inputs -->
<input type="text" value="{{user.address.full_name}}" />
<input type="text" value="{{user.address.street}}" />
<!-- ... additional fields -->
```

---

## Implementation Examples

### Example 1: Server-Side Template Rendering

```html
<!-- Backend determines state and renders appropriate template -->
<div class="p-chk-main__content" data-chk-state="{{checkout_state}}">
  <!-- Contact section with conditional display -->
  {{#if user.has_contact_info}}
  <span class="p-chk-contact-card__email">{{user.email}}</span>
  <span class="p-chk-contact-card__job-title">{{user.craft}}</span>
  <button id="contactEditButton" data-edit-button="contact">Edit</button>
  {{else}}
  <span class="p-chk-contact-card__email"></span>
  <span class="p-chk-contact-card__job-title"></span>
  <button id="contactEditButton" data-edit-button="contact">Add</button>
  {{/if}}

  <!-- Delivery section with conditional display -->
  {{#if user.has_delivery_info}}
  <div class="p-chk-address-card__address">
    {{user.delivery.full_name}}<br />
    {{user.delivery.street}}<br />
    {{user.delivery.city}}, {{user.delivery.state}} {{user.delivery.zip}}
  </div>
  <button id="deliveryEditButton" data-edit-button="delivery">Edit</button>
  {{else}}
  <div class="p-chk-address-card__empty-description">
    Add your delivery address
  </div>
  <button id="deliveryEditButton" data-edit-button="delivery">Add</button>
  {{/if}}
</div>
```

### Example 2: API-Driven Initialization

```javascript
// Frontend initialization for API-driven approach
document.addEventListener("DOMContentLoaded", async function () {
  try {
    // Backend can implement this endpoint using any architecture
    const response = await fetch("/api/checkout/state");
    const data = await response.json();

    // Set the state
    document
      .querySelector(".p-chk-main__content")
      .setAttribute("data-chk-state", data.state);

    // Populate data using frontend functions
    if (data.user_data.contact) {
      populateContactData(data.user_data.contact);
    }
    if (data.user_data.delivery) {
      populateDeliveryData(data.user_data.delivery);
    }

    // Initialize UI
    initializeFromState();
  } catch (error) {
    console.error("Failed to initialize checkout:", error);
  }
});
```

### Example 3: Form Submission Handler

```javascript
// Generic form submission - backend can implement any architecture
document
  .querySelector('[data-complete-edit="contact"]')
  .addEventListener("click", async function () {
    const formData = gatherContactFormData();

    try {
      // Backend endpoint - implementation flexible
      const response = await fetch("/api/checkout/update/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success && result.next_state) {
        // Update state and advance
        changeStateWithMockData(result.next_state);
      }
    } catch (error) {
      console.error("Failed to update contact:", error);
    }
  });
```

---

## Testing & Debugging

### State Testing Buttons

The frontend includes test buttons for development:

```html
<!-- Development only - remove in production -->
<div style="position: fixed; top: 10px; left: 10px; z-index: 9999;">
  <button onclick="changeStateWithMockData('contact')">Contact</button>
  <button onclick="changeStateWithMockData('delivery')">Delivery</button>
  <button onclick="changeStateWithMockData('payment')">Payment</button>
</div>
```

### Backend Testing Checklist

- [ ] New users load in contact state with empty forms
- [ ] Users with contact info load in delivery state with contact pre-filled
- [ ] Users with complete profiles load in payment state with all data shown
- [ ] State transitions work correctly after form submissions
- [ ] Data persists correctly between state changes
- [ ] Form validation prevents invalid state progression
- [ ] Edit buttons allow returning to previous sections
- [ ] IBM iSeries/mainframe data integration works correctly (if applicable)
- [ ] Performance is acceptable for expected user load

### Common Integration Issues

1. **State Mismatch**: Frontend state doesn't match backend data
2. **Data Format**: Backend data doesn't match frontend expectations
3. **Timing Issues**: Race conditions during state transitions
4. **Validation Conflicts**: Frontend and backend validation inconsistencies

---

## Next Steps

1. **Backend Architecture**: Design backend system using preferred technology stack (IBM iSeries integration, modern web frameworks, etc.)
2. **Data Integration**: Connect to existing user data sources and profile systems
3. **State Logic**: Implement business logic for determining checkout states
4. **Template System**: Choose between server-side rendering or API-driven approach
5. **Testing**: Create comprehensive tests for all user scenarios and state transitions
6. **Performance**: Optimize for expected user load and system constraints
7. **Security**: Implement appropriate authentication, authorization, and data protection
8. **Deployment**: Plan deployment strategy that works with existing infrastructure

The frontend system is designed to be backend-agnostic and will work with any server architecture that can provide the required data and state information.

For questions or clarification on any aspect of this integration, please refer to the frontend codebase or contact the frontend development team.
