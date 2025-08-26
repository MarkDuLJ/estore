export const isPasswordValid = async (password: string, hashedPassword: string) => {
    const hashedInput = await hashPassword(password)
    return hashedInput === hashedPassword
}

export const hashPassword = async (password:string) => {
    const arrBuf = await crypto.subtle.digest("SHA-512",new TextEncoder().encode(password))
    return Buffer.from(arrBuf).toString("base64")
}