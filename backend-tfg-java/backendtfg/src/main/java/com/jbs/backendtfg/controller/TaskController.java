package com.jbs.backendtfg.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping("/getTasksFromIds") //Obtenemos una lista de tareas a partir de sus IDs
    public ResponseEntity<List<TaskDTO>> getTasksById(@AuthenticationPrincipal User authUser, @RequestBody List<String> ids) {
        return ResponseEntity.ok(taskService.getTasksFromIds(ids));
    }

    @PostMapping("/newEmptyTask") //Creamos una tarea vacía nueva
    public ResponseEntity<TaskDTO> createEmptyTask(@AuthenticationPrincipal User authUser) {
        return ResponseEntity.ok(taskService.saveEmptyTask(authUser));
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
