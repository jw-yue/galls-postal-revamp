// =============================================================================
// TEST STATE UTILITIES - DEVELOPMENT ONLY (Updated for Data-Driven Flow)
// =============================================================================
// This file contains utilities for testing different checkout scenarios
// using the new initializeFromFormData() approach instead of data-chk-state.

// Mock data for different checkout scenarios
const mockData = {
  contact: {
    // Scenario 1: New user - no data populated, contact form should be open
    contact: {
      email: "",
    },
    delivery: {
      fullName: "",
      streetAddress: "",
      apartment: "",
      city: "",
      state: "",
      zip: "",
    },
    payment: {
      cardNumber: "",
      expiry: "",
      cvv: "",
      nameOnCard: "",
    },
  },
  delivery: {
    // Scenario 2: Contact filled, delivery form should be open
    contact: {
      email: "john.doe@email.com",
    },
    delivery: {
      fullName: "",
      streetAddress: "",
      apartment: "",
      city: "",
      state: "",
      zip: "",
    },
    payment: {
      cardNumber: "",
      expiry: "",
      cvv: "",
      nameOnCard: "",
    },
  },
  payment: {
    // Scenario 3: Both contact and delivery completed, payment should be highlighted
    contact: {
      email: "example@test.com",
    },
    delivery: {
      fullName: "John Doe",
      streetAddress: "123 Main Street",
      apartment: "Apt 4B",
      city: "New York",
      state: "NY",
      zip: "10001",
    },
    payment: {
      cardNumber: "4111111111111111",
      expiry: "12/25",
      cvv: "123",
      nameOnCard: "John Doe",
    },
  },
};

// Enhanced function to simulate backend data population (replaces state-driven approach)
function changeStateWithMockData(scenario) {
  console.log("Testing scenario:", scenario);

  // Populate form fields with mock data to simulate backend data
  populateMockData(scenario);

  // Use the new data-driven initialization instead of state-driven
  if (typeof window.GallsCheckout?.initializeFromFormData === "function") {
    window.GallsCheckout.initializeFromFormData();
  } else {
    console.error("GallsCheckout.initializeFromFormData not available");
  }
}

// Function to populate mock data based on scenario
function populateMockData(scenario) {
  const data = mockData[scenario];
  if (!data) return;

  console.log("Populating mock data for scenario:", scenario, data);

  // Populate contact data
  populateContactData(data.contact);

  // Populate delivery data
  populateDeliveryData(data.delivery);

  // Populate payment data
  populatePaymentData(data.payment);
}

// Function to populate contact section with mock data
function populateContactData(contactData) {
  // Target contact form input using data attribute pattern
  const emailInput = document.querySelector(
    '#contactEditForm input[type="email"]'
  );
  if (emailInput) {
    emailInput.value = contactData.email || "";
  }

  // Update display content using data attributes
  const emailDisplay = document.querySelector("[data-chk-contact-email]");
  if (emailDisplay) {
    emailDisplay.textContent = contactData.email || "";
  }

  // Show/hide empty state vs content based on data
  const emptyElement = document.querySelector("[data-chk-contact-empty]");
  const hasContent = contactData.email && contactData.email.trim();

  if (emailDisplay && emptyElement) {
    if (hasContent) {
      emailDisplay.style.display = "block";
      emptyElement.style.display = "none";
    } else {
      emailDisplay.style.display = "none";
      emptyElement.style.display = "block";
    }
  }
}

// Function to populate delivery section with mock data
function populateDeliveryData(deliveryData) {
  // Target delivery form inputs using data attributes or form selectors
  const deliveryForm = document.querySelector("#deliveryEditForm");
  if (!deliveryForm) return;

  // Update form inputs - target by position since there are multiple text inputs
  const textInputs = deliveryForm.querySelectorAll('input[type="text"]');
  const stateSelect = deliveryForm.querySelector("select");

  if (textInputs.length >= 5) {
    textInputs[0].value = deliveryData.fullName || ""; // Full Name
    textInputs[1].value = deliveryData.streetAddress || ""; // Street Address
    textInputs[2].value = deliveryData.apartment || ""; // Apartment/Suite
    textInputs[3].value = deliveryData.city || ""; // City
    textInputs[4].value = deliveryData.zip || ""; // ZIP Code
  }

  if (stateSelect && deliveryData.state) {
    stateSelect.value = deliveryData.state;
  }

  // Update display content using data attributes
  updateDeliveryDisplayFromData(deliveryData);
}
// Function to populate payment section with mock data
function populatePaymentData(paymentData) {
  // Target both postal and personal payment form inputs
  // Postal card inputs
  const postalCardNumber = document.querySelector("#chkPostalCardNumber");
  const postalMonthSelect = document.querySelector("#chkPostalMonthSelect");
  const postalYearSelect = document.querySelector("#chkPostalYearSelect");
  const postalCVV = document.querySelector("#chkPostalCVV");
  const postalCardholder = document.querySelector("#chkPostalCardholder");

  // Personal card inputs
  const personalCardNumber = document.querySelector("#chkPersonalCardNumber");
  const personalMonthSelect = document.querySelector("#chkPersonalMonthSelect");
  const personalYearSelect = document.querySelector("#chkPersonalYearSelect");
  const personalCVV = document.querySelector("#chkPersonalCVV");
  const personalCardholder = document.querySelector("#chkPersonalCardholder");

  // Populate postal card form (if present)
  if (postalCardNumber) postalCardNumber.value = paymentData.cardNumber || "";
  if (postalCVV) postalCVV.value = paymentData.cvv || "";
  if (postalCardholder) postalCardholder.value = paymentData.nameOnCard || "";

  // Handle expiry date for postal form
  if (paymentData.expiry && postalMonthSelect && postalYearSelect) {
    const [month, year] = paymentData.expiry.split("/");
    if (month) postalMonthSelect.value = month.padStart(2, "0");
    if (year) postalYearSelect.value = "20" + year;
  }

  // Populate personal card form (if present)
  if (personalCardNumber)
    personalCardNumber.value = paymentData.cardNumber || "";
  if (personalCVV) personalCVV.value = paymentData.cvv || "";
  if (personalCardholder)
    personalCardholder.value = paymentData.nameOnCard || "";

  // Handle expiry date for personal form
  if (paymentData.expiry && personalMonthSelect && personalYearSelect) {
    const [month, year] = paymentData.expiry.split("/");
    if (month) personalMonthSelect.value = month.padStart(2, "0");
    if (year) personalYearSelect.value = "20" + year;
  }
}

// Function to update delivery display from data object using data attributes
function updateDeliveryDisplayFromData(deliveryData) {
  // Target elements using data attributes
  const addressElement = document.querySelector("[data-chk-delivery-address]");
  const emptyElement = document.querySelector("[data-chk-delivery-empty]");

  if (!addressElement || !emptyElement) return;

  // Build address display text
  let addressText = "";
  let hasAnyContent = Object.values(deliveryData).some(
    (value) => value && value.trim()
  );

  if (hasAnyContent) {
    if (deliveryData.fullName) {
      addressText += deliveryData.fullName + "<br />";
    }
    if (deliveryData.streetAddress) {
      addressText += deliveryData.streetAddress + "<br />";
    }
    if (deliveryData.apartment) {
      addressText += deliveryData.apartment + "<br />";
    }

    // Build city/state/zip line
    let locationLine = "";
    if (deliveryData.city) {
      locationLine += deliveryData.city;
    }
    if (deliveryData.state) {
      locationLine += (deliveryData.city ? ", " : "") + deliveryData.state;
    }
    if (deliveryData.zip) {
      locationLine +=
        (deliveryData.city || deliveryData.state ? " " : "") + deliveryData.zip;
    }

    if (locationLine) {
      addressText += locationLine + "<br />";
    }

    if (addressText) {
      addressText += "United States";
    }
  }

  // Show/hide content based on data presence
  if (addressText) {
    addressElement.innerHTML = addressText;
    addressElement.style.display = "block";
    emptyElement.style.display = "none";
  } else {
    addressElement.style.display = "none";
    emptyElement.style.display = "block";
  }
}

// Simple function to test data-driven initialization without mock data
function testDataDrivenInit() {
  console.log("Testing data-driven initialization with current form data...");

  if (typeof window.GallsCheckout?.initializeFromFormData === "function") {
    window.GallsCheckout.initializeFromFormData();
  } else {
    console.error("GallsCheckout.initializeFromFormData not available");
  }
}

// Function to clear all form data for testing empty state
function clearAllFormData() {
  console.log("Clearing all form data...");

  // Clear contact form
  const emailInput = document.querySelector(
    '#contactEditForm input[type="email"]'
  );
  if (emailInput) emailInput.value = "";

  // Clear delivery form
  const deliveryForm = document.querySelector("#deliveryEditForm");
  if (deliveryForm) {
    const textInputs = deliveryForm.querySelectorAll('input[type="text"]');
    const selectInputs = deliveryForm.querySelectorAll("select");
    textInputs.forEach((input) => (input.value = ""));
    selectInputs.forEach((select) => (select.selectedIndex = 0));
  }

  // Clear payment forms (both postal and personal)
  const paymentInputs = [
    "#chkPostalCardNumber",
    "#chkPostalCVV",
    "#chkPostalCardholder",
    "#chkPersonalCardNumber",
    "#chkPersonalCVV",
    "#chkPersonalCardholder",
  ];
  const paymentSelects = [
    "#chkPostalMonthSelect",
    "#chkPostalYearSelect",
    "#chkPersonalMonthSelect",
    "#chkPersonalYearSelect",
  ];

  paymentInputs.forEach((selector) => {
    const input = document.querySelector(selector);
    if (input) input.value = "";
  });

  paymentSelects.forEach((selector) => {
    const select = document.querySelector(selector);
    if (select) select.selectedIndex = 0;
  });

  // Clear display content
  const emailDisplay = document.querySelector("[data-chk-contact-email]");
  const emptyContact = document.querySelector("[data-chk-contact-empty]");
  if (emailDisplay && emptyContact) {
    emailDisplay.textContent = "";
    emailDisplay.style.display = "none";
    emptyContact.style.display = "block";
  }

  const addressDisplay = document.querySelector("[data-chk-delivery-address]");
  const emptyDelivery = document.querySelector("[data-chk-delivery-empty]");
  if (addressDisplay && emptyDelivery) {
    addressDisplay.innerHTML = "";
    addressDisplay.style.display = "none";
    emptyDelivery.style.display = "block";
  }

  // Re-initialize with cleared data
  testDataDrivenInit();
}

// Legacy function kept for compatibility (now uses data-driven approach)
function changeState(scenario) {
  console.log("Using data-driven approach for scenario:", scenario);
  changeStateWithMockData(scenario);
}

// Test States Panel Toggle Functionality
let testStatesPanelVisible = false;

function toggleTestStates() {
  const panel = document.getElementById("testStatesPanel");
  const tab = document.getElementById("testStatesTab");

  if (testStatesPanelVisible) {
    // Hide panel, show tab
    panel.style.transform = "translateX(-100%)";
    tab.style.left = "0px";
    testStatesPanelVisible = false;
  } else {
    // Show panel, hide tab
    panel.style.transform = "translateX(0)";
    tab.style.left = "-90px";
    testStatesPanelVisible = true;
  }
}
