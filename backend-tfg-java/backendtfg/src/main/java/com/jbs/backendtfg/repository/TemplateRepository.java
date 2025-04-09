package com.jbs.backendtfg.repository;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.jbs.backendtfg.document.Template;

@Repository
public interface TemplateRepository extends MongoRepository<Template, ObjectId> {
    Optional<Template> findByName(String name);
    List<Template> findByCreator(ObjectId id);
}
