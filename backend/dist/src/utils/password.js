import bcrypt from 'bcryptjs';
const SALT_ROUNDS = 10;
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
};
export const comparePassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};
//# sourceMappingURL=password.js.map