package com.jbs.backendtfg.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jbs.backendtfg.document.User;
import com.jbs.backendtfg.dtos.MessageDTO;
import com.jbs.backendtfg.service.MessageService;

@RestController
@CrossOrigin(origins = "https://tfg-wkhx.vercel.app")
@RequestMapping("/messages")
public class MessageController {
    
    @Autowired
    private MessageService messageService;

    @GetMapping("/getSingleMessage/{messageId}") //Obtenemos un mensaje por su ID
    public ResponseEntity<MessageDTO> getSingleMessage(@AuthenticationPrincipal User authUser, @PathVariable String messageId){ 
        return ResponseEntity.ok(messageService.getSingleMessage(messageId));
    }

    @PostMapping("/getMessagesByChatId/{chatId}") //Obtenemos la lista de mensajes de un chat
    public ResponseEntity<List<MessageDTO>> getMessagesByChatId(@AuthenticationPrincipal User authUser, @PathVariable String chatId){ 
        return ResponseEntity.ok(messageService.getMessagesByChatId(chatId));
    }
}
