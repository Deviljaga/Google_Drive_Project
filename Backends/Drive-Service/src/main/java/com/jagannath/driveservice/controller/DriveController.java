package com.jagannath.driveservice.controller;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.jagannath.driveservice.dto.FileResponse;
import com.jagannath.driveservice.service.DriveService;

@RestController
@RequestMapping("/api/files")
public class DriveController {

    private final DriveService driveService;

    public DriveController(DriveService driveService) {
        this.driveService = driveService;
    }

    // Upload file
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<FileResponse> upload(
            @RequestPart("file") MultipartFile file
    ) {

        FileResponse response = driveService.upload(file);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Get all files
    @GetMapping
    public ResponseEntity<List<FileResponse>> getAllFiles() {

        return ResponseEntity.ok(
                driveService.getAllFiles()
        );
    }

    // Get metadata of one file
    @GetMapping("/{id}/metadata")
    public ResponseEntity<FileResponse> getMetadata(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                driveService.getFileMetadata(id)
        );
    }

    // Download file
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(
            @PathVariable UUID id
    ) {

        return driveService.download(id);
    }

    // Delete file
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id
    ) throws IOException {

        driveService.delete(id);

        return ResponseEntity.noContent().build();
    }
}
