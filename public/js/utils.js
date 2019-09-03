function validaCampo(idBtn, idInput){
    $('#'+ idBtn).click(function(){
        idInput = $('#' + idInput).val();

        if (idInput == 'undefined' || idInput == '' || idInput.length < 3) {
            alert(idInput);
            return false;
        }
    });
    
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

