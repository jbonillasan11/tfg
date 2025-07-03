package com.jbs.backendtfg.repository;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.jbs.backendtfg.document.User;

@Repository
public interface UserRepository extends MongoRepository<User, ObjectId> {
    Optional<User> findByEmail(String email);  // Búsqueda de usuario por email (campo único por usuario)

    Optional<User> findById(ObjectId id); // Búsqueda de usuario por id (también campo único por usuario)

    @Query("{ 'organization': ?0, 'fullname': { $regex: ?1, $options: 'i' } }") //El campo 0 es la organización, el campo 1 es el fragmento de nombre, con regex buscamos tambien coincidencias parciales ignorando mayúsculas y minúsculas
    List<User> findByOrganizationAndFullNameContaining(String organization, String nameFragment);

}

