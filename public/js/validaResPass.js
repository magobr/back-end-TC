$(document).ready(function(){
   
    $('#btnAlter').click(function(){

        var email = $('#email').val();
        var pass = $('#pass').val();
        var resPass = $('#resPass').val();

    
        if (email == 'undefined' || email == '' || email.length < 3) {
            alert('email');
            return false;
            
        }

        if (pass == 'undefined' || pass == '' || pass.length < 3) {
            alert('Defina uma Senha');
            return false;
        }
        
        if (resPass == 'undefined' || resPass == '' || rePass.length < 3) {
            alert('repita a Senha');
            return false;
        }
})

})
