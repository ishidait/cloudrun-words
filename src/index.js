const path = require('path');
const express = require('express');
const app = express();

const { Translate } = require('@google-cloud/translate').v2;
const translateClient = new Translate();

const knex = require('./database');

app.use(express.static(path.join(__dirname, '../public')));

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

// 単語一覧
app.get('/words', async (req, res) => {
  const words = await knex.select('*').from('words').orderBy('id');
  res.json({ status: 'ok', data: [...words] });
});

// 単語追加
app.post('/words', async (req, res) => {
  res.json({ status: 'ok', data: [] });
});

// 単語更新
app.put('/words/:id', async (req, res) => {
  res.json({ status: 'ok', data: [] });
});

// 単語更新（doneフラグのみ）
app.put('/words/:id/done', async (req, res) => {
  res.json({ status: 'ok', data: [] });
});

// 単語削除
app.delete('/words/:id', async (req, res) => {
  res.json({ status: 'ok', data: [] });
});

// 3ヶ国語自動翻訳
app.get('/translate/:from/:word', async (req, res) => {
  const langs = ['ja', 'en', 'es', 'fr'];
  const data = {
    [req.params.from]: req.params.word,
  };

  for (const lang of langs) {
    if (lang === req.params.from) continue;

    const result = await translateClient.translate(req.params.word, {
      from: data.from,
      to: lang,
    });
    data[lang] = result[0];
  }

  res.json(data);
});
