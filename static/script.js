const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const chatSection = document.getElementById("chat-section");
const featureContent = document.getElementById("feature-content");
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const appointmentSection = document.getElementById("appointment-section");
const appointmentName = document.getElementById("appointment-name");
const appointmentDate = document.getElementById("appointment-date");
const appointmentTime = document.getElementById("appointment-time");
const bookAppointmentButton = document.getElementById("book-appointment-button");
const appointmentsList = document.getElementById("appointments-list");

themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    themeToggle.innerHTML = body.classList.contains("dark-mode") ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

let questions = [];

function sendMessage(buttonData) {
    let message = userInput.value.trim();
    if (buttonData) {
        message = buttonData;
    }
    if (!message) return;

    chatBox.innerHTML += `<p><i class="fas fa-user"></i> <strong>You:</strong> ${message}</p>`;
    userInput.value = "";

    fetch(`/get?msg=${encodeURIComponent(message)}`)
        .then(response => response.text())
        .then(data => {
            chatBox.innerHTML += `<p><i class="fas fa-robot"></i> <strong>Bot:</strong> ${data}</p>`;
            chatBox.scrollTop = chatBox.scrollHeight;
            // questions.push({ question: message, answer: data });
            // updateQuestionsList();
        })
        .catch(error => {
            console.error('Error:', error);
            chatBox.innerHTML += `<p><i class="fas fa-exclamation-triangle"></i> <strong>Bot:</strong> Sorry, there was an error processing your request.</p>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        });
}

userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendMessage();
        event.preventDefault();
    }
});

function showChat() {
    chatSection.style.display = "flex";
    featureContent.style.display = "none";
    appointmentSection.style.display = "none";
    document.getElementById("questions-list").style.display = "none";
}

function showSymptoms() {
    fetch("/get?msg=list%20symptoms")
        .then(response => response.text())
        .then(data => {
            const symptoms = data.split(', ');
            let buttonsHTML = '<h2>Available Symptoms</h2>';
            symptoms.forEach(symptom => {
                buttonsHTML += `<button class="symptom-button">${symptom}</button>`;
            });
            featureContent.innerHTML = buttonsHTML;
            chatSection.style.display = "none";
            featureContent.style.display = "block";
            appointmentSection.style.display = "none";
            document.getElementById("questions-list").style.display = "none";
        });
}

function showArticles() {
    featureContent.innerHTML = `
        <h2>Health Articles</h2>
        <p><a href="https://www.who.int/news-room/fact-sheets/detail/coronavirus-disease-(covid-19)" target="_blank">COVID-19 Facts</a></p>
        <p><a href="https://www.cdc.gov/flu/symptoms/index.html" target="_blank">Flu Symptoms</a></p>
        <p><a href="https://www.mayoclinic.org/diseases-conditions/common-cold/symptoms-causes/syc-20351605" target="_blank">Common Cold</a></p>
        <p><a href="https://www.mayoclinic.org/diseases-conditions/headaches/symptoms-causes/syc-20373685" target="_blank">Headaches</a></p>
    `;
    chatSection.style.display = "none";
    featureContent.style.display = "block";
    appointmentSection.style.display = "none";
    document.getElementById("questions-list").style.display = "none";
}

function showContacts() {
    featureContent.innerHTML = `
        <h2>Emergency Contacts</h2>
        <p>Emergency: 911</p>
        <p>National Health Hotline: 123-456-7890</p>
        <p>Local Hospital: 987-654-3210</p>
    `;
    chatSection.style.display = "none";
    featureContent.style.display = "block";
    appointmentSection.style.display = "none";
    document.getElementById("questions-list").style.display = "none";
}

function clearHistory() {
    fetch("/clear")
        .then(() => {
            chatBox.innerHTML = `<p><i class="fas fa-robot"></i> <strong>Bot:</strong> Welcome to Health Companion! I can help you with early disease diagnosis information. Type 'list symptoms' to see what symptoms I can check.</p>`;
            questions = [];
            updateQuestionsHistoryList();
        });

}

function updateQuestionsList() {
    const questionsList = document.getElementById("questions-list");
    questionsList.innerHTML = "";
    questions.forEach((item, index) => {
        const questionButton = document.createElement("button");
        questionButton.classList.add("question-button");
        questionButton.textContent = item.question;
        questionButton.onclick = () => displayAnswer(index);
        questionsList.appendChild(questionButton);
    });
}

function displayAnswer(index) {
    const answer = questions[index].answer;
    chatBox.innerHTML = `<p><i class="fas fa-robot"></i> <strong>Bot:</strong> ${answer}</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;
    showChat();
}

function showQuestions() {
    chatSection.style.display = "none";
    featureContent.style.display = "none";
    appointmentSection.style.display = "none";
    document.getElementById("questions-list").style.display = "block";
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('symptom-button')) {
        const symptom = event.target.textContent;
        fetch(`/get?msg=${encodeURIComponent(symptom)}&symptom_checker=true`)
            .then(response => response.text())
            .then(data => {
                featureContent.innerHTML = `<h2>Diagnosis</h2><p>${data}</p>`;
                chatSection.style.display = "none";
                featureContent.style.display = "block";
                appointmentSection.style.display = "none";
            });
    }
});

function showAppointments() {
    chatSection.style.display = "none";
    featureContent.style.display = "none";
    appointmentSection.style.display = "block";
    document.getElementById("questions-list").style.display = "none";
    updateAppointmentsList();
}

bookAppointmentButton.addEventListener("click", () => {
    const name = appointmentName.value;
    const date = appointmentDate.value;
    const time = appointmentTime.value;
    const appointmentString = `Book appointment: ${name}, ${date}, ${time}`;

    fetch(`/get?msg=${encodeURIComponent(appointmentString)}`)
        .then(response => response.text())
        .then(data => {
            appointmentName.value = "";
            appointmentDate.value = "";
            appointmentTime.value = "";
            updateAppointmentsList();
        });
});

function updateAppointmentsList() {
    appointmentsList.innerHTML = "";
    fetch("/get?msg=list appointments")
        .then(response => response.text())
        .then(data => {
            try {
                const appointments = JSON.parse(data);
                appointments.forEach(appointment => {
                    const listItem = document.createElement("li");
                    listItem.textContent = `${appointment.name} - ${appointment.date} ${appointment.time}`;
                    appointmentsList.appendChild(listItem);
                });
            } catch (e) {
                console.log("no appointments");
            }
        });
}


window.onload = function() {
    chatBox.innerHTML = `<p><i class="fas fa-robot"></i> <strong>Bot:</strong> Welcome to Health Companion! I can help you with early disease diagnosis information. Type 'list symptoms' to see what symptoms I can check.</p>`;
};