package com.jbs.backendtfg.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jbs.backendtfg.document.Chat;
import com.jbs.backendtfg.document.Message;
import com.jbs.backendtfg.document.User;
import com.jbs.backendtfg.dtos.ChatDTO;
import com.jbs.backendtfg.dtos.MessageDTO;
import com.jbs.backendtfg.repository.ChatRepository;
import com.jbs.backendtfg.repository.MessageRepository;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private MessageRepository messageRepository;

    public List<ChatDTO> getAllChats () { //Obtenemos todos los chats de la BD
        List<ChatDTO> chatDTOs = new ArrayList<>();
        for (Chat chat : chatRepository.findAll()) {
            chatDTOs.add(new ChatDTO(chat));
        }
        return chatDTOs;
    }

    public ChatDTO getChatById(String chatId) { //Obtenemos un chat de la BD por su id
        if (chatRepository.findById(new ObjectId(chatId)).isPresent()) {
            return new ChatDTO(chatRepository.findById(new ObjectId(chatId)).get());
        } else 
            return null;
    }

    public List<ChatDTO> getChatsByParticipant (User u){ //Obtenemos todos los chats de un usuario
        List<ChatDTO> chatDTOs = new ArrayList<>(); 
        for (Chat chat : chatRepository.findByParticipantsContaining(u.getId())) {
            chatDTOs.add(new ChatDTO(chat));
        }
        return chatDTOs;
    }

    public ChatDTO newGroupChat(User u, List<String> participantsIds) {
        ArrayList <ObjectId> participants = new ArrayList<>();
        participants.add(u.getId());
        for (String id : participantsIds) {
            participants.add(new ObjectId(id));
        }
        if (chatRepository.findByParticipants(participants).isPresent()) { //Si existe un chat con los mismos participantes, lo devolvemos sin crear uno nuevo
            return new ChatDTO(chatRepository.findByParticipants(participants).get());
        } else {
            Chat chat = new Chat(participants);
            return new ChatDTO(chatRepository.save(chat)); //Si no existe, lo creamos
        }
    }

    public ChatDTO newChat(User u, String participantId) {
        ArrayList <ObjectId> participants = new ArrayList<>();
        participants.add(u.getId());
        participants.add(new ObjectId(participantId.replaceAll("\"", ""))); //Dado que el frontend nos devuelve el string del id con comillas, las suprimimos para hcer la conversión a ObjectId (ObjectId requiere 24 caracteres)
        if (chatRepository.findByParticipants(participants).isPresent()) {
            return new ChatDTO(chatRepository.findByParticipants(participants).get());
        } else {
            Chat chat = new Chat(participants);
            return new ChatDTO(chatRepository.save(chat));
        }
    }

    public Message sendMessage(String userID, String content, String chatId) {                         //Enviamos un mensaje a un chat, guardándolo en la BD
        Message m = new Message(new ObjectId(userID), LocalDateTime.now(), content, new ObjectId(chatId)); //Creamos el nuevo mensaje
        Message messageAux = messageRepository.save(m);                                         //Guardamos el mensaje en el repositorio
        Chat chatAux = chatRepository.findById(new ObjectId(chatId)).get();                     //Recuperamos el chat al que pertenece
        chatAux.addMessage(messageAux.getId());                                 //Añadimos el mensaje al chat
        chatRepository.save(chatAux);
        return messageAux;                                      
    }

    public List<MessageDTO> getChatMessages(String chatId) {
        List<MessageDTO> messageDTOs = new ArrayList<>();
        for (Message message : messageRepository.findByChatId(new ObjectId(chatId))) {
            messageDTOs.add(new MessageDTO(message));
        }
        return messageDTOs;
    }
    
}
