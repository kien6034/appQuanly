function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

window.addEventListener('DOMContentLoaded', ()=>{
    addItemToCart();
    initialQuantiyEvent();
    reCalculateTotal();
    checkoutEvent();
})

function initialQuantiyEvent(){
    const itemElements = document.querySelectorAll('.item-element');

    itemElements.forEach(item => {
        const pId = item.getAttribute("data-id");
        const plus = item.querySelector(".priceu .quantity .plus");
        const minus = item.querySelector(".priceu .quantity .minus");
        const qNumber = item.querySelector('.priceu .quantity .number');

        plus.addEventListener('click', ()=>{
            updateQuantityServer(pId, "plus", qNumber)
        })
    
        minus.addEventListener('click', ()=>{
            updateQuantityServer(pId, "minus", qNumber)
        })
    })
}

function addItemToCart(){
    const addBtn = document.getElementById("add-item-btn");
    const inputField = document.getElementById("add-item-input");

    //TODO: event for input field

    addBtn.addEventListener('click', ()=>{
        const value = inputField.value;
        
        if (value != ""){
            addInServer(value);
        }
    })
}

function addInServer(value){
    const url = "/API/addItem"
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'value': value})
    })

    .then((response)=>{
        return response.json() 
    })

    .then((data)=>{
        var price = data["price"];
        //TODO

        addUI(data["code"], data["name"], data["price"], data["id"])
    })
}


function addUI(code, name, price, pItemId){
    addUIHandleBar(code, name, price, pItemId)

    //giao dien phan checkout
    addUICheckoutHandlebar(name, price, pItemId)

    //recalculate total
    reCalculateTotal()
}

function addUIHandleBar(code, name, price, pItemId){
    const raw = document.getElementById("itemInCartHandlebar").innerHTML;
    let compliedTemplate = Handlebars.compile(raw);

    let ourGeneratedHtml = compliedTemplate({'code': code, 'name': name, 'price': price});

    const node = document.createElement('div');
    node.classList = "item-element"
    const nodeId = "pItem-" + pItemId;
    node.id = "pItem-" + pItemId;
    node.innerHTML = ourGeneratedHtml;
    
    const plus = node.querySelector(".priceu .quantity .plus");
    const minus = node.querySelector(".priceu .quantity .minus");
    const qNumber = node.querySelector('.priceu .quantity .number');
    document.getElementById("cart-lists").appendChild(node);

    
    plus.addEventListener('click', ()=>{
        updateQuantityServer(pItemId, "plus", qNumber)
    })

    minus.addEventListener('click', ()=>{
        updateQuantityServer(pItemId, "minus", qNumber)
    })
}


function addUICheckoutHandlebar(name, price, pItemId){
    const raw = document.getElementById("itemInCheckoutHandlebar").innerHTML;
    let compliedTemplate = Handlebars.compile(raw);

    let ourGeneratedHtml = compliedTemplate({'name': name, 'price': price});

    const node = document.createElement('div');
    const nodeId = "pcoItem-" + pItemId;
    node.id = nodeId;
    node.innerHTML = ourGeneratedHtml;

    document.getElementById("order-list-items").appendChild(node);
}   


function updateQuantityServer(itemId, type, qNumber){
    //TODO: update in server
    const url = "/API/updateQuantity"
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'itemId': itemId, 'type': type})
    })

    .then((response)=>{
        return response.text() 
    })

    .then((text)=>{
        //update quantity in checkout
        const pcoId = "pcoItem-" + itemId;
        const pcoItem= document.getElementById(pcoId);

        if(text == "0"){
            const pId = "pItem-" + itemId;
            const pObject = document.getElementById(pId);
            pObject.classList.add('hidden');
            pcoItem.classList.add('hidden')
        }
        qNumber.innerText = text;
        pcoItem.querySelector('.order-item .nameu .number').innerText  = text;
        reCalculateTotal();
        
    })

}


function reCalculateTotal(){
    items = document.querySelectorAll('.order-item');

    var total = 0;
    items.forEach(item => {
        //get quantiy
        const quantity = item.querySelector('.nameu .number').innerText;
        const price = item.querySelector('.price').innerText;

        total += parseInt(quantity) * parseInt(price);
    })

    //update in cart
    const totalMoney = document.getElementById("total-money");
    totalMoney.innerText = total;
}



function checkoutEvent(){
    const btn = document.getElementById("checkoutBtn");

    btn.addEventListener('click', ()=>{
        
    })
}

// const url = "/API/updateQuantity"
//     fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'X-CSRFToken':csrftoken,
//         },
//         body:JSON.stringify({'itemId': itemId, 'type': type})
//     })

//     .then((response)=>{
//         return response.text() 
//     })

//     .then((text)=>{
//         //update quantity in checkout
        
        
//     })