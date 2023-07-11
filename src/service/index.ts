import {Colors} from "../ws_server/constants.js";

export function showMessage(mes: string, col?: Colors): void {
  let color;
  switch (col) {
    case Colors.green:
      color = 32;
      break;
    case Colors.red:
      color = 31;
      break;
    case Colors.yellow:
      color = 33;
      break;
    case Colors.blue:
      color = 34;
      break;
    default:
      color = 37;
      break;
  }
  console.log(`\x1b[${color}m >>> ${mes} <<< \x1b[0m`);
}
