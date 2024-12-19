import { supabase } from './index';
import { handleTryCatch } from '@/utils/errorHandling';

interface InstallCount {
  total_installs: number;
  last_updated: string;
}

export const incrementInstallCount = async () => {
  return handleTryCatch(async () => {
    const { data, error } = await supabase.rpc('increment_pwa_installs');
    
    if (error) {
      throw error;
    }

    return data as InstallCount;
  });
};

export const getCurrentInstallCount = async () => {
  return handleTryCatch(async () => {
    const { data, error } = await supabase
      .from('pwa_install_stats')
      .select('total_installs')
      .single();
    
    if (error) {
      throw error;
    }

    return data as InstallCount;
  });
};