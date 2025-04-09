package com.jbs.backendtfg.dtos;

import java.time.LocalDate;
import java.util.ArrayList;

import org.bson.types.ObjectId;

import com.jbs.backendtfg.document.Task;

public class TaskDTO {

    
    private String id;
    private String name;
    private String description;
    private LocalDate due;
    private String creatorId;
    private boolean redoable;
    private ArrayList <String> assigneesUserIds = new ArrayList<>();
    private Object taskData;

    public TaskDTO (Task t){
        id = t.getId().toHexString();
        name = t.getName();
        description = t.getDescription();
        due = t.getDue();
        creatorId = t.getCreatorId().toHexString();
        redoable = t.isRedoable();
        for (ObjectId uIds : t.getAssigneesUserIds()) {
            assigneesUserIds.add(uIds.toHexString());
        }
        taskData = t.getTaskData();
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getDue() {
        return due;
    }

    public String getCreatorId() {
        return creatorId;
    }

    public boolean isRedoable() {
        return redoable;
    }

    public ArrayList<String> getAssigneesUserIds() {
        return assigneesUserIds;
    }

    public Object getTaskData() {
        return taskData;
    }

    

}
