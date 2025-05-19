// Button Status
const buttonsStatus = document.querySelectorAll("[button-status]");
// console.log(buttonsStatus);
if (buttonsStatus.length > 0) {
  let url = new URL(window.location.href);
  // console.log(url);

  buttonsStatus.forEach((button) => {
    // console.log(button);
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");
      // console.log(status);

      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }
      console.log(url.href);
      window.location.href = url.href;
    });
  });
}

//End Button Status

//Form Search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(window.location.href);

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;

    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;

    console.log(e.target.elements.keyword.value);
  });
}

// END Form Search

//Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination) {
  let url = new URL(window.location.href);

  buttonsPagination.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      console.log(page);

      url.searchParams.set("page", page);
      window.location.href = url.href;
    });
  });
}

//end Pagination

//check box multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputIds = checkboxMulti.querySelectorAll("input[name='id']");

  inputCheckAll.addEventListener("click", () => {
    // console.log(inputCheckAll.checked);
    if (inputCheckAll.checked) {
      inputIds.forEach((input) => {
        input.checked = true;
      });
    } else {
      inputIds.forEach((input) => {
        input.checked = false;
      });
    }
  });

  inputIds.forEach((input) => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='id']:checked"
      ).length;

      if (inputIds.length == countChecked) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}

//end check box multi

//form change multi
const formChangeMulti = document.querySelector("[form-change-multi]");

if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();

    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputsChecked = checkboxMulti.querySelectorAll(
      "input[name='id']:checked"
    );

    // xoa nhieu sp
    const typeChange = e.target.elements.type.value;
    if (typeChange == "delete-all") {
      const isConfirm = confirm(
        "Bạn có chắc chắn muốn xóa những sản phẩm này ?"
      );
      if (!isConfirm) {
        return;
      }
    }

    if (inputsChecked.length > 0) {
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");

      inputsChecked.forEach((input) => {
        const id = input.value;

        if (typeChange == "change-position") {
          const position = input
            .closest("tr")
            .querySelector("input[name='position']").value;

          ids.push(`${id}-${position}`);
        } else {
          ids.push(id);
        }
      });
      inputIds.value = ids.join(", ");
      // console.log(ids.join(", "));
      formChangeMulti.submit();
    } else {
      // alert("Vui lòng chọn ít nhất một sản phẩm");
    }
  });
}
//end form change multi

//Show alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);
  console.log(showAlert);

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}

//End Show alert

//Upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  let uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");

  // Hàm gắn sự kiện change cho input
  function bindInputChange(input) {
    input.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        uploadImagePreview.src = URL.createObjectURL(file);
      }
    });
  }

  // Gắn lần đầu
  bindInputChange(uploadImageInput);

  // Nút X để xoá ảnh
  const btnXPreview = document.querySelector("[data-btn-x-preview]");
  btnXPreview.addEventListener("click", (e) => {
    // Xoá ảnh preview
    uploadImageInput.value = "";
    uploadImagePreview.src = "";

    // Reset input file
    const newInput = uploadImageInput.cloneNode(true);
    uploadImageInput.replaceWith(newInput);

    // Gắn lại sự kiện cho input mới
    uploadImageInput = newInput;
    bindInputChange(uploadImageInput);
  });
}
//End upload image
