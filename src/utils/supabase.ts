import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hxdbvzzvrazummsadgsu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4ZGJ2enp2cmF6dW1tc2FkZ3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1ODY1MDMsImV4cCI6MjA0OTE2MjUwM30.zOO7sh2qeeTZeRjIPpx9dd5rmBh7DQyFLh8v9zc6qNU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const uploadFile = async (file: File, shareCode: string) => {
  try {
    // First, ensure the bucket policy allows this upload
    const { data: bucketData, error: bucketError } = await supabase.storage
      .from('speedshare')
      .upload(`${shareCode}/${file.name}`, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (bucketError) throw bucketError;

    // Create a record in shared_files table to track the file
    const { error: recordError } = await supabase
      .from('shared_files')
      .insert([{
        share_code: shareCode,
        file_name: file.name,
        file_path: `${shareCode}/${file.name}`,
        mime_type: file.type
      }]);

    if (recordError) throw recordError;

    return bucketData;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const uploadText = async (text: string, shareCode: string) => {
  try {
    const { data, error } = await supabase
      .from('shared_texts')
      .insert([{
        share_code: shareCode,
        content: text,
        created_at: new Date().toISOString()
      }]);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Text upload error:', error);
    throw error;
  }
};

export const getSharedItem = async (shareCode: string) => {
  try {
    // First check for text
    const { data: textData, error: textError } = await supabase
      .from('shared_texts')
      .select('*')
      .eq('share_code', shareCode)
      .single();

    if (textError && textError.code !== 'PGRST116') {
      throw textError;
    }

    if (textData) {
      return { 
        type: 'text', 
        content: textData.content,
        created_at: textData.created_at
      };
    }

    // If no text found, check for file
    const { data: fileData, error: fileError } = await supabase
      .from('shared_files')
      .select('*')
      .eq('share_code', shareCode)
      .single();

    if (fileError && fileError.code !== 'PGRST116') {
      throw fileError;
    }

    if (fileData) {
      const { data: fileUrl } = await supabase.storage
        .from('speedshare')
        .createSignedUrl(fileData.file_path, 3600);

      return {
        type: 'file',
        name: fileData.file_name,
        url: fileUrl?.signedUrl,
        mime_type: fileData.mime_type,
        created_at: fileData.created_at
      };
    }

    return null;
  } catch (error) {
    console.error('Retrieval error:', error);
    throw error;
  }
};

export const removeExpiredItems = async () => {
  const expiryTime = new Date();
  expiryTime.setHours(expiryTime.getHours() - 24); // 24 hours ago

  try {
    // Remove expired texts
    await supabase
      .from('shared_texts')
      .delete()
      .lt('created_at', expiryTime.toISOString());

    // Remove expired files
    const { data: expiredFiles } = await supabase
      .from('shared_files')
      .select('file_path')
      .lt('created_at', expiryTime.toISOString());

    if (expiredFiles && expiredFiles.length > 0) {
      const filePaths = expiredFiles.map(f => f.file_path);
      
      // Remove from storage
      await supabase.storage
        .from('speedshare')
        .remove(filePaths);

      // Remove records
      await supabase
        .from('shared_files')
        .delete()
        .lt('created_at', expiryTime.toISOString());
    }
  } catch (error) {
    console.error('Error cleaning up expired items:', error);
  }
};

// Run cleanup every hour
setInterval(removeExpiredItems, 60 * 60 * 1000);