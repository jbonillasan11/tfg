package com.jbs.backendtfg.service;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jbs.backendtfg.document.Group;
import com.jbs.backendtfg.document.Task;
import com.jbs.backendtfg.document.User;
import com.jbs.backendtfg.dtos.GroupDTO;
import com.jbs.backendtfg.dtos.TaskDTO;
import com.jbs.backendtfg.dtos.UserDTO;
import com.jbs.backendtfg.repository.GroupRepository;
import com.jbs.backendtfg.repository.TaskRepository;
import com.jbs.backendtfg.repository.UserRepository;

@Service
public class DeletionService {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private GroupRepository groupRepository;

        @Autowired
        private TaskRepository taskRepository;

        @Autowired
        private UserService userService;

        @Autowired
        private TaskService taskService;

        @Autowired
        private GroupService groupService;


        public void deleteUser(String id) { //Eliminamos un usuario de nuestra BD, así como de todos sus grupos y tareas
            ObjectId userId = new ObjectId(id);
            UserDTO toDelete = userService.getUserById(id);

            List<String> idsGroups = toDelete.getGroupsIds();
            for (String idGroup : idsGroups) {
                Optional<Group> optionalGroup = groupRepository.findById(new ObjectId(idGroup));
                if (optionalGroup.isPresent()) {
                    Group g = optionalGroup.get();
                    g.removeUser(userId);
                    groupRepository.save(g);
                }
            }

            List<String> idsTasks = toDelete.getTasksIds();
            for (String idTask : idsTasks) {
                Optional<Task> optionalTask = taskRepository.findById(new ObjectId(idTask));
                if (optionalTask.isPresent()) {
                    Task t = optionalTask.get();
                    t.removeUser(userId);
                    taskRepository.save(t);
                }
            }
            userService.deleteUser(userId);
        }

        public void deleteTask(String id) { //Eliminamos una tarea de nuestra BD, así como de todos sus usuarios
            ObjectId taskId = new ObjectId(id);
            TaskDTO toDelete = taskService.getTaskById(id);
        
            List<String> idsUsers = toDelete.getAssigneesUserIds();
            for (String idUser : idsUsers) {
                Optional<User> optionalUser = userRepository.findById(new ObjectId(idUser));
                if (optionalUser.isPresent()) {
                    User u = optionalUser.get();
                    u.removeTask(taskId);
                    userRepository.save(u);
                }
            }
            taskService.deleteTask(taskId);
        }
        
        public void deleteGroup(String id) { //Eliminamos un grupo de nuestra BD, así como de todos sus usuarios
            ObjectId groupId = new ObjectId(id);
            GroupDTO toDelete = groupService.getGroupById(id);
            
            List<String> idsUsers = toDelete.getUsersIds();
            for (String idUser : idsUsers) {
                Optional<User> optionalUser = userRepository.findById(new ObjectId(idUser));
                if (optionalUser.isPresent()) {
                    User u = optionalUser.get();
                    u.removeGroup(groupId);
                    userRepository.save(u);
                }
            }
            groupService.deleteGroup(groupId);
        }
}
