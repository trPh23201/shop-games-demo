import { e_above, rsaKeyP, rsaKeyQ } from "./key";

export function gcd(a, b) {
    if (a == 0)
        return b;
    return gcd(b % a, a);
}

export function gcdExtended(e, phi) {
    var r, q, y0 = 0, y1 = 1, y, phiTemp = phi, rs = 0;
    while (r !== 0) {
        r = phiTemp % e;
        q = Math.floor(phiTemp / e)
        y = y0 - q * y1;
        while (y < 0) {
            y += phi
        }
        if (r == 0) rs = y1;
        phiTemp = e;
        e = r;
        y0 = y1;
        y1 = y
    }
    return rs;
}

export function generateEncryptionExponent(phi) {
    let e = e_above;
    while (gcd(e, phi) !== 1) {
        e += 1;
    }
    return e;
}

export function computeDecryptionExponent(e, phi) {
    let d = gcdExtended(e, phi);
    return d;
}

//Modular Exponentiation (x^y mod p)
export function power(x, y, p) {
    let res = 1;
    x = x % p;

    if (x == 0)
        return 0;

    while (y > 0) {
        if (y & 1) res = (res * x) % p;
        y = y >> 1;
        x = (x * x) % p;
    }
    return res;
}

export function encrypt(m, publicKey) {
    const { e, n } = publicKey;
    const c = power(m, e, n); //m^e mod n
    return c;
}

export function decrypt(c, secretKey) {
    const { d, n } = secretKey;
    const m = power(c, d, n);
    return m;
}

const p = rsaKeyP;
const q = rsaKeyQ;
const n = p * q;
const phi = (p - 1) * (q - 1);
const e = generateEncryptionExponent(phi);
const d = computeDecryptionExponent(e, phi);
const publicKey = { e, n };
const secretKey = { d, n };

export function rsaEncrypt(plainText) {
    var asciiArray = [];
    var cipherText = "";
    for (var i = 0; i < plainText.length; i++) {
        asciiArray.push(plainText.charCodeAt(i))
    }
    asciiArray.forEach(val => {
        const c = encrypt(val, publicKey);
        cipherText = cipherText + c + " ";
    })
    return cipherText.slice(0, -1);
}

export function rsaDecrypt(cipherText) {
    var plainText = "";
    cipherText.split(" ").forEach(val =>{
        const plainAscii = decrypt(val, secretKey);
        plainText += String.fromCharCode(plainAscii);
    })
    return plainText;
}