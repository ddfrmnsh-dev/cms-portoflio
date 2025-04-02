function excerptByWord(text, maxLength = 20) {
  if (text.length <= maxLength) return text;
  let words = text.split(" ");
  let result = "";

  for (let word of words) {
    if ((result + word).length > maxLength) break;
    result += (result ? " " : "") + word;
  }

  return result + "...";
}

export { excerptByWord };
