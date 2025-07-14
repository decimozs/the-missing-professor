import type { Clue } from "@/stores/gameStore";
import { expectedFlags, type ExpectedFlag } from "@/types/fileSystem";
import { FileSystemNavigator } from "@/utils/fileSystemNavigator";

interface CommandContext {
  currentDirectory: string;
  discoveredFlags: string[];
  authenticatedFlags: string[];
  clues: Clue[];
  navigator: FileSystemNavigator;
  addTerminalLine: (line: string) => void;
  addClue: (clue: Clue) => void;
  setDiscoveredFlags: React.Dispatch<React.SetStateAction<string[]>>;
  setAuthenticatedFlags: React.Dispatch<React.SetStateAction<string[]>>;
  setCurrentDirectory: React.Dispatch<React.SetStateAction<string>>;
  setGameCompleted: React.Dispatch<React.SetStateAction<boolean>>;
}

export class CommandProcessor {
  private context: CommandContext;

  constructor(context: CommandContext) {
    this.context = context;
  }

  processCommand(command: string): void {
    const parts = command.split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case "help":
        this.handleHelp();
        break;
      case "dir":
      case "ls":
        this.handleDir();
        break;
      case "cd":
        this.handleCd(args[0]);
        break;
      case "type":
      case "cat":
        this.handleType(args[0]);
        break;
      case "pwd":
        this.handlePwd();
        break;
      case "whoami":
        this.handleWhoami();
        break;
      case "flag":
        this.handleFlag(args.join(" "));
        break;
      case "decode":
        this.handleDecode(args[0], args.slice(1).join(" "));
        break;
      case "clear":
      case "cls":
        this.handleClear();
        break;
      case "tree":
        this.handleTree();
        break;
      case "clues":
        this.handleClues();
        break;
      case "debug":
        this.handleDebug();
        break;
      case "copy":
        this.handleCopy(args[0]);
        break;
      case "hints":
        this.handleHints();
        break;
      default:
        this.context.addTerminalLine(
          `'${cmd}' is not recognized as an internal or external command,`
        );
        this.context.addTerminalLine("operable program or batch file.");
        this.context.addTerminalLine("Type 'help' for available commands.");
    }
  }

  private handleHelp(): void {
    this.context.addTerminalLine("Available commands:");
    this.context.addTerminalLine("");
    this.context.addTerminalLine("dir, ls          - List directory contents");
    this.context.addTerminalLine("cd <directory>   - Change directory");
    this.context.addTerminalLine("type <file>      - Display file contents");
    this.context.addTerminalLine(
      "cat <file>       - Display file contents (Linux style)"
    );
    this.context.addTerminalLine("pwd              - Show current directory");
    this.context.addTerminalLine("whoami           - Show current user");
    this.context.addTerminalLine("tree             - Show directory tree");
    this.context.addTerminalLine(
      "flag <flag>      - Use a discovered flag for authentication"
    );
    this.context.addTerminalLine("decode base64 <text> - Decode Base64 text");
    this.context.addTerminalLine(
      "clues            - Show collected clues from previous rooms"
    );
    this.context.addTerminalLine(
      "copy <filename>   - Copy file content to clipboard"
    );
    this.context.addTerminalLine(
      "hints            - Show file access requirements"
    );
    this.context.addTerminalLine("clear, cls       - Clear screen");
    this.context.addTerminalLine("help             - Show this help message");
    this.context.addTerminalLine("");
    this.context.addTerminalLine(
      "Tip: Navigate through directories to find hidden files and clues!"
    );
  }

  private handleDir(): void {
    const contents = this.context.navigator.getCurrentDirectoryContents(
      this.context.currentDirectory
    );
    if (!contents) {
      this.context.addTerminalLine("Directory not found.");
      return;
    }

    this.context.addTerminalLine(
      ` Directory of ${this.context.currentDirectory}`
    );
    this.context.addTerminalLine("");
    this.context.addTerminalLine(
      `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}    <DIR>          .`
    );
    this.context.addTerminalLine(
      `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}    <DIR>          ..`
    );

    Object.entries(contents).forEach(([name, item]) => {
      const date = new Date().toLocaleDateString();
      const time = new Date().toLocaleTimeString();
      if (item.type === "directory") {
        this.context.addTerminalLine(
          `${date} ${time}    <DIR>          ${name}`
        );
      } else {
        const size = item.content?.length || 0;
        this.context.addTerminalLine(
          `${date} ${time}                ${size.toString().padStart(4)} ${name}`
        );
      }
    });
    this.context.addTerminalLine(
      `               ${Object.keys(contents).length} File(s)`
    );
    this.context.addTerminalLine("");
  }

  private handleCd(path: string): void {
    if (!path) {
      this.context.addTerminalLine(this.context.currentDirectory);
      return;
    }

    const newPath = this.context.navigator.changeDirectory(
      path,
      this.context.currentDirectory
    );
    if (newPath) {
      this.context.setCurrentDirectory(newPath);
    } else {
      this.context.addTerminalLine(
        "The system cannot find the path specified."
      );
    }
  }

  private handleType(filename: string): void {
    if (!filename) {
      this.context.addTerminalLine("The syntax of the command is incorrect.");
      this.context.addTerminalLine("Usage: type <filename>");
      return;
    }

    const content = this.context.navigator.getFileContent(
      filename,
      this.context.currentDirectory,
      this.context.authenticatedFlags
    );

    if (content === null) {
      this.context.addTerminalLine(
        "The system cannot find the file specified."
      );
    } else if (content.includes("ACCESS DENIED")) {
      this.context.addTerminalLine(content);
      this.context.addTerminalLine("");
      this.context.addTerminalLine(
        "💡 HINT: Use 'hints' command to see which flags unlock which files"
      );
      this.context.addTerminalLine(
        "💡 HINT: Use 'flag <flagname>' to authenticate with discovered flags"
      );
    } else {
      this.context.addTerminalLine(content);
      // Check if this file contains a flag we haven't discovered yet
      Object.values(expectedFlags).forEach((flag) => {
        if (
          content.includes(flag) &&
          !this.context.discoveredFlags.includes(flag)
        ) {
          this.context.addTerminalLine("");
          this.context.addTerminalLine(`🚩 FLAG DISCOVERED: ${flag}`);
          this.context.addTerminalLine(
            "Use 'flag <flagname>' to authenticate with this flag"
          );

          this.context.addClue({
            id: `room5-flag-${flag}`,
            title: `Flag Found: ${flag}`,
            content: `Discovered flag ${flag} in file: ${filename}`,
            foundAt: `${this.context.currentDirectory}\\${filename}`,
            roomId: "room5",
          });
        }
      });
    }
  }

  private handlePwd(): void {
    this.context.addTerminalLine(this.context.currentDirectory);
  }

  private handleWhoami(): void {
    this.context.addTerminalLine("prof-ramirez-pc\\professor");
  }

  private handleFlag(flagName: string): void {
    if (!flagName) {
      this.context.addTerminalLine("Usage: flag <flagname>");
      this.context.addTerminalLine("Available flags from previous rooms:");
      Object.values(expectedFlags).forEach((flag) => {
        const status = this.context.discoveredFlags.includes(flag)
          ? "✅ Available"
          : "❌ Not collected";
        this.context.addTerminalLine(`  ${flag} - ${status}`);
      });
      this.context.addTerminalLine("");
      this.context.addTerminalLine(
        "If you've completed previous rooms but flags aren't showing,"
      );
      this.context.addTerminalLine(
        "use 'clues' to see collected clues or 'debug' for more info."
      );
      return;
    }

    // More flexible flag checking - allow if room is completed
    const roomCompletionCheck: Record<ExpectedFlag, boolean> = {
      "1968ER": this.context.clues.some(
        (c) => c.roomId === "room1" || c.content.includes("1968")
      ),
      AI_LAB_NOTES: this.context.clues.some(
        (c) => c.roomId === "room2" || c.content.toLowerCase().includes("ai")
      ),
      L0C4T1ON_U5B: this.context.clues.some(
        (c) => c.roomId === "room3" || c.content.includes("L0C4T")
      ),
      Professor_USF_24: this.context.clues.some(
        (c) => c.roomId === "room4" || c.content.includes("Professor")
      ),
    };

    if (Object.values(expectedFlags).includes(flagName as ExpectedFlag)) {
      const flag = flagName as ExpectedFlag;
      if (
        this.context.discoveredFlags.includes(flag) ||
        roomCompletionCheck[flag]
      ) {
        this.context.addTerminalLine(`✅ Using flag: ${flag}`);
        this.context.addTerminalLine(
          "Authentication successful! You can now access protected files."
        );
        // Add flag to discovered flags if not already there
        if (!this.context.discoveredFlags.includes(flag)) {
          this.context.setDiscoveredFlags((prev) => [...prev, flag]);
        }
        // Add to authenticated flags for file access
        if (!this.context.authenticatedFlags.includes(flag)) {
          this.context.setAuthenticatedFlags((prev) => [...prev, flag]);
        }
      } else {
        this.context.addTerminalLine(
          `❌ Flag ${flag} not found in your collection.`
        );
        this.context.addTerminalLine("Complete the corresponding room first:");
        this.context.addTerminalLine("  1968ER - Room 1");
        this.context.addTerminalLine("  AI_LAB_NOTES - Room 2");
        this.context.addTerminalLine("  L0C4T1ON_U5B - Room 3");
        this.context.addTerminalLine("  Professor_USF_24 - Room 4");
      }
    } else {
      this.context.addTerminalLine(
        "Invalid flag. Use flags discovered from previous rooms."
      );
    }
  }

  private handleDecode(type: string, text: string): void {
    if (type === "base64" && text) {
      const decoded = this.context.navigator.decodeBase64(text);
      if (decoded !== "DECODING_ERROR") {
        this.context.addTerminalLine("Decoded message:");
        this.context.addTerminalLine(decoded);
        this.checkGameCompletion(decoded);
      } else {
        this.context.addTerminalLine("Failed to decode Base64 text.");
      }
    } else if (type === "file" && text) {
      // Decode Base64 content directly from a file
      const content = this.context.navigator.getFileContent(
        text,
        this.context.currentDirectory,
        this.context.authenticatedFlags
      );

      if (content === null) {
        this.context.addTerminalLine(
          "The system cannot find the file specified."
        );
        return;
      }

      if (content.includes("ACCESS DENIED")) {
        this.context.addTerminalLine(content);
        return;
      }

      // Extract Base64 content if it's a .b64 file
      if (text.endsWith(".b64")) {
        const decoded = this.context.navigator.decodeBase64(content);
        if (decoded !== "DECODING_ERROR") {
          this.context.addTerminalLine(`Decoded content from ${text}:`);
          this.context.addTerminalLine(decoded);
          this.checkGameCompletion(decoded);
        } else {
          this.context.addTerminalLine(
            "Failed to decode Base64 content from file."
          );
        }
      } else {
        this.context.addTerminalLine(
          "File is not a Base64 encoded file (.b64)"
        );
      }
    } else {
      this.context.addTerminalLine("Usage:");
      this.context.addTerminalLine(
        "  decode base64 <base64_text> - Decode Base64 text"
      );
      this.context.addTerminalLine(
        "  decode file <filename.b64>  - Decode Base64 file directly"
      );
    }
  }

  private checkGameCompletion(decoded: string): void {
    if (
      decoded.includes("successfully navigated") ||
      decoded.includes("impressed with your skills")
    ) {
      this.context.setGameCompleted(true);
      this.context.addTerminalLine("");
      this.context.addTerminalLine("🎉 CONGRATULATIONS! 🎉");
      this.context.addTerminalLine(
        "You have successfully completed 'The Missing Professor'!"
      );

      this.context.addClue({
        id: "room5-game-complete",
        title: "GAME COMPLETED!",
        content: `Final message decoded: "${decoded}"`,
        foundAt: "Terminal Decoding",
        roomId: "room5",
      });
    }
  }

  private handleClear(): void {
    // This will be handled by the parent component
  }

  private handleTree(): void {
    this.context.addTerminalLine("Folder PATH listing");
    this.context.addTerminalLine("Volume serial number is 1A2B-3C4D");
    this.context.addTerminalLine("C:\\USERS\\PROFESSOR");
    this.context.addTerminalLine("├───Desktop");
    this.context.addTerminalLine("│   └───ai_project");
    this.context.addTerminalLine("├───Documents");
    this.context.addTerminalLine("│   ├───lab_access");
    this.context.addTerminalLine("│   └───secure_vault");
    this.context.addTerminalLine("└───AppData");
    this.context.addTerminalLine("");
    this.context.addTerminalLine(
      "Tip: Use 'cd' to navigate and 'dir' to list files in each directory"
    );
  }

  private handleClues(): void {
    this.context.addTerminalLine("=== COLLECTED CLUES ===");
    if (this.context.clues.length === 0) {
      this.context.addTerminalLine(
        "No clues collected yet. Complete previous rooms first."
      );
    } else {
      this.context.clues.forEach((clue, index) => {
        this.context.addTerminalLine(
          `${index + 1}. ${clue.title} (${clue.roomId})`
        );
        this.context.addTerminalLine(`   ${clue.content.substring(0, 100)}...`);
        this.context.addTerminalLine("");
      });
    }
    this.context.addTerminalLine(`Total clues: ${this.context.clues.length}`);
    this.context.addTerminalLine(
      `Available flags: ${this.context.discoveredFlags.join(", ") || "None"}`
    );
  }

  private handleDebug(): void {
    this.context.addTerminalLine("=== DEBUG INFO ===");
    this.context.addTerminalLine(
      `Current flags: ${this.context.discoveredFlags.join(", ")}`
    );
    this.context.addTerminalLine(`Total clues: ${this.context.clues.length}`);
    this.context.addTerminalLine("Clue details:");
    this.context.clues.forEach((clue, index) => {
      this.context.addTerminalLine(
        `${index + 1}. Room: ${clue.roomId}, Title: ${clue.title}`
      );
    });
  }

  private async handleCopy(filename: string): Promise<void> {
    if (!filename) {
      this.context.addTerminalLine("Usage: copy <filename>");
      this.context.addTerminalLine(
        "Copies file content to clipboard for easy access"
      );
      return;
    }

    const content = this.context.navigator.getFileContent(
      filename,
      this.context.currentDirectory,
      this.context.authenticatedFlags
    );

    if (content === null) {
      this.context.addTerminalLine(
        "The system cannot find the file specified."
      );
      return;
    }

    if (content.includes("ACCESS DENIED")) {
      this.context.addTerminalLine(content);
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      this.context.addTerminalLine(
        `✅ Content of ${filename} copied to clipboard!`
      );
      this.context.addTerminalLine(
        "You can now paste it elsewhere or use it with decode command."
      );
    } catch {
      this.context.addTerminalLine("❌ Failed to copy to clipboard.");
      this.context.addTerminalLine("Displaying content for manual copy:");
      this.context.addTerminalLine("--- START CONTENT ---");
      this.context.addTerminalLine(content);
      this.context.addTerminalLine("--- END CONTENT ---");
    }
  }

  private handleHints(): void {
    this.context.addTerminalLine("=== FILE ACCESS HINTS ===");
    this.context.addTerminalLine("");
    this.context.addTerminalLine("📂 Directory Structure & Required Flags:");
    this.context.addTerminalLine("");
    this.context.addTerminalLine(
      "Desktop/research_notes.txt                    ✅ Open access"
    );
    this.context.addTerminalLine(
      "Desktop/ai_project/encrypted_data.zip         🔑 Needs: AI_LAB_NOTES"
    );
    this.context.addTerminalLine("");
    this.context.addTerminalLine(
      "Documents/lab_access/location_file.dat        🔑 Needs: 1968ER"
    );
    this.context.addTerminalLine(
      "Documents/secure_vault/professor_backup.enc   🔑 Needs: L0C4T1ON_U5B"
    );
    this.context.addTerminalLine(
      "Documents/secure_vault/final_message.b64      🔑 Needs: Professor_USF_24"
    );
    this.context.addTerminalLine("");
    this.context.addTerminalLine(
      "AppData/hidden_logs.txt                       ✅ Open access"
    );
    this.context.addTerminalLine("");
    this.context.addTerminalLine("🎯 FLAG PROGRESSION:");
    this.context.addTerminalLine("  1968ER (Room 1) → location_file.dat");
    this.context.addTerminalLine(
      "  AI_LAB_NOTES (Room 2) → encrypted_data.zip"
    );
    this.context.addTerminalLine(
      "  L0C4T1ON_U5B (Room 3) → professor_backup.enc"
    );
    this.context.addTerminalLine(
      "  Professor_USF_24 (Room 4) → final_message.b64"
    );
    this.context.addTerminalLine("");
    this.context.addTerminalLine(
      "💡 TIP: Use 'flag <flagname>' to authenticate with discovered flags"
    );
    this.context.addTerminalLine(
      "💡 TIP: Complete previous rooms to discover more flags"
    );
  }
}
