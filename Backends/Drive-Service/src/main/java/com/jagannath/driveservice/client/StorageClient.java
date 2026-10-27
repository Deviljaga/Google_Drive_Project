package com.jagannath.driveservice.client;

import java.util.UUID;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name = "Storage-Service")
public interface StorageClient {

    // Upload file to Storage Service
    @PutMapping(
            value = "/internal/objects/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    void put(
            @PathVariable("id") UUID id,
            @RequestPart("file") MultipartFile file
    );

    // Download file from Storage Service
    @GetMapping("/internal/objects/{id}")
    Resource get(@PathVariable("id") UUID id);

    // Delete file from Storage Service
    @DeleteMapping("/internal/objects/{id}")
    void delete(@PathVariable("id") UUID id);
}

