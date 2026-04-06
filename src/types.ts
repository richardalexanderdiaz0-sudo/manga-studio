/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StoryStatus = 'ongoing' | 'completed';

export interface Story {
  id: string;
  title: string;
  description: string;
  cover_url: string;
  category: string;
  status: StoryStatus;
  author_name: string;
  views: number;
  likes: number;
  created_at: string;
}

export interface Chapter {
  id: string;
  story_id: string;
  chapter_number: number;
  title: string;
  content: string;
  created_at: string;
}

export interface UserLibraryItem {
  user_id: string;
  story_id: string;
  last_read_chapter_id: string;
  added_at: string;
}

export interface Comment {
  id: string;
  story_id: string;
  user_id: string;
  user_name: string;
  user_photo?: string;
  content: string;
  created_at: string;
  likes: number;
}

export interface Report {
  id: string;
  story_id: string;
  user_id: string;
  reason: string;
  created_at: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  is_read: boolean;
  created_at: string;
}
