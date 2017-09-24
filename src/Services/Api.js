import firebase from 'firebase';
import { create } from 'axios';
import { ENV, getFbConfig } from '../config/constants';

export default class RepairsApi {
  constructor(options) {
    this.instance = create({
      baseURL: 'https://toptal-react-academy.firebaseio.com',
    });
    this.instance.interceptors.request.use(async (request) => {
      try {
        const token = await this.getFirebaseToken();
        request.params = Object.assign({}, request.params, {
          auth: token,
        });
        request.headers = Object.assign({}, request.params, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Headers': '*',
        });
      } catch (e) {
        throw new Error(e);
      }
      return request;
    });
    this.config = (options && options.config) || getFbConfig(ENV);
    this.firebase = (options && options.fb) || this.getFirebase();
  }
  getFirebase() {
    if (this.firebase) return this.firebase;
    // If already initialized globally, return instance
    if (firebase.apps.length) return firebase;
    // Initialize Firebase
    this.firebase = firebase.initializeApp(this.config);
    return this.firebase;
  }
  async getFirebaseToken() {
    const f = this.getFirebase();
    try {
      if (!f.auth().currentUser) throw new Error('No user is currently logged in.');
      const idToken = await f.auth().currentUser.getIdToken(true);
      return idToken;
    } catch (e) {
      throw new Error(e);
    }
  }
  async login(email, password) {
    const f = this.getFirebase();
    const res = await f.auth().signInWithEmailAndPassword(email, password);
    return res;
  }
  async createUser(email, password) {
    const f = this.getFirebase();
    const res = await f.auth().createUserWithEmailAndPassword(email, password);
    return res;
  }


  async getUsers() {
    const request = {
      method: 'get',
      url: '/users.json',
    };
    try {
      const res = await this.instance(request);
      return res.data;
    } catch (e) {
      throw new Error(e);
    }
  }
  async getUser(id) {
    const request = {
      method: 'get',
      url: `/users/${id}.json`,
    };
    try {
      const res = await this.instance(request);
      return res.data;
    } catch (e) {
      throw new Error(e);
    }
  }
  async modifyUser(id, data) {
    const request = {
      method: 'patch',
      url: `/users/${id}.json`,
      data,
    };
    try {
      const res = await this.instance(request);
      return res.data;
    } catch (e) {
      throw new Error(e);
    }
  }
  async removeUser(id) {
    const request = {
      method: 'delete',
      url: `/users/${id}.json`,
    };
    try {
      const res = await this.instance(request);
      return res.data;
    } catch (e) {
      throw new Error(e);
    }
  }


  async getRepairs() {
    const request = {
      method: 'get',
      url: '/repairs.json',
    };
    try {
      const res = await this.instance(request);
      return res.data;
    } catch (e) {
      throw new Error(e);
    }
  }
  async getRepair(id) {
    const request = {
      method: 'get',
      url: `/repairs/${id}.json`,
    };
    try {
      const res = await this.instance(request);
      return res.data;
    } catch (e) {
      throw new Error(e);
    }
  }
  async modifyRepair(id, data) {
    const request = {
      method: 'patch',
      url: `/repairs/${id}.json`,
      data,
    };
    try {
      const res = await this.instance(request);
      return res.data;
    } catch (e) {
      throw new Error(e);
    }
  }
  async removeRepair(id) {
    const request = {
      method: 'delete',
      url: `/repairs/${id}.json`,
    };
    try {
      const res = await this.instance(request);
      return res.data;
    } catch (e) {
      throw new Error(e);
    }
  }
}
