package com.jbs.backendtfg.dtos;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;

import com.jbs.backendtfg.document.Chat;

public class ChatDTO {
    
    private String id;
    private ArrayList<String> participants = new ArrayList<>();
    private List<String> messages = new ArrayList<>();

    public ChatDTO(Chat c){
        id = c.getId().toHexString();
        for (ObjectId id : c.getParticipants()) {
            participants.add(id.toHexString());
        }
        for (ObjectId id : c.getMessages()) {
            messages.add(id.toHexString());
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ArrayList<String> getParticipants() {
        return participants;
    }

    public void setParticipants(ArrayList<String> participants) {
        this.participants = participants;
    }

    public List<String> getMessages() {
        return messages;
    }

    public void setMessages(List<String> messages) {
        this.messages = messages;
    }

}
