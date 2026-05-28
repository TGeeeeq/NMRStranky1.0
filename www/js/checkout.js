// Checkout flow — odešle objednávku, po úspěchu přesměruje na potvrzovací
// stránku s bankovními instrukcemi (payment-return.php).

let cart = JSON.parse(localStorage.getItem("cart")) || []

document.addEventListener("DOMContentLoaded", () => {
  if (cart.length === 0) {
    window.location.href = "index.html"
    return
  }
  loadOrderSummary()
})

// ---------- summary ----------
function loadOrderSummary() {
  const summaryItems = document.getElementById("summaryItems")
  const subtotal = document.getElementById("subtotal")
  const total = document.getElementById("total")
  if (!summaryItems || !subtotal || !total) return

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  summaryItems.innerHTML = cart
    .map(item => `
      <div class="summary-item" style="display:flex;gap:1rem;margin-bottom:1rem;align-items:center;">
        <img src="${escapeAttr(item.image || "../assets/logo.png")}" alt="${escapeAttr(item.name)}"
             style="width:60px;height:60px;object-fit:cover;border-radius:8px;">
        <div style="flex:1;">
          <div style="font-weight:600;">${escapeHtml(item.name)}</div>
          <div style="font-size:.9rem;color:var(--text-color-light);">Množství: ${item.quantity}×</div>
        </div>
        <div style="font-weight:600;">${formatPrice(item.price * item.quantity)} Kč</div>
      </div>`).join("")

  subtotal.textContent = formatPrice(totalPrice) + " Kč"
  total.textContent    = formatPrice(totalPrice) + " Kč"
}

// ---------- submit ----------
async function submitOrder(event) {
  event.preventDefault()
  const submitBtn = document.getElementById("submitBtn")
  submitBtn.disabled = true
  const origLabel = submitBtn.textContent
  submitBtn.textContent = "Odesílám…"

  const form = new FormData(event.target)
  const address = `${form.get("street")}, ${form.get("postal_code")} ${form.get("city")}`

  // Posíláme jen product_id + quantity — server si reálné ceny dohledá v DB,
  // takže klient nemůže manipulovat s cenou.
  const payload = {
    customer_name:    form.get("customer_name"),
    customer_email:   form.get("customer_email"),
    customer_phone:   form.get("customer_phone") || "",
    shipping_address: address,
    notes:            form.get("notes") || "",
    items: cart.map(item => ({ product_id: item.id, quantity: item.quantity })),
  }

  try {
    const resp = await fetch("../api/create-order.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const result = await resp.json()

    if (result.success && result.order_number) {
      // úspěch — vyčistit košík a přesměrovat na potvrzovací stránku
      localStorage.removeItem("cart")
      cart = []
      window.location.href = `payment-return.php?order=${encodeURIComponent(result.order_number)}`
      return
    }

    alert("Chyba: " + (result.error || "Neznámá chyba"))
    submitBtn.disabled = false
    submitBtn.textContent = origLabel
  } catch (err) {
    console.error(err)
    alert("Nepodařilo se odeslat objednávku. Zkuste to prosím znovu.")
    submitBtn.disabled = false
    submitBtn.textContent = origLabel
  }
}

// ---------- helpers ----------
function formatPrice(price) {
  return new Intl.NumberFormat("cs-CZ").format(price)
}
function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, c =>
    ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c])
}
function escapeAttr(s) { return escapeHtml(s) }
