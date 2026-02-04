
function sanitize(input) {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

document.getElementById("feedbackForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission
    const name = sanitize(document.getElementById("name").value.trim());
    const email = sanitize(document.getElementById("email").value.trim());
    const message = sanitize(document.getElementById("message").value.trim());
     if (name === "" || email === "" || message === "") {
        alert("All fields are required");
        return;
    }

    if (!email.includes("@")) {
        alert("Please enter a valid email");
        return;
    }

    let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

feedbacks.push({
    name: name,
    email: email,
    message: message,
    date: new Date().toLocaleString()
});

localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

alert("Feedback submitted successfully!");

});
function displayFeedback() {
    const container = document.getElementById("feedbackList");
    if (!container) return;

    const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

    feedbacks.forEach(function (item) {
        const card = document.createElement("div");

        card.style.border = "1px solid #ccc";
        card.style.padding = "10px";
        card.style.marginBottom = "10px";

        const name = document.createElement("h4");
        name.textContent = item.name;

        const email = document.createElement("p");
        email.textContent = item.email;

        const message = document.createElement("p");
        message.textContent = item.message;

        const date = document.createElement("small");
        date.textContent = item.date;

        card.appendChild(name);
        card.appendChild(email);
        card.appendChild(message);
        card.appendChild(date);

        container.appendChild(card);
    });
}

displayFeedback();
