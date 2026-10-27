package com.jagannath.driveservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jagannath.driveservice.entity.FileMetaData;

public interface FileMetaDataRepository
        extends JpaRepository<FileMetaData, UUID> {

    List<FileMetaData> findAllByOrderByUploadedAtDesc();
}