// Cart management with improved error handling
let cart = JSON.parse(localStorage.getItem("cart")) || []

// Load categories and products on page load
document.addEventListener("DOMContentLoaded", () => {
  loadCategories().then(() => {
    const lastCategory = sessionStorage.getItem('lastCategory') || ""
    if (lastCategory) {
      filterCategory(lastCategory)
    } else {
      loadProducts()
    }
  })
  updateCartUI()
})

async function fetchJson(url, params) {
  let full = url
  if (params) {
    const qs = new URLSearchParams(params).toString()
    if (qs) full += "?" + qs
  }
  const r = await fetch(full, { credentials: "same-origin" })
  if (!r.ok) throw new Error("HTTP " + r.status)
  return r.json()
}

// Load categories for filter buttons
async function loadCategories() {
  const container = document.getElementById("categoryFilters")
  if (!container) return

  try {
    const data = await fetchJson("../api/categories.php")

    if (data.success) {
      // Clear and rebuild
      const allBtn = container.querySelector('[data-category=""]')
      container.innerHTML = ""
      if (allBtn) {
        allBtn.classList.add("active")
        container.appendChild(allBtn)
      }

      data.categories.forEach((category) => {
        if (category.product_count > 0) {
          const btn = document.createElement("button")
          btn.className = "filter-btn"
          btn.setAttribute("data-category", category.slug)
          btn.setAttribute("aria-label", `Filtrovat podle ${category.name}`)
          btn.textContent = category.name
          btn.addEventListener("click", () => filterCategory(category.slug))
          container.appendChild(btn)
        }
      })
    }
  } catch (error) {
    console.error("Error loading categories:", error)
    showErrorMessage(container, "Nepodařilo se načíst kategorie")
  }
}

// Load and display products with loading states
async function loadProducts(category = "", search = "") {
  const grid = document.getElementById("productsGrid")
  const loading = document.getElementById("loadingSpinner")
  const noProducts = document.getElementById("noProducts")

  if (!grid || !loading || !noProducts) return

  // Show loading state
  loading.style.display = "block"
  grid.style.display = "none"
  noProducts.style.display = "none"

  // Remove any existing error messages
  const existingError = grid.parentElement.querySelector(".error-message")
  if (existingError) existingError.remove()

  try {
    const params = {}
    if (category) params.category = category
    if (search) params.search = search

    const data = await fetchJson("../api/products.php", params)

    loading.style.display = "none"

    if (data.success && data.products && data.products.length > 0) {
      grid.innerHTML = ""
      data.products.forEach((product) => grid.appendChild(renderProductCard(product)))
      grid.style.display = "grid"
    } else {
      noProducts.style.display = "block"
    }
  } catch (error) {
    console.error("Error loading products:", error)
    loading.style.display = "none"
    showErrorMessage(grid.parentElement, "Nepodařilo se načíst produkty. Zkuste to znovu později.")
  }
}

function renderProductCard(product) {
  const fallbackImg = "../assets/logo.png"
  const imageUrl = product.image_url || fallbackImg

  const card = document.createElement("div")
  card.className = "product-card"
  card.style.cursor = "pointer"
  card.setAttribute("role", "button")
  card.setAttribute("tabindex", "0")
  card.setAttribute("aria-label", `Zobrazit ${product.name}`)
  card.addEventListener("click", () => openProductDetail(product.slug))
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      openProductDetail(product.slug)
    }
  })

  const img = document.createElement("img")
  img.src = imageUrl
  img.alt = product.name
  img.className = "product-image"
  img.loading = "lazy"
  img.addEventListener("error", () => { img.src = fallbackImg })
  card.appendChild(img)

  const info = document.createElement("div")
  info.className = "product-info"

  if (product.category_name) {
    const cat = document.createElement("div")
    cat.className = "product-category"
    cat.textContent = product.category_name
    info.appendChild(cat)
  }

  const name = document.createElement("h3")
  name.className = "product-name"
  name.textContent = product.name
  info.appendChild(name)

  const desc = document.createElement("p")
  desc.className = "product-description"
  desc.textContent = product.description || ""
  info.appendChild(desc)

  const footer = document.createElement("div")
  footer.className = "product-footer"

  const price = document.createElement("div")
  price.className = "product-price"
  price.textContent = `${formatPrice(product.price)} Kč`
  footer.appendChild(price)

  const btn = document.createElement("button")
  btn.className = "add-to-cart-btn"
  btn.setAttribute("aria-label", `Přidat ${product.name} do košíku`)
  const icon = document.createElement("i")
  icon.className = "fas fa-cart-plus"
  icon.setAttribute("aria-hidden", "true")
  btn.appendChild(icon)
  btn.appendChild(document.createTextNode(" Do košíku"))
  btn.addEventListener("click", (e) => {
    e.stopPropagation()
    addToCart(product.id, product.name, parseFloat(product.price), imageUrl)
  })
  footer.appendChild(btn)

  info.appendChild(footer)
  card.appendChild(info)

  return card
}

// Show error message
function showErrorMessage(container, message) {
  const errorEl = document.createElement("div")
  errorEl.className = "error-message"
  errorEl.setAttribute("role", "alert")
  const icon = document.createElement("i")
  icon.className = "fas fa-exclamation-circle"
  errorEl.appendChild(icon)
  errorEl.appendChild(document.createTextNode(" " + message))
  container.appendChild(errorEl)
}

// Filter products by category
function filterCategory(categorySlug) {
  sessionStorage.setItem("lastCategory", categorySlug)

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active")
    if (btn.getAttribute("data-category") === categorySlug) {
      btn.classList.add("active")
    }
  })

  const searchInput = document.getElementById("searchInput")
  const searchValue = searchInput ? searchInput.value : ""
  loadProducts(categorySlug, searchValue)
}

// Handle search with debounce
let searchTimeout
function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    const searchValue = document.getElementById("searchInput")?.value || ""
    const activeCategory = document.querySelector(".filter-btn.active")?.getAttribute("data-category") || ""
    loadProducts(activeCategory, searchValue)
  }, 300)
}

// Scroll to products section
function scrollToProducts() {
  const productsSection = document.getElementById("products")
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: "smooth" })
  }
}

// Cart functions
function addToCart(id, name, price, image) {
  const existingItem = cart.find((item) => item.id === id)

  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.push({
      id,
      name,
      price,
      image,
      quantity: 1,
    })
  }

  saveCart()
  updateCartUI()
  showCartNotification()
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id)
  saveCart()
  updateCartUI()
}

function updateQuantity(id, change) {
  const item = cart.find((item) => item.id === id)
  if (item) {
    item.quantity += change
    if (item.quantity <= 0) {
      removeFromCart(id)
    } else {
      saveCart()
      updateCartUI()
    }
  }
}

function saveCart() {
  try {
    localStorage.setItem("cart", JSON.stringify(cart))
  } catch (e) {
    console.error("Error saving cart:", e)
  }
}

function updateCartUI() {
  const cartCount = document.getElementById("cartCount")
  const cartContent = document.getElementById("cartContent")
  const cartTotal = document.getElementById("cartTotal")

  if (!cartCount || !cartContent || !cartTotal) return

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  cartCount.textContent = totalItems
  cartCount.setAttribute("aria-label", `Košík obsahuje ${totalItems} položek`)
  cartTotal.textContent = formatPrice(totalPrice) + " Kč"

  cartContent.innerHTML = ""
  if (cart.length === 0) {
    const empty = document.createElement("div")
    empty.className = "empty-cart"
    const p = document.createElement("p")
    p.textContent = "Váš košík je prázdný"
    empty.appendChild(p)
    cartContent.appendChild(empty)
    return
  }

  cart.forEach((item) => cartContent.appendChild(renderCartItem(item)))
}

function renderCartItem(item) {
  const fallbackImg = "../assets/logo.png"

  const row = document.createElement("div")
  row.className = "cart-item"

  const img = document.createElement("img")
  img.src = item.image || fallbackImg
  img.alt = item.name
  img.className = "cart-item-image"
  img.addEventListener("error", () => { img.src = fallbackImg })
  row.appendChild(img)

  const details = document.createElement("div")
  details.className = "cart-item-details"

  const name = document.createElement("div")
  name.className = "cart-item-name"
  name.textContent = item.name
  details.appendChild(name)

  const price = document.createElement("div")
  price.className = "cart-item-price"
  price.textContent = `${formatPrice(item.price)} Kč`
  details.appendChild(price)

  const controls = document.createElement("div")
  controls.className = "cart-item-controls"

  const minus = document.createElement("button")
  minus.className = "qty-btn"
  minus.setAttribute("aria-label", "Snížit množství")
  minus.textContent = "−"
  minus.addEventListener("click", () => updateQuantity(item.id, -1))
  controls.appendChild(minus)

  const qty = document.createElement("span")
  qty.setAttribute("aria-label", "Počet kusů")
  qty.textContent = item.quantity
  controls.appendChild(qty)

  const plus = document.createElement("button")
  plus.className = "qty-btn"
  plus.setAttribute("aria-label", "Zvýšit množství")
  plus.textContent = "+"
  plus.addEventListener("click", () => updateQuantity(item.id, 1))
  controls.appendChild(plus)

  const remove = document.createElement("button")
  remove.className = "remove-btn"
  remove.setAttribute("aria-label", "Odebrat z košíku")
  remove.textContent = "Odebrat"
  remove.addEventListener("click", () => removeFromCart(item.id))
  controls.appendChild(remove)

  details.appendChild(controls)
  row.appendChild(details)
  return row
}

function toggleCart() {
  const sidebar = document.getElementById("cartSidebar")
  const overlay = document.getElementById("cartOverlay")

  if (sidebar && overlay) {
    sidebar.classList.toggle("active")
    overlay.classList.toggle("active")
  }
}

function showCartNotification() {
  toggleCart()
}

function goToCheckout() {
  if (cart.length === 0) {
    alert("Váš košík je prázdný")
    return
  }
  window.location.href = "checkout"
}

function openProductDetail(slug) {
  window.location.href = `product-detail?product=${encodeURIComponent(slug)}`
}

function formatPrice(price) {
  return new Intl.NumberFormat("cs-CZ").format(price)
}
