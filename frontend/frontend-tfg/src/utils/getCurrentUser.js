import fetchService from '../services/fetchService';

async function getCurrentUser(authValue) {
    try {
        const responseData = await fetchService("users/getCurrentUser", "GET", authValue, null);
        console.log(responseData);
        return responseData;
    } catch (error) {
        console.error("Error obteniendo el usuario:", error);
        return null; // Devuelve null en caso de error
    }
} 

export default getCurrentUser