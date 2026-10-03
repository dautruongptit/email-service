import { createHash, randomBytes } from 'crypto';

// Generate a new API key and its SHA-256 hash
// Usage: npx tsx src/scripts/gen-key.ts [client-name]

const clientName = process.argv[2] ?? 'default';
const apiKey = `esk_${clientName}_${randomBytes(24).toString('hex')}`;
const hash = createHash('sha256').update(apiKey).digest('hex');

console.log('');
console.log(`Client:  ${clientName}`);
console.log(`API Key: ${apiKey}`);
console.log(`Hash:    ${hash}`);
console.log('');
console.log('Save the API Key somewhere safe (shown only once).');
console.log('Put the Hash in API_CLIENTS config as "keyHash".');
console.log('');
