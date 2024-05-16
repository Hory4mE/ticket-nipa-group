import bcrypt = require("bcrypt");
export async function hashData(password: string) {
    const salt = process.env.SALT;
    const hashData = bcrypt.hash(password, salt)
    return hashData;
}