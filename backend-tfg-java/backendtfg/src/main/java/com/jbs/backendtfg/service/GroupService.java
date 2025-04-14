package com.jbs.backendtfg.service; 

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import com.jbs.backendtfg.document.Group;
import com.jbs.backendtfg.dtos.GroupDTO;
import com.jbs.backendtfg.repository.GroupRepository;

@Service
public class GroupService { //Definimos los métodos que se pueden realizar sobre el repositorio de grupos

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserService userService;

    public List<GroupDTO> getAllGroups() { //Obtenemos todos los grupos del repositorio
        List<Group> lGroups= groupRepository.findAll();
        List<GroupDTO> lGroupsDTO = new ArrayList<>();
        for (Group group : lGroups) {
            lGroupsDTO.add(new GroupDTO(group));
        }
        return lGroupsDTO;
    }

    public GroupDTO getGroupById(String id) { //Obtenemos un grupo a partir de su ID
        return new GroupDTO(groupRepository.findById(new ObjectId(id)) // La operación existe predefinida en el repositorio, devuelve un Optional de Group, por lo que manejamos la excepción para el caso de que no se encuentre
            .orElseThrow(() -> new RuntimeException("El grupo no existe en nuestro sistema")));
    }
    
    public GroupDTO updateGroup(Group g, String id) { //Actualizamos un grupo existente
        g.setId(new ObjectId(id));
        return new GroupDTO(groupRepository.save(g));
    }

    public GroupDTO saveNewGroup(String id) { //Guardamos un nuevo grupo
        Group newGroup = new Group();
        newGroup.addUser(new ObjectId(id));
        newGroup.setCreator(new ObjectId(id));
        newGroup = groupRepository.save(newGroup);
        userService.addGroupToUser(new ObjectId(id), newGroup.getId()); //Añadimos el grupo a los grupos del usuario creador
        return new GroupDTO(newGroup);
    }

    public void deleteGroup(ObjectId id) { //Eliminamos un grupo del repositorio
        groupRepository.deleteById(id);
    }

    public List<GroupDTO> getGroupsFromIds(List<String> ids) { //
        List<GroupDTO> groups = new LinkedList<>();
        for (String id : ids) {
            groups.add(getGroupById(id));
        }
        return groups;
    }

    public GroupDTO addUserToGroup(String idGrupo, String idUsuario) {
        Group group = groupRepository.findById(new ObjectId(idGrupo)).orElseThrow(() -> new RuntimeException("El grupo no existe en nuestro sistema")); //Obtenemos el grupo objetivo
        userService.addGroupToUser(new ObjectId(idUsuario), new ObjectId(idGrupo)); //Añadimos el grupo al usuario
        group.addUser(new ObjectId(idUsuario)); //Añadimos el usuario al grupo
        return new GroupDTO(groupRepository.save(group)); //Guardamos el grupo actualizado
    }

    public GroupDTO addUsersToGroup(String idGrupo, List<String> idUsuarios) {
        Group group = groupRepository.findById(new ObjectId(idGrupo)).orElseThrow(() -> new RuntimeException("El grupo no existe en nuestro sistema")); //Obtenemos el grupo objetivo
        for (String idUsuario : idUsuarios) {
            userService.addGroupToUser(new ObjectId(idUsuario), new ObjectId(idGrupo)); //Añadimos el grupo al usuario
            group.addUser(new ObjectId(idUsuario)); //Añadimos el usuario al grupo
        }
        return new GroupDTO(groupRepository.save(group)); //Guardamos el grupo actualizado
    }

    public GroupDTO removeUserFromGroup(String idGrupo, String idUsuario) {
        Group group = groupRepository.findById(new ObjectId(idGrupo)).orElseThrow(() -> new RuntimeException("El grupo no existe en nuestro sistema")); //Obtenemos el grupo objetivo
        userService.removeGroupFromUser(new ObjectId(idUsuario), new ObjectId(idGrupo)); //Eliminamos el grupo de los grupos del usuario
        group.removeUser(new ObjectId(idUsuario)); //Eliminamos el usuario del grupo
        return new GroupDTO(groupRepository.save(group)); //Guardamos el grupo actualizado
    }

    public List<GroupDTO> getGroupsNameSearch(List<ObjectId> userGroups, String nameFragment) {
        List<Group> lGroups = groupRepository.findByNameContainingAndIdIn(nameFragment, userGroups); //Buscamos los grupos que contengan el fragmento de nombre y que pertenezcan a los grupos del usuario
        List<GroupDTO> lGroupsDTO = new ArrayList<>();
        for (Group group : lGroups) {
            lGroupsDTO.add(new GroupDTO(group));
        }
        return lGroupsDTO;
    }


}
