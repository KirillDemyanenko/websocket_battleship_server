import {users} from "./db.js";

export function checkUserExist (name: string) {
    return users.filter(user => user.name === name).length > 0;
}

export function getUserID (name: string) {
    return users.findIndex(user => user.name === name);
}
