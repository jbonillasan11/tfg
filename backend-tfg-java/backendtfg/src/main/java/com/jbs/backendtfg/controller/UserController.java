package com.jbs.backendtfg.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import com.jbs.backendtfg.document.User;
import com.jbs.backendtfg.document.UserResponse;
import com.jbs.backendtfg.dtos.ChatDTO;
import com.jbs.backendtfg.dtos.UserDTO;
import com.jbs.backendtfg.service.DeletionService;
import com.jbs.backendtfg.service.UserService;

@CrossOrigin(origins = "http://localhost:3000") // Permitir peticiones desde React
@RestController
@RequestMapping("/users")
public class UserController { //Manejamos los mapeos de las peticiones HTTP

    @Autowired
    private UserService userService; //Invocaremos los métodos que interactúan directamente con el repositorio

    @Autowired
    private DeletionService deletionService;

    @GetMapping("/getAllUsers") //Obtenemos todos los usuarios de nuestra BD
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/getUserEmail/{email}") //Obtenemos un usuario a partir de su email (nombre de usuario)
    public ResponseEntity<UserDTO> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @GetMapping("/getUserId/{id}") //Obtenemos un usuario a partir de su ID
    public ResponseEntity<UserDTO> getUserById(@PathVariable String id, @AuthenticationPrincipal User authUser) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/getUserGroups") //Obtenemos una lista de los IDs de los grupos a los que pertenece el usuario
    public ResponseEntity<List<String>> getUserGroups(@AuthenticationPrincipal User authUser) {
        return ResponseEntity.ok(userService.getUserGroupsIds(authUser.getId().toHexString()));
    }

    @GetMapping("/getUserTasks") //Obtenemos una lista de los IDs de las tareas a los que pertenece el usuario
    public ResponseEntity<List<String>> getUserTasks(@AuthenticationPrincipal User authUser) {
        return ResponseEntity.ok(userService.getUserTasksIds(authUser));
    }

    @GetMapping("/getUserChatIds") //Obtenemos una lista de los IDs de las tareas a los que pertenece el usuario
    public ResponseEntity<List<String>> getUserChatIds(@AuthenticationPrincipal User authUser) {
        return ResponseEntity.ok(userService.getUserChatsIds(authUser));
    }

    @GetMapping("/getUserChats") //Obtenemos una lista de los IDs de las tareas a los que pertenece el usuario
    public ResponseEntity<List<ChatDTO>> getUserChats(@AuthenticationPrincipal User authUser) {
        return ResponseEntity.ok(userService.getUserChats(authUser.getId()));
    }

    @GetMapping("/getOtherUserGroups/{id}") //Obtenemos una lista de los IDs de los grupos a los que pertenece el usuario
    public ResponseEntity<List<String>> getOtherUserGroups(@AuthenticationPrincipal User authUser, @PathVariable String id) {
        return ResponseEntity.ok(userService.getUserGroupsIds(id));
    }

    @GetMapping("/getCurrentUser") //Obtenemos el usuario de la sesión actual a partir de su token de autenticación
    public ResponseEntity<UserDTO> getCurrentUser (@AuthenticationPrincipal User user){
        return ResponseEntity.ok(userService.getUserById(user.getId().toHexString()));
    }

    @GetMapping("/getUsersNameSearch") //Devolvemos una lista de usuarios cuyo nombre contenga nameFragment y sean de la misma organización
    public ResponseEntity<List<UserDTO>> getUsersNameSearch(@AuthenticationPrincipal User authUser, @RequestParam String nameFragment) {
        return ResponseEntity.ok(userService.getUsersNameSearch(authUser.getOrganization(), nameFragment));
    }

    @PostMapping("/changePassword") //Gestionamos el cambio de contrseña del usuario
    public ResponseEntity<Void> changePassword(@AuthenticationPrincipal User authUser, @RequestBody Map <String, String> passwords) {
        userService.changePassword(authUser.getId(), passwords.get("oldPassword"), passwords.get("newPassword"));
        return ResponseEntity.ok().build();
    }

    @PostMapping ("/getUsers") //Obtenemos una lista de usuarios a partir de una lista de IDs
    public ResponseEntity<List<UserDTO>> getUsers (@AuthenticationPrincipal User authUser, @RequestBody List<String> usersIds){
        return ResponseEntity.ok(userService.getUsersFromIds(usersIds));
    }

    @PutMapping("/{userId}/saveResponses/{taskId}") //Actualizamos las respuestas de un usuario
    public ResponseEntity<UserDTO> updateUserResponses(@PathVariable String userId, @PathVariable String taskId, @RequestBody UserResponse response) {
        return ResponseEntity.ok(userService.updateUserResponses(userId, taskId, response));
    }

    @PutMapping("/{userId}/saveCorrections/{taskId}") //Actualizamos las correcciones de un usuario. Funcionamiento muy similar al saveResponese, separado por claridad
    public ResponseEntity<UserDTO> updateUserCorrections(@PathVariable String userId, @PathVariable String taskId, @RequestBody UserResponse response) {
        return ResponseEntity.ok(userService.updateUserCorrections(userId, taskId, response));
    }


    @DeleteMapping("/deleteUserId/{id}") //Eliminamos un usuario de nuestra BD
    public ResponseEntity<Void> deleteUser(@PathVariable String id, @AuthenticationPrincipal User authUser) {
        deletionService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

}
