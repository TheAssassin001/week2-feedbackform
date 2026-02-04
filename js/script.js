// ===========================
// UTILITY FUNCTIONS
// ===========================

/**
 * Sanitizes user input by escaping < and > characters to prevent XSS attacks.
 * @param {string} input - The user input to sanitize
 * @returns {string} - The sanitized input
 */
function sanitize(input) {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Validates email format using a simple check for @ symbol.
 * @param {string} email - The email to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
function isValidEmail(email) {
    return email.includes("@") && email.includes(".");
}

/**
 * Clears all error messages from the form.
 */
function clearErrors() {
    const errorElements = document.querySelectorAll(".error-message");
    errorElements.forEach(function(el) {
        el.classList.remove("show");
        el.textContent = "";
    });
    
    const inputElements = document.querySelectorAll("input, textarea");
    inputElements.forEach(function(el) {
        el.classList.remove("error");
    });
}

/**
 * Shows an error message for a specific field.
 * @param {string} fieldId - The ID of the input field
 * @param {string} message - The error message to display
 */
function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + "Error");
    const inputElement = document.getElementById(fieldId);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add("show");
    }
    
    if (inputElement) {
        inputElement.classList.add("error");
    }
}

// ===========================
// FORM HANDLING (index.html)
// ===========================

const feedbackForm = document.getElementById("feedbackForm");
if (feedbackForm) {
    feedbackForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent default form submission
        
        clearErrors();
        
        // Get and trim input values
        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const messageInput = document.getElementById("message");
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();
        
        // Validation
        let isValid = true;
        
        if (name === "") {
            showError("name", "Name is required");
            isValid = false;
        }
        
        if (email === "") {
            showError("email", "Email is required");
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError("email", "Please enter a valid email address");
            isValid = false;
        }
        
        if (message === "") {
            showError("message", "Message is required");
            isValid = false;
        }
        
        if (!isValid) {
            return;
        }
        
        // Sanitize inputs before storing
        const sanitizedName = sanitize(name);
        const sanitizedEmail = sanitize(email);
        const sanitizedMessage = sanitize(message);
        
        // Get existing feedback from localStorage
        let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
        
        // Create feedback object with timestamp
        const feedbackObject = {
            name: sanitizedName,
            email: sanitizedEmail,
            message: sanitizedMessage,
            date: new Date().toLocaleString()
        };
        
        // Add new feedback to array
        feedbacks.push(feedbackObject);
        
        // Store updated array in localStorage
        localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
        
        // Clear form
        feedbackForm.reset();
        
        // Show success message
        const successMessage = document.getElementById("successMessage");
        if (successMessage) {
            successMessage.style.display = "block";
            setTimeout(function() {
                successMessage.style.display = "none";
            }, 3000);
        }
    });
}

// ===========================
// FEEDBACK DISPLAY (feedback.html)
// ===========================

// Pagination variables
let currentPage = 1;
const itemsPerPage = 5;
let totalFeedbacks = [];

/**
 * Displays feedback for the current page with pagination.
 */
function displayFeedback() {
    const container = document.getElementById("feedbackList");
    const emptyMessage = document.getElementById("emptyMessage");
    const paginationControls = document.getElementById("paginationControls");
    
    // Exit if this page doesn't have a feedback list
    if (!container) return;
    
    // Get feedback from localStorage
    totalFeedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    
    // Clear the container
    container.innerHTML = "";
    
    // Show/hide empty message
    if (totalFeedbacks.length === 0) {
        emptyMessage.style.display = "block";
        if (paginationControls) {
            paginationControls.style.display = "none";
        }
        return;
    } else {
        emptyMessage.style.display = "none";
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedFeedbacks = totalFeedbacks.slice(startIndex, endIndex);
    
    // Display feedback cards for current page
    paginatedFeedbacks.forEach(function(item) {
        const card = document.createElement("div");
        card.className = "feedback-card";
        
        // Create header with name and date
        const header = document.createElement("div");
        header.className = "feedback-header";
        
        const nameElement = document.createElement("h3");
        nameElement.className = "feedback-name";
        nameElement.textContent = item.name;  // Using textContent for XSS prevention
        
        const dateElement = document.createElement("span");
        dateElement.className = "feedback-date";
        dateElement.textContent = item.date;
        
        header.appendChild(nameElement);
        header.appendChild(dateElement);
        
        // Create email element
        const emailElement = document.createElement("p");
        emailElement.className = "feedback-email";
        emailElement.textContent = item.email;  // Using textContent for XSS prevention
        
        // Create message element
        const messageElement = document.createElement("p");
        messageElement.className = "feedback-message";
        messageElement.textContent = item.message;  // Using textContent for XSS prevention
        
        // Append all elements to card
        card.appendChild(header);
        card.appendChild(emailElement);
        card.appendChild(messageElement);
        
        // Append card to container
        container.appendChild(card);
    });
    
    // Update pagination controls
    updatePaginationControls();
}

/**
 * Updates pagination buttons and page info display.
 */
function updatePaginationControls() {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const pageInfo = document.getElementById("pageInfo");
    const paginationControls = document.getElementById("paginationControls");
    
    if (!prevBtn || !nextBtn || !pageInfo) return;
    
    // Calculate total pages
    const totalPages = Math.ceil(totalFeedbacks.length / itemsPerPage);
    
    // Show/hide pagination controls
    if (totalFeedbacks.length > itemsPerPage) {
        paginationControls.style.display = "flex";
    } else {
        paginationControls.style.display = "none";
        return;
    }
    
    // Update page info
    pageInfo.textContent = "Page " + currentPage + " of " + totalPages;
    
    // Disable/enable Previous button
    prevBtn.disabled = currentPage === 1;
    
    // Disable/enable Next button
    nextBtn.disabled = currentPage === totalPages;
}

/**
 * Goes to the previous page of feedback.
 */
function goToPreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayFeedback();
        window.scrollTo(0, 0);  // Scroll to top
    }
}

/**
 * Goes to the next page of feedback.
 */
function goToNextPage() {
    const totalPages = Math.ceil(totalFeedbacks.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayFeedback();
        window.scrollTo(0, 0);  // Scroll to top
    }
}

// Add event listeners for pagination buttons
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

if (prevBtn) {
    prevBtn.addEventListener("click", goToPreviousPage);
}

if (nextBtn) {
    nextBtn.addEventListener("click", goToNextPage);
}

// Initial display on page load
if (document.getElementById("feedbackList")) {
    displayFeedback();
}
