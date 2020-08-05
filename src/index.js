const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const { Translate } = require('@google-cloud/translate').v2;
const translateClient = new Translate();

const knex = require('./database');
const auth = require('./auth-middleware');

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());

console.log('process.env.NODE_ENV =', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  console.log('Enabling CORS for development.');
  app.use(cors());
}

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

function noCache(req, res, next) {
  res.set('Vary', 'Authorization');
  res.set('Cache-Control', 'no-store');
  next();
}

// 単語一覧
app.get('/words', auth, noCache, async (req, res) => {
  const userId = req.userId;
  const words = await knex
    .select('*')
    .from('words')
    .where({ user_id: userId })
    .orderBy('id');

  res.json({ status: 'ok', data: [...words] });
});

// 単語追加
app.post('/words', auth, async (req, res) => {
  const userId = req.userId;
  const word = { ...req.body, done: 0, user_id: userId };
  if (word.id !== undefined && word.id !== 0) {
    res.status(400);
    res.json({ status: 'error', data: 'Invalid id' });
    return;
  }
  console.log(JSON.stringify(word));

  const ids = await knex('words').insert(word, ['id']);
  console.log({ ids });
  const savedRows = await knex.select('*').from('words').where({ id: ids[0] });

  res.json({ status: 'ok', data: savedRows[0] });
});

// 単語更新
app.put('/words/:id', auth, async (req, res) => {
  const userId = req.userId;
  const id = req.params.id | 0;
  const word = { ...req.body };
  if (id === undefined || id === 0 || id !== word.id) {
    res.status(400);
    res.json({ status: 'error', data: 'Invalid id' });
    return;
  }
  console.log(JSON.stringify(word));

  delete word.id;
  await knex('words').where({ id, user_id: userId }).update(word, ['id']);
  const savedRows = await knex.select('*').from('words').where({ id });
  res.json({ status: 'ok', data: savedRows[0] });
});

// 単語更新（doneフラグのみ）
app.put('/words/:id/done', auth, async (req, res) => {
  const userId = req.userId;
  const id = req.params.id | 0;
  const word = { ...req.body };
  if (id === undefined || id === 0 || id !== word.id) {
    res.status(400);
    res.json({ status: 'error', data: 'Invalid id' });
    return;
  }
  console.log(JSON.stringify(word));

  await knex('words')
    .where({ id, user_id: userId })
    .update({ done: word.done }, ['id']);
  const savedRows = await knex.select('*').from('words').where({ id });
  res.json({ status: 'ok', data: savedRows[0] });
});

// 単語削除
app.delete('/words/:id', auth, async (req, res) => {
  const userId = req.userId;
  const id = req.params.id | 0;
  const rows = await knex('words').where({ id, user_id: userId }).del();
  console.log({ rows });
  res.json({ status: 'ok', data: { deletedRows: rows } });
});

// 3ヶ国語自動翻訳
app.get('/translate/:from/:word', auth, async (req, res) => {
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

  res.json({ status: 'ok', data });
});
