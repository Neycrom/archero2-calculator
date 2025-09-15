function formatEuro(value) {
  return "€" + value.toFixed(2);
}

function createItemRow() {
  const template = document.getElementById('item-row-template');
  const clone = template.content.cloneNode(true);
  const select = clone.querySelector('.item-select');
  const qtyInput = clone.querySelector('.item-qty');
  const totalDiv = clone.querySelector('.item-total');

  for (let key in itemBaseValues) {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = itemIcons[key];
    select.appendChild(option);
  }

  function updateTotal() {
    const qty = parseFloat(qtyInput.value) || 0;
    const value = itemBaseValues[select.value] || 0;
    const total = qty * value;
    totalDiv.textContent = formatEuro(total);
  }

  select.addEventListener('change', updateTotal);
  qtyInput.addEventListener('input', updateTotal);
  updateTotal();

  document.getElementById('item-list').appendChild(clone);
}

document.getElementById('add-item').addEventListener('click', createItemRow);

document.getElementById('evaluate-offer').addEventListener('click', function () {
  const rows = document.querySelectorAll('.item-row');
  let totalValue = 0;

  rows.forEach(row => {
    const select = row.querySelector('.item-select');
    const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
    const unitValue = itemBaseValues[select.value] || 0;
    totalValue += qty * unitValue;
  });

  const offerPrice = parseFloat(document.getElementById('offer-price').value) || 0;
  const ratio = offerPrice > 0 ? totalValue / offerPrice : 0;

  let verdict = '';
  if (ratio >= 2.5) verdict = '🟢 Amazing Deal!';
  else if (ratio >= 1.5) verdict = '🟡 Good Deal';
  else if (ratio >= 1.0) verdict = '🟠 Meh';
  else verdict = '🔴 Bad Deal';

  document.getElementById('result').innerHTML = `
    <strong>Total Estimated Value:</strong> €${totalValue.toFixed(2)}<br />
    <strong>Value Ratio:</strong> ${ratio.toFixed(2)}x<br />
    <strong>Verdict:</strong> ${verdict}
  `;
});

// Create first row on load
window.onload = createItemRow;