package com.jbs.backendtfg.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthenticationRequest { //Recibe la request para hacer login, con usuario y password
    private String email;
    private String password;
}
