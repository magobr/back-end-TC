$(document).ready(function(){
   
    $('#btnLogin').click(function(){

        var email = $('#email').val();
        var pass = $('#pass').val();

        if (email == 'undefined' || email == '' || email.length < 3) {
            alert('email');
            return false;
        }

        if (pass == 'undefined' || pass == '' || pass.length < 3) {
            alert('Defina uma Senha');
            return false;
        }
    })

});