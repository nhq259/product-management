// Cập nhật số lượng sản phẩm trong giỏ hàng
const inputsQuantity = document.querySelectorAll("input[name='quantity']")  

  if(inputsQuantity.length > 0){
    inputsQuantity.forEach(input => {
      input.addEventListener("change", (e) =>{
        const productId = input.getAttribute("product-id")
        const quantity = input.value

        // console.log(productId, quantity);

        window.location.href = `/cart/update/${productId}/${quantity}` 
        
      })
    });
  }

// END Cập nhật số lượng sản phẩm trong giỏ hàng

 