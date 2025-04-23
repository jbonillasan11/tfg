package com.jbs.backendtfg.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jbs.backendtfg.document.User;
import com.jbs.backendtfg.dtos.ChatDTO;
import com.jbs.backendtfg.dtos.MessageDTO;
import com.jbs.backendtfg.service.ChatService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/chats")
public class ChatController {
    
    @Autowired
    private ChatService chatService;

    @GetMapping("/getAllChats")
    public ResponseEntity<List<ChatDTO>> getAllChats(){
        return ResponseEntity.ok(chatService.getAllChats());
    }

    @GetMapping("/getUserChats")
    public ResponseEntity<List<ChatDTO>> getAllUserChats(@AuthenticationPrincipal User authUser){
        return ResponseEntity.ok(chatService.getChatsByParticipant(authUser));
    }

    @GetMapping("/getChatById/{id}")
    public ResponseEntity<ChatDTO> getChatById(@PathVariable String id, @AuthenticationPrincipal User authUser){
        return ResponseEntity.ok(chatService.getChatById(id));
    }

    @GetMapping("/getChatMessages/{chatId}")
    public ResponseEntity<List<MessageDTO>> getChatMessages(@PathVariable String chatId, @AuthenticationPrincipal User authUser){
        return ResponseEntity.ok(chatService.getChatMessages(chatId));
    } 

    @PostMapping("/getSingleChatByParticipants")
    public ResponseEntity<ChatDTO> getSingleChatByParticipants(@RequestBody List<String> participants){
        return ResponseEntity.ok(chatService.getSingleChatByParticipants(participants));
    }

    @PostMapping("/newChat")
    public ResponseEntity<ChatDTO> createNewGroupChat(@AuthenticationPrincipal User authUser, @RequestBody List<String> participants){
        return ResponseEntity.ok(chatService.newGroupChat(participants));
    }


    /*@MessageMapping("/sendMessage")
    @SendTo("/topic/chat")
    public MessageDTO broadcastMessage(MessageDTO message) {
        return new MessageDTO(chatService.sendMessage(message.getSender(), message.getChatId(), message.getContent()));
    }*/

    ///////////////////////////
    

    @MessageMapping("/sendMessage")
    @SendTo("/topic/chat")
    public MessageDTO broadcastMessage(MessageDTO message) {
        return new MessageDTO(chatService.sendMessage(message.getChatId(), message.getSender(), message.getContent()));
    }


}
