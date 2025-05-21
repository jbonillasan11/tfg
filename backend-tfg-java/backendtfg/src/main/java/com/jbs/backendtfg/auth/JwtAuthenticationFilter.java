package com.jbs.backendtfg.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.jbs.backendtfg.repository.UserRepository;
import com.jbs.backendtfg.security.JwtService;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter { //JWTFILTER 

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (!StringUtils.hasText(authHeader) || (StringUtils.hasText(authHeader) && !authHeader.startsWith("Bearer "))) {
            chain.doFilter(request, response);
            return;
        } //Filtramos las peticiones sin autorización o que no sean de tipo Bearer

        final String token = authHeader.split(" ")[1].trim();

        String email = jwtService.extractUsername(token); //Comprobamos que existe usuario en el token
        if (email == null) {
            chain.doFilter(request, response);
            return;
        } //Filtramos peticiones que no tengan un email asociado

        UserDetails userDetails = userRepository.findByEmail(email).orElse(null); //Comprobamos que el usuario asociado al email existe
        if (userDetails == null) {
            chain.doFilter(request, response);
            return;
        } //Filtramos peticiones que no tengan un email existente
        
        if (!jwtService.isTokenValid(token, userDetails)) {
            chain.doFilter(request, response);
            return;
        } //Filtramos peticiones que no tengan un token válido

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities()); 
        
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        chain.doFilter(request, response);
    }
}

