const OWNER = "JustT8x";

/* =========================
   SUPABASE
========================= */

const SUPABASE_URL =
    "https://zugkiijozpscsmpxcfrb.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_uOPOiIJlSMYI1qO-czuLTQ_AUoJsFEq";


/* =========================
   DISCOUNT
========================= */

const DISCOUNT_CODE = "T8X5OFF";

const DISCOUNT_AMOUNT = 5;

let discountApplied = false;
let discountUsed = false;


/* =========================
   GAMES
========================= */

const games = {

    freefire: {
        name: "Free Fire",
        category: "FREE FIRE",
        image: "images/freefire.jpg",
        currencyImage: "images/freefire-diamond.png",

        packages: [
            ["50 جوهرة", 30],
            ["110 جوهرة", 55],
            ["231 جوهرة", 105],
            ["310 جوهرة", 155],
            ["583 جوهرة", 260],
            ["1188 جوهرة", 505],
            ["2420 جوهرة", 1005]
        ]
    },

    pubg: {
        name: "PUBG Mobile",
        category: "PUBG MOBILE",
        image: "images/pubg.jpg",
        currencyImage: "images/pubg-uc.png",

        packages: [
            ["30 UC", 30],
            ["60 UC", 55],
            ["325 UC", 245],
            ["660 UC", 485],
            ["1800 UC", 1205],
            ["3850 UC", 2405],
            ["8100 UC", 4805]
        ]
    },

    fc: {
        name: "FC Mobile",
        category: "FC MOBILE",
        image: "images/fc-mobile.jpg",
        currencyImage: "images/fc-points.png",

        packages: [
            ["40 FC Points", 25],
            ["100 FC Points", 55],
            ["520 FC Points", 255],
            ["1070 FC Points", 505],
            ["2200 FC Points", 1005],
            ["5750 FC Points", 2505]
        ]
    }

};


let currentGame = null;

let cart = [];

let finalMessage = "";


/* =========================
   LOAD CART
========================= */

try {

    cart =
        JSON.parse(
            localStorage.getItem("t8x_cart")
        ) || [];

} catch (error) {

    cart = [];

}


/* =========================
   LOADER
========================= */

window.addEventListener("load", () => {

    setTimeout(() => {

        const loader =
            document.getElementById("loader");

        if (!loader) return;

        loader.style.opacity = "0";

        setTimeout(() => {

            loader.style.display = "none";

        }, 500);

    }, 900);

});


/* =========================
   OPEN GAME
========================= */

function openGame(id) {

    currentGame = games[id];

    if (!currentGame) return;


    document
        .querySelector(".hero")
        .classList.add("hidden");


    document
        .getElementById("games")
        .classList.add("hidden");


    document
        .getElementById("faq")
        .classList.add("hidden");


    document
        .getElementById("shop")
        .classList.remove("hidden");


    document
        .getElementById("gameCategory")
        .textContent =
        currentGame.category;


    document
        .getElementById("gameTitle")
        .textContent =
        currentGame.name;


    document
        .getElementById("gameMiniImage")
        .src =
        currentGame.image;


    document
        .getElementById("playerId")
        .value = "";


    document
        .getElementById("packageSearch")
        .value = "";


    renderPackages();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================
   RENDER PACKAGES
========================= */

function renderPackages() {

    const grid =
        document.getElementById(
            "packagesGrid"
        );


    if (!grid || !currentGame) return;


    grid.innerHTML = "";


    currentGame.packages.forEach((item) => {

        const amount = item[0];

        const price = item[1];


        const card =
            document.createElement("div");


        card.className = "package";


        card.dataset.search =
            `${amount} ${price}`.toLowerCase();


        card.innerHTML = `

            <div class="package-icon">

                <img
                    src="${currentGame.currencyImage}"
                    alt="${amount}"
                >

            </div>

            <small>
                كمية الشحن
            </small>

            <h3>
                ${amount}
            </h3>

            <div class="package-price">
                ${price} جنيه
            </div>

            <button
                class="package-add"
                type="button"
            >
                🛒 إضافة للطلب
            </button>

        `;


        card.addEventListener("click", () => {

            const playerId =
                document
                    .getElementById("playerId")
                    .value
                    .trim();


            addToCart({

                game: currentGame.name,

                amount: amount,

                price: price,

                playerId: playerId,

                image: currentGame.currencyImage,

                quantity: 1

            });

        });


        grid.appendChild(card);

    });

}


/* =========================
   SEARCH
========================= */

function filterPackages() {

    const input =
        document.getElementById(
            "packageSearch"
        );


    if (!input) return;


    const query =
        input.value
            .toLowerCase()
            .trim();


    document
        .querySelectorAll(".package")
        .forEach(card => {

            card.style.display =
                card.dataset.search.includes(query)
                    ? ""
                    : "none";

        });

}


/* =========================
   ADD TO CART
========================= */

function addToCart(item) {

    cart.push(item);

    saveCart();

    updateCart();


    showToast(
        "تمت إضافة الباقة إلى السلة ✓"
    );

}


/* =========================
   SAVE CART
========================= */

function saveCart() {

    localStorage.setItem(
        "t8x_cart",
        JSON.stringify(cart)
    );


    updateCartCount();

}


/* =========================
   CART COUNT
========================= */

function updateCartCount() {

    const count =
        document.getElementById(
            "cartCount"
        );


    if (!count) return;


    count.textContent =
        cart.reduce(

            (total, item) =>
                total +
                Number(item.quantity || 0),

            0

        );

}


/* =========================
   UPDATE CART
========================= */

function updateCart() {

    updateCartCount();


    const container =
        document.getElementById(
            "cartItems"
        );


    const empty =
        document.getElementById(
            "cartEmpty"
        );


    const bottom =
        document.getElementById(
            "cartBottom"
        );


    if (!container || !empty || !bottom) {
        return;
    }


    container.innerHTML = "";


    if (cart.length === 0) {

        empty.classList.remove("hidden");

        bottom.classList.add("hidden");

        return;

    }


    empty.classList.add("hidden");

    bottom.classList.remove("hidden");


    let total = 0;


    cart.forEach((item, index) => {

        total +=
            Number(item.price) *
            Number(item.quantity);


        const row =
            document.createElement("div");


        row.className =
            "cart-item";


        row.innerHTML = `

            <div class="cart-item-icon">

                <img
                    src="${item.image}"
                    alt=""
                >

            </div>


            <div class="cart-item-info">

                <b>
                    ${item.game}
                </b>


                <small>
                    ${item.amount}
                </small>


                <small>
                    🆔 ID:
                    ${
                        item.playerId
                        ?
                        item.playerId
                        :
                        "لم يتم إدخاله"
                    }
                </small>


                <strong>

                    ${
                        Number(item.price) *
                        Number(item.quantity)
                    }

                    جنيه

                </strong>


                <div class="quantity-controls">

                    <button
                        onclick="changeQuantity(${index}, -1)"
                    >
                        −
                    </button>


                    <span>
                        ${item.quantity}
                    </span>


                    <button
                        onclick="changeQuantity(${index}, 1)"
                    >
                        +
                    </button>

                </div>

            </div>


            <button
                class="remove-item"
                onclick="removeFromCart(${index})"
            >
                ✕
            </button>

        `;


        container.appendChild(row);

    });


    document
        .getElementById("cartTotal")
        .textContent =
        total + " جنيه";

}


/* =========================
   QUANTITY
========================= */

function changeQuantity(index, change) {

    if (!cart[index]) return;


    cart[index].quantity =
        Number(cart[index].quantity) +
        change;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    saveCart();

    updateCart();

}


/* =========================
   REMOVE
========================= */

function removeFromCart(index) {

    if (!cart[index]) return;


    cart.splice(index, 1);

    saveCart();

    updateCart();


    showToast(
        "تم حذف الباقة"
    );

}


/* =========================
   OPEN CART
========================= */

function openCart() {

    updateCart();


    document
        .getElementById("cartOverlay")
        .classList.remove("hidden");

}


/* =========================
   CLOSE CART
========================= */

function closeCart() {

    document
        .getElementById("cartOverlay")
        .classList.add("hidden");

}


/* =========================
   DISCOUNT
========================= */

function getCartTotal() {

    return cart.reduce(

        (sum, item) =>
            sum +
            Number(item.price) *
            Number(item.quantity),

        0

    );

}


function applyDiscount() {

    const input =
        document.getElementById(
            "discountCode"
        );


    if (!input) {

        showToast(
            "خانة كود الخصم غير موجودة"
        );

        return;

    }


    const code =
        input.value
            .trim()
            .toUpperCase();


    if (!code) {

        showToast(
            "اكتب كود الخصم"
        );

        return;

    }


    if (code !== DISCOUNT_CODE) {

        showToast(
            "كود الخصم غير صحيح"
        );

        discountApplied = false;

        discountUsed = false;

        updateDiscountDisplay();

        return;

    }


    discountApplied = true;

    discountUsed = false;


    updateDiscountDisplay();


    showToast(
        "تم تطبيق خصم 5 جنيه ✓"
    );

}


function updateDiscountDisplay() {

    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    if (!totalElement) return;


    const total =
        getCartTotal();


    if (
        discountApplied &&
        !discountUsed
    ) {

        const newTotal =
            Math.max(
                0,
                total - DISCOUNT_AMOUNT
            );


        totalElement.innerHTML = `

            <span style="text-decoration:line-through;color:#71879f;">
                ${total} جنيه
            </span>

            <br>

            <strong style="color:#65c7ff;">
                ${newTotal} جنيه
            </strong>

        `;

    } else {

        totalElement.textContent =
            total + " جنيه";

    }

}


/* =========================
   CHECKOUT
========================= */

function checkout() {

    if (cart.length === 0) {

        showToast(
            "السلة فارغة"
        );

        return;

    }


    const orderNumber =
        "T8X-" +
        Date.now()
            .toString()
            .slice(-6);


    const originalTotal =
        getCartTotal();


    let discount = 0;


    if (
        discountApplied &&
        !discountUsed
    ) {

        discount =
            Math.min(
                DISCOUNT_AMOUNT,
                originalTotal
            );

    }


    const finalTotal =
        originalTotal - discount;


    let message =

`🎮 T8X Store

🧾 رقم الطلب: ${orderNumber}

`;


    cart.forEach((item, index) => {

        message +=

`${index + 1}️⃣ اللعبة: ${item.game}
📦 كمية الشحن: ${item.amount}
🆔 ID اللاعب: ${
    item.playerId
    ?
    item.playerId
    :
    "لم يتم إدخاله"
}
🔢 العدد: ${item.quantity}
💰 السعر: ${
    Number(item.price) *
    Number(item.quantity)
} جنيه

`;

    });


    if (discount > 0) {

        message +=

`🏷️ كود الخصم: ${DISCOUNT_CODE}
💸 قيمة الخصم: ${discount} جنيه

`;

    }


    message +=

`💵 الإجمالي قبل الخصم: ${originalTotal} جنيه
💵 الإجمالي النهائي: ${finalTotal} جنيه

📌 يرجى التواصل مع المالك لإتمام عملية الشحن.`;


    finalMessage = message;


    document
        .getElementById("orderNumber")
        .textContent =
        "رقم الطلب: " +
        orderNumber;


    document
        .getElementById("finalOrder")
        .textContent =
        message;


    document
        .getElementById("finalTotal")
        .textContent =
        finalTotal + " جنيه";


    const telegramURL =
        "https://t.me/" +
        OWNER +
        "?text=" +
        encodeURIComponent(message);


    document
        .getElementById("telegramLink")
        .href =
        telegramURL;


    closeCart();


    document
        .getElementById("orderOverlay")
        .classList.remove("hidden");


    /*
       مهم:
       الكود لا يعتبر مستخدمًا هنا.
       مجرد الوصول لمراجعة الطلب لا يحذف الخصم.
    */

}


/* =========================
   CLOSE ORDER
========================= */

function closeOrder() {

    document
        .getElementById("orderOverlay")
        .classList.add(
            "hidden"
        );

}


/* =========================
   COPY ORDER
========================= */

async function copyOrder() {

    try {

        await navigator.clipboard.writeText(
            finalMessage
        );

    } catch (error) {

        const area =
            document.createElement(
                "textarea"
            );


        area.value =
            finalMessage;


        document.body.appendChild(
            area
        );


        area.select();


        document.execCommand(
            "copy"
        );


        area.remove();

    }


    showToast(
        "تم نسخ الطلب ✓"
    );

}


/* =========================
   HOME
========================= */

function goHome() {

    document
        .getElementById("shop")
        .classList.add("hidden");


    document
        .querySelector(".hero")
        .classList.remove("hidden");


    document
        .getElementById("games")
        .classList.remove("hidden");


    document
        .getElementById("faq")
        .classList.remove("hidden");


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================
   TOAST
========================= */

function showToast(text) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) return;


    toast.textContent =
        text;


    toast.classList.add(
        "show"
    );


    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    }, 2200);

}


/* =========================
   START
========================= */

updateCartCount();

updateCart();