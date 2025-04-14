package com.jbs.backendtfg.document;

import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tasks") 
public class Task {

    @Id
    private ObjectId id;
    private String name;
    private String description;
    private LocalDate due;
    private ObjectId creatorId;
    private boolean redoable;
    private List <ObjectId> assigneesUserIds;
    private List <ObjectId> assigneesGroupIds; //Por el momento prescindible
    private ObjectId templateId;
    private Object taskData; //Solución subida por el alumno?
    

    public Task() { 
        this.name = "";
        this.description = "";
        this.due = LocalDate.now();
        this.creatorId = null;
        this.assigneesUserIds = new ArrayList<ObjectId>();
        this.assigneesGroupIds = new ArrayList<ObjectId>();
        this.taskData = "";
        this.templateId = null;
    }

    public Task(ObjectId creator) { 
        this.name = "";
        this.description = "";
        this.due = LocalDate.now();
        this.creatorId = creator;
        this.assigneesUserIds = new ArrayList<ObjectId>();
        assigneesUserIds.add(creator); 
        this.assigneesGroupIds = new ArrayList<ObjectId>();
        this.taskData = "";
        this.templateId = null;
    }

    public Task(ObjectId creator, ObjectId template) { 
        this.name = "";
        this.description = "";
        this.due = LocalDate.now();
        this.creatorId = creator;
        this.assigneesUserIds = new ArrayList<ObjectId>();
        this.assigneesGroupIds = new ArrayList<ObjectId>();
        this.taskData = "";
        this.templateId = template;
    }

    public ObjectId getId(){
        return this.id;
    }

    public void addUser(ObjectId userId){ 
        if (!this.assigneesUserIds.contains(userId)){
            this.assigneesUserIds.add(userId);
        }
    }

    public void addGroup(ObjectId groupId){
        if (!this.assigneesGroupIds.contains(groupId)){
            this.assigneesGroupIds.add(groupId);
        } else throw new IllegalArgumentException("El grupo ya tiene asignada la tarea");
    }

    public void removeUser(ObjectId userId){
        if (assigneesUserIds.contains(userId)){
            this.assigneesUserIds.remove(userId);
        } else throw new IllegalArgumentException("El usuario no tiene asignada la tarea que se quiere eliminar");
        
    }

    public void removeGroup(ObjectId groupId){
        if (assigneesGroupIds.contains(groupId)){
            this.assigneesGroupIds.remove(groupId);
        } else throw new IllegalArgumentException("El grupo no tiene asignada la tarea que se quiere eliminar");
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public void setCreatorId(ObjectId creatorId) {
        this.creatorId = creatorId;
    }

    public void setAssigneesUserIds(List<ObjectId> assigneesUserIds) {
        this.assigneesUserIds = assigneesUserIds;
    }

    public void setAssigneesGroupIds(List<ObjectId> assigneesGroupIds) {
        this.assigneesGroupIds = assigneesGroupIds;
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

    public ObjectId getCreatorId() {
        return creatorId;
    }

    public boolean isRedoable() {
        return redoable;
    }

    public List<ObjectId> getAssigneesUserIds() {
        return assigneesUserIds;
    }

    public List<ObjectId> getAssigneesGroupIds() {
        return assigneesGroupIds;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDue(LocalDate due) {
        this.due = due;
    }

    public void setDue(String due) {
        this.due = LocalDate.parse(due);
    }

    public void setRedoable(boolean redoable) {
        this.redoable = redoable;
    }

    public void setCreator(ObjectId creatorId) {
        this.creatorId = creatorId;
    }

    public Object getTaskData() {
        return taskData;
    }

    public void setTaskData(Object taskData) {
        this.taskData = taskData;
    }

    public void removeAllUsers() {
        this.assigneesUserIds = new ArrayList<ObjectId>();
    }

    public ObjectId getTemplateId() {
        return templateId;
    }

    public void setTemplateId(ObjectId templateId) {
        this.templateId = templateId;
    }

    @Override
    public String toString() {
        return "Tarea: " + name + ", descripción:" + description + ", creada por:" + creatorId + ", entregable hasta el:" + due;
    }

    @Override
    public boolean equals(Object o){
        if (o == this) return true;
        if (o == null || !(o instanceof Task)) return false;
        Task t = (Task) o;
        return t.id.equals(this.id);
    }

}