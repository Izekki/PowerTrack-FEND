export const darkenHex = (color, amount = 20) => {
  if (color.startsWith("hsl")) {
    const [h, s, l] = color.match(/\d+/g).map(Number);
    const newLightness = Math.max(l - amount, 0);
    return `hsl(${h}, ${s}%, ${newLightness}%)`;
  }

  let num = parseInt(color.replace("#", ""), 16);
  let r = (num >> 16) - amount;
  let g = ((num >> 8) & 0x00FF) - amount;
  let b = (num & 0x0000FF) - amount;

  r = Math.max(r, 0);
  g = Math.max(g, 0);
  b = Math.max(b, 0);

  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};
