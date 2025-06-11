package com.jbs.backendtfg.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jbs.backendtfg.document.User;
import com.jbs.backendtfg.service.MediaUploadService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/mediaUploader")
public class MediaUploadController {
    
    @Autowired
    private MediaUploadService mediaUploadService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadMedia(@AuthenticationPrincipal User authUser, MultipartFile file) throws IOException{
        String contentType = file.getContentType();

        List<String> allowedTypes = List.of("image/jpg", "image/jpeg", "image/png", "image/gif");
        if (!allowedTypes.contains(contentType)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Tipo de archivo no permitido"));
        }

        String url = mediaUploadService.uploadMedia(file); //Para que el frontend pueda interpretar el JSON correctamente, devolvemos un mapa con la URL
        return ResponseEntity.ok(Map.of("url", url));
    }

    @DeleteMapping("/delete") //Este método solo gestiona la eliminación de multimedia de Cloudinary
    public ResponseEntity<Void> deleteMedia(@AuthenticationPrincipal User authUser, @RequestBody String url){
        mediaUploadService.deleteMedia(url);
        return ResponseEntity.noContent().build();
    }
}
