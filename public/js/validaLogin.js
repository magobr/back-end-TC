$(document).ready(function(){
   
    $('#btnLogin').click(function(){

        var email = $('#email').val();
        var pass = $('#pass').val();
        var pass = $('#rePass').val();

        if (email == 'undefined' || email == '' || email.length < 3) {
            alert('email');
            return false;
        }
        if ((pass == 'undefined' || pass == '' || pass.length < 3) || (rePass == 'undefined' || pass == '' || pass.length < 3)) {
            alert('Defina uma Senha');
            return false;
        } else if (email && true  && pass  && true  && rePass && true ){
            window.location.assign="/game"

        }
        
    })
    

});