// Re-export shared types for convenience
export type {
  ApiResponse,
  User,
  UserCreateInput,
  UserUpdateInput,
  UserResponse,
  ERROR_CODES,
  ERROR_MESSAGES,
  ErrorCode,
  ErrorMessage,
  TimerStatus,
  TimerConfig,
  TimerSession,
} from '@restion/shared';

export interface FocusSession {
  id: number;
  user_id: number;
  project_id?: number;
  focus_duration: number; // 分鐘
  rest_ratio: number; // 休息比例
  actual_focus_time: number; // 實際專注時間（秒）
  actual_rest_time: number; // 實際休息時間（秒）
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  started_at: Date;
  completed_at?: Date;
  created_at: Date;
}

export interface UserSettings {
  id: number;
  user_id: number;
  default_focus_duration: number; // 預設專注時間（分鐘）
  default_rest_ratio: number; // 預設休息比例
  reminder_interval: number; // 提醒間隔（分鐘，0=關閉）
  background_music_enabled: boolean;
  background_image_enabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: 'zh' | 'en';
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  team_id?: number;
  owner_id: number;
  status: 'active' | 'completed' | 'archived';
  created_at: Date;
  updated_at: Date;
}

export interface MediaFile {
  id: number;
  user_id: number;
  filename: string;
  original_name: string;
  file_type: 'audio' | 'image';
  file_size: number;
  mime_type: string;
  file_path: string;
  created_at: Date;
}
