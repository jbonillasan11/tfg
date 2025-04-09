package com.jbs.backendtfg.document;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum UserType {
    PROFESSOR,
    STUDENT,
    ADMIN;

    @JsonCreator
    public static UserType fromString(String value) {
        return UserType.valueOf(value.toUpperCase());
    }

}