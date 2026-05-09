import React, {
  useState,
  useEffect,
} from "react";

export default function RMHPOS() {
  // =========================
  // DAILY BILL RESET
  // =========================

  const today =
    new Date().toLocaleDateString(
      "en-GB"
    );

  const savedDate =
    localStorage.getItem(
      "rmh_bill_date"
    );

  let savedBill = Number(
    localStorage.getItem(
      "rmh_bill_number"
    ) || 0
  );

  if (savedDate !== today) {
    localStorage.setItem(
      "rmh_bill_date",
      today
    );

    localStorage.setItem(
      "rmh_bill_number",
      0
    );

    savedBill = 0;
  }

  // =========================
  // STATES
  // =========================

  const [billNumber, setBillNumber] =
    useState(savedBill + 1);

  const [customer, setCustomer] =
    useState("Cash Customer");

  const [search, setSearch] =
    useState("");

  // =========================
  // CATEGORY STORAGE
  // =========================

  const [categories, setCategories] =
    useState(() => {
      const saved =
        localStorage.getItem(
          "rmh_categories"
        );

      return saved
        ? JSON.parse(saved)
        : [
            "Bedroom",
            "Decor",
            "Living",
          ];
    });

  // =========================
  // PRODUCT STORAGE
  // =========================

  const [products, setProducts] =
    useState(() => {
      const saved =
        localStorage.getItem(
          "rmh_products"
        );

      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 1,
              name:
                "Premium Bedsheet",
              price: 2499,
              category: "Bedroom",
            },

            {
              id: 2,
              name:
                "Designer Cushion",
              price: 699,
              category: "Decor",
            },

            {
              id: 3,
              name:
                "Luxury Curtain",
              price: 3499,
              category: "Living",
            },
          ];
    });

  // =========================
  // AUTO SAVE
  // =========================

  useEffect(() => {
    localStorage.setItem(
      "rmh_categories",
      JSON.stringify(categories)
    );
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(
      "rmh_products",
      JSON.stringify(products)
    );
  }, [products]);

  // =========================
  // OTHER STATES
  // =========================

  const [newCategory, setNewCategory] =
    useState("");

  const [productName, setProductName] =
    useState("");

  const [productPrice, setProductPrice] =
    useState("");

  const [productCategory, setProductCategory] =
    useState("Bedroom");

  const [cart, setCart] = useState([]);

  // =========================
  // CATEGORY FUNCTIONS
  // =========================

  const addCategory = () => {
    const trimmed =
      newCategory.trim();

    if (!trimmed) return;

    if (
      categories.includes(trimmed)
    ) {
      alert(
        "Category already exists"
      );

      return;
    }

    setCategories((prev) => [
      ...prev,
      trimmed,
    ]);

    setProductCategory(trimmed);

    setNewCategory("");

    alert("Category Added");
  };

  const deleteCategory = (
    categoryName
  ) => {
    setCategories(
      categories.filter(
        (cat) =>
          cat !== categoryName
      )
    );

    setProducts(
      products.filter(
        (p) =>
          p.category !==
          categoryName
      )
    );
  };

  // =========================
  // PRODUCT FUNCTIONS
  // =========================

  const addProduct = () => {
    if (
      productName.trim() ===
        "" ||
      productPrice.trim() === ""
    ) {
      alert(
        "Enter Product Details"
      );

      return;
    }

    const newProduct = {
      id: Date.now(),

      name:
        productName.trim(),

      price: Number(
        productPrice
      ),

      category:
        productCategory,
    };

    setProducts((prev) => [
      ...prev,
      newProduct,
    ]);

    setProductName("");

    setProductPrice("");

    alert(
      "Product Added Successfully"
    );
  };

  const deleteProduct = (id) => {
    setProducts(
      products.filter(
        (product) =>
          product.id !== id
      )
    );
  };

  // =========================
  // CART FUNCTIONS
  // =========================

  const addToCart = (product) => {
    const existing = cart.find(
      (item) =>
        item.id === product.id
    );

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                qty:
                  item.qty + 1,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          qty: 1,
        },
      ]);
    }
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              qty:
                item.qty + 1,
            }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                qty:
                  item.qty - 1,
              }
            : item
        )
        .filter(
          (item) => item.qty > 0
        )
    );
  };

  // =========================
  // BILLING
  // =========================

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      item.price * item.qty,
    0
  );

  const gst =
    subtotal - subtotal / 1.18;

  const total = subtotal;

  // =========================
  // SEARCH
  // =========================

  const filteredProducts =
    products.filter((p) =>
      p.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  // =========================
  // PRINT RECEIPT
  // =========================

  const printReceipt = () => {
    localStorage.setItem(
      "rmh_bill_number",
      billNumber
    );

    const receiptWindow =
      window.open(
        "",
        "_blank"
      );

    receiptWindow.document.write(`

      <html>

      <head>

        <title>Receipt</title>

        <style>

          body{
            font-family: monospace;
            width:80mm;
            margin:auto;
            padding:6px;
            font-size:12px;
            color:black;
          }

          .center{
            text-align:center;
          }

          img{
            width:90px;
            margin-bottom:6px;
          }

          table{
            width:100%;
            border-collapse:collapse;
          }

          th{
            text-align:left;
            border-bottom:1px dashed black;
            padding-bottom:4px;
          }

          td{
            padding:4px 0;
          }

          .right{
            text-align:right;
          }

          hr{
            border:none;
            border-top:1px dashed black;
            margin:8px 0;
          }

          .small{
            font-size:11px;
          }

        </style>

      </head>

      <body>

        <div class="center">

          <img src="/logo.jpeg" />

          <div
            style="
              font-size:18px;
              font-weight:bold;
              margin-bottom:5px;
            "
          >
            RADHA MADHAV HANDLOOM
          </div>

          <div class="small">
            Luxury Home Decor
          </div>

          <div class="small">
            Chennai, India
          </div>

        </div>

        <hr />

        <div>
          Bill No : ${billNumber}
        </div>

        <div>
          Date : ${new Date().toLocaleDateString(
            "en-GB"
          )}
        </div>

        <div>
          Time : ${new Date().toLocaleTimeString()}
        </div>

        <div>
          Customer : ${customer}
        </div>

        <hr />

        <table>

          <thead>

            <tr>

              <th>Item</th>

              <th class="right">
                Qty
              </th>

              <th class="right">
                Rate
              </th>

              <th class="right">
                Amt
              </th>

            </tr>

          </thead>

          <tbody>

            ${cart
              .map(
                (item) => `

              <tr>

                <td>
                  ${item.name}
                </td>

                <td class="right">
                  ${item.qty}
                </td>

                <td class="right">
                  ${item.price}
                </td>

                <td class="right">
                  ${
                    item.price *
                    item.qty
                  }
                </td>

              </tr>

            `
              )
              .join("")}

          </tbody>

        </table>

        <hr />

        <table>

          <tr>

            <td>
              GST Included
            </td>

            <td class="right">
              ₹${gst.toFixed(
                2
              )}
            </td>

          </tr>

          <tr>

            <td>
              TOTAL
            </td>

            <td class="right">
              ₹${total.toFixed(
                2
              )}
            </td>

          </tr>

        </table>

        <hr />

        <div class="center small">

          Thank you. Visit Again.<br/>

          Goods once sold cannot be returned

        </div>

        <script>

          window.onload = () => {
            window.print();
          }

        </script>

      </body>

      </html>

    `);

    receiptWindow.document.close();

    setBillNumber(
      billNumber + 1
    );

    setCart([]);
  };

  return (
    <div
      style={{
        background: "#ececec",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          background: "#7b0f1d",
          color: "white",
          padding: "20px",
          borderRadius: "20px",
          marginBottom: "20px",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>
            Radha Madhav Handloom
          </h1>

          <div
            style={{
              marginTop: "5px",
              color: "#f4d28b",
            }}
          >
            Bill No :
            {billNumber}
          </div>
        </div>

        <input
          placeholder="Search Products"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          style={{
            width: "300px",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            outline: "none",
          }}
        />
      </div>

      {/* MAIN */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 420px",
          gap: "20px",
        }}
      >
        {/* LEFT */}

        <div>
          {/* CATEGORY */}

          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "18px",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                color: "#7b0f1d",
              }}
            >
              Add Category
            </h2>

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <input
                placeholder="Category Name"
                value={newCategory}
                onChange={(e) =>
                  setNewCategory(
                    e.target.value
                  )
                }
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius:
                    "10px",
                  border:
                    "1px solid #ccc",
                }}
              />

              <button
                onClick={
                  addCategory
                }
                style={{
                  background:
                    "#c89b3c",
                  color: "white",
                  border: "none",
                  padding:
                    "12px 20px",
                  borderRadius:
                    "10px",
                  cursor:
                    "pointer",
                }}
              >
                Add
              </button>
            </div>
          </div>

          {/* PRODUCT */}

          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "18px",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                color: "#7b0f1d",
              }}
            >
              Add Product
            </h2>

            <input
              placeholder="Product Name"
              value={productName}
              onChange={(e) =>
                setProductName(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "12px",
                borderRadius:
                  "10px",
                border:
                  "1px solid #ccc",
                marginBottom:
                  "12px",
              }}
            />

            <input
              placeholder="Price"
              type="number"
              value={productPrice}
              onChange={(e) =>
                setProductPrice(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "12px",
                borderRadius:
                  "10px",
                border:
                  "1px solid #ccc",
                marginBottom:
                  "12px",
              }}
            />

            <select
              value={
                productCategory
              }
              onChange={(e) =>
                setProductCategory(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "12px",
                borderRadius:
                  "10px",
                border:
                  "1px solid #ccc",
                marginBottom:
                  "12px",
              }}
            >
              {categories.map(
                (cat) => (
                  <option
                    key={cat}
                  >
                    {cat}
                  </option>
                )
              )}
            </select>

            <button
              onClick={addProduct}
              style={{
                width: "100%",
                background:
                  "#7b0f1d",
                color: "white",
                border: "none",
                padding: "14px",
                borderRadius:
                  "10px",
                cursor:
                  "pointer",
                fontWeight:
                  "bold",
              }}
            >
              Add Product
            </button>
          </div>

          {/* CATEGORY LIST */}

          {categories.map(
            (category) => (
              <details
                key={category}
                open
                style={{
                  background:
                    "white",
                  borderRadius:
                    "16px",
                  marginBottom:
                    "16px",
                  overflow:
                    "hidden",
                }}
              >
                <summary
                  style={{
                    cursor:
                      "pointer",
                    padding:
                      "18px",
                    background:
                      "#7b0f1d",
                    color:
                      "white",
                    fontSize:
                      "18px",
                    fontWeight:
                      "bold",
                  }}
                >
                  {category}
                </summary>

                <div
                  style={{
                    padding:
                      "15px",
                  }}
                >
                  <button
                    onClick={() =>
                      deleteCategory(
                        category
                      )
                    }
                    style={{
                      background:
                        "#ff4d4d",
                      color:
                        "white",
                      border:
                        "none",
                      padding:
                        "8px 14px",
                      borderRadius:
                        "8px",
                      marginBottom:
                        "15px",
                      cursor:
                        "pointer",
                    }}
                  >
                    Delete Category
                  </button>

                  <div
                    style={{
                      display:
                        "flex",
                      flexDirection:
                        "column",
                      gap: "10px",
                    }}
                  >
                    {filteredProducts
                      .filter(
                        (p) =>
                          p.category ===
                          category
                      )
                      .map(
                        (
                          product
                        ) => (
                          <div
                            key={
                              product.id
                            }
                            style={{
                              background:
                                "#faf7f2",
                              border:
                                "1px solid #f0d7a1",
                              borderRadius:
                                "10px",
                              padding:
                                "12px",
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              alignItems:
                                "center",
                            }}
                          >
                            <div
                              onClick={() =>
                                addToCart(
                                  product
                                )
                              }
                              style={{
                                cursor:
                                  "pointer",
                                flex: 1,
                              }}
                            >
                              <div
                                style={{
                                  fontWeight:
                                    "600",
                                }}
                              >
                                {
                                  product.name
                                }
                              </div>

                              <div
                                style={{
                                  color:
                                    "#7b0f1d",
                                  fontWeight:
                                    "bold",
                                  marginTop:
                                    "5px",
                                }}
                              >
                                ₹
                                {
                                  product.price
                                }
                              </div>
                            </div>

                            <button
                              onClick={() =>
                                deleteProduct(
                                  product.id
                                )
                              }
                              style={{
                                background:
                                  "#ff4d4d",
                                color:
                                  "white",
                                border:
                                  "none",
                                padding:
                                  "8px 12px",
                                borderRadius:
                                  "8px",
                                cursor:
                                  "pointer",
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        )
                      )}
                  </div>
                </div>
              </details>
            )
          )}
        </div>

        {/* RIGHT */}

        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "20px",
            height: "95vh",
            overflow: "auto",
          }}
        >
          <h2
            style={{
              color: "#7b0f1d",
            }}
          >
            Current Bill
          </h2>

          <div
            style={{
              marginBottom:
                "15px",
              color: "#777",
            }}
          >
            Bill No :
            {billNumber}
          </div>

          <input
            placeholder="Customer Name"
            value={customer}
            onChange={(e) =>
              setCustomer(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "12px",
              borderRadius:
                "10px",
              border:
                "1px solid #ccc",
              marginBottom:
                "20px",
            }}
          />

          {/* CART */}

          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                borderBottom:
                  "1px solid #eee",
                paddingBottom:
                  "12px",
                marginBottom:
                  "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                }}
              >
                <strong>
                  {item.name}
                </strong>

                <strong>
                  ₹
                  {item.price *
                    item.qty}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: "10px",
                  marginTop:
                    "10px",
                }}
              >
                <button
                  onClick={() =>
                    decreaseQty(
                      item.id
                    )
                  }
                >
                  -
                </button>

                <span>
                  {item.qty}
                </span>

                <button
                  onClick={() =>
                    increaseQty(
                      item.id
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
          ))}

          {/* TOTAL */}

          <div
            style={{
              marginTop: "25px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                marginBottom:
                  "10px",
              }}
            >
              <span>
                GST Included
              </span>

              <span>
                ₹
                {gst.toFixed(
                  2
                )}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                fontSize: "32px",
                fontWeight:
                  "bold",
                color: "#7b0f1d",
              }}
            >
              <span>
                Total
              </span>

              <span>
                ₹
                {total.toFixed(
                  2
                )}
              </span>
            </div>
          </div>

          {/* PRINT */}

          <button
            onClick={
              printReceipt
            }
            style={{
              width: "100%",
              padding: "18px",
              background:
                "#7b0f1d",
              color: "white",
              border: "none",
              borderRadius:
                "12px",
              marginTop: "25px",
              cursor:
                "pointer",
              fontWeight:
                "bold",
              fontSize: "18px",
            }}
          >
            Print Thermal Bill
          </button>
        </div>
      </div>
    </div>
  );
}