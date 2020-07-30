/* 
Parcelでasync/awaitを使うためには、package.jsonに
  "browserslist": ["since 2017-06"]
を追記する必要があるので注意。
*/

const config = {
  API_URL: process.env.WORDS_API_URL || 'http://localhost:8080',
};

async function executeApi(path, method = 'get', body = undefined) {
  const response = await fetch(`${config.API_URL}${path}`, {
    method,
    mode: 'cors',
    cache: 'no-cache',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: body ? JSON.stringify(body) : undefined,
  });
  const result = await response.json();
  return result;
}

export async function getWords() {
  const result = await executeApi('/words');
  if (result.status !== 'ok') {
    throw new Error(`${result.status} ${result.data}`);
  }
  return result.data;
}

export function validate(word) {
  if (!word.ja && !word.en && !word.es && !word.fr) {
    return '何らかの単語・文を入力してください。';
  }
}

export async function saveWord(word) {
  const err = validate(word);
  if (err) throw new Error(err);

  const path = word.id ? `/words/${word.id}` : '/words';
  const body = { ...word };
  const result = await executeApi(path, word.id ? 'put' : 'post', body);
  if (result.status !== 'ok') {
    throw new Error(`${result.status} ${result.data}`);
  }
  return result.data;
}

export async function updateDone(word) {
  const path = `/words/${word.id}/done`;
  const body = { id: word.id, done: word.done };
  console.log({ path, body });
  const result = await executeApi(path, 'put', body);
  if (result.status !== 'ok') {
    throw new Error(`${result.status} ${result.data}`);
  }
  return result.data;
}

export async function deleteWord(id) {
  const path = `/words/${id}`;
  const result = await executeApi(path, 'delete');
  if (result.status !== 'ok') {
    throw new Error(`${result.status} ${result.data}`);
  }
  return result.data;
}

export async function translate(from, word) {
  if (!word) return { status: 'ok', data: {} };
  const path = `/translate/${from}/${encodeURIComponent(word)}`;
  const result = await executeApi(path);
  if (result.status !== 'ok') {
    throw new Error(`${result.status} ${result.data}`);
  }
  return result.data;
}
