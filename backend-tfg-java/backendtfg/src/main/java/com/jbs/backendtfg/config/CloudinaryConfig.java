package com.jbs.backendtfg.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "dmtwfww3b");
        config.put("api_key", "215422172919691");
        config.put("api_secret", "yVSZuxd5VzqUedLu4KQlXJ1Ipwg");
        return new Cloudinary(config);
    }
}
