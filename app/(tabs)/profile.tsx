import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Alert, ScrollView, Modal } from 'react-native';
import { Button, Avatar, Input } from '@rneui/themed';
import { supabase } from '../lib/supabase';
import { getUserProfile, updateUserProfile } from '../lib/profileService';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
}

interface EditForm {
  fullName: string;
  bio: string;
  avatarUrl: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<EditForm>({
    fullName: '',
    bio: '',
    avatarUrl: ''
  });
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    getUser();
    getProfile();
  }, []);

  async function getUser(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

  async function getProfile(): Promise<void> {
    const { data, error } = await getUserProfile();
    if (data) {
      setProfile(data);
      setEditForm({
        fullName: data.full_name || '',
        bio: data.bio || '',
        avatarUrl: data.avatar_url || ''
      });
    }
  }

  async function handleSaveProfile(): Promise<void> {
    setSaving(true);
    try {
      const { error } = await updateUserProfile(editForm);
      if (error) throw error;
      
      Alert.alert('Berhasil', 'Profile berhasil diperbarui');
      setEditModalVisible(false);
      getProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Gagal memperbarui profile');
    } finally {
      setSaving(false);
    }
  }

  async function signOut(): Promise<void> {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert('Error', error.message);
    setLoading(false);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Avatar
          size={100}
          rounded
          source={profile?.avatar_url ? { uri: profile.avatar_url } : undefined}
          icon={!profile?.avatar_url ? { name: 'user', type: 'font-awesome' } : undefined}
          containerStyle={styles.avatar}
        />
        
        <Text style={styles.name}>
          {profile?.full_name || 'Nama belum diatur'}
        </Text>
        
        <Text style={styles.email}>{user?.email}</Text>
        
        {profile?.bio && (
          <Text style={styles.bio}>{profile.bio}</Text>
        )}
        
        <View style={styles.buttonContainer}>
          <Button
            title="Edit Profile"
            onPress={() => setEditModalVisible(true)}
            buttonStyle={styles.editButton}
          />
          
          <Button
            title="Sign Out"
            onPress={signOut}
            loading={loading}
            buttonStyle={styles.signOutButton}
          />
        </View>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Button
              title="Batal"
              type="clear"
              onPress={() => setEditModalVisible(false)}
            />
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <Button
              title="Simpan"
              type="clear"
              onPress={handleSaveProfile}
              loading={saving}
            />
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Input
              label="Nama Lengkap"
              value={editForm.fullName}
              onChangeText={(text) => setEditForm({...editForm, fullName: text})}
              placeholder="Masukkan nama lengkap"
            />
            
            <Input
              label="Bio"
              value={editForm.bio}
              onChangeText={(text) => setEditForm({...editForm, bio: text})}
              placeholder="Ceritakan tentang diri Anda"
              multiline
              numberOfLines={3}
            />
            
            <Input
              label="URL Avatar"
              value={editForm.avatarUrl}
              onChangeText={(text) => setEditForm({...editForm, avatarUrl: text})}
              placeholder="https://example.com/avatar.jpg"
            />
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    backgroundColor: '#2089dc',
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
  },
  editButton: {
    backgroundColor: '#46AA71',
    marginBottom: 10,
  },
  signOutButton: {
    backgroundColor: '#dc3545',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
});