package com.jbs.backendtfg.repository;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.jbs.backendtfg.document.Task;

@Repository
public interface TaskRepository extends MongoRepository<Task, ObjectId> {
    //Buscamos tareas por nombre
    Optional<Task> findByName(String name);
    //Buscamos tareas por ID de creador
    List<Task> findByCreator(ObjectId id);
    //Buscamos tareas que contienen un fragmento en su nombre y de las que el ID enviado es creador
    List<Task> findByCreatorIdAndNameContainingIgnoreCase(ObjectId creatorId, String name);
}
