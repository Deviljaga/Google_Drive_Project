package com.jagannath.driveservice.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;


import com.jagannath.driveservice.client.StorageClient;
import com.jagannath.driveservice.repository.FileMetaDataRepository;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


import com.jagannath.driveservice.dto.FileResponse;
import com.jagannath.driveservice.entity.FileMetaData;


@Service
public class DriveService {
        private final FileMetaDataRepository repository;
        private final StorageClient storageClient;

    public DriveService(FileMetaDataRepository repository, StorageClient storageClient) {
        this.repository = repository;
        this.storageClient = storageClient;
    }


    // Upload file
    public FileResponse upload(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Please select a file"
            );
        }

        UUID id = UUID.randomUUID();

        FileMetaData metadata = new FileMetaData();

        metadata.setId(id);
        metadata.setOriginalName(file.getOriginalFilename() == null
                ? "unnamed"
                : file.getOriginalFilename());
        metadata.setContentType(file.getContentType() == null
                ? MediaType.APPLICATION_OCTET_STREAM_VALUE
                : file.getContentType());
        metadata.setSize(file.getSize());

        // First save the actual file to disk
        storageClient.put(id, file);

        try {

            // Then save metadata in MySQL
            FileMetaData saved = repository.save(metadata);

            return FileResponse.from(saved);

        } catch (RuntimeException ex) {

            // Best-effort cleanup if metadata save fails
            try {
                storageClient.delete(id);
            } catch (RuntimeException cleanupException) {
                ex.addSuppressed(cleanupException);
            }

            throw ex;
        }
    }

    // Get all files
    @Transactional(readOnly = true)
    public List<FileResponse> getAllFiles() {

        return repository.findAllByOrderByUploadedAtDesc()
                .stream()
                .map(FileResponse::from)
                .toList();
    }

    // Get file metadata
    @Transactional(readOnly = true)
    public FileResponse getFileMetadata(UUID id) {

        FileMetaData metadata = repository.findById(id)
                .orElseThrow(() ->
                        new java.util.NoSuchElementException(
                                "File not found: " + id
                        ));

        return FileResponse.from(metadata);
    }

    // Download file
    public ResponseEntity<Resource> download(UUID id) {

        FileMetaData metadata = repository.findById(id)
                .orElseThrow(() ->
                        new java.util.NoSuchElementException(
                                "File not found: " + id
                        ));

        Resource resource = storageClient.get(id);

        MediaType contentType;

        try {
            contentType = MediaType.parseMediaType(
                    metadata.getContentType()
            );
        } catch (Exception ex) {
            contentType = MediaType.APPLICATION_OCTET_STREAM;
        }

        ContentDisposition disposition =
                ContentDisposition.attachment()
                        .filename(
                                metadata.getOriginalName(),
                                StandardCharsets.UTF_8
                        )
                        .build();

        return ResponseEntity.ok()
                .contentType(contentType)
                .contentLength(metadata.getSize())
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        disposition.toString()
                )
                .body(resource);
    }

    // Delete file
    public void delete(UUID id) throws IOException {

        FileMetaData metadata = repository.findById(id)
                .orElseThrow(() ->
                        new java.util.NoSuchElementException(
                                "File not found: " + id
                        ));

        // Delete actual file first
        storageClient.delete(id);

        // Then delete metadata
        repository.delete(metadata);
    }
}
