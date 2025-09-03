// script.js
document.addEventListener("DOMContentLoaded", function () {
  console.log("Page loaded, initializing forms...");

  // Server URL - change this if your server runs on different port
  const SERVER_URL = "http://127.0.0.1:3000";

  // Utility function to show messages
  function showMessage(form, message, type = "error") {
    // Remove existing messages
    const existingMessage = form.querySelector(".message");
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    // Insert at the beginning of the form
    form.insertBefore(messageDiv, form.firstChild);

    // Remove message after 5 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove();
      }
    }, 5000);
  }

  // Utility function to toggle loading state
  function setLoading(form, isLoading) {
    if (isLoading) {
      form.classList.add("loading");
    } else {
      form.classList.remove("loading");
    }
  }

  // Handle First Form (Hello World card)
  const firstForm = document.querySelector(".card form");
  if (firstForm) {
    firstForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = firstForm.querySelector('input[name="email"]').value;
      const password = firstForm.querySelector('input[name="password"]').value;

      console.log("Hello World form submitted:", { email, password });
      showMessage(
        firstForm,
        "Hello World form submitted successfully!",
        "success"
      );
    });
  }

  // Handle Login Form
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = document.getElementById("login-username").value;
      const password = document.getElementById("login-password").value;

      console.log("Login attempt:", { email });
      setLoading(loginForm, true);

      try {
        const response = await fetch(`${SERVER_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: email,
            password: password,
          }),
        });

        const data = await response.json();
        console.log("Login response:", data);

        if (response.ok) {
          showMessage(loginForm, "Login successful! Redirecting...", "success");

          // Store token if provided
          if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username || email);
          }

          // Redirect after short delay
          setTimeout(() => {
            window.location.href = "logged/logged.html";
          }, 1500);
        } else {
          showMessage(loginForm, data.message || "Login failed");
        }
      } catch (error) {
        console.error("Login error:", error);
        showMessage(
          loginForm,
          "Connection error. Please check if the server is running."
        );
      } finally {
        setLoading(loginForm, false);
      }
    });
  }

  // Handle Register Form
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const username = document.getElementById("register-username").value;
      const password = document.getElementById("register-password").value;

      // Basic validation
      if (username.length < 3) {
        showMessage(
          registerForm,
          "Username must be at least 3 characters long"
        );
        return;
      }

      if (password.length < 6) {
        showMessage(
          registerForm,
          "Password must be at least 6 characters long"
        );
        return;
      }

      console.log("Registration attempt:", { username });
      setLoading(registerForm, true);

      try {
        const response = await fetch(`${SERVER_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });

        const data = await response.json();
        console.log("Registration response:", data);

        if (response.ok) {
          showMessage(
            registerForm,
            "Registration successful! You can now login.",
            "success"
          );
          registerForm.reset();
        } else {
          showMessage(registerForm, data.message || "Registration failed");
        }
      } catch (error) {
        console.error("Registration error:", error);
        showMessage(
          registerForm,
          "Connection error. Please check if the server is running."
        );
      } finally {
        setLoading(registerForm, false);
      }
    });
  }

  console.log("All forms initialized successfully");
});
