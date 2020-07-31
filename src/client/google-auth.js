/* eslint-disable no-undef */

const config = {
  clientId: process.env.GOOGLE_CLIENTID,
  scope: 'profile email',
};

export function init(onInit) {
  if (!gapi) {
    throw new Error('Google API SDK is not loaded.');
  }

  gapi.load('client:auth2', async () => {
    try {
      await gapi.client.init(config);
      const user = gapi.auth2.getAuthInstance().currentUser.get();
      onInit(user);
    } catch (error) {
      onInit(null, error);
    }
  });
}

export async function signIn() {
  return gapi.auth2.getAuthInstance().signIn();
}

export async function signOut() {
  return gapi.auth2.getAuthInstance().signOut();
}
