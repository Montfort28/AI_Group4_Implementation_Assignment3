import json

# Load dataset
with open('dataset.json', 'r') as f:
    dataset = json.load(f)

# Initialize chat history and appointments
chat_history = []
appointments = []

def get_response(user_input):
    user_input_lower = user_input.lower()

    if user_input_lower == "hello" or user_input_lower == "hi":
        return "Hello, type 'list symptoms' to see available symptoms."

    elif user_input_lower == "list symptoms":
        all_symptoms = []
        for symptoms in dataset.values():
            if isinstance(symptoms, list):
                all_symptoms.extend(symptoms)
        return ", ".join(sorted(set(all_symptoms)))

    elif user_input_lower in [key.lower() for key in dataset]:
        for key in dataset:
            if key.lower() == user_input_lower:
                return f"Symptoms of {key} include: {', '.join(dataset[key])}."

    elif "symptoms of" in user_input_lower:
        disease = user_input_lower.split("symptoms of ")[1].strip()
        if disease.lower() in [key.lower() for key in dataset]:
            for key in dataset:
                if key.lower() == disease.lower():
                    return f"Symptoms of {key} include: {', '.join(dataset[key])}."
        else:
            return f"I don't have information about the symptoms of {disease}."

    elif "treat" in user_input_lower:
        disease = user_input_lower.split("treat ")[1].strip()
        if "General Questions" in dataset and f"How do I treat a {disease}?" in dataset["General Questions"]:
            return dataset["General Questions"][f"How do I treat a {disease}?"]
        elif user_input_lower == "how do i treat a headache":
            return "To treat a headache, try over-the-counter pain relievers or rest in a quiet, dark room. You can also apply a cold compress to your forehead. If pain persists, consult a doctor."
        else:
            return f"I don't have specific treatment information for {disease}."

    elif user_input_lower.startswith("book appointment:"):
        try:
            appointment_details = user_input_lower[len("book appointment:"):].strip().split(",")
            name = appointment_details[0].strip()
            date = appointment_details[1].strip()
            time = appointment_details[2].strip()
            appointments.append({"name": name, "date": date, "time": time})
            return f"Appointment booked for {name} on {date} at {time}."
        except Exception as e:
            return "Invalid appointment format. Please use: Name, Date, Time."

    elif user_input_lower == "list appointments":
        try:
            return json.dumps(appointments)
        except Exception as e:
            return "Error listing appointments."

    elif user_input_lower == "clear":
        chat_history.clear()
        appointments.clear()
        return "Chat history and appointments cleared."

    elif user_input_lower in dataset.get("General Questions", {}):
        return dataset["General Questions"][user_input_lower]

    elif user_input_lower == "what are the symptoms of a cold" or user_input_lower == "what are the symptoms of a cold?":
        return "Symptoms of a cold include runny nose, sneezing, and a mild cough."

    elif user_input_lower == "help" or user_input_lower == "assist me" or user_input_lower == "assistance":
        return "I can help you with early disease diagnosis information. Here are some examples of what you can ask:\n\n" \
               "- 'list symptoms' (to see available symptoms)\n" \
               "- 'What are the symptoms of a cold?'\n" \
               "- 'headache' (to get a diagnosis if it's a symptom)\n" \
               "- 'flu' (to see the symptoms of the flu)\n" \
               "- 'help' (to see this message again)"

    elif user_input_lower == "flu":
        return f"Symptoms of flu include: {', '.join(dataset['Flu'])}."

    else:
        all_symptoms = []
        for symptoms in dataset.values():
            if isinstance(symptoms, list):
                all_symptoms.extend(symptoms)

        if user_input_lower in all_symptoms:
            for disease, symptoms_list in dataset.items():
                if isinstance(symptoms_list, list) and user_input_lower in symptoms_list:
                    return f"Diagnosis: {disease} - {', '.join(symptoms_list)}."

        #Enhanced responses
        if "fever" in user_input_lower:
            return "A fever is a temporary increase in your body temperature, often due to an illness. It's a sign that your body is fighting off an infection."
        if "headache" in user_input_lower:
            return "Headaches can be caused by various factors, including stress, dehydration, or underlying medical conditions. Over-the-counter pain relievers and rest can often help."
        if "cough" in user_input_lower:
            return "A cough is a reflex action to clear your airways of irritants, mucus, or foreign particles. It can be caused by infections, allergies, or other respiratory conditions."
        if "fatigue" in user_input_lower:
            return "Fatigue is a feeling of tiredness or lack of energy. It can be caused by various factors, including stress, lack of sleep, or underlying medical conditions."
        if "dehydration" in user_input_lower:
            return "Dehydration occurs when your body loses more fluid than it takes in. Symptoms include dizziness, dry mouth, and dark urine. Drink plenty of water to rehydrate."

        return "I'm sorry, I don't understand. Please check the list of available symptoms by typing 'list symptoms' or use the keyword 'help' for assistance."