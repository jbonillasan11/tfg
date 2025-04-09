package com.jbs.backendtfg.dtos;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;

import com.jbs.backendtfg.document.Role;
import com.jbs.backendtfg.document.User;
import com.jbs.backendtfg.document.UserType;


public class UserDTO {

    private String id;
    private String name;
    private String surname;
    private String email;
    private String organization;
    private ArrayList <String> groupsIds = new ArrayList<>();
    private ArrayList <String> tasksIds = new ArrayList<>();
    private UserType userType;
    private List<Role> roles= new ArrayList<Role>();
    private List<String> chatsIDs; 
    //Omitimos el campo password para no enviarla al frontend
    //Incluir Map de responses?

    public UserDTO (User u){
        id = u.getId().toHexString();
        name = u.getName();
        surname = u.getSurname();
        email = u.getEmail();
        organization = u.getOrganization();
        userType = u.getUserType();
        roles = u.getRoles();

        if (u.getChats() != null) {
            for (ObjectId id : u.getChats()) {
                chatsIDs.add(id.toHexString());
            }
        }

        if (u.getGroupsIds() != null) {
            for (ObjectId id : u.getGroupsIds()) {
                groupsIds.add(id.toHexString());
            }
        }

        if (u.getTasksIds() != null) {
            for (ObjectId id : u.getTasksIds()) {
                tasksIds.add(id.toHexString());
            }
        }
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }

    public String getEmail() {
        return email;
    }

    public String getOrganization() {
        return organization;
    }

    public ArrayList<String> getGroupsIds() {
        return groupsIds;
    }

    public ArrayList<String> getTasksIds() {
        return tasksIds;
    }

    public UserType getUserType() {
        return userType;
    }

    public List<Role> getRoles() {
        return roles;
    }

    public List<String> getChatsIDs() {
        return chatsIDs;
    }

    public void setChatsIDs(List<String> chatsIDs) {
        this.chatsIDs = chatsIDs;
    }

    
    
}
