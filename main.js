// fetching the data from the created custom API
async function getStoreItemsData() {
  const res = await fetch("./items.json");
  const data = res.json();
  return data;
}
// Displaying storeItems retrived from the fake API i created
const productList = document.getElementById("product-list");
async function showStoreItems() {
  let storeItemsArr = await getStoreItemsData();
  storeItemsArr.forEach((p) => {
    let col = document.createElement("div");
    col.className = "col-md-4";
    col.innerHTML = `
    <div class="card m-2 text-center">
      <div class="card-body">
        <h5 class="card-title fw-bold fs-3 text-danger">${p.itemname}</h5>
        <p class="card-text fw-bold text-suc">$${p.price}</p>
        <p class="card-text ">${p.itemdescription}</p>
        <button class="btn btn-primary  add-to-cart" data-id="${p.id}">Add to Cart</button>
      </div>
    </div>
  `;
    productList.appendChild(col);
  });
  addToCart(storeItemsArr);
  return storeItemsArr;
}
// creating a function to be used to add to the cart
// And show a message to the user
// Load from storage or empty
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(itemsArray) {
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      let id = btn.getAttribute("data-id");
      let product = itemsArray.find((p) => p.id == id);
      let item = cart.find((i) => i.id == id);
      if (item) {
        item.qty++;
      } else {
        cart.push({ ...product, qty: 1 });
      }
      saveCart();
      updateCart(itemsArray);
    });
  });
}
// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart display
function updateCart(ItemsArray) {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;

  cart.forEach((item, index) => {
    let row = `
      <tr>
        <td>${item.itemname}</td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="changeQty(${index}, -1)">-</button>
          ${item.qty}
          <button class="btn btn-sm btn-secondary" onclick="changeQty(${index}, 1)">+</button>
        </td>
        <td>$${item.price}</td>
        <td>$${item.price * item.qty}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeItem(${index})">X</button></td>
      </tr>
    `;
    total += item.price * item.qty;
    count += item.qty;
    cartItems.innerHTML += row;
  });

  cartTotal.textContent = "Total: $" + total;
  cartCount.textContent = count;

  // Save every time cart updates
  saveCart();
}
// function to change the quantitiy of the items bought
function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
  updateCart();
}
// function to remove item from the cart
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
}
// function to clear the cart 
function clearCart() {
  cart = [];
  saveCart();
  updateCart();
}

updateCart(showStoreItems());
