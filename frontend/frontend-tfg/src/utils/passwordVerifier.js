function passwordVerifier (pwd) {
    if (!pwd) {
        return false;
    }
    //Longitud mínima
    if (pwd.length < 8) {
        return false;
    }

    //Una letra mayúscula
    if (!/[A-Z]/.test(pwd)) {
        return false;
    }

    //Una letra minúscula
    if (!/[a-z]/.test(pwd)) {
        return false;
    }

    //Un dígito
    if (!/\d/.test(pwd)) {
        return false;
    }

    //Un carácter especial
    if (!/[^A-Za-z0-9]/.test(pwd)) {
        return false;
    }

    //Cumple todos los requisitos
    return true;
    
};

export default passwordVerifier;