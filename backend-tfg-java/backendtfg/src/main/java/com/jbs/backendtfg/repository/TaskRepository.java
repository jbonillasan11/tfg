package com.jbs.backendtfg.repository;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.jbs.backendtfg.document.Task;

@Repository
public interface TaskRepository extends MongoRepository<Task, ObjectId> {
    Optional<Task> findByName(String name);
    List<Task> findByCreator(ObjectId id);

    List<Task> findByCreatorIdAndNameContainingIgnoreCase(ObjectId creatorId, String name); //Nombre explicativo
}
