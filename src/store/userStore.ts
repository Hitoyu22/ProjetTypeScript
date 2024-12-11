import axios from 'axios';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '', 
    username: localStorage.getItem('username') || '',
    bio: localStorage.getItem('bio') || '',
    image: localStorage.getItem('image') || '',
    email: localStorage.getItem('email') || '',
  }),
  actions: {
    setUser(token: string, username: string, picture: string, email: string, bio: string) {
      this.token = token;
      this.username = username;
      this.image = picture;
      this.email = email;
      this.bio = bio;
      localStorage.setItem('token', token); 
      localStorage.setItem('username', username);
      localStorage.setItem('picture', picture);
      localStorage.setItem('email', email);
      localStorage.setItem('bio', bio);
    },

    logout() {
      this.token = '';
      this.username = '';
      this.bio = '';
      this.image = '';
      this.email = '';
      localStorage.removeItem('token'); 
      localStorage.removeItem('username');
      localStorage.removeItem('bio');
      localStorage.removeItem('picture');
      localStorage.removeItem('email');
      localStorage.removeItem('tagsList');
    },

    async fetchUserData() {
      try {
        const response = await axios.get('https://realword-api.nouwillcode.com/api/user', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        const data = response.data;
        if (data.user) {
          this.username = data.user.username;
          this.email = data.user.email;
          this.bio = data.user.bio;
          this.image = data.user.image;
          localStorage.setItem('username', data.user.username);
          localStorage.setItem('email', data.user.email);
          localStorage.setItem('bio', data.user.bio);
          localStorage.setItem('picture', data.user.image);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données de l\'utilisateur:', error);
      }
    },

    async updateUser(updatedData: { email: string, username: string, bio: string, image: string }) {
      try {
        const response = await axios.put('https://realword-api.nouwillcode.com/api/user', {
          user: {
            email: updatedData.email,
            username: updatedData.username,
            bio: updatedData.bio,
            image: updatedData.image,
          }
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
        });

        const data = response.data;
        if (data.user) {
          this.setUser(data.user.token, data.user.username, data.user.image, data.user.email, data.user.bio);
          alert('Informations mises à jour avec succès!');
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour des informations:', error);
      }
    },

    async login(email: string, password: string) {
      try {
        const response = await axios.post(
          'https://realword-api.nouwillcode.com/api/users/login',
          {
            user: {
              email,
              password,
            },
          }
        );

        if (response.status === 201 && response.data.user) {
          const { token, username, image, bio } = response.data.user;

          this.setUser(token, username, image, email, bio);

          return { success: true, message: 'Connexion réussie' };
        } else {
          return { success: false, message: 'Échec de la connexion' };
        }
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return { success: false, message: 'Erreur lors de la connexion' };
      }
    },

    async register(email: string, username: string, password: string) {
      try {
        const response = await axios.post(
          'https://realword-api.nouwillcode.com/api/users',
          {
            user: {
              email,
              username,
              password,
              bio: 'Bographie temportaire',
              image: 'https://example.com/default-profile.jpg', 
            },
          }
        );

        if (response.status === 201 && response.data.user) {
          const { token, username, image, bio } = response.data.user;
          
          this.setUser(token, username, image, email, bio);

          return { success: true, message: 'Inscription réussie' };
        } else {
          return { success: false, message: 'Échec de l\'inscription' };
        }
      } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        return { success: false, message: 'Erreur lors de l\'inscription' };
      }
    },

    async followUser(username: string) {
      try {
        const response = await axios.post(
          `https://realword-api.nouwillcode.com/api/profiles/${username}/follow`,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

        if (response.status === 200) {
          alert(`Vous suivez maintenant ${username}`);
        }
      } catch (error) {
        if (error) {
          console.error('Utilisateur non trouvé');
          alert('Utilisateur non trouvé');
        } else {
          console.error('Erreur lors du suivi de l\'utilisateur:', error);
          alert('Erreur lors du suivi de l\'utilisateur');
        }
      }
    },

    async checkFollowing(username: string) {
      try {
        const response = await axios.get(
          `https://realword-api.nouwillcode.com/api/profiles/${username}`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

        if (response.status === 200 && response.data.profile) {
          console.log('Vous suivez cet utilisateur:', response.data.profile.following);
          return response.data.profile.following;
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du suivi:', error);
        return false; 
      }
    },
    

    async unfollowUser(username: string) {
      try {
        const response = await axios.delete(
          `https://realword-api.nouwillcode.com/api/profiles/${username}/follow`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

        if (response.status === 200) {
          alert(`Vous ne suivez plus ${username}`);
        }
      } catch (error) {
        if (error) {
          console.error('Utilisateur non trouvé');
          alert('Utilisateur non trouvé');
        } else {
          console.error('Erreur lors de l\'arrêt du suivi de l\'utilisateur:', error);
          alert('Erreur lors de l\'arrêt du suivi de l\'utilisateur');
        }
      }
    },
  },
});
