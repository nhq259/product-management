//Permissions
const tablePermisssions = document.querySelector("[table-permisssions]");

if (tablePermisssions) {
  const buttonSubmit = document.querySelector("[button-submit]");

  buttonSubmit.addEventListener("click", () => {
    let permissions = [];

    const rows = tablePermisssions.querySelectorAll("[data-name]");

    rows.forEach((row) => {
      const name = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");

      if (name == "id") {
        inputs.forEach((input) => {
          const id = input.value;
          permissions.push({
            id: id,
            permissions: [],
          });
        });
      } else {
        inputs.forEach((input, index) => {
          const checked = input.checked;
          // console.log(name);
          // console.log(index);
          // console.log(checked);
          if (checked) {
            permissions[index].permissions.push(name);
          }
        });
      }
    });
    console.log(permissions);

    if(permissions.length > 0) {
      const formChangePermissions = document.querySelector("#form-change-permissions")
      const inputPermissions = formChangePermissions.querySelector("input[name='permissions']")
      inputPermissions.value = JSON.stringify(permissions)

      formChangePermissions.submit()
    }
  });
}

  
//End Permissions

//Permissions Data deafault

const dataRecords = document.querySelector("[data-records]")
// console.log(dataRecords);
if(dataRecords){
  const records = JSON.parse(dataRecords.getAttribute("data-records"));
  // console.log(records);

  const tablePermisssions = document.querySelector("[table-permisssions]");

  records.forEach((record,index) => {
    const permissions = record.permissions;
    // console.log(permissions);

    permissions.forEach(permission => {
      const row = tablePermisssions.querySelector(`[data-name="${permission}"]`)
      const input = row.querySelectorAll("input")[index]

      input.checked = true
      // console.log(permission);
      // console.log(index);

      
    });
    
  });

  
}

//End Permissions Data deafault

//delete role

const buttonsDelete = document.querySelectorAll("[button-delete]")
if(buttonsDelete.length >0) {
  buttonsDelete.forEach(button => {
    const formDeleteRole = document.querySelector("#form-delete-role")
    const path = formDeleteRole.getAttribute("data-path")

    button.addEventListener("click" , () =>{
      const isConfirm = confirm("Bạn có chắc chắn muốn xóa quyền này ?");

      if(isConfirm){
        const id = button.getAttribute("data-id")

        const action = `${path}/${id}?_method=DELETE`;
        //gán action cho form
        formDeleteRole.action = action

        formDeleteRole.submit();        
      }

      
    })
  })
}

//end delete role