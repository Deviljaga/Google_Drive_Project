package com.jagannath.driveservice.model;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
public class DriveItem {

    private String mediaType;
    private Long size;

    public enum Kind {FILE, FOLDER}

    public enum Status {PENDING, READY, DELETING}

    @Id
    private UUID id;

    @Column(nullable = false)
    private String name;

    private UUID parentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Kind kind;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(nullable = false)
    private Instant createdAt;

    @Version
    private Long version;

    protected DriveItem() {
    }

    public DriveItem(String name, UUID parentId, Kind kind, Long size, String mediaType) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.parentId = parentId;
        this.kind = kind;
        this.size = size;
        this.mediaType = mediaType;
        this.status = kind == Kind.FOLDER ? Status.READY : Status.PENDING;
        this.createdAt = Instant.now();
    }

    public String getMediaType() {
        return mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UUID getParentId() {
        return parentId;
    }

    public void setParentId(UUID parentId) {
        this.parentId = parentId;
    }

    public Kind getKind() {
        return kind;
    }

    public void setKind(Kind kind) {
        this.kind = kind;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }
}
