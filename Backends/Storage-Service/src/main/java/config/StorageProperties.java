package config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@ConfigurationProperties(prefix = "storage")
@Configuration
public class StorageProperties {

    private String directory;

    public String getDirectory() {
        return directory;
    }

    public StorageProperties() {
    }

    public void setDirectory(String directory) {
        this.directory = directory;
    }
}