import { useEffect, useState } from 'react';

//Con esta función quweremos replicar el funcionamiento de useState, pero interactuando con la memoria local del navegador
function useLocalState (defaultValue, key){

    const[value, setValue] = useState(() => {

        const storedValue = localStorage.getItem(key);
        return storedValue !== null ? JSON.parse(storedValue) : defaultValue; 
        //Si existe el valor en nuestro localStorage, lo devolvemos directamente
        //Si no, devolvemos defaultValue: value  
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
        //Cada vez que se cambie el valor actualizamos localStorage
    }, [key, value]);

    return [value, setValue];
}

export {useLocalState};