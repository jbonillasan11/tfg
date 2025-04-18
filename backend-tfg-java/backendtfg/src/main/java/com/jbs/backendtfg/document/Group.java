package com.jbs.backendtfg.document;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "groups") 
public class Group {

    @Id
    private ObjectId id;
    private String name;
    private ObjectId creatorId;
    private List <ObjectId> usersIds = new ArrayList<>();
    private List <ObjectId> tasksIds = new ArrayList<>();
    private List <UserType> allowedUserTypes = new ArrayList<>();

    public Group() {
        this.name = "";
        this.creatorId = null;
    }

    public Group(ObjectId creatorId) {
        this.creatorId = creatorId;
    }
    public Group(String name, ObjectId creatorId) {
        this.name = name;
        this.creatorId = creatorId;
    }

    public Group(Group g) {
        this.id = g.id;
        this.name = g.name;
        this.usersIds = g.getUsers();
        this.creatorId = g.getCreator();
        this.tasksIds = g.getTasks();
        this.allowedUserTypes = g.getAllowedUserTypes();
    }
       
    public void addUser(ObjectId userId){
        this.usersIds.add(userId);
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public ObjectId getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(ObjectId creatorId) {
        this.creatorId = creatorId;
    }

    public List<ObjectId> getUsersIds() {
        return usersIds;
    }

    public void setUsersIds(List<ObjectId> usersIds) {
        this.usersIds = usersIds;
    }

    public List<ObjectId> getTasksIds() {
        return tasksIds;
    }

    public void setTasksIds(List<ObjectId> tasksIds) {
        this.tasksIds = tasksIds;
    }

    public ObjectId getId(){
        return this.id;
    }

    public void addTask(ObjectId taskId){
        this.tasksIds.add(taskId);
    }

    public void removeUser(ObjectId userId){
        this.usersIds.remove(userId);
    }

    public void removeTask(ObjectId taskId){
        this.tasksIds.remove(taskId);
    }

    public String getName() {
        return name;
    }

    public ObjectId getCreator(){
        return creatorId;
    }

    public List<ObjectId> getUsers() {
        return usersIds;
    }

    public List<ObjectId> getTasks() {
        return tasksIds;
    }

    public List<UserType> getAllowedUserTypes() {
        return allowedUserTypes;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCreator(ObjectId creatorId){
        this.creatorId = creatorId;
    }

    public void removeAllUsers() {
        this.usersIds = new ArrayList<ObjectId>();
    }

    public void removeAllTasks() {
        this.tasksIds = new ArrayList<ObjectId>();
    }

    public void setAllowedUserTypes(List<UserType> types) {
        this.allowedUserTypes = types;
    }

    @Override
    public boolean equals(Object o){
        if (o == this) return true;
        if (o == null || !(o instanceof Group)) return false;
        Group g = (Group) o;
        return g.id.equals(this.id);
    }

    
}