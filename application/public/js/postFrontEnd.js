/******************************************************************************
*
* JS File used to handle front-end event changes for post page mainly
* using map to identify different conditions for each field
*   
* Author(s): Brian Cheng
*
******************************************************************************/

/* Form Fields */
const productTitle = document.getElementById('product-title');
const productCategory = document.getElementById('product-category');
const productPrice = document.getElementById('product-price');
const productDesc = document.getElementById('product-desc');
const productImg = document.getElementById('product-img');

const form = document.getElementById('post-form');
const cancelButton = document.getElementById('cancel-button');
const postButton = document.getElementById('post-item-btn');

const warningElement = document.getElementById("notes-column").lastElementChild;


/* Conditions for each field are listed here. If field conditions become more complex, edit here */
function getTitleCondition() {
    // return (productTitle.value.match(/^ *$/) !== null);
    return /^ *$/.test(productTitle.value);
}
function getCategoryCondition() {
    return (productCategory.value === "Select:");
}
function getPriceCondition() {
    var fixedPrice = Number.parseFloat(productPrice.value).toFixed(2);
    return (!/^\d+(\.\d{2})$/.test(fixedPrice));
}
function getDescCondition() {
    return /^ *$/.test(productDesc.value);
}
function getImgCondition() {
    return (productImg.value === "");
}

/* This function updates the condition upon input event */
function setMap(map) {
    map.set(productTitle, getTitleCondition());
    map.set(productCategory, getCategoryCondition());
    map.set(productPrice, getPriceCondition());
    map.set(productDesc, getDescCondition());
    map.set(productImg, getImgCondition());
}

/* Title Front-end Validator */
productTitle.addEventListener("input", () => {
    if (getTitleCondition())
        productTitle.setAttribute("class", "form-control is-invalid");
    else
        productTitle.setAttribute("class", "form-control");
})

/* Category Front-end Validator */
productCategory.addEventListener("input", () => {
    if (getCategoryCondition())
        productCategory.setAttribute("class", "form-control is-invalid");
    else
        productCategory.setAttribute("class", "form-control");
})

/* Price Front-end Validator */
productPrice.addEventListener("input", () => {
    if (getPriceCondition())
        productPrice.setAttribute("class", "form-control is-invalid");
    else
        productPrice.setAttribute("class", "form-control");
})

/* Description Front-end Validator */
productDesc.addEventListener("input", () => {
    if (getDescCondition())
        productDesc.setAttribute("class", "form-control is-invalid");
    else
        productDesc.setAttribute("class", "form-control");
})

/* Image Front-end Validator */
productImg.addEventListener("input", () => {
    if (getImgCondition())
        productImg.setAttribute("class", "form-control is-invalid");
    else
        productImg.setAttribute("class", "form-control");
})


/* Post Button: Form will be able to submit if conditions are met */
postButton.addEventListener("click", (event) => {
    let condMap = new Map();
    setMap(condMap);
    let allValid = true;

    // postButton.type = "submit";
    condMap.forEach((value, key) => {
        if (value) {
            key.classList.add("is-invalid");
            warningElement.innerHTML="<em>Please enter all required fields before posting your item.</em>";
            allValid = false;
            event.preventDefault();
        }
    });
    if (allValid)
        form.submit();
})


/* Cancel Button: Resets form upon clicking 'Cancel'*/
cancelButton.onclick = () => {
    productTitle.value = "";
    productCategory.value = "Select:";
    productPrice.value = "";
    productDesc.value = "";
    productImg.value = "";

    let condMap = new Map();
    setMap(condMap);

    condMap.forEach((value, key) => {
        key.classList.remove("is-invalid");
    })
    warningElement.innerHTML="";
}