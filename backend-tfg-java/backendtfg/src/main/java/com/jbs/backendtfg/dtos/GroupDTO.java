package com.jbs.backendtfg.dtos;

import java.util.ArrayList;

import org.bson.types.ObjectId;

import com.jbs.backendtfg.document.Group;
import com.jbs.backendtfg.document.UserType;

public class GroupDTO {

    private String id;
    private String name;
    private String creatorId;
    private ArrayList <String> usersIds;
    private ArrayList <String> tasksIds;
    private ArrayList <UserType> allowedUserTypes;

    public GroupDTO (Group g){
        id = g.getId().toHexString();
        name = g.getName();
        creatorId = g.getCreator().toHexString();
        usersIds = new ArrayList<>();
        for (ObjectId u : g.getUsers()) {
            usersIds.add(u.toHexString());
        }
        tasksIds = new ArrayList<>();
        for (ObjectId t : g.getTasks()) {
            tasksIds.add(t.toHexString());
        }
        allowedUserTypes = g.getAllowedUserTypes();
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCreatorId() {
        return creatorId;
    }

    public ArrayList<String> getUsersIds() {
        return usersIds;
    }

    public ArrayList<String> getTasksIds() {
        return tasksIds;
    }

    public ArrayList<UserType> getAllowedUserTypes() {
        return allowedUserTypes;
    }

}
