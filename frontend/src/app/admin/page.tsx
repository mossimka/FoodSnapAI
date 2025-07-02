'use client';

import React, { useState, useEffect } from 'react';
import styles from './admin.module.css';
import axios from '@/lib/axios';
import { useAuthStore } from '@/stores/authStore';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [stats, setStats] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState('');
  const [deleteRecipeId, setDeleteRecipeId] = useState('');
  const [adminUserId, setAdminUserId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { token } = useAuthStore();

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Load users
      const usersResponse = await axios.get('/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsers(usersResponse.data.users || []);

      // Load recipes
      const recipesResponse = await axios.get('/admin/recipes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setRecipes(recipesResponse.data.recipes || []);

      // Load stats
      const statsResponse = await axios.get('/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStats(statsResponse.data.stats);
      
    } catch (error) {
      setMessage(`Error loading data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  const deleteUser = async () => {
    if (!deleteUserId) return;
    
    setLoading(true);
    try {
      await axios.delete(`/admin/users/${deleteUserId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessage(`User ${deleteUserId} deleted successfully`);
      setDeleteUserId('');
      loadAllData();
    } catch (error: unknown) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Failed to delete user'}`);
    }
    setLoading(false);
  };

  const deleteRecipe = async () => {
    if (!deleteRecipeId) return;
    
    setLoading(true);
    try {
      await axios.delete(`/admin/recipes/${deleteRecipeId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessage(`Recipe ${deleteRecipeId} deleted successfully`);
      setDeleteRecipeId('');
      loadAllData();
    } catch (error: unknown) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Failed to delete recipe'}`);
    }
    setLoading(false);
  };

  const toggleAdminRights = async () => {
    if (!adminUserId) return;
    
    setLoading(true);
    try {
      const response = await axios.patch(`/admin/users/${adminUserId}/admin`, 
        { is_admin: isAdmin },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      setAdminUserId('');
      loadAllData();
    } catch (error: unknown) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Failed to toggle admin rights'}`);
    }
    setLoading(false);
  };

  return (
    <div className={styles.adminContainer}>
      <h1>Admin Panel</h1>
      
      {loading && <div className={styles.loading}>Loading...</div>}
      {message && <div className={styles.message}>{message}</div>}

      {/* Actions Section */}
      <div className={styles.actionsSection}>
        <h2>Actions</h2>
        
        <div className={styles.actionGroup}>
          <h3>Delete User</h3>
          <input
            type="number"
            placeholder="User ID"
            value={deleteUserId}
            onChange={(e) => setDeleteUserId(e.target.value)}
            className={styles.input}
          />
          <button onClick={deleteUser} className={styles.deleteButton}>
            Delete User
          </button>
        </div>

        <div className={styles.actionGroup}>
          <h3>Delete Recipe</h3>
          <input
            type="number"
            placeholder="Recipe ID"
            value={deleteRecipeId}
            onChange={(e) => setDeleteRecipeId(e.target.value)}
            className={styles.input}
          />
          <button onClick={deleteRecipe} className={styles.deleteButton}>
            Delete Recipe
          </button>
        </div>

        <div className={styles.actionGroup}>
          <h3>Toggle Admin Rights</h3>
          <input
            type="number"
            placeholder="User ID"
            value={adminUserId}
            onChange={(e) => setAdminUserId(e.target.value)}
            className={styles.input}
          />
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            Make Admin
          </label>
          <button onClick={toggleAdminRights} className={styles.actionButton}>
            Toggle Admin Rights
          </button>
        </div>

        <div className={styles.actionGroup}>
          <button onClick={loadAllData} className={styles.refreshButton}>
            Refresh All Data
          </button>
        </div>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className={styles.section}>
          <h2>Statistics</h2>
          <pre className={styles.jsonBlock}>
            {JSON.stringify(stats, null, 2)}
          </pre>
        </div>
      )}

      {/* Users Section */}
      <div className={styles.section}>
        <h2>Users ({users.length})</h2>
        <pre className={styles.jsonBlock}>
          {JSON.stringify(users, null, 2)}
        </pre>
      </div>

      {/* Recipes Section */}
      <div className={styles.section}>
        <h2>Recipes ({recipes.length})</h2>
        <pre className={styles.jsonBlock}>
          {JSON.stringify(recipes, null, 2)}
        </pre>
      </div>
    </div>
  );
}
