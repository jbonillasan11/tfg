package com.jbs.backendtfg.dtos;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;

import com.jbs.backendtfg.document.Group;
import com.jbs.backendtfg.document.UserType;

public class GroupDTO {

    private String id;
    private String name;
    private String creatorId;
    private List <String> usersIds;
    private List <String> tasksIds;
    private List <UserType> allowedUserTypes;

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

    public List<String> getUsersIds() {
        return usersIds;
    }

    public List<String> getTasksIds() {
        return tasksIds;
    }

    public List<UserType> getAllowedUserTypes() {
        return allowedUserTypes;
    }

}
