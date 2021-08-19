document.getElementById('saveButton').addEventListener('click', function () {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var firstname = document.getElementById('firstname').value;
  var lastname = document.getElementById('lastname').value;
  var confirmpassword = document.getElementById('confirmpassword').value;
  if(password == confirmpassword) {
    axios.post(
      `http://localhost:3300/api/user`,
      {firstname: firstname, lastname: lastname, email: email, password: password}
    )
    .then(response=>{
      if(response.data.success) {
        alert('Success Save!');
      }
    })          
  }      
})