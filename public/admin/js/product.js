//change status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {

  const formChangeStatus = document.querySelector("#form-change-status")
  const path = formChangeStatus.getAttribute("data-path")
  // console.log(path);
  

  buttonChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");

      let changeStatus = statusCurrent == "active" ? "inactive" : "active"      

      console.log(statusCurrent);
      console.log(id);
      console.log(changeStatus);

      const action = path + `/${changeStatus}/${id}?_method=PATCH`;
      formChangeStatus.action = action

      formChangeStatus.submit();
    });
  });
}

// end change status

//Delete Item
const buttonsDelete = document.querySelectorAll("[button-delete]")
if(buttonsDelete.length >0) {
  buttonsDelete.forEach(button => {
    const formDeleteItem = document.querySelector("#form-delete-item")
    const path = formDeleteItem.getAttribute("data-path")

    button.addEventListener("click" , () =>{
      const isConfirm = confirm("Bạn có chắc chắn muốn xóa sản phẩm này ?");

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

//End Delete Item
