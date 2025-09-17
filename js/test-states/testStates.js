/**
 * Test States Module
 * Handles the test state buttons and mock data population
 */

// Mock data for different states
const mockData = {
  contact: {
    // New user - no data populated, form should be open
    contact: {
      email: "",
      craft: "",
    },
    delivery: {
      fullName: "",
      streetAddress: "",
      apartment: "",
      city: "",
      state: "",
      zip: "",
    },
  },
  delivery: {
    // Contact filled, delivery partially filled
    contact: {
      email: "john.doe@email.com",
      craft: "Police Officer",
    },
    delivery: {
      fullName: "John Doe",
      streetAddress: "123 Main Street",
      apartment: "", // Leave some fields blank
      city: "", // Leave some fields blank
      state: "",
      zip: "",
    },
  },
  payment: {
    // Both contact and delivery completed
    contact: {
      email: "example@test.com",
      craft: "Firefighter",
    },
    delivery: {
      fullName: "John Doe",
      streetAddress: "123 Main Street",
      apartment: "Apt 4B",
      city: "New York",
      state: "NY",
      zip: "10001",
    },
  },
};

/**
 * Initialize test state from data attribute
 */
export function initializeFromState() {
  const mainContent = document.querySelector(".p-chk-main__content");
  const state = mainContent ? mainContent.getAttribute("data-chk-state") : null;

  console.log("Initializing from state:", state);

  if (!state) return;

  // Set up UI based on the state
  switch (state) {
    case "contact":
      // Contact form should be open, other sections hidden/disabled (new user)
      console.log("Setting up contact state - new user");
      setTimeout(() => {
        // These functions will be imported from other modules
        window.startEditing("contact");
        // Show delivery Add button for new user (no delivery content yet)
        window.updateEditButtonText("delivery", false);
        // Ensure delivery shows empty state
        const displayContent = document.querySelector(
          '[data-display-content="delivery"]'
        );
        const addressElement = displayContent?.querySelector(
          ".p-chk-address-card__address"
        );
        const emptyDescription = displayContent?.querySelector(
          ".p-chk-address-card__empty-description"
        );
        if (addressElement && emptyDescription) {
          addressElement.style.display = "none";
          emptyDescription.style.display = "block";
        }
      }, 100);
      break;

    case "delivery":
      // Contact completed, delivery form open
      console.log("Setting up delivery state");
      setTimeout(() => {
        window.startEditing("delivery");
      }, 100);
      break;

    case "payment":
      // Both contact and delivery completed, payment highlighted
      console.log("Setting up payment state");
      setTimeout(() => {
        window.SectionManager.manageHeaders("payment", "show-blue");
        window.SectionManager.manageBorderRadius("payment", "remove-top");

        // Ensure delivery shows completed address (not empty state)
        const displayContent = document.querySelector(
          '[data-display-content="delivery"]'
        );
        const addressElement = displayContent?.querySelector(
          ".p-chk-address-card__address"
        );
        const emptyDescription = displayContent?.querySelector(
          ".p-chk-address-card__empty-description"
        );
        if (addressElement && emptyDescription) {
          addressElement.style.display = "block";
          emptyDescription.style.display = "none";
        }
      }, 100);
      break;

    default:
      // Default state - no specific initialization needed
      console.log("No specific state initialization needed");
      break;
  }
}

/**
 * Change state with mock data population
 */
export function changeStateWithMockData(newState) {
  const mainContent = document.querySelector(".p-chk-main__content");
  if (mainContent) {
    mainContent.setAttribute("data-chk-state", newState);
    console.log("State changed to:", newState);

    // Reset current editing
    if (window.currentEditingSection) {
      window.completeEditing(window.currentEditingSection);
    }

    // Populate mock data
    populateMockData(newState);

    // Re-initialize
    initializeFromState();
  }
}

/**
 * Populate mock data based on state
 */
function populateMockData(state) {
  const data = mockData[state];
  if (!data) return;

  console.log("Populating mock data for state:", state, data);

  // Populate contact data
  window.populateContactData(data.contact);

  // Populate delivery data
  window.populateDeliveryData(data.delivery);
}

/**
 * Utility function to change state for testing (can be called from browser console)
 */
export function changeState(newState) {
  const mainContent = document.querySelector(".p-chk-main__content");
  if (mainContent) {
    mainContent.setAttribute("data-chk-state", newState);
    console.log("State changed to:", newState);

    // Reset current editing
    if (window.currentEditingSection) {
      window.completeEditing(window.currentEditingSection);
    }

    // Re-initialize
    initializeFromState();
  }
}

// Make functions available globally for browser console testing and HTML onclick handlers
window.changeState = changeState;
window.changeStateWithMockData = changeStateWithMockData;
