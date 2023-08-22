import {
  createCleartextMessage,
  createMessage,
  decrypt,
  decryptKey,
  encrypt,
  readCleartextMessage,
  readKey,
  readMessage,
  readPrivateKey,
  sign,
  verify,
} from "openpgp";
import { getPrivateKey, getUserId } from "./keys";

export async function encryptText(
  text: string,
  publicKeys: string[],
  dataBaseKey: string,
  deviceId: string
) {
  console.log("encrypting ", deviceId)
  const message = await createCleartextMessage({ text });
  const privateKeyString = await getPrivateKey(dataBaseKey);
  const privateKey = await decryptKey({
    privateKey: await readPrivateKey({ armoredKey: privateKeyString }),
    passphrase: deviceId,
  });
  const signedMessage = await sign({
    message,
    signingKeys: privateKey,
  });
  const encryptedText = await encrypt({
    message: await createMessage({ text: signedMessage }),
    encryptionKeys: await Promise.all(
      publicKeys.map((pk) => readKey({ armoredKey: pk }))
    ),
  });

  return encryptedText;
}

export async function decryptText(
  encrypted: string,
  dataBaseKey: string,
  publicKey: string,
  deviceId: string
) {
  const privateKeyArmored = await getPrivateKey(dataBaseKey);
  const privateKey = await decryptKey({
    privateKey: await readPrivateKey({ armoredKey: privateKeyArmored }),
    passphrase: deviceId,
  });

  const message = await readMessage({
    armoredMessage: encrypted,
  });
  const { data } = await decrypt({
    message,
    decryptionKeys: privateKey,
  });
  const verification = await verify({
    message: await createCleartextMessage({ text: data }),
    verificationKeys: await readKey({ armoredKey: publicKey }),
  });

  try {
    await Promise.all(verification.signatures.map((s) => s.verified))
    const clearTextMessage = await readCleartextMessage({cleartextMessage: verification.data})
    return clearTextMessage.getText();
  } catch (error) {
    console.error(error);
  } 
}
