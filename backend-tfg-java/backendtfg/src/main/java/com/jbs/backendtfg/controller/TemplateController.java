package com.jbs.backendtfg.controller;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jbs.backendtfg.document.Template;
import com.jbs.backendtfg.document.User;
import com.jbs.backendtfg.dtos.TemplateDTO;
import com.jbs.backendtfg.service.TemplateService;

@CrossOrigin(origins = "http://localhost:3000") // Permitir peticiones desde React
@RestController
@RequestMapping("/templates")
public class TemplateController {
    
    @Autowired
    private TemplateService templatesService;

    @GetMapping("/allTemplates")
    public ResponseEntity<List<TemplateDTO>> getAllTemplates (@AuthenticationPrincipal User authUser){
        return ResponseEntity.ok(templatesService.getAllTemplates());
    }

    @GetMapping("/allTemplatesCreator") //Todas las plantillas de las que el usuario activo es creador
    public ResponseEntity<List<TemplateDTO>> getAllTemplatesCreator (@AuthenticationPrincipal User authUser){
        return ResponseEntity.ok(templatesService.getTemplatesByCreatorId(authUser.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TemplateDTO> getTemplateFromId (@PathVariable String id, @AuthenticationPrincipal User authUser){
        return ResponseEntity.ok(templatesService.getTemplateById(new ObjectId(id)));
    }

    @PostMapping("/newEmptyTemplate")
    public ResponseEntity<TemplateDTO> createEmptyTemplate (@AuthenticationPrincipal User user){
        return ResponseEntity.ok(templatesService.saveEmptyTemplate(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TemplateDTO> updateTemplate (@PathVariable String id, @AuthenticationPrincipal User user, @RequestBody Template t){
        return ResponseEntity.ok(templatesService.updateTemplate(t));
    }

    @DeleteMapping("/deleteTemplateId/{id}")
    public ResponseEntity<Void> deleteTemplate (@PathVariable String id, @AuthenticationPrincipal User user){
        templatesService.deleteTemplate(new ObjectId(id));
        return ResponseEntity.noContent().build();
    }
}
