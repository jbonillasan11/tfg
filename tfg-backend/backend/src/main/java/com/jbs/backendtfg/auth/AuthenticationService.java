package com.jbs.backendtfg.auth;

import com.jbs.backendtfg.security.JwtService;
import com.jbs.backendtfg.document.User;
import com.jbs.backendtfg.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())); //Verificamos que el usuario y la contraseña sean correctos

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado")); //Buscamos al usuario en la base de datos
                
        String jwtToken = jwtService.generateToken(user);// Generamos el token
        return new AuthenticationResponse(jwtToken); //Devolvemos el token en la respuesta
    }
}
