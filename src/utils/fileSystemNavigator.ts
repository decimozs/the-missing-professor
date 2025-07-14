import type { FileSystem, FileSystemItem } from "@/types/fileSystem";

export class FileSystemNavigator {
  private fileSystem: FileSystem;

  constructor(fileSystem: FileSystem) {
    this.fileSystem = fileSystem;
  }

  getCurrentDirectoryContents(
    currentDirectory: string
  ): { [key: string]: FileSystemItem } | null {
    // For the root directory, return the contents directly
    if (currentDirectory === "C:\\Users\\Professor") {
      return this.fileSystem["C:\\Users\\Professor"].contents;
    }

    // For subdirectories, navigate step by step
    const relativePath = currentDirectory.replace("C:\\Users\\Professor\\", "");
    const pathParts = relativePath.split("\\").filter((p) => p);
    let current = this.fileSystem["C:\\Users\\Professor"].contents;

    for (const part of pathParts) {
      if (current[part] && current[part].type === "directory") {
        current = current[part].contents!;
      } else {
        return null;
      }
    }
    return current;
  }

  getFileContent(
    filename: string,
    currentDirectory: string,
    authenticatedFlags: string[]
  ): string | null {
    const contents = this.getCurrentDirectoryContents(currentDirectory);
    if (!contents || !contents[filename]) {
      return null;
    }

    const file = contents[filename];
    if (file.type !== "file") {
      return null;
    }

    if (file.requiresAuth && !authenticatedFlags.includes(file.authFlag!)) {
      return `ACCESS DENIED: Authentication required. Use 'flag ${file.authFlag}' to authenticate first.`;
    }

    return file.content || null;
  }

  changeDirectory(path: string, currentDirectory: string): string | null {
    let newPath = currentDirectory;

    if (path === "..") {
      const pathParts = currentDirectory.split("\\").filter((p) => p);
      if (pathParts.length > 2) {
        // Don't go above C:\Users\Professor
        pathParts.pop();
        newPath = pathParts.join("\\");
      }
    } else if (path.startsWith("C:\\")) {
      newPath = path;
    } else {
      newPath = currentDirectory + "\\" + path;
    }

    // Check if directory exists
    if (newPath === "C:\\Users\\Professor") {
      return newPath;
    }

    const relativePath = newPath.replace("C:\\Users\\Professor\\", "");
    const pathParts = relativePath.split("\\").filter((p) => p);
    let current = this.fileSystem["C:\\Users\\Professor"].contents;

    for (const part of pathParts) {
      if (current[part] && current[part].type === "directory") {
        current = current[part].contents!;
      } else {
        return null;
      }
    }

    return newPath;
  }

  // Base64 decode function
  decodeBase64(text: string): string {
    try {
      return atob(text);
    } catch {
      return "DECODING_ERROR";
    }
  }
}
