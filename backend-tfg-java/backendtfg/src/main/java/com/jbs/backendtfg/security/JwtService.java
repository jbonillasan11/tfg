package com.jbs.backendtfg.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.function.Function;
import javax.crypto.SecretKey;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    // Generar un token JWT con el nombre de usuario y un tiempo de expiración
    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 3)) // 3 horas de validez
                .signWith(getSigningKey())
                .compact();
    }

    // Extraer el nombre de usuario desde el token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Validar que el token no haya expirado y que la firma sea válida
    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return ((userDetails.getUsername().equals(username)) && !isTokenExpired(token));
    }

    // Extraer cualquier información (claim) del token
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Comprobar si el token ha expirado
    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    // Extraer todos los claims del token
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Obtener la clave secreta para firmar y validar tokens
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }
}

