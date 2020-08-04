const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = process.env.GOOGLE_CLIENTID;
const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userId = payload['sub'];
    return userId;
  } catch (error) {
    console.log(error);
    return null;
  }
}

function sendAuthError(res) {
  res.status(401);
  res.send('Auth error');
}

async function auth(req, res, next) {
  const authHeader = req.get('Authorization');
  if (!authHeader) return sendAuthError(res);

  const idToken = authHeader.split(' ')[1];
  if (!idToken) return sendAuthError(res);

  const userId = await verify(idToken);
  if (!userId) return sendAuthError(res);

  req.userId = userId;
  next();
}

module.exports = auth;
