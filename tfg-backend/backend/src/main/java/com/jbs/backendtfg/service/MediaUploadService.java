package com.jbs.backendtfg.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class MediaUploadService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadMedia (MultipartFile file) throws IOException { //Subimos un archivo a Cloudinary y devolvemos su URL
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        return (String) uploadResult.get("secure_url"); // URL pública
    }

    private String extractPublicIdFromUrl(String url) { //A partir de la URL, extraemos el publicID, que nos permitirá hacer la eliminación
        
        String cleanUrl = url.split("\\?")[0]; // Eliminamos parámetros de la URL si los hubiera
        int index = cleanUrl.indexOf("/upload/"); // Buscamos la parte después de /upload/
        if (index == -1) return null;

        String path = cleanUrl.substring(index + "/upload/".length());
        if (path.matches("^v\\d+/.*")) { // Omitimos la versión si está presente
            path = path.substring(path.indexOf("/") + 1);
        }

        int dotIndex = path.lastIndexOf("."); // Eliminamos la extensión del tipo de archivo
        if (dotIndex != -1) {
            path = path.substring(0, dotIndex);
        }

        return path;
    }

    public void deleteMedia (String url) {
        //Sabemos que el public id, necesario para eliminar el archivo, es la parte final de la URL, antes de la extensión y después del último slash
        String public_id = extractPublicIdFromUrl(url);
        System.out.println(public_id);
        try {
            cloudinary.uploader().destroy(public_id, Map.of()); //Eliminamos el archivo de Cloudinary
        } catch (IOException e) { //Si no se puede eliminar el archivo, se lanza una excepción simple
            e.printStackTrace();
        }
    }

}
