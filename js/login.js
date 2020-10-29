var dtch_server=window.localStorage.getItem("DTCH_SERVER") || ""

const openLogin=()=>{
    document.getElementById("inputServidor").value=dtch_server
    document.getElementById("openModalLogin").click()
}

const loggingAttempt= async () =>{
    let chosenServidor=document.getElementById("inputServidor").value.trim()
    const choseUser=document.getElementById("inputUsuario").value.trim()
    const chosePassword=document.getElementById("inputPassword").value.trim()
    if (chosenServidor=="" || choseUser=="" || chosePassword=="") return false
    
    Notiflix.Loading.Arrows('Iniciando sesión');
    if(chosenServidor.charAt(chosenServidor.length-1) == "/"){ chosenServidor = chosenServidor.substr(0, chosenServidor.length - 1);}
    try{
        const response=await axios.post(chosenServidor+"/usuarios/login",{
            username: choseUser,
            password: chosePassword
        },{withCredentials: true})
        Notiflix.Loading.Remove()
       
         if (response.status==200){
            window.localStorage.setItem("DTCH_SERVER",chosenServidor)
            window.sessionStorage.setItem("csrfToken", response.data.csrfToken)
            
            Notiflix.Report.Success('Información','Inicio de sesión exitoso','Aceptar');
            document.getElementById("openModalLogin").click()
            Notiflix.Loading.Arrows('Cargando ambiente');
            await setServerDetails()
            toggleOnline()
            await afterLoading()
            Notiflix.Loading.Remove()
         }else{
            Notiflix.Report.Failure('Información','Error de credenciales','Aceptar');
         }
        }catch(err){
            Notiflix.Loading.Remove()
            Notiflix.Report.Failure('Información','Error de credenciales','Aceptar');
        }
}

const cerrarSesion = () =>{
    Notiflix.Loading.Arrows('Cerrando sesión');
    window.sessionStorage.removeItem("csrfToken")
    window.location.reload()
}