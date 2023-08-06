import { generateKey } from "openpgp";
import openDatabase from "../indexed_db";

export function getCredentialOptions(user = "Hary bot user") {
  return {
    challenge: Uint8Array.from("super secret passphrase", (c) => c.charCodeAt(0)),
    rp: {
      name: "Hary bot",
    },
    user: {
      id: Uint8Array.from(user, (c) => c.charCodeAt(0)),
      name: user,
      displayName: user,
    },
    pubKeyCredParams: [
      {
        alg: -7,
        type: "public-key",
      },
      {
        alg: -8,
        type: "public-key",
      },
      {
        alg: -257,
        type: "public-key",
      },
    ],
    timeout: 60000,
  } as PublicKeyCredentialRequestOptions | PublicKeyCredentialCreationOptions
}


export async function storeKey(dataBaseKey: string, privateKeyArmored: string) {
  // Step 2: Prepare these keys for storage
  const privateKeyData = new TextEncoder().encode(privateKeyArmored);

  // Step 3: Store these keys in IndexedDB
  const db = await openDatabase();
  const tx = db.transaction("keys", "readwrite");
  tx.objectStore("keys").put(privateKeyData, dataBaseKey);
  tx.commit();
}

let userId: string | undefined;
export async function getUserId(user = "Hary bot user") {
  if (userId) return userId;
  const credential = await navigator.credentials.get({
    publicKey: getCredentialOptions(user) as PublicKeyCredentialRequestOptions,
  });

  userId = credential?.id!;
  return credential?.id!;
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

export async function createUserId(user = "Hary bot user") {
  const credential = await navigator.credentials.create({
    publicKey: getCredentialOptions(user) as PublicKeyCredentialCreationOptions,
  });

  userId = credential?.id!;
  return credential?.id!;
}

export async function generateKeys() {

  const userId = await getUserId();
  
  const { privateKey, publicKey } = await generateKey({
    curve: "ed25519",
    userIDs: [{ name: "", email: "" }],
    passphrase: userId,
    format: "armored",
  });
  return { privateKey, publicKey };
}
