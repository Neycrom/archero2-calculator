const formatEuro = val => `€${val.toFixed(2)}`;

function createItemRow() {
  const template = document.getElementById('item-row-template');
  const clone = template.content.cloneNode(true);
  const dropdown = clone.querySelector('.custom-select');
  const selectedOption = dropdown.querySelector('.selected-option');
  const dropdownList = dropdown.querySelector('.dropdown-list');
  const qtyInput = clone.querySelector('.item-qty');
  const totalDiv = clone.querySelector('.item-total');

  // Populate dropdown
  for (let key in itemData) {
    const item = itemData[key];

    const option = document.createElement("div");
    option.dataset.value = key;

    const img = document.createElement("img");
    img.src = item.icon;
    img.alt = item.label;

    const label = document.createElement("span");
    label.textContent = item.label;

    option.appendChild(img);
    option.appendChild(label);
    dropdownList.appendChild(option);
  }

  // Open/close logic
  dropdown.addEventListener("click", () => {
    dropdownList.style.display = dropdownList.style.display === "block" ? "none" : "block";
  });

  // Handle item selection
  dropdownList.querySelectorAll("div").forEach(option => {
    option.addEventListener("click", () => {
      const value = option.dataset.value;
      dropdown.dataset.selected = value;
      dropdownList.style.display = "none";

      // Update selected item icon + label
      const img = document.createElement("img");
      img.src = itemData[value].icon;
      img.alt = itemData[value].label;

      const span = document.createElement("span");
      span.textContent = itemData[value].label;

      selectedOption.innerHTML = "";
      selectedOption.appendChild(img);
      selectedOption.appendChild(span);

      updateTotal();
    });
  });

  function updateTotal() {
    const selected = dropdown.dataset.selected;
    const qty = parseFloat(qtyInput.value) || 0;
    const unitValue = itemBaseValues[selected] || 0;
    totalDiv.textContent = formatEuro(qty
