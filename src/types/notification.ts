export type Notification = {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: Date;
  sender: {
    name: string;
    photo: string | null;
  };
  related_entity?: string;
  related_entity_id?: number;
};
