export default function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('KeyDatabase', 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore('keys');
      db.createObjectStore('hary');
    };

    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onerror = (event: Event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

export async function clearDatabase(dbKey: string) {
  const db = await openDatabase();
  const tx = db.transaction(dbKey, 'readwrite');
  const store = tx.objectStore(dbKey);
  
  store.clear().onsuccess = () => {
    console.log('Database successfully cleared');
  };
}
