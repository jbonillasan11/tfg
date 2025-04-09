package com.jbs.backendtfg.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.jbs.backendtfg.document.Message;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, ObjectId> {
    List<Message> findByChatId(ObjectId chatId);
}
