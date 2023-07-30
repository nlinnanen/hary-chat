import {
  createMessage,
  decrypt,
  decryptKey,
  encrypt,
  readKey,
  readMessage,
  readPrivateKey
} from "openpgp";
import { getPrivateKey } from "./keys";

export async function encryptMessage(text: string, publicKeys: string[]) {
  const encryptedText = await encrypt({
    message: await createMessage({ text }),
    encryptionKeys: await Promise.all(publicKeys.map(pk => readKey({ armoredKey: pk }))),
  });
  
  return encryptedText;
}

export async function decryptMessage(
  encrypted: string,
  conversationId: number | null = null,
  paramPrivateKey: string | null = null
) {
  if(!conversationId && !paramPrivateKey) throw new Error('Either conversationId or paramPrivateKey must be provided');
  let privateKeyArmored = paramPrivateKey || '';
  if (conversationId) privateKeyArmored = await getPrivateKey(conversationId);

  const privateKey = await decryptKey({
    privateKey: await readPrivateKey({ armoredKey: privateKeyArmored }),
    // TODO get passphrase from user
    passphrase: "super secure passphrase",
  });

  const message = await readMessage({
    armoredMessage: encrypted,
  });
  const { data } = await decrypt({
    message,
    decryptionKeys: privateKey,
  });

  return data;
}
