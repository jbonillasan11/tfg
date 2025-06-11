package com.jbs.backendtfg.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.jbs.backendtfg.document.Chat;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public interface ChatRepository extends MongoRepository<Chat, ObjectId> {
    List<Chat> findByParticipantsContaining(ObjectId userId);

    @Query("{ 'participants': ?0 }")
    Optional<Chat> findChatByExactParticipants(ArrayList<ObjectId> participants);
}
