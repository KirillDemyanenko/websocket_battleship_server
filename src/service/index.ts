export function showMessage(mes, col?) {
  let color;
  switch (col) {
    case 'green':
      color = 32;
      break;
    case 'red':
      color = 31;
      break;
    case 'yellow':
      color = 33;
      break;
    case 'blue':
      color = 34;
      break;
    default:
      color = 37;
      break;
  }
  console.log(`\x1b[${color}m >>> ${mes} <<< \x1b[0m`);
}
