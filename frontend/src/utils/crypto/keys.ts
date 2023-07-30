import { generateKey } from "openpgp";
import openDatabase from "../indexed_db";

export async function storeKeys(conversationId: number, privateKeyArmored: string) {
    // Step 2: Prepare these keys for storage
    const privateKeyData = new TextEncoder().encode(privateKeyArmored);

    // Step 3: Store these keys in IndexedDB
    const db = await openDatabase();
    const tx = db.transaction("keys", "readwrite");
    console.log("Generating keys");
    tx.objectStore("keys").put(privateKeyData, conversationId);
  
    console.log("Keys stored successfully");
}

export async function getPrivateKey(conversationId: number): Promise<string> {
  const db = await openDatabase();
  const tx = db.transaction("keys", "readonly");
  const store = tx.objectStore("keys");
  const privateKeyRequest = store.get(conversationId);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      try {
        const privateKey = new TextDecoder().decode(
          privateKeyRequest.result as BufferSource
        );
        resolve(privateKey);
      } catch (error) {
        reject(error);
      }
    };

    tx.onerror = (event) => {
      reject((event.target as IDBRequest).error);
    };
  });
}

export async function getAllConversationIds(): Promise<number[]> {
  const db = await openDatabase();
  const tx = db.transaction("keys", "readonly");
  const store = tx.objectStore("keys");
  const cursorRequest = store.openCursor();

  return new Promise((resolve, reject) => {
    const publicKeys: number[] = [];

    cursorRequest.onsuccess = (event: Event) => {
      const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
      if (cursor) {
        const publicKey =  parseInt(cursor.key as string) as number;
        publicKeys.push(publicKey);
        cursor.continue(); // Move to the next record
      } else {
        resolve(publicKeys); // Cursor has reached the end, return the public keys
      }
    };

    cursorRequest.onerror = (event: Event) => {
      reject((event.target as IDBRequest).error);
    };
  });
}

export async function getHaryKeys(): Promise<{privateKey: string, publicKey: string}> {
  const db = await openDatabase();
  const tx = db.transaction("hary", "readonly");
  const store = tx.objectStore("hary");
  const publicKeyRequest = store.get('public');
  const privateKeyRequest = store.get('private');

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      try {
        const publicKey = new TextDecoder().decode(
          publicKeyRequest.result as BufferSource
        );
        const privateKey = new TextDecoder().decode(
          privateKeyRequest.result as BufferSource
        );

        resolve({publicKey, privateKey});
      } catch (error) {
        reject(error);
      }
    };

    tx.onerror = (event) => {
      reject((event.target as IDBRequest).error);
    };
  });
}

export async function generateAndStoreHaryKeys() {
  // Step 1: Generate an OpenPGP key pair
  const { privateKey: privateKeyArmored, publicKey: publicKeyArmored } =
    await generateKeys();

  // Step 2: Prepare these keys for storage
  const privateKeyData = new TextEncoder().encode(privateKeyArmored);
  const publicKeyData = new TextEncoder().encode(publicKeyArmored);

  // Step 3: Store these keys in IndexedDB
  const db = await openDatabase();
  const tx = db.transaction("hary", "readwrite");
  console.log("Generating keys");
  tx.objectStore("hary").put(privateKeyData, 'private');
  tx.objectStore("hary").put(publicKeyData, 'public');
  tx.commit();

  console.log("Keys stored successfully");

  return publicKeyArmored; // returning publicKey as conversationId
}

export async function generateKeys() {
  const { privateKey, publicKey } = await generateKey({
    curve: "ed25519",
    userIDs: [{ name: "Jon Smith", email: "test@test.com" }],
    passphrase: "super secure passphrase",
    format: "armored",
  });
  return { privateKey, publicKey };
}
