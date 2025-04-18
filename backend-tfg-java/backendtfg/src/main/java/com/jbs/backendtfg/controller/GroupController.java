package com.jbs.backendtfg.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jbs.backendtfg.document.Group;
import com.jbs.backendtfg.document.User;
import com.jbs.backendtfg.dtos.GroupDTO;
import com.jbs.backendtfg.service.DeletionService;
import com.jbs.backendtfg.service.GroupService;

@CrossOrigin(origins = "http://localhost:3000") // Permitir peticiones desde React
@RestController
@RequestMapping("/groups")
public class GroupController {

    @Autowired
    private GroupService groupService; //Invocaremos los métodos que interactúan directamente con el repositorio

    @Autowired 
    private DeletionService deletionService;

    @GetMapping("/getAllGroups") //Obtenemos todos los grupos de nuestra DB
    public ResponseEntity<List<GroupDTO>> getAllGroups() {
        return ResponseEntity.ok(groupService.getAllGroups());
    }

    @GetMapping("/{id}") //Obtenemos un grupo a partir de si ID
    public ResponseEntity<GroupDTO> getGroupById(@PathVariable String id) {
        return ResponseEntity.ok(groupService.getGroupById(id));
    }

    @GetMapping("/getGroupsNameSearch")
    public ResponseEntity<List<GroupDTO>> getGroupsNameSearch(@AuthenticationPrincipal User authUser, @RequestParam String nameFragment) {
        return ResponseEntity.ok(groupService.getGroupsNameSearch(authUser.getGroupsIds(), nameFragment));
    }



    @PostMapping("/newGroup") //Creamos un grupo nuevo
    public ResponseEntity<GroupDTO> createEmptyGroup(@AuthenticationPrincipal User authUser) {
        return ResponseEntity.ok(groupService.saveNewGroup(authUser.getId().toHexString()));
    }
    
    @PostMapping("/getGroupsFromIds") //Obtenemos una lista de grupos a partir de sus IDs
    public ResponseEntity<List<GroupDTO>> getGroupsFromIds(@AuthenticationPrincipal User authUser, @RequestBody List<String> ids) {
        return ResponseEntity.ok(groupService.getGroupsFromIds(ids));
    }

    @PostMapping("/addUserGroup/{id}")
    public ResponseEntity<GroupDTO> addUserToGroup(@AuthenticationPrincipal User authUser, @RequestBody String idUser, @PathVariable String id) {
        return ResponseEntity.ok(groupService.addUserToGroup(id, idUser));
    }

    @PostMapping("/addUsersGroup/{id}")
    public ResponseEntity<GroupDTO> addUsersToGroup(@AuthenticationPrincipal User authUser, @RequestBody List<String> userIds, @PathVariable String id) {
        return ResponseEntity.ok(groupService.addUsersToGroup(id, userIds));
    }

    @PutMapping("/{id}") //Actualizamos los datos del grupo
    public ResponseEntity<GroupDTO> updateGroup(@PathVariable String id, @AuthenticationPrincipal User authUser, @RequestBody Group group) {
        return ResponseEntity.ok(groupService.updateGroup(group, id));
    }

    @PutMapping("/setUsers/{id}")
    public ResponseEntity<GroupDTO> setUsers (@PathVariable String id, @AuthenticationPrincipal User authUser, @RequestBody List<String> userIds){
        return ResponseEntity.ok(groupService.setUsers(id, userIds));
    }

    @DeleteMapping("/deleteGroupId/{id}") //Eliminamos un grupo de nuestra BD
    public ResponseEntity<Void> deleteGroup(@PathVariable String id, @AuthenticationPrincipal User authUser) {
        try {
            deletionService.deleteGroup(id);
        return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}