/**
 * Contact Component Module
 * Handles contact section functionality
 */

import { updateEditButtonText } from "./sectionManager.js";

/**
 * Populate contact section with mock data
 */
export function populateContactData(contactData) {
  const contactSection = document.querySelector(
    '[data-editable-section="contact"]'
  );
  if (!contactSection) return;

  // Update display content
  const emailDisplay = contactSection.querySelector(
    ".p-chk-contact-card__email"
  );
  const jobDisplay = contactSection.querySelector(
    ".p-chk-contact-card__job-title"
  );

  if (emailDisplay) {
    emailDisplay.textContent = contactData.email || "";
  }
  if (jobDisplay) {
    jobDisplay.textContent = contactData.craft || "";
  }

  // Update form inputs
  const emailInput = contactSection.querySelector('input[type="email"]');
  const craftSelect = contactSection.querySelector("select");

  if (emailInput) {
    emailInput.value = contactData.email || "";
  }
  if (craftSelect && contactData.craft) {
    // Find the option that matches the craft
    const options = craftSelect.querySelectorAll("option");
    options.forEach((option) => {
      if (option.textContent.includes(contactData.craft)) {
        option.selected = true;
      }
    });
  }

  // Update button text based on content - check if contact has ANY data
  const hasContactContent =
    (contactData.email && contactData.email.trim()) ||
    (contactData.craft && contactData.craft.trim());
  updateEditButtonText("contact", hasContactContent);
}

/**
 * Update contact display from form data
 */
export function updateContactDisplay(sectionType) {
  if (sectionType !== "contact") return;

  const editForm = document.querySelector(`[data-edit-form="${sectionType}"]`);
  const displayContent = document.querySelector(
    `[data-display-content="${sectionType}"]`
  );

  if (!editForm || !displayContent) return;

  // Get form values
  const emailInput = editForm.querySelector('input[type="email"]');
  const craftSelect = editForm.querySelector("select");

  if (!emailInput || !craftSelect) return;

  const email = emailInput.value.trim();
  const craftIndex = craftSelect.selectedIndex;
  const craftText = craftIndex > 0 ? craftSelect.options[craftIndex].text : "";

  // Update display content
  const emailElement = displayContent.querySelector(
    ".p-chk-contact-card__email"
  );
  const jobElement = displayContent.querySelector(
    ".p-chk-contact-card__job-title"
  );

  if (emailElement && email) {
    emailElement.textContent = email;
  }

  if (jobElement && craftText) {
    jobElement.textContent = craftText;
  }

  // Update button text using generic function
  const hasContactContent = email || craftText;
  updateEditButtonText("contact", hasContactContent);
}
