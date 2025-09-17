const formatEuro = val => `€${val.toFixed(2)}`;

function createItemRow() {
  const template = document.getElementById('item-row-template');
  const clone = template.content.cloneNode(true);
  const row = clone.querySelector('.item-row');
  const customSelect = row.querySelector('.custom-select');
  const selectedOption = customSelect.querySelector('.selected-option');
  const dropdownList = customSelect.querySelector('.dropdown-list');
  const qtyInput = row.querySelector('.item-qty');
  const totalDiv = row.querySelector('.item-total');

  // Populate dropdown with items
  for (const key in itemBaseValues) {
    const itemDiv = document.createElement('div');
    const icon = document.createElement('img');
    icon.src = `assets/icons/${itemImages[key]}`;
    const label = document.createElement('span');
    label.textContent = itemIcons[key] || key;
    itemDiv.appendChild(icon);
    itemDiv.appendChild(label);
    itemDiv.dataset.value = key;

    itemDiv.addEventListener('click', () => {
      customSelect.dataset.selected = key;
      selectedOption.innerHTML = ''; // Clear previous
      selectedOption.appendChild(icon.cloneNode());
      selectedOption.appendChild(document.createTextNode(' ' + (itemIcons[key] || key)));
      dropdownList.style.display = 'none';
      updateTotal();
    });

    dropdownList.appendChild(itemDiv);
  }

  customSelect.addEventListener('click', () => {
    dropdownList.style.display = dropdownList.style.display === 'block' ? 'none' : 'block';
  });

  function updateTotal() {
    const key = customSelect.dataset.selected;
    const qty = parseFloat(qtyInput.value) || 0;
    const unitPrice = itemBaseValues[key] || 0;
    totalDiv.textContent = formatEuro(qty * unitPrice);
  }

  qtyInput.addEventListener('input', updateTotal);

  document.getElementById('item-list').appendChild(clone);
}

function evaluateOffer() {
  const rows = document.querySelectorAll('.item-row');
  let totalValue = 0;

  rows.forEach(row => {
    const select = row.querySelector('.custom-select');
    const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
    const key = select.dataset.selected;
    const unit = itemBaseValues[key] || 0;
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
