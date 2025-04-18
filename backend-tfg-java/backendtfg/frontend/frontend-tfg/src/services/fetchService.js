
function fetchService(url, reqMethod, authValue, reqBody) { //Función que nos permite hacer peticiones a nuestra APIRest

    const fetchData = {
        method: reqMethod,
        headers: {
            "content-type": "application/json"
        }
    }

    if (authValue) {
        fetchData.headers.Authorization = `Bearer ${authValue}`;
    }

    if (reqBody) {
        fetchData.body = JSON.stringify(reqBody);
    }

     return fetch(`http://localhost:8080/${url}`, fetchData)      
          .then(response => {
            if (response.status === 200) {
              return response.json();
            } else if (response.status === 401) {
              alert("Sesión caducada");
              window.location.href = "/login";
            }
          })

}

export default fetchService;