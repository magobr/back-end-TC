function validaCampo(idBtn, idInput){
    $('#'+ idBtn).click(function(){
        idInput = $('#' + idInput).val();

        if (idInput == 'undefined' || idInput == '' || idInput.length < 3) {
            alert(idInput);
            return false;
        }
    });
    
}