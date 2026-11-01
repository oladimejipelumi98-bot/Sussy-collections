const PHONE = "2349160309344";

const products = [
  { id: 1, name: "Premium Track Suit (Red)", price: 33000, cat: "Men", img: "suit-red.jpg" },
  { id: 2, name: "Premium Track Suit (White)", price: 33000, cat: "Men", img: "suit-white.jpg" },
  { id: 3, name: "260gsm Plain Tee (Black)", price: 9000, cat: "Men", img: "tee-black.jpg" },
  { id: 4, name: "Premium Tee", price: 15000, cat: "Men", img: "premium-tee.jpg" },
  { id: 5, name: "Wide-Leg Jeans", price: 11500, cat: "Men", img: "jeans.jpg" },
  { id: 6, name: "Lace girlshorts (1 piece)", price: 2800, cat: "Women", img: "girlshorts.jpg" },
  { id: 7, name: "Lace girlshorts (Dozen)", price: 14700, cat: "Women", img: "girlshorts.jpg" },
  { id: 8, name: "Lace Underwear (1 piece)", price: 2700, cat: "Women", img: "thong.jpg" },
  { id: 9, name: "Lace Underwear (Dozen)", price: 13500, cat: "Women", img: "thong.jpg" }
];

let cart = {};
let filter = "All";

function money(n) { return "₦" + n.toLocaleString(); }

/* ---------- Bouncing letters ---------- */
function splitLetters(el) {
  const text = el.textContent;
  el.textContent = "";
  text.split("").forEach(function (ch, i) {
    const s = document.createElement("span");
    s.className = "letter";
    s.style.setProperty("--d", (i * 0.07) + "s");
    s.textContent = ch === " " ? "\u00A0" : ch;
    el.appendChild(s);
  });
}

/* ---------- Welcome screen ---------- */
function closeSplash() {
  const s = document.getElementById("splash");
  if (!s || s.classList.contains("leave")) return;
  s.classList.add("leave");
  setTimeout(function () { s.style.display = "none"; }, 700);
}

/* ---------- Products ---------- */
function setFilter(f) { filter = f; renderProducts(); }

const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      e.target.classList.add("show");
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

function renderProducts() {
  const box = document.getElementById("products");
  box.innerHTML = "";
  products
    .filter(p => filter === "All" || p.cat === filter)
    .forEach((p, i) => {
      const d = document.createElement("div");
      d.className = "product";
      d.innerHTML =
        '<img src="' + p.img + '" alt="' + p.name + '">' +
        "<h3>" + p.name + "</h3><p>" + money(p.price) + "</p>" +
        '<button onclick="addToCart(' + p.id + ', this)">Add to cart</button>';
      d.classList.add("reveal");
      d.style.transitionDelay = (i % 2) * 0.12 + "s";
      box.appendChild(d);
      observer.observe(d);
    });
}

/* ---------- Cart ---------- */
function addToCart(id, btn) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();

  const badge = document.getElementById("count");
  badge.classList.remove("bump");
  void badge.offsetWidth;
  badge.classList.add("bump");

  const cb = document.getElementById("cartBtn");
  cb.classList.remove("shake");
  void cb.offsetWidth;
  cb.classList.add("shake");

  if (btn) {
    btn.textContent = "Added ✓";
    btn.classList.add("added");
    setTimeout(function () {
      btn.textContent = "Add to cart";
      btn.classList.remove("added");
    }, 900);
  }
}

function changeQty(id, step) {
  cart[id] = (cart[id] || 0) + step;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}

function renderCart() {
  let total = 0, count = 0;
  const box = document.getElementById("items");
  box.innerHTML = "";
  products.forEach(p => {
    const q = cart[p.id];
    if (!q) return;
    total += q * p.price;
    count += q;
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML =
      "<span>" + p.name + " (" + money(p.price) + ")</span><span>" +
      '<button onclick="changeQty(' + p.id + ',-1)">-</button>' + q +
      '<button onclick="changeQty(' + p.id + ',1)">+</button></span>';
    box.appendChild(row);
  });
  document.getElementById("total").textContent = money(total);
  document.getElementById("count").textContent = count;
}

function toggleCart() {
  document.getElementById("cart").classList.toggle("hidden");
}

function sendOrder() {
  const name = document.getElementById("cname").value.trim();
  const phone = document.getElementById("cphone").value.trim();
  const addr = document.getElementById("caddr").value.trim();
  if (Object.keys(cart).length === 0) { alert("Your cart is empty."); return; }
  if (!name || !phone || !addr) { alert("Please fill in your name, phone and address."); return; }

  let msg = "Hello Sussy Collections, I want to order:\n\n";
  let total = 0;
  products.forEach(p => {
    const q = cart[p.id];
    if (q) { msg += "- " + p.name + " x" + q + " = " + money(q * p.price) + "\n"; total += q * p.price; }
  });
  msg += "\nTotal: " + money(total);
  msg += "\nName: " + name + "\nPhone: " + phone + "\nAddress: " + addr;

  window.open("https://wa.me/" + PHONE + "?text=" + encodeURIComponent(msg), "_blank");
}

/* ---------- Start ---------- */
splitLetters(document.getElementById("splashTitle"));
splitLetters(document.getElementById("logo"));
renderProducts();
renderCart();
setTimeout(closeSplash, 5000);