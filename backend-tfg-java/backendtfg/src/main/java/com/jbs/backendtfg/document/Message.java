package com.jbs.backendtfg.document;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "messages")
public class Message {

    @Id
    private ObjectId id;
    private ObjectId sender;
    private LocalDateTime timestamp;
    private String content;
    private ObjectId chatId;

    public Message(){}

    public Message(ObjectId sender, LocalDateTime timestamp, String content, ObjectId chatId){
        this.sender = sender;
        this.timestamp = timestamp;
        this.content = content;
        this.chatId = chatId;
    }

    public ObjectId getId() {
        return id;
    }

    public ObjectId getSender() {
        return sender;
    }

    public void setSender(ObjectId sender) {
        this.sender = sender;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public ObjectId getChatId() {
        return chatId;
    }

    public void setChatId(ObjectId chatId) {
        this.chatId = chatId;
    }

}
