package com.jbs.backendtfg.dtos;

import java.time.LocalDateTime;

import com.jbs.backendtfg.document.Message;

public class MessageDTO {
    
    private String id;
    private String sender;
    private LocalDateTime timestamp;
    private String content;
    private String chatId;

    public MessageDTO(){}

    public MessageDTO(Message m){
        id = m.getId().toHexString();
        sender = m.getSender().toHexString();
        timestamp = m.getTimestamp();
        content = m.getContent();
        chatId = m.getChatId().toHexString();
    }

    public String getId() {
        return id;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
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

    public String getChatId() {
        return chatId;
    }

    public void setChatId(String chatId) {
        this.chatId = chatId;
    }

    
}

