package com.jbs.backendtfg.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.jbs.backendtfg.document.Chat;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface ChatRepository extends MongoRepository<Chat, ObjectId> {
    List<Chat> findByParticipantsContaining(ObjectId userId);

    Optional<Chat> findByParticipants(ArrayList<ObjectId> participants);
}
