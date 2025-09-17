const formatEuro = val => `€${val.toFixed(2)}`;

document.addEventListener("DOMContentLoaded", () => {
  createItemRow();
  document.getElementById("add-item").addEventListener("click", createItemRow);
  document.getElementById("evaluate-offer").addEventListener("click", evaluateOffer);
});

function createItemRow() {
  const template = document.getElementById("item-row-template");
  const clone = template.content.cloneNode(true);
  const customSelect = clone.querySelector(".custom-select");
  const selectedOption = customSelect.querySelector(".selected-option");
  const dropdownList = customSelect.querySelector(".dropdown-list");
  const qtyInput = clone.querySelector(".item-qty");
  const totalDiv = clone.querySelector(".item-total");

  dropdownList.innerHTML = "";
  for (let key in itemBaseValues) {
    const item = itemData[key];
    const option = document.createElement("div");
    option.innerHTML = `<img src="${item.icon}" alt="${item.label}" /><span>${item.label}</span>`;
    option.dataset.key = key;
    option.addEventListener("click", () => {
      selectedOption.innerHTML = `<img src="${item.icon}" alt="${item.label}" /><span>${item.label}</span>`;
      customSelect.dataset.selected = key;
      dropdownList.style.display = "none";
      updateTotal();
    });
    dropdownList.appendChild(option);
  }

  selectedOption.addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelectorAll(".dropdown-list").forEach(list => {
      if (list !== dropdownList) list.style.display = "none";
    });
    dropdownList.style.display = dropdownList.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", () => {
    dropdownList.style.display = "none";
  });

  function updateTotal() {
    const selectedKey = customSelect.dataset.selected;
    const qty = parseFloat(qtyInput.value) || 0;
    if (!selectedKey) {
      totalDiv.textContent = "€0.00";
      return;
    }
    const unit = itemBaseValues[selectedKey] || 0;
    totalDiv.textContent = formatEuro(qty * unit);
  }

  qtyInput.addEventListener("input", updateTotal);

  document.getElementById("item-list").appendChild(clone);
}

function evaluateOffer() {
  const rows = document.querySelectorAll(".item-row");
  let totalValue = 0;

  rows.forEach(row => {
    const selectedKey = row.querySelector(".custom-select").dataset.selected;
    const qty = parseFloat(row.querySelector(".item-qty").value) || 0;
    const unit = itemBaseValues[selectedKey] || 0;
    totalValue += qty * unit;
  });

  const offerPrice = parseFloat(document.getElementById("offer-price").value) || 0;
  const resultDiv = document.getElementById("result");

  if (offerPrice <= 0 || totalValue <= 0) {
    resultDiv.innerHTML = '<span class="verdict bad">Please enter at least one item and a valid offer price.</span>';
    return;
  }

  const ratio = totalValue / offerPrice;
  const percentage = ratio * 100;
  let verdictText = '', verdictClass = '';

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
    <strong class="verdict ${verdictClass}">${verdictText}</strong>`;
}