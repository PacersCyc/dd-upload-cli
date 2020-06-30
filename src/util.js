const atob = require('atob')
const btoa = require('btoa')

// 密码加密
const Base64 = {
  encode(str) {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
        return String.fromCharCode(Number(`0x${p1}`));
      }),
    );
  },
  decode(str) {
    return decodeURIComponent(
      atob(str)
        .split('')
        .map(function (c) {
          return `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`;
        })
        .join(''),
    );
  },
}

module.exports = {
  Base64
}