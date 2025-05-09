package com.jbs.backendtfg.document;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class UserResponse {

    private Double calification;
    private List<String> response = new ArrayList<>();
    private TaskState taskState;
    private LocalDate uploadDate;

    public UserResponse(){
        calification = -1.0;
        response = null;
        taskState = TaskState.PENDING;
        uploadDate = null;
    }

    public UserResponse(List<String> response){
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

    public List<String> getResponse() {
        return response;
    }

    public void setResponse(List<String> response) {
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

}
