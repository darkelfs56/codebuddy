export function getWebviewContent(apiKey: string) {
  return `
      <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css" />
    <style>
      #chat-container {
        width: 100%;
        max-width: 600px;

        display: flex;
        flex-direction: column;
        border-radius: 10px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      #chat-title {
        padding: 10px;
        font-weight: bold;
        background-color: #000000;
        color: #ffffff;
        font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana,
          sans-serif;
      }

      #chat-messages {
        height: 500px;
        overflow-y: scroll;
        padding: 10px;
        background-color: #fafafa;
        max-width: 100%;
      }

      .chat-message-container {
        margin-bottom: 10px;
      }

      .chat-message-header {
        font-weight: bold;
      }

      .chat-message-body {
        margin-top: 5px;
      }

      #chat-input-container {
        display: flex;
        align-items: center;
        padding-top: 10px;
        width: 100%;
      }

      #chat-input {
        flex: 1;
        padding: 35px;
        background-color: #0b0b0b;
        color: #fff;
        border: none;
      }

      #chat-send {
        margin-top: 10px;
        padding: 15px;
        border: none;
        background-color: #000;
        color: #fff;
        border-radius: 6px;
        cursor: pointer;
        width: 100%;
      }

      #loading {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.7);
        z-index: 9999;
      }

      .spinner {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 5px solid #ccc;
        border-top-color: #666;
        animation: spin 1s infinite linear;
        margin: 0 auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .message {
        position: absolute;
        top: 60%;
        left: 50%;
        transform: translateX(-50%);
        font-size: 16px;
        color: #666;
      }

      .loader {
        position: relative;
        background-color: rgb(235, 235, 235);
        max-width: 100%;
        height: auto;
        background: #efefee;
        overflow: hidden;
        border-radius: 4px;
        margin-bottom: 4px;
      }

      .loader::after {
        display: block;
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        transform: translateX(-100%);
        background: linear-gradient(90deg, transparent, #f1f1f1, transparent);
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        animation: loading 1s infinite;
      }

      @keyframes loading {
        100% {
          transform: translateX(100%);
        }
      }

      body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        padding: 0;
      }
    </style>
    <title>AI</title>
  </head>

  <body>
    <div id="chat-container">
      <div id="chat-title">ChatBuddy (Ola)</div>
      <div id="chat-messages"></div>
      <div id="chat-input-container">
        <input id="chat-input" type="text" placeholder="Ask me to explain, debug, or optimize your code" />
      </div>
      <button id="chat-send">Send</button>
    </div>
    <div id="loading">
      <div class="loader"></div>
      <div class="loader"></div>
    </div>
    <script>
      const cache = {};

      const OPENAI_API_KEY = "";
      const OPENAI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

      const chatContainer = document.getElementById("chat-container");
      const chatMessages = document.getElementById("chat-messages");
      const chatInput = document.getElementById("chat-input");
      const chatSendButton = document.getElementById("chat-send");

      let chatVisible = false;

      chatInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          const userInput = chatInput.value.trim();
          if (userInput) {
            addChatMessage("You", userInput);
            sendChatMessage(userInput);
            chatInput.value = "";
          }
        }
      });

      chatSendButton.addEventListener("click", () => {
        const userInput = chatInput.value.trim();
        if (userInput) {
          addChatMessage("You", userInput);
          sendChatMessage(userInput);
          chatInput.value = "";
        }
      });

      function addChatMessage(sender, message) {
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("chat-message-container");
        const messageHeader = document.createElement("div");
        messageHeader.classList.add("chat-message-header");
        messageHeader.textContent = sender + ":";
        const messageBody = document.createElement("div");
        messageBody.classList.add("chat-message-body");
        messageBody.textContent = message;
        messageContainer.appendChild(messageHeader);
        messageContainer.appendChild(messageBody);
        chatMessages.appendChild(messageContainer);
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }

      function sendChatMessage(message) {
        const loadingElement = document.getElementById("loading");
        loadingElement.style.display = "block";

        const apiKey = ${apiKey};
        const endpoint =
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey;

        const requestData = {
          contents: [
            {
              role: "user",
              parts: [{ text: "Pretend you're a snowman and stay in character for each" }],
            },
            {
              role: "model",
              parts: [{ text: "Hello! It's so cold! Isn't that great?" }],
            },
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
        };

        fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to generate content");
            }
            loadingElement.style.display = "none";
            return response.body;
          })
          .then(async (body) => {
            const reader = body.getReader();
            const decoder = new TextDecoder("utf-8");
            let botResponse = "";

            while (true) {
              const { value, done } = await reader.read();
              if (done) break;
              const decodedValue = decoder.decode(value);
              try {
                const responseObj = JSON.parse(decodedValue);
                const textResponse = responseObj.candidates[0].content.parts[0].text;
                botResponse += textResponse;
                addChatMessage("bot", textResponse);
              } catch (error) {
                console.error(error);
                addChatMessage("Chat IA", "Sorry, I was unable to process your request.");
                loadingElement.style.display = "none";
              }
            }
          });
      }
    </script>
  </body>
</html>

  `;
}

export function generateResponse(userInput: string): string {
  // Implement your logic to generate a response based on the user input
  // You can use an AI language model or API here
  return `You said: ${userInput}`;
}
