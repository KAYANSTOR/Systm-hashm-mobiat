const fs = require('fs');
let code = fs.readFileSync('src/firebase.ts', 'utf8');

code = code.replace(/export const db = initializeFirestore\(app, \{\n  localCache: persistentLocalCache\(\{ tabManager: persistentMultipleTabManager\(\) \}\)\n\}, firebaseConfig\.firestoreDatabaseId\);/, 
  `export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  experimentalForceLongPolling: true
}, firebaseConfig.firestoreDatabaseId);`);

fs.writeFileSync('src/firebase.ts', code);
console.log('Firebase patched with experimentalForceLongPolling');
