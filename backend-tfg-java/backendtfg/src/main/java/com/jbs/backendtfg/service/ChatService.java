package com.jbs.backendtfg.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

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
import com.jbs.backendtfg.repository.UserRepository;

@Service
public class ChatService {

    @Autowired
    private UserRepository userRepository;

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

    public List<ChatDTO> getChatsByIds (List<String> ids){ //Obtenemos todos los chats de un usuario
        List<ChatDTO> chatDTOs = new ArrayList<>(); 
        for (String id : ids) {
            chatDTOs.add(getChatById(id));
        }
        return chatDTOs;
    }

    public List<ChatDTO> getChatsByParticipant (User u){ //Obtenemos todos los chats de un usuario
        List<ChatDTO> chatDTOs = new ArrayList<>(); 
        for (Chat chat : chatRepository.findByParticipantsContaining(u.getId())) {
            chatDTOs.add(new ChatDTO(chat));
        }
        return chatDTOs;
    }

    public ChatDTO newGroupChat(List<String> participantsIds) { //Creamos un nuevo chat, grupal o individual
        ArrayList<ObjectId> participants = new ArrayList<>();
        for (String id : participantsIds) {
            participants.add(new ObjectId(id));
        }
        Collections.sort(participants); //Ordenamos los participantes para evitar duplicados en el caso de chats individuales
    
        Optional<Chat> existingChat = chatRepository.findChatByExactParticipants(participants); //Buscamos si ya existe un chat con esos participantes
        if (existingChat.isPresent()) { //Si ya existe un chat con esos participantes, lo devolvemos
            System.out.println(existingChat.get());
            return new ChatDTO(existingChat.get());
        } else { //Si no existe, lo creamos
            Chat createdChat = chatRepository.save(new Chat(participants)); 

            for (String id : participantsIds) { //Por cada participante, añadimos el chat a su lista de chats
                User user = userRepository.findById(new ObjectId(id)).get();
                user.addChat(createdChat.getId());
                userRepository.save(user);
            }
    
            return new ChatDTO(createdChat);
        }
    }

    public Chat newChatForum(List<ObjectId> participantsIds) { //Forzamos la creación de un chat con los miembros de un grupo que SOLO será accesible desde el grupo
        ArrayList<ObjectId> participants = new ArrayList<>();
        for (ObjectId id : participantsIds) {
            participants.add(id);
        }

        return chatRepository.save(new Chat(participants));
    }

    public Message sendMessage(String userID, String content, String chatId) { //Enviamos un mensaje a un chat, guardándolo en la BD
        Message m = new Message(new ObjectId(userID), LocalDateTime.now(), content, new ObjectId(chatId)); //Creamos el nuevo mensaje
        Message messageAux = messageRepository.save(m);                                                    //Guardamos el mensaje en el repositorio
        Chat chatAux = chatRepository.findById(new ObjectId(chatId)).get();                                //Recuperamos el chat al que pertenece
        chatAux.addMessage(messageAux.getId());                                                            //Añadimos el mensaje al chat
        chatRepository.save(chatAux);
        return messageAux;                                      
    }

    public List<MessageDTO> getChatMessages(String chatId) { //Obtenemos los mensajes de un chat
        List<MessageDTO> messageDTOs = new ArrayList<>();
        for (Message message : messageRepository.findByChatId(new ObjectId(chatId))) {
            messageDTOs.add(new MessageDTO(message));
        }
        return messageDTOs;
    }

    public ChatDTO getSingleChatByParticipants(List<String> participants) { //Obtenemos el chat de la BD con los participantes recibidos
        ArrayList<ObjectId> participantsIds = new ArrayList<>();
        for (String id : participants) {
            participantsIds.add(new ObjectId(id));
        }
        return newGroupChat(participants);
    }
    
}
