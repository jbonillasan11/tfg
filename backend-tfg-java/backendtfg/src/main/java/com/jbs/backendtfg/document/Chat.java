package com.jbs.backendtfg.document;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "chats")
public class Chat {
    
    @Id
    private ObjectId id;
    private ArrayList<ObjectId> participants;
    private List<ObjectId> messages = new ArrayList<>();

    public Chat(){}

    public Chat (ArrayList<ObjectId> participants){
        this.participants = participants;
    }

    public ObjectId getId() {
        return id;
    }

    public ArrayList<ObjectId> getParticipants() {
        return participants;
    }

    public void setParticipants(ArrayList<ObjectId> participants) {
        this.participants = participants;
    }

    public List<ObjectId> getMessages() {
        return messages;
    }

    public void setMessages(List<ObjectId> messages) {
        this.messages = messages;
    }

    public void addMessage(ObjectId mess){
        this.messages.add(mess);
    }

    public void addParticipant(ObjectId part){
        this.participants.add(part);
    }

    public void removeMessage(ObjectId mess){
        this.messages.remove(mess);
    }

    public void removeParticipant (ObjectId part){
        this.participants.remove(part);
    }

}
