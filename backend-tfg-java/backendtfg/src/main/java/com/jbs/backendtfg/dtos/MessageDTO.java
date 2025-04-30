package com.jbs.backendtfg.dtos;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.jbs.backendtfg.document.Message;

public class MessageDTO {
    
    private String id;
    private String sender;
    private String timestamp;
    private String content;
    private String chatId;

    public MessageDTO(){}

    public MessageDTO(Message m){
        id = m.getId().toHexString();
        sender = m.getSender().toHexString();
        timestamp = formatTimestamp(m.getTimestamp());  
        content = m.getContent();
        chatId = m.getChatId().toHexString();
    }

    // Método para formatear el timestamp a un string con la estructura "dd/mm hh:mm"
    private String formatTimestamp(LocalDateTime timestamp) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM HH:mm");
        return timestamp.format(formatter);
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

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = formatTimestamp(timestamp);
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

