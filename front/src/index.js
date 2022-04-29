const express = require("express");
const process = require("process");
const app = express();
const port = process.env.PORT ?? 3602;

app.set("view engine", "ejs");

app.use("/static", express.static("public"));

app.get("/", (req, res) => {
    res.redirect("/level");
});

app.get("/level", (req, res) => {
    res.render("level");
});

app.get("/rank", (req, res) => {
    res.render("rank");
});

app.get("/check", (req, res) => {
    res.render("check");
});

app.listen(port, () => {
    console.log(`express running on port ${port}`);
});
