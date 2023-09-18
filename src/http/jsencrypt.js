import JSEncrypt from "jsencrypt";
import { parseBigInt } from "jsencrypt/lib/lib/jsbn/jsbn";
//私钥
let privateKey =
  "-----BEGIN RSA PRIVATE KEY-----MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBALwcyvYIGmhk+be320JWWsq1OYjiM0lzv8eHGMgSIOMLxzM/g9X7jguNe8thxJXR/CLqcTgsfZzk8E8Sc9+qnSDxNl5f5tga93vRxd5713zAeAGqLiTQnRffdzRmdbsmu5+0/K8mj056VhKh8FdBNzAj7e4iX9i+uBBG/oDmZbTVAgMBAAECgYEAmgNU5NTDkj9B+Pnt6UU8doSjw3+3j+bV2K2yS3QUOvAUus/Ax7x6ktjWxzCXvDY9IfUil2RNv9vtKEAqYLCWjc+lf8PV/yH1b7NEgyeAPBXtAJRoOnmYL2bdPW92kP9KgxJruF6Dz/C5AmMOncsvq8ABD+9Darn4p8dwj2ZC4O0CQQDf/AHmZsQokEItfCy4mHS9UbxbfIhEUv1ApPh/+Sr7NkJkHWYCtBQo+8jKO6zurAZQgWBPD1XX2UE4R+VIiZazAkEA1wAqtMvGhccyRZr+6kpkpDIa8+9jOE+nGUzqTDvgCID6as8AzOONFVVK6m/UUqkhcJ8Qu1pF36BGojy5BX2KVwJBAJSFpbji0hXXupowqfLp3RcgmNbNWAp+QUJZYhJx5cdYbmO2fssyH+AhPT6knYJR/YnqkDM8hv6vKCkqu2YDHjMCQAOA8TE5EOclM+CGghj3VWSHnIDVKdzFD4gOBNNxNlltIKeU8AJmwunSFgJ0CBXAw9a+ANvMwM7AIeaK7sj0HskCQAvxfDCq7gaNx+pfu0FHG8Gix08A/A6foggBl1fVu+L9sr9ZuOQ3HbXnl28F9ewuB9xdjnLUDjp7W7U0pB+vKoQ=-----END RSA PRIVATE KEY-----";
let publicKey =
  "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8HMr2CBpoZPm3t9tCVlrKtTmI4jNJc7/HhxjIEiDjC8czP4PV+44LjXvLYcSV0fwi6nE4LH2c5PBPEnPfqp0g8TZeX+bYGvd70cXee9d8wHgBqi4k0J0X33c0ZnW7JruftPyvJo9OelYSofBXQTcwI+3uIl/YvrgQRv6A5mW01QIDAQAB-----END PUBLIC KEY-----";
const encryptor = new JSEncrypt();

/**
 * 公钥--RSA加密
 * @param {*} word 需要加密的字符串
 * @param {*} publicKey 公钥
 * @returns
 */
export function rsa_encrypt(word) {
  // publicKey = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;
  encryptor.setPublicKey(publicKey);
  return encryptor.encrypt(word);
}

/**
 * RSA解密（私钥解密）
 * @param {*} word 需要解密的字符串
 * @param {*} privateKey 私钥
 * @returns
 */
export function rsa_decrypt(word) {
  encryptor.setPrivateKey(privateKey);
  return encryptor.decrypt(word);
}

/**
 * RSA解密（公钥解密）
 * @param {*} data 需要解密的字符串
 * @param {*} publicKey 公钥
 * @returns
 */
function decrypt(data, publicKey) {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  // 不支持公钥解密
  // 自定义解析方法支持公钥解析
  const rsaKey = encrypt.getKey();
  rsaKey.decrypt = function(ctext) {
    let c = parseBigInt(ctext, 16);
    let m = this.doPublic(c);
    if (m == null) {
      return null;
    }
    return pkcs1unpad2(m, (this.n.bitLength() + 7) >> 3);
  };
  return encrypt.decrypt(data);
}

function pkcs1unpad2(d, n) {
  let b = d.toByteArray();
  let i = 0;
  while (i < b.length && b[i] === 0) {
    ++i;
  }
  ++i;
  while (b[i] !== 0) {
    if (++i >= b.length) {
      return null;
    }
  }
  let ret = "";
  while (++i < b.length) {
    let c = b[i] & 255;
    if (c < 128) {
      // utf-8 decode
      ret += String.fromCharCode(c);
    } else if (c > 191 && c < 224) {
      ret += String.fromCharCode(((c & 31) << 6) | (b[i + 1] & 63));
      ++i;
    } else {
      ret += String.fromCharCode(
        ((c & 15) << 12) | ((b[i + 1] & 63) << 6) | (b[i + 2] & 63)
      );
      i += 2;
    }
  }
  return ret;
}

export default {
  rsa_encrypt: rsa_encrypt,
  rsa_decrypt: rsa_decrypt,
  decrypt: decrypt,
};
