/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from '@/src/supabase';
import { Story, Chapter, Comment, Report, UserLibraryItem, AppNotification } from '@/src/types';

// Stories
export const getStories = async (filters?: { status?: string; category?: string; limit?: number }) => {
  try {
    let query = supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.limit) query = query.limit(filters.limit);
    
    const { data, error } = await query;
    if (error) throw error;
    return data as Story[];
  } catch (error) {
    console.error('Supabase Error (getStories):', error);
    throw error;
  }
};

export const getStoryById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Story;
  } catch (error) {
    console.error('Supabase Error (getStoryById):', error);
    return null;
  }
};

export const createStory = async (story: Omit<Story, 'id' | 'views' | 'createdAt'>) => {
  try {
    const newStory = {
      ...story,
      views: 0,
      created_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('stories')
      .insert([newStory])
      .select()
      .single();
    if (error) throw error;
    return data as Story;
  } catch (error) {
    console.error('Supabase Error (createStory):', error);
    throw error;
  }
};

export const updateStory = async (id: string, updates: Partial<Story>) => {
  try {
    const { data, error } = await supabase
      .from('stories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Story;
  } catch (error) {
    console.error('Supabase Error (updateStory):', error);
    throw error;
  }
};

export const deleteStory = async (id: string) => {
  try {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.error('Supabase Error (deleteStory):', error);
    throw error;
  }
};

// Chapters
export const getChapters = async (storyId: string) => {
  try {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('story_id', storyId)
      .order('chapter_number', { ascending: true });
    if (error) throw error;
    return data as Chapter[];
  } catch (error) {
    console.error('Supabase Error (getChapters):', error);
    throw error;
  }
};

export const createChapter = async (chapter: Omit<Chapter, 'id' | 'created_at'>) => {
  try {
    const newChapter = {
      ...chapter,
      created_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('chapters')
      .insert([newChapter])
      .select()
      .single();
    if (error) throw error;
    return data as Chapter;
  } catch (error) {
    console.error('Supabase Error (createChapter):', error);
    throw error;
  }
};

export const updateChapter = async (id: string, updates: Partial<Chapter>) => {
  try {
    const { data, error } = await supabase
      .from('chapters')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Chapter;
  } catch (error) {
    console.error('Supabase Error (updateChapter):', error);
    throw error;
  }
};

export const deleteChapter = async (id: string) => {
  try {
    const { error } = await supabase
      .from('chapters')
      .delete()
      .eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.error('Supabase Error (deleteChapter):', error);
    throw error;
  }
};

// Library
export const addToLibrary = async (userId: string, storyId: string) => {
  try {
    const item = {
      user_id: userId,
      story_id: storyId,
      added_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from('library')
      .upsert([item], { onConflict: 'user_id,story_id' });
    if (error) throw error;
  } catch (error) {
    console.error('Supabase Error (addToLibrary):', error);
    throw error;
  }
};

export const getLibraryUsers = async (storyId: string) => {
  try {
    const { data, error } = await supabase
      .from('library')
      .select('user_id')
      .eq('story_id', storyId);
    if (error) throw error;
    return data.map(d => d.user_id);
  } catch (error) {
    console.error('Supabase Error (getLibraryUsers):', error);
    return [];
  }
};

// Notifications
export const createNotification = async (notification: Omit<AppNotification, 'id' | 'created_at' | 'is_read'>) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert([{ ...notification, is_read: false, created_at: new Date().toISOString() }]);
    if (error) throw error;
  } catch (error) {
    console.error('Supabase Error (createNotification):', error);
  }
};

export const getNotifications = (userId: string, callback: (notifications: AppNotification[]) => void) => {
  const subscription = supabase
    .channel(`notifications:${userId}`)
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'notifications',
      filter: `user_id=eq.${userId}`
    }, async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (data) callback(data as AppNotification[]);
    })
    .subscribe();

  supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .then(({ data }) => {
      if (data) callback(data as AppNotification[]);
    });

  return () => {
    supabase.removeChannel(subscription);
  };
};

export const markNotificationAsRead = async (id: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.error('Supabase Error (markNotificationAsRead):', error);
  }
};

export const getLibrary = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('userLibrary')
      .select('*')
      .eq('user_id', userId)
      .order('added_at', { ascending: false });
    if (error) throw error;
    return data as UserLibraryItem[];
  } catch (error) {
    console.error('Supabase Error (getLibrary):', error);
    throw error;
  }
};

// Comments
export const getComments = (storyId: string, callback: (comments: Comment[]) => void) => {
  const subscription = supabase
    .channel(`comments:${storyId}`)
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'comments',
      filter: `story_id=eq.${storyId}`
    }, async () => {
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('story_id', storyId)
        .order('created_at', { ascending: false });
      if (data) callback(data as Comment[]);
    })
    .subscribe();

  supabase
    .from('comments')
    .select('*')
    .eq('story_id', storyId)
    .order('created_at', { ascending: false })
    .then(({ data }) => {
      if (data) callback(data as Comment[]);
    });

  return () => {
    supabase.removeChannel(subscription);
  };
};

export const addComment = async (comment: Omit<Comment, 'id' | 'created_at'>) => {
  try {
    const newComment = {
      ...comment,
      created_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from('comments')
      .insert([newComment]);
    if (error) throw error;
  } catch (error) {
    console.error('Supabase Error (addComment):', error);
    throw error;
  }
};

// Reports
export const addReport = async (report: Omit<Report, 'id' | 'created_at'>) => {
  try {
    const newReport = {
      ...report,
      created_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from('reports')
      .insert([newReport]);
    if (error) throw error;
  } catch (error) {
    console.error('Supabase Error (addReport):', error);
    throw error;
  }
};

// User Data Cleanup
export const deleteUserData = async (userId: string) => {
  try {
    // Delete from userLibrary
    await supabase.from('userLibrary').delete().eq('user_id', userId);
    // Delete from notifications
    await supabase.from('notifications').delete().eq('user_id', userId);
    // Delete from comments
    await supabase.from('comments').delete().eq('user_id', userId);
  } catch (error) {
    console.error('Supabase Error (deleteUserData):', error);
  }
};
