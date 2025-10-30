/**
 * Real-time WebSocket Service for CortexBuild
 * Handles real-time updates for notifications, tasks, and project changes
 */

import { supabase } from '../supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

type RealtimeCallback = (payload: any) => void;

export class RealtimeService {
    private channels: Map<string, RealtimeChannel> = new Map();
    private subscriptions: Map<string, RealtimeCallback[]> = new Map();

    /**
     * Subscribe to real-time notifications for a user
     */
    subscribeToNotifications(userId: string, callback: RealtimeCallback): () => void {
        if (!supabase) {
            console.warn('Supabase not initialized - real-time notifications disabled');
            return () => {};
        }

        const channelName = `notifications:${userId}`;
        
        // Get or create channel
        let channel = this.channels.get(channelName);
        if (!channel) {
            channel = supabase
                .channel(channelName)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${userId}`
                    },
                    callback
                )
                .subscribe();
            
            this.channels.set(channelName, channel);
        }

        // Add callback to subscriptions
        if (!this.subscriptions.has(channelName)) {
            this.subscriptions.set(channelName, []);
        }
        this.subscriptions.get(channelName)!.push(callback);

        // Return unsubscribe function
        return () => {
            const callbacks = this.subscriptions.get(channelName);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }

                // Clean up channel if no more callbacks
                if (callbacks.length === 0) {
                    channel?.unsubscribe();
                    this.channels.delete(channelName);
                    this.subscriptions.delete(channelName);
                }
            }
        };
    }

    /**
     * Subscribe to real-time task updates for a project
     */
    subscribeToProjectTasks(projectId: string, callback: RealtimeCallback): () => void {
        if (!supabase) {
            console.warn('Supabase not initialized - real-time tasks disabled');
            return () => {};
        }

        const channelName = `tasks:${projectId}`;
        
        let channel = this.channels.get(channelName);
        if (!channel) {
            channel = supabase
                .channel(channelName)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'tasks',
                        filter: `project_id=eq.${projectId}`
                    },
                    callback
                )
                .subscribe();
            
            this.channels.set(channelName, channel);
        }

        if (!this.subscriptions.has(channelName)) {
            this.subscriptions.set(channelName, []);
        }
        this.subscriptions.get(channelName)!.push(callback);

        return () => {
            const callbacks = this.subscriptions.get(channelName);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }

                if (callbacks.length === 0) {
                    channel?.unsubscribe();
                    this.channels.delete(channelName);
                    this.subscriptions.delete(channelName);
                }
            }
        };
    }

    /**
     * Subscribe to real-time project updates
     */
    subscribeToProject(projectId: string, callback: RealtimeCallback): () => void {
        if (!supabase) {
            console.warn('Supabase not initialized - real-time project updates disabled');
            return () => {};
        }

        const channelName = `project:${projectId}`;
        
        let channel = this.channels.get(channelName);
        if (!channel) {
            channel = supabase
                .channel(channelName)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'projects',
                        filter: `id=eq.${projectId}`
                    },
                    callback
                )
                .subscribe();
            
            this.channels.set(channelName, channel);
        }

        if (!this.subscriptions.has(channelName)) {
            this.subscriptions.set(channelName, []);
        }
        this.subscriptions.get(channelName)!.push(callback);

        return () => {
            const callbacks = this.subscriptions.get(channelName);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }

                if (callbacks.length === 0) {
                    channel?.unsubscribe();
                    this.channels.delete(channelName);
                    this.subscriptions.delete(channelName);
                }
            }
        };
    }

    /**
     * Subscribe to user presence (who's online)
     */
    subscribeToPresence(channel: string, callback: RealtimeCallback): () => void {
        if (!supabase) {
            console.warn('Supabase not initialized - presence disabled');
            return () => {};
        }

        const channelName = `presence:${channel}`;
        
        let presenceChannel = this.channels.get(channelName);
        if (!presenceChannel) {
            presenceChannel = supabase
                .channel(channelName)
                .on('presence', { event: 'sync' }, callback)
                .on('presence', { event: 'join' }, callback)
                .on('presence', { event: 'leave' }, callback)
                .subscribe();
            
            this.channels.set(channelName, presenceChannel);
        }

        if (!this.subscriptions.has(channelName)) {
            this.subscriptions.set(channelName, []);
        }
        this.subscriptions.get(channelName)!.push(callback);

        return () => {
            const callbacks = this.subscriptions.get(channelName);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }

                if (callbacks.length === 0) {
                    presenceChannel?.unsubscribe();
                    this.channels.delete(channelName);
                    this.subscriptions.delete(channelName);
                }
            }
        };
    }

    /**
     * Track user presence in a channel
     */
    trackPresence(channel: string, userId: string, userData: any): Promise<void> {
        if (!supabase) {
            console.warn('Supabase not initialized - presence tracking disabled');
            return Promise.resolve();
        }

        const channelName = `presence:${channel}`;
        
        let presenceChannel = this.channels.get(channelName);
        if (!presenceChannel) {
            presenceChannel = supabase.channel(channelName);
            this.channels.set(channelName, presenceChannel);
        }

        return presenceChannel
            .track({ user_id: userId, ...userData })
            .then(() => {});
    }

    /**
     * Untrack user presence
     */
    untrackPresence(channel: string): Promise<void> {
        const channelName = `presence:${channel}`;
        const presenceChannel = this.channels.get(channelName);
        
        if (presenceChannel) {
            return presenceChannel.untrack().then(() => {});
        }
        
        return Promise.resolve();
    }

    /**
     * Broadcast a message to all subscribers of a channel
     */
    broadcast(channel: string, event: string, payload: any): void {
        if (!supabase) {
            console.warn('Supabase not initialized - broadcast disabled');
            return;
        }

        const channelName = `broadcast:${channel}`;
        
        let broadcastChannel = this.channels.get(channelName);
        if (!broadcastChannel) {
            broadcastChannel = supabase.channel(channelName);
            this.channels.set(channelName, broadcastChannel);
        }

        broadcastChannel.send({
            type: 'broadcast',
            event,
            payload
        });
    }

    /**
     * Subscribe to broadcast messages
     */
    subscribeToBroadcast(channel: string, event: string, callback: RealtimeCallback): () => void {
        if (!supabase) {
            console.warn('Supabase not initialized - broadcast subscription disabled');
            return () => {};
        }

        const channelName = `broadcast:${channel}`;
        
        let broadcastChannel = this.channels.get(channelName);
        if (!broadcastChannel) {
            broadcastChannel = supabase
                .channel(channelName)
                .on('broadcast', { event }, callback)
                .subscribe();
            
            this.channels.set(channelName, broadcastChannel);
        }

        if (!this.subscriptions.has(channelName)) {
            this.subscriptions.set(channelName, []);
        }
        this.subscriptions.get(channelName)!.push(callback);

        return () => {
            const callbacks = this.subscriptions.get(channelName);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }

                if (callbacks.length === 0) {
                    broadcastChannel?.unsubscribe();
                    this.channels.delete(channelName);
                    this.subscriptions.delete(channelName);
                }
            }
        };
    }

    /**
     * Unsubscribe from all channels
     */
    unsubscribeAll(): void {
        this.channels.forEach((channel) => {
            channel.unsubscribe();
        });
        this.channels.clear();
        this.subscriptions.clear();
    }

    /**
     * Get the status of a channel
     */
    getChannelStatus(channelName: string): string | null {
        const channel = this.channels.get(channelName);
        return channel ? channel.state : null;
    }
}

// Export singleton instance
export const realtimeService = new RealtimeService();

// Export types
export type { RealtimeCallback };

