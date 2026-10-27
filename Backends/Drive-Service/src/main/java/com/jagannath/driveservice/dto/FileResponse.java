package com.jagannath.driveservice.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.jagannath.driveservice.entity.FileMetaData;

public record FileResponse(
        UUID id,
        String originalName,
        String contentType,
        long size,
        LocalDateTime uploadedAt
) {

    public static FileResponse from(FileMetaData file) {

        return new FileResponse(
                file.getId(),
                file.getOriginalName(),
                file.getContentType(),
                file.getSize(),
                file.getUploadedAt()
        );
    }
}