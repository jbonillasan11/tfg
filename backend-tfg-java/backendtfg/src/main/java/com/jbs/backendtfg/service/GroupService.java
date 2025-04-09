package com.jbs.backendtfg.service; 

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import com.jbs.backendtfg.document.Group;
import com.jbs.backendtfg.document.User;
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

    public GroupDTO saveNewGroup(User user) { //Guardamos un nuevo grupo
        Group newGroup = new Group();
        newGroup.addUser(user.getId());
        newGroup.setCreator(user.getId());
        newGroup = groupRepository.save(newGroup);
        userService.addGroupToUser(user.getId(), newGroup.getId()); //Añadimos el grupo a los grupos del usuario creador
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
}
