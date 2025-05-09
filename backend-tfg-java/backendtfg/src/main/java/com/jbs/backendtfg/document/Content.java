package com.jbs.backendtfg.document;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
public class Content {
    
    private TaskType type;
    private String question;
    private List<String> options = new ArrayList<>();
    private String correctAnswer;
    private Media media;

    public Content() {
        this.type = TaskType.OPEN_ANSWER;
        this.question = "";
        this.options = null;
        this.correctAnswer = null;
        this.media = null;
    }

    public Content(TaskType type, String question, List<String> options, String correctAnswer, Media media) {
        this.type = type;
        this.question = question;
        this.options = options;
        this.correctAnswer = correctAnswer;
        this.media = media;
    }

    public TaskType getType() {
        return type;
    }

    @JsonProperty("type")
    public void setType(String type) {
        System.out.println("Tipo:" + type);
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

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public Media getMedia() {
        return media;
    }

    public void setMedia(Media media) {
        this.media = media;
    }

}
