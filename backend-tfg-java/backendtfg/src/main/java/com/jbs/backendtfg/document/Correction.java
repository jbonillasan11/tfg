package com.jbs.backendtfg.document;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class Correction {

    private Double calification;
    private List<String> comment = new ArrayList<>();

    public Correction() {
        this.calification = 0.0;
    }
}
