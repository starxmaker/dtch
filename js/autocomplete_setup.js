var fieldAutoComplete; //variable global del campo autocompletar
var fieldAutoComplete2;
var fieldAutoComplete3;
var fieldAutoComplete4;
function initAutoComplete(){


  
    fieldAutoComplete=new autoComplete({
    selector: '#inputBuscar', //elemento del dom que tiene el buscador
    cache:false, //genera problemas de busqueda si está en true
    minChars: 4, //numero minimo de caracteres para comenzar a buscar
    source: function(term, response){ //fuente de los datos
        var data=Telefono.query(term);
     	response(data); //manda la respuesta como sugerencias
       
    },
    renderItem: function (item, search){ //como renderizar las sugerencias
        //forma que se mostrara: numero - icono de estado
        //nota: se transfiere un data-id para que cuando se haga click se busque el numero
        return '<div class="autocomplete-suggestion" data-id="'+item[0]+'">'+item[1]+' '+getRenderedEstadosIcon(item[2])+' '+item[3]+'</div>';
    },
    onSelect: function(e, term, item){ //funcion que se realiza cuando se selecciona una sugerencia

        var id=item.getAttribute('data-id'); //rescata el identificador de la sugerencia
        loadNumeroById(id); //carga los datos del numero en base al identificador
        //reinicia el campo buscar y la libreria
         document.getElementById("inputBuscar").value=""; 
        fieldAutoComplete.destroy();
        initAutoComplete();

    }
});
}
//autocomplete nombres
function initAutoCompleteNombres(){
    fieldAutoComplete2=new autoComplete({
    selector: '#inputNombres', //elemento del dom que tiene el buscador
    source: function(term, response){ //fuente de los datos
        term = term.toLowerCase();
        var choices = allPublicadores;
        var matches = [];
        for (i=0; i<choices.length; i++)
            if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
        response(matches);
    }
});
}
//autocomplete nombres
function initAutoCompleteQuick(){
    fieldAutoComplete4=new autoComplete({
    selector: '#inputHermanoQuick', //elemento del dom que tiene el buscador
    source: function(term, response){ //fuente de los datos
        term = term.toLowerCase();
        var choices = allPublicadores;
        var matches = [];
        for (i=0; i<choices.length; i++)
            if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
        response(matches);
    },
    onSelect: function(e, term, item){ //funcion que se realiza cuando se selecciona una sugerencia

        cleanActivity();

    }
});
}
function initAutoCompleteEspera(){
    fieldAutoComplete3=new autoComplete({
    selector: '#inputNombresEspera', //elemento del dom que tiene el buscador
    source: function(term, response){ //fuente de los datos
        term = term.toLowerCase();
        var choices = allPublicadores;
        var matches = [];
        for (i=0; i<choices.length; i++)
            if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
        response(matches);
    }
});
}