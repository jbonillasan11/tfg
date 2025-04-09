package com.jbs.backendtfg.dtos;

import java.util.Date;
import java.util.List;
import java.util.Map;


import com.jbs.backendtfg.document.TaskType;
import com.jbs.backendtfg.document.Template;

public class TemplateDTO {

    private String id;
    private String name;
    private String description;
    private String creator;
    private TaskType type;
    private Boolean publicTemplate;
    private Date creationDate;
    private Map<String, Object> content; //El contenido funcionará como un mapa en el que el objeto será flexible atendiendo al tipo de actividad, deberá incluir soluciones en caso de respuesta automática
    private List<String> mediaUrls;

    public TemplateDTO (Template t){
        id = t.getID().toHexString();
        name = t.getName();
        description = t.getDescription();
        creator = t.getCreator().toHexString();
        type = t.getType();
        publicTemplate = t.getPublicTemplate();
        creationDate = t.getCreationDate();
        content = t.getContent();
        mediaUrls = t.getMediaUrls();
    }

    public String getId() {
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

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
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

    public List<String> getMediaUrls() {
        return mediaUrls;
    }

    public void setMediaUrls(List<String> mediaUrls) {
        this.mediaUrls = mediaUrls;
    }

    
    
}
