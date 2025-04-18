package com.jbs.backendtfg.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.jbs.backendtfg.document.Task;
import com.jbs.backendtfg.document.User;
import com.jbs.backendtfg.dtos.TaskDTO;
import com.jbs.backendtfg.service.DeletionService;
import com.jbs.backendtfg.service.TaskService;

@CrossOrigin(origins = "http://localhost:3000") // Permitir peticiones desde React
@RestController
@RequestMapping("/tasks")
public class TaskController { 

    @Autowired
    private TaskService taskService; 

    @Autowired
    private DeletionService deletionService;

    @GetMapping("/allTasks") //Obtenemos todas las tareas de nuestra BD
    public ResponseEntity<List<TaskDTO>> getAllTasks(@AuthenticationPrincipal User authUser) {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/getTasksCreator") //Obtenemos todos los IDs de tareas de los que el usuario es creador
    public ResponseEntity<List<TaskDTO>> getAllTasksUser(@AuthenticationPrincipal User authUser) {
        return ResponseEntity.ok(taskService.getTasksByCreatorId(authUser));
    }

    @GetMapping("/{id}") //Obtenemos una tarea a partir de su ID
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable String id, @AuthenticationPrincipal User authUser) {
            return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @GetMapping("/getTasksNameSearch") //Buscamos tareas por nombre
    public ResponseEntity<List<TaskDTO>> getTasksNameSearch(@AuthenticationPrincipal User authUser, @RequestParam String nameFragment) {
        return ResponseEntity.ok(taskService.getTasksNameSearch(authUser.getId(), authUser.getTasksIds(), nameFragment));
    }

    @PostMapping("/getTasksFromIds") //Obtenemos una lista de tareas a partir de sus IDs
    public ResponseEntity<List<TaskDTO>> getTasksById(@AuthenticationPrincipal User authUser, @RequestBody List<String> ids) {
        return ResponseEntity.ok(taskService.getTasksFromIds(ids));
    }

    @PostMapping("/newEmptyTask") //Creamos una tarea vacía nueva
    public ResponseEntity<TaskDTO> createEmptyTask(@AuthenticationPrincipal User authUser) {
        return ResponseEntity.ok(taskService.saveEmptyTask(authUser));
    }

    @PutMapping("/setUsers/{id}")
    public ResponseEntity<TaskDTO> addUsers(@PathVariable String id, @AuthenticationPrincipal User authUser, @RequestBody List<String> ids) {
        return ResponseEntity.ok(taskService.setUsers(id, ids));
    }

    @PutMapping("/deleteUsers/{id}")
    public ResponseEntity<TaskDTO> deleteUsers(@PathVariable String id, @AuthenticationPrincipal User authUser) {
        return ResponseEntity.ok(taskService.deleteUsers(id));
    }

    @PutMapping("/{id}") //Actualizamos una tarea existente con nuevos datos
    public ResponseEntity<TaskDTO> updateTask(@PathVariable String id, @AuthenticationPrincipal User authUser, @RequestBody Task task) {    
        return ResponseEntity.ok(taskService.updateTask(task, id));
    }

    @DeleteMapping("/deleteTaskId/{id}") //Eliminamos una tarea de nuestra BD
    public ResponseEntity<Void> deleteTask(@PathVariable String id, @AuthenticationPrincipal User authUser) {
        deletionService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

}
