//cart
let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');
let closeLogin = document.querySelector('#close-login');

async function load() {
    body = { empty: "empty" }
    const getallproducts = await fetch("http://localhost:4000/shopnow", {
        method: "POST",
        Credentials: "include",
        headers: { "Content-Type": "application/JSON" },
        body: JSON.stringify(body),
    });
    const result = await getallproducts.json();
    const result1 = result[0];
    for (var i = 0; i < result1.length; i++) {
        var tag = document.createElement("div");
        tag.className = 'product-box';
        var img = document.createElement("img");
        img.src = result1[i].img;
        img.className = 'product-img'
        var description = document.createElement("h2");
        description.dir = "rtl"
        description.textContent = result1[i].description;
        description.className = 'product-title'
        var price = document.createElement("span");
        price.className = 'price'
        price.textContent = result1[i].price;
        var carticon = document.createElement("i");
        carticon.className = 'bx bx-cart-alt add-cart'
        var element = document.getElementById("shop-content");
        tag.append(img)
        tag.append(description)
        tag.append(price)
        tag.append(carticon)
        element.appendChild(tag);
    }
    // }
    var name = document.getElementById("customerName");
    name.textContent = "Hello " + result[1];

    //update cart depend on username
    body = { fillcartdependoncustomer: 'fillcartdependoncustomer' }
    const fillcartdependoncustomer = await fetch("http://localhost:4000/shopnow", {
        method: "POST",
        Credentials: "include",
        headers: { "Content-Type": "application/JSON" },
        body: JSON.stringify(body),
    });
    const result2 = await fillcartdependoncustomer.json();
    var title;
    var price;
    var img;
    for (var i = 0; i < result2[0].length; i++) {
        for (var j = 0; j < result2[1].length; j++) {
            if (result2[1][j].productid == result2[0][i].productid) {
                title = result2[1][j].description;
                price = result2[1][j].price
                img = result2[1][j].img
            }
        }

        addProductToCart2(title, price, img, result2[0][i].quantity);
    }
    const fillRelevanteProducts = await fetch("http://localhost:4000/Relevant", {
        method: "POST",
        Credentials: "include",
        headers: { "Content-Type": "application/JSON" },
        // body: JSON.stringify(body),
    });
    const resultRe = await fillRelevanteProducts.json();
    array = []
    returnArray = []
    for (var j = 0; j < resultRe[1].length; j++) {
        if (getOccurrence(resultRe[0], resultRe[1][j].productid) >= 3) {
            array.push(resultRe[1][j].productid)
        }
    }

    for (var i = 0; i < array.length; i++) {
        x = 0
        for (var j = 0; j < resultRe[0].length; j++) {
            if (x == 0) {
                if (resultRe[0][j].productid == array[i]) {
                    returnArray.push(resultRe[0][j])
                    x = 1
                }
            }
        }
    }
    console.log(returnArray)
    // body = { array: returnArray }
    // const fillTheRe = await fetch("http://localhost:4000/fillRe", {
    //     method: "POST",
    //     Credentials: "include",
    //     headers: { "Content-Type": "application/JSON" },
    //     body: JSON.stringify(body),
    // });
    // const fillTheRelevant = await fillTheRe.json();
    for (var i = 0; i < returnArray.length; i++) {
        var container = document.createElement("div");
        container.className='container'
        var tag = document.createElement("div");
        tag.className = 'product-box';
        tag.id='product-boxRe'
        var img = document.createElement("img");
        img.id='product-imgRe'
        img.src = returnArray[i].img;
        img.className = 'product-img'
        var description = document.createElement("h5");
        description.dir = "rtl"
        description.textContent = returnArray[i].description;
        description.className = 'product-title'
        description.id='product-titleRe'
        var price = document.createElement("span");
        price.className = 'price'
        price.textContent = returnArray[i].price;
        price.id= 'priceRe'
        var carticon = document.createElement("i");
        carticon.className = 'bx bx-cart-alt add-cart'
        carticon.id='cartIcon'
        var element = document.getElementById("row-container");
        tag.append(img)
        tag.append(description)
        tag.append(price)
        tag.append(carticon)
        container.append(tag)
        element.appendChild(container);
    }
    var element = document.getElementById("row-container");
    var tag = document.createElement("div");
    tag.className= "clear"
    element.append(tag)
   
    updatetotal();
};
load();
//open cart 
cartIcon.onclick = () => {
    cart.classList.add('active');
}
//close cart
closeCart.onclick = () => {
    cart.classList.remove('active');
}
//cart work
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
}
else {
    ready();
}
// ready function
async function ready() {
    var removeCartButton = document.getElementsByClassName("cart-remove");
    // console.log(removeCartButton);
    for (var i = 0; i < removeCartButton.length; i++) {
        var button = removeCartButton[i];
        button.addEventListener('click', removeCartItem);
    }
    //quantity changes
    var quantityInputs = document.getElementsByClassName('cart-quantity')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged);

    }
    //add to cart
    var addCart = document.getElementsByClassName('add-cart');
    setTimeout(() => {
        for (var i = 0; i < addCart.length; i++) {
            var button = addCart[i]
            button.addEventListener('click', addCartClicked);
        }
    }, 1000);
    //buy Button work
    document.getElementsByClassName('btn-buy')[0].addEventListener('click', buyButtonClicked)
}
//buy Button
async function buyButtonClicked() {
    value = confirm("אתה בטוח?");
    if (value == true) {
        alert('your order is placed')
        var cartprice = document.getElementById('cart-price')
        var cartContent = document.getElementsByClassName('cart-content')[0]

        var allShoppingList = document.getElementById("cart-content").childNodes
        array = [];
        for (var j = 1; j < allShoppingList.length; j++) {
            console.log(allShoppingList[j].childNodes[1].childNodes[1].textContent + "what the hell")

            string = allShoppingList[j].childNodes[1].childNodes[1].textContent + "~" +
                allShoppingList[j].childNodes[1].childNodes[3].textContent + "~" + allShoppingList[j].childNodes[1].childNodes[5].value
            array.push(string)


        }
        console.log(array)

        const date = new Date();

        body = { array: array, date: date }
        const orderDetails = await fetch("http://localhost:4000/shopnow", {
            method: "POST",
            Credentials: "include",
            headers: { "Content-Type": "application/JSON" },
            body: JSON.stringify(body),
        });
        const result = await orderDetails.json();
        while (cartContent.hasChildNodes()) {

            cartContent.removeChild(cartContent.firstChild);
        }
        updatetotal();
        window.location.reload()
    }
}
//removeCartItem function
async function removeCartItem(event) {
    var buttonClicked = event.target;
    title = buttonClicked.parentElement.childNodes[1].childNodes[1].textContent
    console.log(buttonClicked.parentElement.childNodes[1].childNodes[1].textContent)
    body = { title: title, deletecart: 'deletefromcart' }

    const deletefromcart = await fetch("http://localhost:4000/shopnow", {
        method: "POST",
        Credentials: "include",
        headers: { "Content-Type": "application/JSON" },
        body: JSON.stringify(body),
    });
    const result = await deletefromcart.json();
    buttonClicked.parentElement.remove();
    //post tp update database 
    updatetotal();
}
//quantity changed
async function quantityChanged(event) {
    //change quantity in database
    var input = event.target
    title = input.parentElement.childNodes[1].textContent;
    quantity = input.parentElement.childNodes[5].value;
    updatetotal()
    body = { title: title, quantity: quantity, checkifthereisthisquantity: 'checkifthereisthisquantity' }
    const checkifthereisthisquantity = await fetch("http://localhost:4000/shopnow", {
        method: "POST",
        Credentials: "include",
        headers: { "Content-Type": "application/JSON" },
        body: JSON.stringify(body),
    });
    const resulty = await checkifthereisthisquantity.json();
    if (resulty[0] == 'failed') {
        alert("אין כל הכמות הזאת במלאי")
        input.parentElement.childNodes[5].value = resulty[1]
        updatetotal()
        // alert("אין כל הכמות הזאת במלאי")
    }
    else {
        console.log(input.parentElement.childNodes[1].textContent)
        body = { title: title, quantity: quantity, updateQuantity: 'updateQuantity' }
        if (isNaN(input.value) || input.value <= 0) {
            input.value = 1
        }
        else {
            console.log("shshh")
        }
        updatetotal();
        const updateQuantityInCart = await fetch("http://localhost:4000/shopnow", {
            method: "POST",
            Credentials: "include",
            headers: { "Content-Type": "application/JSON" },
            body: JSON.stringify(body),
        });
        const result = await updateQuantityInCart.json();
    }
}
//add to cart
function addCartClicked(event) {
    var button = event.target
    var shopProducts = button.parentElement
    var title = shopProducts.getElementsByClassName('product-title')[0].innerText
    var price = shopProducts.getElementsByClassName('price')[0].innerText
    var productImg = shopProducts.getElementsByClassName('product-img')[0].src
    addProductToCart(title, price, productImg)
    updatetotal();
}
async function addProductToCart(title, price, productImg) {
    body = { title: title, exist: 'checkifitemexist' }
    const checkifitemexist = await fetch("http://localhost:4000/shopnow", {
        method: "POST",
        Credentials: "include",
        headers: { "Content-Type": "application/JSON" },
        body: JSON.stringify(body),
    });
    const result1 = await checkifitemexist.json();
    if (result1 == 'success') {
        var cartShopBox = document.createElement('div')
        cartShopBox.classList.add('cart-Box')
        var cartItems = document.getElementsByClassName('cart-content')[0]
        var cartItemsNames = cartItems.getElementsByClassName('cart-product-title')
        for (var i = 0; i < cartItemsNames.length; i++) {
            console.log(cartItemsNames[i].innerText)
            console.log("1")
            if (cartItemsNames[i].innerText.toLowerCase() == title.toLowerCase()) {
                alert("you have aleady add this item to cart")
                return;
            }
        }

        var cartBoxContent = `<img src="${productImg}" alt="" class="cart-img"><div class="detail-box" id="detail-box">  <div class="cart-product-title" dir="rtl">${title}</div>   <div class="cart-price" id="cart-price">${price}</div>   <input type="number" value="1" class="cart-quantity"></div> <i class="bx bxs-trash cart-remove"></i><style></style>`
        cartShopBox.innerHTML = cartBoxContent;
        cartItems.append(cartShopBox)
        cartShopBox.getElementsByClassName('cart-remove')[0]
            .addEventListener('click', removeCartItem)
        cartShopBox.getElementsByClassName('cart-quantity')[0].addEventListener('change', quantityChanged)
        updatetotal();
        //post add to database
        body = { title: title, cart: 'additemtocart' }
        const updatecart = await fetch("http://localhost:4000/shopnow", {
            method: "POST",
            Credentials: "include",
            headers: { "Content-Type": "application/JSON" },
            body: JSON.stringify(body),
        });
        const result = await updatecart.json();
    }
    else {
        alert("אזל מהמלאי")
    }
}
async function addProductToCart2(title, price, productImg, quantity) {
    var cartShopBox = document.createElement('div')
    cartShopBox.classList.add('cart-Box')
    var cartItems = document.getElementsByClassName('cart-content')[0]
    var cartItemsNames = cartItems.getElementsByClassName('cart-product-title')
    for (var i = 0; i < cartItemsNames.length; i++) {
        console.log(cartItemsNames[i].innerText)
        console.log("1")
        if (cartItemsNames[i].innerText.toLowerCase() == title.toLowerCase()) {
            alert("you have aleady add this item to cart")
            return;
        }
    }
    var cartBoxContent = `<img src="${productImg}" alt="" class="cart-img"><div class="detail-box" id="detail-box">  <div class="cart-product-title" dir="rtl">${title}</div>   <div class="cart-price" id="cart-price">${price}</div>   <input type="number" value="${quantity}" class="cart-quantity"></div> <i class="bx bxs-trash cart-remove"></i><style></style>`
    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox)
    cartShopBox.getElementsByClassName('cart-remove')[0]
        .addEventListener('click', removeCartItem)
    cartShopBox.getElementsByClassName('cart-quantity')[0].addEventListener('change', quantityChanged)
    updatetotal();
}
//update total function
function updatetotal() {
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-Box');
    var total = 0;
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var priceEle = cartBox.getElementsByClassName('cart-price')[0];
        var quanEle = cartBox.getElementsByClassName('cart-quantity')[0];
        var price = parseFloat(priceEle.innerText.replace("ILS", ""));
        var quan = quanEle.value;
        total = total + (price * quan);
    }
    //if cart contain some cent value
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('total-price')[0].innerText = total + 'ILS';

}
function signup() {
    var url = 'http://localhost:4000/signup';
    location.href = url;
}

$('#meatType').change(async function () {
    var element = document.getElementById("shop-content");
    element.innerHTML = ''
    d = document.getElementById("meatType").value;
    body = { meatType: d }
    const getallproducts = await fetch("http://localhost:4000/changeMeatType", {
        method: "POST",
        Credentials: "include",
        headers: { "Content-Type": "application/JSON" },
        body: JSON.stringify(body),
    });
    const result = await getallproducts.json();
    for (var i = 0; i < result.length; i++) {
        var tag = document.createElement("div");
        tag.className = 'product-box';
        var img = document.createElement("img");
        img.src = result[i].img;
        img.className = 'product-img'
        var description = document.createElement("h2");
        description.dir = "rtl"
        description.textContent = result[i].description;
        description.className = 'product-title'
        var price = document.createElement("span");
        price.className = 'price'
        price.textContent = result[i].price;

        var carticon = document.createElement("i");
        carticon.className = 'bx bx-cart-alt add-cart'

        tag.append(img)
        tag.append(description)
        tag.append(price)
        tag.append(carticon)

        element.appendChild(tag);
    }
    var addCart = document.getElementsByClassName('add-cart');
    setTimeout(() => {
        for (var i = 0; i < addCart.length; i++) {
            var button = addCart[i]
            button.addEventListener('click', addCartClicked);
        }
    }, 1000);
})

var right = 0;
var maxMargin;
var jumpMargin = 150;

function setWidth() {
    var boxwidth = document.querySelector(".container").offsetWidth;
    var displaywidth = document.querySelector(".row").offsetWidth;
    var displayheight = document.querySelector(".row").offsetHeight;
    var children = document.querySelectorAll(".row-container > .container").length;
    var outerboxwidth = children * boxwidth + (children * 10);
    document.querySelector(".row-container").style.width = outerboxwidth + "px";
    document.querySelectorAll("button")[0].style.height = displayheight + "px";
    document.querySelectorAll("button")[1].style.height = displayheight + "px";
    maxMargin = outerboxwidth - displaywidth;
}

function slideLeft(event) {
    var rowcont = document.querySelector(".row-container");
    if (right <= -maxMargin) {
        event.preventDefault();
    }
    else {
        right -= jumpMargin;
    }
    rowcont.style.marginLeft = right + "px";
}

function slideRight(event) {
    var rowcont = document.querySelector(".row-container");
    if (right == 0) {
        event.preventDefault();
    }
    else if (right >= maxMargin) {
        event.preventDefault();
    }
    else {
        right += jumpMargin;
    }
    rowcont.style.marginLeft = right + "px";
}
function getOccurrence(array, value) {
    var count = 0;
    array.forEach((v) => (v.productid === value && count++));
    return count;
}
window.onload = setWidth;