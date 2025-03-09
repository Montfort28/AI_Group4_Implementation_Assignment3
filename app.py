from flask import Flask, render_template, request
import chatbot  # Import the chatbot logic

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get")
def get_bot_response():
    user_input = request.args.get('msg')
    response = chatbot.get_response(user_input)
    chatbot.chat_history.append({"user": user_input, "bot": response})
    return response

@app.route("/clear")
def clear_history():
    chatbot.chat_history.clear()
    return "History cleared"

if __name__ == "__main__":
    app.run(debug=True)