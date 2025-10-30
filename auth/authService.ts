/**
 * Authentication Service (Supabase)
 * Uses Supabase Auth directly from the browser client
 */

import { supabase } from '../supabaseClient';
import { User } from '../types';

const TOKEN_KEY = 'constructai_token';

/**
 * Login with email and password
 */
export const login = async (email: string, password: string): Promise<User> => {
    console.log('🔐 [AuthService] Login attempt:', email);

    if (!supabase) {
        throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        console.error('❌ [AuthService] Login failed:', error.message);
        throw new Error(error.message || 'Login failed');
    }

    const session = data.session;
    if (session?.access_token) {
        localStorage.setItem(TOKEN_KEY, session.access_token);
    }

    // Map Supabase user to app User type (fallbacks if profile table not joined here)
    const supaUser = data.user;
    const mappedUser: User = {
        id: supaUser?.id || 'unknown',
        email: supaUser?.email || email,
        name: supaUser?.user_metadata?.name || supaUser?.email || 'User',
        role: (supaUser?.user_metadata?.role as any) || 'company_admin'
    };

    console.log('✅ [AuthService] Login successful:', mappedUser.name);
    return mappedUser;
};

/**
 * Register new user
 */
export const register = async (
    email: string,
    password: string,
    name: string,
    companyName: string
): Promise<User> => {
    console.log('📝 [AuthService] Register attempt:', email);

    if (!supabase) {
        throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, companyName, role: 'company_admin' } }
    });
    if (error) {
        console.error('❌ [AuthService] Registration failed:', error.message);
        throw new Error(error.message || 'Registration failed');
    }

    const supaUser = data.user;
    const mappedUser: User = {
        id: supaUser?.id || 'unknown',
        email: supaUser?.email || email,
        name: name || supaUser?.email || 'User',
        role: 'company_admin'
    };

    console.log('✅ [AuthService] Registration successful:', mappedUser.name);
    return mappedUser;
};

/**
 * Clear all cookies
 */
const clearAllCookies = (): void => {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

        // Clear cookie for all paths and domains
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + window.location.hostname;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.' + window.location.hostname;
    }

    console.log('🍪 [AuthService] All cookies cleared');
};

/**
 * Logout current user
 */
export const logout = async (): Promise<void> => {
    console.log('👋 [AuthService] Logout - Clearing all session data');

    try {
        await supabase?.auth.signOut();
    } catch (error) {
        console.error('❌ [AuthService] Supabase signOut error:', error);
    } finally {
        localStorage.clear();
        sessionStorage.clear();
        clearAllCookies();
        window.dispatchEvent(new CustomEvent('userLoggedOut'));
        console.log('✅ [AuthService] All session data cleared (localStorage, sessionStorage, cookies)');
    }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<User | null> => {
    const { data } = await supabase?.auth.getUser() || { data: { user: null } };
    const u = data.user;
    if (!u) return null;

    return {
        id: u.id,
        email: u.email || '',
        name: (u.user_metadata?.name as string) || u.email || 'User',
        role: (u.user_metadata?.role as any) || 'company_admin'
    };
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
};

/**
 * Refresh session token
 */
export const refreshSession = async (): Promise<void> => {
    const { data, error } = await supabase?.auth.refreshSession() || { data: null, error: null };
    if (error) {
        console.error('Refresh session error:', error.message);
        localStorage.removeItem(TOKEN_KEY);
        return;
    }
    const token = data?.session?.access_token;
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        console.log('🔄 [AuthService] Session refreshed');
    }
};

/**
 * OAuth login (for future implementation)
 */
export const loginWithOAuth = async (provider: 'google' | 'github'): Promise<User> => {
    console.log(`🔐 [AuthService] OAuth login with ${provider}`);
    const { data, error } = await supabase?.auth.signInWithOAuth({ provider }) || { data: null, error: null };
    if (error) throw new Error(error.message);
    // Supabase will redirect; return a placeholder if needed
    return {
        id: data?.user?.id || 'redirecting',
        email: data?.user?.email || '',
        name: (data?.user?.user_metadata?.name as string) || 'User',
        role: (data?.user?.user_metadata?.role as any) || 'company_admin'
    };
};

/**
 * Refresh authentication token
 */
export const refreshToken = async (): Promise<string> => {
    console.log('🔄 [AuthService] Refreshing token');
    const { data, error } = await supabase?.auth.refreshSession() || { data: null, error: null };
    if (error || !data?.session?.access_token) {
        console.error('❌ [AuthService] Token refresh failed:', error?.message || 'No session');
        localStorage.removeItem(TOKEN_KEY);
        throw new Error(error?.message || 'Token refresh failed');
    }
    const newToken = data.session.access_token;
    localStorage.setItem(TOKEN_KEY, newToken);
    console.log('✅ [AuthService] Token refreshed successfully');
    return newToken;
};

/**
 * Get developer modules
 */
export const getDeveloperModules = async (): Promise<any> => {
    // No backend endpoint; return mock data
    return { modules: [] };
};

/**
 * Get API keys
 */
export const getApiKeys = async (): Promise<any> => {
    return { keys: [] };
};

/**
 * Get webhooks
 */
export const getWebhooks = async (): Promise<any> => {
    return { webhooks: [] };
};

