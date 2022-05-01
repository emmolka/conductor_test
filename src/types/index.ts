export type Message = {
  message: string;
  id: string;
};

export type Topic = {
  name: string;
  id: string;
  spread: number;
  rf: number;
  particion: number;
  messages: Message[];
};

export interface TopicsTableProps {
  topics: Topic[];
  topicsLoading: boolean;
}

export interface ModalComponentProps {
  isOpened: boolean;
  onClose: () => void;
  topicId?: string;
  loading: boolean;
  topicTitle?: string;
  topicMessages: Message[];
}
