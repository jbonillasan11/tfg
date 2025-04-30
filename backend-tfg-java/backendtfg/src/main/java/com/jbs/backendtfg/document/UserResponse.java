package com.jbs.backendtfg.document;

public class UserResponse {

    private Double calification;
    private Object response; // O lista de respuestas?
    private TaskState taskState;

    public UserResponse(){
        calification = -1.0;
        response = null;
        taskState = TaskState.PENDING;
    }

    public UserResponse(Object response){
        calification = 0.0;
        this.response = response;
        taskState = TaskState.IN_PROGRESS;
    }

    public Double getCalification() {
        return calification;
    }

    public void setCalification(Double calification) {
        this.calification = calification;
    }

    public Object getResponse() {
        return response;
    }

    public void setResponse(Object response) {
        this.response = response;
    }

    public TaskState getTaskState() {
        return taskState;
    }

    public void setTaskState(TaskState taskState) {
        this.taskState = taskState;
    }

}
