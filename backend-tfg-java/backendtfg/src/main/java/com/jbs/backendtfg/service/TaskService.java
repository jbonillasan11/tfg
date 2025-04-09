package com.jbs.backendtfg.service; 

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import com.jbs.backendtfg.document.Task;
import com.jbs.backendtfg.document.User;
import com.jbs.backendtfg.dtos.TaskDTO;
import com.jbs.backendtfg.repository.TaskRepository;
import com.jbs.backendtfg.repository.UserRepository;

@Service
public class TaskService { //Definimos los métodos que se pueden realizar sobre el repositorio de tareas

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public List<TaskDTO> getAllTasks() { //Obtenemos todas las tareas del repositorio
        List<TaskDTO> lTasksDTO = new ArrayList<>();
        for (Task task : taskRepository.findAll()) {
            lTasksDTO.add(new TaskDTO(task));
        }
        return lTasksDTO;
    }

    public List<TaskDTO> getTasksByCreatorId(User u) { //Obtenemos todas las tareas de las que el usuario es creador
        List<TaskDTO> lTasksDTO = new ArrayList<>();
        for (Task task : taskRepository.findByCreator(u.getId())) {
            lTasksDTO.add(new TaskDTO(task));
        }
        return lTasksDTO;
    }

    public TaskDTO getTaskById(String id) { //Obtenemos una tarea a partir de su ID
        return new TaskDTO(taskRepository.findById(new ObjectId(id)) // Si no encuentra la tarea, lanza una excepción
            .orElseThrow(() -> new RuntimeException("La tarea no existe en nuestro sistema")));
    }    
    
    public TaskDTO saveEmptyTask(User u) { //Guardamos una nueva tarea vacía
        Task savedTask = taskRepository.save(new Task(u.getId()));
        u.addTask(savedTask.getId());
        userRepository.save(u); //Añadimos la tarea a las asignadas del usuario
        return new TaskDTO(savedTask);
    }

    public TaskDTO updateTask(Task t, String id) { //Actualizamos una tarea existente
        t.setId(new ObjectId(id));
        return new TaskDTO(taskRepository.save(t));
    }

    public void deleteTask(ObjectId id) { //Eliminamos una tarea del repositorio
        taskRepository.deleteById(id);
    }

    public List<TaskDTO> getTasksFromIds(List<String> ids) { //Obtenemos una lista de tareas a partir de sus IDs
       List<TaskDTO> tasks = new LinkedList<>();
        for (String id : ids) {
            tasks.add(getTaskById(id));
        }
        return tasks;
    }
}

