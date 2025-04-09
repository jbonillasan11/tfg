package com.jbs.backendtfg.document;

import java.util.ArrayList;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "groups") 
public class Group {

    @Id
    private ObjectId id;
    private String name;
    private ObjectId creatorId;
    private ArrayList <ObjectId> usersIds = new ArrayList<>();
    private ArrayList <ObjectId> tasksIds = new ArrayList<>();
    private ArrayList <UserType> allowedUserTypes = new ArrayList<>();

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

    public ArrayList<ObjectId> getUsersIds() {
        return usersIds;
    }

    public void setUsersIds(ArrayList<ObjectId> usersIds) {
        this.usersIds = usersIds;
    }

    public ArrayList<ObjectId> getTasksIds() {
        return tasksIds;
    }

    public void setTasksIds(ArrayList<ObjectId> tasksIds) {
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

    public ArrayList<ObjectId> getUsers() {
        return usersIds;
    }

    public ArrayList<ObjectId> getTasks() {
        return tasksIds;
    }

    public ArrayList<UserType> getAllowedUserTypes() {
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

    public void setAllowedUserTypes(ArrayList<UserType> types) {
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