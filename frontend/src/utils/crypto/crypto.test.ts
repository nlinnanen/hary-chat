/* import { generateAndStoreKeys, getKeys } from "./keys";
import { decryptMessage, encryptMessage} from "./messages";

interface Keys {
  privateKey: string;
  publicKey: string;
};

import FDBFactory from 'fake-indexeddb/lib/FDBFactory';
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
global.indexedDB = new FDBFactory();

describe("Encryption module", () => {
  let keys: Keys;
  
  beforeAll(async () => {
    await generateAndStoreKeys();
    keys = await getKeys();
  });

  it("generates keys", () => {
    expect(keys).toHaveProperty("privateKey");
    expect(keys).toHaveProperty("publicKey");
  });

  it("encrypts and decrypts messages", async () => {
    const originalMessage = "Hello, World!";

    // Encrypt the message
    const encryptedMessage = await encryptMessage(keys.publicKey);
    expect(encryptedMessage).toBeDefined();

    // Decrypt the message
    const decryptedMessage = await decryptMessage(
      encryptedMessage,
      keys.privateKey
    );
    expect(decryptedMessage).toEqual(originalMessage);
  });
});
 */

export {};