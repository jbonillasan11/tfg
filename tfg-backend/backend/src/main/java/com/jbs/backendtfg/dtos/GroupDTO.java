package com.jbs.backendtfg.dtos;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;

import com.jbs.backendtfg.document.Group;

public class GroupDTO {

    private String id;
    private String name;
    private String creatorId;
    private List <String> usersIds;
    private String forumId;

    public GroupDTO (Group g){
        id = g.getId().toHexString();
        name = g.getName();
        creatorId = g.getCreator().toHexString();
        usersIds = new ArrayList<>();
        for (ObjectId u : g.getUsers()) {
            usersIds.add(u.toHexString());
        }
        forumId = g.getForumId().toHexString();
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

    public String getForumId() {
        return forumId;
    }

}
