package com.jbs.backendtfg.document;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


public class UserResponse {

    private Double calification;
    private List<List<String>> response = new ArrayList<>(); //Cada pregunta puede tener varias respuestas
    private TaskState taskState;
    private LocalDate uploadDate;
    private List<Correction> corrections = new ArrayList<>(); //Corrección de cada pregunta

    public UserResponse(){
        calification = -1.0;
        response = null;
        taskState = TaskState.PENDING;
        uploadDate = null;
    }

    public UserResponse(List<List<String>> response){
        calification = 0.0;
        this.response = response;
        taskState = TaskState.IN_PROGRESS;
    }

    public UserResponse(UserResponse ur){
        calification = ur.getCalification();
        response = ur.getResponse();
        taskState = ur.getTaskState();
        uploadDate = ur.getUploadDate();
    }

    public Double getCalification() {
        return calification;
    }

    public void setCalification(Double calification) {
        this.calification = calification;
    }

    public List<List<String>> getResponse() {
        return response;
    }

    public void setResponse(List<List<String>> response) {
        this.response = response;
    }

    public TaskState getTaskState() {
        return taskState;
    }

    public void setTaskState(TaskState taskState) {
        this.taskState = taskState;
    }

    public LocalDate getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate() {
        uploadDate = LocalDate.now();
    }

    public void setUploadDate(LocalDate uploadDate) {
        this.uploadDate = uploadDate;
    }

    public List<Correction> getCorrections() {
        return corrections;
    }

    public void setCorrections(List<Correction> corrections) {
        this.corrections = corrections;
    }

    public void calculateCalification(){
        if (corrections.size() > 0){
            Double sum = 0.0;
            for (Correction c : corrections){
                sum += c.getCalification();
            }
            calification = sum / corrections.size();
        } else {
            calification = -1.0;
        }
    }

}
