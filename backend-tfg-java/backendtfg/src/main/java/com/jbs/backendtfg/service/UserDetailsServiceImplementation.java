package com.jbs.backendtfg.service;

import com.jbs.backendtfg.document.User;
import com.jbs.backendtfg.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImplementation implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImplementation(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException { //Obtenemos los datos del usuario a partir de su email
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Datos incorrectos")); //Usuario no encontrado, para evitar que una persona cualquiera sepa si el usuario existe o no, simplemente devolvemos un mensaje de credenciales inválidas
        return user;
    }
}

