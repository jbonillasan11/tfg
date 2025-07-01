package com.jbs.backendtfg.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.jbs.backendtfg.document.Chat;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends MongoRepository<Chat, ObjectId> {
    //Buscamos los chats que contienen a un usuario
    List<Chat> findByParticipantsContaining(ObjectId userId);

    //Buscamos los chats cuyos participantes son exactamente los que se le pasan
    @Query("{ 'participants': ?0 }")
    Optional<Chat> findChatByExactParticipants(ArrayList<ObjectId> participants);
}
