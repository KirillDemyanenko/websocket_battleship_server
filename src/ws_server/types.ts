export type WSRequest = {
    type: "reg",
    data: string,
    id: number,
}

export type UserLogin = {
    name: string,
    password: string,
}

export type UserLoginResponse = {
    name: string,
    index: number,
    error: boolean,
    errorText: string,
}
