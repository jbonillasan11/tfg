package com.jbs.backendtfg.document;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
public class Content {
    
    private TaskType type;
    private String question;
    private List<String> options = new ArrayList<>();
    private List<String> correctAnswers = new ArrayList<>();
    private String mediaURL;
    private Double maxPoints;

    public Content() {
        this.type = TaskType.OPEN_ANSWER;
        this.question = "";
        this.options = null;
        this.maxPoints = 0.0;
    }

    public Content(TaskType type, String question, List<String> options, List<String> correctAnswers, String mediaURL, Double maxPoints) {
        this.type = type;
        this.question = question;
        this.options = options;
        this.correctAnswers = correctAnswers;
        this.mediaURL = mediaURL;
        this.maxPoints = maxPoints;
    }

    public TaskType getType() {
        return type;
    }

    @JsonProperty("type")
    public void setType(String type) {
        switch (type) {
            case "FILL_THE_BLANK":
                this.type = TaskType.FILL_THE_BLANK;
                break;
            case "MULTIPLE_CHOICE":
                this.type = TaskType.MULTIPLE_CHOICE;
                break;
            case "DRAG":
                this.type = TaskType.DRAG;
                break;
            case "TRUE_FALSE":
                this.type = TaskType.TRUE_FALSE;
                break;
            case "OPEN_ANSWER":
                this.type = TaskType.OPEN_ANSWER;
                break;
            default:
                this.type = TaskType.OPEN_ANSWER;
                break;
        }
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public List<String> getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(List<String> correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public String getMediaURL() {
        return mediaURL;
    }

    public void setMediaURL(String mediaURL) {
        this.mediaURL = mediaURL;
    }

    public void setType(TaskType type) {
        this.type = type;
    }

    public Double getMaxPoints() {
        return maxPoints;
    }

    public void setMaxPoints(Double maxPoints) {
        this.maxPoints = maxPoints;
    }

}
