import AlertModal from "../ModalWindows/AlertModal";

function fetchService(url, reqMethod, authValue, reqBody) { //Función que nos permite hacer peticiones a nuestra APIRest

    let showModal = false;

    const fetchData = {
        method: reqMethod,
        headers: {}
    }

    const isFormData = reqBody instanceof FormData; //Si enviamos un FormData, el content type es establecido a multipart/form-data automáticamente por el navegador
    if (!isFormData) {
        fetchData.headers["Content-Type"] = "application/json";
    }

    if (authValue) {
        fetchData.headers.Authorization = `Bearer ${authValue}`;
    }

    if (reqBody) {
      fetchData.body = isFormData ? reqBody : JSON.stringify(reqBody);
    }

     return fetch(`https://tfg-laee.onrender.com:8080/${url}`, fetchData)      
          .then(response => {
            if (response.status === 200) {
              return response.json();
            } else if (response.status === 401) {
              showModal = true;
              <AlertModal
                showModal={showModal}
                onHide={() => {showModal=false}}
                message={"Sesión caducada. Por favor, inicia sesión de nuevo."}
                error ={true}
              />
              window.location.href = "/login";
            }
          })

}

export default fetchService;