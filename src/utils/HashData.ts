import bcrypt = require("bcrypt");
export async function hashData(password: string) {
    const salt = parseInt(process.env.SALT);
    const hashData = await bcrypt.hash(password, salt);
    return hashData;
}
