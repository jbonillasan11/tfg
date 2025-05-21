package com.jbs.backendtfg.auth;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jbs.backendtfg.document.User;
import com.jbs.backendtfg.security.JwtService;
import com.jbs.backendtfg.service.UserService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @PostMapping("/login") //Exponemos el endpoint login
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) {
        try{
            Authentication authenticate = authenticationManager
                .authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
                ); //Autenticamos al usuario
            User user = (User) authenticate.getPrincipal(); //Cast a nuestro tipo User
            
            return ResponseEntity.ok()
                .header("Access-Control-Expose-Headers", HttpHeaders.AUTHORIZATION) 
                .header(HttpHeaders.AUTHORIZATION, jwtService.generateToken(user)) //Generamos y devolvemos el token en la respuesta
                .body(user);
        } catch (BadCredentialsException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); //Si el usuario no existe o la contraseña es incorrecta, devolvemos un error
        }
    }

    @PostMapping("/register") //Gestionaremos también los nuevos registros
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody User user) {

        Map<String, String> response = new HashMap<>(); //Usamos mapa para manejar en conjunto el mensaje de respuesta
        
        if (userService.getUserByEmail(user.getEmail()) != null) { //Si el correo ya está registrado, devolvemos un mensaje de error
            response.put("message", "El correo ya está registrado.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword); // Guardamos la versión hasheada
        
        userService.updateUser(user);
        response.put("message", "Usuario registrado correctamente.");
        return ResponseEntity.ok(response);
    }


}
