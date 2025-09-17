/**
 * Section Manager Module
 * Utility functions for managing checkout sections
 */

export const SectionManager = {
  // Cache DOM queries for performance
  getSection: (sectionType) =>
    document.querySelector(`[data-editable-section="${sectionType}"]`),
    
  getSectionElement: (sectionType, selector) => {
    const section = SectionManager.getSection(sectionType);
    return section ? section.querySelector(selector) : null;
  },
  
  getSectionHeader: (sectionType) =>
    document.querySelector(`[data-section-header="${sectionType}"]`),
    
  getDisplayContent: (sectionType) =>
    document.querySelector(`[data-display-content="${sectionType}"]`),
    
  getEditForm: (sectionType) =>
    document.querySelector(`[data-edit-form="${sectionType}"]`),

  // Generic function to show section form
  showSectionForm: (sectionType) => {
    const editForm = SectionManager.getEditForm(sectionType);
    if (editForm) {
      editForm.classList.add("expanded");
    }
  },

  // Generic function to hide section form
  hideSectionForm: (sectionType) => {
    const editForm = SectionManager.getEditForm(sectionType);
    if (editForm) {
      editForm.classList.remove("expanded");
    }
  },

  // Generic function to show section summary
  showSectionSummary: (sectionType) => {
    const displayContent = SectionManager.getDisplayContent(sectionType);
    if (displayContent && sectionType !== "payment") {
      displayContent.classList.remove("hidden");
    }
  },

  // Generic function to hide section summary
  hideSectionSummary: (sectionType) => {
    const displayContent = SectionManager.getDisplayContent(sectionType);
    if (displayContent && sectionType !== "payment") {
      displayContent.classList.add("hidden");
    }
  },

  // Unified header management
  manageHeaders: (sectionType, action) => {
    const isPayment = sectionType === "payment";
    const paymentCardHeader = document.querySelector(
      ".p-chk-payment-card__header"
    );
    const sectionHeader = SectionManager.getSectionHeader(sectionType);

    if (action === "show-blue") {
      // Hide all blue headers first
      document.querySelectorAll("[data-section-header]").forEach((h) => {
        h.classList.remove("active");
        h.style.display = "none";
      });

      // Show specific blue header
      if (sectionHeader) {
        sectionHeader.classList.add("active");
        sectionHeader.style.display = "block";
      }

      // Payment header management
      if (isPayment && paymentCardHeader) {
        paymentCardHeader.classList.add("active");
        paymentCardHeader.style.display = "none";
      } else if (!isPayment && paymentCardHeader) {
        paymentCardHeader.classList.remove("active");
        paymentCardHeader.style.display = "block";
      }
    } else if (action === "hide-blue") {
      // Hide blue header
      if (sectionHeader) {
        sectionHeader.classList.remove("active");
        sectionHeader.style.display = "none";
      }

      // Show payment card header if completing payment
      if (isPayment && paymentCardHeader) {
        paymentCardHeader.style.display = "block";
      }
    }
  },

  // Unified border radius management
  manageBorderRadius: (sectionType, action) => {
    const section = SectionManager.getSection(sectionType);
    if (!section) return;

    const containers = [
      section.querySelector(".p-chk-info-card__container"),
      section.querySelector(".p-chk-payment-container"),
    ].filter(Boolean);

    containers.forEach((container) => {
      if (action === "remove-top") {
        container.classList.add("no-top-radius");
      } else if (action === "restore") {
        container.classList.remove("no-top-radius");
      }
    });
  },

  // Unified section state management
  setSectionState: (sectionType, isEditing) => {
    const section = SectionManager.getSection(sectionType);
    if (!section) return;

    // Section editing class
    section.classList.toggle("editing", isEditing);

    // Regular header editing class
    const regularHeader = section.querySelector(
      ".p-chk-contact-card__header, .p-chk-address-card__header, .p-chk-payment-card__header, .p-chk-info-card__header"
    );
    if (regularHeader) {
      regularHeader.classList.toggle("editing", isEditing);
    }

    // Display content visibility (except payment)
    if (sectionType !== "payment") {
      const displayContent = SectionManager.getDisplayContent(sectionType);
      if (displayContent) {
        displayContent.classList.toggle("hidden", isEditing);
      }
    }
  },
};

/**
 * Generic function to update edit button text based on content
 */
export function updateEditButtonText(sectionType, hasContent) {
  const editButton = document.getElementById(`${sectionType}EditButton`);
  if (editButton) {
    editButton.textContent = hasContent ? "Edit" : "Add";
    editButton.style.display = "block";
  }
}