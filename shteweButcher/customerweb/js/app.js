//cart
let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');
let closeLogin = document.querySelector('#close-login');
 async function load() {
    const getallproducts = await fetch("http://localhost:3000/", {
        method: "POST",
        Credentials: "include",
        headers: { "Content-Type": "application/JSON" },
    });
    const result = await getallproducts.json();

    for (var i = 0; i < result.length; i++) {
        console.log(result[i])
        var tag = document.createElement("div");
        tag.className = 'product-box';
        var img = document.createElement("img");
        img.src = result[i].img;
        img.className='product-img'
        var description = document.createElement("h2");
        description.textContent = result[i].description;
        description.className='product-title'
        var price = document.createElement("span");
        price.className='price'
        price.textContent = result[i].price;

        var carticon = document.createElement("i");
        carticon.className = 'bx bx-cart-alt add-cart'
        carticon.tagName='add-cart'
        // carticon.className = 'add-cart'
        var element = document.getElementById("shop-content");
        tag.append(img)
        tag.append(description)
        tag.append(price)
        tag.append(carticon)

        element.appendChild(tag);

    }
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
async function  ready() {
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
            console.log("50")
            var button = addCart[i]
            button.addEventListener('click',addCartClicked);
        }
    }, 1000);
    
    
    
    //buy Button work
    document.getElementsByClassName('btn-buy')[0].addEventListener('click', buyButtonClicked)
}
//buy Button
function buyButtonClicked() {
    alert('your order is placed')
    var cartContent = document.getElementsByClassName('cart-content')[0]
    while (cartContent.hasChildNodes()) {
        cartContent.removeChild(cartContent.firstChild);
    }
    updatetotal();
}
//removeCartItem function
function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updatetotal();
}
//quantity changed
function quantityChanged(event) {
    console.log("4")
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    else {
        console.log("shshh")
    }
    updatetotal();
}
//add to cart
function addCartClicked(event) {
    console.log("2")
    var button = event.target
    var shopProducts = button.parentElement
    var title = shopProducts.getElementsByClassName('product-title')[0].innerText
    var price = shopProducts.getElementsByClassName('price')[0].innerText
    var productImg = shopProducts.getElementsByClassName('product-img')[0].src
    addProductToCart(title, price, productImg)
    updatetotal();
}
function addProductToCart(title, price, productImg) {
    console.log("3")
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


    var cartBoxContent = `<img src="${productImg}" alt="" class="cart-img"><div class="detail-box">  <div class="cart-product-title">${title}</div>   <div class="cart-price">${price}</div>   <input type="number" value="1" class="cart-quantity"></div> <i class="bx bxs-trash cart-remove"></i><style></style>`
    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox)
    cartShopBox.getElementsByClassName('cart-remove')[0]
        .addEventListener('click', removeCartItem)
    cartShopBox.getElementsByClassName('cart-quantity')[0].addEventListener('change', quantityChanged)
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
        var price = parseFloat(priceEle.innerText.replace("$", ""));
        var quan = quanEle.value;
        total = total + (price * quan);
    }
    //if cart contain some cent value
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('total-price')[0].innerText = total + '$';

}
function signup() {
    var url = 'http://localhost:3000/signup';
    location.href = url;
}

