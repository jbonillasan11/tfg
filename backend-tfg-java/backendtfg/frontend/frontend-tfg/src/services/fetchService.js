
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
            }
          })

}

export default fetchService;