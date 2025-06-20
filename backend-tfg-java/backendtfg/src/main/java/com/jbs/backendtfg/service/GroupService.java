package com.jbs.backendtfg.service; 

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jbs.backendtfg.document.Chat;
import com.jbs.backendtfg.document.Group;
import com.jbs.backendtfg.document.User;
import com.jbs.backendtfg.dtos.GroupDTO;
import com.jbs.backendtfg.repository.GroupRepository;
import com.jbs.backendtfg.repository.UserRepository;

@Service
public class GroupService { //Definimos los métodos que se pueden realizar sobre el repositorio de grupos

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserService userService;

    @Autowired 
    private UserRepository userRepository;

    @Autowired
    private ChatService chatService;

    public List<GroupDTO> getAllGroups() { //Obtenemos todos los grupos del repositorio
        List<Group> lGroups= groupRepository.findAll();
        List<GroupDTO> lGroupsDTO = new ArrayList<>();
        for (Group group : lGroups) {
            lGroupsDTO.add(new GroupDTO(group));
        }
        return lGroupsDTO;
    }

    public GroupDTO getGroupById(String id) {
        Optional<Group> optionalGroup = groupRepository.findById(new ObjectId(id));
        return optionalGroup.map(GroupDTO::new).orElse(null);
    }
    
    public GroupDTO updateGroup(Group updatedGroup, String id) {
        ObjectId groupId = new ObjectId(id);
        Group existingGroup = groupRepository.findById(groupId).get();
        //Actualizamos solo los campos modificables
        existingGroup.setName(updatedGroup.getName());
        existingGroup.setAllowedUserTypes(updatedGroup.getAllowedUserTypes());
        existingGroup.setForumId(updatedGroup.getForumId());
        //Guardamos el grupo actualizado
        Group savedGroup = groupRepository.save(existingGroup);
        return new GroupDTO(savedGroup);
    }

    public GroupDTO saveNewGroup(String id) { //Guardamos un nuevo grupo
        Group newGroup = new Group();
        newGroup.addUser(new ObjectId(id));
        newGroup.setCreator(new ObjectId(id));
        Chat forum = chatService.newChatForum(newGroup.getUsersIds()); //Creamos un chat para el grupo
        newGroup.setForumId(forum.getId());
        newGroup = groupRepository.save(newGroup);
        userService.addGroupToUser(new ObjectId(id), newGroup.getId()); //Añadimos el grupo a los grupos del usuario creador
        return new GroupDTO(newGroup);
    }

    public void deleteGroup(ObjectId id) { //Eliminamos un grupo del repositorio
        groupRepository.deleteById(id);
    }

    public List<GroupDTO> getGroupsFromIds(List<String> ids) { //Obtenemos una lista de grupos a partir de sus ids
        List<GroupDTO> groups = new LinkedList<>();
        for (String id : ids) {
            if (getGroupById(id) != null) {
                groups.add(getGroupById(id));
            }
        }
        return groups;
    }

    public GroupDTO addUserToGroup(String idGrupo, String idUsuario) { //Añadimos un usuario a un grupo
        Group group = groupRepository.findById(new ObjectId(idGrupo)).orElse(null); //Obtenemos el grupo objetivo
        userService.addGroupToUser(new ObjectId(idUsuario), new ObjectId(idGrupo)); //Añadimos el grupo al usuario
        group.addUser(new ObjectId(idUsuario)); //Añadimos el usuario al grupo
        return new GroupDTO(groupRepository.save(group)); //Guardamos el grupo actualizado
    }

    public GroupDTO addUsersToGroup(String idGrupo, List<String> idUsuarios) { //Añadimos varios usuarios a un grupo
         Group group = groupRepository.findById(new ObjectId(idGrupo)).orElse(null); //Obtenemos el grupo objetivo
        for (String idUsuario : idUsuarios) {
            userService.addGroupToUser(new ObjectId(idUsuario), new ObjectId(idGrupo)); //Añadimos el grupo al usuario
            group.addUser(new ObjectId(idUsuario)); //Añadimos el usuario al grupo
        }
        return new GroupDTO(groupRepository.save(group)); //Guardamos el grupo actualizado
    }

    public GroupDTO removeUserFromGroup(String idGrupo, String idUsuario) { //Eliminamos un usuario de un grupo
        Group group = groupRepository.findById(new ObjectId(idGrupo)).orElse(null); //Obtenemos el grupo objetivo
        userService.removeGroupFromUser(new ObjectId(idUsuario), new ObjectId(idGrupo)); //Eliminamos el grupo de los grupos del usuario
        group.removeUser(new ObjectId(idUsuario)); //Eliminamos el usuario del grupo
        return new GroupDTO(groupRepository.save(group)); //Guardamos el grupo actualizado
    }

    public List<GroupDTO> getGroupsNameSearch(List<ObjectId> userGroups, String nameFragment) { //Obtenemos una lista de grupos que contienen el nombre de un usuario
        List<Group> lGroups = groupRepository.findByNameContainingAndIdIn(nameFragment, userGroups); //Buscamos los grupos que contengan el fragmento de nombre y que pertenezcan a los grupos del usuario
        List<GroupDTO> lGroupsDTO = new ArrayList<>();
        for (Group group : lGroups) {
            lGroupsDTO.add(new GroupDTO(group));
        }
        return lGroupsDTO;
    }

    public GroupDTO setUsers(String id, List<String> userIds) { //Establecemos la lista de usuarios de un grupo
        Group currentGroup = groupRepository.findById(new ObjectId(id)).get();
        
        List<ObjectId> newUserIds = new ArrayList<>();
        for (String newUserId : userIds) { //Preparamos la lista de ids para utilizarla
            newUserId = (newUserId.replace("\"", ""));
            newUserIds.add(new ObjectId(newUserId));
        }

        List<ObjectId> currentUserIds = currentGroup.getUsers();

        for (ObjectId currentUserId : currentUserIds) { //Eliminamos el grupo de los usuarios anteriores que ya no pertenecen
            if (!newUserIds.contains(currentUserId)) {
                removeUser(id, currentUserId);
            }
        }

        for (ObjectId newUserId : newUserIds) { //Añadimos el grupo a los usuarios nuevos
            if (!currentUserIds.contains(newUserId)) {
                addUser(id, newUserId);
            }
        }

        currentGroup.setUsersIds(newUserIds);
        return new GroupDTO(groupRepository.save(currentGroup));
    }

    public void addUser(String id, ObjectId userId){ //Añadimos un usuario a un grupo
        User user = userRepository.findById(userId).get();  
        user.addGroup(new ObjectId(id));
        userRepository.save(user);
    }

    public void removeUser(String id, ObjectId userId){ //Eliminamos un usuario de un grupo
        User user = userRepository.findById(userId).get();
        user.removeGroup(new ObjectId(id));
        userRepository.save(user);
    }


}
