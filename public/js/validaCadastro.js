$(document).ready(function(){
   
    $('#btnCadastro').click(function(){
        var nome = $("#nome").val();
        var email = $('#email').val();
        var nickName = $('#nickName').val();
        var dataNascimento = $('#dataNascimento').val();
        var pass = $('#pass').val();
        var repass = $('#repass').val();
		

        if (nome == 'undefined' || nome == '' || nome.length < 3) {
            alert('nome');
            return false;
        }

        if (email == 'undefined' || email == '' || email.length < 3) {
            alert('email');
            return false;
        }

        if (nickName == 'undefined' || nickName == '' || nickName.length < 3) {
            alert('nickName');
            return false;
        }

        if (dataNascimento == 'undefined' || dataNascimento == '' || dataNascimento.length < 3) {
            alert('Data Nascimento');
            return false;
        }

        if (pass == 'undefined' || pass == '' || pass.length < 3) {
            alert('Defina uma Senha');
            return false;
        }

        if (repass == 'undefined' || repass == '' || repass.length < 3) {
            alert('Repita a Senha');
            return false;
        }
    })

           
});