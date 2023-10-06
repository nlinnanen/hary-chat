import { generateKey } from "openpgp";
import openDatabase from "../indexed_db";

export async function storeKey(dataBaseKey: string, privateKeyArmored: string) {
  // Step 2: Prepare these keys for storage
  const privateKeyData = new TextEncoder().encode(privateKeyArmored);

  // Step 3: Store these keys in IndexedDB
  const db = await openDatabase();
  const tx = db.transaction("keys", "readwrite");
  tx.objectStore("keys").put(privateKeyData, dataBaseKey);
  tx.commit();
}

export async function deleteKey(dataBaseKey: string) {
  const db = await openDatabase();
  const tx = db.transaction("keys", "readwrite");
  tx.objectStore("keys").delete(dataBaseKey);
  tx.commit();
}

export async function getPrivateKey(dataBaseKey: string): Promise<string> {
  const db = await openDatabase();
  const tx = db.transaction("keys", "readonly");
  const store = tx.objectStore("keys");
  const privateKeyRequest = store.get(dataBaseKey);

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

export async function getAllConversationIds(): Promise<string[]> {
  const db = await openDatabase();
  const tx = db.transaction("keys", "readonly");
  const store = tx.objectStore("keys");
  const cursorRequest = store.openCursor();

  return new Promise((resolve, reject) => {
    const conversationIds: string[] = [];

    cursorRequest.onsuccess = (event: Event) => {
      const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
      if (cursor) {
        const value = cursor.key as string;
        if (value !== "hary") conversationIds.push(value);
        cursor.continue(); // Move to the next record
      } else {
        resolve(conversationIds); // Cursor has reached the end, return the public keys
      }
    };

    cursorRequest.onerror = (event: Event) => {
      reject((event.target as IDBRequest).error);
    };
  });
}

export async function generateKeys(passphrase: string) {
  const { privateKey, publicKey } = await generateKey({
    curve: "ed25519",
    userIDs: [{ name: "", email: "" }],
    passphrase,
    format: "armored",
  });
  return { privateKey, publicKey };
}
