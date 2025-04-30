package com.jbs.backendtfg.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jbs.backendtfg.document.Chat;
import com.jbs.backendtfg.document.Message;
import com.jbs.backendtfg.dtos.MessageDTO;
import com.jbs.backendtfg.repository.ChatRepository;
import com.jbs.backendtfg.repository.MessageRepository;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatRepository chatRepository;

    public MessageDTO saveMessage(Message msg) {
        ObjectId chatId = msg.getChatId();
        Optional<Chat> chat = chatRepository.findById(chatId);
        MessageDTO sentMessage = new MessageDTO(messageRepository.save(msg));
        if (chat.isPresent()) {
            Chat c = chat.get();
            c.addMessage(new ObjectId(sentMessage.getId()));
            chatRepository.save(c);
        }
        return sentMessage;
    }

    public List<MessageDTO> getMessagesByChatId(String chatId) {
        Chat c = chatRepository.findById(new ObjectId(chatId)).get();
        List<ObjectId> messageIds = c.getMessages();
        List<MessageDTO> toReturn = new ArrayList<>();
        for (ObjectId id : messageIds) {
            Optional<Message> message = messageRepository.findById(id);
            if (message.isPresent()) {
                toReturn.add(new MessageDTO(message.get()));
            }
        }

        return toReturn;
    }
    
}
