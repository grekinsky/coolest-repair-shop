import firebase from 'firebase';
import { create } from 'axios';
import { ENV, getFbConfig } from '../config/constants';

class RepairsApi {
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
    this.getFirebase = this.getFirebase.bind(this);
    this.getFirebaseToken = this.getFirebaseToken.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.getRepairs = this.getRepairs.bind(this);
    this.addRepair = this.addRepair.bind(this);
    this.modifyRepair = this.modifyRepair.bind(this);
    this.deleteRepair = this.deleteRepair.bind(this);
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

  async addRepair(data) {
    const f = this.getFirebase();
    const request = {
      method: 'post',
      url: '/repairs.json',
      data: {
        description: data.description,
        status: 'created',
        timestamp: f.database.ServerValue.TIMESTAMP,
      },
    };
    try {
      const res = await this.instance(request);
      return res.data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async modifyRepair(data) {
    const request = {
      method: 'patch',
      url: `/repairs/${data.id}.json`,
      data: {
        description: data.description,
      },
    };
    try {
      const res = await this.instance(request);
      return res.data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteRepair(data) {
    const request = {
      method: 'delete',
      url: `/repairs/${data.id}.json`,
    };
    try {
      const res = await this.instance(request);
      return res.data;
    } catch (e) {
      throw new Error(e);
    }
  }
}

export default RepairsApi;
