const fs = require("fs");
const initSqlJs = require("sql.js");
const http = require("http");

// Load the SQL file
const fileBuffer = fs.readFileSync("restaurant_db");

// Initialize the SQL.js library
initSqlJs().then(SQL => {
    // Load the database
    const db = new SQL.Database(fileBuffer);

    function getDishes() {
        const query = "SELECT * FROM dishes";
        const results = db.exec(query);

        if (results.length === 0) return [];

        const columns = results[0].columns;
        const values = results[0].values;

        return values.map(row => {
            const obj = {};
            columns.forEach((col, index) => {
                obj[col] = row[index];
            });
            return obj;
        });
    }

    function addDishes(dish) {
        const query = `INSERT INTO dishes (name, price, description, category) VALUES ('${dish.name}', ${dish.price}, '${dish.description}', '${dish.category}')`;
        db.run(query);
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync("restaurant_db", buffer);
    }

    function getReservations() {
        const query = "SELECT * FROM Reservations";
        const results = db.exec(query);

        if (results.length === 0) return [];

        const columns = results[0].columns;
        const values = results[0].values;

        return values.map(row => {
            const obj = {};
            columns.forEach((col, index) => {
                obj[col] = row[index];
            });
            return obj;
        });
    }

    function addReservations(reservation) {
        const query = `INSERT INTO Reservations (Name, Email, PhoneNumber, ReservationDate, ReservationHour, NumberOfPeople) VALUES ('${reservation.name}', '${reservation.email}', '${reservation.phone}', '${reservation.date}', '${reservation.time}', ${reservation.people})`;
        db.run(query);
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync("restaurant_db", buffer);
    }

    function confirmReservation(reservationId) {
        const query = `UPDATE Reservations SET Confirmed = 1 WHERE ID = ${reservationId}`;
        db.run(query);
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync("restaurant_db", buffer);
    }


    // Create an HTTP server
    http.createServer((req, res) => {
        if (req.url === "/dishes" && req.method === "GET") {
            const dishes = getDishes();
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(dishes));
        } else if (req.url === "/dishes" && req.method === "POST") {
            let body = "";
            req.on("data", chunk => {
                body += chunk.toString();
            });

            req.on("end", () => {
                const dish = JSON.parse(body);
                addDishes(dish);
                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify(dish));
            });
        } else if ((req.url === "/index.html" || req.url === "/") && req.method === "GET") {
            const html = fs.readFileSync("./static/index.html", "utf8");
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        } else if (req.url === "/menu.html" && req.method === "GET") {
            const html = fs.readFileSync("./static/menu.html", "utf8");
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        } else if (req.url === "/contact.html" && req.method === "GET") {
            const html = fs.readFileSync("./static/contact.html", "utf8");
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        } else if (req.url === "/admin" && req.method === "GET") {
            const html = fs.readFileSync("./static/admin/index.html", "utf8");
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        } else if (req.url === "/book.html" && req.method === "GET") {
            const html = fs.readFileSync("./static/book.html", "utf8");
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        } else if (req.url === "/style.css" && req.method === "GET") {
            const css = fs.readFileSync("./static/styles/style.css", "utf8");
            res.writeHead(200, { "Content-Type": "text/css" });
            res.end(css);
        } else if (req.url === "/LOGO-UNIWROC.png" && req.method === "GET") {
            const img = fs.readFileSync("./static/img/LOGO-UNIWROC.png");
            res.writeHead(200, { "Content-Type": "image/png" });
            res.end(img);
        } else if (req.url === "/PizzaBG.png" && req.method === "GET") {
            const img = fs.readFileSync("./static/img/PizzaBG.png");
            res.writeHead(200, { "Content-Type": "image/png" });
            res.end(img);
        } else if (req.url === "/reservations" && req.method === "POST") {
            let body = "";
            req.on("data", chunk => {
                body += chunk.toString();
            });

            req.on("end", () => {
                const reservation = JSON.parse(body);
                addReservations(reservation);
                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify(reservation));
            });
        } else if (req.url === "/reservations" && req.method === "GET") {
            const reservations = getReservations();
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(reservations));
        } else if (req.url.startsWith("/reservations/") && req.url.endsWith("/confirm") && req.method === "POST") {
            const reservationId = req.url.split("/")[2];
            confirmReservation(reservationId);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Reservation confirmed" }));
        } else if (req.url === "/admin.css" && req.method === "GET") {
            const css = fs.readFileSync("./static/styles/admin.css", "utf8");
            res.writeHead(200, { "Content-Type": "text/css" });
            res.end(css);
        }
        else {
            const html = fs.readFileSync("./static/404.html", "utf8");
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end(html);
        }
    }).listen(3000, () => console.log("Server running on http://localhost:3000"));
}).catch(err => {
    console.error("Failed to initialize SQL.js:", err);
});