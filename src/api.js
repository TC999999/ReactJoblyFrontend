import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

const BASE_URL = import.meta.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class JoblyApi {
  // the token for interactive with the API will be stored here.
  static token = localStorage.getItem("jobly-token");

  static async request(endpoint, data = {}, method = "get") {
    console.log(BASE_URL);
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${this.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get details on all companies.  */

  static async getAllCompanies() {
    let res = await this.request(`companies`);
    return res.companies;
  }

  /** Get details on a company by handle. */

  static async getCompanyByHandle(handle) {
    let res = await this.request(`companies/${handle}`);
    return res.company;
  }

  /** Search for a company by search params. */

  static async searchCompany(searchParams) {
    let res = await this.request(`companies`, searchParams);
    return res.companies;
  }

  /** Get details on all jobs.  */

  static async getAllJobs() {
    let res = await this.request(`jobs`);
    return res.jobs;
  }

  /** Get details on a job by id. */

  static async getJobById(id) {
    let res = await this.request(`jobs/${id}`);
    return res.job;
  }

  /** Search for a job by search params. */

  static async searchJob(searchParams) {
    let res = await this.request(`jobs`, searchParams);
    return res.jobs;
  }

  /** Sign a new user up*/

  static async signUp(userInfo) {
    let res = await this.request("auth/register", userInfo, "post");
    this.token = res.token;
    return res.token;
  }

  /** Log a current user in*/

  static async logIn(userInfo) {
    let res = await this.request("auth/token", userInfo, "post");
    this.token = res.token;
    return res.token;
  }

  /** Get information on a single user */

  static async getUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Update information on a single user */

  static async updateUser(username, user) {
    let res = await this.request(`users/${username}`, user, "patch");
    return res.user;
  }

  /** Apply a user to a job */

  static async applyUserForJob(username, jobId) {
    let res = await this.request(`users/${username}/jobs/${jobId}`, {}, "post");
    return res;
  }

  // obviously, you'll add a lot here ...
}

export default JoblyApi;
