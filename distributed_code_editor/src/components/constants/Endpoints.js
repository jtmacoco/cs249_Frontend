class EndPoint {
    static baseUrl = "http://localhost:8000/api/";
    static register = 'user/register';
    static login = 'user/login'
    static getFullUrl(endpoint) {
      return `${this.baseUrl}${endpoint}`;
    }
  }
  export default EndPoint;
  