const fs = require('fs');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');

const password = "paglu pandey";
const map = {};

// Target categories of images
const prefixes = ['child', 'sort', 'teen', 'now', 'collage'];

// Find and rename files
for (const prefix of prefixes) {
    for (let i = 1; i <= 15; i++) { // generous upper bound
        const oldName = `${prefix}${i}.jpg`;
        if (fs.existsSync(oldName)) {
            const newName = `mem_${crypto.randomBytes(4).toString('hex')}.jpg`;
            fs.renameSync(oldName, newName);
            map[oldName] = newName; // e.g. "child1.jpg" -> "mem_1234abcd.jpg"
            console.log(`Renamed ${oldName} to ${newName}`);
        }
    }
}

// Convert map to string and encrypt
const jsonString = JSON.stringify(map);
const encrypted = CryptoJS.AES.encrypt(jsonString, password).toString();

fs.writeFileSync('encrypted_map.txt', encrypted);
console.log("Encryption complete. Payload saved to encrypted_map.txt");
