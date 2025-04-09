package com.jbs.backendtfg.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthenticationResponse { //Respuesta que enviaremos (token) cuando el usuario se autentique
    private String token;
}
