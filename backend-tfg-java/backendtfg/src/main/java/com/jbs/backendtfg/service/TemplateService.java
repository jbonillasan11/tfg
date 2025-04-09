package com.jbs.backendtfg.service;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jbs.backendtfg.document.Template;
import com.jbs.backendtfg.document.User;
import com.jbs.backendtfg.dtos.TemplateDTO;
import com.jbs.backendtfg.repository.TemplateRepository;

@Service
public class TemplateService {

    @Autowired
    private TemplateRepository templatesRepository;

    public List<TemplateDTO> getAllTemplates(){
        List<TemplateDTO> toReturn = new ArrayList<>();
        for (Template t : templatesRepository.findAll()) {
            toReturn.add(new TemplateDTO(t));
        } 
        return toReturn;
    }

    public TemplateDTO saveEmptyTemplate (User u){
        return new TemplateDTO(templatesRepository.save(new Template(u.getId())));
    }

    public TemplateDTO getTemplateById (ObjectId id){
        if (templatesRepository.findById(id).isPresent()){
            return new TemplateDTO(templatesRepository.findById(id).get());
        } else return null;
    }

    public List<TemplateDTO> getTemplatesByCreatorId(ObjectId id) { //Obtenemos todas las tareas de las que el usuario es creador
        List<TemplateDTO> lTemplatesDTO = new ArrayList<>();
        for (Template t : templatesRepository.findByCreator(id)) {
            lTemplatesDTO.add(new TemplateDTO(t));
        }
        return lTemplatesDTO;
    }

    public TemplateDTO updateTemplate (Template temp){
        return new TemplateDTO(templatesRepository.save(temp));
    }

    public void deleteTemplate (ObjectId id){
        if (templatesRepository.findById(id).isPresent()){
            templatesRepository.delete(templatesRepository.findById(id).get());
        }
    }

}
