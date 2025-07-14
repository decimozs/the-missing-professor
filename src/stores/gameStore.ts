import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  answer: string;
  points: number;
  completed: boolean;
  unlocked: boolean;
  hint?: string;
  roomId: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  image?: string;
  unlocked: boolean;
  completed: boolean;
  challenges: Challenge[];
}

export interface Clue {
  id: string;
  title: string;
  content: string;
  foundAt: string;
  roomId: string;
}

export interface GameState {
  playerName: string;
  score: number;
  gameStarted: boolean;
  gameCompleted: boolean;
  currentRoom: string;
  rooms: Room[];
  clues: Clue[];
  // Room-specific progress
  room1Progress: {
    zipClicked: boolean;
    attempts: number;
    stickyNoteViewed: boolean;
    logViewed: boolean;
    zipUnlocked: boolean;
  };
  room2Progress: {
    started: boolean;
    solved: boolean;
    attempts: number;
    correctShift: number;
  };
}

export interface GameActions {
  setPlayerName: (name: string) => void;
  startGame: () => void;
  setCurrentRoom: (roomId: string) => void;
  submitAnswer: (challengeId: string, answer: string) => boolean;
  addClue: (clue: Clue) => void;
  resetGame: () => void;
  // Room 1 specific actions
  updateRoom1Progress: (progress: Partial<GameState["room1Progress"]>) => void;
  // Room 2 specific actions
  updateRoom2Progress: (progress: Partial<GameState["room2Progress"]>) => void;
}

const initialRooms: Room[] = [
  {
    id: "room1",
    name: "Professor's Office",
    description:
      "Professor Eladio Ramirez's cluttered office. His computer is still on, and there's a locked ZIP file on the desktop.",
    unlocked: true,
    completed: false,
    challenges: [
      {
        id: "room1-zip",
        title: "The Last Login",
        description:
          "Find the password to unlock the research_data.zip file on Professor Ramirez's desktop. Analyze the login logs and personal clues.",
        answer: "1968ER",
        points: 100,
        completed: false,
        unlocked: true,
        hint: "Professor uses birth year + initials pattern. Moon landing year + E.R.",
        roomId: "room1",
      },
    ],
  },
  {
    id: "room2",
    name: "AI Notes Encrypted",
    description:
      "A high-tech research terminal with encrypted AI notes. Decrypt the Caesar cipher from Room 1's message.",
    unlocked: false,
    completed: false,
    challenges: [
      {
        id: "room2-cipher",
        title: "Caesar Cipher Decryption",
        description:
          "Decrypt the encoded message found in Professor's ZIP file using Caesar cipher techniques.",
        answer: "HELLO, YOU HAVE DISCOVERED THE FIRST HINT. RETURN TO THE DESK FOR THE NEXT CLUE.",
        points: 150,
        completed: false,
        unlocked: true,
        hint: "Look for letter frequency patterns. The most frequent letter in the decrypted text should be 'E'.",
        roomId: "room2",
      },
    ],
  },
  {
    id: "room3",
    name: "Library Archives",
    description:
      "Ancient books and documents line the walls. Something seems hidden among the texts.",
    unlocked: false,
    completed: false,
    challenges: [
      {
        id: "ancient-cipher",
        title: "Ancient Text Cipher",
        description:
          "Read the first letter of each line in the ancient manuscript to reveal a hidden word.",
        answer: "VAULT",
        points: 200,
        completed: false,
        unlocked: true,
        hint: "The first letter of each line spells something: V-A-U-L-T",
        roomId: "room3",
      },
    ],
  },
  {
    id: "room4",
    name: "Security Office",
    description:
      "Monitor screens show various camera feeds. The security system needs a 4-digit code.",
    unlocked: false,
    completed: false,
    challenges: [
      {
        id: "security-code",
        title: "Security System",
        description:
          "Enter the correct 4-digit security code to access the basement level.",
        answer: "7894",
        points: 250,
        completed: false,
        unlocked: true,
        hint: "The code is the reverse of the university founding year: 4987 becomes...",
        roomId: "room4",
      },
    ],
  },
  {
    id: "room5",
    name: "Hidden Basement",
    description:
      "A secret basement laboratory revealed! Professor Smith's final research is here.",
    unlocked: false,
    completed: false,
    challenges: [
      {
        id: "final-puzzle",
        title: "Professor's Location",
        description:
          "Piece together all clues to find where Professor Smith is hiding. Combine all previous answers.",
        answer: "SECRET BUNKER",
        points: 300,
        completed: false,
        unlocked: true,
        hint: "Think about where someone would hide their most important research",
        roomId: "room5",
      },
    ],
  },
];

const initialState: GameState = {
  playerName: "",
  score: 0,
  gameStarted: false,
  gameCompleted: false,
  currentRoom: "room1",
  rooms: initialRooms,
  clues: [],
  room1Progress: {
    zipClicked: false,
    attempts: 0,
    stickyNoteViewed: false,
    logViewed: false,
    zipUnlocked: false,
  },
  room2Progress: {
    started: false,
    solved: false,
    attempts: 0,
    correctShift: 0,
  },
};

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setPlayerName: (name: string) => set({ playerName: name }),

      startGame: () => set({ gameStarted: true }),

      setCurrentRoom: (roomId: string) => {
        const state = get();
        const room = state.rooms.find((r) => r.id === roomId);
        if (room && room.unlocked) {
          set({ currentRoom: roomId });
        }
      },

      submitAnswer: (challengeId: string, answer: string) => {
        const state = get();
        let challengeFound = null;
        let roomIndex = -1;
        let challengeIndex = -1;

        // Find the challenge in any room
        for (let i = 0; i < state.rooms.length; i++) {
          const room = state.rooms[i];
          const cIndex = room.challenges.findIndex((c) => c.id === challengeId);
          if (cIndex !== -1) {
            challengeFound = room.challenges[cIndex];
            roomIndex = i;
            challengeIndex = cIndex;
            break;
          }
        }

        if (!challengeFound || challengeFound.completed) return false;

        const isCorrect =
          answer.trim().toUpperCase() === challengeFound.answer.toUpperCase();

        if (isCorrect) {
          const newRooms = [...state.rooms];

          // Mark challenge as completed
          newRooms[roomIndex].challenges[challengeIndex].completed = true;

          // Check if room is completed (all challenges done)
          const roomCompleted = newRooms[roomIndex].challenges.every(
            (c) => c.completed
          );
          if (roomCompleted) {
            newRooms[roomIndex].completed = true;

            // Unlock next room
            if (roomIndex + 1 < newRooms.length) {
              newRooms[roomIndex + 1].unlocked = true;
            }
          }

          // Check if game is completed
          const gameCompleted = newRooms.every((room) => room.completed);

          set({
            rooms: newRooms,
            score: state.score + challengeFound.points,
            gameCompleted,
          });
        }

        return isCorrect;
      },

      addClue: (clue: Clue) => {
        const state = get();
        if (!state.clues.find((c) => c.id === clue.id)) {
          set({ clues: [...state.clues, clue] });
        }
      },

      resetGame: () =>
        set({
          ...initialState,
          rooms: initialRooms.map((room) => ({
            ...room,
            unlocked: room.id === "room1",
            completed: false,
            challenges: room.challenges.map((c) => ({
              ...c,
              completed: false,
            })),
          })),
        }),

      updateRoom1Progress: (progress: Partial<GameState["room1Progress"]>) => {
        const state = get();
        set({
          room1Progress: {
            ...state.room1Progress,
            ...progress,
          },
        });
      },

      updateRoom2Progress: (progress: Partial<GameState["room2Progress"]>) => {
        const state = get();
        set({
          room2Progress: {
            ...state.room2Progress,
            ...progress,
          },
        });
      },
    }),
    {
      name: "missing-professor-game",
    }
  )
);
