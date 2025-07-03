package com.jbs.backendtfg.controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.jbs.backendtfg.document.Message;
import com.jbs.backendtfg.dtos.MessageDTO;
import com.jbs.backendtfg.service.MessageService;

@Controller
public class ChatWebSocketController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/send") // Endpoint para recibir mensajes
    public MessageDTO enviarMensaje(@Payload Message msg) {
        msg.setTimestamp(LocalDateTime.now());
        MessageDTO saved = messageService.saveMessage(msg);

        messagingTemplate.convertAndSend("/topic/messages/" + msg.getChatId(), saved);

        return saved;
    }
    
}
