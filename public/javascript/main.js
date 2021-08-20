var Product = require("../models/Product"),
	Review = require("../models/Review");

/* header */
var i = 0;
var headImages = [];
var time = 5000;

headImages[0] = 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60';
headImages[1] = 'https://images.unsplash.com/photo-1545601445-4d6a0a0565f0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60';
headImages[2] = 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60';

function changeHeadImg(){
	var image = document.getElementsByName("slide");
    image.src = headImages[i];
    if(i <headImages.length - 1){
        i++
    }else{
        i=0;
    }

    setTimeout("changeHeadImg()", time)
}
window.onload = changeHeadImg;

/* sidebar */
function openMenu(){
    document.querySelector(".sidebar").classList.add("open")
}

function closeMenu(){
    document.querySelector(".sidebar").classList.remove("open")
}

/* quantity */
// $("#btnOK").click( () => {

//     const quantity = Number( $("#quantity").val());
// 	$.post( "/product/:id/addCart" , quantity, result => {
//         console.log("Response from Node : ", result)
//     })
// })

var val = document.getElementById('cat');


