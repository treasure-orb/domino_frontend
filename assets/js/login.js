var socket = io('http://localhost:3030');
  document.getElementById('loginButton').addEventListener('click', function () {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if(!email&&!password) {
      alert('Input the data correctly!');
    }
    else{
      axios.get(
        `http://localhost:3300/api/user/${email}`,
      )
      .then(response=>{
        if(response.data.success) {
          if(response.data.record.password == password) {
            location.href = './gameroom.html?email='+email;
          }
          else alert('Input password correctly!');           
        }
        else alert("Input Email correctly");
      })
    }              
  })