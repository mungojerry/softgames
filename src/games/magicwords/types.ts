export interface DialogueMessage {
  name: string;
  text: string;
}

export interface Emoji {
  name: string;
  url: string;
}

export interface Avatar {
  name: string;
  url: string;
  position: "left" | "right";
}

export interface DialogueData {
  dialogue: DialogueMessage[];
  emojies: Emoji[];
  avatars: Avatar[];
}
