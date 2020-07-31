/* 
Parcelでasync/awaitを使うためには、package.jsonに
  "browserslist": ["since 2017-06"]
を追記する必要があるので注意。
*/

const config = {
  API_URL: process.env.WORDS_API_URL || 'http://localhost:8080',
};

async function executeApi(path, { method = 'get', body, idToken }) {
  const response = await fetch(`${config.API_URL}${path}`, {
    method,
    mode: 'cors',
    cache: 'no-cache',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    }),
    body: body ? JSON.stringify(body) : undefined,
  });
  const result = await response.json();
  return result;
}

export async function getWords(idToken) {
  const result = await executeApi('/words', { idToken });
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

export async function saveWord(idToken, word) {
  const err = validate(word);
  if (err) throw new Error(err);

  const path = word.id ? `/words/${word.id}` : '/words';
  const body = { ...word };
  const result = await executeApi(path, {
    method: word.id ? 'put' : 'post',
    idToken,
    body,
  });
  if (result.status !== 'ok') {
    throw new Error(`${result.status} ${result.data}`);
  }
  return result.data;
}

export async function updateDone(idToken, word) {
  const path = `/words/${word.id}/done`;
  const body = { id: word.id, done: word.done };
  console.log({ path, body });
  const result = await executeApi(path, { method: 'put', idToken, body });
  if (result.status !== 'ok') {
    throw new Error(`${result.status} ${result.data}`);
  }
  return result.data;
}

export async function deleteWord(idToken, id) {
  const path = `/words/${id}`;
  const result = await executeApi(path, { method: 'delete', idToken });
  if (result.status !== 'ok') {
    throw new Error(`${result.status} ${result.data}`);
  }
  return result.data;
}

export async function translate(idToken, from, word) {
  if (!word) return { status: 'ok', data: {} };
  const path = `/translate/${from}/${encodeURIComponent(word)}`;
  const result = await executeApi(path, { idToken });
  if (result.status !== 'ok') {
    throw new Error(`${result.status} ${result.data}`);
  }
  return result.data;
}
