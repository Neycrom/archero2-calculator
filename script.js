document.getElementById('offer-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const gems = Number(document.getElementById('gems').value);
  const gold = Number(document.getElementById('gold').value);
  const scrolls = Number(document.getElementById('scrolls').value);
  const price = Number(document.getElementById('price').value);

  const value =
    gems * itemBaseValues.gems +
    gold * itemBaseValues.gold +
    scrolls * itemBaseValues.scrolls;

  const ratio = value / price;
  const resultBox = document.getElementById('result');

  let rating = '';
  if (ratio >= 2.5) {
    rating = '🟢 Amazing Deal!';
  } else if (ratio >= 1.5) {
    rating = '🟡 Good Deal';
  } else if (ratio >= 1.0) {
    rating = '🟠 Meh';
  } else {
    rating = '🔴 Bad Deal';
  }

  resultBox.innerHTML = `
    <strong>Total Estimated Value:</strong> €${value.toFixed(2)}<br />
    <strong>Value Ratio:</strong> ${ratio.toFixed(2)}x<br />
    <strong>Verdict:</strong> ${rating}
  `;
});