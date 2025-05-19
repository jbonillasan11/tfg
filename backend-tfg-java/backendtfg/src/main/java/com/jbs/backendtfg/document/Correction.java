package com.jbs.backendtfg.document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class Correction {

    private Double calification;
    private String comment;

    public Correction() {
        this.calification = 0.0;
        this.comment = "";
    }
}
