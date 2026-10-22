
import { useEffect, useState } from "react";
import "./App.css";

const PAGE_IDS = ["home", "marketplace", "delivery", "sell", "about", "support"];

const getPageFromHash = () => {
  const page = window.location.hash.slice(1);
  return PAGE_IDS.includes(page) ? page : "home";
};

const menuItems = [
  {
    id: 1,
    name: "Grilled Chicken Plate",
    type: "Grilled",
    price: 6500,
    location: "Kayonza",
    quantity: 12,
    description: "Freshly grilled chicken served as a hearty individual meal.",
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Crispy Fried Chicken",
    type: "Fried",
    price: 7000,
    location: "Kayonza",
    quantity: 8,
    description: "Golden, crispy chicken prepared fresh for your meal.",
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Chicken and Rice",
    type: "Rice Meals",
    price: 6000,
    location: "Kayonza",
    quantity: 15,
    description: "A satisfying chicken and rice meal, freshly prepared.",
    image:
      "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Roast Chicken Meal",
    type: "Roasted",
    price: 9000,
    location: "Kayonza",
    quantity: 6,
    description: "Tender roasted chicken prepared and served fresh.",
    image:
      "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Spiced Chicken Plate",
    type: "Grilled",
    price: 7500,
    location: "Kayonza",
    quantity: 20,
    description: "A flavorful chicken plate with a warm blend of spices.",
    image:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "Family Chicken Meal",
    type: "Family Meals",
    price: 22000,
    location: "Kayonza",
    quantity: 10,
    description: "A generous chicken meal for sharing with family or friends.",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    name: "Chicken Burger",
    type: "Burgers",
    price: 5500,
    location: "Kayonza",
    quantity: 12,
    description: "Seasoned chicken burger served fresh for lunch or dinner.",
    image:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 8,
    name: "Chicken Wrap",
    type: "Wraps",
    price: 5000,
    location: "Kayonza",
    quantity: 10,
    description: "Tender chicken wrapped with fresh vegetables.",
    image:
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 9,
    name: "Chicken Salad",
    type: "Salads",
    price: 6500,
    location: "Kayonza",
    quantity: 8,
    description: "A fresh salad topped with seasoned chicken.",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 10,
    name: "Chicken Skewers",
    type: "Grilled",
    price: 8000,
    location: "Kayonza",
    quantity: 10,
    description: "Grilled chicken skewers seasoned and served hot.",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
  },
];

function App() {
  const [currentPage, setCurrentPage] = useState(getPageFromHash);
  const [poultryListings, setPoultryListings] = useState(menuItems);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [sortOrder, setSortOrder] = useState("featured");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [checkoutOrder, setCheckoutOrder] = useState(null);
  const [paymentConfirmationSubmitted, setPaymentConfirmationSubmitted] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showSellerForm, setShowSellerForm] = useState(() => getPageFromHash() === "sell");
  const [message, setMessage] = useState("");
  const [headerSearch, setHeaderSearch] = useState("");

  useEffect(() => {
    const syncPageWithHash = () => {
      const nextPage = window.location.hash.slice(1);
      if (!PAGE_IDS.includes(nextPage)) return;

      setCurrentPage(nextPage);
      setShowSellerForm(nextPage === "sell");
      window.scrollTo({ top: 0, behavior: "auto" });
    };

    window.addEventListener("hashchange", syncPageWithHash);
    return () => window.removeEventListener("hashchange", syncPageWithHash);
  }, []);

  useEffect(() => {
    if (!showAuth) return;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setShowAuth(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [showAuth]);

  const filteredPoultry = poultryListings.filter((bird) => {
    const searchTerm = search.trim().toLowerCase();
    const matchesSearch =
      bird.name.toLowerCase().includes(searchTerm) ||
      bird.type.toLowerCase().includes(searchTerm) ||
      bird.location.toLowerCase().includes(searchTerm) ||
      bird.description.toLowerCase().includes(searchTerm);

    const matchesType =
      selectedType === "All" || bird.type === selectedType;

    return matchesSearch && matchesType;
  }).sort((first, second) => {
    if (sortOrder === "price-low") return first.price - second.price;
    if (sortOrder === "price-high") return second.price - first.price;
    return first.id - second.id;
  });

  const addToCart = (bird) => {
    setCheckoutOrder(null);
    setPaymentConfirmationSubmitted(false);
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === bird.id);

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === bird.id
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item  
        );
      }

      return [...currentCart, { ...bird, cartQuantity: 1 }];
    });

    setMessage(`${bird.name} added to your cart!`);
    setTimeout(() => setMessage(""), 2500);
  };

  const removeFromCart = (id) => {
    setCheckoutOrder(null);
    setPaymentConfirmationSubmitted(false);
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.cartQuantity,
    0
  );

  const formatPrice = (price) =>
    `${price.toLocaleString("en-RW")} RWF`;

  const prepareOrder = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setCheckoutOrder({
      name: formData.get("customerName").trim(),
      phone: formData.get("customerPhone").trim(),
      address: formData.get("deliveryAddress").trim(),
      payment: formData.get("paymentMethod"),
      total: cartTotal,
      paymentConfirmation: "",
    });
    setPaymentConfirmationSubmitted(false);
  };

  const submitPaymentConfirmation = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const confirmation = formData.get("paymentConfirmation").trim();

    setCheckoutOrder((currentOrder) =>
      currentOrder
        ? { ...currentOrder, paymentConfirmation: confirmation }
        : currentOrder
    );
    setPaymentConfirmationSubmitted(true);
  };

  const addSellerListing = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const type = formData.get("type");
    const listing = {
      id: Date.now(),
      name: formData.get("name").trim(),
      type,
      price: Number(formData.get("price")),
      location: formData.get("location").trim(),
      quantity: Number(formData.get("quantity")),
      description: formData.get("description").trim(),
      image: formData.get("image").trim(),
      sellerName: formData.get("sellerName").trim(),
      sellerPhone: formData.get("sellerPhone").trim(),
    };

    setPoultryListings((currentListings) => [listing, ...currentListings]);
    setSearch("");
    setSelectedType("All");
    setSortOrder("featured");
    setShowSellerForm(false);
    setMessage(`${listing.name} is now listed in the marketplace.`);
    event.currentTarget.reset();
    window.location.hash = "marketplace";
  };

  const searchFromHeader = (event) => {
    event.preventDefault();
    setSearch(headerSearch.trim());
    setSelectedType("All");
    setCurrentPage("marketplace");
    setShowSellerForm(false);
    window.location.hash = "marketplace";
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <div className="app">
      {/* Navigation */}
      <header className="navbar">
        <a href="#home" className="logo">
          <span className="logo-icon">🐔</span>
          <span>
            Fresh<span className="logo-green">Chicken</span>
          </span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#marketplace">Menu</a>
          <a href="#delivery">Delivery</a>
          <a href="#sell">Become a Supplier</a>
          <a href="#support">Get Support</a>
          <a href="#about">About Us</a>
        </nav>

        <div className="header-actions">
          <form className="header-search" onSubmit={searchFromHeader} role="search">
            <input
              type="search"
              value={headerSearch}
              onChange={(event) => setHeaderSearch(event.target.value)}
              placeholder="Search fresh chicken..."
              aria-label="Search fresh chicken listings"
            />
            <button type="submit" aria-label="Search products">🔍</button>
          </form>
          <div className="account-actions">
            <button
              className="login-button"
              onClick={() => setShowAuth(true)}
            >
              Log in
            </button>
            <button
              className="register-button"
              onClick={() => setShowAuth(true)}
            >
              Register
            </button>
          </div>
          <button
            className="cart-button"
            onClick={() => setShowCart(!showCart)}
          >
            🛒 Cart ({cart.reduce((sum, item) => sum + item.cartQuantity, 0)})
          </button>
        </div>
      </header>

      {/* Cart */}
      {showCart && (
        <section className="cart-panel">
          <div className="cart-heading">
            <h2>Your Shopping Cart</h2>
            <button
              className="close-button"
              onClick={() => setShowCart(false)}
            >
              ✕
            </button>
          </div>

          {cart.length === 0 ? (
            <p>Your cart is empty. Explore fresh chicken listings!</p>
          ) : (
            <>
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>
                      {item.cartQuantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <button
                    className="remove-button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="cart-total">
                <span>Amount to pay</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>
              <p className="small-note">
                This is the item total. Delivery fees are agreed with the
                supplier and are not included.
              </p>

              {checkoutOrder ? (
                <section className="order-confirmation" role="status">
                  <h3>
                    {checkoutOrder.payment === "Mobile Money (MoMo)"
                      ? paymentConfirmationSubmitted
                        ? "Payment confirmation received"
                        : "Complete your MoMo payment"
                      : "Order details prepared"}
                  </h3>
                  {checkoutOrder.payment === "Mobile Money (MoMo)" ? (
                    <>
                      <p>
                        Hello {checkoutOrder.name}, please pay{" "}
                        <strong>{formatPrice(checkoutOrder.total)}</strong> by
                        Mobile Money to <strong>0794214600</strong>.
                      </p>
                      <div className="momo-instructions">
                        <span>Dial this code to make your payment</span>
                        <strong>*182*1*1*0794214600#</strong>
                      </div>
                      <p className="payment-safety-note">
                        Never share your MoMo PIN or one-time password here.
                        Enter only the transaction reference or confirmation
                        message after you have paid.
                      </p>
                      {paymentConfirmationSubmitted ? (
                        <>
                          <p className="payment-follow-up">
                            Your confirmation message has been entered for this
                            demo. The supplier will contact you after receiving
                            and confirming your payment to arrange your order
                            and delivery.
                          </p>
                          <p className="small-note">
                            This website does not send or verify payment
                            confirmations yet. Contact the supplier directly
                            to confirm receipt.
                          </p>
                        </>
                      ) : (
                        <form
                          className="payment-confirmation-form"
                          onSubmit={submitPaymentConfirmation}
                        >
                          <label htmlFor="payment-confirmation">
                            MoMo transaction reference or confirmation message *
                          </label>
                          <textarea
                            id="payment-confirmation"
                            name="paymentConfirmation"
                            rows="3"
                            placeholder="Enter the transaction ID or payment confirmation message"
                            required
                          />
                          <button
                            className="primary-button full-button"
                            type="submit"
                          >
                            Submit Payment Confirmation
                          </button>
                        </form>
                      )}
                    </>
                  ) : (
                    <>
                      <p>
                        Thank you, {checkoutOrder.name}. Contact your supplier
                        to confirm stock, payment, and delivery arrangements.
                      </p>
                      <p className="payment-follow-up">
                        Your supplier will contact you to confirm the order and
                        arrange delivery.
                      </p>
                    </>
                  )}
                  <dl>
                    <div>
                      <dt>Contact</dt>
                      <dd>{checkoutOrder.phone}</dd>
                    </div>
                    <div>
                      <dt>Delivery address</dt>
                      <dd>{checkoutOrder.address}</dd>
                    </div>
                    <div>
                      <dt>Payment preference</dt>
                      <dd>{checkoutOrder.payment}</dd>
                    </div>
                    <div>
                      <dt>Items total</dt>
                      <dd>{formatPrice(checkoutOrder.total)}</dd>
                    </div>
                  </dl>
                </section>
              ) : (
                <form className="checkout-form" onSubmit={prepareOrder}>
                  <h3>Delivery and payment</h3>
                  <label>
                    Your name *
                    <input
                      name="customerName"
                      type="text"
                      autoComplete="name"
                      required
                    />
                  </label>
                  <label>
                    Phone number *
                    <input
                      name="customerPhone"
                      type="tel"
                      autoComplete="tel"
                      required
                    />
                  </label>
                  <label>
                    Delivery address *
                    <textarea
                      name="deliveryAddress"
                      rows="3"
                      autoComplete="street-address"
                      placeholder="District, sector, street or delivery landmark"
                      required
                    />
                  </label>
                  <label>
                    Preferred payment method *
                    <select name="paymentMethod" defaultValue="" required>
                      <option value="" disabled>Select a payment method</option>
                      <option value="Mobile Money (MoMo)">
                        Mobile Money (MoMo)
                      </option>
                      <option value="Cash on delivery or pickup">
                        Cash on delivery or pickup
                      </option>
                      <option value="Agree with supplier">
                        Agree with supplier
                      </option>
                    </select>
                  </label>
                  <p className="small-note">
                    Payment is not processed on this website. Confirm the
                    payment method and delivery fee directly with the supplier.
                  </p>
                  <button className="primary-button full-button" type="submit">
                    Prepare Order
                  </button>
                </form>
              )}
            </>
          )}
        </section>
      )}

      <main>
        {currentPage === "home" && (
          <>
        <section className="hero" id="home">
          <div className="hero-content">
            <h1>
              Fresh Chicken, <span>Locally</span>
              <br />Sourced
            </h1>
            <p>
              Welcome to Fresh Chicken, connecting Kayonza restaurants,
              households, and local poultry suppliers. Find fresh chicken,
              compare listings, and coordinate delivery with your seller.
            </p>
            <ul className="hero-features">
              <li>Local chicken suppliers</li>
              <li>Fresh options for restaurants</li>
              <li>Clear prices and availability</li>
              <li>Coordinate delivery times</li>
            </ul>
            <div className="hero-search">
              <a href="#marketplace" className="primary-button">Shop Now</a>
              <a href="#special-offers" className="secondary-button">Special Offers</a>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1100&q=85"
              alt="Chicken meal freshly prepared and served"
            />
          </div>
        </section>

        <section className="special-offers" id="special-offers">
          <div className="offers-heading">
            <div>
              <span className="eyebrow">FRESHLY PREPARED IN KAYONZA</span>
              <h2>Chicken Menu</h2>
            </div>
            <a href="#marketplace">View full menu <span aria-hidden="true">→</span></a>
          </div>
          <div className="offer-grid">
            {poultryListings.slice(0, 4).map((bird) => (
              <article className="offer-card" key={bird.id}>
                <div className="offer-image">
                  <img src={bird.image} alt={bird.name} loading="lazy" />
                  <span>Kayonza</span>
                </div>
                <div className="offer-info">
                  <span>{bird.type}</span>
                  <h3>{bird.name}</h3>
                  <div className="offer-bottom">
                    <strong>{formatPrice(bird.price)}</strong>
                    <button
                      onClick={() => addToCart(bird)}
                      aria-label={`Add ${bird.name} to cart`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="benefits">
          <div className="benefit">
            <span className="benefit-icon">🐓</span>
            <div>
              <h3>Fresh Local Chicken</h3>
              <p>Explore chicken listings from local suppliers.</p>
            </div>
          </div>

          <div className="benefit">
            <span className="benefit-icon">💰</span>
            <div>
              <h3>Compare Suppliers</h3>
              <p>Compare listings and find an option that fits.</p>
            </div>
          </div>

          <div className="benefit">
            <span className="benefit-icon">🚚</span>
            <div>
              <h3>Timely Delivery</h3>
              <p>Coordinate delivery timing directly with your supplier.</p>
            </div>
          </div>
        </section>
          </>
        )}

        {currentPage === "marketplace" && (
          <>
        {/* Marketplace */}
        <section className="marketplace section" id="marketplace">
          <div className="section-heading">
            <div>
              <span className="eyebrow">OUR MENU</span>
              <h2>Fresh Chicken Menu</h2>
              <p>
                Browse chicken meals prepared by local restaurants in Kayonza.
                Choose your dishes, add them to the cart, and request delivery
                to your home or business.
              </p>
            </div>

            <span className="listing-count">
              {filteredPoultry.length} {filteredPoultry.length === 1 ? "menu item" : "menu items"}
            </span>
          </div>

          <div className="search-bar">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search meals, category, or location..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search chicken meals"
            />

            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              aria-label="Sort menu items"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </div>

          <div className="category-buttons">
            {["All", ...new Set(menuItems.map((item) => item.type))].map((type) => (
              <button
                key={type}
                className={selectedType === type ? "category active" : "category"}
                onClick={() => setSelectedType(type)}
              >
                {type === "All" ? "All Meals" : type}
              </button>
            ))}
          </div>

          <div className="marketplace-guide">
            <div>
              <strong>Choose your meal</strong>
              <span>Browse dishes and compare prices.</span>
            </div>
            <div>
              <strong>Check availability</strong>
              <span>Confirm your order and requested delivery time.</span>
            </div>
            <div>
              <strong>Plan delivery</strong>
              <span>Provide your address and contact details at checkout.</span>
            </div>
          </div>

          {filteredPoultry.length === 0 ? (
            <div className="empty-results">
              <h3>No menu items found</h3>
              <p>Try another search or clear your filters.</p>
              <button
                className="clear-filters-button"
                onClick={() => {
                  setSearch("");
                  setSelectedType("All");
                  setSortOrder("featured");
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {filteredPoultry.map((bird) => (
                <article className="product-card" key={bird.id}>
                  <div className="product-image">
                    <img src={bird.image} alt={bird.name} loading="lazy" />
                    <span className="product-type">{bird.type}</span>
                  </div>

                  <div className="product-info">
                    <div className="product-location">
                      📍 {bird.location}, Rwanda
                    </div>

                    <h3>{bird.name}</h3>
                    <p className="product-description">
                      {bird.description}
                    </p>

                    <div className="stock-info">
                      Available servings: {bird.quantity}
                    </div>
                    {bird.sellerName && (
                      <div className="listing-contact">
                        <span>Restaurant: {bird.sellerName}</span>
                        <a href={`tel:${bird.sellerPhone}`}>{bird.sellerPhone}</a>
                      </div>
                    )}

                    <div className="product-bottom">
                      <div>
                        <strong className="product-price">
                          {formatPrice(bird.price)}
                        </strong>
                        <span className="per-bird">per meal</span>
                      </div>

                      <button
                        className="add-button"
                        onClick={() => addToCart(bird)}
                        aria-label={`Add ${bird.name} to cart`}
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <p className="demo-notice">
            Menu items and prices shown are demonstration content. Confirm
            availability and delivery details before placing an order.
          </p>
        </section>
          </>
        )}

        {currentPage === "delivery" && (
          <section className="delivery-page">
            <div className="delivery-page-heading">
              <span className="eyebrow">KAYONZA CHICKEN DELIVERY</span>
              <h1>Fresh chicken, delivered on time</h1>
              <p>
                Fresh Chicken helps buyers connect with local chicken suppliers
                and plan delivery around their needs. Restaurants can discuss
                stock, delivery fees, and a suitable arrival time directly
                with the supplier before confirming an order.
              </p>
            </div>

            <div className="delivery-facts">
              <article>
                <span>01</span>
                <h2>Delivery area</h2>
                <p>
                  Listings focus on Kayonza. Confirm that delivery is available
                  to your restaurant, home, or agreed pickup point.
                </p>
              </article>
              <article>
                <span>02</span>
                <h2>Delivery price</h2>
                <p>
                  Agree on the delivery charge with the supplier. It may depend
                  on distance and order size and is not included in the listed
                  chicken price.
                </p>
              </article>
              <article>
                <span>03</span>
                <h2>Delivery time</h2>
                <p>
                  To help your restaurant or household receive chicken when
                  needed, agree on an arrival date and time with the supplier.
                  Delivery schedules are confirmed directly with them.
                </p>
              </article>
            </div>

            <a href="#marketplace" className="primary-button">
              Browse fresh chicken
            </a>
          </section>
        )}

        {currentPage === "support" && (
          <section className="about-page support-page">
            <div className="about-page-heading">
              <span className="eyebrow">FRESH CHICKEN SUPPORT</span>
              <h1>Get support with ordering or supplying</h1>
              <p>
                Whether you run a restaurant looking for a chicken supplier or
                you want to offer chicken to local buyers, this guide explains
                how to get started and what to confirm along the way.
              </p>
            </div>

            <div className="support-process">
              <section className="support-process-section" aria-labelledby="buyer-process-title">
                <span className="about-number">FOR RESTAURANTS AND BUYERS</span>
                <h2 id="buyer-process-title">How to make an order</h2>
                <ol className="support-steps">
                  <li>
                    <strong>Browse chicken listings</strong>
                    <p>
                      Explore the marketplace and compare chicken type,
                      quantity, price, location, and supplier details.
                    </p>
                  </li>
                  <li>
                    <strong>Contact the supplier</strong>
                    <p>
                      Call the supplier using the number on the listing. Ask
                      about freshness, current stock, and whether they can
                      supply the quantity your restaurant needs.
                    </p>
                  </li>
                  <li>
                    <strong>Agree on order and payment</strong>
                    <p>
                      Confirm the final quantity, price, payment method, and
                      any other requirements directly with the supplier before
                      placing your order.
                    </p>
                  </li>
                  <li>
                    <strong>Arrange delivery time or pickup</strong>
                    <p>
                      Agree on the delivery fee, address or pickup point, and
                      arrival time. For restaurant orders, confirm a time that
                      works for your kitchen.
                    </p>
                  </li>
                  <li>
                    <strong>Receive and check your order</strong>
                    <p>
                      Check the quantity and condition of the chicken when it
                      arrives, and contact the supplier promptly if anything
                      differs from what you agreed.
                    </p>
                  </li>
                </ol>
              </section>

              <section className="support-process-section" aria-labelledby="supplier-process-title">
                <span className="about-number">FOR RESTAURANTS</span>
                <h2 id="supplier-process-title">How to add meals to the menu</h2>
                <ol className="support-steps">
                  <li>
                    <strong>Prepare your listing details</strong>
                    <p>
                      Prepare your restaurant name and phone number, meal name,
                      category, price, available servings, location,
                      description, and a photo.
                    </p>
                  </li>
                  <li>
                    <strong>Submit your chicken listing</strong>
                    <p>
                      Choose “Become a Supplier” and complete the menu listing
                      form with current meal and availability details.
                    </p>
                  </li>
                  <li>
                    <strong>Respond to buyer inquiries</strong>
                    <p>
                      Customers can find your meals and use the contact details
                      shown to confirm availability and delivery needs.
                    </p>
                  </li>
                  <li>
                    <strong>Confirm the order and delivery</strong>
                    <p>
                      Confirm the meal selection, payment, delivery fee,
                      customer address, and an arrival time you can meet.
                    </p>
                  </li>
                </ol>
              </section>
            </div>

            <p className="demo-notice">
              Fresh Chicken is currently a project demonstration. Orders,
              payments, supplier verification, delivery tracking, and chat are
              not processed through the website yet. Buyers and suppliers
              arrange these details directly.
            </p>

            <div className="about-actions">
              <a className="primary-button" href="#marketplace">Browse chicken</a>
              <a className="secondary-button" href="#sell">Become a supplier</a>
            </div>

            <p className="support-contact">
              Need help? Call{" "}
              <a href="tel:+250794214600">+250 794 214 600</a> or{" "}
              <a href="tel:+250798657045">+250 798 657 045</a>, or email{" "}
              <a href="mailto:henconnect@gmail.com">henconnect@gmail.com</a>.
            </p>
          </section>
        )}

        {currentPage === "about" && (
          <section className="about-page">
            <div className="about-page-heading">
              <span className="eyebrow">ABOUT FRESH CHICKEN</span>
              <h1>Welcome to Fresh Chicken</h1>
              <p>
                We’re glad you’re here. Fresh Chicken is a project built to
                connect chicken suppliers and farmers with restaurants,
                businesses, and households in Kayonza District, Rwanda. Our
                goal is to make it easier to discover fresh chicken, compare
                local offers, and coordinate delivery at a time that works for
                the customer and supplier.
              </p>
            </div>

            <div className="about-purpose">
              <div>
                <span className="about-number">01 / OUR PURPOSE</span>
                <h2>Connecting local suppliers with restaurants and buyers</h2>
                <p>
                  Restaurants need dependable access to fresh chicken for
                  their kitchens, while farmers and suppliers need a clear way
                  to reach customers. Fresh Chicken brings local listings
                  together so buyers can compare chicken types, prices,
                  quantities, and supplier locations. Suppliers can share
                  what is available and provide the details customers need
                  before making arrangements.
                </p>
              </div>
              <div className="about-purpose-note">
                <strong>Rooted in Kayonza</strong>
                <p>
                  The project focuses on Kayonza District, Rwanda, helping
                  local restaurants and households discover nearby chicken
                  suppliers and helping suppliers connect with more customers.
                </p>
              </div>
            </div>

            <div className="about-facts">
              <article>
                <span>FOR BUYERS</span>
                <h2>Find the right chicken for your needs</h2>
                <p>
                  Browse local chicken listings and compare type, price,
                  quantity, and location. Restaurant owners can check that a
                  supplier has enough stock for their needs. Contact the
                  supplier to confirm freshness and availability before
                  arranging a purchase.
                </p>
              </article>
              <article>
                <span>FOR FARMERS AND SUPPLIERS</span>
                <h2>Reach restaurants and local customers</h2>
                <p>
                  Farmers and suppliers can list their available chicken with
                  its type, price, quantity, location, description, and contact
                  details. Clear, current information helps restaurants and
                  other customers find an offer that fits their requirements.
                </p>
              </article>
              <article>
                <span>DELIVERY PLANNING</span>
                <h2>Coordinate delivery for the time you need</h2>
                <p>
                  Customers and suppliers discuss availability, price, payment,
                  and delivery arrangements directly. Restaurants can request
                  a delivery time that suits their kitchen schedule and should
                  confirm the agreed arrival time and any delivery fee with
                  the supplier before ordering.
                </p>
              </article>
            </div>

            <p className="demo-notice">
              Fresh Chicken is currently a project demonstration. Some
              listings are examples, and online ordering, delivery tracking,
              verified supplier accounts, and shared chat are not connected
              yet. Confirm availability and delivery arrangements directly
              with the supplier.
            </p>

            <div className="about-actions">
              <a className="primary-button" href="#marketplace">Visit marketplace</a>
              <a className="secondary-button" href="#sell">List your chicken</a>
            </div>
          </section>
        )}

        {currentPage === "sell" && (
          <>
        {/* Seller CTA */}
        <section className="seller-section section" id="sell">
          <div className="seller-icon">👨‍🌾</div>

          <div className="seller-text">
            <span className="eyebrow">FOR CHICKEN FARMERS AND SUPPLIERS</span>
            <h2>Restaurant in Kayonza? Add Your Meals</h2>
            <p>
              Add your chicken meals to the menu so customers can discover
              your restaurant, choose dishes, and request delivery.
            </p>
          </div>

          <button
            className="seller-button"
            onClick={() => setShowSellerForm((isOpen) => !isOpen)}
            aria-expanded={showSellerForm}
            aria-controls="seller-listing-form"
          >
            {showSellerForm ? "Close Menu Form" : "Add Your Meals →"}
          </button>
        </section>

        {showSellerForm && (
          <section className="seller-form-section" id="seller-listing-form">
            <div className="seller-form-heading">
              <span className="eyebrow">NEW MARKETPLACE LISTING</span>
              <h2>Add a menu item</h2>
              <p>Show customers the chicken meals available at your restaurant.</p>
            </div>

            <form className="seller-form" onSubmit={addSellerListing}>
              <label>
                Restaurant name
                <input name="sellerName" type="text" autoComplete="name" required />
              </label>
              <label>
                Phone number
                <input name="sellerPhone" type="tel" autoComplete="tel" required />
              </label>
              <label>
                Meal name
                <input name="name" type="text" placeholder="e.g. Grilled Chicken Plate" required />
              </label>
              <label>
                Meal category
                <select name="type" defaultValue="Grilled" required>
                  <option value="Grilled">Grilled</option>
                  <option value="Fried">Fried</option>
                  <option value="Rice Meals">Rice Meals</option>
                  <option value="Roasted">Roasted</option>
                  <option value="Family Meals">Family Meals</option>
                </select>
              </label>
              <label>
                Price per meal (RWF)
                <input name="price" type="number" min="1" step="1" required />
              </label>
              <label>
                Available servings
                <input name="quantity" type="number" min="1" step="1" required />
              </label>
              <label>
                Location in Kayonza
                <input name="location" type="text" defaultValue="Kayonza" required />
              </label>
              <label>
                Meal photo URL
                <input name="image" type="url" placeholder="https://example.com/chicken-meal.jpg" required />
              </label>
              <label className="seller-form-description">
                Product details
                <textarea name="description" rows="4" minLength="10" required />
              </label>
              <div className="seller-form-actions">
                <p>Your restaurant phone number will be shown to customers.</p>
                <button className="primary-button" type="submit">Add to Menu</button>
              </div>
            </form>
          </section>
        )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="footer-main">
          <div className="footer-brand">
            <a href="#home" className="logo footer-logo">
              <span aria-hidden="true">🐔</span>
              <span>
                Fresh<span className="logo-green">Chicken</span>
              </span>
            </a>
            <p>
              Connecting Kayonza restaurants, households, and local chicken
              suppliers, with delivery planned around customer needs.
            </p>
          </div>

          <nav className="footer-links" aria-label="Quick links">
            <h3>Quick Links</h3>
            <a href="#marketplace">Browse fresh chicken</a>
            <a href="#marketplace">Featured listings</a>
            <a href="#sell">List chicken</a>
            <a href="#delivery">Delivery planning</a>
          </nav>

          <nav className="footer-links" aria-label="Explore Fresh Chicken">
            <h3>Explore</h3>
            <a href="#about">About Fresh Chicken</a>
            <a href="#delivery">Plan delivery</a>
            <a href="#marketplace">Find a supplier</a>
            <a href="#contact">Restaurant and buyer support</a>
          </nav>

          <section className="footer-care" aria-labelledby="footer-care-title">
            <h3 id="footer-care-title">Customer Care</h3>
            <p className="footer-care-location">Kayonza District, Rwanda</p>
            <div className="footer-contact">
              <a href="tel:+250794214600">+250 794 214 600</a>
              <a href="tel:+250798657045">+250 798 657 045</a>
              <a href="mailto:henconnect@gmail.com">henconnect@gmail.com</a>
            </div>
            <p>
              Contact suppliers to confirm freshness, availability, price, and
              delivery timing for your restaurant or household.
            </p>
            <a href="#marketplace">Find a supplier</a>
          </section>
        </div>

        <div className="footer-bottom">
          <span>
            Copyright © 2026 FRESH CHICKEN | All rights reserved.
          </span>
        </div>
      </footer>

      {showAuth && (
        <div
          className="auth-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowAuth(false);
          }}
        >
          <section
            className="auth-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-dialog-title"
          >
            <div className="auth-dialog-heading">
              <h2 id="auth-dialog-title">Welcome to Fresh Chicken</h2>
              <button
                className="auth-close-button"
                type="button"
                onClick={() => setShowAuth(false)}
                aria-label="Close login and registration"
              >
                ×
              </button>
            </div>

            <div className="auth-google-area">
              <button
                className="auth-google-button"
                type="button"
                onClick={() =>
                  setMessage("Google sign-in will be available when accounts are connected.")
                }
              >
                G+ &nbsp; LOGIN WITH GOOGLE
              </button>
            </div>

            <div className="auth-forms">
              <form
                className="auth-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  setMessage("Login is not connected yet. Account setup is the next step.");
                }}
              >
                <h3>LOGIN</h3>
                <label htmlFor="login-email">Username or email address *</label>
                <input id="login-email" name="loginEmail" type="text" autoComplete="username" required />

                <label htmlFor="login-password">Password *</label>
                <input id="login-password" name="loginPassword" type="password" autoComplete="current-password" required />

                <label className="auth-remember">
                  <input type="checkbox" name="rememberMe" />
                  <span>Remember me</span>
                </label>

                <button className="auth-submit-button" type="submit">LOG IN</button>
                <button
                  className="auth-text-button"
                  type="button"
                  onClick={() =>
                    setMessage("Password recovery will be available when email accounts are connected.")
                  }
                >
                  Lost your password?
                </button>
              </form>

              <form
                className="auth-form auth-register-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  setMessage("Registration is not connected yet. Account setup is the next step.");
                }}
              >
                <h3>REGISTER</h3>
                <label htmlFor="register-email">Email address *</label>
                <input id="register-email" name="registerEmail" type="email" autoComplete="email" required />
                <p>A link to set a new password will be sent to your email address.</p>
                <button className="auth-submit-button" type="submit">REGISTER</button>
              </form>
            </div>
          </section>
        </div>
      )}

      {message && (
        <div className="toast" role="status">
          {message}
          <button onClick={() => setMessage("")}>✕</button>
        </div>
      )}
    </div>
  );
}

export default App;
