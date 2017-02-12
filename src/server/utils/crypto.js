const CryptoJS = require('crypto-js');

function encryptToBase64(input) {
    let utf8 = CryptoJS.enc.Utf8.parse(input);
    let base64 = CryptoJS.enc.Base64.stringify(utf8);

    return base64;
}

function toSha1(string) {
    let sha1 = CryptoJS.SHA1(string).toString();

    return sha1;
}

function encodeURI(string) {
    return encodeURIComponent(string);
}

module.exports = {
    encryptToBase64,
    toSha1,
    encodeURI
};