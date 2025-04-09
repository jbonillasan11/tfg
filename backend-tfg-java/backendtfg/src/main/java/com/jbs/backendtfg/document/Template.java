package com.jbs.backendtfg.document;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

public class Template {
    
    @Id
    private ObjectId id;
    private String name;
    private String description;
    private ObjectId creator;
    private TaskType type;
    private Boolean publicTemplate;
    private Date creationDate;
    private Map<String, Object> content; //El contenido funcionará como un mapa en el que el objeto será flexible atendiendo al tipo de actividad, deberá incluir soluciones en caso de respuesta automática
    private List<String> mediaUrls;

    public Template(){
        name = "";
        description = "";
        creator = null;
        type = null;
        publicTemplate = false;
        content = new HashMap<>();
        mediaUrls = new ArrayList<>();
    }

    public Template(ObjectId idCreator){
        name = "";
        description = "";
        creator = idCreator;
        type = null;
        publicTemplate = false;
        content = new HashMap<>();
        mediaUrls = new ArrayList<>();
    }

    public ObjectId getID(){
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ObjectId getCreator() {
        return creator;
    }

    public void setCreator(ObjectId creator) {
        this.creator = creator;
    }

    public TaskType getType() {
        return type;
    }

    public void setType(TaskType type) {
        this.type = type;
    }

    public Boolean getPublicTemplate() {
        return publicTemplate;
    }

    public void setPublicTemplate(Boolean publicTemplate) {
        this.publicTemplate = publicTemplate;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public Map<String, Object> getContent() {
        return content;
    }

    public void setContent(Map<String, Object> content) {
        this.content = content;
    }

    public void addContent(String s, Object o){
        content.put(s, o);
    }

    public void deleteContent (String s){
        content.remove(s);
    }

    public List<String> getMediaUrls (){
        return mediaUrls;
    }

    public void setMediaUrls (List<String> media){
        mediaUrls = media;
    }

    public void addMedia (String url){
        mediaUrls.add(url);
    }

    public void deleteMedia (String url){
        mediaUrls.remove(url);
    }

}
