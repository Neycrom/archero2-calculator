const formatEuro = val => `€${val.toFixed(2)}`;

function createItemRow() {
  const template = document.getElementById('item-row-template');
  const clone = template.content.cloneNode(true);
  const select = clone.querySelector('.item-select');
  const qtyInput = clone.querySelector('.item-qty');
  const totalDiv = clone.querySelector('.item-total');

  for (let key in itemBaseValues) {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = itemIcons[key] || key;
    select.appendChild(option);
  }

  function updateTotal() {
    const qty = parseFloat(qtyInput.value) || 0;
    const val = itemBaseValues[select.value] || 0;
    const total = qty * val;
    totalDiv.textContent = formatEuro(total);
  }

  select.addEventListener('change', updateTotal);
  qtyInput.addEventListener('input', updateTotal);
  updateTotal();

  document.getElementById('item-list').appendChild(clone);
}

function evaluateOffer() {
  const rows = document.querySelectorAll('.item-row');
  let totalValue = 0;

  rows.forEach(row => {
    const select = row.querySelector('.item-select');
    const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
    const unit = itemBaseValues[select.value] || 0;
    totalValue += qty * unit;
  });

  const offerPrice = parseFloat(document.getElementById('offer-price').value) || 0;
  const resultDiv = document.getElementById('result');

  if (offerPrice <= 0 || totalValue <= 0) {
    resultDiv.innerHTML = '<span class="verdict bad">Please enter at least one item and a valid offer price.</span>';
    return;
  }

  const ratio = totalValue / offerPrice;
  const percentage = ratio * 100;

  let verdictText = '';
  let verdictClass = '';

  if (ratio >= 2.5) {
    verdictText = 'Amazing Deal!';
    verdictClass = 'amazing';
  } else if (ratio >= 1.5) {
    verdictText = 'Good Deal';
    verdictClass = 'good';
  } else if (ratio >= 1.0) {
    verdictText = 'Meh';
    verdictClass = 'meh';
  } else {
    verdictText = 'Bad Deal';
    verdictClass = 'bad';
  }

  resultDiv.innerHTML = `
    <strong>Total Estimated Value:</strong> ${formatEuro(totalValue)}<br />
    <strong>Value Ratio:</strong> ${ratio.toFixed(2)}x (${percentage.toFixed(0)}%)<br />
    <strong class="verdict ${verdictClass}">${verdictText}</strong>
  `;
}

document.getElementById('add-item').addEventListener('click', createItemRow);
document.getElementById('evaluate-offer').addEventListener('click', evaluateOffer);

window.onload = () => createItemRow();
