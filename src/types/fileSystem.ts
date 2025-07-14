export interface FileSystemItem {
  type: "directory" | "file";
  content?: string;
  requiresAuth?: boolean;
  authFlag?: string;
  contents?: { [key: string]: FileSystemItem };
}

export interface FileSystem {
  [key: string]: {
    type: "directory";
    contents: { [key: string]: FileSystemItem };
  };
}

export const createFileSystem = (): FileSystem => ({
  "C:\\Users\\Professor": {
    type: "directory",
    contents: {
      Desktop: {
        type: "directory",
        contents: {
          "research_notes.txt": {
            type: "file",
            content:
              "Research on AI consciousness started in 1968... Flag: 1968ER",
            requiresAuth: false,
          },
          ai_project: {
            type: "directory",
            contents: {
              "encrypted_data.zip": {
                type: "file",
                content:
                  "Encrypted archives unlocked! Found classified AI research data and communication logs. The AI system was more advanced than initially thought. Next location hint: Check the lab_access directory in Documents for USB coordinates.",
                requiresAuth: true,
                authFlag: "AI_LAB_NOTES",
              },
            },
          },
        },
      },
      Documents: {
        type: "directory",
        contents: {
          lab_access: {
            type: "directory",
            contents: {
              "location_file.dat": {
                type: "file",
                content:
                  "USB Device Location: Building 7, Lab Station 12. Access Code: L0C4T1ON_U5B. This USB contains critical data about the Professor's research. Investigate secure_vault directory for backup files.",
                requiresAuth: true,
                authFlag: "1968ER",
              },
            },
          },
          secure_vault: {
            type: "directory",
            contents: {
              "professor_backup.enc": {
                type: "file",
                content:
                  "BACKUP DECRYPTED: Professor Ramirez is safe but in hiding. Location: University of South Florida, Room 24. Security situation resolved. Final authentication required: Professor_USF_24. Check final_message.b64 for complete details.",
                requiresAuth: true,
                authFlag: "L0C4T1ON_U5B",
              },
              "final_message.b64": {
                type: "file",
                content:
                  "V2VsbCBkb25lISBZb3UgaGF2ZSBzdWNjZXNzZnVsbHkgbmF2aWdhdGVkIHRoZSBmaWxlIHN5c3RlbSBhbmQgZm91bmQgYWxsIGhpZGRlbiBmbGFncy4gUHJvZmVzc29yIFJhbWlyZXogaXMgc2FmZSBhbmQgaW1wcmVzc2VkIHdpdGggeW91ciBza2lsbHMu",
                requiresAuth: true,
                authFlag: "Professor_USF_24",
              },
            },
          },
        },
      },
      AppData: {
        type: "directory",
        contents: {
          "hidden_logs.txt": {
            type: "file",
            content:
              "System access logs show unauthorized entry. Investigate further...",
            requiresAuth: false,
          },
        },
      },
    },
  },
});

export const expectedFlags = {
  room1: "1968ER",
  room2: "AI_LAB_NOTES",
  room3: "L0C4T1ON_U5B",
  room4: "Professor_USF_24",
} as const;

export type ExpectedFlag = (typeof expectedFlags)[keyof typeof expectedFlags];
