const formatEuro = val => `€${val.toFixed(2)}`;

function createItemRow() {
  const template = document.getElementById('item-row-template');
  const clone = template.content.cloneNode(true);
  const customSelect = clone.querySelector('.custom-select');
  const selectedOption = customSelect.querySelector('.selected-option');
  const dropdown = customSelect.querySelector('.dropdown-list');
  const qtyInput = clone.querySelector('.item-qty');
  const totalDiv = clone.querySelector('.item-total');

  // Populate dropdown list
  for (let key in itemBaseValues) {
    const item = document.createElement('div');
    item.setAttribute('data-key', key);
    item.innerHTML = `
      <img src="assets/icons/${itemImagePaths[key]}" alt="${key}" />
      <span>${itemIcons[key]}</span>
    `;
    dropdown.appendChild(item);
  }

  // Toggle dropdown visibility
  customSelect.addEventListener('click', (e) => {
    if (e.target.closest('.dropdown-list')) return; // let selection work
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });

  // Handle selection
  dropdown.addEventListener('click', (e) => {
    const selectedDiv = e.target.closest('div[data-key]');
    if (!selectedDiv) return;

    const key = selectedDiv.getAttribute('data-key');
    const icon = itemImagePaths[key];
    const label = itemIcons[key];

    selectedOption.innerHTML = `<img src="assets/icons/${icon}" alt="${key}" /><span>${label}</span>`;
    customSelect.setAttribute('data-selected', key);
    dropdown.style.display = 'none';
    updateTotal();
  });

  function updateTotal() {
    const key = customSelect.getAttribute('data-selected');
    const qty = parseFloat(qtyInput.value) || 0;
    const val = itemBaseValues[key] || 0;
    const total = qty * val;
    totalDiv.textContent = formatEuro(total);
  }

  qtyInput.addEventListener('input', updateTotal);
  document.getElementById('item-list').appendChild(clone);
}

// Close dropdown if clicked outside
window.addEventListener('click', (e) => {
  document.querySelectorAll('.dropdown-list').forEach(dropdown => {
    if (!dropdown.parentElement.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });
});

function evaluateOffer() {
  const rows = document.querySelectorAll('.item-row');
  let totalValue = 0;

  rows.forEach(row => {
    const customSelect = row.querySelector('.custom-select');
    const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
    const key = customSelect.getAttribute('data-selected');
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
