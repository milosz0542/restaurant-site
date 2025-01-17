const fs = require("fs");
const initSqlJs = require("sql.js");
const http = require("http");

// Load the SQL file
const fileBuffer = fs.readFileSync("menu_db");

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
        fs.writeFileSync("menu_db", buffer);
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