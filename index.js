const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});

app.get('/hello', async (req, res) => {
  const word = req.query.w;
  res.send(escaptHtml(`Hello, you entered ${word}!`));
});

function escaptHtml(str) {
  const tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
  };
  return str.replace(/[&<>]/g, (tag) => tagsToReplace[tag] || tag);
}
