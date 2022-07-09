class CartItem{
    constructor(name,desc,img,price){
        this.name=name,
        this.desc=desc,
        this.img=img,
        this.price=price,
        this.quantity=1
    }
}
class localCart{
    static key ='cartItems'

    static getLocalCartItems (){
        const cartMap=new Map()
        const cart=localStorage.getItem(localCart.key)
        if(cart===null||cart.length===0) return cartMap
        return new Map(Object.entries(JSON.parse(cart)))

    }

    static addItemToLocalCart(id,item){
        let cart=localCart.getLocalCartItems()
        if(cart.has(id)){
            let mapItem= cart.get(id)
            mapItem.quantity+=1
            cart.set(id, mapItem)
        }
        else
        cart.set(id, item)
        localStorage.setItem(localCart.key, JSON.stringify(Object.fromEntries(cart)))
        updateCartUi()
    }
    static removeItemFromLocalCart(id){
        let cart=localCart.getLocalCartItems()
        if(cart.has(id)){
            let mapItem= cart.get(id)
            if(mapItem.quantity>1){
                mapItem.quantity-=1
                cart.set(id, mapItem)
            }
            else 
            cart.delete(id)

            if(localStorage.length===0)
            localStorage.clear()
            else
            localStorage.setItem(localCart.key, JSON.stringify(Object.fromEntries(cart)))
            updateCartUi()
        }
    }

}



//const card=document.querySelectorAll('.card')
//console.log(card.firstChild)
const cartIcon=document.querySelector('#icon')
const wholeCartWindow=document.querySelector(".whole-cart-window")
wholeCartWindow.inWindow=0;
//const cartBox=document.querySelector('.cart-box')
//const navWrapper=!!document.querySelector('.nav-wrapper')
const addToCartBtn=document.querySelectorAll('.order-button')

const addToCartFunctionality=function(e){
    const id=e.target.parentElement.parentElement.getAttribute('data-id')
    const img=e.target.parentElement.parentElement.children[0].children[0].src
    const name=e.target.parentElement.previousElementSibling.children[0].textContent
    const desc=e.target.parentElement.previousElementSibling.children[2].textContent
    let price=e.target.parentElement.previousElementSibling.children[1].textContent
        price=price.replace("price: $",'')
    const item=new CartItem(name, desc, img, price)
    localCart.addItemToLocalCart(id,item)
        //console.log(price)
}
addToCartBtn.forEach((btn)=>{
    btn.addEventListener('click',addToCartFunctionality)
})

cartIcon.addEventListener('mouseover',()=>{
   if(wholeCartWindow.classList.contains('hide'))
   wholeCartWindow.classList.remove('hide')
})

cartIcon.addEventListener('mouseleave',()=>{
    //if(wholeCartWindow.classList.contains('hide'))
    setTimeout( ()=>{
        if(wholeCartWindow.inWindow===0)
        wholeCartWindow.classList.add('hide')
    }, 500)
 })

 wholeCartWindow.addEventListener('mouseover', ()=>{
    wholeCartWindow.inWindow=1;
 })

 wholeCartWindow.addEventListener('mouseleave', ()=>{
    wholeCartWindow.inWindow=0;
    wholeCartWindow.classList.add('hide');
 })
 
 function updateCartUi(){
    const cartWrapper=document.querySelector('.cart-wrapper')
    cartWrapper.innerHTML=''
    const items=localCart.getLocalCartItems('cartItems')
    if(items===null) return
    let count=0
    let total=0
    for(const [key,value] of items.entries()){
        const cartItem=document.createElement('div')
        cartItem.classList.add('cart-item')
        let price=value.price*value.quantity
        count+=1
        total+=price

        cartItem.innerHTML=`
        <img src="${value.img}">
                            <div class="details">
                              <h4>${value.name}</h4>
                              <p>${value.desc}
                                <span class="quantity">quantity: ${value.quantity}</span>
                                <span class="price">price: $${price}</span>
                              </p>
                            </div>
                            <div class="cancel"><span class="material-icons">
                              cancel
                              </span></div>
        `
        //const cancel=cartItem.lastChild
        //console.log(cartItem.lastElementChild)
       cartItem.lastElementChild.addEventListener('click',()=>{
          localCart.removeItemFromLocalCart(key)
            
        })
        //cancelBtn.addEventListener('click',()=>{
         // localCart.removeItemFromLocalCart(key)
       // })
        cartWrapper.append(cartItem)
    }
    if(count>0){
        cartIcon.classList.add('non-empty')
        let root=document.querySelector(':root')
        root.style.setProperty('--after-content', `"${count}"`)
        const subtotal=document.querySelector('.subtotal')
        subtotal.innerHTML=`subTotal: $${total}`
        const checkOut=document.querySelector('.checkout')
        checkOut.addEventListener('click',()=>{
            alert('Your order has been received, you will be notified on delivery')
        })
    }
    else{
        cartIcon.classList.remove('non-empty')
    }
 }
 