//Delete category

const buttonsDelete = document.querySelectorAll("[button-delete]")
if(buttonsDelete.length >0) {
  buttonsDelete.forEach(button => {
    const formDeleteCategory = document.querySelector("#form-delete-category")
    const path = formDeleteCategory.getAttribute("data-path")

    button.addEventListener("click" , () =>{
      const isConfirm = confirm("Bạn có chắc chắn muốn xóa sản phẩm này ?");

      if(isConfirm){
        const id = button.getAttribute("data-id")

        const action = `${path}/${id}?_method=DELETE`;
        //gán action cho form
        formDeleteCategory.action = action

        formDeleteCategory.submit();        
      }

      
    })
  })
}

//End Delete category