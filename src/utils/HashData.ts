import bcrypt = require("bcrypt");
export async function hashData(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashData = bcrypt.hash(password, salt)
    return hashData;
}