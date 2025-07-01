package com.jbs.backendtfg.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.jbs.backendtfg.document.Message;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, ObjectId> {
    //Buscamos mensajes de un chat
    List<Message> findByChatId(ObjectId chatId);
}
