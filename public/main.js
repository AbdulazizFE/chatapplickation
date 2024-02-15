$(function () {
    const socket = io();

    // Check if the user's name is stored in local storage
    const storedName = localStorage.getItem("userName");

    if (!storedName) {
      // Use window.alert to prompt the user to enter their name
      const name = prompt("Enter Your Name:");

      // Store the user's name in local storage
      localStorage.setItem("userName", name);

      // Inform the server about the user's name
      socket.emit("user connected", { name });
    } else {
      // If the name is stored, directly show the chat input
      $("#m").prop("disabled", false);
    }

    // Load previous messages from localStorage
    const storedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    for (const message of storedMessages) {
      displayMessage(message);
    }

    // Listen for messages
    socket.on("chat message", (data) => {
      // Display name, message, and timestamp
      displayMessage(data);

      // Save the message in localStorage
      const storedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
      storedMessages.push(data);
      localStorage.setItem("chatMessages", JSON.stringify(storedMessages));
    });

    // Submit form to send a message
    $("form").submit(function () {
      const message = $("#m").val();

      // Get the current timestamp on the client side
      const timestamp = new Date().toLocaleTimeString();

      // Get the user's name from local storage
      const name = localStorage.getItem("userName");

      // Emit a message with both name, message, and timestamp
      socket.emit("chat message", { name, message, timestamp });

      // Clear input field
      $("#m").val("");

      return false;
    });

    // Function to display a message on the page
    function displayMessage(data) {
      $("#messages").append(
        $("<li>").html(
          `<i class="bi bi-person-fill"></i> <strong>${data.name} <br/></strong><span class="timestamp"><i class="bi bi-clock"></i> ${data.timestamp}</span> | ${data.message} `
        )
      );
    }
  });