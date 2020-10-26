var fieldAutoComplete; //variable global del campo autocompletar


async function initAutoComplete(){


  
    fieldAutoComplete=new autoComplete({
    selector: '#inputBuscar', //elemento del dom que tiene el buscador
    cache:false, //genera problemas de busqueda si está en true
    minChars: 4, //numero minimo de caracteres para comenzar a buscar
    source: async function(term, response){ //fuente de los datos
        var data=await Telefono.query(term);
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