const app = require("./app");

const port = process.env.PORT || 3000;

app.get("*", (req, res) => {
  res.render("error", {
    title: "404",
    errorMessage: "Page not found.",
  });
});

app.listen(port, () => {
  console.log("listening on *:3000");
});
