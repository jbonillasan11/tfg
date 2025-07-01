package com.jbs.backendtfg.repository;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.jbs.backendtfg.document.Group;

@Repository
public interface GroupRepository extends MongoRepository<Group, ObjectId> {
    //Buscamos grupos por nombre
    Optional<Group> findByName(String name);

    //Buscamos grupos que contienen un fragmento en su nombre y que son parte de los grupos del usuario
    @Query("{ '_id': { $in: ?1 }, 'name': { $regex: ?0, $options: 'i' } }")
    List<Group> findByNameContainingAndIdIn(String nameFragment, List<ObjectId> userGroups);
}
