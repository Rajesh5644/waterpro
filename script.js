document.addEventListener("DOMContentLoaded", function () {
    function saveUser(data) {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        users.push(data);
        localStorage.setItem("users", JSON.stringify(users));
    }

    // Signup Logic
    document.getElementById("signup-form")?.addEventListener("submit", function (event) {
        event.preventDefault();
        const user = {
            name: document.getElementById("signup-name").value,
            email: document.getElementById("signup-email").value,
            password: document.getElementById("signup-password").value,
            role: document.getElementById("signup-role").value,
        };
        saveUser(user);
        alert("Signup successful! Please login.");
        window.location.href = "login.html";
    });

    // Login Logic
    document.getElementById("login-form")?.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid credentials.");
        }
    });

    // Order Submission Logic
    document.getElementById("water-order-form")?.addEventListener("submit", function (event) {
        event.preventDefault();
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (!user) {
            alert("Please login first!");
            window.location.href = "login.html";
            return;
        }

        const quantity = parseInt(document.getElementById("quantity").value, 10);
        if (quantity < 5) {
            alert("Minimum order quantity is 5 liters.");
            return;
        }

        const order = {
            orderId: Date.now(),
            name: document.getElementById("name").value,
            address: document.getElementById("address").value,
            quantity: quantity,
            date: new Date().toLocaleString(),
            email: user.email
        };

        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));

        alert("Order placed successfully!");
        window.location.href = "dashboard.html";
    });

    // Load Dashboard
    window.loadDashboard = function () {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (!user) {
            window.location.href = "login.html";
            return;
        }

        document.getElementById("welcome-message").innerText = `Welcome, ${user.name}!`;

        // Load Order History
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        const userOrders = orders.filter(order => order.email === user.email);
        const orderHistoryBody = document.getElementById("order-history-body");
        orderHistoryBody.innerHTML = "";

        userOrders.forEach(order => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${order.orderId}</td>
                <td>${order.address}</td>
                <td>${order.quantity} liters</td>
                <td>${order.date}</td>
            `;
            orderHistoryBody.appendChild(row);
        });
    };

    // Logout
    window.logout = function () {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    };

    // Prevent Unauthorized Access
    window.checkAuth = function () {
        if (!localStorage.getItem("currentUser")) window.location.href = "login.html";
    };
});
