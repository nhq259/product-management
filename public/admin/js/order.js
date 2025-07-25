//Delete Order
const buttonsDelete = document.querySelectorAll("[button-delete]")
if(buttonsDelete.length >0) {
  buttonsDelete.forEach(button => {
    const formDeleteItem = document.querySelector("#form-delete-order")
    const path = formDeleteItem.getAttribute("data-path")

    button.addEventListener("click" , () =>{
      const isConfirm = confirm("Bạn có chắc chắn muốn xóa đơn hàng này ?");

      if(isConfirm){
        const id = button.getAttribute("data-id")

        const action = `${path}/${id}?_method=DELETE`;
        //gán action cho form
        formDeleteItem.action = action

        formDeleteItem.submit();
        
      }

      
    })
  })
}

//End Delete Order