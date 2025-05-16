package com.jbs.backendtfg.service; 

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import com.jbs.backendtfg.document.Correction;
import com.jbs.backendtfg.document.Task;
import com.jbs.backendtfg.document.User;
import com.jbs.backendtfg.document.UserResponse;
import com.jbs.backendtfg.dtos.ChatDTO;
import com.jbs.backendtfg.dtos.UserDTO;
import com.jbs.backendtfg.repository.TaskRepository;
import com.jbs.backendtfg.repository.UserRepository;

@Service
public class UserService { //Definimos los métodos que se pueden realizar sobre el repositorio de usuarios

    @Autowired
    private UserRepository userRepository;

    @Autowired 
    private TaskRepository taskRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ChatService chatService;

    public List<UserDTO> getAllUsers() { //Obtenemos todos los usuarios del repositorio
        List<User> lUsers = userRepository.findAll();
        List<UserDTO> lUsersDTO = new ArrayList<>();
        for (User user : lUsers) {
            lUsersDTO.add(new UserDTO(user));
        }
        return lUsersDTO;
    }

    public UserDTO getUserByEmail(String email) { //Buscamos un usuario por su email en el repositorio
        if (userRepository.findByEmail(email).isPresent()) {
            return new UserDTO(userRepository.findByEmail(email).get());
        } else {
            return null;
        }
    }

    public UserDTO getUserById(String id) { //Buscamos un usuario por su ID en el repositorio
        return new UserDTO(userRepository.findById(new ObjectId(id))
            .orElse(null));
    }
    
    public UserDTO updateUser(User user) { //Actualizamos o guardamos un nuevo usuario
        return new UserDTO(userRepository.save(user));
    }

    public void deleteUser(ObjectId id) { //Eliminamos un usuario del repositorio
        userRepository.deleteById(id);
    }

    public List<String> getUserGroupsIds(String idUser) { //Obtenemos la lista de IDs de los grupos a los que pertenece el usuario
        UserDTO targetUser = getUserById(idUser);
        List<String> idsGrupos = targetUser.getGroupsIds();
        List<String> idsStrings = new ArrayList<>();
        if (idsGrupos != null) {
            for (String id: idsGrupos) {
                if (id != null){
                    idsStrings.add(id);
                }
            }
        } 
        return idsStrings;
    }

    public List<String> getUserTasksIds(User u) { //Obtenemos la lista de IDs de las tareas a los que pertenece el usuario
        UserDTO targetUser = getUserById(u.getId().toHexString());
        List<String> idsTareas = targetUser.getTasksIds();
        List<String> idsStrings = new ArrayList<>();
        if (idsTareas != null) {
            for (String id: idsTareas) {
                if (id != null){
                    idsStrings.add(id);
                }
            }
        }
        return idsStrings;
    }

    public void addGroupToUser(ObjectId userId, ObjectId groupId) { //Añadimos un ID de grupo a un usuario
        User targetUser = userRepository.findById(userId).get();
        targetUser.addGroup(groupId);
        userRepository.save(targetUser);
    }

    public List<UserDTO> getUsersFromIds (List<String> ids){ //Obtenemos una lista de usuarios a partir de sus IDs
        List<UserDTO> users = new LinkedList<>();
        for (String id : ids) {
            users.add(getUserById(id));
        }
        return users;
    }

    public List<String> getUserChatsIds(User u) {
        UserDTO targetUser = getUserById(u.getId().toHexString());
        List<String> idsChats = targetUser.getChatsIDs();
        List<String> idsStrings = new ArrayList<>();
        for (String id: idsChats) {
            if (id != null){
                idsStrings.add(id);
            }
        }
        return idsStrings;
    }

    public List<UserDTO> getUsersNameSearch(String organization, String nameFragment) {
        List<User> lUsers = userRepository.findByOrganizationAndFullNameContaining(organization, nameFragment);
        List<UserDTO> lUsersDTO = new ArrayList<>();
        for (User user : lUsers) {
            lUsersDTO.add(new UserDTO(user));
        }
        return lUsersDTO;
    }

    public void changePassword(ObjectId userId, String oldPassword, String newPassword) {
        String oldPasswordEncoded = userRepository.findById(userId).get().getPassword();

        if (passwordEncoder.matches(oldPassword, oldPasswordEncoded)){
            User u = userRepository.findById(userId).get();
            u.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(u);
        }
        //Aquí podemos incluir validaciones de contraseña
        else {
            throw new RuntimeException("Contraseña incorrecta");
        }
    }

    public void removeGroupFromUser(ObjectId objectId, ObjectId objectId2) {
        User targetUser = userRepository.findById(objectId).get();
        targetUser.removeGroup(objectId2);
        userRepository.save(targetUser);
    }

    public List<ChatDTO> getUserChats(ObjectId userId) {
        UserDTO targetUser = getUserById(userId.toHexString());
        List<ChatDTO> chats = new ArrayList<>();
        for (ChatDTO c: chatService.getChatsByIds(targetUser.getChatsIDs())) {
            chats.add(c);
        }
        return chats;
    }

    public List<Correction> initializeCorrections(String taskId) { //Inicializamos la lista de correcciones con el número de preguntas de la tarea
        Task task = taskRepository.findById(new ObjectId(taskId)).get();
        List<Correction> corrections = new ArrayList<>();
        for (int i = 0; i < task.getNumberOfQuestions(); i++) {
            corrections.add(new Correction());
        }
        return corrections;
    }

    public UserDTO updateUserResponses(String userId, String taskId, UserResponse response) {
        User user = userRepository.findById(new ObjectId(userId)).get();
        UserResponse ur = user.getResponses().get(taskId);
        ur.setCorrections(initializeCorrections(taskId)); //INICIALIZAMOS TAMBIÉN LAS RESPUESTAS PARA COMODIDAD DEL FRONTEND
        ur.setResponse(response.getResponse());
        ur.setTaskState(response.getTaskState());
        ur.setUploadDate();
        user.getResponses().put(taskId, ur);
        
        return new UserDTO(userRepository.save(user));
    }

}
