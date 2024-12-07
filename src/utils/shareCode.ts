import { supabase, uploadFile, uploadText, getSharedItem } from './supabase';

export const generateShareCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

export const storeItem = async (code: string, item: any) => {
  try {
    if (item.type === 'file') {
      // Convert base64 to File object
      const response = await fetch(item.content);
      const blob = await response.blob();
      const file = new File([blob], item.name, { type: item.mimeType });
      await uploadFile(file, code);
    } else {
      await uploadText(item.content, code);
    }
  } catch (error) {
    console.error('Failed to store item:', error);
    throw error;
  }
};

export const retrieveItem = async (code: string) => {
  try {
    const item = await getSharedItem(code);
    if (!item) return null;
    return item;
  } catch (error) {
    console.error('Failed to retrieve item:', error);
    return null;
  }
};

export const removeItem = async (code: string) => {
  try {
    // Remove from shared_texts table
    await supabase
      .from('shared_texts')
      .delete()
      .eq('share_code', code);

    // Remove from storage
    const { data: files } = await supabase.storage
      .from('speedshare')
      .list(code);

    if (files && files.length > 0) {
      await supabase.storage
        .from('speedshare')
        .remove([`${code}/${files[0].name}`]);
    }
  } catch (error) {
    console.error('Failed to remove item:', error);
  }
};